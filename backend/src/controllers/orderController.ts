import { Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AuthenticatedRequest } from '../types';
import { dataStore } from '../services/dataStore';
import { PaymentService } from '../services/paymentService';

export class OrderController {
  public static async createOrder(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const { items, deliveryAddress, contactPhone, paymentMode = 'PHONEPE_MOCK' } = req.body;

      if (!items || !items.length) {
        res.status(400).json({ success: false, message: 'Order must contain at least one item.' });
        return;
      }

      if (!deliveryAddress || !contactPhone) {
        res.status(400).json({ success: false, message: 'Delivery address and contact phone are required.' });
        return;
      }

      let totalAmount = 0;
      const orderItems = [];

      for (const item of items) {
        const product = dataStore.products.find(p => p.id === item.productId);
        if (!product) {
          res.status(404).json({ success: false, message: `Product ${item.productId} not found.` });
          return;
        }

        if (product.availableQuantity < item.quantity) {
          res.status(400).json({
            success: false,
            message: `Insufficient stock for ${product.name}. Available: ${product.availableQuantity} ${product.unit}`,
          });
          return;
        }

        const itemTotal = product.price * item.quantity;
        totalAmount += itemTotal;

        orderItems.push({
          id: `oi-${uuidv4().slice(0, 8)}`,
          productId: product.id,
          productName: product.name,
          sellerId: product.sellerId,
          quantity: item.quantity,
          unit: product.unit,
          unitPrice: product.price,
          totalPrice: itemTotal,
        });

        // Decrement available quantity
        product.availableQuantity -= item.quantity;
      }

      const orderNumber = `AGRI-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const newOrder = {
        id: `order-${uuidv4().slice(0, 8)}`,
        orderNumber,
        buyerId: req.user.id,
        buyerName: req.user.fullName,
        buyerMobile: req.user.mobileNumber,
        totalAmount,
        orderStatus: 'PENDING' as const,
        paymentStatus: 'PENDING' as const,
        deliveryAddress,
        contactPhone,
        paymentMode,
        items: orderItems,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      dataStore.orders.unshift(newOrder);
      await dataStore.persistOrder(newOrder);

      // Clear user's cart if any
      const userCart = dataStore.carts.find(c => c.userId === req.user?.id);
      if (userCart) {
        userCart.items = [];
      }

      // Initiate PhonePe Payment Gateway
      const paymentInit = await PaymentService.initiatePayment({
        orderId: newOrder.id,
        orderNumber: newOrder.orderNumber,
        amount: totalAmount,
        customerPhone: contactPhone,
        customerName: req.user.fullName,
      });

      // Send buyer notification
      await dataStore.addNotification({
        id: `notif-${uuidv4().slice(0, 8)}`,
        userId: req.user.id,
        titleEn: `Order Placed: ${orderNumber}`,
        titleTa: `ஆர்டர் பதிவு செய்யப்பட்டது: ${orderNumber}`,
        messageEn: `Your order for ₹${totalAmount.toLocaleString()} has been placed and is awaiting confirmation.`,
        messageTa: `₹${totalAmount.toLocaleString()} மதிப்பிலான உங்கள் ஆர்டர் வெற்றிகரமாக பதிவு செய்யப்பட்டுள்ளது.`,
        type: 'ORDER_UPDATE',
        isRead: false,
        actionUrl: `/orders/${newOrder.id}`,
        createdAt: new Date(),
      });

      res.status(201).json({
        success: true,
        message: 'Order created successfully.',
        data: {
          order: newOrder,
          payment: paymentInit,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getOrders(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const { role, id } = req.user;
      let userOrders = [];

      if (role === 'ADMIN') {
        userOrders = [...dataStore.orders];
      } else if (role === 'FARMER') {
        // Farmer sees orders containing products they sold OR orders they purchased
        userOrders = dataStore.orders.filter(
          o => o.buyerId === id || o.items.some(item => item.sellerId === id)
        );
      } else {
        // Buyer sees their own orders
        userOrders = dataStore.orders.filter(o => o.buyerId === id);
      }

      res.status(200).json({
        success: true,
        data: {
          orders: userOrders,
          total: userOrders.length,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getOrderById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const { id } = req.params;
      const order = dataStore.orders.find(o => o.id === id || o.orderNumber === id);

      if (!order) {
        res.status(404).json({ success: false, message: 'Order not found.' });
        return;
      }

      // Permission check: buyer, seller of an item, or admin
      const isBuyer = order.buyerId === req.user.id;
      const isSeller = order.items.some(i => i.sellerId === req.user?.id);
      const isAdmin = req.user.role === 'ADMIN';

      if (!isBuyer && !isSeller && !isAdmin) {
        res.status(403).json({ success: false, message: 'Unauthorized to view this order.' });
        return;
      }

      res.status(200).json({
        success: true,
        data: { order },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async updateOrderStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ['PENDING', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
      if (!validStatuses.includes(status)) {
        res.status(400).json({
          success: false,
          message: `Invalid order status. Allowed: ${validStatuses.join(', ')}`,
        });
        return;
      }

      const order = dataStore.orders.find(o => o.id === id || o.orderNumber === id);
      if (!order) {
        res.status(404).json({ success: false, message: 'Order not found.' });
        return;
      }

      // Farmer who owns items in the order or Admin can change status
      const isSeller = order.items.some(i => i.sellerId === req.user?.id);
      const isAdmin = req.user.role === 'ADMIN';

      if (!isSeller && !isAdmin) {
        res.status(403).json({
          success: false,
          message: 'Only the seller or an administrator can update the order fulfillment status.',
        });
        return;
      }

      order.orderStatus = status as any;
      order.updatedAt = new Date();
      await dataStore.persistOrder(order);

      // Notify buyer of status update
      await dataStore.addNotification({
        id: `notif-${uuidv4().slice(0, 8)}`,
        userId: order.buyerId,
        titleEn: `Order Status: ${order.orderNumber} is now ${status}`,
        titleTa: `ஆர்டர் நிலை: ${order.orderNumber} - ${status}`,
        messageEn: `Your order status has been updated to ${status}.`,
        messageTa: `உங்கள் ஆர்டர் நிலை ${status} என மாற்றப்பட்டுள்ளது.`,
        type: 'ORDER_UPDATE',
        isRead: false,
        actionUrl: `/orders/${order.id}`,
        createdAt: new Date(),
      });

      res.status(200).json({
        success: true,
        message: `Order status updated to ${status}.`,
        data: { order },
      });
    } catch (error) {
      next(error);
    }
  }
}

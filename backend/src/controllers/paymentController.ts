import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/paymentService';
import { dataStore } from '../services/dataStore';
import { AuthenticatedRequest } from '../types';
import { env } from '../config/env';

export class PaymentController {
  public static async initiate(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { orderId, amount, customerPhone, customerName } = req.body;

      const order = dataStore.orders.find(o => o.id === orderId);
      if (!order) {
        res.status(404).json({ success: false, message: 'Order not found.' });
        return;
      }

      const result = await PaymentService.initiatePayment({
        orderId,
        orderNumber: order.orderNumber,
        amount: amount || order.totalAmount,
        customerPhone: customerPhone || order.contactPhone,
        customerName: customerName || order.buyerName,
      });

      await dataStore.persistPayment({
        orderId,
        merchantTxnId: result.merchantTransactionId,
        amount: amount || order.totalAmount,
        status: 'PENDING',
        paymentMode: 'PHONEPE_MOCK',
      });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async verify(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { merchantTransactionId, orderId, paymentStatus = 'COMPLETED' } = req.body;

      const order = dataStore.orders.find(o => o.id === orderId);
      if (order) {
        order.paymentStatus = paymentStatus === 'COMPLETED' ? 'COMPLETED' : 'FAILED';
        if (order.paymentStatus === 'COMPLETED' && order.orderStatus === 'PENDING') {
          order.orderStatus = 'CONFIRMED';
        }
        order.updatedAt = new Date();
        await dataStore.persistOrder(order);
      }

      if (merchantTransactionId) {
        await dataStore.persistPayment({
          orderId,
          merchantTxnId: merchantTransactionId,
          amount: order ? order.totalAmount : 0,
          status: paymentStatus === 'COMPLETED' ? 'COMPLETED' : 'FAILED',
          providerTxnId: merchantTransactionId,
        });
      }

      res.status(200).json({
        success: true,
        message: 'Payment verification recorded.',
        data: {
          merchantTransactionId,
          orderId,
          paymentStatus: order ? order.paymentStatus : paymentStatus,
          isDevelopmentMode: env.PAYMENT_MODE === 'development',
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async webhook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Handle asynchronous PhonePe server-to-server webhook
      const { response } = req.body;
      console.log('🔔 [PhonePe Webhook Received]:', response ? 'Payload Present' : 'Ping');

      res.status(200).json({ success: true, message: 'Webhook acknowledged' });
    } catch (error) {
      next(error);
    }
  }
}

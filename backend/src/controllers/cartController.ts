import { Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AuthenticatedRequest } from '../types';
import { dataStore } from '../services/dataStore';

export class CartController {
  private static getOrCreateCart(userId: string) {
    let cart = dataStore.carts.find(c => c.userId === userId);
    if (!cart) {
      cart = { id: `cart-${uuidv4().slice(0, 8)}`, userId, items: [] };
      dataStore.carts.push(cart);
    }
    return cart;
  }

  public static async getCart(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const cart = CartController.getOrCreateCart(req.user.id);

      const itemsWithProduct = cart.items.map(item => {
        const product = dataStore.products.find(p => p.id === item.productId);
        return {
          id: item.id,
          productId: item.productId,
          quantity: item.quantity,
          product: product || {
            name: 'Unavailable Product',
            price: 0,
            unit: 'unit',
            imageUrl: '',
          },
          subtotal: product ? product.price * item.quantity : 0,
        };
      });

      const totalAmount = itemsWithProduct.reduce((sum, i) => sum + i.subtotal, 0);

      res.status(200).json({
        success: true,
        data: {
          cartId: cart.id,
          items: itemsWithProduct,
          totalAmount,
          itemCount: itemsWithProduct.length,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async addItem(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const { productId, quantity = 1 } = req.body;
      const product = dataStore.products.find(p => p.id === productId);

      if (!product) {
        res.status(404).json({ success: false, message: 'Product not found.' });
        return;
      }

      const cart = CartController.getOrCreateCart(req.user.id);
      const existingItem = cart.items.find(i => i.productId === productId);

      if (existingItem) {
        existingItem.quantity += parseFloat(quantity);
      } else {
        cart.items.push({
          id: `ci-${uuidv4().slice(0, 8)}`,
          productId,
          quantity: parseFloat(quantity),
        });
      }

      res.status(200).json({
        success: true,
        message: 'Item added to cart.',
      });
    } catch (error) {
      next(error);
    }
  }

  public static async updateItem(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const { id } = req.params;
      const { quantity } = req.body;

      const cart = CartController.getOrCreateCart(req.user.id);
      const item = cart.items.find(i => i.id === id);

      if (!item) {
        res.status(404).json({ success: false, message: 'Cart item not found.' });
        return;
      }

      if (parseFloat(quantity) <= 0) {
        cart.items = cart.items.filter(i => i.id !== id);
      } else {
        item.quantity = parseFloat(quantity);
      }

      res.status(200).json({
        success: true,
        message: 'Cart updated.',
      });
    } catch (error) {
      next(error);
    }
  }

  public static async removeItem(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const { id } = req.params;
      const cart = CartController.getOrCreateCart(req.user.id);
      cart.items = cart.items.filter(i => i.id !== id);

      res.status(200).json({
        success: true,
        message: 'Item removed from cart.',
      });
    } catch (error) {
      next(error);
    }
  }

  public static async clearCart(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const cart = CartController.getOrCreateCart(req.user.id);
      cart.items = [];

      res.status(200).json({
        success: true,
        message: 'Cart cleared.',
      });
    } catch (error) {
      next(error);
    }
  }
}

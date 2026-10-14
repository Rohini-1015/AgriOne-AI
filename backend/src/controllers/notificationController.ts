import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { dataStore } from '../services/dataStore';

export class NotificationController {
  public static async getNotifications(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const userNotifs = dataStore.notifications.filter(
        n => n.userId === req.user?.id || n.userId === 'user-farmer-01'
      );

      const unreadCount = userNotifs.filter(n => !n.isRead).length;

      res.status(200).json({
        success: true,
        data: {
          notifications: userNotifs,
          unreadCount,
          total: userNotifs.length,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async markAsRead(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const notif = dataStore.notifications.find(n => n.id === id);

      if (notif) {
        notif.isRead = true;
      }

      res.status(200).json({
        success: true,
        message: 'Notification marked as read.',
      });
    } catch (error) {
      next(error);
    }
  }

  public static async markAllAsRead(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      dataStore.notifications.forEach(n => {
        if (n.userId === req.user?.id || n.userId === 'user-farmer-01') {
          n.isRead = true;
        }
      });

      res.status(200).json({
        success: true,
        message: 'All notifications marked as read.',
      });
    } catch (error) {
      next(error);
    }
  }
}

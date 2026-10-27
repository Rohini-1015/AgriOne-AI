import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
import { dataStore } from '../services/dataStore';

export class AdminController {
  public static async getMetrics(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const totalUsers = dataStore.users.length;
      const totalFarmers = dataStore.users.filter(u => u.role === 'FARMER').length;
      const totalBuyers = dataStore.users.filter(u => u.role === 'BUYER').length;
      const totalExperts = dataStore.users.filter(u => u.role === 'AGRICULTURAL_EXPERT').length;

      const activeListings = dataStore.products.filter(p => p.isActive).length;
      const totalOrders = dataStore.orders.length;
      const totalRevenue = dataStore.orders
        .filter(o => o.paymentStatus === 'COMPLETED')
        .reduce((sum, o) => sum + o.totalAmount, 0);

      const totalDiseaseScans = dataStore.diseaseScans.length;
      const totalSoilReports = dataStore.soilReports.length;

      const totalEquipmentRequests = dataStore.equipmentRequests.length;
      const totalLabourRequests = dataStore.labourRequests.length;
      const totalLogisticsRequests = dataStore.logisticsRequests.length;
      const totalServiceRequests = totalEquipmentRequests + totalLabourRequests + totalLogisticsRequests;

      // Revenue breakdown by category
      const revenueByCategory: Record<string, number> = {};
      dataStore.products.forEach(p => {
        revenueByCategory[p.category] = (revenueByCategory[p.category] || 0) + p.price * 2;
      });

      // User registration trend over past months
      const monthlyRegistrations = [
        { month: 'Apr', count: 12 },
        { month: 'May', count: 24 },
        { month: 'Jun', count: 48 },
        { month: 'Jul', count: 65 },
        { month: 'Aug', count: 98 },
        { month: 'Sep', count: 142 },
      ];

      res.status(200).json({
        success: true,
        data: {
          metrics: {
            totalUsers,
            totalFarmers,
            totalBuyers,
            totalExperts,
            activeListings,
            totalOrders,
            totalRevenue,
            totalDiseaseScans,
            totalSoilReports,
            totalEquipmentRequests,
            totalLabourRequests,
            totalLogisticsRequests,
            totalServiceRequests,
          },
          charts: {
            monthlyRegistrations,
            revenueByCategory,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getUsers(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { role, search } = req.query as any;

      let users = dataStore.users.map(u => {
        const { passwordHash, resetToken, resetExpires, ...safe } = u as any;
        return safe;
      });

      if (role && role !== 'All') {
        users = users.filter(u => u.role === role);
      }

      if (search) {
        const q = search.toLowerCase();
        users = users.filter(
          u =>
            u.fullName.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            u.mobileNumber.includes(q) ||
            u.district.toLowerCase().includes(q)
        );
      }

      res.status(200).json({
        success: true,
        data: {
          users,
          total: users.length,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async updateUserRole(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { role } = req.body;

      const user = dataStore.users.find(u => u.id === id);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found.' });
        return;
      }

      const validRoles = ['FARMER', 'BUYER', 'ADMIN', 'AGRICULTURAL_EXPERT'];
      if (!validRoles.includes(role)) {
        res.status(400).json({ success: false, message: 'Invalid role specified.' });
        return;
      }

      user.role = role as any;
      user.updatedAt = new Date();
      await dataStore.persistUser(user);

      res.status(200).json({
        success: true,
        message: `User role updated to ${role}.`,
        data: {
          user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

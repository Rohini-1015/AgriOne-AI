import { Router } from 'express';
import authRoutes from './authRoutes';
import cropRoutes from './cropRoutes';
import diseaseRoutes from './diseaseRoutes';
import weatherRoutes from './weatherRoutes';
import soilRoutes from './soilRoutes';
import marketRoutes from './marketRoutes';
import productRoutes from './productRoutes';
import cartRoutes from './cartRoutes';
import orderRoutes from './orderRoutes';
import paymentRoutes from './paymentRoutes';
import serviceRoutes from './serviceRoutes';
import chatRoutes from './chatRoutes';
import schemeRoutes from './schemeRoutes';
import farmRoutes from './farmRoutes';
import notificationRoutes from './notificationRoutes';
import adminRoutes from './adminRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/crops', cropRoutes);
router.use('/disease', diseaseRoutes);
router.use('/weather', weatherRoutes);
router.use('/soil', soilRoutes);
router.use('/market', marketRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/payments', paymentRoutes);
router.use('/services', serviceRoutes);
router.use('/chat', chatRoutes);
router.use('/schemes', schemeRoutes);
router.use('/farms', farmRoutes);
router.use('/notifications', notificationRoutes);
router.use('/admin', adminRoutes);

import { isDatabaseActive } from '../config/db';

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AgriOne AI Core API Engine is operational.',
    database: isDatabaseActive() ? 'Connected (SQLite dev.db)' : 'Disconnected',
    version: '1.0.0',
    timestamp: new Date(),
  });
});

export default router;

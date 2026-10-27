import { Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AuthenticatedRequest } from '../types';
import { dataStore } from '../services/dataStore';

export class ServiceController {
  // EQUIPMENT SERVICES
  public static async getEquipments(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(200).json({
        success: true,
        data: { equipments: dataStore.equipments },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async createEquipment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, nameTa, type, hourlyRate, dailyRate, imageUrl, description } = req.body;
      if (!name || !type || !hourlyRate || !dailyRate) {
        res.status(400).json({ success: false, message: 'Missing required equipment fields.' });
        return;
      }
      const newEq = {
        id: `eq-${uuidv4().slice(0, 8)}`,
        name,
        nameTa: nameTa || name,
        type,
        hourlyRate: parseFloat(hourlyRate),
        dailyRate: parseFloat(dailyRate),
        imageUrl: imageUrl || 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=600&auto=format&fit=crop&q=80',
        description: description || '',
        isAvailable: true,
        createdAt: new Date(),
      };
      dataStore.equipments.unshift(newEq);
      await dataStore.persistEquipment(newEq);

      res.status(201).json({
        success: true,
        message: 'Equipment added successfully.',
        data: { equipment: newEq },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getEquipmentRequests(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const list = req.user.role === 'ADMIN'
        ? dataStore.equipmentRequests
        : dataStore.equipmentRequests.filter(r => r.userId === req.user?.id);

      res.status(200).json({
        success: true,
        data: { requests: list },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async createEquipmentRequest(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const { equipmentType, equipmentId, requestDate, startTime, durationHours, location, description, contactPhone } = req.body;

      if (!equipmentType || !requestDate || !durationHours || !location || !contactPhone) {
        res.status(400).json({ success: false, message: 'Missing required equipment booking fields.' });
        return;
      }

      const matchedEquipment = dataStore.equipments.find(e => e.id === equipmentId || e.type.toLowerCase() === equipmentType.toLowerCase());
      const totalCost = matchedEquipment ? matchedEquipment.hourlyRate * parseFloat(durationHours) : 4500;

      const newRequest = {
        id: `eq-req-${uuidv4().slice(0, 8)}`,
        userId: req.user.id,
        userName: req.user.fullName,
        equipmentType,
        equipmentId: matchedEquipment?.id,
        requestDate,
        startTime: startTime || '08:00 AM',
        durationHours: parseFloat(durationHours),
        location,
        description: description || 'Agricultural field service booking',
        contactPhone,
        status: 'REQUESTED' as const,
        totalCost,
        createdAt: new Date(),
      };

      dataStore.equipmentRequests.unshift(newRequest);
      await dataStore.persistEquipmentRequest(newRequest);

      // Notification
      await dataStore.addNotification({
        id: `notif-${uuidv4().slice(0, 8)}`,
        userId: req.user.id,
        titleEn: `Equipment Booking Submitted: ${equipmentType}`,
        titleTa: `இயந்திர முன்பதிவு பெறப்பட்டது: ${equipmentType}`,
        messageEn: `Your booking for ${equipmentType} on ${requestDate} is under review by local operators.`,
        messageTa: `${requestDate} தேதிக்கான உங்கள் ${equipmentType} முன்பதிவு பரிசீலனையில் உள்ளது.`,
        type: 'SERVICE_UPDATE',
        isRead: false,
        actionUrl: '/services/equipment',
        createdAt: new Date(),
      });

      res.status(201).json({
        success: true,
        message: 'Equipment request submitted successfully.',
        data: { request: newRequest },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async updateEquipmentStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const request = dataStore.equipmentRequests.find(r => r.id === id);
      if (!request) {
        res.status(404).json({ success: false, message: 'Equipment request not found' });
        return;
      }

      request.status = status;
      await dataStore.persistEquipmentRequest(request);

      res.status(200).json({
        success: true,
        message: `Equipment request status updated to ${status}`,
        data: { request },
      });
    } catch (error) {
      next(error);
    }
  }

  // LABOUR SERVICES
  public static async getLabourRequests(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const list = req.user.role === 'ADMIN'
        ? dataStore.labourRequests
        : dataStore.labourRequests.filter(r => r.userId === req.user?.id);

      res.status(200).json({
        success: true,
        data: { requests: list },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async createLabourRequest(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const { workType, workerCount, workDate, durationDays, location, budgetPerWorker, requirements, contactPhone } = req.body;

      if (!workType || !workerCount || !workDate || !durationDays || !location || !budgetPerWorker || !contactPhone) {
        res.status(400).json({ success: false, message: 'Missing required agricultural labour booking fields.' });
        return;
      }

      const newRequest = {
        id: `lab-req-${uuidv4().slice(0, 8)}`,
        userId: req.user.id,
        userName: req.user.fullName,
        workType,
        workerCount: parseInt(workerCount, 10),
        workDate,
        durationDays: parseInt(durationDays, 10),
        location,
        budgetPerWorker: parseFloat(budgetPerWorker),
        requirements: requirements || 'Farm field labor requirement',
        contactPhone,
        status: 'REQUESTED' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      dataStore.labourRequests.unshift(newRequest);
      await dataStore.persistLabourRequest(newRequest);

      await dataStore.addNotification({
        id: `notif-${uuidv4().slice(0, 8)}`,
        userId: req.user.id,
        titleEn: `Labour Booking Broadcasted: ${workType}`,
        titleTa: `வேளாண் கூலி முன்பதிவு: ${workType}`,
        messageEn: `Request for ${workerCount} workers for ${workType} has been broadcasted to local agricultural groups.`,
        messageTa: `${workType} பணிக்காக ${workerCount} தொழிலாளர்கள் கோரிக்கை உள்ளூர் விவசாயக் குழுக்களுக்கு அனுப்பப்பட்டுள்ளது.`,
        type: 'SERVICE_UPDATE',
        isRead: false,
        actionUrl: '/services/labour',
        createdAt: new Date(),
      });

      res.status(201).json({
        success: true,
        message: 'Labour request submitted successfully.',
        data: { request: newRequest },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async updateLabourStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const request = dataStore.labourRequests.find(r => r.id === id);
      if (!request) {
        res.status(404).json({ success: false, message: 'Labour request not found' });
        return;
      }

      request.status = status;
      request.updatedAt = new Date();
      await dataStore.persistLabourRequest(request);

      res.status(200).json({
        success: true,
        message: `Labour request status updated to ${status}`,
        data: { request },
      });
    } catch (error) {
      next(error);
    }
  }

  // LOGISTICS SERVICES
  public static async getLogisticsRequests(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const list = req.user.role === 'ADMIN'
        ? dataStore.logisticsRequests
        : dataStore.logisticsRequests.filter(r => r.userId === req.user?.id);

      res.status(200).json({
        success: true,
        data: { requests: list },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async createLogisticsRequest(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const { pickupLocation, deliveryLocation, cropName, quantityTons, vehicleType, preferredDate, contactPhone, notes } = req.body;

      if (!pickupLocation || !deliveryLocation || !cropName || !quantityTons || !vehicleType || !preferredDate || !contactPhone) {
        res.status(400).json({ success: false, message: 'Missing required logistics booking fields.' });
        return;
      }

      const tons = parseFloat(quantityTons);
      const estimatedCost = Math.round(1500 + tons * 450);

      const newRequest = {
        id: `log-req-${uuidv4().slice(0, 8)}`,
        userId: req.user.id,
        userName: req.user.fullName,
        pickupLocation,
        deliveryLocation,
        cropName,
        quantityTons: tons,
        vehicleType,
        preferredDate,
        contactPhone,
        notes: notes || '',
        status: 'Requested' as const,
        estimatedCost,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      dataStore.logisticsRequests.unshift(newRequest);
      await dataStore.persistLogisticsRequest(newRequest);

      await dataStore.addNotification({
        id: `notif-${uuidv4().slice(0, 8)}`,
        userId: req.user.id,
        titleEn: `Logistics Transport Booked: ${cropName}`,
        titleTa: `போக்குவரத்து முன்பதிவு செய்யப்பட்டது: ${cropName}`,
        messageEn: `Vehicle ${vehicleType} requested for ${tons} tons from ${pickupLocation} to ${deliveryLocation}.`,
        messageTa: `${pickupLocation} முதல் ${deliveryLocation} வரை ${tons} டன் சரக்கு கொண்டு செல்ல ${vehicleType} வாகனம் கோரப்பட்டுள்ளது.`,
        type: 'SERVICE_UPDATE',
        isRead: false,
        actionUrl: '/services/logistics',
        createdAt: new Date(),
      });

      res.status(201).json({
        success: true,
        message: 'Logistics request submitted successfully.',
        data: { request: newRequest },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async updateLogisticsStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const request = dataStore.logisticsRequests.find(r => r.id === id);
      if (!request) {
        res.status(404).json({ success: false, message: 'Logistics request not found' });
        return;
      }

      request.status = status;
      request.updatedAt = new Date();
      await dataStore.persistLogisticsRequest(request);

      res.status(200).json({
        success: true,
        message: `Logistics status updated to ${status}`,
        data: { request },
      });
    } catch (error) {
      next(error);
    }
  }
}

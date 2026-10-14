import { Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AuthenticatedRequest } from '../types';
import { dataStore } from '../services/dataStore';

export class FarmController {
  public static async getFarms(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const userFarms = dataStore.farms.filter(f => f.userId === req.user?.id);

      res.status(200).json({
        success: true,
        data: { farms: userFarms },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async createFarm(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const { name, surveyNumber, sizeAcres, soilType, currentCrop, plantingDate, expectedHarvest, irrigationType, location } = req.body;

      if (!name || !sizeAcres || !soilType || !currentCrop) {
        res.status(400).json({ success: false, message: 'Farm name, size, soil type, and current crop are required.' });
        return;
      }

      const newFarm = {
        id: `farm-${uuidv4().slice(0, 8)}`,
        userId: req.user.id,
        name,
        surveyNumber: surveyNumber || 'N/A',
        sizeAcres: parseFloat(sizeAcres),
        soilType,
        currentCrop,
        plantingDate: plantingDate ? new Date(plantingDate) : new Date(),
        expectedHarvest: expectedHarvest ? new Date(expectedHarvest) : null,
        irrigationType: irrigationType || 'Canal & Borewell',
        location: location || `${req.user.village}, ${req.user.district}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      dataStore.farms.push(newFarm);

      res.status(201).json({
        success: true,
        message: 'Farm plot registered successfully.',
        data: { farm: newFarm },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async updateFarm(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const { id } = req.params;
      const farm = dataStore.farms.find(f => f.id === id && f.userId === req.user?.id);

      if (!farm) {
        res.status(404).json({ success: false, message: 'Farm plot not found.' });
        return;
      }

      Object.assign(farm, req.body, { updatedAt: new Date() });

      res.status(200).json({
        success: true,
        message: 'Farm plot updated.',
        data: { farm },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteFarm(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const { id } = req.params;
      const index = dataStore.farms.findIndex(f => f.id === id && f.userId === req.user?.id);

      if (index === -1) {
        res.status(404).json({ success: false, message: 'Farm plot not found.' });
        return;
      }

      dataStore.farms.splice(index, 1);

      res.status(200).json({
        success: true,
        message: 'Farm plot deleted.',
      });
    } catch (error) {
      next(error);
    }
  }
}

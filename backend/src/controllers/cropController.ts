import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { AuthenticatedRequest } from '../types';
import { CropRecommendationService } from '../services/cropRecommendationService';
import { dataStore } from '../services/dataStore';

const recommendInputSchema = z.object({
  soilType: z.string().default('Alluvial'),
  soilPh: z.coerce.number().min(3).max(11).default(6.8),
  nitrogen: z.coerce.number().min(10).max(600).default(210),
  phosphorus: z.coerce.number().min(5).max(300).default(25),
  potassium: z.coerce.number().min(10).max(800).default(190),
  temperature: z.coerce.number().min(5).max(55).default(30),
  humidity: z.coerce.number().min(10).max(100).default(68),
  rainfall: z.coerce.number().min(0).max(4000).default(1100),
  season: z.string().default('Kharif'),
  location: z.string().default('Thanjavur, Tamil Nadu'),
  irrigation: z.string().default('Canal & Borewell'),
  previousCrop: z.string().optional(),
});

export class CropController {
  public static async recommend(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = recommendInputSchema.parse(req.body);

      const recommendations = CropRecommendationService.recommend({
        soilType: validated.soilType,
        soilPh: validated.soilPh,
        nitrogen: validated.nitrogen,
        phosphorus: validated.phosphorus,
        potassium: validated.potassium,
        temperature: validated.temperature,
        humidity: validated.humidity,
        rainfall: validated.rainfall,
        season: validated.season,
        location: validated.location,
        irrigation: validated.irrigation,
        previousCrop: validated.previousCrop,
      });

      const record = {
        id: `rec-${uuidv4().slice(0, 8)}`,
        userId: req.user?.id || null,
        input: validated,
        recommendations,
        createdAt: new Date(),
      };

      dataStore.cropRecommendations.unshift(record);

      res.status(200).json({
        success: true,
        message: 'Crop recommendation generated successfully.',
        data: {
          recommendations,
          meta: {
            topCrop: recommendations[0]?.cropNameEn,
            suitability: recommendations[0]?.suitabilityScore,
            season: validated.season,
          }
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getHistory(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      const history = userId
        ? dataStore.cropRecommendations.filter(r => r.userId === userId)
        : dataStore.cropRecommendations.slice(0, 10);

      res.status(200).json({
        success: true,
        data: { history },
      });
    } catch (error) {
      next(error);
    }
  }
}

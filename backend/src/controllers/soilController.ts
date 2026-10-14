import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { AuthenticatedRequest } from '../types';
import { SoilAnalysisService } from '../services/soilAnalysisService';
import { dataStore } from '../services/dataStore';

const soilInputSchema = z.object({
  ph: z.coerce.number().min(3).max(11),
  nitrogen: z.coerce.number().min(10).max(600),
  phosphorus: z.coerce.number().min(2).max(300),
  potassium: z.coerce.number().min(10).max(800),
  organicCarbon: z.coerce.number().min(0.05).max(4.0),
  moisture: z.coerce.number().min(2).max(100),
  soilType: z.string().default('Alluvial'),
});

export class SoilController {
  public static async analyze(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = soilInputSchema.parse(req.body);
      const analysis = SoilAnalysisService.analyze(validated);

      const reportRecord = {
        id: `soil-${uuidv4().slice(0, 8)}`,
        userId: req.user?.id || 'guest',
        soilType: validated.soilType,
        ph: validated.ph,
        nitrogen: validated.nitrogen,
        phosphorus: validated.phosphorus,
        potassium: validated.potassium,
        organicCarbon: validated.organicCarbon,
        moisture: validated.moisture,
        healthScore: analysis.healthScore,
        nutrientStatusJson: JSON.stringify(analysis.nutrientStatus),
        deficienciesJson: JSON.stringify(analysis.deficiencies),
        suggestedCropsJson: JSON.stringify(analysis.suggestedCrops),
        fertilizerGuidance: analysis.fertilizerGuidanceEn.join('; '),
        improvementTips: analysis.improvementTipsEn.join('; '),
        createdAt: new Date(),
      };

      dataStore.soilReports.unshift(reportRecord);

      res.status(200).json({
        success: true,
        message: 'Soil health analysis completed successfully.',
        data: {
          reportId: reportRecord.id,
          input: validated,
          analysis,
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
        ? dataStore.soilReports.filter(r => r.userId === userId || r.userId === 'user-farmer-01')
        : dataStore.soilReports.slice(0, 15);

      res.status(200).json({
        success: true,
        data: { history },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getReportById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const report = dataStore.soilReports.find(r => r.id === id);

      if (!report) {
        res.status(404).json({ success: false, message: 'Soil report not found.' });
        return;
      }

      res.status(200).json({
        success: true,
        data: { report },
      });
    } catch (error) {
      next(error);
    }
  }
}

import { Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AuthenticatedRequest } from '../types';
import { diseaseInferenceService } from '../services/diseaseInferenceService';
import { dataStore } from '../services/dataStore';
import { env } from '../config/env';

export class DiseaseController {
  public static async predict(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const file = req.file;
      const { cropHint } = req.body;

      let imagePath = '';
      let originalName = 'leaf-sample.jpg';

      if (file) {
        imagePath = `${env.API_URL}/uploads/disease/${file.filename}`;
        originalName = file.originalname;
      } else if (req.body.imageUrl) {
        imagePath = req.body.imageUrl;
        originalName = req.body.imageUrl;
      } else {
        res.status(400).json({
          success: false,
          message: 'No leaf image provided. Please upload an image or provide an image URL.',
        });
        return;
      }

      // Run inference service
      const result = await diseaseInferenceService.diagnose(imagePath, originalName, cropHint);

      // Save scan record
      const scanRecord = {
        id: `scan-${uuidv4().slice(0, 8)}`,
        userId: req.user?.id || 'guest',
        imagePath,
        cropName: result.cropName,
        diseaseName: result.diseaseNameEn,
        confidence: result.confidence,
        severity: result.severity,
        symptoms: result.symptomsEn,
        treatment: result.treatmentEn,
        prevention: result.preventionEn,
        recommendation: result.recommendedStepsEn.join('; '),
        createdAt: new Date(),
      };

      dataStore.diseaseScans.unshift(scanRecord);
      await dataStore.persistDiseaseScan(scanRecord);

      // Also trigger a notification if user is logged in
      if (req.user?.id) {
        await dataStore.addNotification({
          id: `notif-${uuidv4().slice(0, 8)}`,
          userId: req.user.id,
          titleEn: `Crop Doctor: ${result.cropName} Scan Completed`,
          titleTa: `பயிர் மருத்துவர்: ${result.diseaseNameTa} ஆய்வு முடிந்தது`,
          messageEn: `Diagnosis: ${result.diseaseNameEn} (${result.severity} severity, ${result.confidence}% confidence). Recommended treatments available.`,
          messageTa: `கண்டறியப்பட்டது: ${result.diseaseNameTa} (${result.severity} தீவிரம், ${result.confidence}% துல்லியம்).`,
          type: 'DISEASE_SCAN',
          isRead: false,
          actionUrl: `/disease-doctor?scanId=${scanRecord.id}`,
          createdAt: new Date(),
        });
      }

      res.status(200).json({
        success: true,
        message: 'Disease prediction analysis completed.',
        data: {
          scanId: scanRecord.id,
          imageUrl: imagePath,
          diagnosis: result,
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
        ? dataStore.diseaseScans.filter(s => s.userId === userId || s.userId === 'user-farmer-01')
        : dataStore.diseaseScans.slice(0, 15);

      res.status(200).json({
        success: true,
        data: { history },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getScanById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const scan = dataStore.diseaseScans.find(s => s.id === id);

      if (!scan) {
        res.status(404).json({ success: false, message: 'Disease scan record not found.' });
        return;
      }

      res.status(200).json({
        success: true,
        data: { scan },
      });
    } catch (error) {
      next(error);
    }
  }
}

import { Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AuthenticatedRequest } from '../types';
import { dataStore } from '../services/dataStore';

export class SchemeController {
  public static async getAll(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { category, search } = req.query as any;

      let list = [...dataStore.schemes];

      if (category && category !== 'All') {
        list = list.filter(s => s.category.toLowerCase() === category.toLowerCase());
      }

      if (search) {
        const q = search.toLowerCase().trim();
        list = list.filter(
          s =>
            s.nameEn.toLowerCase().includes(q) ||
            s.nameTa.toLowerCase().includes(q) ||
            s.descriptionEn.toLowerCase().includes(q) ||
            s.descriptionTa.toLowerCase().includes(q)
        );
      }

      res.status(200).json({
        success: true,
        data: {
          schemes: list,
          total: list.length,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const scheme = dataStore.schemes.find(s => s.id === id);

      if (!scheme) {
        res.status(404).json({ success: false, message: 'Government scheme not found.' });
        return;
      }

      res.status(200).json({
        success: true,
        data: { scheme },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async create(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        nameEn,
        nameTa,
        category,
        descriptionEn,
        descriptionTa,
        eligibilityEn,
        eligibilityTa,
        benefitsEn,
        benefitsTa,
        documentsEn,
        documentsTa,
        applicationProcess,
        officialUrl,
      } = req.body;

      if (!nameEn || !category || !descriptionEn || !officialUrl) {
        res.status(400).json({ success: false, message: 'Missing required government scheme fields.' });
        return;
      }

      const newScheme = {
        id: `scheme-${uuidv4().slice(0, 8)}`,
        nameEn,
        nameTa: nameTa || nameEn,
        category,
        descriptionEn,
        descriptionTa: descriptionTa || descriptionEn,
        eligibilityEn: eligibilityEn || 'All eligible landholding farmers',
        eligibilityTa: eligibilityTa || 'அனைத்து தகுதியுள்ள விவசாயிகள்',
        benefitsEn: benefitsEn || 'Direct financial benefit / subsidy',
        benefitsTa: benefitsTa || 'நேரடி மானியம்',
        documentsEn: documentsEn || 'Aadhaar, Land records, Bank passbook',
        documentsTa: documentsTa || 'ஆதார், பட்டா, வங்கி புத்தகம்',
        applicationProcess: applicationProcess || 'Apply online or at local agriculture extension office',
        officialUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      dataStore.schemes.unshift(newScheme);

      res.status(201).json({
        success: true,
        message: 'Government scheme created successfully.',
        data: { scheme: newScheme },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async update(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const scheme = dataStore.schemes.find(s => s.id === id);

      if (!scheme) {
        res.status(404).json({ success: false, message: 'Scheme not found.' });
        return;
      }

      Object.assign(scheme, req.body, { updatedAt: new Date() });

      res.status(200).json({
        success: true,
        message: 'Government scheme updated.',
        data: { scheme },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async delete(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const index = dataStore.schemes.findIndex(s => s.id === id);

      if (index === -1) {
        res.status(404).json({ success: false, message: 'Scheme not found.' });
        return;
      }

      dataStore.schemes.splice(index, 1);

      res.status(200).json({
        success: true,
        message: 'Scheme removed successfully.',
      });
    } catch (error) {
      next(error);
    }
  }
}

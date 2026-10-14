import { Request } from 'express';

export type UserRole = 'FARMER' | 'BUYER' | 'ADMIN' | 'AGRICULTURAL_EXPERT';

export interface AuthUser {
  id: string;
  email: string;
  mobileNumber: string;
  fullName: string;
  role: UserRole;
  state: string;
  district: string;
  village: string;
  avatarUrl?: string | null;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export interface CropRecommendationInput {
  soilType: string;
  soilPh: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  temperature: number;
  humidity: number;
  rainfall: number;
  season: string;
  location: string;
  irrigation: string;
  previousCrop?: string;
}

export interface CropRecommendationOutput {
  cropNameEn: string;
  cropNameTa: string;
  suitabilityScore: number; // 0 - 100
  growingPeriodDays: number;
  waterRequirement: 'Low' | 'Medium' | 'High';
  importantNutrients: string;
  commonDiseases: string[];
  estimatedMarketPotential: string;
  cultivationGuidanceEn: string;
  cultivationGuidanceTa: string;
  expectedYieldPerAcre: string;
}

export interface SoilAnalysisInput {
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicCarbon: number;
  moisture: number;
  soilType: string;
}

export interface SoilAnalysisOutput {
  healthScore: number; // 0 - 100
  rating: 'Poor' | 'Moderate' | 'Good' | 'Optimal';
  nutrientStatus: {
    nitrogen: { level: number; status: 'Deficient' | 'Sufficient' | 'Excess'; guidance: string };
    phosphorus: { level: number; status: 'Deficient' | 'Sufficient' | 'Excess'; guidance: string };
    potassium: { level: number; status: 'Deficient' | 'Sufficient' | 'Excess'; guidance: string };
    organicCarbon: { level: number; status: 'Low' | 'Medium' | 'High'; guidance: string };
    ph: { level: number; status: 'Acidic' | 'Neutral' | 'Alkaline'; guidance: string };
  };
  deficiencies: string[];
  suggestedCrops: string[];
  fertilizerGuidanceEn: string[];
  fertilizerGuidanceTa: string[];
  improvementTipsEn: string[];
  improvementTipsTa: string[];
}

export interface DiseaseDetectionResult {
  cropName: string;
  diseaseNameEn: string;
  diseaseNameTa: string;
  confidence: number;
  severity: 'Low' | 'Moderate' | 'High' | 'Severe';
  symptomsEn: string;
  symptomsTa: string;
  treatmentEn: string;
  treatmentTa: string;
  preventionEn: string;
  preventionTa: string;
  recommendedStepsEn: string[];
  recommendedStepsTa: string[];
}

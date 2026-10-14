export type UserRole = 'FARMER' | 'BUYER' | 'ADMIN' | 'AGRICULTURAL_EXPERT';

export interface User {
  id: string;
  fullName: string;
  mobileNumber: string;
  email: string;
  role: UserRole;
  state: string;
  district: string;
  village: string;
  avatarUrl?: string | null;
  createdAt: string;
}

export interface Farm {
  id: string;
  userId: string;
  name: string;
  surveyNumber?: string;
  sizeAcres: number;
  soilType: string;
  currentCrop: string;
  plantingDate?: string | null;
  expectedHarvest?: string | null;
  irrigationType: string;
  location: string;
}

export interface CropRecommendation {
  cropNameEn: string;
  cropNameTa: string;
  suitabilityScore: number;
  growingPeriodDays: number;
  waterRequirement: 'Low' | 'Medium' | 'High';
  importantNutrients: string;
  commonDiseases: string[];
  estimatedMarketPotential: string;
  cultivationGuidanceEn: string;
  cultivationGuidanceTa: string;
  expectedYieldPerAcre: string;
}

export interface DiseaseDiagnosis {
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

export interface DiseaseScanRecord {
  id: string;
  userId?: string;
  imagePath: string;
  cropName: string;
  diseaseName: string;
  confidence: number;
  severity: string;
  symptoms: string;
  treatment: string;
  prevention: string;
  recommendation: string;
  createdAt: string;
}

export interface SoilAnalysisResult {
  healthScore: number;
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

export interface SoilReportRecord {
  id: string;
  userId?: string;
  soilType: string;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicCarbon: number;
  moisture: number;
  healthScore: number;
  nutrientStatusJson: string;
  deficienciesJson: string;
  suggestedCropsJson: string;
  fertilizerGuidance: string;
  improvementTips: string;
  createdAt: string;
}

export interface WeatherData {
  location: {
    name: string;
    state: string;
    country: string;
    lat: number;
    lon: number;
  };
  current: {
    temp: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    rainProbability: number;
    description: string;
    descriptionTa: string;
    icon: string;
    uvIndex: number;
    pressure: number;
    agriculturalAlert: string;
    agriculturalAlertTa: string;
  };
  forecast: Array<{
    date: string;
    dayName: string;
    dayNameTa: string;
    tempMax: number;
    tempMin: number;
    humidity: number;
    rainProbability: number;
    description: string;
    descriptionTa: string;
    icon: string;
    spraySuitability: 'Favorable' | 'Caution' | 'Unfavorable';
  }>;
}

export interface MarketPrice {
  id: string;
  cropName: string;
  cropNameTa?: string;
  marketName: string;
  district: string;
  state: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  priceDate: string;
  unit: string;
}

export interface Product {
  id: string;
  sellerId: string;
  sellerName?: string;
  sellerMobile?: string;
  name: string;
  category: string;
  quantity: number;
  availableQuantity: number;
  unit: string;
  price: number;
  description: string;
  location: string;
  district: string;
  state: string;
  harvestDate?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyerName: string;
  buyerMobile: string;
  totalAmount: number;
  orderStatus: 'PENDING' | 'CONFIRMED' | 'PACKED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  deliveryAddress: string;
  contactPhone: string;
  paymentMode: string;
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    sellerId: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    totalPrice: number;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface Equipment {
  id: string;
  name: string;
  nameTa?: string;
  type: string;
  hourlyRate: number;
  dailyRate: number;
  imageUrl?: string;
  description: string;
  isAvailable: boolean;
}

export interface EquipmentRequest {
  id: string;
  userId: string;
  userName: string;
  equipmentType: string;
  equipmentId?: string;
  requestDate: string;
  startTime: string;
  durationHours: number;
  location: string;
  description: string;
  contactPhone: string;
  status: 'REQUESTED' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  totalCost?: number;
  createdAt: string;
}

export interface LabourRequest {
  id: string;
  userId: string;
  userName: string;
  workType: string;
  workerCount: number;
  workDate: string;
  durationDays: number;
  location: string;
  budgetPerWorker: number;
  requirements: string;
  contactPhone: string;
  status: 'REQUESTED' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
}

export interface LogisticsRequest {
  id: string;
  userId: string;
  userName: string;
  pickupLocation: string;
  deliveryLocation: string;
  cropName: string;
  quantityTons: number;
  vehicleType: string;
  preferredDate: string;
  contactPhone: string;
  notes?: string;
  status: 'Requested' | 'Assigned' | 'Picked_Up' | 'In_Transit' | 'Delivered' | 'Cancelled';
  estimatedCost?: number;
  createdAt: string;
}

export interface GovernmentScheme {
  id: string;
  nameEn: string;
  nameTa: string;
  category: string;
  descriptionEn: string;
  descriptionTa: string;
  eligibilityEn: string;
  eligibilityTa: string;
  benefitsEn: string;
  benefitsTa: string;
  documentsEn: string;
  documentsTa: string;
  applicationProcess: string;
  officialUrl: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  titleEn: string;
  titleTa: string;
  messageEn: string;
  messageTa: string;
  type: 'ORDER_UPDATE' | 'WEATHER_ALERT' | 'DISEASE_SCAN' | 'SERVICE_UPDATE' | 'SCHEME_ALERT' | 'GENERAL';
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

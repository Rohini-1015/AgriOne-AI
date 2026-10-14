import {
  defaultUsers,
  defaultFarms,
  defaultProducts,
  defaultMarketPrices,
  defaultGovernmentSchemes,
  defaultEquipments,
  defaultNotifications
} from '../utils/mockSeedData';
import { v4 as uuidv4 } from 'uuid';

class InMemoryDataStore {
  public users = [...defaultUsers];
  public farms = [...defaultFarms];
  public products = [...defaultProducts];
  public marketPrices = [...defaultMarketPrices];
  public schemes = [...defaultGovernmentSchemes];
  public equipments = [...defaultEquipments];
  public notifications = [...defaultNotifications];

  public carts: { id: string; userId: string; items: { id: string; productId: string; quantity: number }[] }[] = [
    {
      id: 'cart-buyer-01',
      userId: 'user-buyer-01',
      items: [
        { id: 'ci-01', productId: 'prod-01', quantity: 2 },
        { id: 'ci-02', productId: 'prod-02', quantity: 3 }
      ]
    }
  ];

  public orders: Array<{
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
    createdAt: Date;
    updatedAt: Date;
  }> = [
    {
      id: 'order-01',
      orderNumber: 'AGRI-2026-9821',
      buyerId: 'user-buyer-01',
      buyerName: 'Priya Sundaram',
      buyerMobile: '9876543211',
      totalAmount: 6850,
      orderStatus: 'CONFIRMED',
      paymentStatus: 'COMPLETED',
      deliveryAddress: 'Plot 14, Green Garden, Adyar, Chennai - 600020',
      contactPhone: '9876543211',
      paymentMode: 'PHONEPE_MOCK',
      items: [
        {
          id: 'oi-01',
          productId: 'prod-01',
          productName: 'Premium Sona Masoori Paddy (BPT 5204)',
          sellerId: 'user-farmer-01',
          quantity: 2,
          unit: 'quintal',
          unitPrice: 2450,
          totalPrice: 4900,
        },
        {
          id: 'oi-02',
          productId: 'prod-02',
          productName: 'Farm-Fresh Country Tomatoes (Naatu Thakkali)',
          sellerId: 'user-farmer-01',
          quantity: 3,
          unit: 'crate',
          unitPrice: 650,
          totalPrice: 1950,
        }
      ],
      createdAt: new Date('2026-09-10T14:30:00Z'),
      updatedAt: new Date('2026-09-10T15:00:00Z'),
    }
  ];

  public diseaseScans: Array<{
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
    createdAt: Date;
  }> = [
    {
      id: 'scan-01',
      userId: 'user-farmer-01',
      imagePath: 'https://images.unsplash.com/photo-1597916829826-02e5bb4a54e0?w=600&auto=format&fit=crop&q=80',
      cropName: 'Paddy / Rice',
      diseaseName: 'Bacterial Leaf Blight (Xanthomonas oryzae)',
      confidence: 94.2,
      severity: 'Moderate',
      symptoms: 'Water-soaked lesions on leaf tips turning yellowish-white with wavy margins.',
      treatment: 'Spray Copper Oxychloride 50% WP @ 500g/acre + Streptocycline 6g/acre.',
      prevention: 'Avoid excess nitrogen fertilization, drain excess standing water.',
      recommendation: 'Apply recommended bactericide spray immediately; repeat in 10 days if symptoms persist.',
      createdAt: new Date('2026-09-08T09:15:00Z')
    }
  ];

  public soilReports: Array<{
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
    createdAt: Date;
  }> = [
    {
      id: 'soil-01',
      userId: 'user-farmer-01',
      soilType: 'Alluvial',
      ph: 6.8,
      nitrogen: 210,
      phosphorus: 24,
      potassium: 195,
      organicCarbon: 0.65,
      moisture: 28,
      healthScore: 84,
      nutrientStatusJson: JSON.stringify({
        ph: 'Optimal',
        nitrogen: 'Moderate',
        phosphorus: 'Sufficient',
        potassium: 'Sufficient',
        organicCarbon: 'Medium'
      }),
      deficienciesJson: JSON.stringify(['Nitrogen slightly below recommended baseline for tillering stage']),
      suggestedCropsJson: JSON.stringify(['Paddy', 'Banana', 'Sugarcane', 'Cotton', 'Black Gram']),
      fertilizerGuidance: 'Top-dress Urea @ 45 kg/acre in two split doses. Apply Neem cake @ 100 kg/acre to boost microbial activity.',
      improvementTips: 'Incorporate green manure crops like Sunnhemp or Dhaincha before the next planting season.',
      createdAt: new Date('2026-08-20T11:00:00Z')
    }
  ];

  public cropRecommendations: Array<any> = [];

  public equipmentRequests: Array<{
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
    createdAt: Date;
  }> = [
    {
      id: 'eq-req-01',
      userId: 'user-farmer-01',
      userName: 'Selvam Murugan',
      equipmentType: 'Tractor',
      equipmentId: 'eq-01',
      requestDate: '2026-09-18',
      startTime: '07:00 AM',
      durationHours: 6,
      location: 'Kabisthalam Village, Thanjavur',
      description: 'Plowing and leveling 4.5 acres for upcoming samba paddy season',
      contactPhone: '9876543210',
      status: 'ACCEPTED',
      totalCost: 5100,
      createdAt: new Date('2026-09-11T10:00:00Z')
    }
  ];

  public labourRequests: Array<{
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
    createdAt: Date;
    updatedAt?: Date;
  }> = [
    {
      id: 'lab-req-01',
      userId: 'user-farmer-01',
      userName: 'Selvam Murugan',
      workType: 'Weeding & De-trashing',
      workerCount: 5,
      workDate: '2026-09-20',
      durationDays: 2,
      location: 'Sundar Garden, Papanasam',
      budgetPerWorker: 500,
      requirements: 'Manual weeding in banana orchard; lunch and morning tea provided',
      contactPhone: '9876543210',
      status: 'REQUESTED',
      createdAt: new Date('2026-09-11T11:30:00Z')
    }
  ];

  public logisticsRequests: Array<{
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
    createdAt: Date;
    updatedAt?: Date;
  }> = [
    {
      id: 'log-req-01',
      userId: 'user-farmer-01',
      userName: 'Selvam Murugan',
      pickupLocation: 'Kabisthalam Farm Gate, Thanjavur',
      deliveryLocation: 'Thanjavur APMC Regulated Market',
      cropName: 'Paddy BPT 5204',
      quantityTons: 10,
      vehicleType: '10-Wheeler Lorry',
      preferredDate: '2026-09-22',
      contactPhone: '9876543210',
      notes: 'Road is asphalted up to the farm gate; tarpaulin cover required for rain protection',
      status: 'Assigned',
      estimatedCost: 4500,
      createdAt: new Date('2026-09-11T12:00:00Z')
    }
  ];

  public chatSessions: Array<{
    id: string;
    userId?: string;
    title: string;
    createdAt: Date;
    messages: Array<{
      id: string;
      sender: 'USER' | 'BOT';
      message: string;
      language: string;
      createdAt: Date;
    }>;
  }> = [];
}

export const dataStore = new InMemoryDataStore();

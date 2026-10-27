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

  public async loadFromDb(): Promise<void> {
    try {
      // Dynamic import to prevent circular dependency
      const { prisma } = await import('../config/db');
      
      const [
        dbUsers,
        dbFarms,
        dbProducts,
        dbPrices,
        dbSchemes,
        dbEquipments,
        dbEqRequests,
        dbLabourRequests,
        dbLogisticsRequests,
        dbNotifs,
        dbOrders,
        dbScans,
        dbSoilReports,
        dbCropRecs,
        dbChatSessions
      ] = await Promise.all([
        prisma.user.findMany(),
        prisma.farm.findMany(),
        prisma.product.findMany(),
        prisma.marketPrice.findMany(),
        prisma.governmentScheme.findMany(),
        prisma.equipment.findMany(),
        prisma.equipmentRequest.findMany({ include: { user: true } }),
        prisma.labourRequest.findMany({ include: { user: true } }),
        prisma.logisticsRequest.findMany({ include: { user: true } }),
        prisma.notification.findMany(),
        prisma.order.findMany({ include: { items: true } }),
        prisma.diseaseScan.findMany(),
        prisma.soilReport.findMany(),
        prisma.cropRecommendation.findMany(),
        prisma.chatSession.findMany({ include: { messages: true } }),
      ]);

      if (dbUsers.length > 0) this.users = dbUsers as any;
      if (dbFarms.length > 0) this.farms = dbFarms as any;
      if (dbProducts.length > 0) this.products = dbProducts as any;
      if (dbPrices.length > 0) this.marketPrices = dbPrices as any;
      if (dbSchemes.length > 0) this.schemes = dbSchemes as any;
      if (dbEquipments.length > 0) this.equipments = dbEquipments as any;
      if (dbNotifs.length > 0) this.notifications = dbNotifs as any;
      if (dbOrders.length > 0) this.orders = dbOrders as any;
      if (dbScans.length > 0) this.diseaseScans = dbScans as any;
      if (dbSoilReports.length > 0) this.soilReports = dbSoilReports as any;
      if (dbCropRecs.length > 0) this.cropRecommendations = dbCropRecs as any;

      if (dbChatSessions.length > 0) {
        this.chatSessions = dbChatSessions.map(s => ({
          id: s.id,
          userId: s.userId || undefined,
          title: s.title,
          createdAt: s.createdAt,
          messages: s.messages.map(m => ({
            id: m.id,
            sender: m.sender as any,
            message: m.message,
            language: m.language,
            createdAt: m.createdAt,
          })),
        }));
      }

      if (dbEqRequests.length > 0) {
        this.equipmentRequests = dbEqRequests.map(r => ({
          id: r.id,
          userId: r.userId,
          userName: r.user?.fullName || 'Farmer',
          equipmentType: r.equipmentType,
          equipmentId: r.equipmentId || undefined,
          requestDate: r.requestDate instanceof Date ? r.requestDate.toISOString().split('T')[0] : String(r.requestDate),
          startTime: r.startTime,
          durationHours: r.durationHours,
          location: r.location,
          description: r.description,
          contactPhone: r.contactPhone,
          status: r.status as any,
          totalCost: r.totalCost ?? undefined,
          createdAt: r.createdAt,
        }));
      }

      if (dbLabourRequests.length > 0) {
        this.labourRequests = dbLabourRequests.map(r => ({
          id: r.id,
          userId: r.userId,
          userName: r.user?.fullName || 'Farmer',
          workType: r.workType,
          workerCount: r.workerCount,
          workDate: r.workDate instanceof Date ? r.workDate.toISOString().split('T')[0] : String(r.workDate),
          durationDays: r.durationDays,
          location: r.location,
          budgetPerWorker: r.budgetPerWorker,
          requirements: r.requirements,
          contactPhone: r.contactPhone,
          status: r.status as any,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        }));
      }

      if (dbLogisticsRequests.length > 0) {
        this.logisticsRequests = dbLogisticsRequests.map(r => ({
          id: r.id,
          userId: r.userId,
          userName: r.user?.fullName || 'Farmer',
          pickupLocation: r.pickupLocation,
          deliveryLocation: r.deliveryLocation,
          cropName: r.cropName,
          quantityTons: r.quantityTons,
          vehicleType: r.vehicleType,
          preferredDate: r.preferredDate instanceof Date ? r.preferredDate.toISOString().split('T')[0] : String(r.preferredDate),
          contactPhone: r.contactPhone,
          notes: r.notes || '',
          status: r.status as any,
          estimatedCost: r.estimatedCost ?? undefined,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        }));
      }

      console.log(`📦 Loaded ${this.users.length} users, ${this.products.length} products, ${this.farms.length} farms, ${this.equipments.length} equipments from SQLite.`);
    } catch (error) {
      console.warn('ℹ️ Running with default in-memory agronomy dataset:', error);
    }
  }

  public async persistEquipment(eq: any): Promise<void> {
    try {
      const { prisma } = await import('../config/db');
      await prisma.equipment.upsert({
        where: { id: eq.id },
        update: eq,
        create: eq,
      });
    } catch (err) {
      console.warn('⚠️ Error persisting equipment to SQLite:', err);
    }
  }

  public async persistEquipmentRequest(req: any): Promise<void> {
    try {
      const { prisma } = await import('../config/db');
      await prisma.equipmentRequest.upsert({
        where: { id: req.id },
        update: {
          status: req.status,
          totalCost: req.totalCost,
        },
        create: {
          id: req.id,
          userId: req.userId,
          equipmentType: req.equipmentType,
          equipmentId: req.equipmentId || null,
          requestDate: new Date(req.requestDate),
          startTime: req.startTime || '08:00 AM',
          durationHours: Number(req.durationHours),
          location: req.location,
          description: req.description || '',
          contactPhone: req.contactPhone,
          status: req.status,
          totalCost: req.totalCost || null,
          createdAt: req.createdAt || new Date(),
        },
      });
    } catch (err) {
      console.warn('⚠️ Error persisting equipment request to SQLite:', err);
    }
  }

  public async persistLabourRequest(req: any): Promise<void> {
    try {
      const { prisma } = await import('../config/db');
      await prisma.labourRequest.upsert({
        where: { id: req.id },
        update: {
          status: req.status,
        },
        create: {
          id: req.id,
          userId: req.userId,
          workType: req.workType,
          workerCount: Number(req.workerCount),
          workDate: new Date(req.workDate),
          durationDays: Number(req.durationDays),
          location: req.location,
          budgetPerWorker: Number(req.budgetPerWorker),
          requirements: req.requirements || '',
          contactPhone: req.contactPhone,
          status: req.status,
          createdAt: req.createdAt || new Date(),
        },
      });
    } catch (err) {
      console.warn('⚠️ Error persisting labour request to SQLite:', err);
    }
  }

  public async persistLogisticsRequest(req: any): Promise<void> {
    try {
      const { prisma } = await import('../config/db');
      await prisma.logisticsRequest.upsert({
        where: { id: req.id },
        update: {
          status: req.status,
        },
        create: {
          id: req.id,
          userId: req.userId,
          pickupLocation: req.pickupLocation,
          deliveryLocation: req.deliveryLocation,
          cropName: req.cropName,
          quantityTons: Number(req.quantityTons),
          vehicleType: req.vehicleType,
          preferredDate: new Date(req.preferredDate),
          contactPhone: req.contactPhone,
          notes: req.notes || '',
          status: req.status,
          estimatedCost: req.estimatedCost || null,
          createdAt: req.createdAt || new Date(),
        },
      });
    } catch (err) {
      console.warn('⚠️ Error persisting logistics request to SQLite:', err);
    }
  }

  public async persistUser(user: any): Promise<void> {
    try {
      const { prisma } = await import('../config/db');
      await prisma.user.upsert({
        where: { id: user.id },
        update: user,
        create: user,
      });
    } catch (err) {
      console.warn('⚠️ Error persisting user to SQLite:', err);
    }
  }

  public async persistProduct(product: any): Promise<void> {
    try {
      const { prisma } = await import('../config/db');
      await prisma.product.upsert({
        where: { id: product.id },
        update: product,
        create: product,
      });
    } catch (err) {
      console.warn('⚠️ Error persisting product to SQLite:', err);
    }
  }

  public async deleteProduct(id: string): Promise<void> {
    try {
      const { prisma } = await import('../config/db');
      await prisma.product.delete({ where: { id } }).catch(() => {});
    } catch (err) {}
  }

  public async persistFarm(farm: any): Promise<void> {
    try {
      const { prisma } = await import('../config/db');
      await prisma.farm.upsert({
        where: { id: farm.id },
        update: {
          name: farm.name,
          surveyNumber: farm.surveyNumber,
          sizeAcres: Number(farm.sizeAcres),
          soilType: farm.soilType,
          currentCrop: farm.currentCrop,
          plantingDate: farm.plantingDate ? new Date(farm.plantingDate) : null,
          expectedHarvest: farm.expectedHarvest ? new Date(farm.expectedHarvest) : null,
          irrigationType: farm.irrigationType,
          location: farm.location,
          updatedAt: new Date(),
        },
        create: {
          id: farm.id,
          userId: farm.userId,
          name: farm.name,
          surveyNumber: farm.surveyNumber,
          sizeAcres: Number(farm.sizeAcres),
          soilType: farm.soilType,
          currentCrop: farm.currentCrop,
          plantingDate: farm.plantingDate ? new Date(farm.plantingDate) : null,
          expectedHarvest: farm.expectedHarvest ? new Date(farm.expectedHarvest) : null,
          irrigationType: farm.irrigationType,
          location: farm.location,
          createdAt: farm.createdAt || new Date(),
          updatedAt: farm.updatedAt || new Date(),
        },
      });
    } catch (err) {
      console.warn('⚠️ Error persisting farm to SQLite:', err);
    }
  }

  public async deleteFarm(id: string): Promise<void> {
    try {
      const { prisma } = await import('../config/db');
      await prisma.farm.delete({ where: { id } }).catch(() => {});
    } catch (err) {}
  }

  public async persistOrder(order: any): Promise<void> {
    try {
      const { prisma } = await import('../config/db');
      await prisma.order.upsert({
        where: { id: order.id },
        update: {
          orderStatus: order.orderStatus,
          paymentStatus: order.paymentStatus,
          updatedAt: new Date(),
        },
        create: {
          id: order.id,
          orderNumber: order.orderNumber,
          buyerId: order.buyerId,
          totalAmount: Number(order.totalAmount),
          orderStatus: order.orderStatus,
          paymentStatus: order.paymentStatus,
          deliveryAddress: order.deliveryAddress,
          contactPhone: order.contactPhone,
          createdAt: order.createdAt || new Date(),
          updatedAt: order.updatedAt || new Date(),
          items: order.items && order.items.length ? {
            create: order.items.map((i: any) => ({
              id: i.id,
              productId: i.productId,
              productName: i.productName,
              quantity: Number(i.quantity),
              unit: i.unit,
              unitPrice: Number(i.unitPrice),
              totalPrice: Number(i.totalPrice),
            })),
          } : undefined,
        },
      });
    } catch (err) {
      console.warn('⚠️ Error persisting order to SQLite:', err);
    }
  }

  public async persistCart(cart: any): Promise<void> {
    try {
      const { prisma } = await import('../config/db');
      await prisma.cart.upsert({
        where: { userId: cart.userId },
        update: {
          updatedAt: new Date(),
        },
        create: {
          id: cart.id,
          userId: cart.userId,
        },
      });
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } }).catch(() => {});
      if (cart.items && cart.items.length) {
        for (const item of cart.items) {
          await prisma.cartItem.create({
            data: {
              id: item.id,
              cartId: cart.id,
              productId: item.productId,
              quantity: Number(item.quantity),
            },
          }).catch(() => {});
        }
      }
    } catch (err) {
      console.warn('⚠️ Error persisting cart to SQLite:', err);
    }
  }

  public async persistDiseaseScan(scan: any): Promise<void> {
    try {
      const { prisma } = await import('../config/db');
      const validUserId = this.users.some(u => u.id === scan.userId) ? scan.userId : null;
      await prisma.diseaseScan.create({
        data: {
          id: scan.id,
          userId: validUserId,
          imagePath: scan.imagePath,
          cropName: scan.cropName,
          diseaseName: scan.diseaseName,
          confidence: Number(scan.confidence),
          severity: scan.severity,
          symptoms: scan.symptoms,
          treatment: scan.treatment,
          prevention: scan.prevention,
          recommendation: scan.recommendation,
          createdAt: scan.createdAt || new Date(),
        },
      });
    } catch (err) {
      console.warn('⚠️ Error persisting disease scan to SQLite:', err);
    }
  }

  public async persistSoilReport(report: any): Promise<void> {
    try {
      const { prisma } = await import('../config/db');
      const validUserId = this.users.some(u => u.id === report.userId) ? report.userId : null;
      await prisma.soilReport.create({
        data: {
          id: report.id,
          userId: validUserId,
          soilType: report.soilType,
          ph: Number(report.ph),
          nitrogen: Number(report.nitrogen),
          phosphorus: Number(report.phosphorus),
          potassium: Number(report.potassium),
          organicCarbon: Number(report.organicCarbon),
          moisture: Number(report.moisture),
          healthScore: Math.round(Number(report.healthScore)),
          nutrientStatusJson: report.nutrientStatusJson,
          deficienciesJson: report.deficienciesJson,
          suggestedCropsJson: report.suggestedCropsJson,
          fertilizerGuidance: report.fertilizerGuidance,
          improvementTips: report.improvementTips,
          createdAt: report.createdAt || new Date(),
        },
      });
    } catch (err) {
      console.warn('⚠️ Error persisting soil report to SQLite:', err);
    }
  }

  public async persistCropRecommendation(rec: any): Promise<void> {
    try {
      const { prisma } = await import('../config/db');
      const validUserId = this.users.some(u => u.id === rec.userId) ? rec.userId : null;
      await prisma.cropRecommendation.create({
        data: {
          id: rec.id,
          userId: validUserId,
          soilType: rec.input?.soilType || 'Alluvial',
          soilPh: Number(rec.input?.soilPh || 6.8),
          nitrogen: Number(rec.input?.nitrogen || 200),
          phosphorus: Number(rec.input?.phosphorus || 20),
          potassium: Number(rec.input?.potassium || 180),
          temperature: Number(rec.input?.temperature || 28),
          humidity: Number(rec.input?.humidity || 65),
          rainfall: Number(rec.input?.rainfall || 1000),
          season: rec.input?.season || 'Kharif',
          location: rec.input?.location || 'Tamil Nadu',
          irrigation: rec.input?.irrigation || 'Borewell',
          previousCrop: rec.input?.previousCrop || null,
          recommendationsJson: JSON.stringify(rec.recommendations || []),
          createdAt: rec.createdAt || new Date(),
        },
      });
    } catch (err) {
      console.warn('⚠️ Error persisting crop recommendation to SQLite:', err);
    }
  }

  public async persistScheme(scheme: any): Promise<void> {
    try {
      const { prisma } = await import('../config/db');
      await prisma.governmentScheme.upsert({
        where: { id: scheme.id },
        update: {
          nameEn: scheme.nameEn,
          nameTa: scheme.nameTa,
          category: scheme.category,
          descriptionEn: scheme.descriptionEn,
          descriptionTa: scheme.descriptionTa,
          eligibilityEn: scheme.eligibilityEn,
          eligibilityTa: scheme.eligibilityTa,
          benefitsEn: scheme.benefitsEn,
          benefitsTa: scheme.benefitsTa,
          documentsEn: scheme.documentsEn,
          documentsTa: scheme.documentsTa,
          applicationProcess: scheme.applicationProcess,
          officialUrl: scheme.officialUrl,
          updatedAt: new Date(),
        },
        create: {
          id: scheme.id,
          nameEn: scheme.nameEn,
          nameTa: scheme.nameTa,
          category: scheme.category,
          descriptionEn: scheme.descriptionEn,
          descriptionTa: scheme.descriptionTa,
          eligibilityEn: scheme.eligibilityEn,
          eligibilityTa: scheme.eligibilityTa,
          benefitsEn: scheme.benefitsEn,
          benefitsTa: scheme.benefitsTa,
          documentsEn: scheme.documentsEn,
          documentsTa: scheme.documentsTa,
          applicationProcess: scheme.applicationProcess,
          officialUrl: scheme.officialUrl,
          createdAt: scheme.createdAt || new Date(),
          updatedAt: scheme.updatedAt || new Date(),
        },
      });
    } catch (err) {
      console.warn('⚠️ Error persisting scheme to SQLite:', err);
    }
  }

  public async deleteScheme(id: string): Promise<void> {
    try {
      const { prisma } = await import('../config/db');
      await prisma.governmentScheme.delete({ where: { id } }).catch(() => {});
    } catch (err) {}
  }

  public async persistNotification(notif: any): Promise<void> {
    try {
      const { prisma } = await import('../config/db');
      const validUserId = this.users.some(u => u.id === notif.userId) ? notif.userId : this.users[0]?.id;
      if (!validUserId) return;
      await prisma.notification.upsert({
        where: { id: notif.id },
        update: {
          isRead: notif.isRead,
        },
        create: {
          id: notif.id,
          userId: validUserId,
          titleEn: notif.titleEn,
          titleTa: notif.titleTa || notif.titleEn,
          messageEn: notif.messageEn,
          messageTa: notif.messageTa || notif.messageEn,
          type: notif.type || 'GENERAL',
          isRead: Boolean(notif.isRead),
          actionUrl: notif.actionUrl || null,
          createdAt: notif.createdAt || new Date(),
        },
      });
    } catch (err) {
      console.warn('⚠️ Error persisting notification to SQLite:', err);
    }
  }

  public async persistChatSession(session: any): Promise<void> {
    try {
      const { prisma } = await import('../config/db');
      const validUserId = this.users.some(u => u.id === session.userId) ? session.userId : null;
      await prisma.chatSession.upsert({
        where: { id: session.id },
        update: {
          title: session.title,
          updatedAt: new Date(),
        },
        create: {
          id: session.id,
          userId: validUserId,
          title: session.title,
          createdAt: session.createdAt || new Date(),
          updatedAt: new Date(),
        },
      });
    } catch (err) {
      console.warn('⚠️ Error persisting chat session to SQLite:', err);
    }
  }

  public async persistChatMessage(sessionId: string, msg: any): Promise<void> {
    try {
      const { prisma } = await import('../config/db');
      await prisma.chatMessage.create({
        data: {
          id: msg.id,
          sessionId: sessionId,
          sender: msg.sender,
          message: msg.message,
          language: msg.language || 'en',
          createdAt: msg.createdAt || new Date(),
        },
      });
    } catch (err) {
      console.warn('⚠️ Error persisting chat message to SQLite:', err);
    }
  }

  public async persistPayment(payment: any): Promise<void> {
    try {
      const { prisma } = await import('../config/db');
      await prisma.payment.upsert({
        where: { merchantTxnId: payment.merchantTxnId },
        update: {
          status: payment.status,
          providerTxnId: payment.providerTxnId || null,
          phonePeTransactionId: payment.phonePeTransactionId || null,
          updatedAt: new Date(),
        },
        create: {
          id: payment.id || `pay-${uuidv4().slice(0, 8)}`,
          orderId: payment.orderId,
          merchantTxnId: payment.merchantTxnId,
          amount: Number(payment.amount),
          status: payment.status || 'PENDING',
          paymentMode: payment.paymentMode || 'PHONEPE_MOCK',
          providerTxnId: payment.providerTxnId || null,
          phonePeTransactionId: payment.phonePeTransactionId || null,
          checksum: payment.checksum || null,
          createdAt: payment.createdAt || new Date(),
          updatedAt: payment.updatedAt || new Date(),
        },
      });
    } catch (err) {
      console.warn('⚠️ Error persisting payment to SQLite:', err);
    }
  }

  public async addNotification(notif: any): Promise<void> {
    this.notifications.unshift(notif);
    await this.persistNotification(notif);
  }
}

export const dataStore = new InMemoryDataStore();

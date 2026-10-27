import { prisma } from '../config/db';
import {
  defaultUsers,
  defaultFarms,
  defaultProducts,
  defaultMarketPrices,
  defaultGovernmentSchemes,
  defaultEquipments,
  defaultNotifications,
} from './mockSeedData';

export async function seedDatabase() {
  try {
    console.log('🌱 Checking SQLite database tables...');

    // Seed Users
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      console.log('🌱 Seeding default users into SQLite...');
      for (const u of defaultUsers) {
        await prisma.user.upsert({
          where: { id: u.id },
          update: {},
          create: {
            id: u.id,
            fullName: u.fullName,
            mobileNumber: u.mobileNumber,
            email: u.email,
            passwordHash: u.passwordHash,
            state: u.state,
            district: u.district,
            village: u.village,
            role: u.role,
            avatarUrl: u.avatarUrl,
            createdAt: u.createdAt,
            updatedAt: u.updatedAt,
          },
        });
      }
      console.log(`✅ Seeded ${defaultUsers.length} users.`);
    }

    // Seed Farms
    const farmCount = await prisma.farm.count();
    if (farmCount === 0) {
      console.log('🌱 Seeding default farms into SQLite...');
      for (const f of defaultFarms) {
        await prisma.farm.upsert({
          where: { id: f.id },
          update: {},
          create: {
            id: f.id,
            userId: f.userId,
            name: f.name,
            surveyNumber: f.surveyNumber,
            sizeAcres: f.sizeAcres,
            soilType: f.soilType,
            currentCrop: f.currentCrop,
            plantingDate: f.plantingDate,
            expectedHarvest: f.expectedHarvest,
            irrigationType: f.irrigationType,
            location: f.location,
            createdAt: f.createdAt,
            updatedAt: f.updatedAt,
          },
        });
      }
      console.log(`✅ Seeded ${defaultFarms.length} farms.`);
    }

    // Seed Products
    const productCount = await prisma.product.count();
    if (productCount === 0) {
      console.log('🌱 Seeding default products into SQLite...');
      for (const p of defaultProducts) {
        await prisma.product.upsert({
          where: { id: p.id },
          update: {},
          create: {
            id: p.id,
            sellerId: p.sellerId,
            name: p.name,
            category: p.category,
            quantity: p.quantity,
            availableQuantity: p.availableQuantity,
            unit: p.unit,
            price: p.price,
            description: p.description,
            location: p.location,
            district: p.district,
            state: p.state,
            harvestDate: p.harvestDate,
            imageUrl: p.imageUrl,
            isActive: p.isActive,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
          },
        });
      }
      console.log(`✅ Seeded ${defaultProducts.length} products.`);
    }

    // Seed Market Prices
    const marketCount = await prisma.marketPrice.count();
    if (marketCount === 0) {
      console.log('🌱 Seeding market prices into SQLite...');
      for (const m of defaultMarketPrices) {
        await prisma.marketPrice.upsert({
          where: { id: m.id },
          update: {},
          create: {
            id: m.id,
            cropName: m.cropName,
            cropNameTa: m.cropNameTa,
            marketName: m.marketName,
            district: m.district,
            state: m.state,
            minPrice: m.minPrice,
            maxPrice: m.maxPrice,
            modalPrice: m.modalPrice,
            priceDate: m.priceDate,
            unit: m.unit,
          },
        });
      }
      console.log(`✅ Seeded ${defaultMarketPrices.length} market prices.`);
    }

    // Seed Government Schemes
    const schemeCount = await prisma.governmentScheme.count();
    if (schemeCount === 0) {
      console.log('🌱 Seeding government schemes into SQLite...');
      for (const s of defaultGovernmentSchemes) {
        await prisma.governmentScheme.upsert({
          where: { id: s.id },
          update: {},
          create: {
            id: s.id,
            nameEn: s.nameEn,
            nameTa: s.nameTa,
            category: s.category,
            descriptionEn: s.descriptionEn,
            descriptionTa: s.descriptionTa,
            eligibilityEn: s.eligibilityEn,
            eligibilityTa: s.eligibilityTa,
            benefitsEn: s.benefitsEn,
            benefitsTa: s.benefitsTa,
            documentsEn: s.documentsEn,
            documentsTa: s.documentsTa,
            applicationProcess: s.applicationProcess,
            officialUrl: s.officialUrl,
          },
        });
      }
      console.log(`✅ Seeded ${defaultGovernmentSchemes.length} schemes.`);
    }

    // Seed Equipment
    const eqCount = await prisma.equipment.count();
    if (eqCount === 0) {
      console.log('🌱 Seeding equipment into SQLite...');
      for (const e of defaultEquipments) {
        await prisma.equipment.upsert({
          where: { id: e.id },
          update: {},
          create: {
            id: e.id,
            name: e.name,
            nameTa: e.nameTa,
            type: e.type,
            hourlyRate: e.hourlyRate,
            dailyRate: e.dailyRate,
            imageUrl: e.imageUrl,
            description: e.description,
            isAvailable: e.isAvailable,
          },
        });
      }
      console.log(`✅ Seeded ${defaultEquipments.length} equipment entries.`);
    }

    // Seed Equipment Requests
    const eqReqCount = await prisma.equipmentRequest.count();
    if (eqReqCount === 0) {
      console.log('🌱 Seeding equipment requests into SQLite...');
      await prisma.equipmentRequest.upsert({
        where: { id: 'eq-req-01' },
        update: {},
        create: {
          id: 'eq-req-01',
          userId: 'user-farmer-01',
          equipmentType: 'Tractor',
          equipmentId: 'eq-01',
          requestDate: new Date('2026-09-18'),
          startTime: '07:00 AM',
          durationHours: 6,
          location: 'Kabisthalam Village, Thanjavur',
          description: 'Plowing and leveling 4.5 acres for upcoming samba paddy season',
          contactPhone: '9876543210',
          status: 'ACCEPTED',
          totalCost: 5100,
          createdAt: new Date('2026-09-11T10:00:00Z'),
        },
      });
      console.log('✅ Seeded default equipment requests.');
    }

    // Seed Labour Requests
    const labReqCount = await prisma.labourRequest.count();
    if (labReqCount === 0) {
      console.log('🌱 Seeding labour requests into SQLite...');
      await prisma.labourRequest.upsert({
        where: { id: 'lab-req-01' },
        update: {},
        create: {
          id: 'lab-req-01',
          userId: 'user-farmer-01',
          workType: 'Weeding & De-trashing',
          workerCount: 5,
          workDate: new Date('2026-09-20'),
          durationDays: 2,
          location: 'Sundar Garden, Papanasam',
          budgetPerWorker: 500,
          requirements: 'Manual weeding in banana orchard; lunch and morning tea provided',
          contactPhone: '9876543210',
          status: 'REQUESTED',
          createdAt: new Date('2026-09-11T11:30:00Z'),
        },
      });
      console.log('✅ Seeded default labour requests.');
    }

    // Seed Logistics Requests
    const logReqCount = await prisma.logisticsRequest.count();
    if (logReqCount === 0) {
      console.log('🌱 Seeding logistics requests into SQLite...');
      await prisma.logisticsRequest.upsert({
        where: { id: 'log-req-01' },
        update: {},
        create: {
          id: 'log-req-01',
          userId: 'user-farmer-01',
          pickupLocation: 'Kabisthalam Farm Gate, Thanjavur',
          deliveryLocation: 'Thanjavur APMC Regulated Market',
          cropName: 'Paddy BPT 5204',
          quantityTons: 10,
          vehicleType: '10-Wheeler Lorry',
          preferredDate: new Date('2026-09-22'),
          contactPhone: '9876543210',
          notes: 'Road is asphalted up to the farm gate; tarpaulin cover required for rain protection',
          status: 'Assigned',
          estimatedCost: 4500,
          createdAt: new Date('2026-09-11T12:00:00Z'),
        },
      });
      console.log('✅ Seeded default logistics requests.');
    }

    // Seed Notifications
    const notifCount = await prisma.notification.count();
    if (notifCount === 0) {
      console.log('🌱 Seeding notifications into SQLite...');
      for (const n of defaultNotifications) {
        await prisma.notification.upsert({
          where: { id: n.id },
          update: {},
          create: {
            id: n.id,
            userId: n.userId,
            titleEn: n.titleEn,
            titleTa: n.titleTa,
            messageEn: n.messageEn,
            messageTa: n.messageTa,
            type: n.type,
            isRead: n.isRead,
            actionUrl: n.actionUrl,
            createdAt: n.createdAt,
          },
        });
      }
      console.log(`✅ Seeded ${defaultNotifications.length} notifications.`);
    }

    // Seed Orders
    const orderCount = await prisma.order.count();
    if (orderCount === 0) {
      console.log('🌱 Seeding initial orders into SQLite...');
      await prisma.order.upsert({
        where: { id: 'order-01' },
        update: {},
        create: {
          id: 'order-01',
          orderNumber: 'AGRI-2026-9821',
          buyerId: 'user-buyer-01',
          totalAmount: 6850,
          orderStatus: 'CONFIRMED',
          paymentStatus: 'COMPLETED',
          deliveryAddress: 'Plot 14, Green Garden, Adyar, Chennai - 600020',
          contactPhone: '9876543211',
          createdAt: new Date('2026-09-10T14:30:00Z'),
          updatedAt: new Date('2026-09-10T15:00:00Z'),
          items: {
            create: [
              {
                id: 'oi-01',
                productId: 'prod-01',
                productName: 'Premium Sona Masoori Paddy (BPT 5204)',
                quantity: 2,
                unit: 'quintal',
                unitPrice: 2450,
                totalPrice: 4900,
              },
              {
                id: 'oi-02',
                productId: 'prod-02',
                productName: 'Farm-Fresh Country Tomatoes (Naatu Thakkali)',
                quantity: 3,
                unit: 'crate',
                unitPrice: 650,
                totalPrice: 1950,
              },
            ],
          },
        },
      });

      // Seed Initial Payment
      await prisma.payment.upsert({
        where: { merchantTxnId: 'TXN_AGRI-2026-9821_1725978600' },
        update: {},
        create: {
          id: 'pay-01',
          orderId: 'order-01',
          merchantTxnId: 'TXN_AGRI-2026-9821_1725978600',
          amount: 6850,
          status: 'COMPLETED',
          paymentMode: 'PHONEPE_MOCK',
          providerTxnId: 'PPROV_98213876',
          createdAt: new Date('2026-09-10T14:35:00Z'),
          updatedAt: new Date('2026-09-10T14:36:00Z'),
        },
      });
      console.log('✅ Seeded default orders and payment records.');
    }

    // Seed Disease Scan
    const scanCount = await prisma.diseaseScan.count();
    if (scanCount === 0) {
      console.log('🌱 Seeding initial disease diagnosis scan into SQLite...');
      await prisma.diseaseScan.upsert({
        where: { id: 'scan-01' },
        update: {},
        create: {
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
          createdAt: new Date('2026-09-08T09:15:00Z'),
        },
      });
      console.log('✅ Seeded default disease scan diagnosis.');
    }

    // Seed Soil Report
    const soilCount = await prisma.soilReport.count();
    if (soilCount === 0) {
      console.log('🌱 Seeding initial soil health report into SQLite...');
      await prisma.soilReport.upsert({
        where: { id: 'soil-01' },
        update: {},
        create: {
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
            organicCarbon: 'Medium',
          }),
          deficienciesJson: JSON.stringify(['Nitrogen slightly below recommended baseline for tillering stage']),
          suggestedCropsJson: JSON.stringify(['Paddy', 'Banana', 'Sugarcane', 'Cotton', 'Black Gram']),
          fertilizerGuidance: 'Top-dress Urea @ 45 kg/acre in two split doses. Apply Neem cake @ 100 kg/acre to boost microbial activity.',
          improvementTips: 'Incorporate green manure crops like Sunnhemp or Dhaincha before the next planting season.',
          createdAt: new Date('2026-08-20T11:00:00Z'),
        },
      });
      console.log('✅ Seeded default soil health report.');
    }

    // Seed Crop Recommendation
    const cropRecCount = await prisma.cropRecommendation.count();
    if (cropRecCount === 0) {
      console.log('🌱 Seeding initial crop recommendation into SQLite...');
      await prisma.cropRecommendation.upsert({
        where: { id: 'rec-01' },
        update: {},
        create: {
          id: 'rec-01',
          userId: 'user-farmer-01',
          soilType: 'Alluvial',
          soilPh: 6.8,
          nitrogen: 210,
          phosphorus: 25,
          potassium: 190,
          temperature: 30,
          humidity: 68,
          rainfall: 1100,
          season: 'Kharif',
          location: 'Thanjavur, Tamil Nadu',
          irrigation: 'Canal & Borewell',
          recommendationsJson: JSON.stringify([
            {
              cropNameEn: 'Paddy / Rice (Samba)',
              cropNameTa: 'நெல் (சம்பா)',
              suitabilityScore: 96,
              expectedYieldTonsPerAcre: 2.8,
              expectedProfitPerAcre: 48000,
              growthPeriodDays: 135,
              season: 'Kharif',
              waterRequirement: 'High',
            },
            {
              cropNameEn: 'Banana (Grand Naine)',
              cropNameTa: 'வாழை',
              suitabilityScore: 89,
              expectedYieldTonsPerAcre: 18,
              expectedProfitPerAcre: 85000,
              growthPeriodDays: 330,
              season: 'Year-round',
              waterRequirement: 'High',
            },
          ]),
          createdAt: new Date('2026-09-01T10:00:00Z'),
        },
      });
      console.log('✅ Seeded default crop recommendation.');
    }

    // Seed Chat Session
    const chatCount = await prisma.chatSession.count();
    if (chatCount === 0) {
      console.log('🌱 Seeding initial AI chat session into SQLite...');
      await prisma.chatSession.upsert({
        where: { id: 'session-01' },
        update: {},
        create: {
          id: 'session-01',
          userId: 'user-farmer-01',
          title: 'Managing Paddy Bacterial Leaf Blight',
          createdAt: new Date('2026-09-08T10:00:00Z'),
          updatedAt: new Date('2026-09-08T10:05:00Z'),
          messages: {
            create: [
              {
                id: 'msg-01',
                sender: 'USER',
                message: 'My paddy leaves have yellow tips turning wavy white. What medicine should I spray?',
                language: 'en',
                createdAt: new Date('2026-09-08T10:00:00Z'),
              },
              {
                id: 'msg-02',
                sender: 'BOT',
                message: 'This is characteristic of Bacterial Leaf Blight. Recommended remedy: Spray Copper Oxychloride 50% WP @ 500g/acre mixed with Streptocycline @ 6g/acre in 200 liters of water during cool morning hours.',
                language: 'en',
                createdAt: new Date('2026-09-08T10:01:00Z'),
              },
            ],
          },
        },
      });
      console.log('✅ Seeded default chat session and messages.');
    }

    console.log('🎉 SQLite database seeded successfully.');
  } catch (error) {
    console.error('⚠️ Error during SQLite seeding:', error);
  }
}

// Allow direct execution: `npm run seed`
if (require.main === module) {
  seedDatabase().then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

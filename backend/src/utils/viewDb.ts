import { prisma } from '../config/db';

async function main() {
  console.log('\n📊 === AgriOne AI SQLite Database Summary ===\n');

  const [
    users,
    farms,
    products,
    orders,
    payments,
    diseaseScans,
    soilReports,
    cropRecs,
    equipments,
    eqRequests,
    labourRequests,
    logisticsRequests,
    schemes,
    marketPrices,
    notifications,
    chatSessions
  ] = await Promise.all([
    prisma.user.findMany({ select: { id: true, fullName: true, email: true, role: true, district: true } }),
    prisma.farm.findMany({ select: { id: true, name: true, sizeAcres: true, soilType: true, currentCrop: true } }),
    prisma.product.findMany({ select: { id: true, name: true, category: true, price: true, quantity: true, unit: true } }),
    prisma.order.findMany({ select: { id: true, orderNumber: true, totalAmount: true, orderStatus: true, paymentStatus: true } }),
    prisma.payment.findMany({ select: { id: true, merchantTxnId: true, amount: true, status: true, paymentMode: true } }),
    prisma.diseaseScan.findMany({ select: { id: true, cropName: true, diseaseName: true, severity: true, confidence: true } }),
    prisma.soilReport.findMany({ select: { id: true, soilType: true, ph: true, healthScore: true } }),
    prisma.cropRecommendation.findMany({ select: { id: true, soilType: true, season: true, location: true } }),
    prisma.equipment.findMany({ select: { id: true, name: true, type: true, dailyRate: true } }),
    prisma.equipmentRequest.findMany({ select: { id: true, equipmentType: true, durationHours: true, totalCost: true, status: true } }),
    prisma.labourRequest.findMany({ select: { id: true, workType: true, workerCount: true, durationDays: true, status: true } }),
    prisma.logisticsRequest.findMany({ select: { id: true, cropName: true, quantityTons: true, vehicleType: true, status: true } }),
    prisma.governmentScheme.findMany({ select: { id: true, nameEn: true, category: true } }),
    prisma.marketPrice.findMany({ select: { id: true, cropName: true, marketName: true, modalPrice: true, unit: true } }),
    prisma.notification.findMany({ select: { id: true, titleEn: true, type: true, isRead: true } }),
    prisma.chatSession.findMany({ select: { id: true, title: true, createdAt: true } }),
  ]);

  console.log('📋 === RECORD COUNTS IN dev.db ===');
  console.table([
    { Model: 'User', Count: users.length },
    { Model: 'Farm', Count: farms.length },
    { Model: 'Product', Count: products.length },
    { Model: 'Order', Count: orders.length },
    { Model: 'Payment', Count: payments.length },
    { Model: 'DiseaseScan', Count: diseaseScans.length },
    { Model: 'SoilReport', Count: soilReports.length },
    { Model: 'CropRecommendation', Count: cropRecs.length },
    { Model: 'Equipment', Count: equipments.length },
    { Model: 'EquipmentRequest', Count: eqRequests.length },
    { Model: 'LabourRequest', Count: labourRequests.length },
    { Model: 'LogisticsRequest', Count: logisticsRequests.length },
    { Model: 'GovernmentScheme', Count: schemes.length },
    { Model: 'MarketPrice', Count: marketPrices.length },
    { Model: 'Notification', Count: notifications.length },
    { Model: 'ChatSession', Count: chatSessions.length },
  ]);

  if (users.length > 0) {
    console.log(`\n👤 Users (${users.length}):`);
    console.table(users);
  }

  if (products.length > 0) {
    console.log(`\n🌾 Products (${products.length}):`);
    console.table(products.slice(0, 5));
  }

  if (equipments.length > 0) {
    console.log(`\n⚙️ Equipments (${equipments.length}):`);
    console.table(equipments);
  }

  if (eqRequests.length > 0) {
    console.log(`\n🚜 Equipment Requests (${eqRequests.length}):`);
    console.table(eqRequests);
  }

  if (labourRequests.length > 0) {
    console.log(`\n👥 Labour Requests (${labourRequests.length}):`);
    console.table(labourRequests);
  }

  if (logisticsRequests.length > 0) {
    console.log(`\n🚚 Logistics Requests (${logisticsRequests.length}):`);
    console.table(logisticsRequests);
  }

  await prisma.$disconnect();
}

main().catch(console.error);

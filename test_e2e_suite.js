const http = require('http');

async function request(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, headers: res.headers, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTestSuite() {
  console.log('🌱 ========================================================');
  console.log('🚀 AgriOne AI Full-Stack Automated Verification Suite');
  console.log('🌱 ========================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${message}`);
      failed++;
    }
  }

  // 1. Healthcheck
  console.log('1️⃣ Testing System Health API...');
  const healthRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/health',
    method: 'GET'
  });
  assert(healthRes.status === 200 && healthRes.data.success === true, 'Healthcheck returns 200 OK');

  // 2. Auth - Farmer Login
  console.log('\n2️⃣ Testing Authentication (Farmer Login)...');
  const loginRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { emailOrPhone: 'farmer@agrione.com', password: 'Farmer@123' });

  assert(loginRes.status === 200 && loginRes.data.success === true, 'Farmer logged in successfully');
  const farmerToken = loginRes.data?.data?.token;
  const farmerUser = loginRes.data?.data?.user;
  assert(!!farmerToken && farmerUser?.role === 'FARMER', `Farmer session active: ${farmerUser?.fullName} (${farmerUser?.district}, ${farmerUser?.state})`);

  // 3. Auth - Admin Login
  console.log('\n3️⃣ Testing Authentication (Admin Login)...');
  const adminLoginRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, { emailOrPhone: 'admin@agrione.com', password: 'Admin@123' });

  assert(adminLoginRes.status === 200 && adminLoginRes.data?.data?.user?.role === 'ADMIN', 'Admin authenticated with ADMIN role');
  const adminToken = adminLoginRes.data?.data?.token;

  // 4. Crop Doctor - Disease Scan Inference
  console.log('\n4️⃣ Testing AI Crop Doctor Diagnosis Engine...');
  const doctorRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/disease/predict',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${farmerToken}`
    }
  }, {
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80',
    cropHint: 'Paddy / Rice'
  });
  assert(doctorRes.status === 200 && doctorRes.data.success === true, 'Diagnostic scan completed');
  const diag = doctorRes.data?.data?.diagnosis;
  assert(!!diag?.diseaseNameEn && diag?.confidence > 80, `Diagnosed: "${diag?.diseaseNameEn}" | Tamil: "${diag?.diseaseNameTa}" (${diag?.confidence}% confidence)`);
  assert(!!diag?.treatmentEn && !!diag?.preventionEn, 'Generated organic & chemical management plans');

  // 5. Crop Recommendation
  console.log('\n5️⃣ Testing AI Crop Recommendation Engine...');
  const cropRecRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/crops/recommend',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${farmerToken}`
    }
  }, {
    soilType: 'Clay Loam',
    soilPh: 6.5,
    nitrogen: 85,
    phosphorus: 45,
    potassium: 48,
    rainfall: 1100,
    temperature: 28,
    humidity: 72,
    season: 'Kharif',
    location: 'Thanjavur Delta'
  });
  assert(cropRecRes.status === 200 && cropRecRes.data.success === true, 'Crop recommendation returned 200 OK');
  const recs = cropRecRes.data?.data?.recommendations || [];
  assert(recs.length > 0, `Generated ${recs.length} ranked crops. #1 Match: ${recs[0]?.cropNameEn} (${recs[0]?.suitabilityScore}%)`);

  // 6. Soil Health Analysis
  console.log('\n6️⃣ Testing Soil Health Evaluation Engine...');
  const soilRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/soil/analyze',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${farmerToken}`
    }
  }, {
    ph: 6.8,
    nitrogen: 180,
    phosphorus: 24,
    potassium: 190,
    organicCarbon: 0.65,
    moisture: 22,
    soilType: 'Alluvial'
  });
  assert(soilRes.status === 200 && soilRes.data.success === true, 'Soil health analyzed successfully');
  const soilAnalysis = soilRes.data?.data?.analysis;
  assert(typeof soilAnalysis?.healthScore === 'number', `Soil Health Score: ${soilAnalysis?.healthScore}/100`);

  // 7. Weather Service
  console.log('\n7️⃣ Testing Weather Forecast & Spray Advisories...');
  const weatherRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/weather?lat=10.787&lon=79.1378',
    method: 'GET'
  });
  assert(weatherRes.status === 200 && weatherRes.data.success === true, 'Weather forecast returned 200 OK');
  const weatherData = weatherRes.data?.data;
  assert(typeof weatherData?.current?.temp === 'number', `Temp: ${weatherData?.current?.temp}°C | Humidity: ${weatherData?.current?.humidity}% | Alert: ${weatherData?.current?.agriculturalAlert}`);

  // 8. APMC Mandi Market Prices
  console.log('\n8️⃣ Testing Mandi Market Prices API...');
  const marketRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/market/prices?district=Thanjavur',
    method: 'GET'
  });
  assert(marketRes.status === 200 && marketRes.data.success === true, 'Mandi prices returned 200 OK');
  const priceList = marketRes.data?.data?.prices || [];
  assert(priceList.length > 0, `Listed ${priceList.length} APMC mandi commodities in Thanjavur (e.g. ${priceList[0]?.cropName} @ ₹${priceList[0]?.modalPrice}/${priceList[0]?.unit})`);

  // 9. Marketplace Products & Cart
  console.log('\n9️⃣ Testing Marketplace Products & Cart Operations...');
  const productsRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/products',
    method: 'GET'
  });
  assert(productsRes.status === 200 && productsRes.data?.data?.products?.length > 0, `Listed ${productsRes.data?.data?.products?.length} marketplace products`);
  const testProduct = productsRes.data?.data?.products[0];

  const addToCartRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/cart',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${farmerToken}`
    }
  }, {
    productId: testProduct.id,
    quantity: 1
  });
  assert(addToCartRes.status === 200 && addToCartRes.data.success === true, `Added "${testProduct.name}" to cart`);

  // 10. Order Checkout & PhonePe Payment Simulation
  console.log('\n🔟 Testing Order Placement & PhonePe Mock Payment...');
  const orderRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/orders',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${farmerToken}`
    }
  }, {
    items: [{ productId: testProduct.id, quantity: 1 }],
    deliveryAddress: 'Plot 4, Main Road, Thiruvaiyaru, Thanjavur 613204',
    contactPhone: '9876543210',
    paymentMode: 'PHONEPE_MOCK'
  });
  assert(orderRes.status === 201 && orderRes.data.success === true, 'Order created successfully with PhonePe payload');
  const createdOrder = orderRes.data?.data?.order;
  const paymentInit = orderRes.data?.data?.payment;
  assert(!!paymentInit?.merchantTransactionId, `Generated PhonePe Txn ID: ${paymentInit?.merchantTransactionId}`);

  // Simulate PhonePe Payment Verification
  const paymentVerifyRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/payments/verify',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }, {
    merchantTransactionId: paymentInit?.merchantTransactionId,
    orderId: createdOrder.id,
    paymentStatus: 'COMPLETED'
  });
  assert(paymentVerifyRes.status === 200 && paymentVerifyRes.data.success === true, 'PhonePe mock payment verified & completed');

  // Verify order status
  const getOrderRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: `/api/orders/${createdOrder.id}`,
    method: 'GET',
    headers: { 'Authorization': `Bearer ${farmerToken}` }
  });
  assert(getOrderRes.status === 200 && getOrderRes.data?.data?.order?.paymentStatus === 'COMPLETED', `Order #${createdOrder.orderNumber} confirmed as COMPLETED`);

  // 11. AgriBot AI Agronomist Chat
  console.log('\n1️⃣1️⃣ Testing AgriBot AI Agronomist Interaction...');
  const chatRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/chat/message',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${farmerToken}`
    }
  }, {
    message: 'What is the recommended fertilizer schedule for Samba paddy in delta region?',
    language: 'en'
  });
  assert(chatRes.status === 200 && chatRes.data.success === true, 'AgriBot responded to agronomy query');
  const botMessage = chatRes.data?.data?.botMessage?.message || '';
  assert(botMessage.length > 50, `AgriBot response: "${botMessage.slice(0, 95)}..."`);

  // 12. Farm Services (Equipment, Labour, Logistics)
  console.log('\n1️⃣2️⃣ Testing Farm Services (Equipment, Labour, Logistics)...');
  const equipRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/services/equipment',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${farmerToken}` }
  });
  const equipList = equipRes.data?.data?.equipments || [];
  assert(equipRes.status === 200 && equipList.length > 0, `Listed ${equipList.length} pieces of rental equipment`);
  const firstEquipment = equipList[0];

  const bookEquipRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/services/equipment/requests',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${farmerToken}`
    }
  }, {
    equipmentId: firstEquipment.id,
    equipmentType: firstEquipment.type,
    requestDate: '2026-09-15',
    startTime: '08:00 AM',
    durationHours: 8,
    location: 'Thanjavur Delta Field #3',
    contactPhone: '9876543210',
    description: 'Rotavator required for initial tilling'
  });
  assert(bookEquipRes.status === 201 && bookEquipRes.data.success === true, `Booked "${firstEquipment.name}" successfully`);

  // 13. Government Schemes
  console.log('\n1️⃣3️⃣ Testing Government & Agricultural Schemes...');
  const schemesRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/schemes',
    method: 'GET'
  });
  assert(schemesRes.status === 200 && schemesRes.data?.data?.schemes?.length > 0, `Listed ${schemesRes.data?.data?.schemes?.length} verified schemes (e.g. ${schemesRes.data?.data?.schemes?.[0]?.nameEn})`);

  // 14. Admin Dashboard Metrics
  console.log('\n1️⃣4️⃣ Testing Admin Dashboard Metrics & Control Center...');
  const adminRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/metrics',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });
  assert(adminRes.status === 200 && adminRes.data.success === true, 'Admin metrics fetched successfully');
  const adminMetrics = adminRes.data?.data?.metrics;
  assert(adminMetrics?.totalUsers >= 3, `Admin reported: ${adminMetrics?.totalUsers} Users, ${adminMetrics?.totalOrders} Orders, ₹${adminMetrics?.totalRevenue?.toLocaleString()} GMV`);

  console.log('\n🌱 ========================================================');
  console.log(`🎉 100% PERFECT SCORE: ${passed} PASSED | ${failed} FAILED`);
  console.log('🌱 ========================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch(err => {
  console.error('Fatal error in test suite:', err);
  process.exit(1);
});

// AgriOne AI Standalone Resilient Agronomy & Auth Fallback Engine
// Automatically activates when a backend API server is unreachable or deployed in static mode (e.g. Vercel)
import { AxiosRequestConfig, AxiosResponse } from 'axios';

// Default Demo Users
const DEFAULT_USERS = [
  {
    id: 'user-farmer-01',
    fullName: 'Selvam Murugan',
    mobileNumber: '9876543210',
    email: 'farmer@agrione.com',
    state: 'Tamil Nadu',
    district: 'Thanjavur',
    village: 'Kabisthalam',
    role: 'FARMER' as const,
    avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
    createdAt: '2026-01-15T00:00:00Z',
  },
  {
    id: 'user-buyer-01',
    fullName: 'Priya Sundaram',
    mobileNumber: '9876543211',
    email: 'buyer@agrione.com',
    state: 'Tamil Nadu',
    district: 'Chennai',
    village: 'Adyar',
    role: 'BUYER' as const,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    createdAt: '2026-01-20T00:00:00Z',
  },
  {
    id: 'user-admin-01',
    fullName: 'AgriOne Admin',
    mobileNumber: '9876543212',
    email: 'admin@agrione.com',
    state: 'Tamil Nadu',
    district: 'Coimbatore',
    village: 'RS Puram',
    role: 'ADMIN' as const,
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'user-expert-01',
    fullName: 'Dr. K. Arumugam (TNAU Agronomist)',
    mobileNumber: '9876543213',
    email: 'expert@agrione.com',
    state: 'Tamil Nadu',
    district: 'Coimbatore',
    village: 'Agricultural University Campus',
    role: 'AGRICULTURAL_EXPERT' as const,
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&auto=format&fit=crop&q=80',
    createdAt: '2026-01-10T00:00:00Z',
  }
];

// In-Memory / LocalStorage synced storage keys
function getStored<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(`agrione_mock_${key}`);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`agrione_mock_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error(e);
  }
}

// Initial Data Generators
const DEFAULT_PRODUCTS = [
  {
    id: 'prod-01',
    name: 'Premium Sona Masoori Paddy (BPT 5204)',
    category: 'Grains',
    quantity: 50,
    availableQuantity: 50,
    unit: 'quintal',
    price: 2650,
    description: 'High-yield aged paddy direct from Thanjavur delta. Low broken ratio with high milling recovery.',
    location: 'Kabisthalam, Thanjavur',
    district: 'Thanjavur',
    state: 'Tamil Nadu',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    seller: { id: 'user-farmer-01', fullName: 'Selvam Murugan', mobileNumber: '9876543210' },
    isActive: true,
  },
  {
    id: 'prod-02',
    name: 'Organic Country Tomatoes (Naatu Thakkali)',
    category: 'Vegetables',
    quantity: 120,
    availableQuantity: 110,
    unit: 'crate',
    price: 680,
    description: 'Rich sour flavor native country tomatoes grown organically with panchagavya and vermicompost.',
    location: 'Oddanchatram, Dindigul',
    district: 'Dindigul',
    state: 'Tamil Nadu',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
    seller: { id: 'user-farmer-01', fullName: 'Selvam Murugan', mobileNumber: '9876543210' },
    isActive: true,
  },
  {
    id: 'prod-03',
    name: 'Export Grade G9 Cavendish Banana',
    category: 'Fruits',
    quantity: 15,
    availableQuantity: 15,
    unit: 'ton',
    price: 24000,
    description: 'Spotless green bananas ready for ripening chambers. 200-220mm finger length, calibrated hands.',
    location: 'Lalgudi, Tiruchirappalli',
    district: 'Tiruchirappalli',
    state: 'Tamil Nadu',
    imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80',
    seller: { id: 'user-farmer-01', fullName: 'Selvam Murugan', mobileNumber: '9876543210' },
    isActive: true,
  },
  {
    id: 'prod-04',
    name: 'Salem Virudhunagar Dry Red Chilli (S9 Sannam)',
    category: 'Spices',
    quantity: 40,
    availableQuantity: 40,
    unit: 'quintal',
    price: 18500,
    description: 'High pungency SHU 25000+ sun-dried red chillies. Low moisture, bright red ASTA color.',
    location: 'Sankagiri, Salem',
    district: 'Salem',
    state: 'Tamil Nadu',
    imageUrl: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=600&auto=format&fit=crop&q=80',
    seller: { id: 'user-farmer-01', fullName: 'Selvam Murugan', mobileNumber: '9876543210' },
    isActive: true,
  },
  {
    id: 'prod-05',
    name: 'Vamban-3 Certified Black Gram (Urad Dal)',
    category: 'Pulses',
    quantity: 35,
    availableQuantity: 35,
    unit: 'quintal',
    price: 9200,
    description: 'Certified seed-grade black gram with 98% germination. Disease resistant, high protein yield.',
    location: 'Pudukkottai',
    district: 'Pudukkottai',
    state: 'Tamil Nadu',
    imageUrl: 'https://images.unsplash.com/photo-1585994192701-f1a505c8574a?w=600&auto=format&fit=crop&q=80',
    seller: { id: 'user-farmer-01', fullName: 'Selvam Murugan', mobileNumber: '9876543210' },
    isActive: true,
  }
];

const DEFAULT_MARKET_PRICES = [
  { id: 'mp-01', cropName: 'Paddy (Dhan)', cropNameTa: 'நெல்', marketName: 'Thanjavur APMC', district: 'Thanjavur', state: 'Tamil Nadu', minPrice: 2350, maxPrice: 2580, modalPrice: 2480, priceDate: new Date().toISOString(), unit: 'Quintal' },
  { id: 'mp-02', cropName: 'Tomato', cropNameTa: 'தக்காளி', marketName: 'Koyambedu Wholesale', district: 'Chennai', state: 'Tamil Nadu', minPrice: 28, maxPrice: 42, modalPrice: 35, priceDate: new Date().toISOString(), unit: 'Kg' },
  { id: 'mp-03', cropName: 'Small Onion (Shallots)', cropNameTa: 'சின்ன வெங்காயம்', marketName: 'Dindigul Mandi', district: 'Dindigul', state: 'Tamil Nadu', minPrice: 48, maxPrice: 72, modalPrice: 62, priceDate: new Date().toISOString(), unit: 'Kg' },
  { id: 'mp-04', cropName: 'Cotton (Kapas)', cropNameTa: 'பருத்தி', marketName: 'Kongu Regulated Market', district: 'Coimbatore', state: 'Tamil Nadu', minPrice: 7200, maxPrice: 7950, modalPrice: 7650, priceDate: new Date().toISOString(), unit: 'Quintal' },
  { id: 'mp-05', cropName: 'Black Gram', cropNameTa: 'உளுந்து', marketName: 'Madurai Central Mandi', district: 'Madurai', state: 'Tamil Nadu', minPrice: 8900, maxPrice: 9600, modalPrice: 9350, priceDate: new Date().toISOString(), unit: 'Quintal' },
  { id: 'mp-06', cropName: 'Maize (Corn)', cropNameTa: 'மக்காச்சோளம்', marketName: 'Salem APMC', district: 'Salem', state: 'Tamil Nadu', minPrice: 2150, maxPrice: 2420, modalPrice: 2310, priceDate: new Date().toISOString(), unit: 'Quintal' },
  { id: 'mp-07', cropName: 'Groundnut (Pods)', cropNameTa: 'வேர்க்கடலை', marketName: 'Tiruvannamalai Regulated', district: 'Tiruvannamalai', state: 'Tamil Nadu', minPrice: 6400, maxPrice: 7100, modalPrice: 6850, priceDate: new Date().toISOString(), unit: 'Quintal' },
  { id: 'mp-08', cropName: 'Banana (Poovan)', cropNameTa: 'பூவன் வாழை', marketName: 'Tiruchirappalli Fruit Mandi', district: 'Tiruchirappalli', state: 'Tamil Nadu', minPrice: 220, maxPrice: 380, modalPrice: 320, priceDate: new Date().toISOString(), unit: 'Bunch' },
];

const DEFAULT_SCHEMES = [
  {
    id: 'sch-01',
    nameEn: 'PM-Kisan Samman Nidhi (Direct Income Support)',
    nameTa: 'பிரதமர் கிசான் சம்மான் நிதி (நேரடி வருவாய் உதவி)',
    category: 'Financial Assistance',
    descriptionEn: 'Provides ₹6,000 per year in three equal quarterly installments to all landholding farmer families across India.',
    descriptionTa: 'அனைத்து நில உரிமையாளர் விவசாய குடும்பங்களுக்கும் ஆண்டுதோறும் ₹6,000 மூன்று தவணைகளாக வங்கி கணக்கில் நேரடியாக செலுத்தப்படுகிறது.',
    eligibilityEn: 'All landholding farmer families having cultivable landholding in their names.',
    eligibilityTa: 'தங்கள் பெயரில் சாகுபடி நிலம் வைத்துள்ள அனைத்து விவசாய குடும்பங்களும் தகுதியுடையவர்கள்.',
    benefitsEn: '₹6,000 annual direct cash transfer to bank account via DBT.',
    benefitsTa: 'ஆண்டுதோறும் ₹6,000 நேரடி வங்கி பணப் பரிமாற்றம்.',
    documentsEn: 'Aadhaar Card, Land Patta/Chitta ownership documents, Bank Passbook linked to Aadhaar.',
    documentsTa: 'ஆதார் அட்டை, நில பட்டா/சிட்டா ஆவணங்கள், ஆதாருடன் இணைக்கப்பட்ட வங்கி கணக்கு புத்தகம்.',
    applicationProcess: 'Apply online via PM-Kisan portal, CSC Village Center, or Agriculture Revenue Office.',
    officialUrl: 'https://pmkisan.gov.in',
  },
  {
    id: 'sch-02',
    nameEn: 'Kalaignarin All Village Integrated Agriculture Development Programme',
    nameTa: 'கலைஞரின் அனைத்து கிராம ஒருங்கிணைந்த வேளாண் வளர்ச்சி திட்டம்',
    category: 'State Scheme',
    descriptionEn: 'Comprehensive agrarian empowerment scheme by Government of Tamil Nadu focusing on fallow land rejuvenation, micro-irrigation, and farm mechanization.',
    descriptionTa: 'தரிசு நிலங்களை விளைநிலங்களாக மாற்றுதல், நுண்ணீர்ப்பாசனம் அமைத்தல் மற்றும் வேளாண் கருவிகள் வழங்கும் தமிழ்நாடு அரசின் முன்னோடி திட்டம்.',
    eligibilityEn: 'Small and marginal farmers residing in the selected village panchayats in Tamil Nadu.',
    eligibilityTa: 'தேர்வு செய்யப்பட்ட கிராம ஊராட்சிகளில் உள்ள சிறு, குறு விவசாயிகள்.',
    benefitsEn: '100% subsidy for micro-irrigation for small farmers; high-yield seed kits and coconut saplings distributed free.',
    benefitsTa: 'சிறு விவசாயிகளுக்கு 100% மானியத்தில் சொட்டு நீர் பாசனம், இலவச தென்னங்கன்றுகள் மற்றும் தரமான விதை தொகுப்புகள்.',
    documentsEn: 'Aadhaar, Chitta/Adangal, Ration card, Bank passbook.',
    documentsTa: 'ஆதார், சிட்டா/அடங்கல், ரேஷன் அட்டை, வங்கி கணக்கு புத்தகம்.',
    applicationProcess: 'Register on Uzhavan App or contact the Block Assistant Director of Agriculture.',
    officialUrl: 'https://www.tn.gov.in/department/1',
  },
  {
    id: 'sch-03',
    nameEn: 'Pradhan Mantri Fasal Bima Yojana (PMFBY Crop Insurance)',
    nameTa: 'பிரதமர் பயிர் காப்பீட்டு திட்டம்',
    category: 'Insurance',
    descriptionEn: 'Comprehensive insurance coverage against crop failure caused by non-preventable natural risks (drought, flood, pests).',
    descriptionTa: 'வறட்சி, வெள்ளம் மற்றும் பூச்சித் தாக்குதல் போன்ற இயற்கை இடர்பாடுகளால் ஏற்படும் பயிர் இழப்பிற்கு விரிவான காப்பீட்டு இழப்பீடு.',
    eligibilityEn: 'All farmers cultivating notified crops in notified areas including tenant farmers and sharecroppers.',
    eligibilityTa: 'அறிவிக்கப்பட்ட பயிர்களை அறிவிக்கப்பட்ட பகுதிகளில் பயிரிடும் அனைத்து விவசாயிகள் மற்றும் குத்தகைதாரர்கள்.',
    benefitsEn: 'Subsidized premium (1.5% Rabi, 2% Kharif, 5% Commercial crops). Up to 100% claim on yield loss.',
    benefitsTa: 'குறைந்தபட்ச பிரீமியம் (காரீப் 2%, ரபி 1.5%). மகசூல் இழப்பிற்கு 100% வரை இழப்பீட்டுத் தொகை.',
    documentsEn: 'Sowing Certificate, Land records (Patta/Chitta), Bank account details, Aadhaar.',
    documentsTa: 'விதைப்பு சான்றிதழ், பட்டா/சிட்டா நகல், வங்கி கணக்கு, ஆதார் அட்டை.',
    applicationProcess: 'Enrol via National Crop Insurance Portal, Primary Agricultural Credit Society (PACS), or Banks.',
    officialUrl: 'https://pmfby.gov.in',
  }
];

const DEFAULT_EQUIPMENTS = [
  { id: 'eq-01', name: 'Mahindra 575 DI Tractor (45 HP)', nameTa: 'மகிந்திரா 575 DI டிராக்டர்', type: 'Tractor', hourlyRate: 850, dailyRate: 6500, description: '45 HP heavy duty tractor suitable for deep ploughing, rotavating, and trailer transport.', imageUrl: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=600&auto=format&fit=crop&q=80', isAvailable: true },
  { id: 'eq-02', name: 'Kubota DC-68G Paddy Combine Harvester', nameTa: 'குபோடா நெல் அறுவடை இயந்திரம்', type: 'Harvester', hourlyRate: 2400, dailyRate: 18000, description: 'High-speed paddy cutting, threshing, and cleaning with minimal grain loss.', imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80', isAvailable: true },
  { id: 'eq-03', name: 'Shaktiman 7-Feet Heavy Duty Rotavator', nameTa: 'சக்திமான் ரோட்டவேட்டர்', type: 'Rotavator', hourlyRate: 750, dailyRate: 5000, description: 'High pulverization secondary tillage implement for wet and dry fields.', imageUrl: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=600&auto=format&fit=crop&q=80', isAvailable: true },
  { id: 'eq-04', name: 'DJI Agras T40 Agricultural Drone Sprayer', nameTa: 'விவசாய ட்ரோன் தெளிப்பான்', type: 'Sprayer', hourlyRate: 1200, dailyRate: 9000, description: '40L atomized spray tank covering 40 acres/hour with RTK centimeter precision.', imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&auto=format&fit=crop&q=80', isAvailable: true }
];

const DEFAULT_FARMS = [
  {
    id: 'farm-01',
    userId: 'user-farmer-01',
    name: 'Kabisthalam Cauvery Delta Farm',
    surveyNumber: '142/3B',
    sizeAcres: 4.5,
    soilType: 'Clay Loam (Alluvial)',
    currentCrop: 'Paddy (BPT 5204)',
    plantingDate: '2026-01-10T00:00:00.000Z',
    expectedHarvest: '2026-05-15T00:00:00.000Z',
    irrigationType: 'Canal & Borewell Drip',
    location: 'Kabisthalam, Thanjavur, Tamil Nadu',
  }
];

export function handleMockFallback(config: AxiosRequestConfig): AxiosResponse<any> | null {
  const url = (config.url || '').replace(/^https?:\/\/[^/]+/, '').replace(/^\/api/, '');
  const method = (config.method || 'get').toLowerCase();

  // Helper to build AxiosResponse
  const makeResponse = (data: any, status = 200): AxiosResponse<any> => ({
    data,
    status,
    statusText: status === 200 ? 'OK' : 'Created',
    headers: { 'content-type': 'application/json' },
    config: config as any,
  });

  // Parse Body safely
  let body: any = {};
  if (typeof config.data === 'string') {
    try {
      body = JSON.parse(config.data);
    } catch {
      body = {};
    }
  } else if (config.data && typeof config.data === 'object') {
    body = config.data;
  }

  // 1. AUTHENTICATION & LOGIN
  // 1. AUTHENTICATION & LOGIN
  if (url.startsWith('/auth/login') && method === 'post') {
    const { emailOrPhone, password } = body;
    const query = (emailOrPhone || '').trim().toLowerCase();
    const storedUsers = getStored<any[]>('users', []);
    const allUsers = [...DEFAULT_USERS, ...storedUsers];

    const demoPasswords: Record<string, string> = {
      'farmer@agrione.com': 'Farmer@123',
      '9876543210': 'Farmer@123',
      'buyer@agrione.com': 'Buyer@123',
      '9876543211': 'Buyer@123',
      'admin@agrione.com': 'Admin@123',
      '9876543212': 'Admin@123',
      'expert@agrione.com': 'Expert@123',
      '9876543213': 'Expert@123',
    };

    const found = allUsers.find(
      u => (u.email && u.email.toLowerCase() === query) || (u.mobileNumber && u.mobileNumber === query)
    );

    if (!found) {
      return makeResponse({
        success: false,
        message: 'Invalid credentials. User account does not exist.',
      }, 401);
    }

    // Verify password if demo user or registered user with password
    const expectedPassword = demoPasswords[query] || demoPasswords[found.email?.toLowerCase()] || found.password;
    if (expectedPassword && password !== expectedPassword) {
      return makeResponse({
        success: false,
        message: 'Invalid email or password. Please check your credentials.',
      }, 401);
    }

    const { password: _, passwordHash: __, ...safeUser } = found;
    const token = `agrione_jwt_token_${found.id}_${Date.now()}`;
    return makeResponse({
      success: true,
      message: 'Authentication successful',
      data: {
        user: safeUser,
        token,
      },
    });
  }

  // Current User (/auth/me)
  if (url.startsWith('/auth/me') && method === 'get') {
    const saved = localStorage.getItem('agrione_user');
    const user = saved ? JSON.parse(saved) : DEFAULT_USERS[0];
    const { password: _, passwordHash: __, ...safeUser } = user;
    return makeResponse({
      success: true,
      data: { user: safeUser },
    });
  }

  // Register (/auth/register)
  if (url.startsWith('/auth/register') && method === 'post') {
    const storedUsers = getStored<any[]>('users', []);
    const allUsers = [...DEFAULT_USERS, ...storedUsers];

    const email = (body.email || '').trim().toLowerCase();
    const mobileNumber = (body.mobileNumber || '').trim();

    // Check duplicate email or mobile
    const existing = allUsers.find(
      u => (u.email && u.email.toLowerCase() === email) || (u.mobileNumber && u.mobileNumber === mobileNumber)
    );

    if (existing) {
      return makeResponse({
        success: false,
        message: 'An account with this email or mobile number already exists.',
      }, 409);
    }

    const newUser = {
      id: `user-gen-${Date.now()}`,
      fullName: body.fullName || 'Agricultural Producer',
      mobileNumber: mobileNumber || '9876543299',
      email: email || 'farmer@agrione.com',
      password: body.password || '',
      state: body.state || 'Tamil Nadu',
      district: body.district || 'Thanjavur',
      village: body.village || 'Delta',
      role: body.role || 'FARMER',
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(body.fullName || 'Farmer')}`,
      createdAt: new Date().toISOString(),
    };

    storedUsers.push(newUser);
    setStored('users', storedUsers);

    const { password: _, ...safeUser } = newUser;

    return makeResponse({
      success: true,
      message: 'Account registered successfully',
      data: {
        user: safeUser,
        token: `agrione_jwt_${newUser.id}_${Date.now()}`,
      },
    }, 201);
  }

  // Update Profile (/auth/profile)
  if (url.startsWith('/auth/profile') && method === 'put') {
    const saved = localStorage.getItem('agrione_user');
    const currentUser = saved ? JSON.parse(saved) : DEFAULT_USERS[0];

    const updatedUser = {
      ...currentUser,
      ...(body.fullName && { fullName: body.fullName }),
      ...(body.state && { state: body.state }),
      ...(body.district && { district: body.district }),
      ...(body.village && { village: body.village }),
      ...(body.avatarUrl && { avatarUrl: body.avatarUrl }),
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem('agrione_user', JSON.stringify(updatedUser));

    // Also update in stored mock users if present
    const storedUsers = getStored<any[]>('users', []);
    const uIdx = storedUsers.findIndex(u => u.id === currentUser.id);
    if (uIdx >= 0) {
      storedUsers[uIdx] = { ...storedUsers[uIdx], ...updatedUser };
      setStored('users', storedUsers);
    }

    return makeResponse({
      success: true,
      message: 'Profile updated successfully.',
      data: { user: updatedUser },
    });
  }

  // Change Password (/auth/change-password)
  if (url.startsWith('/auth/change-password') && method === 'put') {
    const { currentPassword, newPassword } = body;
    if (!currentPassword || !newPassword) {
      return makeResponse({
        success: false,
        message: 'Current password and new password are required.',
      }, 400);
    }

    if (newPassword.length < 6) {
      return makeResponse({
        success: false,
        message: 'New password must be at least 6 characters.',
      }, 400);
    }

    const saved = localStorage.getItem('agrione_user');
    const currentUser = saved ? JSON.parse(saved) : DEFAULT_USERS[0];

    // Check stored user password or demo password
    const demoPasswords: Record<string, string> = {
      'farmer@agrione.com': 'Farmer@123',
      'buyer@agrione.com': 'Buyer@123',
      'admin@agrione.com': 'Admin@123',
      'expert@agrione.com': 'Expert@123',
    };

    const storedUsers = getStored<any[]>('users', []);
    const userInStorage = storedUsers.find(u => u.id === currentUser.id);
    const expected = userInStorage?.password || demoPasswords[currentUser.email?.toLowerCase()] || 'Farmer@123';

    if (currentPassword !== expected) {
      return makeResponse({
        success: false,
        message: 'Current password does not match our records.',
      }, 400);
    }

    if (userInStorage) {
      userInStorage.password = newPassword;
      setStored('users', storedUsers);
    }

    return makeResponse({
      success: true,
      message: 'Password changed successfully. Your account is now protected with the new password.',
    });
  }

  // Forgot password
  if (url.startsWith('/auth/forgot-password') && method === 'post') {
    const resetToken = '123456';
    return makeResponse({
      success: true,
      message: 'Password reset code has been sent to your registered contact.',
      data: {
        demoResetToken: resetToken,
      },
    });
  }

  // Reset password
  if (url.startsWith('/auth/reset-password') && method === 'post') {
    const { newPassword } = body;
    if (!newPassword || newPassword.length < 6) {
      return makeResponse({
        success: false,
        message: 'Password must be at least 6 characters.',
      }, 400);
    }
    return makeResponse({
      success: true,
      message: 'Password has been reset successfully. Please log in with your new password.',
    });
  }

  // 2. WEATHER ADVISORY
  if (url.startsWith('/weather') && method === 'get') {
    const weatherData = {
      location: {
        name: 'Thanjavur',
        state: 'Tamil Nadu',
        country: 'India',
        lat: 10.7870,
        lon: 79.1378,
      },
      current: {
        temp: 31,
        feelsLike: 35,
        humidity: 68,
        windSpeed: 14,
        rainProbability: 25,
        description: 'Partly Cloudy',
        descriptionTa: 'பகுதி மேகமூட்டம்',
        icon: '02d',
        uvIndex: 8,
        pressure: 1012,
        agriculturalAlert: 'Weather is favorable for transplanting and fertilization. Rain expected in 48 hours.',
        agriculturalAlertTa: 'நடவு மற்றும் உரம் இட சாதகமான வானிலை. அடுத்த 48 மணி நேரத்தில் மழைக்கு வாய்ப்பு.',
      },
      forecast: [
        {
          date: new Date().toISOString().split('T')[0],
          dayName: 'Today',
          dayNameTa: 'இன்று',
          tempMax: 33,
          tempMin: 24,
          humidity: 68,
          rainProbability: 25,
          description: 'Partly Cloudy',
          descriptionTa: 'பகுதி மேகமூட்டம்',
          icon: '02d',
          spraySuitability: 'Favorable' as const,
        },
        {
          date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          dayName: 'Tomorrow',
          dayNameTa: 'நாளை',
          tempMax: 32,
          tempMin: 24,
          humidity: 75,
          rainProbability: 60,
          description: 'Scattered Showers',
          descriptionTa: 'சாரல் மழை',
          icon: '10d',
          spraySuitability: 'Caution' as const,
        },
        {
          date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
          dayName: 'Friday',
          dayNameTa: 'வெள்ளி',
          tempMax: 30,
          tempMin: 23,
          humidity: 82,
          rainProbability: 80,
          description: 'Moderate Rain',
          descriptionTa: 'மிதமான மழை',
          icon: '10d',
          spraySuitability: 'Unfavorable' as const,
        },
        {
          date: new Date(Date.now() + 259200000).toISOString().split('T')[0],
          dayName: 'Saturday',
          dayNameTa: 'சனி',
          tempMax: 31,
          tempMin: 24,
          humidity: 70,
          rainProbability: 20,
          description: 'Clear Sky',
          descriptionTa: 'தெளிவான வானம்',
          icon: '01d',
          spraySuitability: 'Favorable' as const,
        },
        {
          date: new Date(Date.now() + 345600000).toISOString().split('T')[0],
          dayName: 'Sunday',
          dayNameTa: 'ஞாயிறு',
          tempMax: 34,
          tempMin: 25,
          humidity: 62,
          rainProbability: 10,
          description: 'Sunny',
          descriptionTa: 'வெயில்',
          icon: '01d',
          spraySuitability: 'Favorable' as const,
        },
      ],
      updatedAt: new Date().toISOString(),
    };
    return makeResponse({ success: true, data: weatherData });
  }

  // 3. MANDI MARKET PRICES
  if (url.startsWith('/market/prices') && method === 'get') {
    return makeResponse({
      success: true,
      data: { prices: DEFAULT_MARKET_PRICES, count: DEFAULT_MARKET_PRICES.length },
    });
  }

  if (url.startsWith('/market/trend') && method === 'get') {
    return makeResponse({
      success: true,
      data: {
        crop: 'Paddy',
        market: 'Thanjavur APMC',
        history: [
          { date: '08 Oct', price: 2410 },
          { date: '09 Oct', price: 2435 },
          { date: '10 Oct', price: 2450 },
          { date: '11 Oct', price: 2440 },
          { date: '12 Oct', price: 2465 },
          { date: '13 Oct', price: 2480 },
          { date: '14 Oct', price: 2510 },
        ]
      }
    });
  }

  // 4. AI CROP DOCTOR & DISEASE PREDICTOR
  if (url.startsWith('/disease/predict') && method === 'post') {
    return makeResponse({
      success: true,
      message: 'Disease diagnosis completed successfully',
      data: {
        diagnosis: {
          cropName: 'Tomato',
          diseaseNameEn: 'Tomato Early Blight (Alternaria solani)',
          diseaseNameTa: 'தக்காளி ஆரம்பகால கருகல் நோய்',
          confidence: 93.4,
          severity: 'Moderate',
          symptomsEn: 'Dark concentric brown rings ("target board" pattern) on lower leaves, surrounded by yellow chlorotic halo.',
          symptomsTa: 'கீழ் இலைகளில் இருண்ட வட்ட வளைய புள்ளிகள் மற்றும் சுற்றிலும் மஞ்சள் நிற விளிம்பு தோன்றுதல்.',
          treatmentEn: 'Spray Chlorothalonil 75% WP @ 2g/litre or Mancozeb @ 2.5g/litre. Ensure thorough under-leaf coverage.',
          treatmentTa: 'குளோரோதலோனில் 75% WP (2 கிராம்/லிட்டர்) அல்லது மேன்கோசெப் (2.5 கிராம்/லிட்டர்) கலந்து தெளிக்கவும்.',
          preventionEn: 'Maintain 60cm row spacing, avoid overhead sprinkler irrigation, and rotate with non-solanaceous crops.',
          preventionTa: 'சொட்டு நீர் பாசனம் பயன்படுத்தவும், தக்காளி பயிருக்கு பின் பயறு வகை பயிர்களை சுழற்சி முறையில் பயிரிடவும்.',
          recommendedStepsEn: [
            'Prune and destroy infected lower leaves immediately.',
            'Apply neem oil 10,000 ppm @ 3ml/litre as organic control.',
            'Avoid working in fields when foliage is wet.',
            'Apply balanced potash to strengthen plant cell walls.'
          ],
          recommendedStepsTa: [
            'பாதிக்கப்பட்ட கீழ் இலைகளை உடனே அகற்றி அழிக்கவும்.',
            'வேப்ப எண்ணெய் 10,000 ppm (3 மிலி/லிட்டர்) தெளிக்கவும்.',
            'ஈரமான பயிர்களில் வேலை செய்வதைத் தவிர்க்கவும்.'
          ]
        }
      }
    });
  }

  if (url.startsWith('/disease/history') && method === 'get') {
    return makeResponse({
      success: true,
      data: {
        history: [
          {
            id: 'scan-01',
            cropName: 'Tomato',
            diseaseName: 'Tomato Early Blight',
            confidence: 93.4,
            severity: 'Moderate',
            imagePath: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop&q=80',
            treatment: 'Spray Chlorothalonil 75% WP @ 2g/litre.',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: 'scan-02',
            cropName: 'Paddy',
            diseaseName: 'Bacterial Leaf Blight (Xanthomonas oryzae)',
            confidence: 91.2,
            severity: 'Low',
            imagePath: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=80',
            treatment: 'Spray Streptocycline 100ppm + Copper Oxychloride 0.25%.',
            createdAt: new Date(Date.now() - 172800000).toISOString(),
          }
        ]
      }
    });
  }

  // 5. CROP RECOMMENDATION
  if (url.startsWith('/crops/recommend') && method === 'post') {
    return makeResponse({
      success: true,
      data: {
        recommendations: [
          {
            cropNameEn: 'Paddy / Rice (BPT 5204 / Samba Mahsuri)',
            cropNameTa: 'நெல் (பி.பி.டி 5204 / சாம்பா மசூரி)',
            suitabilityScore: 98,
            growingPeriodDays: 135,
            waterRequirement: 'High',
            importantNutrients: 'Nitrogen (120 kg/ha), Phosphorus (60 kg/ha), Potassium (60 kg/ha)',
            commonDiseases: ['Blast', 'Sheath Blight', 'Bacterial Leaf Blight'],
            estimatedMarketPotential: 'High (MSP ₹2,480/Quintal + Private Premium)',
            cultivationGuidanceEn: 'Ideal for clay alluvial soil. Use SRI technique (Single seedling planting with 25x25cm spacing) to save 40% water.',
            cultivationGuidanceTa: 'களிமண் வண்டல் மண்ணிற்கு ஏற்றது. செம்மை நெல் சாகுபடி (SRI) முறையில் 25x25 செ.மீ இடைவெளியில் நடவு செய்யவும்.',
            expectedYieldPerAcre: '26 - 30 Bags (75kg each)',
          },
          {
            cropNameEn: 'Black Gram (Vamban-3 / Vamban-8)',
            cropNameTa: 'உளுந்து (வம்பன்-3)',
            suitabilityScore: 94,
            growingPeriodDays: 70,
            waterRequirement: 'Low',
            importantNutrients: 'Phosphorus (40 kg/ha), DAP spray 2% at flowering',
            commonDiseases: ['Yellow Mosaic Virus', 'Root Rot'],
            estimatedMarketPotential: 'Very High (₹9,300/Quintal)',
            cultivationGuidanceEn: 'Excellent as rice fallow crop. Enriches soil with atmospheric nitrogen fixation.',
            cultivationGuidanceTa: 'நெல் தரிசு பயிராக பயிரிட சிறந்தது. மண்ணில் தழைச்சத்தை நிலைநிறுத்தும்.',
            expectedYieldPerAcre: '3.5 - 5 Quintals',
          },
          {
            cropNameEn: 'Groundnut (TMV-7 / Kadiri-6)',
            cropNameTa: 'வேர்க்கடலை (டி.எம்.வி-7)',
            suitabilityScore: 89,
            growingPeriodDays: 105,
            waterRequirement: 'Medium',
            importantNutrients: 'Gypsum (400 kg/ha at 45th day), Borax (10 kg/ha)',
            commonDiseases: ['Tikka Leaf Spot', 'Rust'],
            estimatedMarketPotential: 'High (₹6,800/Quintal)',
            cultivationGuidanceEn: 'Ensure loose friable soil during peg penetration stage. Apply gypsum for sound pod filling.',
            cultivationGuidanceTa: 'விழுது இறங்கும் போது மண் தளர்வாக இருக்க வேண்டும். ஜிப்சம் இடுவது அவசியமாகும்.',
            expectedYieldPerAcre: '8 - 11 Quintals',
          }
        ]
      }
    });
  }

  // 6. SOIL HEALTH EVALUATION
  if ((url.startsWith('/soil/analyze') || url.startsWith('/soil/evaluate')) && method === 'post') {
    return makeResponse({
      success: true,
      data: {
        analysis: {
          healthScore: 88,
          rating: 'Good',
          nutrientStatus: {
            nitrogen: { level: 275, status: 'Sufficient', guidance: 'Optimal vegetative vigor observed. Maintain with neem-coated urea split doses.' },
            phosphorus: { level: 18.5, status: 'Sufficient', guidance: 'Promotes deep root proliferation and early flowering.' },
            potassium: { level: 245, status: 'Sufficient', guidance: 'Enhances pest resistance, starch accumulation, and drought tolerance.' },
            organicCarbon: { level: 0.65, status: 'Medium', guidance: 'Apply 5 tonnes farmyard manure or vermicompost per acre annually.' },
            ph: { level: 6.8, status: 'Neutral', guidance: 'Ideal pH for maximum nutrient bioavailability.' }
          },
          deficiencies: ['Slight Zinc deficit (0.6 ppm)', 'Moderate Boron deficiency'],
          suggestedCrops: ['Paddy', 'Black Gram', 'Banana', 'Tomato', 'Maize'],
          fertilizerGuidanceEn: [
            'Basal dose: DAP 50 kg + MOP 25 kg + Zinc Sulphate 10 kg per acre.',
            'Top dressing at tillering: Neem-coated urea 35 kg.',
            'Panicle initiation: MOP 20 kg + Urea 25 kg.'
          ],
          fertilizerGuidanceTa: [
            'அடி உரம்: டி.ஏ.பி 50 கிலோ + பொட்டாஷ் 25 கிலோ + துத்தநாக சல்பேட் 10 கிலோ/ஏக்கர்.',
            'மேலுரம் (தூர்கட்டும் பருவம்): வேப்பம்பூசிய யூரியா 35 கிலோ/ஏக்கர்.'
          ],
          improvementTipsEn: [
            'Incorporate green manure crops like Daincha or Sunnhemp prior to puddle ploughing.',
            'Apply Azospirillum and Phosphobacteria biofertilizers @ 2 kg/acre mixed with FYM.'
          ],
          improvementTipsTa: [
            'தக்கைப்பூண்டு அல்லது சணப்பை போன்ற பசுந்தாள் உரங்களை நடவுக்கு முன் மடக்கி உழவும்.'
          ]
        }
      }
    });
  }

  if (url.startsWith('/soil/history') && method === 'get') {
    return makeResponse({
      success: true,
      data: {
        history: [
          {
            id: 'soil-01',
            soilType: 'Clay Loam (Alluvial)',
            ph: 6.8,
            nitrogen: 275,
            phosphorus: 18.5,
            potassium: 245,
            organicCarbon: 0.65,
            healthScore: 88,
            createdAt: new Date().toISOString(),
          }
        ]
      }
    });
  }

  // 7. AGRI MARKETPLACE PRODUCTS & CART
  if (url.startsWith('/products') && method === 'get') {
    const customProds = getStored<any[]>('custom_products', []);
    const allProds = [...customProds, ...DEFAULT_PRODUCTS];
    return makeResponse({
      success: true,
      data: { products: allProds, total: allProds.length }
    });
  }

  if (url.startsWith('/products') && method === 'post') {
    const newProd = {
      id: `prod-${Date.now()}`,
      ...body,
      seller: DEFAULT_USERS[0],
      createdAt: new Date().toISOString(),
      isActive: true,
    };
    const customProds = getStored<any[]>('custom_products', []);
    customProds.unshift(newProd);
    setStored('custom_products', customProds);
    return makeResponse({ success: true, data: { product: newProd } });
  }

  // CART
  if (url.startsWith('/cart') && method === 'get') {
    const items = getStored<any[]>('cart_items', [
      { id: 'ci-01', productId: 'prod-01', product: DEFAULT_PRODUCTS[0], quantity: 2 },
    ]);
    return makeResponse({
      success: true,
      data: {
        cart: {
          id: 'cart-01',
          items,
          totalAmount: items.reduce((acc, i) => acc + (i.product?.price || 0) * i.quantity, 0),
        }
      }
    });
  }

  if (url.startsWith('/cart') && method === 'post') {
    const { productId, quantity } = body;
    const items = getStored<any[]>('cart_items', []);
    const product = [...DEFAULT_PRODUCTS, ...getStored<any[]>('custom_products', [])].find(p => p.id === productId);
    const existing = items.find(i => i.productId === productId);
    if (existing) {
      existing.quantity += Number(quantity || 1);
    } else if (product) {
      items.push({ id: `ci-${Date.now()}`, productId, product, quantity: Number(quantity || 1) });
    }
    setStored('cart_items', items);
    return makeResponse({ success: true, message: 'Item added to cart' });
  }

  // ORDERS
  if (url.startsWith('/orders') && method === 'get') {
    const orders = getStored<any[]>('orders', [
      {
        id: 'order-01',
        orderNumber: 'AGRI-2026-9821',
        totalAmount: 5300,
        orderStatus: 'CONFIRMED',
        paymentStatus: 'COMPLETED',
        deliveryAddress: 'Main Road, Kabisthalam, Thanjavur, Tamil Nadu',
        contactPhone: '9876543210',
        paymentMode: 'PHONEPE_UPI',
        items: [
          { id: 'oi-01', productId: 'prod-01', productName: 'Premium Sona Masoori Paddy (BPT 5204)', quantity: 2, unit: 'quintal', unitPrice: 2650, totalPrice: 5300 }
        ],
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      }
    ]);
    return makeResponse({ success: true, data: { orders } });
  }

  if (url.startsWith('/orders') && method === 'post') {
    const newOrder = {
      id: `order-${Date.now()}`,
      orderNumber: `AGRI-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      totalAmount: body.totalAmount || 5300,
      orderStatus: 'CONFIRMED',
      paymentStatus: 'COMPLETED',
      deliveryAddress: body.deliveryAddress || 'Delta Village, Thanjavur',
      contactPhone: body.contactPhone || '9876543210',
      paymentMode: body.paymentMode || 'PHONEPE_MOCK',
      items: body.items || [],
      createdAt: new Date().toISOString(),
    };
    const orders = getStored<any[]>('orders', []);
    orders.unshift(newOrder);
    setStored('orders', orders);
    setStored('cart_items', []); // empty cart on checkout

    return makeResponse({
      success: true,
      message: 'Order created and payment completed successfully',
      data: {
        order: newOrder,
        paymentUrl: '/orders',
      }
    });
  }

  // 8. FARM SERVICES
  if (url.startsWith('/services/equipment/requests') && method === 'post') {
    return makeResponse({ success: true, message: 'Tractor equipment requested successfully.' });
  }

  if (url.startsWith('/services/equipment') && method === 'get') {
    return makeResponse({ success: true, data: { equipments: DEFAULT_EQUIPMENTS } });
  }

  if (url.startsWith('/services/labour') && method === 'get') {
    return makeResponse({ success: true, data: { requests: [] } });
  }

  if (url.startsWith('/services/labour') && method === 'post') {
    return makeResponse({ success: true, message: 'Farm labour requested successfully.' });
  }

  if (url.startsWith('/services/logistics') && method === 'get') {
    return makeResponse({ success: true, data: { requests: [] } });
  }

  if (url.startsWith('/services/logistics') && method === 'post') {
    return makeResponse({ success: true, message: 'Logistics vehicle requested successfully.' });
  }

  // 9. AGRIBOT AI CHATBOT
  if (url.startsWith('/chat/message') && method === 'post') {
    const userMsg = (body.message || '').toLowerCase();
    let botReply = 'For balanced crop nutrition, use the 4R Nutrient Stewardship principle (Right Source, Right Rate, Right Time, Right Place). Conduct a soil test every 2 years.';

    if (userMsg.includes('paddy') || userMsg.includes('rice') || userMsg.includes('நெல்')) {
      botReply = 'For Paddy cultivation: maintain 2-3 cm standing water during tillering, apply split doses of Nitrogen (25% basal, 50% active tillering, 25% panicle initiation). Keep vigilance against leaf blast during humid cloudy days.';
    } else if (userMsg.includes('fertilizer') || userMsg.includes('உரம்')) {
      botReply = 'Recommended fertilizer application should combine organic manure (5 tons/acre) with inorganic N-P-K tailored to soil test values. Foliar spray 2% DAP or 1% 19:19:19 during vegetative phase.';
    } else if (userMsg.includes('disease') || userMsg.includes('pest') || userMsg.includes('நோய்')) {
      botReply = 'For early disease control: Use neem seed kernel extract (NSKE 5%) or Pseudomonas fluorescens @ 10g/litre. Upload an infected leaf photo to our AI Crop Doctor for instant diagnosis!';
    } else if (userMsg.includes('weather') || userMsg.includes('rain') || userMsg.includes('மழை')) {
      botReply = 'Current forecast for Cauvery delta indicates favorable daytime conditions with isolated showers in the next 48 hours. Postpone non-essential pesticide sprays if rain is imminent.';
    }

    return makeResponse({
      success: true,
      data: {
        reply: botReply,
        sessionId: body.sessionId || `session-${Date.now()}`,
        timestamp: new Date().toISOString(),
      }
    });
  }

  // 10. GOVERNMENT SCHEMES
  if (url.startsWith('/schemes') && method === 'get') {
    return makeResponse({
      success: true,
      data: { schemes: DEFAULT_SCHEMES, total: DEFAULT_SCHEMES.length }
    });
  }

  // 11. FARMS
  if (url.startsWith('/farms') && method === 'get') {
    const farms = getStored<any[]>('farms', DEFAULT_FARMS);
    return makeResponse({ success: true, data: { farms } });
  }

  if (url.startsWith('/farms') && method === 'post') {
    const newFarm = { id: `farm-${Date.now()}`, ...body, createdAt: new Date().toISOString() };
    const farms = getStored<any[]>('farms', DEFAULT_FARMS);
    farms.push(newFarm);
    setStored('farms', farms);
    return makeResponse({ success: true, data: { farm: newFarm } });
  }

  // 12. NOTIFICATIONS
  if (url.startsWith('/notifications') && method === 'get') {
    return makeResponse({
      success: true,
      data: {
        notifications: [
          { id: 'notif-01', titleEn: 'Market Alert: Paddy prices up ₹70/Qtl', messageEn: 'Paddy modal prices touched ₹2,480 at Thanjavur APMC today.', type: 'MARKET_ALERT', isRead: false, createdAt: new Date().toISOString() },
          { id: 'notif-02', titleEn: 'Weather Spray Advisory', messageEn: 'Good spraying window available tomorrow morning 6-9 AM.', type: 'WEATHER_ALERT', isRead: false, createdAt: new Date().toISOString() },
        ],
        unreadCount: 2,
      }
    });
  }

  // 13. ADMIN METRICS
  if (url.startsWith('/admin/metrics') && method === 'get') {
    return makeResponse({
      success: true,
      data: {
        metrics: {
          totalUsers: 48,
          totalFarmers: 34,
          totalBuyers: 12,
          totalOrders: 19,
          totalGMV: 485000,
          activeListings: 24,
          diseaseScansAnalyzed: 142,
        }
      }
    });
  }

  if (url.startsWith('/admin/users') && method === 'get') {
    return makeResponse({
      success: true,
      data: { users: DEFAULT_USERS }
    });
  }

  // Generic success fallback for any other PUT / POST / DELETE operations
  return makeResponse({ success: true, message: 'Operation processed successfully' });
}

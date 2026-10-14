import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Stethoscope,
  Compass,
  FileSpreadsheet,
  CloudSun,
  TrendingUp,
  Store,
  ShoppingCart,
  PackageCheck,
  Tractor,
  Users,
  Truck,
  FileCheck,
  Bot,
  Layers,
  Sprout,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  LayoutGrid
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface FeatureItem {
  id: string;
  title: string;
  titleTa: string;
  description: string;
  descriptionTa: string;
  category: 'FARM' | 'MARKET' | 'SERVICES' | 'AI_ADMIN';
  to: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  badge?: string;
  keywords: string[];
}

export const AllFeaturesPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'FARM' | 'MARKET' | 'SERVICES' | 'AI_ADMIN'>('ALL');

  const features: FeatureItem[] = [
    // Farm Intelligence
    {
      id: 'doctor',
      title: 'AI Crop Doctor',
      titleTa: 'பயிர் மருத்துவர் AI',
      description: 'Upload leaf photo to diagnose diseases with botanical AI models and organic remedies.',
      descriptionTa: 'இலை புகைப்படத்தை பதிவேற்றி பயிர் நோய்களை உடனே கண்டறிந்து தீர்வு பெறுங்கள்.',
      category: 'FARM',
      to: '/disease-doctor',
      icon: Stethoscope,
      iconBg: 'bg-emerald-50 border-emerald-200',
      iconColor: 'text-emerald-700',
      badge: 'AI Vision',
      keywords: ['disease', 'leaf', 'doctor', 'pest', 'fungus', 'spray', 'cure', 'blight', 'நோய்', 'மருத்துவர்'],
    },
    {
      id: 'recommend',
      title: 'Crop Recommendation',
      titleTa: 'பயிர் பரிந்துரை',
      description: 'Find optimal crops tailored to your soil NPK, pH, rainfall, and seasonal weather.',
      descriptionTa: 'மண் வளம், மழை மற்றும் காலநிலைக்கு ஏற்ற சிறந்த பயிர்களை தேர்வு செய்யுங்கள்.',
      category: 'FARM',
      to: '/crop-recommend',
      icon: Compass,
      iconBg: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-700',
      keywords: ['crop', 'suitability', 'soil', 'season', 'paddy', 'cotton', 'yield', 'பயிர்'],
    },
    {
      id: 'soil',
      title: 'Soil Health Card',
      titleTa: 'மண் வள அட்டை',
      description: 'Input soil test parameters to generate a 0-100 health index and fertilizer dosage.',
      descriptionTa: 'மண் பரிசோதனை முடிவுகளை உள்ளிட்டு உர அளவு மற்றும் மேலாண்மை பரிந்துரைகளைப் பெறுங்கள்.',
      category: 'FARM',
      to: '/soil-health',
      icon: FileSpreadsheet,
      iconBg: 'bg-amber-50 border-amber-200',
      iconColor: 'text-amber-700',
      badge: 'SHC',
      keywords: ['soil', 'npk', 'ph', 'nitrogen', 'phosphorus', 'potassium', 'fertilizer', 'மண்', 'உரம்'],
    },
    {
      id: 'weather',
      title: 'Agro-Weather & Spray Advisories',
      titleTa: 'வானிலை & தெளிப்பு வழிகாட்டி',
      description: 'Hyperlocal 7-day agricultural forecast with optimal pesticide spraying windows.',
      descriptionTa: '7 நாள் துல்லிய வானிலை அறிக்கை மற்றும் மருந்து தெளிப்புக்கான உகந்த நேரம்.',
      category: 'FARM',
      to: '/weather',
      icon: CloudSun,
      iconBg: 'bg-sky-50 border-sky-200',
      iconColor: 'text-sky-700',
      keywords: ['weather', 'rain', 'temp', 'wind', 'humidity', 'spray', 'வானிலை', 'மழை'],
    },

    // Market & Commerce
    {
      id: 'mandi',
      title: 'Live Mandi Market Prices',
      titleTa: 'மண்டி சந்தை விலைகள்',
      description: 'Daily APMC arrival prices, modal rates, and 7-day price trajectory analytics.',
      descriptionTa: 'ஒழுங்குமுறை விற்பனைக்கூடங்களின் தினசரி விளைபொருள் விலைகள் மற்றும் விலை போக்கு.',
      category: 'MARKET',
      to: '/market-prices',
      icon: TrendingUp,
      iconBg: 'bg-rose-50 border-rose-200',
      iconColor: 'text-rose-700',
      badge: 'Live APMC',
      keywords: ['mandi', 'market', 'price', 'rates', 'apmc', 'paddy', 'turmeric', 'விலை', 'சந்தை'],
    },
    {
      id: 'marketplace',
      title: 'Farmer Produce Marketplace',
      titleTa: 'உழவர் விளைபொருள் சந்தை',
      description: 'Direct-from-farm produce catalog. Buy and sell crops with transparent pricing.',
      descriptionTa: 'விவசாயிகளிடமிருந்து நேரடியாக தரமான விளைபொருட்களை வாங்கி விற்கவும்.',
      category: 'MARKET',
      to: '/marketplace',
      icon: Store,
      iconBg: 'bg-purple-50 border-purple-200',
      iconColor: 'text-purple-700',
      keywords: ['marketplace', 'buy', 'sell', 'products', 'grains', 'vegetables', 'விளைபொருள்', 'விற்பனை'],
    },
    {
      id: 'cart',
      title: 'Shopping Cart & PhonePe',
      titleTa: 'கூடை & கட்டணம்',
      description: 'Review produce lots and checkout securely with instant PhonePe gateway.',
      descriptionTa: 'தேர்வு செய்த பொருட்களை சரிபார்த்து போன்பே மூலம் பாதுகாப்பாக பணம் செலுத்துங்கள்.',
      category: 'MARKET',
      to: '/cart',
      icon: ShoppingCart,
      iconBg: 'bg-emerald-50 border-emerald-200',
      iconColor: 'text-emerald-700',
      keywords: ['cart', 'checkout', 'pay', 'phonepe', 'payment', 'கூடை', 'பணம்'],
    },
    ...(isAuthenticated ? [
      {
        id: 'orders',
        title: 'Order Tracking & Dispatches',
        titleTa: 'என் ஆர்டர்கள்',
        description: 'Track shipment status, seller updates, and delivery timelines.',
        descriptionTa: 'ஆர்டர் நிலை, அனுப்புதல் மற்றும் டெலிவரி விவரங்களை கண்காணிக்கவும்.',
        category: 'MARKET' as const,
        to: '/orders',
        icon: PackageCheck,
        iconBg: 'bg-teal-50 border-teal-200',
        iconColor: 'text-teal-700',
        keywords: ['orders', 'tracking', 'dispatch', 'delivery', 'ஆர்டர்'],
      },
      {
        id: 'listings',
        title: 'My Produce Listings',
        titleTa: 'என் விளைபொருள் பட்டியல்',
        description: 'Manage your farmgate inventory, prices, available stock, and buyer inquiries.',
        descriptionTa: 'உங்கள் விளைபொருட்களின் விவரங்கள், இருப்பு மற்றும் விலையை நிர்வகியுங்கள்.',
        category: 'MARKET' as const,
        to: '/my-listings',
        icon: Layers,
        iconBg: 'bg-indigo-50 border-indigo-200',
        iconColor: 'text-indigo-700',
        keywords: ['listings', 'seller', 'stock', 'inventory', 'பட்டியல்'],
      },
    ] : []),

    // Farm Services
    {
      id: 'equipment',
      title: 'Tractor & Machinery Rental (CHC)',
      titleTa: 'பண்ணை இயந்திரங்கள் வாடகை',
      description: 'Book tractors, combine harvesters, and rotavators with certified operators.',
      descriptionTa: 'டிராக்டர்கள் மற்றும் அறுவடை இயந்திரங்களை தகுதிவாய்ந்த ஓட்டுநர்களுடன் வாடகைக்கு எடுக்கவும்.',
      category: 'SERVICES',
      to: '/services/equipment',
      icon: Tractor,
      iconBg: 'bg-orange-50 border-orange-200',
      iconColor: 'text-orange-700',
      keywords: ['tractor', 'harvester', 'rotavator', 'equipment', 'machinery', 'chc', 'இயந்திரம்', 'டிராக்டர்'],
    },
    {
      id: 'labour',
      title: 'Agricultural Workforce Booking',
      titleTa: 'விவசாய தொழிலாளர்கள் முன்பதிவு',
      description: 'Hire skilled farm gangs for transplanting, weeding, and crop harvesting.',
      descriptionTa: 'விதைப்பு, நடவு, களை எடுத்தல் மற்றும் அறுவடை பணிகளுக்கு கூலி தொழிலாளர்களை முன்பதிவு செய்யுங்கள்.',
      category: 'SERVICES',
      to: '/services/labour',
      icon: Users,
      iconBg: 'bg-indigo-50 border-indigo-200',
      iconColor: 'text-indigo-700',
      keywords: ['labour', 'workers', 'harvesting', 'transplanting', 'gang', 'wage', 'தொழிலாளர்கள்'],
    },
    {
      id: 'logistics',
      title: 'Farm Gate Freight Logistics',
      titleTa: 'விளைபொருள் போக்குவரத்து',
      description: 'Dispatch harvested crops directly from farm gate to regulated mandi markets.',
      descriptionTa: 'விளைநிலங்களிலிருந்து மண்டிக்கு பயிர்களை கொண்டு செல்ல சரக்கு வாகனங்களை முன்பதிவு செய்யுங்கள்.',
      category: 'SERVICES',
      to: '/services/logistics',
      icon: Truck,
      iconBg: 'bg-teal-50 border-teal-200',
      iconColor: 'text-teal-700',
      keywords: ['logistics', 'truck', 'transport', 'tempo', 'lorry', 'freight', 'mandi', 'போக்குவரத்து'],
    },
    {
      id: 'schemes',
      title: 'Government Schemes & DBT Subsidies',
      titleTa: 'அரசு நல திட்டங்கள் & மானியங்கள்',
      description: 'Official directory of PM-Kisan, crop insurance, and state farm welfare subsidies.',
      descriptionTa: 'மத்திய மற்றும் தமிழ்நாடு அரசின் உழவர் நல திட்டங்கள், மானியங்கள் மற்றும் விண்ணப்பிக்கும் வழிகள்.',
      category: 'SERVICES',
      to: '/schemes',
      icon: FileCheck,
      iconBg: 'bg-emerald-50 border-emerald-200',
      iconColor: 'text-emerald-700',
      badge: 'Official',
      keywords: ['schemes', 'subsidies', 'pm-kisan', 'insurance', 'government', 'dbt', 'மானியங்கள்', 'திட்டம்'],
    },

    // AI Tools & Administration
    {
      id: 'agribot',
      title: 'AgriBot AI Agronomist',
      titleTa: 'அக்ரிபோட் AI உதவியாளர்',
      description: '24/7 bilingual assistant for agronomic diagnosis, NPK ratios, and market advice.',
      descriptionTa: 'பயிர் பாதுகாப்பு மற்றும் உரம் குறித்த கேள்விகளுக்கு 24/7 பதில் தரும் AI உதவியாளர்.',
      category: 'AI_ADMIN',
      to: '/agribot',
      icon: Bot,
      iconBg: 'bg-amber-50 border-amber-200',
      iconColor: 'text-amber-700',
      badge: 'Bilingual AI',
      keywords: ['agribot', 'bot', 'chat', 'ai', 'gpt', 'agronomist', 'assistant', 'அக்ரிபோட்'],
    },
    ...(isAuthenticated ? [
      {
        id: 'profile',
        title: 'Farm Profile & Landholdings',
        titleTa: 'விவசாய நில விபரம்',
        description: 'Manage your survey numbers, patta records, plot sizes, and soil types.',
        descriptionTa: 'உங்கள் நிலத்தின் சர்வே எண், பரப்பளவு மற்றும் மண் வகைகளை பதிவு செய்யுங்கள்.',
        category: 'AI_ADMIN' as const,
        to: '/farm-profile',
        icon: Sprout,
        iconBg: 'bg-emerald-50 border-emerald-200',
        iconColor: 'text-emerald-700',
        keywords: ['profile', 'farm', 'plot', 'patta', 'acres', 'நிலம்'],
      },
    ] : []),
    ...(isAuthenticated && user?.role === 'ADMIN' ? [
      {
        id: 'admin',
        title: 'Platform Administration & Telemetry',
        titleTa: 'நிர்வாக கட்டுப்பாட்டகம்',
        description: 'Operations console for user verification, GMV volume, and agronomic telemetry.',
        descriptionTa: 'தளத்தின் பயனர்கள், வர்த்தக பரிவர்த்தனைகள் மற்றும் செயல்பாடுகளை கண்காணிக்கும் பகுதி.',
        category: 'AI_ADMIN' as const,
        to: '/admin',
        icon: ShieldCheck,
        iconBg: 'bg-purple-50 border-purple-200',
        iconColor: 'text-purple-700',
        badge: 'Admin Only',
        keywords: ['admin', 'telemetry', 'users', 'moderation', 'gmv', 'control', 'நிர்வாகம்'],
      },
    ] : []),
  ];

  // Filtering
  const filteredFeatures = features.filter(item => {
    const matchesCategory = activeCategory === 'ALL' || item.category === activeCategory;
    const q = search.toLowerCase().trim();
    if (!q) return matchesCategory;

    const matchesSearch =
      item.title.toLowerCase().includes(q) ||
      item.titleTa.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.descriptionTa.toLowerCase().includes(q) ||
      item.keywords.some(k => k.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  const categories = [
    { id: 'ALL', label: language === 'ta' ? 'அனைத்து சேவைகள்' : 'All Features', count: features.length },
    { id: 'FARM', label: language === 'ta' ? 'பண்ணை நுண்ணறிவு' : 'Farm Intelligence', count: features.filter(f => f.category === 'FARM').length },
    { id: 'MARKET', label: language === 'ta' ? 'சந்தை & வர்த்தகம்' : 'Market & Commerce', count: features.filter(f => f.category === 'MARKET').length },
    { id: 'SERVICES', label: language === 'ta' ? 'பண்ணை சேவைகள்' : 'Field Services', count: features.filter(f => f.category === 'SERVICES').length },
    { id: 'AI_ADMIN', label: language === 'ta' ? 'AI & கணக்கு' : 'AI & Account', count: features.filter(f => f.category === 'AI_ADMIN').length },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header with breathing room */}
      <div className="space-y-3 pb-6 border-b border-slate-200/80">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
          <LayoutGrid className="w-3.5 h-3.5 text-emerald-600" />
          <span>{language === 'ta' ? 'அனைத்து வேளாண் சேவைகள்' : 'Feature Directory & Services Hub'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {language === 'ta' ? 'அனைத்து அக்ரிஒன் அம்சங்கள்' : 'All AgriOne Platform Features'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
          {language === 'ta'
            ? 'அனைத்து பயிர் பாதுகாப்பு கருவிகள், நேரடி மண்டி சந்தை, இயந்திர வாடகை மற்றும் AI சேவைகளை எளிதாக கண்டறியுங்கள்.'
            : 'Access every agronomy intelligence tool, marketplace channel, field service, and AI advisory from a single organized hub.'}
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={
              language === 'ta'
                ? 'சேவை, பயிர், மண், உரம் அல்லது இயந்திரத்தை தேடுங்கள்...'
                : 'Search any feature (e.g., crop doctor, soil health, tractor rental, mandi prices)...'
            }
            className="w-full text-xs sm:text-sm pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white shadow-2xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-3 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                activeCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeCategory === cat.id ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Feature List / Clean Grid */}
      {filteredFeatures.length === 0 ? (
        <div className="agri-card p-12 text-center space-y-3">
          <p className="text-sm font-semibold text-slate-700">
            No features found matching "{search}"
          </p>
          <button
            onClick={() => {
              setSearch('');
              setActiveCategory('ALL');
            }}
            className="text-xs font-bold text-emerald-700 hover:underline"
          >
            Clear filters and show all features
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredFeatures.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                to={item.to}
                className="agri-card p-4 sm:p-5 flex items-start space-x-4 hover:border-emerald-300 group transition-all"
              >
                <div className={`w-10 h-10 rounded-xl ${item.iconBg} border flex items-center justify-center ${item.iconColor} shrink-0 group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="grow min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-sm text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                      {language === 'ta' ? item.titleTa : item.title}
                    </h3>
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
                    {language === 'ta' ? item.descriptionTa : item.description}
                  </p>
                  <div className="pt-1 flex items-center text-[11px] font-bold text-emerald-600 group-hover:translate-x-0.5 transition-transform">
                    <span>{language === 'ta' ? 'தொடங்க' : 'Open feature'}</span>
                    <ArrowRight className="w-3 h-3 ml-1" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

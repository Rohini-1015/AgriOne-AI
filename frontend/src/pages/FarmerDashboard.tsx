import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CloudSun,
  Stethoscope,
  TrendingUp,
  Bot,
  ArrowRight,
  MapPin,
  Calendar,
  Sparkles,
  LayoutGrid,
  Sprout,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import { WeatherData, MarketPrice, DiseaseScanRecord, Order } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const FarmerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { language, t } = useLanguage();

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [recentScans, setRecentScans] = useState<DiseaseScanRecord[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [farms, setFarms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'mandi' | 'scans'>('mandi');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [weatherRes, marketRes, scanRes, orderRes, farmRes] = await Promise.all([
          api.get('/weather?city=Thanjavur'),
          api.get('/market/prices'),
          api.get('/disease/history'),
          api.get('/orders'),
          api.get('/farms'),
        ]);

        if (weatherRes.data?.success) setWeather(weatherRes.data.data);
        if (marketRes.data?.success) setMarketPrices(marketRes.data.data.prices.slice(0, 4));
        if (scanRes.data?.success) setRecentScans(scanRes.data.data.history.slice(0, 3));
        if (orderRes.data?.success) setOrders(orderRes.data.data.orders.slice(0, 3));
        if (farmRes.data?.success) setFarms(farmRes.data.data.farms);
      } catch (err) {
        console.warn('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Aggregating farm telemetry and agronomy models..." />;
  }

  // 4 Most Essential Quick Actions
  const topQuickActions = [
    {
      to: '/disease-doctor',
      icon: Stethoscope,
      iconColor: 'text-emerald-700',
      iconBg: 'bg-emerald-50 border-emerald-200',
      title: language === 'ta' ? 'பயிர் மருத்துவர்' : 'Scan Crop Leaf',
      desc: language === 'ta' ? 'இலை புகைப்படத்தை பதிவேற்றி நோய்களை கண்டறியவும்' : 'AI disease detection & organic remedies',
      primary: true,
    },
    {
      to: '/agribot',
      icon: Bot,
      iconColor: 'text-amber-700',
      iconBg: 'bg-amber-50 border-amber-200',
      title: language === 'ta' ? 'அக்ரிபாட் AI' : 'Ask AgriBot',
      desc: language === 'ta' ? 'விவசாய ஆலோசனைகளை உடனே கேளுங்கள்' : '24/7 instant agronomy advice',
    },
    {
      to: '/market-prices',
      icon: TrendingUp,
      iconColor: 'text-rose-700',
      iconBg: 'bg-rose-50 border-rose-200',
      title: language === 'ta' ? 'மண்டி விலைகள்' : 'Check Market',
      desc: language === 'ta' ? 'நேரடி ஒழுங்குமுறை விற்பனைக்கூட விலைகள்' : 'Daily APMC modal prices & trends',
    },
    {
      to: '/weather',
      icon: CloudSun,
      iconColor: 'text-sky-700',
      iconBg: 'bg-sky-50 border-sky-200',
      title: language === 'ta' ? 'வானிலை அறிக்கை' : 'View Weather',
      desc: language === 'ta' ? '7 நாள் மழை & தெளிப்பு வழிகாட்டி' : 'Localized spray windows & rainfall',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* 1. HERO / WELCOME BANNER (Simple, airy, 1 primary action) */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold text-slate-700 border border-slate-200">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>{user?.village || 'Kabisthalam'}, {user?.district || 'Thanjavur'}</span>
              <span className="text-slate-300">•</span>
              <Calendar className="w-3.5 h-3.5 text-amber-500" />
              <span>{new Date().toLocaleDateString(language === 'ta' ? 'ta-IN' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {language === 'ta' ? 'வணக்கம்' : 'Good morning'}, {user?.fullName?.split(' ')[0] || 'Farmer Selvam'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              {language === 'ta'
                ? 'உங்கள் நிலத்தை எளிதாகவும் நவீனமாகவும் நிர்வகிக்கவும்.'
                : 'Manage your farm smarter with real-time agronomic intelligence.'}
            </p>
          </div>

          {/* Actions: Primary CTA + Account + Secondary Link */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <Link
              to="/my-account"
              className="px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 flex items-center justify-center space-x-1.5 transition-all shadow-2xs"
            >
              <span>{language === 'ta' ? '👤 கணக்கு மையம்' : '👤 My Account'}</span>
            </Link>
            <Link
              to="/disease-doctor"
              className="px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm flex items-center justify-center space-x-2 transition-all active:scale-[0.98]"
            >
              <Stethoscope className="w-4 h-4" />
              <span>{language === 'ta' ? 'இலை ஆய்வு செய்க' : 'Scan Crop Leaf'}</span>
            </Link>
            <Link
              to="/features"
              className="px-3.5 py-2.5 rounded-xl font-bold text-xs bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center space-x-1 transition-all shadow-2xs"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-emerald-700" />
              <span>{language === 'ta' ? 'அனைத்து' : 'Features'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. QUICK OVERVIEW (Exactly 4 clean summary cards with progressive disclosure) */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            {language === 'ta' ? 'முக்கிய நிலவரம்' : 'Quick Overview'}
          </h2>
          <span className="text-xs text-slate-600 font-medium">Real-time Telemetry</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Weather */}
          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>{language === 'ta' ? 'வானிலை' : 'Weather'}</span>
              <CloudSun className="w-4 h-4 text-amber-500" />
            </div>
            <div className="my-2.5">
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                {weather?.current?.temp != null ? `${weather.current.temp}°C` : '31°C'}
              </div>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                {weather?.current?.humidity != null ? `${weather.current.humidity}% humidity • Sunny` : '68% humidity • Clear Sky'}
              </p>
            </div>
            <Link
              to="/weather"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center space-x-1 pt-2 border-t border-slate-100"
            >
              <span>{language === 'ta' ? 'முழு வானிலை →' : 'View Forecast →'}</span>
            </Link>
          </div>

          {/* Card 2: Crop Health */}
          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>{language === 'ta' ? 'பயிர் நலம்' : 'Crop Health'}</span>
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="my-2.5">
              <div className="text-2xl font-black text-emerald-700 tracking-tight">
                98% <span className="text-xs font-bold text-slate-500">Optimal</span>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                {recentScans.length > 0
                  ? `${recentScans[0].cropName}: ${recentScans[0].diseaseName}`
                  : 'No active critical blights'}
              </p>
            </div>
            <Link
              to="/disease-doctor"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center space-x-1 pt-2 border-t border-slate-100"
            >
              <span>{language === 'ta' ? 'ஆய்வு செய்க →' : 'Crop Doctor →'}</span>
            </Link>
          </div>

          {/* Card 3: Market Price */}
          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>{language === 'ta' ? 'மண்டி விலை' : 'Market Price'}</span>
              <TrendingUp className="w-4 h-4 text-rose-500" />
            </div>
            <div className="my-2.5">
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                ₹2,480 <span className="text-xs font-bold text-slate-500">/ Qtl</span>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Paddy (ADR-51) • Thanjavur
              </p>
            </div>
            <Link
              to="/market-prices"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center space-x-1 pt-2 border-t border-slate-100"
            >
              <span>{language === 'ta' ? 'அனைத்து விலைகள் →' : 'Live Mandi →'}</span>
            </Link>
          </div>

          {/* Card 4: Soil Health */}
          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
              <span>{language === 'ta' ? 'மண் வளம்' : 'Soil Health'}</span>
              <Sprout className="w-4 h-4 text-blue-600" />
            </div>
            <div className="my-2.5">
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                88 <span className="text-xs font-bold text-slate-500">/ 100</span>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Grade A • Balanced NPK & pH 6.8
              </p>
            </div>
            <Link
              to="/soil-health"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center space-x-1 pt-2 border-t border-slate-100"
            >
              <span>{language === 'ta' ? 'மண் அட்டை →' : 'Soil Card →'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 3. QUICK ACTIONS (Only the 4 most frequently used + prominent Hub card) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            {language === 'ta' ? 'விரைவு செயல்கள்' : 'Frequently Used Actions'}
          </h2>
          <Link
            to="/features"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center space-x-1"
          >
            <span>{language === 'ta' ? 'அனைத்து 15+ வசதிகள் காண்க' : 'View All Features'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topQuickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <Link
                key={idx}
                to={action.to}
                className="p-4 rounded-xl bg-white border border-slate-200/90 hover:border-emerald-300 hover:shadow-panel transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className={`w-10 h-10 rounded-xl ${action.iconBg} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border`}>
                    <Icon className={`w-5 h-5 ${action.iconColor}`} />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                    {action.desc}
                  </p>
                </div>
                <div className="mt-3 pt-2 text-xs font-semibold text-emerald-700 flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform">
                  <span>Open</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Feature Hub Entry Strip */}
        <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 border border-emerald-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                {language === 'ta' ? 'அனைத்து வேளாண் வசதிகள் தொகுப்பு' : 'Need more tools? Browse the Feature Hub'}
              </h4>
              <p className="text-[11px] sm:text-xs text-slate-600">
                {language === 'ta'
                  ? 'டிராக்டர் வாடகை, ஆட்கள், பயிர் போக்குவரத்து, அரசு திட்டங்கள் மற்றும் விளைபொருள் சந்தை'
                  : 'Tractor rental, farm labour, freight transport, government schemes, crop marketplace & more'}
              </p>
            </div>
          </div>
          <Link
            to="/features"
            className="px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-xs font-bold text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 transition-all shrink-0 flex items-center space-x-1 shadow-2xs"
          >
            <span>{language === 'ta' ? 'அனைத்து வசதிகள் (15+)' : 'Explore All 15+ Features'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 4. ACTIVITY & LIVE CONTEXT (Organized tabs instead of card walls) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              {language === 'ta' ? 'பண்ணை நுண்ணறிவு & சமீபத்திய தகவல்கள்' : 'Farm Activity & Live Data'}
            </h3>
            <p className="text-xs text-slate-500">Real-time updates tailored to your Thanjavur delta crops</p>
          </div>

          {/* Simple Tab Control */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg self-start sm:self-auto border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('mandi')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                activeTab === 'mandi'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'ta' ? 'மண்டி விலை போக்கு' : 'Mandi Rates'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('scans')}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                activeTab === 'scans'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {language === 'ta' ? 'சமீபத்திய ஆய்வுகள்' : 'Recent Leaf Scans'}
            </button>
          </div>
        </div>

        {/* Tab 1: Mandi Rates */}
        {activeTab === 'mandi' && (
          <div className="space-y-3">
            <div className="divide-y divide-slate-100">
              {marketPrices.map(item => (
                <div key={item.id} className="py-2.5 flex items-center justify-between text-xs hover:bg-slate-50/50 px-2 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-700 shrink-0 font-bold">
                      ₹
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">
                        {language === 'ta' && item.cropNameTa ? item.cropNameTa : item.cropName}
                      </span>
                      <span className="text-[11px] text-slate-500">{item.marketName} • Verified APMC</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-sm text-emerald-700 block">
                      ₹{item.modalPrice.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400">per {item.unit}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between text-xs">
              <span className="text-slate-500">Updated today from Agmarknet</span>
              <Link
                to="/market-prices"
                className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
              >
                <span>{language === 'ta' ? 'முழு மண்டி விவரங்கள்' : 'View Full Mandi Table'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Tab 2: Recent Scans */}
        {activeTab === 'scans' && (
          <div className="space-y-3">
            {recentScans.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {recentScans.map(scan => (
                  <div key={scan.id} className="py-2.5 flex items-center justify-between text-xs hover:bg-slate-50/50 px-2 rounded-lg transition-colors">
                    <div className="flex items-center space-x-3 min-w-0">
                      <img
                        src={scan.imagePath}
                        alt={scan.cropName}
                        className="w-10 h-10 rounded-lg object-cover ring-1 ring-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-900 truncate">{scan.cropName}</span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                            {scan.severity} ({scan.confidence}%)
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 truncate mt-0.5">{scan.diseaseName}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                      {new Date(scan.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-500 space-y-2">
                <p>{language === 'ta' ? 'ஆய்வுகள் எதுவும் இல்லை' : 'No recent disease scans saved yet.'}</p>
                <Link
                  to="/disease-doctor"
                  className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 hover:bg-emerald-100"
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>{language === 'ta' ? 'புதிய ஆய்வு' : 'Diagnose Leaf Now'}</span>
                </Link>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between text-xs">
              <span className="text-slate-500">AI Pathology Diagnostic Model</span>
              <Link
                to="/disease-doctor"
                className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
              >
                <span>{language === 'ta' ? 'அனைத்து ஆய்வுகள்' : 'Open Crop Doctor'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* 5. CONTEXT ADVISORY FOOTER (Simple single-row notice, no visual noise) */}
      <div className="p-4 rounded-xl bg-slate-100/80 border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            {language === 'ta'
              ? 'டெல்டா வேளாண் வானிலை: காலை தெளிப்புக்கு உகந்த நேரம் (காலை 06:30 - 09:30).'
              : 'Delta agro-weather indicates favorable morning foliar spraying windows (06:30 - 09:30 AM).'}
          </span>
        </div>
        <Link to="/weather" className="font-bold text-emerald-700 hover:text-emerald-800 shrink-0 self-end sm:self-auto">
          {language === 'ta' ? 'வானிலை காண்க →' : 'View advisory →'}
        </Link>
      </div>
    </div>
  );
};

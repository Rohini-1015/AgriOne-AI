import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  Stethoscope,
  TrendingUp,
  Store,
  Truck,
  Bot,
  FileText,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Compass,
  Sparkles,
  BarChart3,
  Activity,
  Layers
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export const HomePage: React.FC = () => {
  const { language, t } = useLanguage();
  const { isAuthenticated, quickDemoLogin } = useAuth();

  const metrics = [
    { label: language === 'ta' ? 'பதிவு செய்த விவசாயிகள்' : 'Active Farmers', value: '4,850+' },
    { label: language === 'ta' ? 'கண்காணிக்கப்படும் மண்டி சந்தைகள்' : 'Regulated Mandis', value: '38 Mandis' },
    { label: language === 'ta' ? 'AI நோய் கண்டறிதல் துல்லியம்' : 'AI Diagnostic Accuracy', value: '98.4%' },
    { label: language === 'ta' ? 'நேரடி சந்தை வர்த்தகம்' : 'Marketplace GMV', value: '₹2.8+ Cr' },
  ];

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-slate-50/80 text-slate-900 rounded-2xl sm:rounded-3xl mx-3 sm:mx-6 lg:mx-8 mt-4 sm:mt-6 p-6 sm:p-12 lg:p-16 shadow-subtle border border-emerald-200/80">
        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-emerald-200 text-xs font-semibold text-emerald-800 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>
              {language === 'ta'
                ? 'தமிழ்நாடு மற்றும் இந்திய விவசாயிகளுக்கான அடுத்த தலைமுறை AI தளம்'
                : 'Enterprise Agritech Intelligence • Tamil Nadu Delta & All-India'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-slate-900">
            {language === 'ta' ? (
              <>
                விவசாயத்தில் செயற்கை நுண்ணறிவு <br />
                <span className="text-emerald-700">அக்ரிஒன் AI</span> உடன் உழவு சிறக்கும்
              </>
            ) : (
              <>
                Precision Agronomy Meets <br />
                <span className="text-emerald-700">Direct Agricultural Market Access</span>
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
            {language === 'ta'
              ? 'பயிர் நோய் கண்டறிதல், மண் பரிசோதனை, நேரடி சந்தை விலைகள், இடைத்தரகர் இல்லாத உழவர் சந்தை மற்றும் டிராக்டர் முன்பதிவு — அனைத்தும் ஒரே தளத்தில்.'
              : 'Connect with AI Crop Doctor leaf diagnostics, personalized crop suitability recommendations, live mandi modal prices, farmer marketplace, tractor rentals, and verified agricultural schemes.'}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to={isAuthenticated ? '/dashboard' : '/register'}
              className="px-6 py-3 rounded-lg font-bold text-xs sm:text-sm bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-sm flex items-center space-x-2"
            >
              <span>{language === 'ta' ? 'தொடங்குங்கள்' : 'Get Started Free'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/disease-doctor"
              className="px-6 py-3 rounded-lg font-bold text-xs sm:text-sm bg-white text-slate-800 hover:bg-slate-50 border border-slate-200 active:scale-[0.98] transition-all shadow-2xs flex items-center space-x-2"
            >
              <Stethoscope className="w-4 h-4 text-emerald-600" />
              <span>{language === 'ta' ? 'பயிர் மருத்துவர்' : 'Try AI Crop Doctor'}</span>
            </Link>
          </div>

          {/* Fast Demo Switcher Bar */}
          {!isAuthenticated && (
            <div className="pt-4 border-t border-emerald-200/60 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-600 font-semibold">
                {language === 'ta' ? 'ஒரு நொடியில் உள்நுழைய:' : 'Instant Demo Roles:'}
              </span>
              <button
                type="button"
                onClick={() => quickDemoLogin('FARMER')}
                className="px-3.5 py-1.5 rounded-md bg-white hover:bg-emerald-50 text-emerald-900 font-semibold transition-colors border border-emerald-200 shadow-2xs active:scale-95"
              >
                🌾 {language === 'ta' ? 'விவசாயி' : 'Farmer (Selvam)'}
              </button>
              <button
                type="button"
                onClick={() => quickDemoLogin('BUYER')}
                className="px-3.5 py-1.5 rounded-md bg-white hover:bg-emerald-50 text-emerald-900 font-semibold transition-colors border border-emerald-200 shadow-2xs active:scale-95"
              >
                🛒 {language === 'ta' ? 'வாங்குபவர்' : 'Buyer (Kannan)'}
              </button>
              <button
                type="button"
                onClick={() => quickDemoLogin('ADMIN')}
                className="px-3.5 py-1.5 rounded-md bg-white hover:bg-emerald-50 text-emerald-900 font-semibold transition-colors border border-emerald-200 shadow-2xs active:scale-95"
              >
                🛡️ {language === 'ta' ? 'நிர்வாகி' : 'Platform Admin'}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Live Telemetry KPI Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {metrics.map((m, idx) => (
            <div key={idx} className="agri-panel p-4 sm:p-5 flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{m.label}</span>
              <div className="text-xl sm:text-2xl font-black text-slate-900 mt-2 tracking-tight">{m.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Feature Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
            <span>Enterprise Modules</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {language === 'ta' ? 'முக்கிய சிறப்பம்சங்கள்' : 'End-to-End Agritech Ecosystem'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            {language === 'ta'
              ? 'விதைப்பு முதல் அறுவடை வரை விவசாயிகளுக்கு தேவையான அனைத்து சேவைகளும்'
              : 'Empowering Indian growers with botanical AI diagnostics, soil analytics, real-time APMC price transparency, and seamless farm gate commerce.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Link to="/disease-doctor" className="agri-panel p-5 sm:p-6 flex flex-col group hover:border-emerald-300 transition-all">
            <div className="w-11 h-11 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform border border-emerald-100">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
              {t('actionDoctor')}
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed grow">
              {t('actionDoctorDesc')}
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-emerald-700 space-x-1 group-hover:translate-x-1 transition-transform">
              <span>{language === 'ta' ? 'இப்போதே ஸ்கேன் செய்' : 'Launch Diagnostic Engine'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link to="/crop-recommend" className="agri-panel p-5 sm:p-6 flex flex-col group hover:border-blue-300 transition-all">
            <div className="w-11 h-11 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform border border-blue-100">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-blue-700 transition-colors">
              {t('actionRecommend')}
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed grow">
              {t('actionRecommendDesc')}
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-blue-700 space-x-1 group-hover:translate-x-1 transition-transform">
              <span>{language === 'ta' ? 'பரிந்துரை பெற' : 'View Suitable Crops'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link to="/market-prices" className="agri-panel p-5 sm:p-6 flex flex-col group hover:border-amber-300 transition-all">
            <div className="w-11 h-11 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform border border-amber-100">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-amber-700 transition-colors">
              {t('actionMarket')}
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed grow">
              {t('actionMarketDesc')}
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-amber-700 space-x-1 group-hover:translate-x-1 transition-transform">
              <span>{language === 'ta' ? 'விலைகளை பார்க்க' : 'Track APMC Rates'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          <Link to="/marketplace" className="agri-panel p-5 sm:p-6 flex flex-col group hover:border-purple-300 transition-all">
            <div className="w-11 h-11 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform border border-purple-100">
              <Store className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-purple-700 transition-colors">
              {t('actionStore')}
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed grow">
              {t('actionStoreDesc')}
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-bold text-purple-700 space-x-1 group-hover:translate-x-1 transition-transform">
              <span>{language === 'ta' ? 'சந்தைக்குச் செல்ல' : 'Explore Produce Catalog'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>
      </section>

      {/* Trust & Infrastructure Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-10 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 border border-slate-200/90 shadow-subtle">
          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">
                {language === 'ta' ? 'உறுதிப்படுத்தப்பட்ட அரசு திட்டங்கள்' : 'Verified State Schemes'}
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Direct integration with PM-Kisan, PMFBY, and Tamil Nadu state agricultural subsidies with documentation requirements.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">
                {language === 'ta' ? '24/7 அக்ரிபோட் AI உதவியாளர்' : 'AgriBot AI Agronomist'}
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Round-the-clock agronomic intelligence in Tamil and English for balanced NPK dosages and pest containment.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">
                {language === 'ta' ? 'பண்ணை சேவைகள் & போக்குவரத்து' : 'Machinery & Freight'}
              </h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Harvesters, rotavators, field labour, and mini-truck logistics directly bookable from your farm gate.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

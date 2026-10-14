import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Stethoscope, TrendingUp, Bot, User } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { language } = useLanguage();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
      <Link
        to="/dashboard"
        className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors ${
          isActive('/dashboard') ? 'text-agri-600 font-bold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">{language === 'ta' ? 'முகப்பு' : 'Home'}</span>
      </Link>

      <Link
        to="/disease-doctor"
        className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors ${
          isActive('/disease-doctor') ? 'text-agri-600 font-bold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <Stethoscope className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">{language === 'ta' ? 'மருத்துவர்' : 'Doctor'}</span>
      </Link>

      <Link
        to="/market-prices"
        className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors ${
          isActive('/market-prices') ? 'text-agri-600 font-bold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <TrendingUp className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">{language === 'ta' ? 'சந்தை' : 'Market'}</span>
      </Link>

      <Link
        to="/agribot"
        className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors ${
          isActive('/agribot') ? 'text-agri-600 font-bold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <Bot className="w-5 h-5 text-harvest-600" />
        <span className="text-[10px] mt-0.5">{language === 'ta' ? 'அக்ரிபோட்' : 'AgriBot'}</span>
      </Link>

      <Link
        to="/farm-profile"
        className={`flex flex-col items-center py-1 px-2 rounded-xl transition-colors ${
          isActive('/farm-profile') ? 'text-agri-600 font-bold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">{language === 'ta' ? 'சுயவிவரம்' : 'Profile'}</span>
      </Link>
    </div>
  );
};

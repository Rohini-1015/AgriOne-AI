import React, { useState, useEffect } from 'react';
import {
  CloudSun,
  Droplets,
  Wind,
  CloudRain,
  MapPin,
  Search,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Gauge,
  Navigation,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { WeatherData } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

const TAMIL_NADU_DISTRICTS = [
  'Thanjavur',
  'Coimbatore',
  'Madurai',
  'Chennai',
  'Salem',
  'Erode',
  'Tiruchirappalli',
  'Dindigul',
  'Tirunelveli',
  'Vellore'
];

export const WeatherPage: React.FC = () => {
  const { language, t } = useLanguage();

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [selectedCity, setSelectedCity] = useState('Thanjavur');
  const [customSearch, setCustomSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeather(selectedCity);
  }, [selectedCity]);

  const fetchWeather = async (city: string) => {
    try {
      setLoading(true);
      const res = await api.get(`/weather?city=${encodeURIComponent(city)}`);
      if (res.data.success) {
        setWeather(res.data.data);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUseGps = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async pos => {
          try {
            setLoading(true);
            const { latitude, longitude } = pos.coords;
            const res = await api.get(`/weather?lat=${latitude}&lon=${longitude}`);
            if (res.data.success) {
              setWeather(res.data.data);
              setSelectedCity(res.data.data.location.name);
            }
          } catch (err) {
            console.error(err);
          } finally {
            setLoading(false);
          }
        },
        () => {
          alert('GPS access denied or unavailable. Please select your district manually.');
        }
      );
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSearch.trim()) {
      setSelectedCity(customSearch.trim());
      setCustomSearch('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold mb-1.5">
            <CloudSun className="w-3.5 h-3.5 text-sky-600" />
            <span>High-Resolution Agro-Meteorology & Spray Windows</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('actionWeather')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            {language === 'ta'
              ? 'விவசாய பணிகளுக்கான 7-நாள் மழை முன்னறிவிப்பு, காற்றின் வேகம் மற்றும் பூச்சிக்கொல்லி மருந்து தெளிக்கும் உகந்த நேரம்.'
              : 'Microclimate telemetry and 7-day precipitation modeling for pesticide spray suitability, irrigation timing, and crop protection.'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleUseGps}
            className="agri-btn-outline text-xs"
          >
            <Navigation className="w-3.5 h-3.5 text-emerald-700" />
            <span>Use GPS Auto-Detect</span>
          </button>
        </div>
      </div>

      {/* District Selector & Custom Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        {/* District Quick Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
          {TAMIL_NADU_DISTRICTS.map(city => (
            <button
              key={city}
              type="button"
              onClick={() => setSelectedCity(city)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                selectedCity.toLowerCase() === city.toLowerCase()
                  ? 'bg-sky-700 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Custom City Search */}
        <form onSubmit={handleSearchSubmit} className="relative grow w-full sm:w-auto">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={customSearch}
            onChange={e => setCustomSearch(e.target.value)}
            placeholder="Search any district or mandi town..."
            className="agri-input pl-9"
          />
        </form>
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <LoadingSpinner message="Querying localized agro-meteorological station telemetry..." />
        </div>
      ) : weather ? (
        <div className="space-y-6 sm:space-y-8">
          {/* Current Weather Card */}
          <div className="agri-panel p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-sky-950 to-indigo-950 text-white rounded-2xl relative overflow-hidden shadow-panel border-slate-800">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-6 space-y-2">
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-sky-200 text-xs font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  <span>{weather.location.name}, {weather.location.state}, India</span>
                </div>
                <div className="flex items-baseline space-x-3 pt-1">
                  <span className="text-5xl sm:text-6xl font-black text-white tracking-tight">
                    {weather.current.temp}°C
                  </span>
                  <span className="text-sm text-sky-200 font-medium">
                    Feels like {weather.current.feelsLike}°C
                  </span>
                </div>
                <p className="text-sm text-sky-100/90 font-medium">
                  {language === 'ta' ? weather.current.descriptionTa : weather.current.description}
                </p>
              </div>

              <div className="md:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
                  <span className="text-[11px] text-sky-200 block font-medium">{t('humidity')}</span>
                  <div className="text-xl font-black text-white mt-1 flex items-center space-x-1">
                    <Droplets className="w-4 h-4 text-sky-300" />
                    <span>{weather.current.humidity}%</span>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
                  <span className="text-[11px] text-sky-200 block font-medium">{t('rainProb')}</span>
                  <div className="text-xl font-black text-white mt-1 flex items-center space-x-1">
                    <CloudRain className="w-4 h-4 text-sky-300" />
                    <span>{weather.current.rainProbability}%</span>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
                  <span className="text-[11px] text-sky-200 block font-medium">{t('wind')}</span>
                  <div className="text-xl font-black text-white mt-1 flex items-center space-x-1">
                    <Wind className="w-4 h-4 text-sky-300" />
                    <span>{weather.current.windSpeed} km/h</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Advisory Alert Banner */}
            <div className="mt-6 pt-4 border-t border-white/15 flex items-start space-x-2.5 text-xs text-sky-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed font-medium">
                {language === 'ta'
                  ? weather.current.agriculturalAlertTa
                  : weather.current.agriculturalAlert}
              </span>
            </div>
          </div>

          {/* 7-Day Forecast Grid */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm sm:text-base text-slate-900 tracking-tight">
              {language === 'ta' ? '7-நாள் விரிவான வானிலை முன்னறிவிப்பு' : '7-Day Agronomic Forecast & Spray Advisories'}
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {weather.forecast.map((day, idx) => (
                <div key={idx} className="agri-panel p-3.5 text-center flex flex-col justify-between space-y-2">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      {language === 'ta' ? day.dayNameTa : day.dayName}
                    </span>
                    <span className="text-[10px] text-slate-400">{day.date}</span>
                  </div>

                  <div className="py-1">
                    <span className="text-xl font-black text-slate-900 block">{day.tempMax}°</span>
                    <span className="text-[11px] text-slate-400 font-semibold">{day.tempMin}°</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-center space-x-1 text-[11px] text-indigo-600 font-bold">
                      <CloudRain className="w-3.5 h-3.5" />
                      <span>{day.rainProbability}%</span>
                    </div>
                    <span className="text-[10px] text-slate-500 truncate block font-medium">
                      {language === 'ta' ? day.descriptionTa : day.description}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded block ${
                        day.spraySuitability === 'Favorable'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : day.spraySuitability === 'Caution'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}
                    >
                      Spray: {day.spraySuitability}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

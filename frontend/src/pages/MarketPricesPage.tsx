import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Search,
  Filter,
  ArrowUpDown,
  Calendar,
  Building2,
  LineChart,
  X,
  ArrowUpRight,
  Sparkles,
  MapPin
} from 'lucide-react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { MarketPrice } from '../types';
import { Modal } from '../components/common/Modal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const MarketPricesPage: React.FC = () => {
  const { language, t } = useLanguage();

  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [sortBy, setSortBy] = useState<'modalPrice' | 'cropName'>('modalPrice');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [loading, setLoading] = useState(true);

  // Trend Modal State
  const [trendModalOpen, setTrendModalOpen] = useState(false);
  const [trendData, setTrendData] = useState<any>(null);
  const [loadingTrend, setLoadingTrend] = useState(false);

  useEffect(() => {
    fetchPrices();
  }, [search, selectedDistrict, sortBy, order]);

  const fetchPrices = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedDistrict) params.append('district', selectedDistrict);
      if (sortBy) params.append('sortBy', sortBy);
      if (order) params.append('order', order);

      const res = await api.get(`/market/prices?${params.toString()}`);
      if (res.data.success) {
        setPrices(res.data.data.prices || []);
        if (res.data.data.districts) setDistricts(res.data.data.districts);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenTrend = async (cropName: string) => {
    try {
      setLoadingTrend(true);
      setTrendModalOpen(true);
      const res = await api.get(`/market/trend/${encodeURIComponent(cropName)}?days=7`);
      if (res.data.success) {
        setTrendData(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTrend(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold mb-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-rose-600" />
          <span>Tamil Nadu APMC Regulated Mandis (Agmarknet Live Telemetry)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t('navMarketPrices')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
          {language === 'ta'
            ? 'தமிழ்நாடு ஒழுங்குமுறை விற்பனைக்கூடங்களின் தினசரி மாதிரி விலை, குறைந்தபட்சம், அதிகபட்சம் மற்றும் 7 நாள் விலை மாற்றங்கள்.'
            : 'Track official daily mandi modal prices, arrival volumes, and 7-day price fluctuations across Tamil Nadu APMC agricultural markets.'}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="agri-panel p-3.5 sm:p-4 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="agri-input pl-9"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={selectedDistrict}
            onChange={e => setSelectedDistrict(e.target.value)}
            className="agri-select"
          >
            <option value="">{language === 'ta' ? 'அனைத்து மாவட்டங்கள்' : 'All APMC Districts'}</option>
            {districts.map((d, i) => (
              <option key={i} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-3 flex items-center space-x-2">
          <select
            value={`${sortBy}-${order}`}
            onChange={e => {
              const [sb, ord] = e.target.value.split('-');
              setSortBy(sb as any);
              setOrder(ord as any);
            }}
            className="agri-select font-medium"
          >
            <option value="modalPrice-desc">Price: High to Low</option>
            <option value="modalPrice-asc">Price: Low to High</option>
            <option value="cropName-asc">Crop: A - Z</option>
          </select>
        </div>
      </div>

      {/* Prices Table View */}
      <div className="agri-panel overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <LoadingSpinner message="Querying live APMC mandi arrivals and modal price transactions..." />
          </div>
        ) : prices.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No commodities matching specified criteria.
          </div>
        ) : (
          <div>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Commodity</th>
                    <th className="py-3 px-4">APMC Mandi</th>
                    <th className="py-3 px-4">District</th>
                    <th className="py-3 px-4 text-right">Min Price</th>
                    <th className="py-3 px-4 text-right">Max Price</th>
                    <th className="py-3 px-4 text-right">Modal Rate</th>
                    <th className="py-3 px-4 text-center">7-Day Trajectory</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {prices.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-extrabold text-slate-900 block text-sm">
                          {language === 'ta' && item.cropNameTa ? item.cropNameTa : item.cropName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">Per {item.unit}</span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700">
                        {item.marketName}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {item.district}, {item.state}
                      </td>
                      <td className="py-3.5 px-4 text-right font-medium text-slate-500">
                        ₹{item.minPrice.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right font-medium text-slate-500">
                        ₹{item.maxPrice.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="font-black text-sm text-emerald-700 block">
                          ₹{item.modalPrice.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-400">Benchmark</span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleOpenTrend(item.cropName)}
                          className="px-2.5 py-1 rounded-md border border-emerald-200 text-[11px] font-bold text-emerald-800 hover:bg-emerald-50 transition-colors inline-flex items-center space-x-1"
                        >
                          <LineChart className="w-3.5 h-3.5" />
                          <span>{language === 'ta' ? 'வரைபடம்' : '7-Day Trend'}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Stacked Card List View */}
            <div className="md:hidden divide-y divide-slate-100">
              {prices.map(item => (
                <div key={item.id} className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">
                        {language === 'ta' && item.cropNameTa ? item.cropNameTa : item.cropName}
                      </h4>
                      <p className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{item.marketName}, {item.district}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-base text-emerald-700 block">
                        ₹{item.modalPrice.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400">per {item.unit}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-slate-500 text-[11px]">
                      Range: ₹{item.minPrice.toLocaleString()} - ₹{item.maxPrice.toLocaleString()}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenTrend(item.cropName)}
                      className="px-2.5 py-1 rounded-md border border-emerald-200 text-[11px] font-bold text-emerald-800 hover:bg-emerald-50 inline-flex items-center space-x-1"
                    >
                      <LineChart className="w-3 h-3" />
                      <span>{language === 'ta' ? 'வரைபடம்' : 'Trend'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 7-Day Historical Modal Price Trend Dialog */}
      <Modal
        isOpen={trendModalOpen}
        onClose={() => setTrendModalOpen(false)}
        title={trendData ? `${trendData.cropName} — 7-Day Mandi Price Analysis` : 'Price Trend'}
        maxWidth="lg"
      >
        {loadingTrend ? (
          <LoadingSpinner message="Calculating 7-day historical price movement..." />
        ) : trendData ? (
          <div className="space-y-6">
            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                  Today's Prevailing Modal Rate
                </span>
                <span className="text-2xl font-black text-emerald-700">
                  ₹{trendData.currentPrice.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500 block">{trendData.marketName} Mandi</span>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 rounded text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Steady Volume (+3.2%)
                </span>
              </div>
            </div>

            {/* Visual Bar Trend Graph */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Daily Modal Rate Movement (Last 7 Days)
              </h4>
              <div className="space-y-2">
                {trendData.trends.map((t: any, idx: number) => {
                  const percentWidth = Math.min(
                    100,
                    Math.max(25, Math.round((t.modalPrice / (trendData.currentPrice * 1.15)) * 100))
                  );
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                        <span>{t.date}</span>
                        <span className="font-extrabold text-slate-900">
                          ₹{t.modalPrice.toLocaleString()} / {t.unit}
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-emerald-600 h-2 rounded-full transition-all"
                          style={{ width: `${percentWidth}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

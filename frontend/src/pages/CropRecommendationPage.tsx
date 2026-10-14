import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  Droplets,
  Calendar,
  DollarSign,
  Bug,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { CropRecommendation } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const CropRecommendationPage: React.FC = () => {
  const { language, t } = useLanguage();

  const [formData, setFormData] = useState({
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
    previousCrop: 'Black Gram',
  });

  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post('/crops/recommend', formData);
      if (res.data.success) {
        setRecommendations(res.data.data.recommendations || []);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error generating recommendations.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-1.5">
          <Compass className="w-3.5 h-3.5 text-blue-600" />
          <span>Agronomic Suitability & Yield Optimization Algorithm</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t('actionRecommend')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
          {language === 'ta'
            ? 'மண்ணின் சத்துக்கள் (N, P, K, pH), பருவமழை மற்றும் பாசன வசதியை உள்ளிட்டு உங்கள் நிலத்திற்கு அதிக விளைச்சல் தரும் பயிர்களை கண்டறியுங்கள்.'
            : 'Multi-parameter agronomic matching cross-referencing soil chemical assays, seasonal monsoon forecasts, and mandi profitability indices.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Form Inputs (5 Cols) */}
        <div className="lg:col-span-5">
          <div className="agri-panel p-5 sm:p-6 space-y-4">
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-emerald-600" />
              <span>{language === 'ta' ? 'நிலம் & பருவ அளவுருக்கள்' : 'Field & Seasonal Parameters'}</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'ta' ? 'மண் வகை' : 'Soil Texture Classification'}
                </label>
                <select
                  name="soilType"
                  value={formData.soilType}
                  onChange={handleInputChange}
                  className="agri-select"
                >
                  <option value="Alluvial">வண்டல் மண் (Alluvial Soil)</option>
                  <option value="Black">கரிசல் மண் (Black Cotton Soil)</option>
                  <option value="Red Loam">செம்மண் (Red Loam Soil)</option>
                  <option value="Clay Loam">களிமண் (Clay Loam Soil)</option>
                  <option value="Sandy Loam">மணல் கலந்த மண் (Sandy Loam)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Soil pH: <span className="text-emerald-700 font-bold">{formData.soilPh}</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="soilPh"
                    required
                    value={formData.soilPh}
                    onChange={handleInputChange}
                    className="agri-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'ta' ? 'பருவம்' : 'Cropping Season'}
                  </label>
                  <select
                    name="season"
                    value={formData.season}
                    onChange={handleInputChange}
                    className="agri-select"
                  >
                    <option value="Kharif">காரீப் (Kharif / குறுவை)</option>
                    <option value="Rabi">ராபி (Rabi / சாம்பா)</option>
                    <option value="Zaid">ஜைத் (Summer / கோடை)</option>
                    <option value="Year-round">ஆண்டு முழுவதும் (Year-round)</option>
                  </select>
                </div>
              </div>

              {/* NPK Inputs */}
              <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-200/90 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Soil Macronutrients (kg/ha)
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-500 font-semibold">Nitrogen (N)</label>
                    <input
                      type="number"
                      name="nitrogen"
                      required
                      value={formData.nitrogen}
                      onChange={handleInputChange}
                      className="agri-input text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-semibold">Phosphorus (P)</label>
                    <input
                      type="number"
                      name="phosphorus"
                      required
                      value={formData.phosphorus}
                      onChange={handleInputChange}
                      className="agri-input text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 font-semibold">Potassium (K)</label>
                    <input
                      type="number"
                      name="potassium"
                      required
                      value={formData.potassium}
                      onChange={handleInputChange}
                      className="agri-input text-center font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'ta' ? 'வெப்பநிலை (°C)' : 'Mean Temp (°C)'}
                  </label>
                  <input
                    type="number"
                    name="temperature"
                    required
                    value={formData.temperature}
                    onChange={handleInputChange}
                    className="agri-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'ta' ? 'மழை அளவு (மி.மீ)' : 'Rainfall (mm)'}
                  </label>
                  <input
                    type="number"
                    name="rainfall"
                    required
                    value={formData.rainfall}
                    onChange={handleInputChange}
                    className="agri-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'ta' ? 'பாசன முறை' : 'Irrigation Source'}
                  </label>
                  <select
                    name="irrigation"
                    value={formData.irrigation}
                    onChange={handleInputChange}
                    className="agri-select"
                  >
                    <option value="Canal & Borewell">கால்வாய் & போர்வெல்</option>
                    <option value="Drip Irrigation">சொட்டு நீர் பாசனம்</option>
                    <option value="Rainfed">மானாவாரி (மழை மட்டும்)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {language === 'ta' ? 'முந்தைய பயிர்' : 'Preceding Crop'}
                  </label>
                  <input
                    type="text"
                    name="previousCrop"
                    value={formData.previousCrop}
                    onChange={handleInputChange}
                    placeholder="e.g. Urad / Paddy"
                    className="agri-input"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.99] transition-all shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>{t('loading')}</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>{language === 'ta' ? 'பரிந்துரைகளைக் கணக்கிடு' : 'Compute Optimal Crop Plan'}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Output Recommendations (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {loading ? (
            <div className="agri-panel p-12 text-center">
              <LoadingSpinner message="Cross-referencing soil chemical parameters against 30+ regional crop profiles..." />
            </div>
          ) : recommendations.length > 0 ? (
            recommendations.map((crop, idx) => (
              <div
                key={idx}
                className={`agri-panel p-5 sm:p-6 space-y-4 border-l-4 ${
                  idx === 0 ? 'border-l-emerald-600 ring-1 ring-emerald-200/70 shadow-panel' : 'border-l-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                        idx === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        MATCH #{idx + 1}
                      </span>
                      <h3 className="text-base font-extrabold text-slate-900">
                        {language === 'ta' ? crop.cropNameTa : crop.cropNameEn}
                      </h3>
                    </div>
                    <span className="text-xs text-slate-500 mt-0.5 block">
                      Target Yield: <span className="font-bold text-slate-800">{crop.expectedYieldPerAcre}</span>
                    </span>
                  </div>

                  <div className="text-right">
                    <div className="inline-flex items-center px-3 py-1 rounded-md text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {crop.suitabilityScore}% Suitability
                    </div>
                  </div>
                </div>

                {/* Metrics Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-medium">Growth Cycle</span>
                    <span className="font-bold text-slate-800">{crop.growingPeriodDays} Days</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-medium">Water Index</span>
                    <span className="font-bold text-blue-700">{crop.waterRequirement}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 sm:col-span-2">
                    <span className="text-[10px] text-slate-400 block font-medium">Market Potential</span>
                    <span className="font-bold text-emerald-800 line-clamp-1">{crop.estimatedMarketPotential}</span>
                  </div>
                </div>

                {/* Cultivation Guidance */}
                <div className="bg-emerald-50/60 p-3 rounded-lg border border-emerald-200/80 text-xs text-emerald-950 space-y-1">
                  <span className="font-bold block uppercase tracking-wider text-[10px] text-emerald-800">
                    {language === 'ta' ? 'சாகுபடி வழிகாட்டுதல்' : 'Scientific Cultivation Guidance'}
                  </span>
                  <p className="leading-relaxed font-medium">
                    {language === 'ta' ? crop.cultivationGuidanceTa : crop.cultivationGuidanceEn}
                  </p>
                </div>

                {/* Nutrient Needs & Diseases */}
                <div className="text-xs space-y-1 text-slate-600 bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                  <p>
                    <span className="font-bold text-slate-800">Key Nutrients:</span> {crop.importantNutrients}
                  </p>
                  <p>
                    <span className="font-bold text-slate-800">Known Disease Risks:</span> {crop.commonDiseases.join(', ')}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="agri-panel p-12 text-center space-y-3 border-dashed">
              <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100">
                <Compass className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">
                {language === 'ta' ? 'மண் விபரங்களை உள்ளிடவும்' : 'Ready for Soil & Climate Analysis'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                {language === 'ta'
                  ? 'இடது புற படிவத்தில் உங்கள் மண் அளவீடுகளை உள்ளிட்டு "பரிந்துரைகளைக் கணக்கிடு" பொத்தானை அழுத்தவும்.'
                  : 'Adjust soil NPK, pH, and climate parameters on the left and run computation to generate ranked crop suitability scores.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

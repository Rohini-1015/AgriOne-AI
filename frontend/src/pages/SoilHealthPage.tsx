import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Clock,
  HelpCircle,
  ShieldCheck,
  Droplets,
  Layers,
  FlaskConical
} from 'lucide-react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { SoilAnalysisResult, SoilReportRecord } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const SoilHealthPage: React.FC = () => {
  const { language, t } = useLanguage();

  const [formData, setFormData] = useState({
    ph: 6.8,
    nitrogen: 210,
    phosphorus: 24,
    potassium: 195,
    organicCarbon: 0.65,
    moisture: 28,
    soilType: 'Alluvial',
  });

  const [analysis, setAnalysis] = useState<SoilAnalysisResult | null>(null);
  const [history, setHistory] = useState<SoilReportRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/soil/history');
      if (res.data.success) {
        setHistory(res.data.data.history || []);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post('/soil/analyze', formData);
      if (res.data.success) {
        setAnalysis(res.data.data.analysis);
        await fetchHistory();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error running soil test.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusPill = (status: string) => {
    switch (status.toLowerCase()) {
      case 'sufficient':
      case 'neutral':
      case 'medium':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'excess':
      case 'high':
      case 'alkaline':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      default:
        return 'bg-amber-50 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200">
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-1.5">
          <FlaskConical className="w-3.5 h-3.5 text-amber-600" />
          <span>Soil Health Card (SHC) Chemistry Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {t('actionSoil')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
          {language === 'ta'
            ? 'மண்ணின் pH, தழைச்சத்து (N), மணிச்சத்து (P), சாம்பல் சத்து (K), மற்றும் கரிமக்கரி (Organic Carbon) அளவீடுகளை உள்ளிட்டு மண் வள அட்டையை பெறுங்கள்.'
            : 'Enter laboratory or field test values to calculate your Soil Health Index, identify micro and macronutrient deficiencies, and get customized fertilizer dosage plans.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Form Inputs (5 Cols) */}
        <div className="lg:col-span-5">
          <div className="agri-panel p-5 sm:p-6 space-y-4">
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center space-x-2">
              <FlaskConical className="w-4 h-4 text-amber-600" />
              <span>{language === 'ta' ? 'மண் பரிசோதனை அளவீடுகள்' : 'Soil Test Chemical Assays'}</span>
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
                  <option value="Clay">களிமண் (Clay Soil)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    pH: <span className="text-emerald-700 font-bold">{formData.ph}</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="ph"
                    required
                    value={formData.ph}
                    onChange={handleInputChange}
                    className="agri-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Organic Carbon (%): <span className="text-emerald-700 font-bold">{formData.organicCarbon}</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="organicCarbon"
                    required
                    value={formData.organicCarbon}
                    onChange={handleInputChange}
                    className="agri-input"
                  />
                </div>
              </div>

              {/* NPK Inputs */}
              <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-200/90 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Available Nutrients (kg/ha)
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

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'ta' ? 'ஈரப்பதம் (%)' : 'Soil Moisture Content (%)'}
                </label>
                <input
                  type="number"
                  name="moisture"
                  required
                  value={formData.moisture}
                  onChange={handleInputChange}
                  className="agri-input"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg text-xs font-bold bg-amber-600 text-white hover:bg-amber-700 active:scale-[0.99] transition-all shadow-sm flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>{t('loading')}</span>
                ) : (
                  <>
                    <Activity className="w-4 h-4" />
                    <span>{language === 'ta' ? 'மண் வளத்தை ஆய்வு செய்' : 'Compute Soil Health Score'}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Output Soil Score & Guidance (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {loading ? (
            <div className="agri-panel p-12 text-center">
              <LoadingSpinner message="Calculating Soil Health Index and macro-element stoichiometries..." />
            </div>
          ) : analysis ? (
            <div className="agri-panel p-5 sm:p-7 space-y-6 animate-in fade-in shadow-panel">
              {/* Score Meter Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    {t('soilScoreTitle')}
                  </span>
                  <div className="flex items-baseline space-x-2 mt-1">
                    <span className="text-4xl font-black text-slate-900 tracking-tight">{analysis.healthScore}</span>
                    <span className="text-sm text-slate-400 font-bold">/ 100</span>
                    <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 ml-2">
                      {analysis.rating} Fertility
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 max-w-xs">
                  {analysis.suggestedCrops.slice(0, 4).map((c, i) => (
                    <span key={i} className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      🌾 {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Status Grid */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                  {t('nutrientStatus')}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="bg-slate-50/70 p-3 rounded-lg border border-slate-200/90 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold block">NITROGEN (N)</span>
                    <span className="font-black text-sm text-slate-900 block">{analysis.nutrientStatus.nitrogen.level} kg/ha</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] inline-block font-semibold border ${getStatusPill(analysis.nutrientStatus.nitrogen.status)}`}>
                      {analysis.nutrientStatus.nitrogen.status}
                    </span>
                  </div>

                  <div className="bg-slate-50/70 p-3 rounded-lg border border-slate-200/90 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold block">PHOSPHORUS (P)</span>
                    <span className="font-black text-sm text-slate-900 block">{analysis.nutrientStatus.phosphorus.level} kg/ha</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] inline-block font-semibold border ${getStatusPill(analysis.nutrientStatus.phosphorus.status)}`}>
                      {analysis.nutrientStatus.phosphorus.status}
                    </span>
                  </div>

                  <div className="bg-slate-50/70 p-3 rounded-lg border border-slate-200/90 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold block">POTASSIUM (K)</span>
                    <span className="font-black text-sm text-slate-900 block">{analysis.nutrientStatus.potassium.level} kg/ha</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] inline-block font-semibold border ${getStatusPill(analysis.nutrientStatus.potassium.status)}`}>
                      {analysis.nutrientStatus.potassium.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Deficiencies */}
              {analysis.deficiencies.length > 0 && (
                <div className="bg-amber-50/60 border border-amber-200/90 p-4 rounded-lg space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center space-x-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>{t('deficienciesFound')}</span>
                  </h4>
                  <ul className="text-xs text-amber-900 space-y-1 list-disc list-inside font-medium">
                    {analysis.deficiencies.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Fertilizer Guidance */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {t('fertilizerDosage')}
                </h4>
                <div className="space-y-2">
                  {(language === 'ta' ? analysis.fertilizerGuidanceTa : analysis.fertilizerGuidanceEn).map((g, i) => (
                    <div key={i} className="flex items-start space-x-2 text-xs text-slate-700 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed font-medium">{g}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Soil Improvement Tips */}
              <div className="bg-slate-50/70 p-4 rounded-lg border border-slate-200/80 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {t('soilTips')}
                </h4>
                <div className="space-y-1.5">
                  {(language === 'ta' ? analysis.improvementTipsTa : analysis.improvementTipsEn).map((tip, i) => (
                    <p key={i} className="text-xs text-slate-600 leading-relaxed font-medium">
                      • {tip}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="agri-panel p-12 text-center space-y-3 border-dashed">
              <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-100">
                <FileSpreadsheet className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">
                {language === 'ta' ? 'மண் பரிசோதனை அறிக்கையை பெறுக' : 'Awaiting Soil Lab Analysis'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                {language === 'ta'
                  ? 'இடது புற படிவத்தில் NPK மற்றும் pH அளவுகளை உள்ளிட்டு "மண் வளத்தை ஆய்வு செய்" பொத்தானை அழுத்தவும்.'
                  : 'Enter your soil lab assay parameters on the left and run analysis to calculate your Soil Health Card report.'}
              </p>
            </div>
          )}

          {/* Soil Report History */}
          <div className="agri-panel p-5 sm:p-6 space-y-3">
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{language === 'ta' ? 'முந்தைய மண் பரிசோதனை அறிக்கைகள்' : 'Historical Soil Health Reports'}</span>
              </span>
              <span className="text-xs text-slate-400 font-semibold">{history.length} records</span>
            </h3>

            <div className="space-y-2 max-h-48 overflow-y-auto divide-y divide-slate-100">
              {history.map(item => (
                <div key={item.id} className="pt-2 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800 block">
                      {item.soilType} Soil Plot (pH {item.ph})
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Score: {item.healthScore}/100
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

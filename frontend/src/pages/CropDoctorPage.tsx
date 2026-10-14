import React, { useState, useEffect } from 'react';
import {
  Upload,
  Stethoscope,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  Clock,
  Camera,
  Layers,
  ArrowRight,
  Activity,
  FileCheck,
  Check,
  HelpCircle,
  Maximize2
} from 'lucide-react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { DiseaseDiagnosis, DiseaseScanRecord } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

const DEMO_LEAF_SAMPLES = [
  {
    name: 'Rice Leaf Blast Sample',
    nameTa: 'நெல் குலை நோய் இலை',
    crop: 'Paddy / Rice',
    url: 'https://images.unsplash.com/photo-1597916829826-02e5bb4a54e0?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Tomato Early Blight Sample',
    nameTa: 'தக்காளி ஆரம்ப கருகல் நோய்',
    crop: 'Tomato',
    url: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef2c4cc?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Cotton Leaf Curl Sample',
    nameTa: 'பருத்தி இலைச்சுருட்டு நோய்',
    crop: 'Cotton',
    url: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=600&auto=format&fit=crop&q=80',
  },
  {
    name: 'Healthy Botanical Foliage',
    nameTa: 'ஆரோக்கியமான இலை',
    crop: 'Healthy',
    url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&auto=format&fit=crop&q=80',
  },
];

export const CropDoctorPage: React.FC = () => {
  const { language, t } = useLanguage();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [cropHint, setCropHint] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiseaseDiagnosis | null>(null);
  const [history, setHistory] = useState<DiseaseScanRecord[]>([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/disease/history');
      if (res.data.success) {
        setHistory(res.data.data.history || []);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setDiagnosis(null);
    }
  };

  const handleSelectDemo = (sample: typeof DEMO_LEAF_SAMPLES[0]) => {
    setSelectedFile(null);
    setPreviewUrl(sample.url);
    setCropHint(sample.crop);
    setDiagnosis(null);
  };

  const handleDiagnose = async () => {
    if (!selectedFile && !previewUrl) {
      alert('Please upload an image or choose a demo leaf sample.');
      return;
    }

    try {
      setAnalyzing(true);
      const formData = new FormData();
      if (selectedFile) {
        formData.append('image', selectedFile);
      } else {
        formData.append('imageUrl', previewUrl);
      }
      formData.append('cropHint', cropHint);

      const res = await api.post('/disease/predict', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setDiagnosis(res.data.data.diagnosis);
        await fetchHistory();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error executing AI diagnosis.');
    } finally {
      setAnalyzing(false);
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'severe':
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'moderate':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
  };

  const steps = [
    { num: 1, label: language === 'ta' ? 'இலை பதிவேற்றம்' : 'Upload Leaf', active: true },
    { num: 2, label: language === 'ta' ? 'முன்னோட்டம்' : 'Inspect Preview', active: !!previewUrl },
    { num: 3, label: language === 'ta' ? 'AI பகுப்பாய்வு' : 'Neural Inference', active: analyzing || !!diagnosis },
    { num: 4, label: language === 'ta' ? 'மருத்துவ அறிக்கை' : 'Pathology Report', active: !!diagnosis },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header & Clinical Stepper */}
      <div className="space-y-4 pb-4 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Deep-Learning Botanical Vision Model v2.4</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t('actionDoctor')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              {language === 'ta'
                ? 'பயிரின் பாதிக்கப்பட்ட இலையை புகைப்படம் எடுத்து பதிவேற்றவும். AI மாதிரி நோயை உடனே கண்டறிந்து இரசாயன மற்றும் இயற்கை தீர்வுகளை வழங்கும்.'
                : 'Computer vision diagnostics for foliar chlorosis, leaf blast, early blight, bacterial wilt, and pest necrosis with tailored agronomic treatment protocols.'}
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 self-start sm:self-auto">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>98.4% Empirical Accuracy</span>
          </div>
        </div>

        {/* 4-Step Clinical Workflow Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-lg border text-xs flex items-center space-x-2.5 transition-colors ${
                step.active
                  ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-400 font-medium'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                step.active ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {step.num}
              </span>
              <span className="truncate">{step.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Diagnostic Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column: Image Upload & Demo Specimens (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="agri-panel p-5 sm:p-6 space-y-4">
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center space-x-2">
              <Camera className="w-4 h-4 text-emerald-600" />
              <span>{t('uploadTitle')}</span>
            </h3>

            {/* Dropzone Container */}
            <div className="relative border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-5 text-center cursor-pointer transition-colors bg-slate-50/50 group">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              {previewUrl ? (
                <div className="space-y-3">
                  <div className="relative rounded-lg overflow-hidden ring-1 ring-slate-200 shadow-sm max-h-52 mx-auto">
                    <img
                      src={previewUrl}
                      alt="Preview Leaf"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-slate-900/70 text-white text-[10px] font-semibold backdrop-blur-xs">
                      Active Specimen
                    </div>
                  </div>
                  <p className="text-xs text-emerald-700 font-bold flex items-center justify-center space-x-1">
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{language === 'ta' ? 'படத்தை மாற்ற கிளிக் செய்யவும்' : 'Click or drop to replace image'}</span>
                  </p>
                </div>
              ) : (
                <div className="space-y-3 py-6">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      {language === 'ta' ? 'இலையை பதிவேற்ற இங்கே கிளிக் செய்யவும்' : 'Click or Drag High-Res Leaf Specimen'}
                    </span>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      {t('uploadHint')}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Crop Category Hint */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {language === 'ta' ? 'பயிர் வகை (விருப்பத்தேர்வு)' : 'Target Crop Category (Optional)'}
              </label>
              <input
                type="text"
                value={cropHint}
                onChange={e => setCropHint(e.target.value)}
                placeholder="e.g. Paddy / Rice, Tomato, Cotton, Sugarcane..."
                className="agri-input"
              />
            </div>

            {/* Diagnose Action Button */}
            <button
              type="button"
              onClick={handleDiagnose}
              disabled={analyzing || !previewUrl}
              className="w-full py-3 rounded-lg text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.99] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {analyzing ? (
                <span>{t('analyzing')}</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{t('diagnoseBtn')}</span>
                </>
              )}
            </button>
          </div>

          {/* Test Reference Samples */}
          <div className="agri-panel p-4 sm:p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'மாதிரி இலைகள் (பரிசோதனைக்கு):' : 'Pre-Loaded Field Test Specimens:'}</span>
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_LEAF_SAMPLES.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectDemo(sample)}
                  className="flex items-center space-x-2.5 p-2 rounded-lg border border-slate-200/90 hover:border-emerald-500 bg-white hover:bg-emerald-50/40 transition-all text-left group"
                >
                  <img
                    src={sample.url}
                    alt={sample.name}
                    className="w-10 h-10 rounded-md object-cover ring-1 ring-slate-200 shrink-0"
                  />
                  <div className="overflow-hidden min-w-0">
                    <span className="text-[11px] font-bold text-slate-800 truncate block group-hover:text-emerald-700">
                      {language === 'ta' ? sample.nameTa : sample.name}
                    </span>
                    <span className="text-[10px] text-slate-400 block">{sample.crop}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Diagnosis Engine Output (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {analyzing ? (
            <div className="agri-panel p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full border-3 border-emerald-600 border-t-transparent animate-spin mx-auto" />
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-slate-900">Neural Vision Pipeline In Progress</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Evaluating foliar lesions, mycelial sporulation, and margin chlorosis against trained agronomy databases...
                </p>
              </div>
            </div>
          ) : diagnosis ? (
            <div className="agri-panel p-5 sm:p-7 space-y-6 animate-in fade-in slide-in-from-bottom-2 border-emerald-300 shadow-panel">
              {/* Diagnosis Header */}
              <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                    {diagnosis.cropName} Pathology Verification
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5 tracking-tight">
                    {language === 'ta' ? diagnosis.diseaseNameTa : diagnosis.diseaseNameEn}
                  </h2>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${getSeverityBadge(diagnosis.severity)}`}>
                    {diagnosis.severity} Severity
                  </span>
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                    {diagnosis.confidence}% Confidence
                  </span>
                </div>
              </div>

              {/* Confidence Progress Meter */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-600">
                  <span>Model Certainty Gauge</span>
                  <span className="text-emerald-700 font-bold">{diagnosis.confidence}% Match Index</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-2.5 rounded-full transition-all duration-700"
                    style={{ width: `${diagnosis.confidence}%` }}
                  />
                </div>
              </div>

              {/* Identified Symptoms */}
              <div className="bg-slate-50/70 p-4 rounded-lg border border-slate-200/80 space-y-1">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  {t('symptoms')}
                </h4>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                  {language === 'ta' ? diagnosis.symptomsTa : diagnosis.symptomsEn}
                </p>
              </div>

              {/* Dual Remedy Matrix: Bio / Organic vs Chemical Formulation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-emerald-50/60 border border-emerald-200/90 p-4 rounded-lg space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t('organicCure')}</span>
                  </h4>
                  <p className="text-xs text-emerald-900 leading-relaxed font-medium">
                    {language === 'ta' ? diagnosis.preventionTa : diagnosis.preventionEn}
                  </p>
                </div>

                <div className="bg-amber-50/60 border border-amber-200/90 p-4 rounded-lg space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-950 flex items-center space-x-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                    <span>{t('chemicalCure')}</span>
                  </h4>
                  <p className="text-xs text-amber-950 leading-relaxed font-medium">
                    {language === 'ta' ? diagnosis.treatmentTa : diagnosis.treatmentEn}
                  </p>
                </div>
              </div>

              {/* Recommended Agronomic Checklist */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {t('actionSteps')}
                </h4>
                <div className="space-y-2">
                  {(language === 'ta' ? diagnosis.recommendedStepsTa : diagnosis.recommendedStepsEn).map((step, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-xs text-slate-700 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed font-medium">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Awaiting Specimen State */
            <div className="agri-panel p-10 sm:p-12 text-center space-y-3 border-dashed">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-100">
                <Stethoscope className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {language === 'ta' ? 'இலை புகைப்படத்தை பதிவேற்றவும்' : 'Awaiting Botanical Specimen'}
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                  {language === 'ta'
                    ? 'இடது புறத்தில் உள்ள பெட்டியில் பாதிக்கப்பட்ட இலையை பதிவேற்றி "நோய் கண்டறிதலைத் தொடங்கு" பொத்தானை அழுத்தவும்.'
                    : 'Upload a leaf photo from your device or pick a pre-loaded test specimen on the left to trigger the diagnostic pipeline.'}
                </p>
              </div>
            </div>
          )}

          {/* Historical Scans Feed */}
          <div className="agri-panel p-5 sm:p-6 space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <span className="flex items-center space-x-2 text-xs font-bold text-slate-900">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>{language === 'ta' ? 'முந்தைய நோய் ஆய்வுகள்' : 'Historical Diagnostic Records'}</span>
              </span>
              <span className="text-xs text-slate-400 font-semibold">{history.length} records</span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto divide-y divide-slate-100">
              {history.map(item => (
                <div key={item.id} className="pt-2 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3 min-w-0">
                    <img
                      src={item.imagePath}
                      alt={item.cropName}
                      className="w-10 h-10 rounded-md object-cover ring-1 ring-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="font-bold text-slate-800 truncate block">{item.diseaseName}</span>
                      <span className="text-[10px] text-slate-400 block">
                        {item.cropName} • {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 ml-2 ${getSeverityBadge(item.severity)}`}>
                    {item.severity} ({item.confidence}%)
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

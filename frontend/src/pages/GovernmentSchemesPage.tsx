import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  Info,
  Plus,
  Landmark,
  BadgePercent,
  Layers,
  Sparkles
} from 'lucide-react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { GovernmentScheme } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Modal } from '../components/common/Modal';

const CATEGORIES = ['All', 'Subsidies', 'Insurance', 'Credit & Loans', 'Infrastructure'];

export const GovernmentSchemesPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();

  const [schemes, setSchemes] = useState<GovernmentScheme[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    nameEn: '',
    nameTa: '',
    category: 'Subsidies',
    descriptionEn: '',
    descriptionTa: '',
    eligibilityEn: '',
    eligibilityTa: '',
    benefitsEn: '',
    benefitsTa: '',
    documentsEn: '',
    documentsTa: '',
    applicationProcess: '',
    officialUrl: '',
  });

  useEffect(() => {
    fetchSchemes();
  }, [search, selectedCategory]);

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedCategory !== 'All') params.append('category', selectedCategory);

      const res = await api.get(`/schemes?${params.toString()}`);
      if (res.data.success) {
        setSchemes(res.data.data.schemes || []);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateScheme = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/schemes', formData);
      setModalOpen(false);
      await fetchSchemes();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error creating scheme.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-3">
            <Landmark className="w-3.5 h-3.5 text-emerald-600" />
            <span>Official Government DBT & State Welfare Portals</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            {t('navSchemes')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            {language === 'ta'
              ? 'மத்திய மற்றும் தமிழ்நாடு அரசின் உழவர் நல திட்டங்கள், பயிர் காப்பீடு, இயந்திர மானியங்கள் மற்றும் விண்ணப்பிக்கும் முறைகள்.'
              : 'Direct Benefit Transfer (DBT) income support, micro-irrigation capital subsidies, and PMFBY crop insurance policies with authenticated application portals.'}
          </p>
        </div>

        {user?.role === 'ADMIN' && (
          <button
            onClick={() => setModalOpen(true)}
            className="agri-btn-primary flex items-center gap-2 self-start md:self-auto py-2.5 px-5 text-xs font-bold"
          >
            <Plus className="w-4 h-4" />
            <span>Add Government Scheme</span>
          </button>
        )}
      </div>

      {/* Search & Category Filter Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search scheme name, eligibility, subsidy keyword..."
            className="w-full text-xs pl-10 pr-4 py-3 rounded-2xl border border-slate-300 bg-white shadow-2xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <LoadingSpinner message="Retrieving verified agricultural welfare schemes..." />
        </div>
      ) : schemes.length === 0 ? (
        <div className="agri-card p-14 text-center space-y-3 max-w-md mx-auto">
          <FileText className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="font-bold text-sm text-slate-800">No schemes found</h3>
          <p className="text-xs text-slate-500">
            No matching agricultural schemes found for "{search}". Try searching with different keywords.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {schemes.map(scheme => (
            <div
              key={scheme.id}
              className="agri-card p-6 flex flex-col justify-between space-y-5 border-slate-200 hover:border-emerald-300 transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-100">
                      {scheme.category}
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900 mt-2 leading-snug">
                      {language === 'ta' && scheme.nameTa ? scheme.nameTa : scheme.nameEn}
                    </h3>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {language === 'ta' && scheme.descriptionTa ? scheme.descriptionTa : scheme.descriptionEn}
                </p>

                {/* Financial Benefits Box */}
                <div className="bg-emerald-50/80 p-4 rounded-xl border border-emerald-100/90 text-xs text-emerald-950 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-900 uppercase tracking-wider">
                    <BadgePercent className="w-4 h-4 text-emerald-700" />
                    <span>{language === 'ta' ? 'திட்ட நன்மைகள்' : 'Financial Benefit & Subsidy Coverage'}</span>
                  </div>
                  <p className="leading-relaxed">
                    {language === 'ta' && scheme.benefitsTa ? scheme.benefitsTa : scheme.benefitsEn}
                  </p>
                </div>

                {/* Eligibility & Documents */}
                <div className="space-y-2 text-xs text-slate-600 pt-1">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-800">
                        {language === 'ta' ? 'தகுதி: ' : 'Eligibility: '}
                      </span>
                      <span>{language === 'ta' && scheme.eligibilityTa ? scheme.eligibilityTa : scheme.eligibilityEn}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <FileCheck className="w-3.5 h-3.5 text-harvest-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-800">
                        {language === 'ta' ? 'தேவையான ஆவணங்கள்: ' : 'Required Documents: '}
                      </span>
                      <span>{language === 'ta' && scheme.documentsTa ? scheme.documentsTa : scheme.documentsEn}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Official Link Button */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">Verified Government Resource</span>
                <a
                  href={scheme.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="agri-btn-primary px-4 py-2 text-xs font-bold inline-flex items-center gap-2"
                >
                  <span>{language === 'ta' ? 'அதிகாரப்பூர்வ தளம்' : 'Official Portal'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Admin Add Scheme Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Government Scheme" maxWidth="lg">
        <form onSubmit={handleCreateScheme} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Scheme Name (English)</label>
            <input
              type="text"
              required
              value={formData.nameEn}
              onChange={e => setFormData({ ...formData, nameEn: e.target.value })}
              className="agri-input text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Scheme Name (Tamil / தமிழ்)</label>
            <input
              type="text"
              required
              value={formData.nameTa}
              onChange={e => setFormData({ ...formData, nameTa: e.target.value })}
              className="agri-input text-xs"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="agri-input text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Official Portal URL</label>
              <input
                type="url"
                required
                value={formData.officialUrl}
                onChange={e => setFormData({ ...formData, officialUrl: e.target.value })}
                className="agri-input text-xs"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description (English)</label>
            <textarea
              rows={2}
              required
              value={formData.descriptionEn}
              onChange={e => setFormData({ ...formData, descriptionEn: e.target.value })}
              className="agri-input text-xs resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Benefits (English)</label>
            <input
              type="text"
              required
              value={formData.benefitsEn}
              onChange={e => setFormData({ ...formData, benefitsEn: e.target.value })}
              className="agri-input text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Eligibility Criteria</label>
            <input
              type="text"
              required
              value={formData.eligibilityEn}
              onChange={e => setFormData({ ...formData, eligibilityEn: e.target.value })}
              className="agri-input text-xs"
            />
          </div>
          <button
            type="submit"
            className="agri-btn-primary w-full py-3 text-xs font-bold flex items-center justify-center gap-2 mt-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Publish Scheme to Repository</span>
          </button>
        </form>
      </Modal>
    </div>
  );
};

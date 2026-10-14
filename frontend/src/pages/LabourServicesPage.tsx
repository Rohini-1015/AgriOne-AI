import React, { useState, useEffect } from 'react';
import {
  Users,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Plus,
  CheckCircle2,
  ShieldCheck,
  Briefcase,
  UserCheck,
  Sparkles
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LabourRequest } from '../types';
import { Modal } from '../components/common/Modal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const LabourServicesPage: React.FC = () => {
  const { user } = useAuth();
  const { language, t } = useLanguage();

  const [requests, setRequests] = useState<LabourRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    workType: 'Harvesting & Threshing',
    workerCount: 5,
    workDate: new Date().toISOString().split('T')[0],
    durationDays: 2,
    location: user ? `${user.village}, ${user.district}` : 'Sundar Garden, Thanjavur',
    budgetPerWorker: 550,
    requirements: 'Paddy harvesting; morning tea and drinking water provided',
    contactPhone: user ? user.mobileNumber : '9876543210',
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get('/services/labour/requests');
      if (res.data.success) {
        setRequests(res.data.data.requests || []);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/services/labour/requests', formData);
      if (res.data.success) {
        alert('Labour request submitted successfully!');
        setModalOpen(false);
        await fetchRequests();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error submitting request.');
    }
  };

  const totalWorkersHired = requests.reduce((acc, r) => acc + (r.workerCount || 0), 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold mb-3">
            <Users className="w-3.5 h-3.5 text-indigo-600" />
            <span>Farm Labour & Harvesting Workforce Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            {t('navLabour')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            {language === 'ta'
              ? 'விதைப்பு, நடவு, களை எடுத்தல் மற்றும் அறுவடை பணிகளுக்கான நம்பகமான விவசாய கூலி தொழிலாளர்களை முன்பதிவு செய்யுங்கள்.'
              : 'Post field workforce requirements for seasonal transplanting, weeding, pesticide spraying, and crop harvesting with verified local farm crews.'}
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="agri-btn-primary flex items-center gap-2 self-start md:self-auto py-2.5 px-5 text-xs font-bold"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'ta' ? 'தொழிலாளர்களை கோருங்கள்' : 'Request Farm Workers'}</span>
        </button>
      </div>

      {/* Workforce Value Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="agri-card p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Skilled Farm Gangs</h4>
            <p className="text-[11px] text-slate-500">Experienced in paddy transplanting and harvesting</p>
          </div>
        </div>

        <div className="agri-card p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Transparent Daily Wages</h4>
            <p className="text-[11px] text-slate-500">Standardized regional rates with zero middlemen cut</p>
          </div>
        </div>

        <div className="agri-card p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Guaranteed Attendance</h4>
            <p className="text-[11px] text-slate-500">Scheduled gang leaders ensure full team reporting</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <LoadingSpinner message="Retrieving agricultural labour requests..." />
        </div>
      ) : (
        <div className="agri-card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                {language === 'ta' ? 'என் தொழிலாளர் முன்பதிவுகள்' : 'My Labour Service Requests'}
              </h3>
              <p className="text-xs text-slate-500">Active postings and hired workforce attendance</p>
            </div>
            {requests.length > 0 && (
              <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100 self-start sm:self-auto">
                Total Allocated: {totalWorkersHired} Workers
              </span>
            )}
          </div>

          {requests.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-500">
              No active labour requests found. Click "Request Farm Workers" to post your requirements.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                    <th className="py-3 px-3">Work Type</th>
                    <th className="py-3 px-3">Workers Needed</th>
                    <th className="py-3 px-3">Schedule & Duration</th>
                    <th className="py-3 px-3">Daily Wage</th>
                    <th className="py-3 px-3">Field Location</th>
                    <th className="py-3 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {requests.map(req => (
                    <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-3 font-bold text-slate-900 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-indigo-600" />
                        <span>{req.workType}</span>
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-indigo-700">
                        {req.workerCount} Workers
                      </td>
                      <td className="py-3.5 px-3 text-slate-600">
                        {req.workDate} <span className="text-slate-400">({req.durationDays} Days)</span>
                      </td>
                      <td className="py-3.5 px-3 font-bold text-slate-800">₹{req.budgetPerWorker} <span className="text-[11px] font-normal text-slate-500">/ day</span></td>
                      <td className="py-3.5 px-3 text-slate-600 max-w-[200px] truncate">{req.location}</td>
                      <td className="py-3.5 px-3 text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal Form */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Request Agricultural Labour Workforce" maxWidth="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Work Type</label>
            <select
              value={formData.workType}
              onChange={e => setFormData({ ...formData, workType: e.target.value })}
              className="agri-select text-xs"
            >
              <option value="Harvesting & Threshing">Harvesting & Threshing (அறுவடை மற்றும் கதிரடித்தல்)</option>
              <option value="Transplanting / Sowing">Transplanting / Sowing (நாற்று நடுதல்)</option>
              <option value="Weeding & De-trashing">Weeding & De-trashing (களை எடுத்தல்)</option>
              <option value="Pesticide Spraying">Pesticide Spraying (பூச்சிக்கொல்லி தெளிப்பு)</option>
              <option value="Loading & Packaging">Loading & Packaging (ஏற்றுதல் மற்றும் மூட்டை கட்டுதல்)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Worker Count</label>
              <input
                type="number"
                required
                min={1}
                value={formData.workerCount}
                onChange={e => setFormData({ ...formData, workerCount: parseInt(e.target.value, 10) || 1 })}
                className="agri-input text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Duration (Days)</label>
              <input
                type="number"
                required
                min={1}
                value={formData.durationDays}
                onChange={e => setFormData({ ...formData, durationDays: parseInt(e.target.value, 10) || 1 })}
                className="agri-input text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Start Date</label>
              <input
                type="date"
                required
                value={formData.workDate}
                onChange={e => setFormData({ ...formData, workDate: e.target.value })}
                className="agri-input text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Daily Wage (₹ / Worker / Day)</label>
              <input
                type="number"
                required
                value={formData.budgetPerWorker}
                onChange={e => setFormData({ ...formData, budgetPerWorker: parseFloat(e.target.value) || 0 })}
                className="agri-input text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Farm Plot Location / Landmark</label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              className="agri-input text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Work Instructions & Amenities</label>
            <textarea
              rows={2}
              value={formData.requirements}
              onChange={e => setFormData({ ...formData, requirements: e.target.value })}
              placeholder="e.g. Paddy harvesting; morning tea and drinking water provided..."
              className="agri-input text-xs resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone</label>
            <input
              type="tel"
              required
              value={formData.contactPhone}
              onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
              className="agri-input text-xs"
            />
          </div>

          <button
            type="submit"
            className="agri-btn-primary w-full py-3 text-xs font-bold flex items-center justify-center gap-2 mt-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Post Workforce Requirement</span>
          </button>
        </form>
      </Modal>
    </div>
  );
};

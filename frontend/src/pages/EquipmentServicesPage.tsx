import React, { useState, useEffect } from 'react';
import {
  Tractor,
  Calendar,
  Clock,
  MapPin,
  Phone,
  CheckCircle2,
  Plus,
  ArrowRight,
  ShieldCheck,
  Fuel,
  Wrench,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Equipment, EquipmentRequest } from '../types';
import { Modal } from '../components/common/Modal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const EquipmentServicesPage: React.FC = () => {
  const { user } = useAuth();
  const { language, t } = useLanguage();

  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [requests, setRequests] = useState<EquipmentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedEq, setSelectedEq] = useState<Equipment | null>(null);

  const [formData, setFormData] = useState({
    equipmentType: 'Tractor',
    equipmentId: '',
    requestDate: new Date().toISOString().split('T')[0],
    startTime: '07:00 AM',
    durationHours: 6,
    location: user ? `${user.village}, ${user.district}` : 'Kabisthalam, Thanjavur',
    description: 'Field plowing and leveling for samba paddy season',
    contactPhone: user ? user.mobileNumber : '9876543210',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [eqRes, reqRes] = await Promise.all([
        api.get('/services/equipment'),
        api.get('/services/equipment/requests'),
      ]);
      if (eqRes.data.success) setEquipments(eqRes.data.data.equipments || []);
      if (reqRes.data.success) setRequests(reqRes.data.data.requests || []);
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBooking = (eq?: Equipment) => {
    if (eq) {
      setSelectedEq(eq);
      setFormData({
        ...formData,
        equipmentType: eq.type,
        equipmentId: eq.id,
      });
    } else {
      setSelectedEq(null);
      setFormData({
        ...formData,
        equipmentType: 'Tractor',
        equipmentId: '',
      });
    }
    setBookingModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/services/equipment/requests', formData);
      if (res.data.success) {
        alert('Equipment booking request submitted successfully!');
        setBookingModalOpen(false);
        await fetchData();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error submitting booking.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-800 text-xs font-semibold mb-3">
            <Tractor className="w-3.5 h-3.5 text-orange-600" />
            <span>Custom Hiring Center (CHC) Machinery Booking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            {t('navEquipment')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            {language === 'ta'
              ? 'டிராக்டர்கள், நெல் அறுவடை இயந்திரங்கள், ரோட்டவேட்டர்கள் மற்றும் பவர் ஸ்ப்ரேயர்களை தகுதிவாய்ந்த ஓட்டுநர்களுடன் முன்பதிவு செய்யுங்கள்.'
              : 'Book heavy agricultural machinery on hourly and daily rental basis with certified operators, zero maintenance liability, and fast field dispatch.'}
          </p>
        </div>

        <button
          onClick={() => handleOpenBooking()}
          className="agri-btn-primary flex items-center gap-2 self-start md:self-auto py-2.5 px-5 text-xs font-bold"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'ta' ? 'இயந்திரம் முன்பதிவு செய்' : 'Book Farm Machinery'}</span>
        </button>
      </div>

      {/* CHC Highlights Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="agri-card p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Certified Operators Included</h4>
            <p className="text-[11px] text-slate-500">Every machine comes with experienced driver</p>
          </div>
        </div>

        <div className="agri-card p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <Fuel className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Standardized Meter Billing</h4>
            <p className="text-[11px] text-slate-500">Pay only for actual hours worked on field</p>
          </div>
        </div>

        <div className="agri-card p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Guaranteed Dispatch Window</h4>
            <p className="text-[11px] text-slate-500">Prompt farm gate arrival within selected slots</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <LoadingSpinner message="Loading tractor and machinery fleet..." />
        </div>
      ) : (
        <div className="space-y-10">
          {/* Machinery Fleet Cards */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {language === 'ta' ? 'கிடைக்கும் பண்ணை இயந்திரங்கள்' : 'Available Farm Machinery Fleet'}
              </h2>
              <span className="text-xs text-slate-500 font-medium">{equipments.length} Units Available</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {equipments.map(eq => (
                <div key={eq.id} className="agri-card overflow-hidden flex flex-col group border-slate-200 hover:border-orange-300 transition-all">
                  <div className="relative h-44 bg-slate-100 overflow-hidden">
                    <img
                      src={eq.imageUrl || 'https://images.unsplash.com/photo-1594498653385-d5172c532c00?w=600'}
                      alt={eq.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-white/95 text-slate-800 shadow-sm border border-slate-200/80 backdrop-blur-sm">
                        {eq.type}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white shadow-sm">
                        Ready
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col grow space-y-3">
                    <h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-1">
                      {language === 'ta' && eq.nameTa ? eq.nameTa : eq.name}
                    </h3>

                    <div className="flex items-baseline space-x-1">
                      <span className="text-lg font-black text-emerald-700">₹{eq.hourlyRate}</span>
                      <span className="text-xs text-slate-500 font-semibold">/ hour</span>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 grow leading-relaxed">
                      {eq.description || 'Modern high-torque farm implement tuned for heavy delta soil operations.'}
                    </p>

                    <button
                      onClick={() => handleOpenBooking(eq)}
                      className="w-full mt-2 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Tractor className="w-3.5 h-3.5" />
                      <span>Book Slot Now</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Booking History Table */}
          <div className="agri-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  {language === 'ta' ? 'என் முன்பதிவு கோரிக்கைகள்' : 'My Machinery Service Bookings'}
                </h3>
                <p className="text-xs text-slate-500">Track dispatched tractors, combine harvesters, and implement bookings</p>
              </div>
            </div>

            {requests.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No active service requests found. Click "Book Farm Machinery" to request an implement.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                      <th className="py-3 px-3">Equipment</th>
                      <th className="py-3 px-3">Date & Time</th>
                      <th className="py-3 px-3">Duration</th>
                      <th className="py-3 px-3">Farm Location</th>
                      <th className="py-3 px-3">Contact</th>
                      <th className="py-3 px-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {requests.map(req => (
                      <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-3 font-bold text-slate-900 flex items-center gap-2">
                          <Tractor className="w-4 h-4 text-emerald-600" />
                          <span>{req.equipmentType}</span>
                        </td>
                        <td className="py-3.5 px-3 text-slate-600">
                          {req.requestDate} at {req.startTime}
                        </td>
                        <td className="py-3.5 px-3 text-slate-800 font-semibold">{req.durationHours} Hours</td>
                        <td className="py-3.5 px-3 text-slate-600 max-w-[200px] truncate">{req.location}</td>
                        <td className="py-3.5 px-3 text-slate-600">{req.contactPhone || '-'}</td>
                        <td className="py-3.5 px-3 text-right">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              req.status === 'ACCEPTED' || req.status === 'COMPLETED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : req.status === 'CANCELLED'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
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
        </div>
      )}

      {/* Booking Modal */}
      <Modal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        title={selectedEq ? `Book ${selectedEq.name}` : 'Request Farm Machinery Implement'}
        maxWidth="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Equipment Type</label>
            <select
              value={formData.equipmentType}
              onChange={e => setFormData({ ...formData, equipmentType: e.target.value })}
              className="agri-select text-xs"
            >
              <option value="Tractor">Tractor (45-55 HP with Driver)</option>
              <option value="Harvester">Combine Harvester (Rubber Track)</option>
              <option value="Rotavator">Heavy Duty Rotavator (7-Feet)</option>
              <option value="Sprayer">Motorized Power Sprayer (50L)</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Date</label>
              <input
                type="date"
                required
                value={formData.requestDate}
                onChange={e => setFormData({ ...formData, requestDate: e.target.value })}
                className="agri-input text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Start Time</label>
              <input
                type="text"
                required
                value={formData.startTime}
                onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                placeholder="e.g. 07:00 AM"
                className="agri-input text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Duration (Hours)</label>
            <input
              type="number"
              required
              min={1}
              value={formData.durationHours}
              onChange={e => setFormData({ ...formData, durationHours: parseFloat(e.target.value) || 1 })}
              className="agri-input text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Farm Plot Location / Landmark</label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Survey No. 142/2, Near Lake Canal, Kabisthalam"
              className="agri-input text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Work Description & Plot Acreage</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="e.g. 3 acres wet paddy field plowing and bund leveling..."
              className="agri-input text-xs resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Farmer Contact Phone</label>
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
            <span>Confirm & Dispatch Booking</span>
          </button>
        </form>
      </Modal>
    </div>
  );
};

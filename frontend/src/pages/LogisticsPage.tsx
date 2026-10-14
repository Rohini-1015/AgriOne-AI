import React, { useState, useEffect } from 'react';
import {
  Truck,
  MapPin,
  Calendar,
  Package,
  Phone,
  CheckCircle2,
  Plus,
  Navigation,
  ShieldCheck,
  Clock,
  ArrowRight
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LogisticsRequest } from '../types';
import { Modal } from '../components/common/Modal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const LogisticsPage: React.FC = () => {
  const { user } = useAuth();
  const { language, t } = useLanguage();

  const [requests, setRequests] = useState<LogisticsRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    pickupLocation: user ? `${user.village} Farm Gate, ${user.district}` : 'Kabisthalam Farm Gate, Thanjavur',
    deliveryLocation: 'Thanjavur APMC Regulated Market Mandi',
    cropName: 'Paddy BPT 5204',
    quantityTons: 8,
    vehicleType: 'Tata Ace / Mini Truck',
    preferredDate: new Date().toISOString().split('T')[0],
    contactPhone: user ? user.mobileNumber : '9876543210',
    notes: 'Tarpaulin cover needed for rain protection',
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get('/services/logistics/requests');
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
      const res = await api.post('/services/logistics/requests', formData);
      if (res.data.success) {
        alert('Produce logistics transport booked successfully!');
        setModalOpen(false);
        await fetchRequests();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error booking transport.');
    }
  };

  const totalTonsShipped = requests.reduce((acc, r) => acc + (r.quantityTons || 0), 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-3">
            <Truck className="w-3.5 h-3.5 text-teal-600" />
            <span>Farm Gate to Mandi Freight Logistics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            {t('navLogistics')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            {language === 'ta'
              ? 'விளைநிலங்களிலிருந்து ஒழுங்குமுறை விற்பனைக்கூடம் அல்லது வாங்குபவரின் இடத்திற்கு பயிர்களை கொண்டு செல்ல வாகனங்களை முன்பதிவு செய்யுங்கள்.'
              : 'Dispatch harvested grain, vegetables, and fruit loads directly from your farm gate to APMC regulated markets or commercial buyer warehouses.'}
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="agri-btn-primary flex items-center gap-2 self-start md:self-auto py-2.5 px-5 text-xs font-bold"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'ta' ? 'சரக்கு வாகனம் முன்பதிவு' : 'Book Produce Transport'}</span>
        </button>
      </div>

      {/* Logistics Highlights Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="agri-card p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shrink-0">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Direct Farm-Gate Pickup</h4>
            <p className="text-[11px] text-slate-500">Transporters navigate directly to your field boundary</p>
          </div>
        </div>

        <div className="agri-card p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Weatherproof Transit</h4>
            <p className="text-[11px] text-slate-500">Heavy tarpaulins and moisture-sealed cargo bays</p>
          </div>
        </div>

        <div className="agri-card p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Mandi Opening Synchronized</h4>
            <p className="text-[11px] text-slate-500">Timely arrival aligned with APMC morning auctions</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <LoadingSpinner message="Retrieving transport shipments and freight status..." />
        </div>
      ) : (
        <div className="agri-card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                {language === 'ta' ? 'என் போக்குவரத்து முன்பதிவுகள்' : 'My Logistics Transport Dispatches'}
              </h3>
              <p className="text-xs text-slate-500">Active produce shipments and transit orders</p>
            </div>
            {requests.length > 0 && (
              <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-100 self-start sm:self-auto">
                Total Dispatched: {totalTonsShipped} Metric Tons
              </span>
            )}
          </div>

          {requests.length === 0 ? (
            <div className="py-10 text-center text-xs text-slate-500">
              No freight dispatches found. Click "Book Produce Transport" to dispatch a shipment.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                    <th className="py-3 px-3">Crop & Quantity</th>
                    <th className="py-3 px-3">Vehicle</th>
                    <th className="py-3 px-3">Pickup Location</th>
                    <th className="py-3 px-3">Destination Mandi</th>
                    <th className="py-3 px-3">Preferred Date</th>
                    <th className="py-3 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {requests.map(req => (
                    <tr key={req.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-3 font-bold text-slate-900 flex items-center gap-2">
                        <Package className="w-4 h-4 text-teal-600" />
                        <span>
                          {req.cropName} <span className="text-teal-700 font-semibold">({req.quantityTons} Tons)</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-slate-700">{req.vehicleType}</td>
                      <td className="py-3.5 px-3 text-slate-600 max-w-[160px] truncate">{req.pickupLocation}</td>
                      <td className="py-3.5 px-3 text-slate-600 max-w-[180px] truncate">{req.deliveryLocation}</td>
                      <td className="py-3.5 px-3 text-slate-600">{req.preferredDate}</td>
                      <td className="py-3.5 px-3 text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 text-teal-800">
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
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Book Agricultural Transport Freight" maxWidth="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Produce / Crop Name</label>
            <input
              type="text"
              required
              value={formData.cropName}
              onChange={e => setFormData({ ...formData, cropName: e.target.value })}
              placeholder="e.g. Sona Masoori Paddy or Harvested Tomatoes"
              className="agri-input text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Quantity (Tons)</label>
              <input
                type="number"
                required
                min={0.5}
                step={0.5}
                value={formData.quantityTons}
                onChange={e => setFormData({ ...formData, quantityTons: parseFloat(e.target.value) || 1 })}
                className="agri-input text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Vehicle Type</label>
              <select
                value={formData.vehicleType}
                onChange={e => setFormData({ ...formData, vehicleType: e.target.value })}
                className="agri-select text-xs"
              >
                <option value="Tata Ace / Mini Truck">Tata Ace / Mini Truck (1-2 Tons)</option>
                <option value="Pickup 407 Truck">Pickup 407 Truck (3-5 Tons)</option>
                <option value="10-Wheeler Lorry">10-Wheeler Lorry (10-15 Tons)</option>
                <option value="Tractor Trolley">Tractor Trolley (3-6 Tons)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Farm Pickup Location</label>
            <input
              type="text"
              required
              value={formData.pickupLocation}
              onChange={e => setFormData({ ...formData, pickupLocation: e.target.value })}
              className="agri-input text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Destination Mandi / Buyer Address</label>
            <input
              type="text"
              required
              value={formData.deliveryLocation}
              onChange={e => setFormData({ ...formData, deliveryLocation: e.target.value })}
              className="agri-input text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Date</label>
              <input
                type="date"
                required
                value={formData.preferredDate}
                onChange={e => setFormData({ ...formData, preferredDate: e.target.value })}
                className="agri-input text-xs"
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
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Special Handling Notes</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              placeholder="e.g. Tarpaulin cover needed for rain protection..."
              className="agri-input text-xs resize-none"
            />
          </div>

          <button
            type="submit"
            className="agri-btn-primary w-full py-3 text-xs font-bold flex items-center justify-center gap-2 mt-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirm Transport Dispatch</span>
          </button>
        </form>
      </Modal>
    </div>
  );
};

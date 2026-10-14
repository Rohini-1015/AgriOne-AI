import React, { useState, useEffect } from 'react';
import {
  Store,
  Plus,
  Edit2,
  Trash2,
  Upload,
  Calendar,
  DollarSign,
  Package,
  MapPin,
  CheckCircle2,
  Layers,
  Sparkles,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Product } from '../types';
import { Modal } from '../components/common/Modal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const MyListingsPage: React.FC = () => {
  const { user } = useAuth();
  const { language, t } = useLanguage();

  const [myProducts, setMyProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Grains',
    quantity: 50,
    unit: 'quintal',
    price: 2400,
    description: '',
    location: user ? `${user.village}, ${user.district}` : 'Thanjavur, Tamil Nadu',
    district: user ? user.district : 'Thanjavur',
    state: user ? user.state : 'Tamil Nadu',
    imageUrl: '',
  });

  const [uploadFile, setUploadFile] = useState<File | null>(null);

  useEffect(() => {
    fetchMyListings();
  }, [user]);

  const fetchMyListings = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products?sellerId=${user?.id || 'user-farmer-01'}`);
      if (res.data.success) {
        setMyProducts(res.data.data.products || []);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'Grains',
      quantity: 50,
      unit: 'quintal',
      price: 2400,
      description: '',
      location: user ? `${user.village}, ${user.district}` : 'Thanjavur, Tamil Nadu',
      district: user ? user.district : 'Thanjavur',
      state: user ? user.state : 'Tamil Nadu',
      imageUrl: '',
    });
    setUploadFile(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      category: p.category,
      quantity: p.quantity,
      unit: p.unit,
      price: p.price,
      description: p.description,
      location: p.location,
      district: p.district,
      state: p.state,
      imageUrl: p.imageUrl || '',
    });
    setUploadFile(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => data.append(k, String(v)));
      if (uploadFile) data.append('image', uploadFile);

      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/products', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      setModalOpen(false);
      await fetchMyListings();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error saving listing.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this listing?')) return;
    try {
      await api.delete(`/products/${id}`);
      await fetchMyListings();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error deleting product.');
    }
  };

  // Metrics
  const totalStock = myProducts.reduce((acc, p) => acc + (p.availableQuantity || p.quantity || 0), 0);
  const totalValuation = myProducts.reduce((acc, p) => acc + (p.price * (p.availableQuantity || p.quantity || 0)), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Enterprise Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-3">
            <Store className="w-3.5 h-3.5 text-emerald-600" />
            <span>Farm Gate Consignment & Marketplace Inventory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            {t('navMyListings')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            {language === 'ta'
              ? 'உங்கள் விளைபொருட்களின் விவரங்களை சேர்த்து நேரடி விற்பனையை தொடங்குங்கள்.'
              : 'Manage active harvest listings, configure wholesale and retail farmgate prices, update inventory stock, and track buyer interest.'}
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="agri-btn-primary flex items-center gap-2 self-start md:self-auto py-2.5 px-5 text-xs font-bold"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'ta' ? 'புதிய விளைபொருள் சேர்' : 'Add New Produce Listing'}</span>
        </button>
      </div>

      {/* Live Inventory Telemetry Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="agri-card p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Active Lots</div>
            <div className="text-xl font-bold text-slate-900">{myProducts.length} Lots</div>
          </div>
        </div>

        <div className="agri-card p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Volume</div>
            <div className="text-xl font-bold text-slate-900">{totalStock.toLocaleString()} Units</div>
          </div>
        </div>

        <div className="agri-card p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700 shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Consignment Value</div>
            <div className="text-xl font-bold text-slate-900">₹{totalValuation.toLocaleString()}</div>
          </div>
        </div>

        <div className="agri-card p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Market Status</div>
            <div className="text-xl font-bold text-teal-700">Verified Seller</div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <LoadingSpinner message="Loading your farmer listings and farmgate inventory..." />
        </div>
      ) : myProducts.length === 0 ? (
        <div className="agri-card p-14 text-center space-y-4 max-w-lg mx-auto border-dashed border-2 border-slate-200">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-100">
            <Store className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900">No active produce listings</h3>
            <p className="text-xs text-slate-500 mt-1">
              List your harvested crops, grains, and fresh vegetables to connect directly with wholesale buyers and nearby mandis without intermediaries.
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="agri-btn-primary px-5 py-2.5 text-xs font-bold inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Listing</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myProducts.map(p => {
            const avail = p.availableQuantity !== undefined ? p.availableQuantity : p.quantity;
            const percentage = Math.min(100, Math.max(0, Math.round((avail / (p.quantity || 1)) * 100)));
            return (
              <div key={p.id} className="agri-card overflow-hidden flex flex-col group border-slate-200 hover:border-emerald-300 transition-all">
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <img
                    src={p.imageUrl || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600'}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-white/95 text-slate-800 shadow-sm border border-slate-200/80 backdrop-blur-sm">
                      {p.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      title="Edit listing"
                      className="p-1.5 rounded-lg bg-white/90 text-slate-700 hover:text-emerald-700 hover:bg-white shadow-sm transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      title="Remove listing"
                      className="p-1.5 rounded-lg bg-white/90 text-slate-700 hover:text-rose-600 hover:bg-rose-50 shadow-sm transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-5 flex flex-col grow space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-1">{p.name}</h3>
                    <div className="flex items-baseline shrink-0">
                      <span className="text-base font-black text-emerald-700">₹{p.price.toLocaleString()}</span>
                      <span className="text-[11px] text-slate-500 font-medium ml-1">/ {p.unit}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 grow leading-relaxed">
                    {p.description || 'Premium harvest produce grown under controlled field practices.'}
                  </p>

                  {/* Stock meter */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-medium text-slate-600">Available Stock</span>
                      <span className="font-bold text-slate-900">
                        {avail} / {p.quantity} {p.unit}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Location & dispatch footer */}
                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[170px]">{p.location || 'Local Mandi'}</span>
                    </div>
                    <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      In Stock
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Listing Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProduct ? 'Edit Produce Consignment' : 'Register New Produce Lot'}
        maxWidth="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Produce / Crop Variety Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Sona Masoori Grade-A Paddy, Country Tomatoes, Alphonso Mango"
              className="agri-input text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="agri-select text-xs"
              >
                <option value="Grains">Grains & Cereals (தானியங்கள்)</option>
                <option value="Vegetables">Fresh Vegetables (காய்கறிகள்)</option>
                <option value="Fruits">Orchard Fruits (பழங்கள்)</option>
                <option value="Spices">Spices & Condiments (மசாலா)</option>
                <option value="CashCrop">Commercial Cash Crop (பணப்பயிர்)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Price per Unit (₹)</label>
              <input
                type="number"
                required
                min={1}
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="agri-input text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Total Available Quantity</label>
              <input
                type="number"
                required
                min={1}
                value={formData.quantity}
                onChange={e => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
                className="agri-input text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Measurement Unit</label>
              <select
                value={formData.unit}
                onChange={e => setFormData({ ...formData, unit: e.target.value })}
                className="agri-select text-xs"
              >
                <option value="quintal">Quintal (100 kg)</option>
                <option value="kg">Kilogram (kg)</option>
                <option value="crate">Crate (25 kg)</option>
                <option value="ton">Metric Ton (1,000 kg)</option>
                <option value="bunch">Bunch / Dozen</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Product Description & Harvest Notes</label>
            <textarea
              required
              rows={2}
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe variety, moisture level, organic certification, packaging, storage condition..."
              className="agri-input text-xs resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Farmgate Pickup Location</label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Kabisthalam Farm Gate, Thanjavur, Tamil Nadu"
              className="agri-input text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Produce Photo (Optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => {
                if (e.target.files && e.target.files[0]) {
                  setUploadFile(e.target.files[0]);
                }
              }}
              className="block w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer border border-slate-200 rounded-xl p-1"
            />
          </div>

          <button
            type="submit"
            className="agri-btn-primary w-full py-3 text-xs font-bold flex items-center justify-center gap-2 mt-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{editingProduct ? 'Save & Update Listing' : 'Publish Lot to Marketplace'}</span>
          </button>
        </form>
      </Modal>
    </div>
  );
};

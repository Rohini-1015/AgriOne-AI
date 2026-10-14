import React, { useState, useEffect } from 'react';
import {
  User,
  MapPin,
  Phone,
  Mail,
  Edit2,
  Plus,
  Trash2,
  Sprout,
  CheckCircle2,
  Calendar,
  Layers,
  ShieldCheck,
  Compass,
  Droplets,
  FileCheck
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Farm } from '../types';
import { Modal } from '../components/common/Modal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const FarmProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { language, t } = useLanguage();

  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || '',
    state: user?.state || 'Tamil Nadu',
    district: user?.district || 'Thanjavur',
    village: user?.village || 'Kabisthalam',
  });

  // Farm Form State
  const [farmForm, setFarmForm] = useState({
    name: '',
    surveyNumber: '',
    sizeAcres: 4.5,
    soilType: 'Alluvial',
    currentCrop: 'Paddy (BPT 5204)',
    plantingDate: new Date().toISOString().split('T')[0],
    expectedHarvest: '',
    irrigationType: 'Canal & Borewell',
    location: user ? `${user.village}, ${user.district}` : 'Thanjavur',
  });

  useEffect(() => {
    fetchFarms();
  }, [user]);

  const fetchFarms = async () => {
    try {
      setLoading(true);
      const res = await api.get('/farms');
      if (res.data.success) {
        setFarms(res.data.data.farms || []);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.put('/auth/profile', profileForm);
      if (res.data.success) {
        updateUser(res.data.data.user);
        setIsEditingProfile(false);
        alert('Farmer profile updated successfully!');
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error updating profile.');
    }
  };

  const handleOpenCreateFarm = () => {
    setEditingFarm(null);
    setFarmForm({
      name: '',
      surveyNumber: '',
      sizeAcres: 4.5,
      soilType: 'Alluvial',
      currentCrop: 'Paddy (BPT 5204)',
      plantingDate: new Date().toISOString().split('T')[0],
      expectedHarvest: '',
      irrigationType: 'Canal & Borewell',
      location: user ? `${user.village}, ${user.district}` : 'Thanjavur',
    });
    setModalOpen(true);
  };

  const handleOpenEditFarm = (f: Farm) => {
    setEditingFarm(f);
    setFarmForm({
      name: f.name,
      surveyNumber: f.surveyNumber || '',
      sizeAcres: f.sizeAcres,
      soilType: f.soilType,
      currentCrop: f.currentCrop,
      plantingDate: f.plantingDate ? f.plantingDate.split('T')[0] : '',
      expectedHarvest: f.expectedHarvest ? f.expectedHarvest.split('T')[0] : '',
      irrigationType: f.irrigationType,
      location: f.location,
    });
    setModalOpen(true);
  };

  const handleSaveFarm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingFarm) {
        await api.put(`/farms/${editingFarm.id}`, farmForm);
      } else {
        await api.post('/farms', farmForm);
      }
      setModalOpen(false);
      await fetchFarms();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error saving farm plot.');
    }
  };

  const handleDeleteFarm = async (id: string) => {
    if (!window.confirm('Delete this farm plot?')) return;
    try {
      await api.delete(`/farms/${id}`);
      await fetchFarms();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error deleting plot.');
    }
  };

  const totalAcres = farms.reduce((acc, f) => acc + (f.sizeAcres || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified Farmer Profile & Registered Farmholdings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            {t('navFarmProfile')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            {language === 'ta'
              ? 'விவசாயி சுயவிவரம் மற்றும் உங்கள் அனைத்து விவசாய நிலங்களின் மேலாண்மை.'
              : 'Manage authenticated farmer credentials, multi-plot geo-spatial landholdings, soil classifications, and seasonal sowing calendars.'}
          </p>
        </div>

        <button
          onClick={handleOpenCreateFarm}
          className="agri-btn-primary flex items-center gap-2 self-start md:self-auto py-2.5 px-5 text-xs font-bold"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'ta' ? 'புதிய நிலம் சேர்' : 'Register New Farm Plot'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Farmer Profile Card (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="agri-card p-6 space-y-5">
            <div className="flex items-center space-x-4">
              <img
                src={user?.avatarUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200'}
                alt={user?.fullName}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-200 shadow-sm"
              />
              <div>
                <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                  {user?.fullName}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                    {user?.role}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified
                  </span>
                </div>
              </div>
            </div>

            {isEditingProfile ? (
              <form onSubmit={handleSaveProfile} className="space-y-3 pt-3 border-t border-slate-100">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={profileForm.fullName}
                    onChange={e => setProfileForm({ ...profileForm, fullName: e.target.value })}
                    className="agri-input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Village / Revenue Circle</label>
                  <input
                    type="text"
                    required
                    value={profileForm.village}
                    onChange={e => setProfileForm({ ...profileForm, village: e.target.value })}
                    className="agri-input text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">District</label>
                  <input
                    type="text"
                    required
                    value={profileForm.district}
                    onChange={e => setProfileForm({ ...profileForm, district: e.target.value })}
                    className="agri-input text-xs"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-2">
                  <button
                    type="submit"
                    className="grow agri-btn-primary py-2 text-xs font-bold"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-medium">+91 {user?.mobileNumber}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-medium truncate">{user?.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-medium">
                    {user?.village}, {user?.district}, {user?.state}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-900 space-y-1 mt-4">
                  <div className="flex justify-between items-center text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
                    <span>Agricultural Holding</span>
                    <span className="text-emerald-700 font-mono">{totalAcres} Acres</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 font-normal">
                    {farms.length} active cultivated plots registered in Kaveri Delta zone.
                  </p>
                </div>

                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="w-full mt-2 py-2.5 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center space-x-2"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>{language === 'ta' ? 'சுயவிவரத்தை திருத்து' : 'Edit Profile Information'}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Multi-Farm Plots Management (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              <span>{language === 'ta' ? 'என் விவசாய நிலங்கள்' : 'Registered Farmholdings & Plots'}</span>
            </h2>
            <span className="text-xs font-semibold text-slate-500">{farms.length} Plots Total</span>
          </div>

          {loading ? (
            <div className="py-16 text-center">
              <LoadingSpinner message="Loading farm plot records..." />
            </div>
          ) : farms.length === 0 ? (
            <div className="agri-card p-14 text-center space-y-3 border-dashed border-2 border-slate-200">
              <Sprout className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="font-bold text-sm text-slate-800">No farm plots recorded</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Add your field plots with survey numbers and soil types to enable hyper-local advisory recommendations.
              </p>
              <button
                onClick={handleOpenCreateFarm}
                className="agri-btn-primary px-4 py-2 text-xs font-bold inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Register First Plot</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {farms.map(farm => (
                <div key={farm.id} className="agri-card p-5 space-y-4 border-slate-200 hover:border-emerald-300 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center space-x-2.5">
                        <span className="font-extrabold text-sm sm:text-base text-slate-900">{farm.name}</span>
                        {farm.surveyNumber && (
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            Patta / Survey: {farm.surveyNumber}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 mt-0.5 block">{farm.location}</span>
                    </div>

                    <div className="flex items-center space-x-1 self-end sm:self-auto">
                      <button
                        onClick={() => handleOpenEditFarm(farm)}
                        title="Edit Plot"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteFarm(farm.id)}
                        title="Delete Plot"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">Total Area</span>
                      <span className="font-extrabold text-slate-900 text-sm mt-0.5 block">{farm.sizeAcres} Acres</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">Soil Type</span>
                      <span className="font-bold text-slate-800 text-sm mt-0.5 block">{farm.soilType}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">Current Crop</span>
                      <span className="font-bold text-emerald-700 text-sm mt-0.5 block truncate">{farm.currentCrop}</span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">Irrigation</span>
                      <span className="font-bold text-blue-700 text-sm mt-0.5 block truncate">{farm.irrigationType}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Farm Plot Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingFarm ? 'Edit Farm Plot Configuration' : 'Register New Farm Plot'}
        maxWidth="md"
      >
        <form onSubmit={handleSaveFarm} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Farm Plot Name</label>
            <input
              type="text"
              required
              value={farmForm.name}
              onChange={e => setFarmForm({ ...farmForm, name: e.target.value })}
              placeholder="e.g. Cauvery River Delta Plot A"
              className="agri-input text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Plot Area (Acres)</label>
              <input
                type="number"
                step="0.1"
                required
                value={farmForm.sizeAcres}
                onChange={e => setFarmForm({ ...farmForm, sizeAcres: parseFloat(e.target.value) || 0 })}
                className="agri-input text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Survey / Patta Number</label>
              <input
                type="text"
                value={farmForm.surveyNumber}
                onChange={e => setFarmForm({ ...farmForm, surveyNumber: e.target.value })}
                placeholder="e.g. TN-THJ-248/1A"
                className="agri-input text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Soil Classification</label>
              <select
                value={farmForm.soilType}
                onChange={e => setFarmForm({ ...farmForm, soilType: e.target.value })}
                className="agri-select text-xs"
              >
                <option value="Alluvial">வண்டல் மண் (Alluvial)</option>
                <option value="Black">கரிசல் மண் (Black)</option>
                <option value="Red Loam">செம்மண் (Red Loam)</option>
                <option value="Clay Loam">களிமண் (Clay Loam)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Active Sown Crop</label>
              <input
                type="text"
                required
                value={farmForm.currentCrop}
                onChange={e => setFarmForm({ ...farmForm, currentCrop: e.target.value })}
                placeholder="Paddy BPT 5204"
                className="agri-input text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Irrigation System</label>
              <select
                value={farmForm.irrigationType}
                onChange={e => setFarmForm({ ...farmForm, irrigationType: e.target.value })}
                className="agri-select text-xs"
              >
                <option value="Canal & Borewell">Canal & Borewell (கால்வாய் & ஆழ்துளை)</option>
                <option value="Drip Irrigation">Drip Irrigation (சொட்டு நீர் பாசனம்)</option>
                <option value="Sprinkler">Sprinkler (தெளிப்பு நீர் பாசனம்)</option>
                <option value="Rainfed">Rainfed (மானாவாரி)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Plot Location / Landmark</label>
              <input
                type="text"
                required
                value={farmForm.location}
                onChange={e => setFarmForm({ ...farmForm, location: e.target.value })}
                className="agri-input text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            className="agri-btn-primary w-full py-3 text-xs font-bold flex items-center justify-center gap-2 mt-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save Farm Plot Record</span>
          </button>
        </form>
      </Modal>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  User,
  ShieldCheck,
  Sprout,
  PackageCheck,
  Stethoscope,
  Key,
  LogOut,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Layers,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ChevronRight,
  TrendingUp,
  Tractor,
  Droplets,
  ExternalLink,
  PlusCircle,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

type AccountTab = 'overview' | 'profile' | 'farms' | 'scans' | 'orders' | 'security';

export const MyAccountPage: React.FC = () => {
  const { user, logout, updateProfile, changePassword } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active Tab Management
  const initialTab = (searchParams.get('tab') as AccountTab) || 'overview';
  const [activeTab, setActiveTab] = useState<AccountTab>(initialTab);

  useEffect(() => {
    const tabParam = searchParams.get('tab') as AccountTab;
    if (tabParam && ['overview', 'profile', 'farms', 'scans', 'orders', 'security'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const switchTab = (tab: AccountTab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // State for Farms
  const [farms, setFarms] = useState<any[]>([]);
  const [loadingFarms, setLoadingFarms] = useState(false);

  // State for Disease History
  const [diseaseScans, setDiseaseScans] = useState<any[]>([]);
  const [loadingScans, setLoadingScans] = useState(false);

  // State for Orders
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Edit Profile Form State
  const [editProfileForm, setEditProfileForm] = useState({
    fullName: user?.fullName || '',
    state: user?.state || 'Tamil Nadu',
    district: user?.district || 'Thanjavur',
    village: user?.village || '',
    avatarUrl: user?.avatarUrl || '',
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Change Password Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load account data on mount
  useEffect(() => {
    if (!user) return;

    // Load Farms
    const fetchFarms = async () => {
      setLoadingFarms(true);
      try {
        const res = await api.get('/farms');
        if (res.data?.success && Array.isArray(res.data.data)) {
          setFarms(res.data.data);
        }
      } catch (err) {
        console.warn('Could not load user farms:', err);
      } finally {
        setLoadingFarms(false);
      }
    };

    // Load Scans
    const fetchScans = async () => {
      setLoadingScans(true);
      try {
        const res = await api.get('/disease/history');
        if (res.data?.success && Array.isArray(res.data.data)) {
          setDiseaseScans(res.data.data);
        }
      } catch (err) {
        console.warn('Could not load diagnosis history:', err);
      } finally {
        setLoadingScans(false);
      }
    };

    // Load Orders
    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const res = await api.get('/orders');
        if (res.data?.success && Array.isArray(res.data.data)) {
          setOrders(res.data.data);
        }
      } catch (err) {
        console.warn('Could not load orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchFarms();
    fetchScans();
    fetchOrders();
  }, [user]);

  // Keep editProfileForm in sync when user changes
  useEffect(() => {
    if (user) {
      setEditProfileForm({
        fullName: user.fullName || '',
        state: user.state || 'Tamil Nadu',
        district: user.district || 'Thanjavur',
        village: user.village || '',
        avatarUrl: user.avatarUrl || '',
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    setProfileSaving(true);

    try {
      const res = await updateProfile(editProfileForm);
      if (res.success) {
        setProfileMsg({
          type: 'success',
          text: language === 'ta' ? 'சுயவிவரம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது!' : 'Profile details updated successfully!',
        });
      } else {
        setProfileMsg({ type: 'error', text: res.message || 'Failed to update profile.' });
      }
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err.message || 'Error updating profile.' });
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (passwordForm.newPassword.length < 6) {
      setPasswordMsg({
        type: 'error',
        text: language === 'ta' ? 'புதிய கடவுச்சொல் குறைந்தது 6 எழுத்துகள் இருக்க வேண்டும்' : 'New password must be at least 6 characters.',
      });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordMsg({
        type: 'error',
        text: language === 'ta' ? 'கடவுச்சொற்கள் பொருந்தவில்லை' : 'New passwords do not match.',
      });
      return;
    }

    setPasswordSaving(true);

    try {
      const res = await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      if (res.success) {
        setPasswordMsg({
          type: 'success',
          text: language === 'ta' ? 'கடவுச்சொல் வெற்றிகரமாக மாற்றப்பட்டது!' : 'Password changed successfully!',
        });
        setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      } else {
        setPasswordMsg({ type: 'error', text: res.message || 'Password update failed.' });
      }
    } catch (err: any) {
      setPasswordMsg({ type: 'error', text: err.message || 'Failed to update password.' });
    } finally {
      setPasswordSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
        <div className="max-w-md p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <p className="text-xs text-slate-500">Please sign in to access your personal AgriOne account.</p>
          <Link to="/login" className="agri-btn-primary px-4 py-2 text-xs font-bold inline-block">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const roleBadgeColors: Record<string, string> = {
    FARMER: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    BUYER: 'bg-blue-100 text-blue-800 border-blue-300',
    ADMIN: 'bg-purple-100 text-purple-800 border-purple-300',
    AGRICULTURAL_EXPERT: 'bg-amber-100 text-amber-800 border-amber-300',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Profile Hero Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-50 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="flex items-center space-x-5">
          <div className="relative">
            <img
              src={user.avatarUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200'}
              alt={user.fullName}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-emerald-50 border border-slate-200 shadow-sm"
            />
            <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shadow-xs" title="Verified Member">
              ✓
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {user.fullName}
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border uppercase tracking-wide ${roleBadgeColors[user.role] || 'bg-slate-100 text-slate-700'}`}>
                {user.role}
              </span>
            </div>

            <p className="text-xs text-slate-600 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>{user.village ? `${user.village}, ` : ''}{user.district}, {user.state}</span>
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-slate-400" />
                {user.email}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                +91 {user.mobileNumber}
              </span>
            </div>
          </div>
        </div>

        {/* Quick KPI stats chips */}
        <div className="grid grid-cols-3 gap-3 w-full md:w-auto shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Farms</span>
            <span className="text-lg font-black text-slate-900">{farms.length || 1}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Scans</span>
            <span className="text-lg font-black text-emerald-700">{diseaseScans.length || 3}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Orders</span>
            <span className="text-lg font-black text-blue-700">{orders.length || 1}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar Navigation + Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Tabs (WooCommerce / Modern SaaS inspired) */}
        <div className="lg:col-span-1 space-y-2">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-2.5 space-y-1">
            <button
              type="button"
              onClick={() => switchTab('overview')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                activeTab === 'overview'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Sprout className={`w-4 h-4 ${activeTab === 'overview' ? 'text-white' : 'text-emerald-700'}`} />
              <span className="grow">{language === 'ta' ? 'கணக்கு மேலோட்டம்' : 'Account Overview'}</span>
              <ChevronRight className={`w-3.5 h-3.5 ${activeTab === 'overview' ? 'text-emerald-200' : 'text-slate-400'}`} />
            </button>

            <button
              type="button"
              onClick={() => switchTab('profile')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                activeTab === 'profile'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <User className={`w-4 h-4 ${activeTab === 'profile' ? 'text-white' : 'text-emerald-700'}`} />
              <span className="grow">{language === 'ta' ? 'சுயவிவரம் & திருத்தம்' : 'Profile & Personal Info'}</span>
              <ChevronRight className={`w-3.5 h-3.5 ${activeTab === 'profile' ? 'text-emerald-200' : 'text-slate-400'}`} />
            </button>

            <button
              type="button"
              onClick={() => switchTab('farms')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                activeTab === 'farms'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Tractor className={`w-4 h-4 ${activeTab === 'farms' ? 'text-white' : 'text-emerald-700'}`} />
              <span className="grow">{language === 'ta' ? 'விவசாய நில விபரம்' : 'My Farming Profile'}</span>
              <ChevronRight className={`w-3.5 h-3.5 ${activeTab === 'farms' ? 'text-emerald-200' : 'text-slate-400'}`} />
            </button>

            <button
              type="button"
              onClick={() => switchTab('scans')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                activeTab === 'scans'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Stethoscope className={`w-4 h-4 ${activeTab === 'scans' ? 'text-white' : 'text-emerald-700'}`} />
              <span className="grow">{language === 'ta' ? 'சேமிக்கப்பட்ட ஆய்வுகள்' : 'Disease Scans & History'}</span>
              <ChevronRight className={`w-3.5 h-3.5 ${activeTab === 'scans' ? 'text-emerald-200' : 'text-slate-400'}`} />
            </button>

            <button
              type="button"
              onClick={() => switchTab('orders')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                activeTab === 'orders'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <PackageCheck className={`w-4 h-4 ${activeTab === 'orders' ? 'text-white' : 'text-emerald-700'}`} />
              <span className="grow">{language === 'ta' ? 'எனது ஆர்டர்கள்' : 'Orders & Commerce'}</span>
              <ChevronRight className={`w-3.5 h-3.5 ${activeTab === 'orders' ? 'text-emerald-200' : 'text-slate-400'}`} />
            </button>

            <button
              type="button"
              onClick={() => switchTab('security')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                activeTab === 'security'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Key className={`w-4 h-4 ${activeTab === 'security' ? 'text-white' : 'text-emerald-700'}`} />
              <span className="grow">{language === 'ta' ? 'கடவுச்சொல் & பாதுகாப்பு' : 'Security & Password'}</span>
              <ChevronRight className={`w-3.5 h-3.5 ${activeTab === 'security' ? 'text-emerald-200' : 'text-slate-400'}`} />
            </button>

            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(language === 'ta' ? 'நிச்சயமாக வெளியேற வேண்டுமா?' : 'Are you sure you want to log out of AgriOne?')) {
                    logout();
                  }
                }}
                className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors text-left"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                <span className="grow">{language === 'ta' ? 'வெளியேறு' : 'Log Out'}</span>
              </button>
            </div>
          </div>

          {/* Quick Help Card */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 text-xs space-y-2">
            <div className="font-bold text-emerald-950 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Need Agronomy Assistance?</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Speak with our certified agricultural specialists or ask AgriBot AI directly.
            </p>
            <Link
              to="/agribot"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:text-emerald-900 hover:underline pt-1"
            >
              <span>Launch AgriBot</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Tab Content Display Area */}
        <div className="lg:col-span-3">
          {/* 1. OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Welcome Banner */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {language === 'ta' ? `வணக்கம், ${user.fullName}!` : `Welcome back, ${user.fullName}!`}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      From your AgriOne account hub, you can monitor your farm plots, track leaf scans, manage marketplace orders, and update credentials.
                    </p>
                  </div>
                  <Link
                    to="/dashboard"
                    className="agri-btn-primary py-2.5 px-4 text-xs font-bold shrink-0 flex items-center gap-2"
                  >
                    <span>{language === 'ta' ? 'முழு டாஷ்போர்டு' : 'Open Operations Hub'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Quick Action Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                  <Link
                    to="/disease-doctor"
                    className="p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900">{language === 'ta' ? 'பயிர் மருத்துவர்' : 'AI Crop Doctor'}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Diagnose plant blight & remedies</p>
                  </Link>

                  <Link
                    to="/market-prices"
                    className="p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900">{language === 'ta' ? 'மண்டி விலைகள்' : 'APMC Mandi Rates'}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Live rates across Tamil Nadu</p>
                  </Link>

                  <Link
                    to="/farm-profile"
                    className="p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
                      <Tractor className="w-4 h-4" />
                    </div>
                    <h4 className="text-xs font-bold text-slate-900">{language === 'ta' ? 'பண்ணை விவரம்' : 'Farm Management'}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Acreage, soil, & crop cycle</p>
                  </Link>
                </div>
              </div>

              {/* Recent Activity Snapshot */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    {language === 'ta' ? 'சமீபத்திய வேளாண் செயல்பாடுகள்' : 'Recent Agronomic Activity'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => switchTab('scans')}
                    className="text-xs text-emerald-700 hover:underline font-semibold"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-3">
                  {diseaseScans.slice(0, 3).map((scan, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                          <Stethoscope className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{scan.cropName} Scan</p>
                          <p className="text-[11px] text-slate-500">{scan.diseaseName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {Math.round(scan.confidence ? scan.confidence * 100 : 94)}% Confidence
                        </span>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {new Date(scan.createdAt || Date.now()).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {diseaseScans.length === 0 && (
                    <div className="py-6 text-center text-xs text-slate-500">
                      No recent scans recorded. Visit AI Crop Doctor to analyze leaf health.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 2. PROFILE & PERSONAL INFO TAB */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {language === 'ta' ? 'சுயவிவர தகவல்கள்' : 'Profile & Personal Details'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update your contact details and geographical location for tailored agricultural advisories.
                </p>
              </div>

              {profileMsg && (
                <div
                  className={`p-3.5 rounded-xl border flex items-start space-x-2 text-xs ${
                    profileMsg.type === 'success'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border-rose-200 text-rose-700'
                  }`}
                >
                  {profileMsg.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  )}
                  <span className="font-medium">{profileMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {language === 'ta' ? 'முழு பெயர்' : 'Full Name'}
                    </label>
                    <input
                      type="text"
                      required
                      value={editProfileForm.fullName}
                      onChange={e => setEditProfileForm({ ...editProfileForm, fullName: e.target.value })}
                      className="agri-input text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {language === 'ta' ? 'பயனர் பங்கு' : 'Account Role'}
                    </label>
                    <input
                      type="text"
                      disabled
                      value={user.role}
                      className="agri-input text-xs bg-slate-100 text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {language === 'ta' ? 'மின்னஞ்சல் (நிலையானது)' : 'Email Address (Verified)'}
                    </label>
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="agri-input text-xs bg-slate-100 text-slate-500 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {language === 'ta' ? 'கைபேசி எண் (நிலையானது)' : 'Mobile Number (Primary)'}
                    </label>
                    <input
                      type="text"
                      disabled
                      value={`+91 ${user.mobileNumber}`}
                      className="agri-input text-xs bg-slate-100 text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {language === 'ta' ? 'மாநிலம்' : 'State'}
                    </label>
                    <input
                      type="text"
                      required
                      value={editProfileForm.state}
                      onChange={e => setEditProfileForm({ ...editProfileForm, state: e.target.value })}
                      className="agri-input text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {language === 'ta' ? 'மாவட்டம்' : 'District'}
                    </label>
                    <input
                      type="text"
                      required
                      value={editProfileForm.district}
                      onChange={e => setEditProfileForm({ ...editProfileForm, district: e.target.value })}
                      className="agri-input text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {language === 'ta' ? 'கிராமம்' : 'Village / Town'}
                    </label>
                    <input
                      type="text"
                      required
                      value={editProfileForm.village}
                      onChange={e => setEditProfileForm({ ...editProfileForm, village: e.target.value })}
                      className="agri-input text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {language === 'ta' ? 'சுயவிவர பட URL' : 'Avatar Photo URL'}
                  </label>
                  <input
                    type="url"
                    value={editProfileForm.avatarUrl}
                    onChange={e => setEditProfileForm({ ...editProfileForm, avatarUrl: e.target.value })}
                    placeholder="https://..."
                    className="agri-input text-xs"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="agri-btn-primary py-2.5 px-6 text-xs font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {profileSaving ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Save Profile Details</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 3. FARMING PROFILE TAB */}
          {activeTab === 'farms' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {language === 'ta' ? 'எனது பண்ணை விவரங்கள்' : 'My Farming Profile & Holdings'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Your agricultural land records, soil classification, irrigation infrastructure, and active crop cycles.
                  </p>
                </div>
                <Link
                  to="/farm-profile"
                  className="agri-btn-primary py-2 px-3 text-xs font-bold flex items-center gap-1.5 shrink-0"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Manage in Detail</span>
                </Link>
              </div>

              {loadingFarms ? (
                <div className="py-8 text-center text-xs text-slate-500">Loading farm holdings...</div>
              ) : farms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {farms.map((f, idx) => (
                    <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm text-slate-900">{f.name || 'Cauvery Delta Farm #1'}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                          {f.sizeAcres || 5.2} Acres
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Soil Type</span>
                          <span className="font-semibold text-slate-800">{f.soilType || 'Alluvial Clay Loam'}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Crop</span>
                          <span className="font-semibold text-emerald-700">{f.currentCrop || 'Samba Paddy (CR 1009)'}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Irrigation</span>
                          <span className="font-semibold text-slate-800">{f.irrigationType || 'Canal & Borewell'}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Survey No.</span>
                          <span className="font-semibold text-slate-800">{f.surveyNumber || '142/3A'}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
                        <span>Expected Harvest: <strong>{f.expectedHarvest || 'Dec 2026'}</strong></span>
                        <Link to="/farm-profile" className="text-emerald-700 font-bold hover:underline">
                          Edit Plot →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center p-6 border-2 border-dashed border-slate-200 rounded-2xl space-y-3">
                  <Tractor className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-500">No farm plots registered yet.</p>
                  <Link to="/farm-profile" className="agri-btn-primary py-2 px-4 text-xs font-bold inline-flex items-center gap-1.5">
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Register First Farm Plot</span>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* 4. DISEASE SCANS & CROP HISTORY */}
          {activeTab === 'scans' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {language === 'ta' ? 'சேமிக்கப்பட்ட பயிர் நோய் ஆய்வுகள்' : 'Saved Disease Diagnoses & History'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Photographic analysis records, severity scores, and biological prescription remedies.
                  </p>
                </div>
                <Link
                  to="/disease-doctor"
                  className="agri-btn-primary py-2 px-3 text-xs font-bold flex items-center gap-1.5 shrink-0"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>New Diagnosis Scan</span>
                </Link>
              </div>

              {loadingScans ? (
                <div className="py-8 text-center text-xs text-slate-500">Loading scan history...</div>
              ) : diseaseScans.length > 0 ? (
                <div className="space-y-3">
                  {diseaseScans.map((scan, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                          <Stethoscope className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-extrabold text-sm text-slate-900">{scan.cropName}</span>
                            <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                              {scan.diseaseName}
                            </span>
                          </div>
                          <p className="text-slate-600 mt-1 line-clamp-2">
                            <strong>Remedy:</strong> {scan.remedy || 'Apply bio-fungicide Pseudomonas fluorescens @ 10g/L or copper oxychloride.'}
                          </p>
                        </div>
                      </div>

                      <div className="sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end">
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {Math.round(scan.confidence ? scan.confidence * 100 : 92)}% Accuracy
                        </span>
                        <span className="text-[10px] text-slate-400 mt-1">
                          {new Date(scan.createdAt || Date.now()).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center p-6 border-2 border-dashed border-slate-200 rounded-2xl space-y-3">
                  <Stethoscope className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-500">No leaf disease scans found.</p>
                  <Link to="/disease-doctor" className="agri-btn-primary py-2 px-4 text-xs font-bold inline-flex items-center gap-1.5">
                    <span>Upload Leaf Photo</span>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* 5. ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {language === 'ta' ? 'எனது சந்தை ஆர்டர்கள்' : 'Orders & Commerce History'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Your marketplace seed, fertilizer, and harvest produce transactions.
                  </p>
                </div>
                <Link
                  to="/marketplace"
                  className="agri-btn-primary py-2 px-3 text-xs font-bold flex items-center gap-1.5 shrink-0"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Browse Mandi Produce</span>
                </Link>
              </div>

              {loadingOrders ? (
                <div className="py-8 text-center text-xs text-slate-500">Loading order records...</div>
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((ord, idx) => (
                    <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                        <div className="flex items-center space-x-2">
                          <PackageCheck className="w-4 h-4 text-emerald-700" />
                          <span className="font-extrabold text-slate-900">{ord.orderNumber || `AGRI-2026-00${idx + 1}`}</span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-500">{new Date(ord.createdAt || Date.now()).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {ord.orderStatus || 'CONFIRMED'}
                          </span>
                          <span className="font-extrabold text-sm text-slate-900">
                            ₹{(ord.totalAmount || 6850).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* Order items */}
                      <div className="space-y-1.5">
                        {ord.items?.map((item: any, iIdx: number) => (
                          <div key={iIdx} className="flex justify-between text-slate-700">
                            <span>{item.productName || 'Agricultural Produce'} × {item.quantity} {item.unit || 'qtl'}</span>
                            <span className="font-semibold">₹{(item.totalPrice || 2450).toLocaleString('en-IN')}</span>
                          </div>
                        )) || (
                          <div className="flex justify-between text-slate-700">
                            <span>Premium Sona Masoori Paddy (BPT 5204) × 2 quintal</span>
                            <span className="font-semibold">₹4,900</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-200 flex justify-between items-center">
                        <span>Delivery: <strong>{ord.deliveryAddress || `${user.village || 'Kabisthalam'}, ${user.district}`}</strong></span>
                        <span className="text-emerald-700 font-semibold">{ord.paymentMode || 'Direct DBT'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center p-6 border-2 border-dashed border-slate-200 rounded-2xl space-y-3">
                  <PackageCheck className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-500">No active or past marketplace orders.</p>
                  <Link to="/marketplace" className="agri-btn-primary py-2 px-4 text-xs font-bold inline-flex items-center gap-1.5">
                    <span>Visit Marketplace</span>
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* 6. SECURITY & PASSWORD TAB */}
          {activeTab === 'security' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {language === 'ta' ? 'கடவுச்சொல் & கணக்கு பாதுகாப்பு' : 'Account Security & Change Password'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Secure your account by regularly updating your password with modern cryptographic hashing.
                </p>
              </div>

              {passwordMsg && (
                <div
                  className={`p-3.5 rounded-xl border flex items-start space-x-2 text-xs ${
                    passwordMsg.type === 'success'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border-rose-200 text-rose-700'
                  }`}
                >
                  {passwordMsg.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  )}
                  <span className="font-medium">{passwordMsg.text}</span>
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {language === 'ta' ? 'தற்போதைய கடவுச்சொல்' : 'Current Password'} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      required
                      value={passwordForm.currentPassword}
                      onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      placeholder="••••••••"
                      className="agri-input text-xs pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {language === 'ta' ? 'புதிய கடவுச்சொல் (குறைந்தது 6 எழுத்துக்கள்)' : 'New Secure Password (min 6 characters)'} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={passwordForm.newPassword}
                      onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      placeholder="••••••••"
                      className="agri-input text-xs pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {language === 'ta' ? 'புதிய கடவுச்சொல்லை உறுதிசெய்' : 'Confirm New Password'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordForm.confirmNewPassword}
                    onChange={e => setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value })}
                    placeholder="••••••••"
                    className="agri-input text-xs"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={passwordSaving}
                    className="agri-btn-primary py-2.5 px-6 text-xs font-bold flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {passwordSaving ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Updating Password...</span>
                      </>
                    ) : (
                      <>
                        <Key className="w-4 h-4" />
                        <span>Update Password</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Farmer Security Recommendations */}
              <div className="pt-4 border-t border-slate-100 text-xs text-slate-600 space-y-2">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Farmer Account Safety Guidelines:</span>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-[11px] text-slate-500">
                  <li>Never share your password or OTP with unauthorized intermediaries or commission agents.</li>
                  <li>AgriOne AI staff will never call asking for your account login password.</li>
                  <li>Always sign out when using shared computer kiosks or common service centers (CSC).</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Lock, Mail, Phone, User, MapPin, Building, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    password: '',
    state: 'Tamil Nadu',
    district: 'Thanjavur',
    village: '',
    role: 'FARMER',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    const res = await register(formData);
    setLoading(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setErrorMessage(res.message || 'Registration failed. Please check form fields.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-lg w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-600/20 border border-emerald-500">
            <Sprout className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            {language === 'ta' ? 'அக்ரிஒன் புதிய உழவர் பதிவு' : 'Create an AgriOne AI Account'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            {language === 'ta'
              ? 'விவசாய சேவைகள், சந்தை மற்றும் AI கருவிகளைப் பயன்படுத்த பதிவு செய்யவும்'
              : 'Join the digital agriculture network connecting farmers, agronomists, and mandi buyers'}
          </p>
        </div>

        <div className="agri-card p-6 sm:p-8 space-y-5 border-slate-200">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {language === 'ta' ? 'முழு பெயர்' : 'Full Legal Name'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Selvam Murugan"
                  className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {language === 'ta' ? 'கைபேசி எண் (10 இலக்கம்)' : 'Mobile Number (10 digits)'}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    name="mobileNumber"
                    required
                    pattern="[6-9][0-9]{9}"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder="9876543210"
                    className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {language === 'ta' ? 'மின்னஞ்சல்' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="farmer@example.com"
                    className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {language === 'ta' ? 'கடவுச்சொல்' : 'Password (minimum 6 characters)'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {language === 'ta' ? 'பயனர் பங்கு' : 'Account Type / Primary Role'}
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="agri-select text-xs"
              >
                <option value="FARMER">🌾 {language === 'ta' ? 'விவசாயி (Farmer - Cultivator)' : 'Farmer (Cultivator & Seller)'}</option>
                <option value="BUYER">🛒 {language === 'ta' ? 'வாங்குபவர் (Buyer / Mandi Trader)' : 'Buyer (Mandi Trader & Food Processor)'}</option>
                <option value="AGRICULTURAL_EXPERT">🔬 {language === 'ta' ? 'வேளாண் விஞ்ஞானி / நிபுணர்' : 'Agronomist / Agricultural Scientist'}</option>
              </select>
            </div>

            {/* Geographical details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {language === 'ta' ? 'மாநிலம்' : 'State'}
                </label>
                <input
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  className="agri-input text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {language === 'ta' ? 'மாவட்டம்' : 'District'}
                </label>
                <input
                  type="text"
                  name="district"
                  required
                  value={formData.district}
                  onChange={handleChange}
                  className="agri-input text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {language === 'ta' ? 'கிராமம்' : 'Village'}
                </label>
                <input
                  type="text"
                  name="village"
                  required
                  value={formData.village}
                  onChange={handleChange}
                  placeholder="Kabisthalam"
                  className="agri-input text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="agri-btn-primary w-full py-3.5 text-xs font-bold flex items-center justify-center space-x-2 mt-2"
            >
              {loading ? (
                <span>{t('loading')}</span>
              ) : (
                <>
                  <span>{language === 'ta' ? 'கணக்கை உருவாக்கவும்' : 'Complete Farmer Registration'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-600">
              {language === 'ta' ? 'ஏற்கனவே கணக்கு உள்ளதா? ' : 'Already registered with AgriOne? '}
              <Link to="/login" className="font-bold text-emerald-700 hover:underline">
                {language === 'ta' ? 'உள்நுழையவும்' : 'Sign in'}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

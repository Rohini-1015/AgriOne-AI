import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sprout,
  Lock,
  Mail,
  Phone,
  User,
  MapPin,
  Building,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  Check,
  X
} from 'lucide-react';
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
    confirmPassword: '',
    state: 'Tamil Nadu',
    district: 'Thanjavur',
    village: '',
    role: 'FARMER',
    acceptTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Password strength calculation
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: '', color: 'bg-slate-200' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd) || /[A-Z]/.test(pwd)) score += 1;

    if (score <= 1) return { score: 1, label: language === 'ta' ? 'எளிதானது' : 'Weak', color: 'bg-rose-500', width: 'w-1/4' };
    if (score === 2) return { score: 2, label: language === 'ta' ? 'மிதமான' : 'Fair', color: 'bg-amber-500', width: 'w-2/4' };
    if (score === 3) return { score: 3, label: language === 'ta' ? 'நல்லது' : 'Good', color: 'bg-emerald-500', width: 'w-3/4' };
    return { score: 4, label: language === 'ta' ? 'வலுவானது' : 'Strong', color: 'bg-emerald-600', width: 'w-full' };
  };

  const strength = getPasswordStrength(formData.password);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // Prevent duplicate submissions

    setErrorMessage('');
    setSuccessMessage('');

    // 1. Full name validation
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      setErrorMessage(language === 'ta' ? 'முழு பெயரை சரியாக உள்ளிடவும் (குறைந்தது 2 எழுத்துக்கள்)' : 'Please enter your full legal name (minimum 2 characters).');
      return;
    }

    // 2. Indian Mobile number validation
    const mobileClean = formData.mobileNumber.trim();
    const indianMobileRegex = /^[6-9]\d{9}$/;
    if (!indianMobileRegex.test(mobileClean)) {
      setErrorMessage(
        language === 'ta'
          ? 'சரியான 10 இலக்க இந்திய கைபேசி எண்ணை உள்ளிடவும் (6-9 இல் தொடங்க வேண்டும்)'
          : 'Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.'
      );
      return;
    }

    // 3. Email validation
    const emailClean = formData.email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailClean)) {
      setErrorMessage(language === 'ta' ? 'சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்' : 'Please provide a valid email address.');
      return;
    }

    // 4. Password validation
    if (formData.password.length < 6) {
      setErrorMessage(language === 'ta' ? 'கடவுச்சொல் குறைந்தது 6 எழுத்துகள் கொண்டிருக்க வேண்டும்' : 'Password must be at least 6 characters long.');
      return;
    }

    // 5. Confirm password match
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage(language === 'ta' ? 'கடவுச்சொற்கள் பொருந்தவில்லை' : 'Passwords do not match. Please re-enter confirm password.');
      return;
    }

    // 6. Terms acceptance
    if (!formData.acceptTerms) {
      setErrorMessage(
        language === 'ta'
          ? 'விவசாய சேவைகள் மற்றும் தனியுரிமைக் கொள்கையை ஏற்க வேண்டும்'
          : 'Please accept the AgriOne AI Terms of Service and Privacy Policy to proceed.'
      );
      return;
    }

    setLoading(true);

    try {
      const payload = {
        fullName: formData.fullName.trim(),
        mobileNumber: mobileClean,
        email: emailClean.toLowerCase(),
        password: formData.password,
        state: formData.state.trim() || 'Tamil Nadu',
        district: formData.district.trim() || 'Thanjavur',
        village: formData.village.trim() || 'Rural',
        role: formData.role,
      };

      const res = await register(payload);

      if (res.success) {
        setSuccessMessage(
          language === 'ta'
            ? 'கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது! வழிநடத்துகிறது...'
            : 'Account registered successfully! Redirecting to your dashboard...'
        );
        setTimeout(() => {
          navigate('/dashboard');
        }, 600);
      } else {
        setErrorMessage(res.message || 'Registration failed. Please check form fields.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 bg-slate-50/50">
      <div className="max-w-xl w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-700/20 border border-emerald-600">
            <Sprout className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            {language === 'ta' ? 'அக்ரிஒன் புதிய கணக்கு பதிவு' : 'Create an AgriOne AI Account'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            {language === 'ta'
              ? 'விவசாய சேவைகள், சந்தை மற்றும் AI கருவிகளைப் பயன்படுத்த பதிவு செய்யவும்'
              : 'Join the digital agriculture platform connecting Indian farmers, mandis, and agronomists'}
          </p>
        </div>

        {/* Main Registration Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200/90 space-y-5">
          {/* Success Banner */}
          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start space-x-2 text-xs text-emerald-800 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="font-medium">{successMessage}</span>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-2 text-xs text-rose-700 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span className="font-medium">{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Full Name */}
            <div>
              <label htmlFor="reg-fullname" className="block text-xs font-bold text-slate-700 mb-1.5">
                {language === 'ta' ? 'முழு பெயர்' : 'Full Legal Name'} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  id="reg-fullname"
                  type="text"
                  name="fullName"
                  required
                  autoComplete="name"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Selvam Murugan"
                  className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-colors"
                />
              </div>
            </div>

            {/* Mobile & Email in 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="reg-mobile" className="block text-xs font-bold text-slate-700 mb-1.5">
                  {language === 'ta' ? 'கைபேசி எண்' : 'Indian Mobile (10 digits)'} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    id="reg-mobile"
                    type="tel"
                    name="mobileNumber"
                    required
                    maxLength={10}
                    autoComplete="tel"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder="9876543210"
                    className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg-email" className="block text-xs font-bold text-slate-700 mb-1.5">
                  {language === 'ta' ? 'மின்னஞ்சல்' : 'Email Address'} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    id="reg-email"
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="farmer@example.com"
                    className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="reg-password" className="block text-xs font-bold text-slate-700 mb-1.5">
                  {language === 'ta' ? 'கடவுச்சொல்' : 'Password (min 6 chars)'} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full text-xs pl-10 pr-9 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 p-1 text-slate-400 hover:text-slate-600"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="reg-confirm-password" className="block text-xs font-bold text-slate-700 mb-1.5">
                  {language === 'ta' ? 'கடவுச்சொல்லை உறுதிசெய்' : 'Confirm Password'} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    id="reg-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full text-xs pl-10 pr-9 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 top-2.5 p-1 text-slate-400 hover:text-slate-600"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Live Password Strength Meter */}
            {formData.password && (
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 font-medium">Password Strength:</span>
                  <span className="font-bold text-slate-800">{strength.label}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className={`h-full ${strength.color} ${strength.width} transition-all duration-300`} />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                  <span className={formData.password.length >= 6 ? 'text-emerald-700 font-bold flex items-center' : 'flex items-center'}>
                    {formData.password.length >= 6 ? <Check className="w-3 h-3 mr-0.5 inline" /> : '•'} 6+ Characters
                  </span>
                  <span className={/[0-9]/.test(formData.password) ? 'text-emerald-700 font-bold flex items-center' : 'flex items-center'}>
                    {/[0-9]/.test(formData.password) ? <Check className="w-3 h-3 mr-0.5 inline" /> : '•'} Number
                  </span>
                  <span className={formData.confirmPassword && formData.password === formData.confirmPassword ? 'text-emerald-700 font-bold flex items-center' : 'flex items-center'}>
                    {formData.confirmPassword && formData.password === formData.confirmPassword ? <Check className="w-3 h-3 mr-0.5 inline" /> : '•'} Match
                  </span>
                </div>
              </div>
            )}

            {/* Role Selection */}
            <div>
              <label htmlFor="reg-role" className="block text-xs font-bold text-slate-700 mb-1.5">
                {language === 'ta' ? 'பயனர் பங்கு' : 'Account Type / Primary Role'} <span className="text-rose-500">*</span>
              </label>
              <select
                id="reg-role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 bg-white"
              >
                <option value="FARMER">🌾 {language === 'ta' ? 'விவசாயி (Farmer - Cultivator & Seller)' : 'Farmer (Cultivator & Seller)'}</option>
                <option value="BUYER">🛒 {language === 'ta' ? 'வாங்குபவர் (Buyer / Mandi Trader)' : 'Buyer (Mandi Trader & Bulk Buyer)'}</option>
                <option value="AGRICULTURAL_EXPERT">🔬 {language === 'ta' ? 'வேளாண் விஞ்ஞானி / நிபுணர்' : 'Agronomist / Agricultural Scientist'}</option>
              </select>
            </div>

            {/* Location Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label htmlFor="reg-state" className="block text-[11px] font-bold text-slate-700 mb-1">
                  {language === 'ta' ? 'மாநிலம்' : 'State'} <span className="text-rose-500">*</span>
                </label>
                <input
                  id="reg-state"
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                />
              </div>
              <div>
                <label htmlFor="reg-district" className="block text-[11px] font-bold text-slate-700 mb-1">
                  {language === 'ta' ? 'மாவட்டம்' : 'District'} <span className="text-rose-500">*</span>
                </label>
                <input
                  id="reg-district"
                  type="text"
                  name="district"
                  required
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                />
              </div>
              <div>
                <label htmlFor="reg-village" className="block text-[11px] font-bold text-slate-700 mb-1">
                  {language === 'ta' ? 'கிராமம்' : 'Village / Town'} <span className="text-rose-500">*</span>
                </label>
                <input
                  id="reg-village"
                  type="text"
                  name="village"
                  required
                  value={formData.village}
                  onChange={handleChange}
                  placeholder="Kabisthalam"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
                />
              </div>
            </div>

            {/* Terms and Privacy Checkbox */}
            <div className="pt-1">
              <label className="flex items-start space-x-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="w-4 h-4 mt-0.5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <span className="text-xs text-slate-600 leading-tight">
                  {language === 'ta'
                    ? 'நான் அக்ரிஒன் விவசாய விதிமுறைகள் மற்றும் தனியுரிமைக் கொள்கைகளை ஒப்புக்கொள்கிறேன்.'
                    : 'I agree to the AgriOne AI Terms of Service and Privacy Policy for farmer data sovereignty.'}
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 transition-all shadow-sm shadow-emerald-700/20 flex items-center justify-center space-x-2 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-2"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{language === 'ta' ? 'கணக்கு உருவாகிறது...' : 'Creating Account...'}</span>
                </div>
              ) : (
                <>
                  <span>{language === 'ta' ? 'கணக்கை உருவாக்கவும்' : 'Complete Farmer Registration'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center pt-3 border-t border-slate-100">
            <p className="text-xs text-slate-600">
              {language === 'ta' ? 'ஏற்கனவே கணக்கு உள்ளதா? ' : 'Already registered with AgriOne? '}
              <Link to="/login" className="font-bold text-emerald-700 hover:underline">
                {language === 'ta' ? 'உள்நுழையவும்' : 'Sign in to account'}
              </Link>
            </p>
          </div>
        </div>

        {/* Security Trust Note */}
        <div className="text-center">
          <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Never exposed to 3rd party brokers • Encrypted credentials</span>
          </p>
        </div>
      </div>
    </div>
  );
};

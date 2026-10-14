import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sprout, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Eye, EyeOff, CheckCircle2, UserCheck, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const LoginPage: React.FC = () => {
  const { login, quickDemoLogin, isAuthenticated } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // If already authenticated, redirect to destination or dashboard
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location.state]);

  const [emailOrPhone, setEmailOrPhone] = useState(() => {
    return localStorage.getItem('agrione_remembered_identifier') || '';
  });
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    return localStorage.getItem('agrione_remember_me') === 'true';
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [failedAttempts, setFailedAttempts] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // Prevent duplicate submissions

    setErrorMessage('');
    setSuccessMessage('');

    const trimmedIdentifier = emailOrPhone.trim();
    if (!trimmedIdentifier) {
      setErrorMessage(language === 'ta' ? 'மின்னஞ்சல் அல்லது கைபேசி எண்ணை உள்ளிடவும்' : 'Please enter your email or mobile number.');
      return;
    }

    if (!password) {
      setErrorMessage(language === 'ta' ? 'கடவுச்சொல்லை உள்ளிடவும்' : 'Please enter your password.');
      return;
    }

    setLoading(true);

    try {
      const res = await login(trimmedIdentifier, password);

      if (res.success) {
        setSuccessMessage(language === 'ta' ? 'வெற்றிகரமாக உள்நுழைந்துள்ளீர்கள்! வழிநடத்துகிறது...' : 'Sign in successful! Redirecting to your agronomy dashboard...');
        setFailedAttempts(0);

        if (rememberMe) {
          localStorage.setItem('agrione_remember_me', 'true');
          localStorage.setItem('agrione_remembered_identifier', trimmedIdentifier);
        } else {
          localStorage.removeItem('agrione_remember_me');
          localStorage.removeItem('agrione_remembered_identifier');
        }

        const from = (location.state as any)?.from?.pathname || '/dashboard';
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 500);
      } else {
        const nextFailed = failedAttempts + 1;
        setFailedAttempts(nextFailed);
        setErrorMessage(
          res.message || (language === 'ta' ? 'உள்நுழைவு தோல்வியடைந்தது. விவரங்களை சரிபார்க்கவும்.' : 'Login failed. Please verify your credentials and try again.')
        );
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = async (role: 'FARMER' | 'BUYER' | 'ADMIN') => {
    if (loading) return;
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await quickDemoLogin(role);
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err: any) {
      setErrorMessage('Could not initialize demo session.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 bg-slate-50/50">
      <div className="max-w-md w-full space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-700/20 border border-emerald-600">
            <Sprout className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            {language === 'ta' ? 'அக்ரிஒன் கணக்கில் உள்நுழைக' : 'Sign In to AgriOne AI'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            {language === 'ta'
              ? 'உங்கள் விவசாய மற்றும் சந்தை தகவல்களைக் காண உள்நுழையவும்'
              : 'Secure access to your agricultural operations, market prices, and AI crop advisory'}
          </p>
        </div>

        {/* 1-Click Instant Demo Access Box */}
        <div className="bg-emerald-50/80 border border-emerald-200/90 p-4 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-950 mb-2.5">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>{language === 'ta' ? 'விரைவு பரிசோதனை உள்நுழைவு:' : '1-Click Instant Demo Access:'}</span>
            </div>
            <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300">
              Zero Setup
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleDemoFill('FARMER')}
              className="py-2.5 px-2 rounded-xl text-xs font-bold bg-white text-emerald-950 border border-emerald-200 hover:bg-emerald-100/50 hover:border-emerald-300 shadow-2xs transition-all text-center flex flex-col items-center gap-1 active:scale-95 disabled:opacity-50"
            >
              <span className="text-base">🌾</span>
              <span className="text-[11px] font-bold">{language === 'ta' ? 'விவசாயி' : 'Farmer'}</span>
              <span className="text-[9px] text-slate-500 font-medium">Kabisthalam</span>
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleDemoFill('BUYER')}
              className="py-2.5 px-2 rounded-xl text-xs font-bold bg-white text-emerald-950 border border-emerald-200 hover:bg-emerald-100/50 hover:border-emerald-300 shadow-2xs transition-all text-center flex flex-col items-center gap-1 active:scale-95 disabled:opacity-50"
            >
              <span className="text-base">🛒</span>
              <span className="text-[11px] font-bold">{language === 'ta' ? 'வாங்குபவர்' : 'Buyer'}</span>
              <span className="text-[9px] text-slate-500 font-medium">Chennai APMC</span>
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleDemoFill('ADMIN')}
              className="py-2.5 px-2 rounded-xl text-xs font-bold bg-white text-emerald-950 border border-emerald-200 hover:bg-emerald-100/50 hover:border-emerald-300 shadow-2xs transition-all text-center flex flex-col items-center gap-1 active:scale-95 disabled:opacity-50"
            >
              <span className="text-base">🛡️</span>
              <span className="text-[11px] font-bold">{language === 'ta' ? 'நிர்வாகி' : 'Admin'}</span>
              <span className="text-[9px] text-slate-500 font-medium">Superuser</span>
            </button>
          </div>
        </div>

        {/* Main Login Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200/90 space-y-5">
          {/* Success Message Banner */}
          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start space-x-2.5 text-xs text-emerald-800 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="font-medium">{successMessage}</span>
            </div>
          )}

          {/* Error Message Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-2.5 text-xs text-rose-700 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span className="font-medium">{errorMessage}</span>
            </div>
          )}

          {/* Rate limiting / multiple failed attempts warning */}
          {failedAttempts >= 3 && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 space-y-1.5">
              <div className="flex items-center space-x-1.5 font-bold">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <span>Trouble signing in?</span>
              </div>
              <p className="text-[11px] text-amber-700">
                You have {failedAttempts} unsuccessful sign-in attempts. You can click{' '}
                <Link to="/forgot-password" className="underline font-bold text-amber-900">
                  Forgot Password
                </Link>{' '}
                to securely reset your credentials via SMS/email OTP.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="login-email-phone" className="block text-xs font-bold text-slate-700 mb-1.5">
                {language === 'ta' ? 'மின்னஞ்சல் அல்லது கைபேசி எண்' : 'Email Address or Mobile Number'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  id="login-email-phone"
                  type="text"
                  required
                  autoComplete="username"
                  value={emailOrPhone}
                  onChange={e => setEmailOrPhone(e.target.value)}
                  placeholder="farmer@agrione.com or 9876543210"
                  className="w-full text-xs pl-10 pr-3.5 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password" className="block text-xs font-bold text-slate-700">
                  {language === 'ta' ? 'கடவுச்சொல்' : 'Password'}
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold hover:underline"
                >
                  {language === 'ta' ? 'கடவுச்சொல் மறந்ததா?' : 'Forgot password?'}
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs pl-10 pr-10 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 p-0.5 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Option */}
            <div className="flex items-center justify-between py-1">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <span className="text-xs text-slate-600 font-medium">
                  {language === 'ta' ? 'என்னை நினைவில் கொள்' : 'Remember my account on this device'}
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 transition-all shadow-sm shadow-emerald-700/20 flex items-center justify-center space-x-2 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{language === 'ta' ? 'சரிபார்க்கிறது...' : 'Verifying Credentials...'}</span>
                </div>
              ) : (
                <>
                  <span>{language === 'ta' ? 'உள்நுழையவும்' : 'Sign in to AgriOne Platform'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Registration link */}
          <div className="text-center pt-3 border-t border-slate-100">
            <p className="text-xs text-slate-600">
              {language === 'ta' ? 'புதிய கணக்கு வேண்டுமா? ' : "Don't have an AgriOne account? "}
              <Link to="/register" className="font-bold text-emerald-700 hover:underline">
                {language === 'ta' ? 'இப்போதே பதிவு செய்யுங்கள்' : 'Create Free Account'}
              </Link>
            </p>
          </div>
        </div>

        {/* Security Trust Badge */}
        <div className="text-center">
          <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>256-bit encrypted authentication & private farmer data sovereignty</span>
          </p>
        </div>
      </div>
    </div>
  );
};

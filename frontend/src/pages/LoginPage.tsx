import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const LoginPage: React.FC = () => {
  const { login, quickDemoLogin } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    const res = await login(emailOrPhone, password);
    setLoading(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setErrorMessage(res.message || 'Login failed. Please check credentials.');
    }
  };

  const handleDemoFill = async (role: 'FARMER' | 'BUYER' | 'ADMIN') => {
    setLoading(true);
    await quickDemoLogin(role);
    setLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-600/20 border border-emerald-500">
            <Sprout className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            {language === 'ta' ? 'அக்ரிஒன் கணக்கில் உள்நுழைக' : 'Sign in to AgriOne AI'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto">
            {language === 'ta'
              ? 'உங்கள் விவசாய மற்றும் சந்தை தகவல்களைக் காண உள்நுழையவும்'
              : 'Enter your credentials to access your autonomous agronomy operations platform'}
          </p>
        </div>

        {/* Demo Fast Login Bar */}
        <div className="bg-emerald-50/70 border border-emerald-200/80 p-4 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-emerald-950 mb-2.5">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{language === 'ta' ? 'விரைவு பரிசோதனை உள்நுழைவு:' : '1-Click Instant Demo Access:'}</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold uppercase tracking-wider">Zero Setup</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoFill('FARMER')}
              className="py-2 px-2 rounded-xl text-xs font-bold bg-white text-emerald-950 border border-emerald-200 hover:bg-emerald-50 shadow-2xs transition-all text-center flex flex-col items-center gap-1 active:scale-95"
            >
              <span className="text-base">🌾</span>
              <span className="text-[11px]">{language === 'ta' ? 'விவசாயி' : 'Farmer'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('BUYER')}
              className="py-2 px-2 rounded-xl text-xs font-bold bg-white text-emerald-950 border border-emerald-200 hover:bg-emerald-50 shadow-2xs transition-all text-center flex flex-col items-center gap-1 active:scale-95"
            >
              <span className="text-base">🛒</span>
              <span className="text-[11px]">{language === 'ta' ? 'வாங்குபவர்' : 'Buyer'}</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('ADMIN')}
              className="py-2 px-2 rounded-xl text-xs font-bold bg-white text-emerald-950 border border-emerald-200 hover:bg-emerald-50 shadow-2xs transition-all text-center flex flex-col items-center gap-1 active:scale-95"
            >
              <span className="text-base">🛡️</span>
              <span className="text-[11px]">{language === 'ta' ? 'நிர்வாகி' : 'Admin'}</span>
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="agri-card p-6 sm:p-8 space-y-5 border-slate-200">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {language === 'ta' ? 'மின்னஞ்சல் அல்லது கைபேசி எண்' : 'Email or Mobile Number'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={emailOrPhone}
                  onChange={e => setEmailOrPhone(e.target.value)}
                  placeholder="farmer@agrione.com or 9876543210"
                  className="w-full text-xs pl-10 pr-3.5 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700">
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
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs pl-10 pr-3.5 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                  <span>{language === 'ta' ? 'உள்நுழையவும்' : 'Sign in to AgriOne Platform'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-600">
              {language === 'ta' ? 'புதிய கணக்கு வேண்டுமா? ' : "Don't have an AgriOne account? "}
              <Link to="/register" className="font-bold text-emerald-700 hover:underline">
                {language === 'ta' ? 'இப்போதே பதிவு செய்யுங்கள்' : 'Register now'}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

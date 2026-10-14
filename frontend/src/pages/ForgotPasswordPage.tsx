import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Mail, Key, ArrowRight, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';

export const ForgotPasswordPage: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState<'REQUEST' | 'VERIFY'>('REQUEST');
  const [demoCode, setDemoCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/forgot-password', { emailOrPhone });
      if (res.data.success) {
        setDemoCode(res.data.data.demoResetToken);
        setResetToken(res.data.data.demoResetToken);
        setStep('VERIFY');
        setMessage(res.data.message);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to process password reset.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/reset-password', {
        emailOrPhone,
        resetToken,
        newPassword,
      });

      if (res.data.success) {
        alert('Password reset successful! You may now sign in.');
        navigate('/login');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-600/20 border border-emerald-500">
            <Sprout className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
            {language === 'ta' ? 'கடவுச்சொல் மீட்பு' : 'Account Recovery'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto">
            {language === 'ta'
              ? 'பதிவு செய்த மின்னஞ்சல் அல்லது தொலைபேசி எண்ணை உள்ளிடவும்'
              : 'Reset your AgriOne credentials via secure SMS or email OTP verification'}
          </p>
        </div>

        <div className="agri-card p-6 sm:p-8 space-y-5 border-slate-200">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {step === 'REQUEST' ? (
            <form onSubmit={handleRequestReset} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {language === 'ta' ? 'மின்னஞ்சல் அல்லது கைபேசி எண்' : 'Registered Email or Mobile Number'}
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

              <button
                type="submit"
                disabled={loading}
                className="agri-btn-primary w-full py-3.5 text-xs font-bold flex items-center justify-center space-x-2 mt-2"
              >
                <span>{language === 'ta' ? 'மீட்பு குறியீடு பெறுக' : 'Send Verification OTP Token'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleConfirmReset} className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-xs text-emerald-800 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Sandbox Demo OTP Token:</span>
                </div>
                <div className="font-mono bg-white px-2.5 py-1 rounded border border-emerald-200 text-emerald-900 font-extrabold text-center text-sm tracking-widest">
                  {demoCode}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {language === 'ta' ? 'சரிபார்ப்பு குறியீடு' : 'Verification OTP Code'}
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={resetToken}
                    onChange={e => setResetToken(e.target.value)}
                    className="w-full text-xs pl-10 pr-3.5 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono tracking-wider"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {language === 'ta' ? 'புதிய கடவுச்சொல்' : 'New Password (min 6 characters)'}
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="agri-input text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="agri-btn-primary w-full py-3.5 text-xs font-bold flex items-center justify-center space-x-2 mt-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'ta' ? 'கடவுச்சொல்லை மாற்றுக' : 'Set New Secure Password'}</span>
              </button>
            </form>
          )}

          <div className="text-center pt-2 border-t border-slate-100">
            <Link to="/login" className="text-xs font-bold text-emerald-700 hover:underline">
              {language === 'ta' ? 'உள்நுழைவு பக்கத்திற்குத் திரும்பு' : '← Return to sign in'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

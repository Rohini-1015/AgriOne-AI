import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Sprout,
  ShoppingCart,
  Bell,
  User as UserIcon,
  LogOut,
  Globe,
  Menu,
  X,
  CheckCircle2,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useNotifications } from '../../context/NotificationContext';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const { itemCount } = useCart();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 rounded-xl bg-agri-600 flex items-center justify-center text-white shadow-sm group-hover:bg-agri-700 transition-colors">
                <Sprout className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 leading-none">
                  Agri<span className="text-agri-600">One</span> <span className="text-harvest-500 text-sm font-semibold">AI</span>
                </span>
                <span className="text-[10px] text-slate-500 font-medium tracking-wide">
                  {language === 'ta' ? 'வேளாண் தொழில்நுட்பம்' : 'Agritech Ecosystem'}
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/dashboard') ? 'bg-agri-50 text-agri-700 font-semibold' : 'text-slate-600 hover:text-agri-700 hover:bg-slate-50'
              }`}
            >
              {t('navDashboard')}
            </Link>
            <Link
              to="/disease-doctor"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/disease-doctor') ? 'bg-agri-50 text-agri-700 font-semibold' : 'text-slate-600 hover:text-agri-700 hover:bg-slate-50'
              }`}
            >
              {t('navCropDoctor')}
            </Link>
            <Link
              to="/crop-recommend"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/crop-recommend') ? 'bg-agri-50 text-agri-700 font-semibold' : 'text-slate-600 hover:text-agri-700 hover:bg-slate-50'
              }`}
            >
              {t('navCropRecommend')}
            </Link>
            <Link
              to="/soil-health"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/soil-health') ? 'bg-agri-50 text-agri-700 font-semibold' : 'text-slate-600 hover:text-agri-700 hover:bg-slate-50'
              }`}
            >
              {t('navSoilHealth')}
            </Link>
            <Link
              to="/market-prices"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/market-prices') ? 'bg-agri-50 text-agri-700 font-semibold' : 'text-slate-600 hover:text-agri-700 hover:bg-slate-50'
              }`}
            >
              {t('navMarketPrices')}
            </Link>
            <Link
              to="/marketplace"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/marketplace') ? 'bg-agri-50 text-agri-700 font-semibold' : 'text-slate-600 hover:text-agri-700 hover:bg-slate-50'
              }`}
            >
              {t('navMarketplace')}
            </Link>
            <Link
              to="/agribot"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/agribot') ? 'bg-agri-50 text-agri-700 font-semibold' : 'text-slate-600 hover:text-agri-700 hover:bg-slate-50'
              }`}
            >
              {t('navAgriBot')}
            </Link>
            <Link
              to="/schemes"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/schemes') ? 'bg-agri-50 text-agri-700 font-semibold' : 'text-slate-600 hover:text-agri-700 hover:bg-slate-50'
              }`}
            >
              {t('navSchemes')}
            </Link>
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center space-x-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
              title="Switch Language / மொழி மாற்று"
            >
              <Globe className="w-3.5 h-3.5 text-agri-600" />
              <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 rounded-lg text-slate-600 hover:text-agri-700 hover:bg-slate-100 transition-colors"
              title="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-agri-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Notification Bell */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative p-2 rounded-lg text-slate-600 hover:text-agri-700 hover:bg-slate-100 transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-harvest-500 ring-2 ring-white" />
                  )}
                </button>

                {/* Notifications Dropdown Drawer */}
                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                      <h4 className="font-bold text-sm text-slate-900">
                        {language === 'ta' ? 'அறிவிப்புகள்' : 'Notifications'}
                      </h4>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-agri-600 hover:text-agri-700 font-medium"
                        >
                          {language === 'ta' ? 'அனைத்தும் படித்ததாகக் குறி' : 'Mark all read'}
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                      {notifications.length === 0 ? (
                        <div className="py-6 text-center text-xs text-slate-500">
                          {language === 'ta' ? 'புதிய அறிவிப்புகள் இல்லை' : 'No notifications'}
                        </div>
                      ) : (
                        notifications.map(n => (
                          <div
                            key={n.id}
                            onClick={() => {
                              markAsRead(n.id);
                              if (n.actionUrl) navigate(n.actionUrl);
                              setNotifOpen(false);
                            }}
                            className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors ${
                              !n.isRead ? 'bg-agri-50/50' : ''
                            }`}
                          >
                            <p className="text-xs font-semibold text-slate-800">
                              {language === 'ta' ? n.titleTa : n.titleEn}
                            </p>
                            <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                              {language === 'ta' ? n.messageTa : n.messageEn}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Profile / Auth State */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <img
                    src={user.avatarUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100'}
                    alt={user.fullName}
                    className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200"
                  />
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-800 leading-tight">
                      {user.fullName.split(' ')[0]}
                    </span>
                    <span className="text-[10px] font-semibold text-agri-700 uppercase tracking-wider">
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Profile Dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{user.fullName}</p>
                      <p className="text-[11px] text-slate-500">{user.email}</p>
                      <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-agri-100 text-agri-800">
                        {user.role}
                      </div>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/farm-profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                      >
                        {t('navFarmProfile')}
                      </Link>
                      {user.role === 'FARMER' && (
                        <Link
                          to="/my-listings"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                        >
                          {t('navMyListings')}
                        </Link>
                      )}
                      <Link
                        to="/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="block px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                      >
                        {t('navMyOrders')}
                      </Link>
                      {user.role === 'ADMIN' && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="block px-4 py-2 text-xs text-purple-700 hover:bg-purple-50 font-semibold"
                        >
                          {t('navAdmin')}
                        </Link>
                      )}
                    </div>
                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-xs text-red-600 hover:bg-red-50 font-semibold"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{t('navLogout')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  {t('navLogin')}
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-agri-600 text-white hover:bg-agri-700 transition-colors shadow-xs"
                >
                  {t('navRegister')}
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-6 space-y-1">
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {t('navDashboard')}
          </Link>
          <Link
            to="/disease-doctor"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {t('navCropDoctor')}
          </Link>
          <Link
            to="/crop-recommend"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {t('navCropRecommend')}
          </Link>
          <Link
            to="/soil-health"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {t('navSoilHealth')}
          </Link>
          <Link
            to="/market-prices"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {t('navMarketPrices')}
          </Link>
          <Link
            to="/marketplace"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {t('navMarketplace')}
          </Link>
          <Link
            to="/services/equipment"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {t('navEquipment')}
          </Link>
          <Link
            to="/services/labour"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {t('navLabour')}
          </Link>
          <Link
            to="/services/logistics"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {t('navLogistics')}
          </Link>
          <Link
            to="/agribot"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {t('navAgriBot')}
          </Link>
          <Link
            to="/schemes"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            {t('navSchemes')}
          </Link>
        </div>
      )}
    </header>
  );
};

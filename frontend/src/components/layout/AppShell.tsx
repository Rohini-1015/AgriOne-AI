import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Sprout,
  LayoutDashboard,
  Stethoscope,
  Compass,
  FileSpreadsheet,
  CloudSun,
  TrendingUp,
  Store,
  ShoppingCart,
  PackageCheck,
  Tractor,
  Users,
  Truck,
  FileCheck,
  Bot,
  User,
  ShieldCheck,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Globe,
  Bell,
  ChevronDown,
  Layers,
  MapPin,
  Sparkles,
  LayoutGrid
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useNotifications } from '../../context/NotificationContext';

interface AppShellProps {
  children: React.ReactNode;
}

interface NavCategory {
  id: string;
  label: string;
  icon: React.ElementType;
  items: {
    to: string;
    label: string;
    icon: React.ElementType;
    badge?: string;
    count?: number;
  }[];
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const { itemCount } = useCart();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('agrione_sidebar_collapsed') === 'true';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  // Accordion category state for progressive disclosure
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    farm: true,
    market: false,
    services: false,
    ai: false,
    account: false,
  });

  useEffect(() => {
    localStorage.setItem('agrione_sidebar_collapsed', sidebarCollapsed ? 'true' : 'false');
  }, [sidebarCollapsed]);

  // Close drawers on route change and auto-expand active category
  useEffect(() => {
    setMobileMenuOpen(false);
    setNotifOpen(false);
    setUserDropdownOpen(false);

    // Automatically expand the category containing the active route
    const path = location.pathname;
    if (['/disease-doctor', '/crop-recommend', '/soil-health', '/weather'].some(p => path.startsWith(p))) {
      setExpandedCategories(prev => ({ ...prev, farm: true }));
    } else if (['/market-prices', '/marketplace', '/cart', '/orders', '/my-listings'].some(p => path.startsWith(p))) {
      setExpandedCategories(prev => ({ ...prev, market: true }));
    } else if (['/services', '/schemes'].some(p => path.startsWith(p))) {
      setExpandedCategories(prev => ({ ...prev, services: true }));
    } else if (path.startsWith('/agribot')) {
      setExpandedCategories(prev => ({ ...prev, ai: true }));
    } else if (['/farm-profile', '/admin', '/my-account', '/account'].some(p => path.startsWith(p))) {
      setExpandedCategories(prev => ({ ...prev, account: true }));
    }
  }, [location.pathname]);

  const toggleCategory = (catId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const isPublicLandingOrAuth = ['/', '/login', '/register', '/forgot-password'].includes(location.pathname);

  const isActive = (path: string) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Structured Expandable Categories
  const categories: NavCategory[] = [
    {
      id: 'farm',
      label: language === 'ta' ? 'விவசாய நுண்ணறிவு' : 'Farm Intelligence',
      icon: Sprout,
      items: [
        { to: '/disease-doctor', label: t('navCropDoctor'), icon: Stethoscope, badge: 'AI' },
        { to: '/crop-recommend', label: t('navCropRecommend'), icon: Compass },
        { to: '/soil-health', label: t('navSoilHealth'), icon: FileSpreadsheet },
        { to: '/weather', label: t('navWeather'), icon: CloudSun },
      ],
    },
    {
      id: 'market',
      label: language === 'ta' ? 'சந்தை & வர்த்தகம்' : 'Market & Commerce',
      icon: TrendingUp,
      items: [
        { to: '/market-prices', label: t('navMarketPrices'), icon: TrendingUp },
        { to: '/marketplace', label: t('navMarketplace'), icon: Store },
        { to: '/cart', label: language === 'ta' ? 'கூடை' : 'Produce Cart', icon: ShoppingCart, count: itemCount },
        ...(isAuthenticated ? [{ to: '/orders', label: t('navMyOrders'), icon: PackageCheck }] : []),
        ...(isAuthenticated && (user?.role === 'FARMER' || user?.role === 'ADMIN')
          ? [{ to: '/my-listings', label: t('navMyListings'), icon: Layers }]
          : []),
      ],
    },
    {
      id: 'services',
      label: language === 'ta' ? 'பண்ணை சேவைகள்' : 'Farm Services',
      icon: Tractor,
      items: [
        { to: '/services/equipment', label: t('navEquipment'), icon: Tractor },
        { to: '/services/labour', label: t('navLabour'), icon: Users },
        { to: '/services/logistics', label: t('navLogistics'), icon: Truck },
        { to: '/schemes', label: t('navSchemes'), icon: FileCheck },
      ],
    },
    {
      id: 'ai',
      label: language === 'ta' ? 'செயற்கை நுண்ணறிவு' : 'AI Tools',
      icon: Bot,
      items: [
        { to: '/agribot', label: t('navAgriBot'), icon: Bot, badge: 'GPT' },
      ],
    },
    ...(isAuthenticated ? [
      {
        id: 'account',
        label: language === 'ta' ? 'சுயவிவரம் & நிர்வாகம்' : 'Account & Admin',
        icon: User,
        items: [
          { to: '/my-account', label: language === 'ta' ? 'எனது கணக்கு மையம்' : 'My Account Hub', icon: User, badge: 'Hub' },
          { to: '/farm-profile', label: t('navFarmProfile'), icon: Sprout },
          ...(user?.role === 'ADMIN'
            ? [{ to: '/admin', label: t('navAdmin'), icon: ShieldCheck, badge: 'Admin' }]
            : []),
        ],
      }
    ] : []),
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
      {/* Skip to Main Content Link for Keyboard Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-emerald-700 focus:text-white focus:rounded-lg focus:shadow-lg focus:text-xs focus:font-bold focus:outline-hidden"
      >
        {language === 'ta' ? 'முதன்மை உள்ளடக்கத்திற்கு செல்க' : 'Skip to main content'}
      </a>

      {/* Top Application Header */}
      <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between shadow-2xs">
        {/* Left Section: Brand & Sidebar Collapse Toggle */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-emerald-700 flex items-center justify-center text-white shadow-xs group-hover:bg-emerald-800 transition-colors">
              <Sprout className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 leading-none">
                Agri<span className="text-emerald-700">One</span> <span className="text-amber-600 text-xs font-bold">AI</span>
              </span>
              <span className="text-[10px] text-slate-600 font-medium tracking-wide">
                {language === 'ta' ? 'அடுத்த தலைமுறை வேளாண் தளம்' : 'Agritech Intelligence Platform'}
              </span>
            </div>
          </Link>

          {/* Desktop Sidebar Collapse Toggle */}
          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors ml-2"
            title={sidebarCollapsed ? 'Expand navigation' : 'Collapse navigation'}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Location / Delta Context Badge */}
          <div className="hidden xl:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-[11px] font-medium text-slate-600 border border-slate-200">
            <MapPin className="w-3 h-3 text-emerald-700" />
            <span>{user ? `${user.village || 'Kabisthalam'}, ${user.district || 'Thanjavur'}` : 'Tamil Nadu Agmarknet APMC'}</span>
          </div>
        </div>

        {/* Right Section: Language, Cart, Notifications & Profile */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Language Switcher */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
            title="Switch Language / மொழி மாற்று"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-700" />
            <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
          </button>

          {/* Cart Button */}
          <Link
            to="/cart"
            className="relative p-2 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
            title={language === 'ta' ? 'ஷாப்பிங் கூடை' : 'Shopping Cart'}
          >
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Notification Bell */}
          {isAuthenticated && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-slate-100 transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
                )}
              </button>

              {/* Notification Drawer Popover */}
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-dropdown border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="w-4 h-4 text-emerald-700" />
                      <h4 className="font-bold text-xs text-slate-900">
                        {language === 'ta' ? 'அறிவிப்புகள்' : 'Agricultural Advisories'}
                      </h4>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllAsRead}
                        className="text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold"
                      >
                        {language === 'ta' ? 'அனைத்தும் படித்ததாகக் குறி' : 'Mark all read'}
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-500">
                        {language === 'ta' ? 'புதிய அறிவிப்புகள் இல்லை' : 'No new notifications'}
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
                          className={`p-3 hover:bg-slate-50 cursor-pointer transition-colors text-left ${
                            !n.isRead ? 'bg-emerald-50/40' : ''
                          }`}
                        >
                          <p className="text-xs font-semibold text-slate-900">
                            {language === 'ta' ? n.titleTa : n.titleEn}
                          </p>
                          <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">
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

          {/* User Account Menu / Auth Links */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
              >
                <img
                  src={user.avatarUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100'}
                  alt={user.fullName}
                  className="w-7 h-7 rounded-md object-cover ring-1 ring-slate-200"
                />
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-semibold text-slate-900 leading-none">
                    {user.fullName.split(' ')[0]}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mt-0.5">
                    {user.role}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile Dropdown */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-dropdown border border-slate-200 py-1.5 z-50">
                  <div className="px-3.5 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{user.fullName}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {user.role}
                    </span>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/my-account"
                      className="block px-3.5 py-1.5 text-xs text-emerald-800 hover:bg-emerald-50 font-bold"
                    >
                      {language === 'ta' ? '👤 எனது கணக்கு மையம்' : '👤 My Account Hub'}
                    </Link>
                    <Link
                      to="/farm-profile"
                      className="block px-3.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      {t('navFarmProfile')}
                    </Link>
                    {user.role === 'FARMER' && (
                      <Link
                        to="/my-listings"
                        className="block px-3.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                      >
                        {t('navMyListings')}
                      </Link>
                    )}
                    <Link
                      to="/orders"
                      className="block px-3.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      {t('navMyOrders')}
                    </Link>
                    {user.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        className="block px-3.5 py-1.5 text-xs text-purple-700 hover:bg-purple-50 font-bold"
                      >
                        {t('navAdmin')}
                      </Link>
                    )}
                  </div>
                  <div className="border-t border-slate-100 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="flex items-center space-x-2 w-full px-3.5 py-1.5 text-xs text-red-600 hover:bg-red-50 font-semibold"
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
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                {t('navLogin')}
              </Link>
              <Link
                to="/register"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-2xs"
              >
                {t('navRegister')}
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Body Area with Sidebar + Main Content */}
      <div className="flex grow">
        {/* Desktop Expandable Left Sidebar */}
        {!isPublicLandingOrAuth && (
          <aside
            className={`hidden lg:flex flex-col bg-white border-r border-slate-200/90 transition-all duration-300 z-20 shrink-0 ${
              sidebarCollapsed ? 'w-20' : 'w-64'
            }`}
          >
            <div className="flex flex-col h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto px-3 py-4 space-y-4">
              {/* Primary Dashboard Link */}
              <Link
                to="/dashboard"
                title={sidebarCollapsed ? t('navDashboard') : undefined}
                className={`flex items-center rounded-xl transition-all text-xs font-semibold ${
                  sidebarCollapsed ? 'justify-center p-2.5' : 'px-3 py-2.5 space-x-2.5'
                } ${
                  isActive('/dashboard')
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <LayoutDashboard className={`w-4 h-4 shrink-0 ${isActive('/dashboard') ? 'text-white' : 'text-slate-600'}`} />
                {!sidebarCollapsed && <span className="grow truncate text-left">{t('navDashboard')}</span>}
              </Link>

              {/* All Features Hub Link (Always Accessible) */}
              <Link
                to="/features"
                title={sidebarCollapsed ? (language === 'ta' ? 'அனைத்து வசதிகள்' : 'All Features') : undefined}
                className={`flex items-center rounded-xl transition-all text-xs font-semibold border ${
                  sidebarCollapsed ? 'justify-center p-2.5' : 'px-3 py-2 space-x-2.5'
                } ${
                  isActive('/features')
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                    : 'bg-slate-50/80 text-slate-700 border-slate-200/80 hover:bg-emerald-50/50 hover:text-emerald-800 hover:border-emerald-200'
                }`}
              >
                <LayoutGrid className="w-4 h-4 shrink-0 text-emerald-600" />
                {!sidebarCollapsed && (
                  <>
                    <span className="grow truncate text-left">{language === 'ta' ? 'அனைத்து வசதிகள்' : 'All Features'}</span>
                    <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-emerald-100 text-emerald-800">
                      15+
                    </span>
                  </>
                )}
              </Link>

              <div className="h-px bg-slate-100 my-1" />

              {/* Expandable Navigation Categories */}
              <div className="space-y-1">
                {categories.map(cat => {
                  const isExpanded = !!expandedCategories[cat.id];
                  const hasActiveChild = cat.items.some(item => isActive(item.to));
                  const CatIcon = cat.icon;

                  if (sidebarCollapsed) {
                    // In collapsed mode: render icon leading to first item
                    const firstItem = cat.items[0];
                    return (
                      <Link
                        key={cat.id}
                        to={firstItem.to}
                        title={cat.label}
                        className={`flex items-center justify-center p-2.5 rounded-lg transition-all text-xs ${
                          hasActiveChild ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <CatIcon className="w-4 h-4 shrink-0" />
                      </Link>
                    );
                  }

                  return (
                    <div key={cat.id} className="space-y-0.5">
                      {/* Expandable Category Header */}
                      <button
                        type="button"
                        onClick={() => toggleCategory(cat.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                          hasActiveChild
                            ? 'text-emerald-900 bg-emerald-50/60'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center space-x-2 min-w-0">
                          <CatIcon className={`w-4 h-4 shrink-0 ${hasActiveChild ? 'text-emerald-700' : 'text-slate-500'}`} />
                          <span className="truncate">{cat.label}</span>
                        </div>
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180 text-slate-600' : ''
                          }`}
                        />
                      </button>

                      {/* Child Links (Progressive Disclosure) */}
                      {isExpanded && (
                        <div className="pl-6 pr-1 py-0.5 space-y-0.5 border-l border-slate-200 ml-4">
                          {cat.items.map((item, itemIdx) => {
                            const active = isActive(item.to);
                            const ItemIcon = item.icon;

                            return (
                              <Link
                                key={itemIdx}
                                to={item.to}
                                className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-md text-xs transition-all ${
                                  active
                                    ? 'bg-emerald-50 text-emerald-800 font-bold border-l-2 border-emerald-600'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 font-medium'
                                }`}
                              >
                                <ItemIcon className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-emerald-700' : 'text-slate-400'}`} />
                                <span className="grow truncate">{item.label}</span>

                                {item.badge && (
                                  <span className="px-1 py-0.2 text-[9px] font-extrabold rounded bg-emerald-100 text-emerald-800">
                                    {item.badge}
                                  </span>
                                )}

                                {item.count !== undefined && item.count > 0 && (
                                  <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-emerald-600 text-white">
                                    {item.count}
                                  </span>
                                )}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Quick Helpline footer */}
              {!sidebarCollapsed && (
                <div className="mt-auto pt-3 border-t border-slate-100">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                    <div className="flex items-center space-x-1.5 font-bold text-slate-800">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>{language === 'ta' ? 'விவசாயி உதவி எண்' : 'Kisan Agri-Helpline'}</span>
                    </div>
                    <p className="text-[10px] text-slate-500">Toll-Free 24/7: 1800-180-1551</p>
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}

        {/* Mobile Slide-Over Menu (Organized into Clean Accordions) */}
        {!isPublicLandingOrAuth && mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative flex flex-col w-72 max-w-[80%] bg-white h-full shadow-2xl z-50 p-4 overflow-y-auto space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white">
                    <Sprout className="w-4 h-4" />
                  </div>
                  <span className="font-extrabold text-base text-slate-900">AgriOne AI</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Top Links in Mobile Menu */}
              <div className="space-y-1">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-bold ${
                    isActive('/dashboard') ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{t('navDashboard')}</span>
                </Link>

                <Link
                  to="/features"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2.5 px-3 py-2 rounded-lg text-xs font-bold border ${
                    isActive('/features')
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4 text-emerald-600" />
                  <span className="grow">{language === 'ta' ? 'அனைத்து வசதிகள்' : 'All Features Hub'}</span>
                  <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-emerald-100 text-emerald-800">
                    15+
                  </span>
                </Link>
              </div>

              <div className="h-px bg-slate-100" />

              {/* Accordion Categories in Mobile */}
              <div className="space-y-2">
                {categories.map(cat => {
                  const isExpanded = !!expandedCategories[cat.id];
                  const hasActiveChild = cat.items.some(item => isActive(item.to));
                  const CatIcon = cat.icon;

                  return (
                    <div key={cat.id} className="space-y-1">
                      <button
                        type="button"
                        onClick={() => toggleCategory(cat.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold ${
                          hasActiveChild ? 'text-emerald-900 bg-emerald-50/60' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <CatIcon className={`w-4 h-4 ${hasActiveChild ? 'text-emerald-700' : 'text-slate-500'}`} />
                          <span>{cat.label}</span>
                        </div>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>

                      {isExpanded && (
                        <div className="pl-6 space-y-0.5 border-l border-slate-200 ml-3">
                          {cat.items.map((item, itemIdx) => {
                            const active = isActive(item.to);
                            const ItemIcon = item.icon;
                            return (
                              <Link
                                key={itemIdx}
                                to={item.to}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`flex items-center space-x-2 px-2.5 py-1.5 rounded-md text-xs font-medium ${
                                  active
                                    ? 'bg-emerald-50 text-emerald-800 font-bold'
                                    : 'text-slate-600 hover:bg-slate-50'
                                }`}
                              >
                                <ItemIcon className={`w-3.5 h-3.5 ${active ? 'text-emerald-700' : 'text-slate-400'}`} />
                                <span className="grow truncate">{item.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main
          id="main-content"
          tabIndex={-1}
          role="main"
          className="grow min-w-0 overflow-x-hidden pb-16 lg:pb-8 outline-hidden"
        >
          {children}
        </main>
      </div>

      {/* Mobile Bottom Quick-Nav Bar (Clean 5 Essential Items) */}
      {!isPublicLandingOrAuth && (
        <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-30 px-3 py-1.5 flex items-center justify-around shadow-lg">
          <Link
            to="/dashboard"
            className={`flex flex-col items-center py-1 px-2 text-[10px] font-semibold ${
              isActive('/dashboard') ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="mt-0.5">{t('navDashboard')}</span>
          </Link>
          <Link
            to="/disease-doctor"
            className={`flex flex-col items-center py-1 px-2 text-[10px] font-semibold ${
              isActive('/disease-doctor') ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Stethoscope className="w-5 h-5" />
            <span className="mt-0.5">{language === 'ta' ? 'மருத்துவர்' : 'Doctor'}</span>
          </Link>
          <Link
            to="/market-prices"
            className={`flex flex-col items-center py-1 px-2 text-[10px] font-semibold ${
              isActive('/market-prices') ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <TrendingUp className="w-5 h-5" />
            <span className="mt-0.5">{language === 'ta' ? 'மண்டி' : 'Mandi'}</span>
          </Link>
          <Link
            to="/agribot"
            className={`flex flex-col items-center py-1 px-2 text-[10px] font-semibold ${
              isActive('/agribot') ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bot className="w-5 h-5" />
            <span className="mt-0.5">AgriBot</span>
          </Link>
          <Link
            to="/features"
            className={`flex flex-col items-center py-1 px-2 text-[10px] font-semibold ${
              isActive('/features') ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
            <span className="mt-0.5">{language === 'ta' ? 'அனைத்தும்' : 'Features'}</span>
          </Link>
        </nav>
      )}
    </div>
  );
};

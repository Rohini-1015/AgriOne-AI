import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { useAuth } from './context/AuthContext';

// Pages
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { FarmerDashboard } from './pages/FarmerDashboard';
import { CropDoctorPage } from './pages/CropDoctorPage';
import { CropRecommendationPage } from './pages/CropRecommendationPage';
import { SoilHealthPage } from './pages/SoilHealthPage';
import { MarketPricesPage } from './pages/MarketPricesPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { MyListingsPage } from './pages/MyListingsPage';
import { CartPage } from './pages/CartPage';
import { MyOrdersPage } from './pages/MyOrdersPage';
import { EquipmentServicesPage } from './pages/EquipmentServicesPage';
import { LabourServicesPage } from './pages/LabourServicesPage';
import { LogisticsPage } from './pages/LogisticsPage';
import { AgriBotPage } from './pages/AgriBotPage';
import { GovernmentSchemesPage } from './pages/GovernmentSchemesPage';
import { FarmProfilePage } from './pages/FarmProfilePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { WeatherPage } from './pages/WeatherPage';
import { AllFeaturesPage } from './pages/AllFeaturesPage';

// Protected Route Guard
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
  allowedRoles?: string[];
}> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="p-12 text-center text-xs text-slate-500">Checking credentials...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// UI Safety Error Boundary
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: any }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.warn('UI Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
          <div className="max-w-md p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto text-xl">🌾</div>
            <h3 className="text-lg font-bold text-slate-900">Dashboard Loaded</h3>
            <p className="text-xs text-slate-500">A display component encountered an update. Click below to continue.</p>
            <button
              type="button"
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppShell>
        <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/disease-doctor" element={<CropDoctorPage />} />
        <Route path="/crop-recommend" element={<CropRecommendationPage />} />
        <Route path="/soil-health" element={<SoilHealthPage />} />
        <Route path="/market-prices" element={<MarketPricesPage />} />
        <Route path="/weather" element={<WeatherPage />} />
        <Route path="/features" element={<AllFeaturesPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/agribot" element={<AgriBotPage />} />
        <Route path="/schemes" element={<GovernmentSchemesPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <FarmerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <MyOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/farm-profile"
          element={
            <ProtectedRoute>
              <FarmProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-listings"
          element={
            <ProtectedRoute allowedRoles={['FARMER', 'ADMIN']}>
              <MyListingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/services/equipment"
          element={
            <ProtectedRoute>
              <EquipmentServicesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/services/labour"
          element={
            <ProtectedRoute>
              <LabourServicesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/services/logistics"
          element={
            <ProtectedRoute>
              <LogisticsPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Protected Route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
    </ErrorBoundary>
  );
};

export default App;

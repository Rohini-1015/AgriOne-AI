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

export const App: React.FC = () => {
  return (
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
  );
};

export default App;

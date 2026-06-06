import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layout Components
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';

// Dashboard Pages
import DashboardPage from './pages/dashboard/DashboardPage';

// Vendors Pages
import VendorsPage from './pages/vendors/VendorsPage';
import VendorDetailPage from './pages/vendors/VendorDetailPage';
import CreateVendorPage from './pages/vendors/CreateVendorPage';

// RFQ Pages
import RFQListPage from './pages/rfq/RFQListPage';
import CreateRFQPage from './pages/rfq/CreateRFQPage';
import RFQDetailPage from './pages/rfq/RFQDetailPage';

// Quotations Pages
import QuotationsPage from './pages/quotations/QuotationsPage';
import QuotationDetailPage from './pages/quotations/QuotationDetailPage';

// Purchase Orders Pages
import PurchaseOrdersPage from './pages/purchase-orders/PurchaseOrdersPage';
import PurchaseOrderDetailPage from './pages/purchase-orders/PurchaseOrderDetailPage';

// Invoices Pages
import InvoicesPage from './pages/invoices/InvoicesPage';
import InvoiceDetailPage from './pages/invoices/InvoiceDetailPage';

// Reports Pages
import ReportsPage from './pages/reports/ReportsPage';

// Profile Pages
import ProfilePage from './pages/profile/ProfilePage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/signup" element={<SignupPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
            <Route path="/auth/verify-email" element={<VerifyEmailPage />} />
          </Route>

          {/* Protected Routes */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* Vendors Routes */}
            <Route path="/vendors" element={<VendorsPage />} />
            <Route path="/vendors/create" element={<CreateVendorPage />} />
            <Route path="/vendors/:id" element={<VendorDetailPage />} />

            {/* RFQ Routes */}
            <Route path="/rfq" element={<RFQListPage />} />
            <Route path="/rfq/create" element={<CreateRFQPage />} />
            <Route path="/rfq/:id" element={<RFQDetailPage />} />

            {/* Quotations Routes */}
            <Route path="/quotations" element={<QuotationsPage />} />
            <Route path="/quotations/:id" element={<QuotationDetailPage />} />

            {/* Purchase Orders Routes */}
            <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />
            <Route path="/purchase-orders/:id" element={<PurchaseOrderDetailPage />} />

            {/* Invoices Routes */}
            <Route path="/invoices" element={<InvoicesPage />} />
            <Route path="/invoices/:id" element={<InvoiceDetailPage />} />

            {/* Reports Routes */}
            <Route path="/reports" element={<ReportsPage />} />

            {/* Profile Routes */}
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

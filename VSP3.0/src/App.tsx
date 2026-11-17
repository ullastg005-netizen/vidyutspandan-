import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HomePage } from './pages/public/HomePage';
import { LoginPage } from './pages/auth/LoginPage';
import { PortalLayout } from './components/layout/PortalLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { OfficerDashboard } from './pages/officer/OfficerDashboard';
import { WorkerDashboard } from './pages/worker/WorkerDashboard';
import { SupervisorDashboard } from './pages/supervisor/SupervisorDashboard';
import { SupervisorVerification } from './pages/supervisor/SupervisorVerification';
import { OfficerFaults } from './pages/officer/OfficerFaults';
import { UserManagement } from './pages/admin/UserManagement';
import { AuditLogs } from './pages/admin/AuditLogs';
import { StreetlightList } from './features/streetlights/StreetlightList';
import { TransformerList } from './features/transformers/TransformerList';
import { FeederList } from './features/feeders/FeederList';
import { WorkOrderList } from './features/workorders/WorkOrderList';
import { ReportsPage } from './features/reports/ReportsPage';
import { MapPage } from './pages/public/MapPage';

// Protected Route Component
function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#1e2d55] border-t-amber-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to user's assigned dashboard
    switch (user.role) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'officer':
        return <Navigate to="/officer" replace />;
      case 'worker':
        return <Navigate to="/worker" replace />;
      case 'supervisor':
        return <Navigate to="/supervisor" replace />;
      default:
        return <Navigate to="/map" replace />;
    }
  }

  return <PortalLayout>{children}</PortalLayout>;
}

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Website */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Map View */}
          <Route
            path="/map"
            element={
              <PortalLayout>
                <MapPage />
              </PortalLayout>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/audit"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AuditLogs />
              </ProtectedRoute>
            }
          />

          {/* Officer Routes */}
          <Route
            path="/officer"
            element={
              <ProtectedRoute allowedRoles={['officer', 'admin']}>
                <OfficerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/officer/faults"
            element={
              <ProtectedRoute allowedRoles={['officer', 'admin']}>
                <OfficerFaults />
              </ProtectedRoute>
            }
          />

          {/* Field Lineman Routes */}
          <Route
            path="/worker"
            element={
              <ProtectedRoute allowedRoles={['worker', 'admin']}>
                <WorkerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Supervisor Routes */}
          <Route
            path="/supervisor"
            element={
              <ProtectedRoute allowedRoles={['supervisor', 'admin']}>
                <SupervisorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/supervisor/verification"
            element={
              <ProtectedRoute allowedRoles={['supervisor', 'admin']}>
                <SupervisorVerification />
              </ProtectedRoute>
            }
          />

          {/* Shared Operational Modules */}
          <Route
            path="/streetlights"
            element={
              <ProtectedRoute allowedRoles={['admin', 'officer', 'supervisor']}>
                <StreetlightList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transformers"
            element={
              <ProtectedRoute allowedRoles={['admin', 'officer', 'supervisor']}>
                <TransformerList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/feeders"
            element={
              <ProtectedRoute allowedRoles={['admin', 'officer', 'supervisor']}>
                <FeederList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/work-orders"
            element={
              <ProtectedRoute>
                <WorkOrderList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={['admin', 'officer', 'supervisor']}>
                <ReportsPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

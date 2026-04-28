import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ToastProvider } from './components/ui/ToastProvider';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/app/Dashboard';
import PatientList from './pages/app/Patients';
import Schedule from './pages/app/Schedule';
import MedicalRecords from './pages/app/MedicalRecords';
import Examination from './pages/app/Examination';
import UserManagement from './pages/app/UserManagement';
import Pharmacy from './pages/app/Pharmacy';
import Reports from './pages/app/Reports';

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) {
  const { user, profile, loading } = useAuth();

  if (loading) return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-medical-500 border-t-transparent"></div>
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;
  
  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
}

import DoctorsList from './pages/app/Doctors';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/app" element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="patients" element={<PatientList />} />
          <Route path="doctors" element={<DoctorsList />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="medical-records" element={<Examination />} />
          <Route path="history" element={<MedicalRecords />} />
          <Route path="pharmacy" element={<Pharmacy />} />
          <Route path="reports" element={<Reports />} />
          <Route path="users" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <UserManagement />
            </ProtectedRoute>
          } />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </AuthProvider>
  );
}


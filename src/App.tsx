import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { HabitsProvider } from './contexts/HabitsContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import SleepTracker from './pages/SleepTracker';
import WaterTracker from './pages/WaterTracker';
import AuthForm from './components/AuthForm';

function App() {
  return (
    <AuthProvider>
      <HabitsProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="auth" element={<AuthForm />} />
              <Route
                path="dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="dashboard/sleep"
                element={
                  <ProtectedRoute>
                    <SleepTracker />
                  </ProtectedRoute>
                }
              />
              <Route
                path="dashboard/water"
                element={
                  <ProtectedRoute>
                    <WaterTracker />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Router>
      </HabitsProvider>
    </AuthProvider>
  );
}

export default App;
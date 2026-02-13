import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import Dashboard from './pages/Dashboard';
import DadLedgerPage from './pages/DadLedgerPage';
import ExpensesPage from './pages/ExpensesPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { StoreProvider } from './context/Store';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PageTransition from './components/PageTransition';

const AppContent = () => {
  const location = useLocation();
  const { user } = useAuth();

  // Redirect to dashboard if already logged in and trying to access auth pages
  if (user && (location.pathname === '/login' || location.pathname === '/signup')) {
    return <Navigate to="/" replace />;
  }

  // Auth pages don't show sidebar
  if (location.pathname === '/login' || location.pathname === '/signup') {
    return (
      <AnimatePresence mode='wait'>
        <Routes location={location} key={location.pathname}>
          <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
          <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
        <Sidebar />
        <BottomNav />
        <div className="flex-1 w-full lg:ml-64 pb-24 lg:pb-0 transition-all duration-300">
          <AnimatePresence mode='wait'>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<PageTransition><Dashboard /></PageTransition>} />
              <Route path="/dad-ledger" element={<PageTransition><DadLedgerPage /></PageTransition>} />
              <Route path="/expenses" element={<PageTransition><ExpensesPage /></PageTransition>} />
            </Routes>
          </AnimatePresence>
        </div>
      </div>
    </ProtectedRoute>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StoreProvider>
          <Router>
            <AppContent />
          </Router>
        </StoreProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;


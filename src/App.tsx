import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import FriendsPage from './components/FriendsPage';
import WalletPage from './components/WalletPage';
import AboutPage from './components/AboutPage';
import BottomNav from './components/BottomNav';

function ProtectedApp() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');
  const navigate = useNavigate();

  useEffect(() => {
    console.log('App - User state:', user?.email, 'Loading:', loading);
    if (!loading && !user) {
      navigate('/', { replace: true });
    }
    if (user && window.location.hash) {
      console.log('Cleaning up URL hash after successful auth');
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'friends':
        return <FriendsPage />;
      case 'about':
        return <AboutPage />;
      case 'wallet':
        return <WalletPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {renderPage()}
      <BottomNav currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  );
}

function PublicRoute() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/app', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return <LoginPage />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicRoute />} />
        <Route path="/app" element={<ProtectedApp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

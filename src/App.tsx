import { useState } from 'react';
import HomePage from './components/HomePage';
import FriendsPage from './components/FriendsPage';
import WalletPage from './components/WalletPage';
import AboutPage from './components/AboutPage';
import BottomNav from './components/BottomNav';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

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

export default App;

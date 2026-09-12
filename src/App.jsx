import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MarketplaceProvider } from './context/MarketplaceContext';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import LandingWalletScreen from './screens/LandingWalletScreen';
import SiweSigningScreen from './screens/SiweSigningScreen';
import ErrorMatrixScreen from './screens/ErrorMatrixScreen';
import SellerDashboardScreen from './screens/SellerDashboardScreen';
import SecurityAuditScreen from './screens/SecurityAuditScreen';
import CatalogScreen from './screens/CatalogScreen';

function MainApp() {
  const [currentScreen, setCurrentScreen] = useState('screen1');
  const { isAuthenticated } = useAuth();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'screen1':
        return <LandingWalletScreen onNavigate={setCurrentScreen} />;
      case 'screen2':
        return <SiweSigningScreen onNavigate={setCurrentScreen} />;
      case 'screen3':
        return <ErrorMatrixScreen onNavigate={setCurrentScreen} />;
      case 'screen4':
        return <SellerDashboardScreen onNavigate={setCurrentScreen} />;
      case 'screen5':
        return <SecurityAuditScreen onNavigate={setCurrentScreen} />;
      case 'catalog':
        return <CatalogScreen onNavigate={setCurrentScreen} />;
      default:
        return <LandingWalletScreen onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col text-on-surface">
      <Navbar currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
      <div className="flex-1">
        {renderScreen()}
      </div>
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MarketplaceProvider>
        <MainApp />
      </MarketplaceProvider>
    </AuthProvider>
  );
}

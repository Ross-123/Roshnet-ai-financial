import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { StockDetail } from './pages/StockDetail';
import { Login } from './pages/Login';
import { Stock } from './types';

const AuthenticatedApp: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

  if (!user) {
    return <Login />;
  }

  const handleStockSelect = (stock: Stock) => {
    setSelectedStock(stock);
    setCurrentView('detail');
  };

  const handleBackToDashboard = () => {
    setSelectedStock(null);
    setCurrentView('dashboard');
  };

  const renderContent = () => {
    if (currentView === 'detail' && selectedStock) {
      return <StockDetail stock={selectedStock} onBack={handleBackToDashboard} />;
    }
    
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onSelectStock={handleStockSelect} />;
      case 'market':
      case 'search':
      case 'portfolio':
      case 'alerts':
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
            <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
            <p>This module is currently under development.</p>
          </div>
        );
      default:
        return <Dashboard onSelectStock={handleStockSelect} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar currentView={currentView} onChangeView={(view) => {
        if (view === 'dashboard') {
          handleBackToDashboard();
        } else {
          setCurrentView(view);
        }
      }} />
      <main className="flex-1 ml-64 p-8">
        {renderContent()}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
};

export default App;

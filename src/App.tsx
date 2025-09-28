import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { AgentDashboard } from './components/AgentDashboard';
import { ClientProfile } from './components/ClientProfile';
import { AgentPerformance } from './components/AgentPerformance';
import { ExpiryTracker } from './components/ExpiryTracker';
import { CollectionTracker } from './components/CollectionTracker';
import { BankFiles } from './components/BankFiles';
import { AgentDetails } from './components/AgentDetails';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { Notifications } from './components/Notifications';
import { Login } from './components/Login';
import { AuthProvider, useAuth, useIsAdmin } from './contexts/AuthContext';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('');
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const { isAuthenticated, isLoading, user } = useAuth();
  const isAdmin = useIsAdmin();

  // Set default page based on user role
  useEffect(() => {
    if (isAuthenticated && !currentPage) {
      setCurrentPage(isAdmin ? 'dashboard' : 'agent-dashboard');
    }
  }, [isAuthenticated, isAdmin, currentPage]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 mx-auto">
            <span className="text-white font-bold text-xl">BR</span>
          </div>
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  const handleSearch = (query: string) => {
    // In a real app, this would search the database
    // For demo purposes, we'll show a client profile for any search
    console.log('Searching for:', query);
    setSearchResult(query);
    setCurrentPage('client-profile');
  };

  const handleBackToDashboard = () => {
    setSearchResult(null);
    setCurrentPage('dashboard');
  };

  const renderCurrentPage = () => {
    if (searchResult && currentPage === 'client-profile') {
      return <ClientProfile clientId={searchResult} onBack={handleBackToDashboard} />;
    }

    // Admin pages
    if (isAdmin) {
      switch (currentPage) {
        case 'dashboard':
          return <Dashboard />;
        case 'agent-performance':
          return <AgentPerformance />;
        case 'expiry-tracker':
          return <ExpiryTracker />;
        case 'collection-tracker':
          return <CollectionTracker />;
        case 'bank-files':
          return <BankFiles />;
        case 'agent-details':
          return <AgentDetails />;
        case 'reports':
          return <Reports />;
        case 'notifications':
          return <Notifications />;
        case 'settings':
          return <Settings />;
        default:
          return <Dashboard />;
      }
    }
    
    // Agent pages
    switch (currentPage) {
      case 'agent-dashboard':
        return <AgentDashboard />;
      case 'my-files':
        return <BankFiles />; // Filtered for agent's assigned banks
      case 'my-collections':
        return <CollectionTracker />; // Filtered for agent's files
      case 'my-performance':
        return <AgentPerformance />; // Agent's own performance only
      case 'notifications':
        return <Notifications />;
      case 'settings':
        return <Settings />;
      default:
        return <AgentDashboard />;
    }
  };

  return (
    <Layout 
      currentPage={currentPage} 
      onPageChange={setCurrentPage}
      onSearch={handleSearch}
    >
      {renderCurrentPage()}
    </Layout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
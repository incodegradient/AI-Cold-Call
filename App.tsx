
import React, { useState, createContext, useContext, useMemo } from 'react';
import { Page, User } from './types';
import LandingScreen from './screens/LandingScreen';
import AuthScreen from './screens/AuthScreen';
import Layout from './components/Layout';
import DashboardScreen from './screens/DashboardScreen';
import ConnectionsScreen from './screens/ConnectionsScreen';
import AgentsScreen from './screens/AgentsScreen';
import LeadsScreen from './screens/LeadsScreen';
import CampaignsScreen from './screens/CampaignsScreen';
import ReportsScreen from './screens/ReportsScreen';
import SettingsScreen from './screens/SettingsScreen';

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

// Fix: Create AuthContext to be provided to the app
const AuthContext = createContext<AuthContextType | null>(null);

// Fix: Export useAuth hook for child components to consume auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>(Page.Landing);

  const login = (userData: User) => {
    setUser(userData);
    setCurrentPage(Page.Dashboard);
  };

  const logout = () => {
    setUser(null);
    setCurrentPage(Page.Landing);
  };

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  const authContextValue = useMemo(() => ({ user, login, logout }), [user]);

  const renderContent = () => {
    if (!user) {
      switch (currentPage) {
        case Page.Login:
          return <AuthScreen isLogin={true} onSwitch={() => handleNavigate(Page.Signup)} onNavigate={handleNavigate} />;
        case Page.Signup:
          return <AuthScreen isLogin={false} onSwitch={() => handleNavigate(Page.Login)} onNavigate={handleNavigate} />;
        case Page.Landing:
        default:
          return <LandingScreen onNavigate={handleNavigate} />;
      }
    }

    // Authenticated user content
    let screenContent: React.ReactNode;
    switch (currentPage) {
        case Page.Dashboard:
            screenContent = <DashboardScreen />;
            break;
        case Page.Connections:
            screenContent = <ConnectionsScreen />;
            break;
        case Page.Agents:
            screenContent = <AgentsScreen />;
            break;
        case Page.Leads:
            screenContent = <LeadsScreen />;
            break;
        case Page.Campaigns:
            screenContent = <CampaignsScreen />;
            break;
        case Page.Reports:
            screenContent = <ReportsScreen />;
            break;
        case Page.Settings:
            screenContent = <SettingsScreen />;
            break;
        default:
            screenContent = <DashboardScreen />;
    }
    
    return <Layout onNavigate={handleNavigate}>{screenContent}</Layout>;
  };
  
  return (
    <AuthContext.Provider value={authContextValue}>
      {renderContent()}
    </AuthContext.Provider>
  );
};

export default App;

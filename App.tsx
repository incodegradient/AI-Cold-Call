// FIX: Implemented full App component with context providers and routing logic.

import React, { useState, createContext, useContext, useMemo } from 'react';
import { Page, User, Connection, Agent, Campaign, Lead } from './types';
import { mockUsers, mockConnections, mockAgents, mockCampaigns, mockLeads } from './mockData';

import Layout from './components/Layout';
import LandingScreen from './screens/LandingScreen';
import AuthScreen from './screens/AuthScreen';
import DashboardScreen from './screens/DashboardScreen';
import ConnectionsScreen from './screens/ConnectionsScreen';
import AgentsScreen from './screens/AgentsScreen';
import LeadsScreen from './screens/LeadsScreen';
import CampaignsScreen from './screens/CampaignsScreen';
import ReportsScreen from './screens/ReportsScreen';
import SettingsScreen from './screens/SettingsScreen';


// Auth Context
interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Data Context
interface DataContextType {
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    connections: Connection[];
    setConnections: React.Dispatch<React.SetStateAction<Connection[]>>;
    agents: Agent[];
    setAgents: React.Dispatch<React.SetStateAction<Agent[]>>;
    campaigns: Campaign[];
    setCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>>;
    leads: Lead[];
    setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
}

const DataContext = createContext<DataContextType | null>(null);
export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}

// App Component
const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>(Page.Landing);
  const [isLoginView, setIsLoginView] = useState(true);

  // Data states
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [connections, setConnections] = useState<Connection[]>(mockConnections);
  const [agents, setAgents] = useState<Agent[]>(mockAgents);
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [leads, setLeads] = useState<Lead[]>(mockLeads);

  const authContextValue = useMemo(() => ({
    user,
    login: (loggedInUser: User) => {
      setUser(loggedInUser);
      setCurrentPage(Page.Dashboard);
    },
    logout: () => {
      setUser(null);
      setCurrentPage(Page.Landing);
    },
    updateUser: (updatedUser: User) => {
        setUser(updatedUser);
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    }
  }), [user]);

  const dataContextValue = useMemo(() => ({
    users, setUsers,
    connections, setConnections,
    agents, setAgents,
    campaigns, setCampaigns,
    leads, setLeads
  }), [users, connections, agents, campaigns, leads]);

  const handleNavigate = (page: Page) => {
    if (page === Page.Login) {
        setIsLoginView(true);
        setCurrentPage(Page.Login);
    } else if (page === Page.Signup) {
        setIsLoginView(false);
        setCurrentPage(Page.Signup);
    } else {
        setCurrentPage(page);
    }
  };

  const renderPage = () => {
    if (!user) {
        switch (currentPage) {
            case Page.Login:
            case Page.Signup:
                return <AuthScreen isLogin={isLoginView} onSwitch={() => handleNavigate(isLoginView ? Page.Signup : Page.Login)} onNavigate={handleNavigate} />;
            case Page.Landing:
            default:
                return <LandingScreen onNavigate={handleNavigate} />;
        }
    }

    const pages: Record<Page, React.ReactNode> = {
      [Page.Dashboard]: <DashboardScreen />,
      [Page.Connections]: <ConnectionsScreen />,
      [Page.Agents]: <AgentsScreen />,
      [Page.Leads]: <LeadsScreen />,
      [Page.Campaigns]: <CampaignsScreen />,
      [Page.Reports]: <ReportsScreen />,
      [Page.Settings]: <SettingsScreen />,
      // These are handled by the !user block
      [Page.Landing]: null,
      [Page.Login]: null,
      [Page.Signup]: null,
    };
    
    return (
        <Layout onNavigate={handleNavigate} currentPage={currentPage}>
            {pages[currentPage]}
        </Layout>
    );
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      <DataContext.Provider value={dataContextValue}>
        {renderPage()}
      </DataContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;

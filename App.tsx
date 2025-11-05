import React, { useState, createContext, useContext, useMemo, useEffect } from 'react';
import { Page, User, Role, Connection, Agent, Lead, Campaign, LeadGroup } from './types';
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
import { mockConnections, mockAgents, mockLeads, mockCampaigns, mockUsers, mockLeadGroups } from './mockData';

// --- Helper for localStorage ---
function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue: React.Dispatch<React.SetStateAction<T>> = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}


// --- Auth Context ---
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

// --- Data Context ---
interface DataContextType {
    connections: Connection[];
    setConnections: React.Dispatch<React.SetStateAction<Connection[]>>;
    agents: Agent[];
    setAgents: React.Dispatch<React.SetStateAction<Agent[]>>;
    leads: Lead[];
    setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
    leadGroups: LeadGroup[];
    setLeadGroups: React.Dispatch<React.SetStateAction<LeadGroup[]>>;
    campaigns: Campaign[];
    setCampaigns: React.Dispatch<React.SetStateAction<Campaign[]>>;
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const DataContext = createContext<DataContextType | null>(null);

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}


const App: React.FC = () => {
  const [user, setUser] = useLocalStorage<User | null>('aether-user', null);
  const [currentPage, setCurrentPage] = useState<Page>(user ? Page.Dashboard : Page.Landing);
  
  // App-wide data state
  const [connections, setConnections] = useLocalStorage<Connection[]>('aether-connections', mockConnections);
  const [agents, setAgents] = useLocalStorage<Agent[]>('aether-agents', mockAgents);
  const [leads, setLeads] = useLocalStorage<Lead[]>('aether-leads', mockLeads);
  const [leadGroups, setLeadGroups] = useLocalStorage<LeadGroup[]>('aether-leadgroups', mockLeadGroups);
  const [campaigns, setCampaigns] = useLocalStorage<Campaign[]>('aether-campaigns', mockCampaigns);
  const [users, setUsers] = useLocalStorage<User[]>('aether-users', mockUsers);


  const login = (userData: User) => {
    setUser(userData);
    setCurrentPage(Page.Dashboard);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aether-user');
    setCurrentPage(Page.Landing);
  };
  
  const updateUser = (updatedUserData: User) => {
    setUser(updatedUserData);
    setUsers(prevUsers => prevUsers.map(u => u.id === updatedUserData.id ? updatedUserData : u));
  }

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  const authContextValue = useMemo(() => ({ user, login, logout, updateUser }), [user]);
  const dataContextValue = useMemo(() => ({ connections, setConnections, agents, setAgents, leads, setLeads, leadGroups, setLeadGroups, campaigns, setCampaigns, users, setUsers }), [connections, agents, leads, leadGroups, campaigns, users]);


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
            setCurrentPage(Page.Dashboard); // Fallback to dashboard
            screenContent = <DashboardScreen />;
    }
    
    return <Layout onNavigate={handleNavigate} currentPage={currentPage}>{screenContent}</Layout>;
  };
  
  return (
    <AuthContext.Provider value={authContextValue}>
        <DataContext.Provider value={dataContextValue}>
            {renderContent()}
        </DataContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;

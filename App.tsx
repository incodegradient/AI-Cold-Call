import React, { useState, createContext, useContext, useEffect, useMemo } from 'react';
import { Page, User, Connection, Agent, Lead, Campaign, LeadGroup } from './types';
import * as api from './apiService';

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
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType>(null!);
export const useAuth = () => useContext(AuthContext);

// Data Context
interface DataContextType {
    connections: Connection[];
    agents: Agent[];
    leads: Lead[];
    campaigns: Campaign[];
    leadGroups: LeadGroup[];
    users: User[];
    loading: boolean;
    refreshData: () => void;
}
const DataContext = createContext<DataContextType>(null!);
export const useData = () => useContext(DataContext);

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>(Page.Landing);
  const [loading, setLoading] = useState(true);

  // Data State
  const [connections, setConnections] = useState<Connection[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [leadGroups, setLeadGroups] = useState<LeadGroup[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
        const [connectionsData, agentsData, leadsData, campaignsData, leadGroupsData, usersData] = await Promise.all([
            api.getConnections(),
            api.getAgents(),
            api.getLeads(),
            api.getCampaigns(),
            api.getLeadGroups(),
            api.getUsers(),
        ]);
        setConnections(connectionsData);
        setAgents(agentsData);
        setLeads(leadsData);
        setCampaigns(campaignsData);
        setLeadGroups(leadGroupsData);
        setUsers(usersData);
    } catch (error) {
        console.error("Failed to fetch data:", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
        fetchData();
    }
  }, [user]);

  const login = async (email: string, pass: string) => {
    const loggedInUser = await api.login(email, pass);
    if (loggedInUser) {
        setUser(loggedInUser);
        setCurrentPage(Page.Dashboard);
    } else {
        throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
    setCurrentPage(Page.Landing);
  };

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  const authContextValue = useMemo(() => ({ user, login, logout }), [user]);
  const dataContextValue = useMemo(() => ({
    connections,
    agents,
    leads,
    campaigns,
    leadGroups,
    users,
    loading,
    refreshData: fetchData,
  }), [connections, agents, leads, campaigns, leadGroups, users, loading]);

  const renderPage = () => {
    if (!user) {
      switch (currentPage) {
        case Page.Login:
        case Page.Signup:
          return <AuthScreen page={currentPage} onNavigate={handleNavigate} />;
        default:
          return <LandingScreen onNavigate={handleNavigate} />;
      }
    }

    const pageMap: Record<Page, React.ReactNode> = {
      [Page.Dashboard]: <DashboardScreen />,
      [Page.Connections]: <ConnectionsScreen />,
      [Page.Agents]: <AgentsScreen />,
      [Page.Leads]: <LeadsScreen />,
      [Page.Campaigns]: <CampaignsScreen />,
      [Page.Reports]: <ReportsScreen />,
      [Page.Settings]: <SettingsScreen />,
      // Fallbacks for auth pages if somehow accessed while logged in
      [Page.Landing]: <DashboardScreen />,
      [Page.Login]: <DashboardScreen />,
      [Page.Signup]: <DashboardScreen />,
    };

    return (
        <Layout onNavigate={handleNavigate} currentPage={currentPage}>
            {loading ? <div className="text-center p-8">Loading...</div> : pageMap[currentPage]}
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

import { mockConnections, mockAgents, mockLeads, mockCampaigns, mockUsers, mockLeadGroups } from './mockData';
import { User, Connection, Agent, Lead, Campaign, LeadGroup } from './types';

// Simulate API latency
const apiCall = <T>(data: T, delay = 300): Promise<T> => 
    new Promise(resolve => setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), delay));

export const login = (email: string, password: string): Promise<User | null> => {
    // In a real app, you'd verify the password
    const user = mockUsers.find(u => u.email === email);
    if (user) {
        return apiCall(user);
    }
    return apiCall(null);
};

export const getConnections = (): Promise<Connection[]> => apiCall(mockConnections);
export const updateConnection = (connection: Connection): Promise<Connection> => {
    const index = mockConnections.findIndex(c => c.id === connection.id);
    if (index !== -1) {
        mockConnections[index] = connection;
        return apiCall(connection);
    }
    return Promise.reject('Connection not found');
};

export const getAgents = (): Promise<Agent[]> => apiCall(mockAgents);
export const updateAgent = (agent: Agent): Promise<Agent> => {
    const index = mockAgents.findIndex(a => a.id === agent.id);
    if (index !== -1) {
        mockAgents[index] = agent;
        return apiCall(agent);
    }
    return Promise.reject('Agent not found');
}
export const createAgent = (agent: Omit<Agent, 'id'>): Promise<Agent> => {
    const newAgent: Agent = { ...agent, id: String(Date.now()) };
    mockAgents.push(newAgent);
    return apiCall(newAgent);
};

export const getLeads = (): Promise<Lead[]> => apiCall(mockLeads);
export const getLeadGroups = (): Promise<LeadGroup[]> => apiCall(mockLeadGroups);
export const createLead = (lead: Omit<Lead, 'id'>): Promise<Lead> => {
    const newLead: Lead = { ...lead, id: String(Date.now()) };
    mockLeads.push(newLead);
    return apiCall(newLead);
}


export const getCampaigns = (): Promise<Campaign[]> => apiCall(mockCampaigns);
export const createCampaign = (campaign: Omit<Campaign, 'id'>): Promise<Campaign> => {
    const newCampaign: Campaign = { ...campaign, id: String(Date.now()) };
    mockCampaigns.push(newCampaign);
    return apiCall(newCampaign);
}
export const updateCampaign = (campaign: Campaign): Promise<Campaign> => {
    const index = mockCampaigns.findIndex(c => c.id === campaign.id);
    if (index !== -1) {
        mockCampaigns[index] = campaign;
        return apiCall(campaign);
    }
    return Promise.reject('Campaign not found');
};

export const getUsers = (): Promise<User[]> => apiCall(mockUsers);

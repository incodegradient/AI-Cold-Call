// FIX: Implemented mock data to be used by the application.

import { User, Role, Connection, ConnectionProvider, Agent, AgentPlatform, Campaign, Lead } from './types';

export const mockUsers: User[] = [
    { id: '1', name: 'Demo User', email: 'owner@aetherdial.com', role: Role.Owner },
    { id: '2', name: 'Jane Smith', email: 'admin@aetherdial.com', role: Role.Admin },
    { id: '3', name: 'John Doe', email: 'member@aetherdial.com', role: Role.Member },
];

export const mockConnections: Connection[] = [
    { id: '1', provider: ConnectionProvider.CalCom, isConnected: false },
    { id: '2', provider: ConnectionProvider.Gmail, isConnected: true, clientId: 'mock-client-id' },
    { id: '3', provider: ConnectionProvider.Twilio, isConnected: false },
    { id: '4', provider: ConnectionProvider.Vapi, isConnected: true, apiKey: 'mock-api-key' },
    { id: '5', provider: ConnectionProvider.RetellAI, isConnected: false },
    { id: '6', provider: ConnectionProvider.OpenAI, isConnected: true, apiKey: 'mock-api-key' },
];

export const mockAgents: Agent[] = [
    { id: '1', name: 'Appointment Setter AI', platform: AgentPlatform.Vapi, isActive: true, providerAgentId: 'vapi-123', calls: 1250, avgDuration: 2, bookingRate: 15 },
    { id: '2', name: 'Lead Qualifier Bot', platform: AgentPlatform.Retell, isActive: true, providerAgentId: 'retell-456', calls: 800, avgDuration: 1.5, bookingRate: 22 },
    { id: '3', name: 'Customer Follow-up', platform: AgentPlatform.Vapi, isActive: false, providerAgentId: 'vapi-789', calls: 300, avgDuration: 3, bookingRate: 8 },
];

export const mockCampaigns: Campaign[] = [
    { id: '1', name: 'Q4 SaaS Demo Drive', status: 'Active', agentId: '1', stats: { totalLeads: 500, attempted: 350, connected: 150, bookings: 22 } },
    { id: '2', name: 'Real Estate Warm Leads', status: 'Active', agentId: '2', stats: { totalLeads: 200, attempted: 180, connected: 90, bookings: 20 } },
    { id: '3', name: 'Past Customer Reactivation', status: 'Paused', agentId: '1', stats: { totalLeads: 1000, attempted: 200, connected: 80, bookings: 5 } },
    { id: '4', name: 'E-commerce Cart Abandonment', status: 'Completed', agentId: '3', stats: { totalLeads: 300, attempted: 300, connected: 120, bookings: 12 } },
];

export const mockLeads: Lead[] = [
    { id: '1', name: 'Alex Johnson', phone: '(555) 123-4567', status: 'Booked', lastAttempt: '2024-07-29', campaign: 'Q4 SaaS Demo Drive' },
    { id: '2', name: 'Samantha Miller', phone: '(555) 987-6543', status: 'Attempted', lastAttempt: '2024-07-29', campaign: 'Q4 SaaS Demo Drive' },
    { id: '3', name: 'David Chen', phone: '(555) 555-1212', status: 'New', lastAttempt: null, campaign: 'Real Estate Warm Leads' },
    { id: '4', name: 'Maria Garcia', phone: '(555) 222-3333', status: 'Connected', lastAttempt: '2024-07-28', campaign: 'Real Estate Warm Leads' },
    { id: '5', name: 'James Wilson', phone: '(555) 867-5309', status: 'DNC', lastAttempt: null, campaign: 'Past Customer Reactivation' },
];

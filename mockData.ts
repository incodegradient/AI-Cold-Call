import { Connection, ConnectionProvider, Agent, AgentPlatform, Lead, LeadStatus, Campaign, User, Role, LeadGroup } from './types';

export const mockConnections: Connection[] = [
    { id: '1', provider: ConnectionProvider.Vapi, isConnected: false, apiKey: '' },
    { id: '2', provider: ConnectionProvider.RetellAI, isConnected: false, apiKey: '' },
    { id: '3', provider: ConnectionProvider.Twilio, isConnected: false, accountSid: '', authToken: '', phoneNumber: '' },
    { id: '4', provider: ConnectionProvider.CalCom, isConnected: false, apiKey: '', eventType: '' },
    { id: '5', provider: ConnectionProvider.OpenAI, isConnected: false, apiKey: '' },
    { id: '6', provider: ConnectionProvider.Gmail, isConnected: false, clientId: '', clientSecret: '' },
];

export const mockAgents: Agent[] = [
    { id: '1', name: 'Sales Development Rep', platform: AgentPlatform.Vapi, isActive: true, providerAgentId: 'a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8', calls: 124, avgDuration: 1.8, bookingRate: 8.1 },
    { id: '2', name: 'Customer Support Bot', platform: AgentPlatform.Retell, isActive: true, providerAgentId: 'b2c3d4e5-f6g7-8901-h2i3-j4k5l6m7n8o9', calls: 312, avgDuration: 3.2, bookingRate: 4.5 },
    { id: '3', name: 'Appointment Setter', platform: AgentPlatform.Vapi, isActive: false, providerAgentId: 'c3d4e5f6-g7h8-9012-i3j4-k5l6m7n8o9p0', calls: 56, avgDuration: 1.5, bookingRate: 12.3 },
    { id: '4', name: 'Lead Qualifier', platform: AgentPlatform.Retell, isActive: true, providerAgentId: 'd4e5f6g7-h8i9-0123-j4k5-l6m7n8o9p0q1', calls: 88, avgDuration: 2.1, bookingRate: 6.7 },
];

export const mockLeadGroups: LeadGroup[] = [
    { id: 'group1', name: 'Hot Leads' },
    { id: 'group2', name: 'Website Signups' },
    { id: 'group3', name: 'Q4 Prospects' },
];

export const mockLeads: Lead[] = [
  { id: '1', name: 'John Doe', phone: '(555) 123-4567', email: 'john.d@example.com', city: 'New York', where: 'Website', industries: ['SaaS'], status: LeadStatus.Called, groupIds: ['group2', 'group3'] },
  { id: '2', name: 'Jane Smith', phone: '(555) 987-6543', email: 'jane.s@example.com', city: 'San Francisco', where: 'Referral', industries: ['E-commerce'], status: LeadStatus.Scheduled, groupIds: ['group1'] },
  { id: '3', name: 'Acme Corp', phone: '(555) 555-5555', email: 'contact@acme.com', city: 'Chicago', where: 'LinkedIn', industries: ['Manufacturing'], status: LeadStatus.New, groupIds: ['group3'] },
  { id: '4', name: 'Innovate LLC', phone: '(555) 111-2222', email: 'info@innovate.com', city: 'Austin', where: 'AdWords', industries: ['Tech', 'AI'], status: LeadStatus.Queued, groupIds: [] },
  { id: '5', name: 'Peter Jones', phone: '(555) 333-4444', email: 'peter.j@example.com', city: 'Miami', where: 'Website', industries: ['Real Estate'], status: LeadStatus.DoNotCall, groupIds: ['group2'] },
];


export const mockCampaigns: Campaign[] = [
  { id: '1', name: 'Summer Sales Push', platform: AgentPlatform.Vapi, agentId: '1', target: { groupIds: ['group1'], individualLeadIds: ['3'] }, status: 'Active', schedule: { start: '09:00', end: '17:00', weekdays: [1,2,3,4,5] }, pacing: { gapMinutes: 5, maxConcurrent: 10 }, stats: { totalLeads: 2, attempted: 1, connected: 1, avgTalkTime: 2.1, bookings: 1 } },
  { id: '2', name: 'Q4 Lead Gen', platform: AgentPlatform.Retell, agentId: '2', target: { groupIds: ['group3'], individualLeadIds: [] }, status: 'Paused', schedule: { start: '10:00', end: '16:00', weekdays: [1,2,3] }, pacing: { gapMinutes: 10, maxConcurrent: 5 }, stats: { totalLeads: 2, attempted: 1, connected: 1, avgTalkTime: 1.8, bookings: 0 } },
  { id: '3', name: 'New Feature Outreach', platform: AgentPlatform.Vapi, agentId: '3', target: { groupIds: ['group2'], individualLeadIds: [] }, status: 'Completed', schedule: { start: '09:00', end: '17:00', weekdays: [1,2,3,4,5] }, pacing: { gapMinutes: 3, maxConcurrent: 15 }, stats: { totalLeads: 3, attempted: 3, connected: 2, avgTalkTime: 2.5, bookings: 1 } },
  { id: '4', name: 'Website Visitor Follow-up', platform: AgentPlatform.Vapi, agentId: '1', target: { groupIds: ['group2'], individualLeadIds: ['4'] }, status: 'Draft', schedule: { start: '09:00', end: '17:00', weekdays: [1,2,3,4,5] }, pacing: { gapMinutes: 5, maxConcurrent: 10 }, stats: { totalLeads: 4, attempted: 0, connected: 0, avgTalkTime: 0, bookings: 0 } },
];

export const mockUsers: User[] = [
    { id: '1', name: 'Demo User', email: 'owner@example.com', role: Role.Owner },
    { id: '2', name: 'Admin User', email: 'admin@example.com', role: Role.Admin },
    { id: '3', name: 'Member User', email: 'member@example.com', role: Role.Member },
];

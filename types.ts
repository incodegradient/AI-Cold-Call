// FIX: Implemented full type definitions based on usage in other components.

export enum Page {
  Landing = 'LANDING',
  Login = 'LOGIN',
  Signup = 'SIGNUP',
  Dashboard = 'DASHBOARD',
  Connections = 'CONNECTIONS',
  Agents = 'AGENTS',
  Leads = 'LEADS',
  Campaigns = 'CAMPAIGNS',
  Reports = 'REPORTS',
  Settings = 'SETTINGS',
}

export enum Role {
    Owner = 'Owner',
    Admin = 'Admin',
    Member = 'Member',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export enum ConnectionProvider {
    CalCom = 'Cal.com',
    Gmail = 'Gmail',
    Twilio = 'Twilio',
    Vapi = 'Vapi',
    RetellAI = 'Retell AI',
    OpenAI = 'OpenAI',
}

export interface Connection {
    id: string;
    provider: ConnectionProvider;
    isConnected: boolean;
    apiKey?: string;
    eventType?: string;
    clientId?: string;
    clientSecret?: string;
    accountSid?: string;
    authToken?: string;
    phoneNumber?: string;
}

export enum AgentPlatform {
    Vapi = 'Vapi',
    Retell = 'Retell AI',
}

export interface Agent {
    id: string;
    name: string;
    platform: AgentPlatform;
    isActive: boolean;
    providerAgentId: string;
    calls: number;
    avgDuration: number;
    bookingRate: number;
}

export interface CampaignStats {
    totalLeads: number;
    attempted: number;
    connected: number;
    bookings: number;
}

export interface Campaign {
    id: string;
    name: string;
    status: 'Active' | 'Paused' | 'Completed';
    agentId: string;
    stats: CampaignStats;
}

export interface Lead {
    id: string;
    name: string;
    phone: string;
    status: 'New' | 'Attempted' | 'Connected' | 'Booked' | 'DNC';
    lastAttempt: string | null;
    campaign: string;
}

// Fix: Replaced incorrect component logic with the correct type definitions for the application.
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
  Vapi = 'Vapi',
  RetellAI = 'Retell AI',
  Twilio = 'Twilio',
  CalCom = 'Cal.com',
  OpenAI = 'OpenAI',
  Gmail = 'Gmail',
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

export enum LeadStatus {
  New = 'New',
  Queued = 'Queued',
  Called = 'Called',
  Scheduled = 'Scheduled',
  DoNotCall = 'Do Not Call',
  Error = 'Error',
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  where: string; // Source
  industries: string[];
  status: LeadStatus;
  groupIds: string[];
}

export interface LeadGroup {
  id: string;
  name: string;
}

export interface Campaign {
  id: string;
  name: string;
  platform: AgentPlatform;
  agentId: string;
  target: {
    groupIds: string[];
    individualLeadIds: string[];
  };
  status: 'Draft' | 'Active' | 'Paused' | 'Completed';
  schedule: {
    start: string;
    end: string;
    weekdays: number[];
  };
  pacing: {
    gapMinutes: number;
    maxConcurrent: number;
  };
  stats: {
    totalLeads: number;
    attempted: number;
    connected: number;
    avgTalkTime: number;
    bookings: number;
  };
}

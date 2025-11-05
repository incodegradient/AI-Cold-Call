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
  prompt: string;
  voiceId: string;
  calls: number;
  avgDuration: number;
  bookingRate: number;
}

export enum LeadStatus {
  New = 'New',
  Queued = 'Queued',
  Called = 'Called',
  Scheduled = 'Scheduled',
  DoNotCall = 'Do-Not-Call',
  Error = 'Error',
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  where: string;
  industries: string[];
  status: LeadStatus;
}

export interface Campaign {
  id: string;
  name: string;
  platform: AgentPlatform;
  agentId: string;
  leadListId: string;
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

export enum Page {
  Landing,
  Login,
  Signup,
  Dashboard,
  Connections,
  Agents,
  Leads,
  Campaigns,
  Reports,
  Settings
}
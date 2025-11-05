import React from 'react';
import { useData } from '../App';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Campaign, Agent } from '../types';

const StatCard: React.FC<{title: string, value: string, change?: string, changeType?: 'increase' | 'decrease'}> = ({ title, value, change, changeType }) => {
    const isIncrease = changeType === 'increase';
    return (
        <div className="bg-surface border border-border rounded-lg p-5">
            <p className="text-sm text-text-secondary">{title}</p>
            <p className="text-3xl font-bold text-text-primary mt-1">{value}</p>
            {change && changeType && (
                <div className="flex items-center text-sm mt-2">
                    <span className={`flex items-center ${isIncrease ? 'text-green-400' : 'text-red-400'}`}>
                         {isIncrease ? '▲' : '▼'} {change}
                    </span>
                    <span className="text-text-secondary ml-1">vs last week</span>
                </div>
            )}
        </div>
    );
};

const DashboardScreen: React.FC = () => {
  const { campaigns, agents } = useData();

  const totalCalls = campaigns.reduce((acc, c) => acc + c.stats.attempted, 0);
  const totalBookings = campaigns.reduce((acc, c) => acc + c.stats.bookings, 0);
  const totalConnected = campaigns.reduce((acc, c) => acc + c.stats.connected, 0);
  const successRate = totalCalls > 0 ? ((totalBookings / totalCalls) * 100).toFixed(1) + '%' : '0%';

  const weeklyData = [
      { name: 'Mon', calls: 400, bookings: 24 }, { name: 'Tue', calls: 300, bookings: 13 },
      { name: 'Wed', calls: 200, bookings: 98 }, { name: 'Thu', calls: 278, bookings: 39 },
      { name: 'Fri', calls: 189, bookings: 48 }, { name: 'Sat', calls: 239, bookings: 38 },
      { name: 'Sun', calls: 349, bookings: 43 },
  ];
  
  const activeCampaigns = campaigns.filter(c => c.status === 'Active');
  const topAgents = [...agents].sort((a, b) => b.bookingRate - a.bookingRate).slice(0, 3);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-secondary mt-1">Here's a summary of your campaign performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Calls" value={totalCalls.toLocaleString()} />
        <StatCard title="Meetings Booked" value={totalBookings.toLocaleString()} />
        <StatCard title="Success Rate" value={successRate} />
        <StatCard title="Connected Calls" value={totalConnected.toLocaleString()} />
      </div>

      <div className="bg-surface border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-text-primary">Weekly Activity</h2>
        <div className="h-80 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <defs>
                <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#58A6FF" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#58A6FF" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#238636" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#238636" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
              <XAxis dataKey="name" stroke="#8B949E" />
              <YAxis stroke="#8B949E" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#161B22', border: '1px solid #30363D', borderRadius: '0.5rem' }}
                labelStyle={{ color: '#C9D1D9' }}
              />
              <Legend />
              <Area type="monotone" dataKey="calls" name="Calls" stroke="#58A6FF" fillOpacity={1} fill="url(#colorCalls)" />
              <Area type="monotone" dataKey="bookings" name="Bookings" stroke="#238636" fillOpacity={1} fill="url(#colorBookings)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-text-primary">Active Campaigns</h2>
          {activeCampaigns.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {activeCampaigns.map(campaign => (
                <li key={campaign.id} className="flex flex-col">
                  <div className="flex justify-between items-center">
                    <span className="text-text-primary">{campaign.name}</span>
                     <span className="text-text-secondary text-sm">{campaign.stats.totalLeads > 0 ? ((campaign.stats.attempted / campaign.stats.totalLeads) * 100).toFixed(0) : 0}%</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2.5 mt-1.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: `${campaign.stats.totalLeads > 0 ? ((campaign.stats.attempted / campaign.stats.totalLeads) * 100) : 0}%` }}></div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-text-secondary">No active campaigns.</p>
          )}
        </div>
        <div className="bg-surface border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-text-primary">Top Performing Agents</h2>
           {topAgents.length > 0 ? (
            <ul className="mt-4 space-y-4">
              {topAgents.map(agent => (
                <li key={agent.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-9 h-9 rounded-full bg-border flex items-center justify-center font-bold text-primary-hover">
                      {agent.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="ml-3 text-text-primary font-medium">{agent.name}</span>
                  </div>
                  <span className="text-secondary font-semibold">{agent.bookingRate}% Bookings</span>
                </li>
              ))}
            </ul>
           ) : (
            <p className="mt-4 text-text-secondary">No agents available.</p>
           )}
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;

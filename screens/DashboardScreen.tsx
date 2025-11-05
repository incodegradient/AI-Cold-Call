import React from 'react';
import { useData } from '../App';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import {
    PhoneIcon,
    CalendarDaysIcon,
    ChartPieIcon,
    CheckCircleIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    UserGroupIcon,
} from '@heroicons/react/24/outline';

const StatCard: React.FC<{
    title: string;
    value: string;
    icon: React.ElementType;
    change?: string;
    changeType?: 'increase' | 'decrease';
}> = ({ title, value, icon: Icon, change, changeType }) => {
    const isIncrease = changeType === 'increase';
    return (
        <div className="bg-surface border border-border rounded-lg p-5 flex items-center space-x-4">
            <div className="bg-primary/10 rounded-lg p-3">
                <Icon className="w-6 h-6 text-primary" />
            </div>
            <div>
                <p className="text-sm text-text-secondary">{title}</p>
                <p className="text-2xl font-bold text-text-primary mt-1">{value}</p>
            </div>
             {change && changeType && (
                <div className="flex items-center text-sm ml-auto">
                    <span className={`flex items-center font-semibold ${isIncrease ? 'text-green-400' : 'text-red-400'}`}>
                         {isIncrease ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />} 
                         <span className="ml-1">{change}</span>
                    </span>
                </div>
            )}
        </div>
    );
};

const DashboardScreen: React.FC = () => {
  const { campaigns, agents, leads } = useData();

  const totalCalls = campaigns.reduce((acc, c) => acc + c.stats.attempted, 0);
  const totalBookings = campaigns.reduce((acc, c) => acc + c.stats.bookings, 0);
  const totalConnected = campaigns.reduce((acc, c) => acc + c.stats.connected, 0);
  const successRate = totalConnected > 0 ? ((totalBookings / totalConnected) * 100).toFixed(1) + '%' : '0%';

  const weeklyData = [
      { name: 'Mon', calls: 400, bookings: 24 }, { name: 'Tue', calls: 300, bookings: 13 },
      { name: 'Wed', calls: 200, bookings: 98 }, { name: 'Thu', calls: 278, bookings: 39 },
      { name: 'Fri', calls: 189, bookings: 48 }, { name: 'Sat', calls: 239, bookings: 38 },
      { name: 'Sun', calls: 349, bookings: 43 },
  ];
  
  const activeCampaigns = campaigns.filter(c => c.status === 'Active');
  const topAgents = [...agents].sort((a, b) => b.bookingRate - a.bookingRate).slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-secondary mt-1">Here's a summary of your campaign performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Calls" value={totalCalls.toLocaleString()} icon={PhoneIcon} />
        <StatCard title="Meetings Booked" value={totalBookings.toLocaleString()} icon={CalendarDaysIcon} />
        <StatCard title="Success Rate" value={successRate} icon={ChartPieIcon} />
        <StatCard title="Total Leads" value={leads.length.toLocaleString()} icon={UserGroupIcon} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-text-primary">Weekly Activity</h2>
            <p className="text-sm text-text-secondary">Call and booking trends for the last 7 days.</p>
            <div className="h-96 mt-4 pr-4">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <defs>
                    <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#58A6FF" stopOpacity={0.7}/>
                    <stop offset="95%" stopColor="#58A6FF" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#238636" stopOpacity={0.7}/>
                    <stop offset="95%" stopColor="#238636" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
                <XAxis dataKey="name" stroke="#8B949E" fontSize={12} />
                <YAxis stroke="#8B949E" fontSize={12} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#161B22', border: '1px solid #30363D', borderRadius: '0.5rem' }}
                    labelStyle={{ color: '#C9D1D9' }}
                    itemStyle={{ fontWeight: '500' }}
                />
                <Legend wrapperStyle={{ fontSize: '14px' }} />
                <Area type="monotone" dataKey="calls" name="Calls" stroke="#58A6FF" strokeWidth={2} fillOpacity={1} fill="url(#colorCalls)" />
                <Area type="monotone" dataKey="bookings" name="Bookings" stroke="#2EA043" strokeWidth={2} fillOpacity={1} fill="url(#colorBookings)" />
                </AreaChart>
            </ResponsiveContainer>
            </div>
        </div>

        <div className="space-y-6">
            <div className="bg-surface border border-border rounded-lg p-6">
                <h2 className="text-lg font-semibold text-text-primary">Active Campaigns</h2>
                {activeCampaigns.length > 0 ? (
                    <ul className="mt-4 space-y-4">
                    {activeCampaigns.map(campaign => {
                        const agent = agents.find(a => a.id === campaign.agentId);
                        const progress = campaign.stats.totalLeads > 0 ? (campaign.stats.attempted / campaign.stats.totalLeads) * 100 : 0;
                        return (
                        <li key={campaign.id}>
                            <div className="flex justify-between items-center mb-1.5">
                                <p className="text-sm font-medium text-text-primary">{campaign.name}</p>
                                <p className="text-sm text-text-secondary">{Math.round(progress)}%</p>
                            </div>
                            <div className="w-full bg-background rounded-full h-2.5">
                                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                            </div>
                            <div className="flex justify-between items-center mt-2 text-xs text-text-secondary">
                                <span>Agent: {agent?.name || 'N/A'}</span>
                                <span>{campaign.stats.bookings} Booked</span>
                            </div>
                        </li>
                    )})}
                    </ul>
                ) : (
                    <p className="mt-4 text-text-secondary text-sm">No campaigns are currently active.</p>
                )}
            </div>
            <div className="bg-surface border border-border rounded-lg p-6">
                <h2 className="text-lg font-semibold text-text-primary">Top Performing Agents</h2>
                {topAgents.length > 0 ? (
                    <ul className="mt-4 space-y-3">
                    {topAgents.map((agent, index) => (
                        <li key={agent.id} className="flex items-center justify-between p-2 rounded-md hover:bg-border transition-colors">
                            <div className="flex items-center">
                                <span className="text-sm font-bold text-text-secondary w-5">{index + 1}.</span>
                                <div className="w-9 h-9 rounded-full bg-border flex items-center justify-center font-bold text-primary-hover ml-2">
                                    {agent.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-text-primary">{agent.name}</p>
                                    <p className="text-xs text-text-secondary">{agent.platform}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                 <p className="text-sm font-semibold text-secondary">{agent.bookingRate}%</p>
                                 <p className="text-xs text-text-secondary">Booking Rate</p>
                            </div>
                        </li>
                    ))}
                    </ul>
                ) : (
                    <p className="mt-4 text-text-secondary text-sm">No agent data available.</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;

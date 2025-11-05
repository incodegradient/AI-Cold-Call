
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', calls: 40, bookings: 24 },
  { name: 'Tue', calls: 30, bookings: 13 },
  { name: 'Wed', calls: 20, bookings: 48 },
  { name: 'Thu', calls: 27, bookings: 39 },
  { name: 'Fri', calls: 18, bookings: 28 },
  { name: 'Sat', calls: 23, bookings: 38 },
  { name: 'Sun', calls: 34, bookings: 43 },
];

const StatCard: React.FC<{title: string, value: string, change: string, changeType: 'increase' | 'decrease'}> = ({ title, value, change, changeType }) => {
    const isIncrease = changeType === 'increase';
    return (
        <div className="bg-surface border border-border rounded-lg p-5">
            <p className="text-sm text-text-secondary">{title}</p>
            <p className="text-3xl font-bold text-text-primary mt-1">{value}</p>
            <div className="flex items-center text-sm mt-2">
                <span className={`flex items-center ${isIncrease ? 'text-green-400' : 'text-red-400'}`}>
                    {isIncrease ? (
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd"></path></svg>
                    ) : (
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-11.293l3 3a1 1 0 01-1.414 1.414L11 9.414V13a1 1 0 11-2 0V9.414l-1.293 1.293a1 1 0 01-1.414-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                    )}
                    {change}
                </span>
                <span className="text-text-secondary ml-1">vs last week</span>
            </div>
        </div>
    );
};

const DashboardScreen: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-secondary mt-1">Here's a summary of your campaign performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Calls" value="1,287" change="12.5%" changeType="increase" />
        <StatCard title="Meetings Booked" value="94" change="8.2%" changeType="increase" />
        <StatCard title="Success Rate" value="7.3%" change="1.1%" changeType="decrease" />
        <StatCard title="Total Cost" value="$452.30" change="5.7%" changeType="increase" />
      </div>

      <div className="bg-surface border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-text-primary">Weekly Activity</h2>
        <div className="h-80 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
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
                contentStyle={{
                  backgroundColor: '#161B22',
                  border: '1px solid #30363D',
                  borderRadius: '0.5rem'
                }}
                labelStyle={{ color: '#C9D1D9' }}
              />
              <Area type="monotone" dataKey="calls" stroke="#58A6FF" fillOpacity={1} fill="url(#colorCalls)" />
              <Area type="monotone" dataKey="bookings" stroke="#238636" fillOpacity={1} fill="url(#colorBookings)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-text-primary">Active Campaigns</h2>
          <ul className="mt-4 space-y-3">
            {['Summer Sales Push', 'Q4 Lead Gen', 'New Feature Outreach'].map(name => (
              <li key={name} className="flex justify-between items-center">
                <span className="text-text-primary">{name}</span>
                <div className="w-1/2 bg-background rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: `${Math.random() * 80 + 20}%` }}></div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-surface border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold text-text-primary">Top Performing Agents</h2>
          <ul className="mt-4 space-y-4">
            {['Agent Sarah', 'Agent Mike', 'Agent Chloe'].map(name => (
              <li key={name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-9 h-9 rounded-full bg-border flex items-center justify-center font-bold text-primary-hover">
                    {name.split(' ')[1].charAt(0)}
                  </div>
                  <span className="ml-3 text-text-primary font-medium">{name}</span>
                </div>
                <span className="text-secondary font-semibold">{`${(Math.random() * 10 + 5).toFixed(1)}% Bookings`}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;

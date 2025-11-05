import React from 'react';
import { useData } from '../App';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ReportsScreen: React.FC = () => {
    const { campaigns, agents } = useData();

    const campaignPerformanceData = campaigns.map(c => ({
        name: c.name,
        Connected: c.stats.connected,
        Bookings: c.stats.bookings,
        SuccessRate: c.stats.connected > 0 ? parseFloat(((c.stats.bookings / c.stats.connected) * 100).toFixed(2)) : 0,
    }));

    const agentPerformanceData = agents.map(a => ({
        name: a.name,
        Calls: a.calls,
        'Booking Rate': a.bookingRate,
        'Avg Duration (m)': a.avgDuration,
    }));

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-text-primary">Reports</h1>
                <p className="text-text-secondary mt-1">Analyze your campaign performance and generate reports.</p>
            </div>

            <div className="bg-surface border border-border rounded-lg p-6">
                <h2 className="text-lg font-semibold text-text-primary">Campaign Performance</h2>
                <div className="h-96 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={campaignPerformanceData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#30363D" />
                            <XAxis dataKey="name" stroke="#8B949E" angle={-15} textAnchor="end" height={50} />
                            <YAxis stroke="#8B949E" />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#161B22', border: '1px solid #30363D', borderRadius: '0.5rem' }}
                                labelStyle={{ color: '#C9D1D9' }}
                            />
                            <Legend />
                            <Bar dataKey="Connected" fill="#58A6FF" />
                            <Bar dataKey="Bookings" fill="#238636" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Campaign Drill-down */}
                <div className="bg-surface border border-border rounded-lg overflow-hidden">
                    <h2 className="text-lg font-semibold text-text-primary p-6">Campaign Details</h2>
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-background">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Campaign</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Leads</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Attempted</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Connected</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Bookings</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Success %</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {campaigns.map(c => (
                                <tr key={c.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">{c.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{c.stats.totalLeads}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{c.stats.attempted}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{c.stats.connected}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{c.stats.bookings}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-secondary">{c.stats.connected > 0 ? ((c.stats.bookings / c.stats.connected) * 100).toFixed(1) : 0}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Agent Drill-down */}
                 <div className="bg-surface border border-border rounded-lg overflow-hidden">
                    <h2 className="text-lg font-semibold text-text-primary p-6">Agent Performance</h2>
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-background">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Agent</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Platform</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Total Calls</th>
                                <th className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">Avg Duration</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Booking Rate</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                             {agents.map(a => (
                                <tr key={a.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">{a.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{a.platform}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{a.calls}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{a.avgDuration}m</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-secondary">{a.bookingRate}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ReportsScreen;

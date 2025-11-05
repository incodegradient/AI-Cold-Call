
import React from 'react';
import { Agent, AgentPlatform } from '../types';

const mockAgents: Agent[] = [
    { id: '1', name: 'Sales Development Rep', platform: AgentPlatform.Vapi, isActive: true, voiceId: 'sarah-voice', calls: 124, avgDuration: 1.8, bookingRate: 8.1 },
    { id: '2', name: 'Customer Support Bot', platform: AgentPlatform.Retell, isActive: true, voiceId: 'mike-voice', calls: 312, avgDuration: 3.2, bookingRate: 4.5 },
    { id: '3', name: 'Appointment Setter', platform: AgentPlatform.Vapi, isActive: false, voiceId: 'chloe-voice', calls: 56, avgDuration: 1.5, bookingRate: 12.3 },
    { id: '4', name: 'Lead Qualifier', platform: AgentPlatform.Retell, isActive: true, voiceId: 'david-voice', calls: 88, avgDuration: 2.1, bookingRate: 6.7 },
];

const AgentsScreen: React.FC = () => {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">AI Agents</h1>
                    <p className="text-text-secondary mt-1">Create and configure your voice agents.</p>
                </div>
                <button className="bg-primary hover:bg-primary-hover text-white font-semibold py-2 px-4 rounded-lg transition">
                    Create Agent
                </button>
            </div>

            <div className="bg-surface border border-border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-border">
                    <thead className="bg-background">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Agent Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Platform</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Calls Made</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Booking Rate</th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Edit</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {mockAgents.map(agent => (
                            <tr key={agent.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-text-primary">{agent.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-text-secondary">{agent.platform}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${agent.isActive ? 'bg-green-100/10 text-green-400' : 'bg-gray-100/10 text-gray-400'}`}>
                                        {agent.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{agent.calls}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{agent.bookingRate}%</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <a href="#" className="text-primary hover:text-primary-hover">Edit</a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AgentsScreen;

// FIX: Implemented full LeadsScreen component.

import React, { useState } from 'react';
import { useData } from '../App';
import { Lead } from '../types';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const LeadsScreen: React.FC = () => {
    const { leads } = useData();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredLeads = leads.filter(lead => 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm)
    );

    const getStatusColor = (status: Lead['status']) => {
        switch (status) {
            case 'Booked': return 'bg-green-500/20 text-green-400';
            case 'Connected': return 'bg-blue-500/20 text-blue-400';
            case 'Attempted': return 'bg-yellow-500/20 text-yellow-400';
            case 'DNC': return 'bg-red-500/20 text-red-400';
            case 'New':
            default: return 'bg-gray-500/20 text-gray-400';
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Leads</h1>
                    <p className="text-text-secondary mt-1">Manage your contact lists.</p>
                </div>
                <div className="flex space-x-2">
                    <div className="relative">
                        <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                        <input 
                            type="text" 
                            placeholder="Search leads..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-background border border-border rounded-md pl-10 pr-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <button className="bg-primary hover:bg-primary-hover text-white font-semibold py-2 px-4 rounded-lg transition">
                        Import Leads
                    </button>
                </div>
            </div>

            <div className="bg-surface border border-border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-border">
                    <thead className="bg-background">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Phone Number</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Campaign</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Last Attempt</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {filteredLeads.map(lead => (
                            <tr key={lead.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">{lead.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{lead.phone}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                                        {lead.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{lead.campaign}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{lead.lastAttempt || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {filteredLeads.length === 0 && (
                    <div className="text-center py-10">
                        <p className="text-text-secondary">No leads found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeadsScreen;

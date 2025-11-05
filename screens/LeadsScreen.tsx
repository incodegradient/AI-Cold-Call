
import React from 'react';
import { Lead, LeadStatus } from '../types';

const mockLeads: Lead[] = [
  { id: '1', name: 'John Doe', phone: '(555) 123-4567', email: 'john.d@example.com', city: 'New York', where: 'Website', industries: ['SaaS'], status: LeadStatus.Called },
  { id: '2', name: 'Jane Smith', phone: '(555) 987-6543', email: 'jane.s@example.com', city: 'San Francisco', where: 'Referral', industries: ['E-commerce'], status: LeadStatus.Scheduled },
  { id: '3', name: 'Acme Corp', phone: '(555) 555-5555', email: 'contact@acme.com', city: 'Chicago', where: 'LinkedIn', industries: ['Manufacturing'], status: LeadStatus.New },
  { id: '4', name: 'Innovate LLC', phone: '(555) 111-2222', email: 'info@innovate.com', city: 'Austin', where: 'AdWords', industries: ['Tech', 'AI'], status: LeadStatus.Queued },
  { id: '5', name: 'Peter Jones', phone: '(555) 333-4444', email: 'peter.j@example.com', city: 'Miami', where: 'Website', industries: ['Real Estate'], status: LeadStatus.DoNotCall },
];

const statusColors: Record<LeadStatus, string> = {
    [LeadStatus.New]: 'bg-blue-500/20 text-blue-400',
    [LeadStatus.Queued]: 'bg-yellow-500/20 text-yellow-400',
    [LeadStatus.Called]: 'bg-purple-500/20 text-purple-400',
    [LeadStatus.Scheduled]: 'bg-green-500/20 text-green-400',
    [LeadStatus.DoNotCall]: 'bg-gray-500/20 text-gray-400',
    [LeadStatus.Error]: 'bg-red-500/20 text-red-400',
};


const LeadsScreen: React.FC = () => {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Leads</h1>
                    <p className="text-text-secondary mt-1">Manage your lead lists for campaigns.</p>
                </div>
                <div className="space-x-4">
                    <button className="bg-surface hover:bg-border text-text-primary font-semibold py-2 px-4 rounded-lg transition border border-border">
                        Import Leads
                    </button>
                    <button className="bg-primary hover:bg-primary-hover text-white font-semibold py-2 px-4 rounded-lg transition">
                        Add Lead
                    </button>
                </div>
            </div>
            
            <div className="bg-surface border border-border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-border">
                    <thead className="bg-background">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Contact</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Source</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {mockLeads.map(lead => (
                            <tr key={lead.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-text-primary">{lead.name}</div>
                                    <div className="text-sm text-text-secondary">{lead.city}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                     <div className="text-sm text-text-secondary">{lead.phone}</div>
                                     <div className="text-sm text-text-secondary">{lead.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{lead.where}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[lead.status]}`}>
                                        {lead.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <a href="#" className="text-primary hover:text-primary-hover">Details</a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default LeadsScreen;

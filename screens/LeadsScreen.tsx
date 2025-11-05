import React, { useState, useMemo } from 'react';
import { useData } from '../App';
import { Lead, LeadStatus } from '../types';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import * as api from '../apiService';

const statusColors: Record<LeadStatus, string> = {
    [LeadStatus.New]: 'bg-blue-500/20 text-blue-400',
    [LeadStatus.Queued]: 'bg-yellow-500/20 text-yellow-400',
    [LeadStatus.Called]: 'bg-purple-500/20 text-purple-400',
    [LeadStatus.Scheduled]: 'bg-green-500/20 text-green-400',
    [LeadStatus.DoNotCall]: 'bg-gray-500/20 text-gray-400',
    [LeadStatus.Error]: 'bg-red-500/20 text-red-400',
};

const LeadForm: React.FC<{onSave: (lead: Omit<Lead, 'id'>) => void, onCancel: () => void}> = ({onSave, onCancel}) => {
    const [formData, setFormData] = useState<Partial<Omit<Lead, 'id'>>>({status: LeadStatus.New});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as Omit<Lead, 'id'>);
    }
    
    return (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onCancel}>
            <div className="bg-surface rounded-lg shadow-xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold mb-4">Add New Lead</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input name="name" onChange={handleChange} placeholder="Full Name" required className="bg-background border border-border rounded-md p-2"/>
                        <input name="phone" onChange={handleChange} placeholder="Phone Number" required className="bg-background border border-border rounded-md p-2"/>
                        <input name="email" type="email" onChange={handleChange} placeholder="Email Address" className="bg-background border border-border rounded-md p-2 col-span-2"/>
                        <input name="city" onChange={handleChange} placeholder="City" className="bg-background border border-border rounded-md p-2"/>
                        <input name="where" onChange={handleChange} placeholder="Source (e.g. Website)" className="bg-background border border-border rounded-md p-2"/>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onCancel} className="bg-border px-4 py-2 rounded-lg text-sm font-semibold">Cancel</button>
                        <button type="submit" className="bg-primary hover:bg-primary-hover px-4 py-2 rounded-lg text-sm font-semibold text-white">Add Lead</button>
                    </div>
                </form>
            </div>
        </div>
    )
}


const LeadsScreen: React.FC = () => {
    const { leads, refreshData } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
    const [showAddLead, setShowAddLead] = useState(false);

    const filteredLeads = useMemo(() => {
        return leads
            .filter(lead => statusFilter === 'all' || lead.status === statusFilter)
            .filter(lead => 
                lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                lead.phone.toLowerCase().includes(searchTerm.toLowerCase())
            );
    }, [leads, searchTerm, statusFilter]);

    const handleAddLead = async (leadData: Omit<Lead, 'id'>) => {
        const newLeadData = {...leadData, industries: [], groupIds: []}; // Add defaults
        await api.createLead(newLeadData);
        refreshData();
        setShowAddLead(false);
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Leads</h1>
                    <p className="text-text-secondary mt-1">Manage your prospects and contacts.</p>
                </div>
                <button 
                    onClick={() => setShowAddLead(true)}
                    className="bg-primary hover:bg-primary-hover text-white font-semibold py-2 px-4 rounded-lg transition flex items-center"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Add Lead
                </button>
            </div>

            <div className="bg-surface border border-border rounded-lg">
                <div className="p-4 flex items-center space-x-4 border-b border-border">
                    <div className="relative flex-grow">
                        <MagnifyingGlassIcon className="w-5 h-5 absolute top-1/2 left-3 -translate-y-1/2 text-text-secondary" />
                        <input 
                            type="text"
                            placeholder="Search by name, email, or phone..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value as LeadStatus | 'all')}
                        className="bg-background border border-border rounded-lg px-4 py-2"
                    >
                        <option value="all">All Statuses</option>
                        {Object.values(LeadStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-background">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Source</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredLeads.map(lead => (
                                <tr key={lead.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">{lead.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                                        <div>{lead.phone}</div>
                                        <div>{lead.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{lead.where}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[lead.status]}`}>
                                            {lead.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {showAddLead && <LeadForm onSave={handleAddLead} onCancel={() => setShowAddLead(false)} />}
        </div>
    );
};

export default LeadsScreen;

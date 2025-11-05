import React, { useState, useMemo } from 'react';
import { useData } from '../App';
import { Lead, LeadStatus, LeadGroup } from '../types';
import { PencilIcon, TrashIcon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';

const emptyLead: Omit<Lead, 'id'> = {
    name: '', phone: '', email: '', city: '', where: '', industries: [], status: LeadStatus.New, groupIds: [],
};

const LeadModal: React.FC<{ lead: Lead | Omit<Lead, 'id'>, onClose: () => void, onSave: (lead: Lead | Omit<Lead, 'id'>) => void }> = ({ lead, onClose, onSave }) => {
    const { leadGroups, setLeadGroups } = useData();
    const [formData, setFormData] = useState({ ...lead, industries: Array.isArray(lead.industries) ? lead.industries.join(', ') : '' });
    const [newGroupName, setNewGroupName] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleGroupToggle = (groupId: string) => {
        setFormData(prev => {
            const newGroupIds = prev.groupIds.includes(groupId)
                ? prev.groupIds.filter(id => id !== groupId)
                : [...prev.groupIds, groupId];
            return { ...prev, groupIds: newGroupIds };
        });
    };
    
    const handleCreateGroup = () => {
        if (newGroupName.trim() && !leadGroups.some(g => g.name === newGroupName.trim())) {
            const newGroup: LeadGroup = { id: Date.now().toString(), name: newGroupName.trim() };
            setLeadGroups(prev => [...prev, newGroup]);
            setNewGroupName('');
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, industries: formData.industries.split(',').map(s => s.trim()).filter(Boolean) });
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-surface border border-border rounded-lg shadow-xl w-full max-w-2xl p-6 m-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-text-primary">{'id' in lead ? 'Edit' : 'Add'} Lead</h2>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary"><XMarkIcon className="w-6 h-6" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-text-secondary block mb-1.5">Full Name</label>
                            <input name="name" value={formData.name} onChange={handleChange} required className="w-full bg-background border border-border rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-text-secondary block mb-1.5">Phone Number</label>
                            <input name="phone" type="tel" value={formData.phone} onChange={handleChange} required className="w-full bg-background border border-border rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" />
                        </div>
                    </div>
                     <div>
                        <label className="text-sm font-medium text-text-secondary block mb-1.5">Email</label>
                        <input name="email" type="email" value={formData.email} onChange={handleChange} required className="w-full bg-background border border-border rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-text-secondary block mb-1.5">City</label>
                            <input name="city" value={formData.city} onChange={handleChange} className="w-full bg-background border border-border rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-text-secondary block mb-1.5">Source</label>
                            <input name="where" value={formData.where} onChange={handleChange} className="w-full bg-background border border-border rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-text-secondary block mb-1.5">Industries (comma-separated)</label>
                        <input name="industries" value={formData.industries} onChange={handleChange} className="w-full bg-background border border-border rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-text-secondary block mb-1.5">Groups</label>
                        <div className="bg-background border border-border rounded-md p-2 space-y-2">
                             <div className="max-h-32 overflow-y-auto space-y-1">
                                {leadGroups.map(group => (
                                    <label key={group.id} className="flex items-center space-x-2 cursor-pointer p-1 rounded hover:bg-border">
                                        <input type="checkbox" checked={formData.groupIds.includes(group.id)} onChange={() => handleGroupToggle(group.id)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                                        <span>{group.name}</span>
                                    </label>
                                ))}
                            </div>
                            <div className="flex items-center space-x-2 pt-2 border-t border-border">
                                <input value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} placeholder="Create new group..." className="flex-grow bg-surface border border-border rounded-md px-3 py-1.5 text-text-primary text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
                                <button type="button" onClick={handleCreateGroup} className="p-2 bg-primary hover:bg-primary-hover rounded-md text-white"><PlusIcon className="w-4 h-4"/></button>
                            </div>
                        </div>
                    </div>
                     <div>
                        <label className="text-sm font-medium text-text-secondary block mb-1.5">Status</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-background border border-border rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary">
                            {Object.values(LeadStatus).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="bg-surface hover:bg-border text-text-primary font-semibold py-2 px-4 rounded-lg transition border border-border">Cancel</button>
                        <button type="submit" className="bg-primary hover:bg-primary-hover text-white font-semibold py-2 px-4 rounded-lg transition">Save Lead</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AssignGroupModal: React.FC<{ leadIds: string[], onClose: () => void }> = ({ leadIds, onClose }) => {
    const { leads, setLeads, leadGroups } = useData();
    
    // Find common group memberships for the selected leads
    const commonGroupIds = useMemo(() => {
        const selectedLeads = leads.filter(l => leadIds.includes(l.id));
        if (selectedLeads.length === 0) return [];
        return selectedLeads.reduce((acc, lead) => acc.filter(id => lead.groupIds.includes(id)), selectedLeads[0].groupIds);
    }, [leadIds, leads]);

    const [selectedGroupIds, setSelectedGroupIds] = useState<Set<string>>(new Set(commonGroupIds));

    const handleGroupToggle = (groupId: string) => {
        setSelectedGroupIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(groupId)) {
                newSet.delete(groupId);
            } else {
                newSet.add(groupId);
            }
            return newSet;
        });
    };
    
    const handleSave = () => {
        setLeads(currentLeads => currentLeads.map(lead => {
            if (leadIds.includes(lead.id)) {
                return { ...lead, groupIds: Array.from(selectedGroupIds) };
            }
            return lead;
        }));
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-surface border border-border rounded-lg shadow-xl w-full max-w-md p-6">
                 <h2 className="text-xl font-bold text-text-primary mb-4">Assign Groups ({leadIds.length} leads)</h2>
                 <div className="space-y-2 max-h-60 overflow-y-auto">
                    {leadGroups.map(group => (
                        <label key={group.id} className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-border">
                            <input type="checkbox" checked={selectedGroupIds.has(group.id)} onChange={() => handleGroupToggle(group.id)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                            <span>{group.name}</span>
                        </label>
                    ))}
                 </div>
                 <div className="flex justify-end space-x-3 pt-4 mt-4 border-t border-border">
                    <button onClick={onClose} className="bg-surface hover:bg-border text-text-primary font-semibold py-2 px-4 rounded-lg transition border border-border">Cancel</button>
                    <button onClick={handleSave} className="bg-primary hover:bg-primary-hover text-white font-semibold py-2 px-4 rounded-lg transition">Apply Changes</button>
                 </div>
            </div>
        </div>
    );
};


const statusColors: Record<LeadStatus, string> = {
    [LeadStatus.New]: 'bg-blue-500/20 text-blue-400',
    [LeadStatus.Queued]: 'bg-yellow-500/20 text-yellow-400',
    [LeadStatus.Called]: 'bg-purple-500/20 text-purple-400',
    [LeadStatus.Scheduled]: 'bg-green-500/20 text-green-400',
    [LeadStatus.DoNotCall]: 'bg-gray-500/20 text-gray-400',
    [LeadStatus.Error]: 'bg-red-500/20 text-red-400',
};

const LeadsScreen: React.FC = () => {
    const { leads, setLeads, leadGroups } = useData();
    const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [editingLead, setEditingLead] = useState<Lead | null>(null);
    const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set());

    const handleOpenLeadModal = (lead: Lead | null = null) => {
        setEditingLead(lead);
        setIsLeadModalOpen(true);
    }
    
    const handleCloseLeadModal = () => {
        setIsLeadModalOpen(false);
        setEditingLead(null);
    }

    const handleSaveLead = (leadData: Lead | Omit<Lead, 'id'>) => {
        if ('id' in leadData) {
            setLeads(prev => prev.map(l => l.id === leadData.id ? leadData : l));
        } else {
            const newLead: Lead = { ...leadData, id: Date.now().toString() };
            setLeads(prev => [...prev, newLead]);
        }
        handleCloseLeadModal();
    }
    
    const handleDeleteLead = (leadId: string) => {
        if (window.confirm('Are you sure you want to delete this lead? This cannot be undone.')) {
            setLeads(prev => prev.filter(l => l.id !== leadId));
        }
    }
    
    const handleSelectLead = (leadId: string, isSelected: boolean) => {
        setSelectedLeadIds(prev => {
            const newSet = new Set(prev);
            if (isSelected) newSet.add(leadId);
            else newSet.delete(leadId);
            return newSet;
        });
    }

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedLeadIds(new Set(leads.map(l => l.id)));
        } else {
            setSelectedLeadIds(new Set());
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Leads</h1>
                    <p className="text-text-secondary mt-1">Manage your lead lists for campaigns.</p>
                </div>
                <div className="space-x-4 flex items-center">
                    {selectedLeadIds.size > 0 && (
                         <button onClick={() => setIsGroupModalOpen(true)} className="bg-secondary hover:bg-secondary-hover text-white font-semibold py-2 px-4 rounded-lg transition">
                            Assign to Group ({selectedLeadIds.size})
                        </button>
                    )}
                    <button onClick={() => alert('CSV/Google Sheet import coming soon!')} className="bg-surface hover:bg-border text-text-primary font-semibold py-2 px-4 rounded-lg transition border border-border">
                        Import Leads
                    </button>
                    <button onClick={() => handleOpenLeadModal()} className="bg-primary hover:bg-primary-hover text-white font-semibold py-2 px-4 rounded-lg transition">
                        Add Lead
                    </button>
                </div>
            </div>
            
            <div className="bg-surface border border-border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-border">
                    <thead className="bg-background">
                        <tr>
                            <th scope="col" className="p-4">
                                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" onChange={handleSelectAll} checked={selectedLeadIds.size === leads.length && leads.length > 0} />
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Name & Groups</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Contact</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Source</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {leads.map(lead => (
                            <tr key={lead.id}>
                                <td className="p-4">
                                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" checked={selectedLeadIds.has(lead.id)} onChange={(e) => handleSelectLead(lead.id, e.target.checked)} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-text-primary">{lead.name}</div>
                                    <div className="text-sm text-text-secondary">{lead.city}</div>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {lead.groupIds.map(gid => {
                                            const group = leadGroups.find(g => g.id === gid);
                                            return group ? <span key={gid} className="text-xs bg-border px-1.5 py-0.5 rounded-full">{group.name}</span> : null;
                                        })}
                                    </div>
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
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                     <button onClick={() => handleOpenLeadModal(lead)} className="text-primary hover:text-primary-hover"><PencilIcon className="w-5 h-5"/></button>
                                     <button onClick={() => handleDeleteLead(lead.id)} className="text-danger hover:opacity-80"><TrashIcon className="w-5 h-5" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isLeadModalOpen && <LeadModal lead={editingLead || emptyLead} onClose={handleCloseLeadModal} onSave={handleSaveLead} />}
            {isGroupModalOpen && <AssignGroupModal leadIds={Array.from(selectedLeadIds)} onClose={() => setIsGroupModalOpen(false)} />}
        </div>
    );
};

export default LeadsScreen;

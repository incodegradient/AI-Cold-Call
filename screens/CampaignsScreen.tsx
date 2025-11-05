// FIX: Implemented full CampaignsScreen component.

import React, { useState } from 'react';
import { useData } from '../App';
import { Campaign } from '../types';
import { PencilIcon, TrashIcon, XMarkIcon, PlayIcon, PauseIcon } from '@heroicons/react/24/outline';

const emptyCampaign: Omit<Campaign, 'id' | 'stats'> = {
    name: '',
    status: 'Paused',
    agentId: '',
};

const CampaignModal: React.FC<{ campaign: Campaign | Omit<Campaign, 'id' | 'stats'>, onClose: () => void, onSave: (campaign: Campaign | Omit<Campaign, 'id' | 'stats'>) => void }> = ({ campaign, onClose, onSave }) => {
    const { agents } = useData();
    const [formData, setFormData] = useState(campaign);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-surface border border-border rounded-lg shadow-xl w-full max-w-lg p-6 m-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-text-primary">{'id' in campaign ? 'Edit' : 'Create'} Campaign</h2>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-text-secondary block mb-1.5">Campaign Name</label>
                        <input name="name" value={formData.name} onChange={handleChange} required className="w-full bg-background border border-border rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-text-secondary block mb-1.5">Assign Agent</label>
                        <select name="agentId" value={formData.agentId} onChange={handleChange} required className="w-full bg-background border border-border rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary">
                            <option value="" disabled>Select an agent</option>
                            {agents.filter(a => a.isActive).map(agent => (
                                <option key={agent.id} value={agent.id}>{agent.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="bg-surface hover:bg-border text-text-primary font-semibold py-2 px-4 rounded-lg transition border border-border">Cancel</button>
                        <button type="submit" className="bg-primary hover:bg-primary-hover text-white font-semibold py-2 px-4 rounded-lg transition">Save Campaign</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const CampaignsScreen: React.FC = () => {
    const { campaigns, setCampaigns } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

    const handleOpenModal = (campaign: Campaign | null = null) => {
        setEditingCampaign(campaign);
        setIsModalOpen(true);
    }
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCampaign(null);
    }

    const handleSaveCampaign = (campaignData: Campaign | Omit<Campaign, 'id' | 'stats'>) => {
        if ('id' in campaignData) {
            setCampaigns(prev => prev.map(c => c.id === campaignData.id ? campaignData : c));
        } else {
            const newCampaign: Campaign = { 
                ...campaignData, 
                id: Date.now().toString(), 
                stats: { totalLeads: 0, attempted: 0, connected: 0, bookings: 0 } 
            };
            setCampaigns(prev => [...prev, newCampaign]);
        }
        handleCloseModal();
    }
    
    const handleDeleteCampaign = (campaignId: string) => {
        if (window.confirm('Are you sure you want to delete this campaign?')) {
            setCampaigns(prev => prev.filter(c => c.id !== campaignId));
        }
    }
    
    const toggleCampaignStatus = (campaign: Campaign) => {
        const newStatus = campaign.status === 'Active' ? 'Paused' : 'Active';
        setCampaigns(prev => prev.map(c => c.id === campaign.id ? { ...c, status: newStatus } : c));
    };

    const getStatusColor = (status: Campaign['status']) => {
        switch (status) {
            case 'Active': return 'bg-green-500/20 text-green-400';
            case 'Paused': return 'bg-yellow-500/20 text-yellow-400';
            case 'Completed': return 'bg-gray-500/20 text-gray-400';
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Campaigns</h1>
                    <p className="text-text-secondary mt-1">Manage your outbound call campaigns.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="bg-primary hover:bg-primary-hover text-white font-semibold py-2 px-4 rounded-lg transition">
                    Create Campaign
                </button>
            </div>

            <div className="bg-surface border border-border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-border">
                    <thead className="bg-background">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Campaign Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Progress</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Bookings</th>
                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Success %</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {campaigns.map(campaign => {
                            const progress = campaign.stats.totalLeads > 0 ? (campaign.stats.attempted / campaign.stats.totalLeads) * 100 : 0;
                            const successRate = campaign.stats.connected > 0 ? (campaign.stats.bookings / campaign.stats.connected) * 100 : 0;
                            return (
                                <tr key={campaign.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">{campaign.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                                            {campaign.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                                        <div className="flex items-center">
                                            <div className="w-24 bg-background rounded-full h-2 mr-2">
                                                <div className="bg-primary h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                                            </div>
                                            <span>{progress.toFixed(0)}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{campaign.stats.bookings}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-secondary">{successRate.toFixed(1)}%</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <button onClick={() => toggleCampaignStatus(campaign)} className="text-text-secondary hover:text-text-primary p-1 rounded-md" title={campaign.status === 'Active' ? 'Pause' : 'Start'}>
                                            {campaign.status === 'Active' ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
                                        </button>
                                        <button onClick={() => handleOpenModal(campaign)} className="text-primary hover:text-primary-hover p-1 rounded-md"><PencilIcon className="w-5 h-5"/></button>
                                        <button onClick={() => handleDeleteCampaign(campaign.id)} className="text-danger hover:opacity-80 p-1 rounded-md"><TrashIcon className="w-5 h-5" /></button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            {isModalOpen && <CampaignModal campaign={editingCampaign || emptyCampaign} onClose={handleCloseModal} onSave={handleSaveCampaign} />}
        </div>
    );
};

export default CampaignsScreen;

import React, { useState } from 'react';
import { useData } from '../App';
import { Campaign } from '../types';
import { PlayIcon, PauseIcon, PencilIcon, PlusIcon } from '@heroicons/react/24/outline';
import * as api from '../apiService';

const statusStyles = {
    'Draft': 'bg-gray-500/20 text-gray-400',
    'Active': 'bg-green-500/20 text-green-400',
    'Paused': 'bg-yellow-500/20 text-yellow-400',
    'Completed': 'bg-blue-500/20 text-blue-400',
};

const CampaignCard: React.FC<{ campaign: Campaign; onEdit: (c: Campaign) => void; onToggleStatus: (c: Campaign) => void; agentName?: string }> = ({ campaign, onEdit, onToggleStatus, agentName }) => {
    const progress = campaign.stats.totalLeads > 0 ? (campaign.stats.attempted / campaign.stats.totalLeads) * 100 : 0;
    
    return (
        <div className="bg-surface border border-border rounded-lg p-5 flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-lg font-semibold text-text-primary">{campaign.name}</h3>
                        <p className="text-sm text-text-secondary">Agent: {agentName || 'N/A'}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[campaign.status]}`}>
                        {campaign.status}
                    </span>
                </div>

                <div className="my-4">
                    <div className="flex justify-between items-center mb-1.5 text-sm">
                        <span className="font-medium text-text-primary">Progress</span>
                        <span className="text-text-secondary">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-background rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                    <div>
                        <p className="font-bold text-lg">{campaign.stats.attempted}/{campaign.stats.totalLeads}</p>
                        <p className="text-xs text-text-secondary">Attempted</p>
                    </div>
                    <div>
                        <p className="font-bold text-lg">{campaign.stats.connected}</p>
                        <p className="text-xs text-text-secondary">Connected</p>
                    </div>
                    <div>
                        <p className="font-bold text-lg">{campaign.stats.bookings}</p>
                        <p className="text-xs text-text-secondary">Bookings</p>
                    </div>
                </div>
            </div>

            <div className="mt-5 pt-4 border-t border-border flex space-x-2">
                <button onClick={() => onToggleStatus(campaign)} className="flex-1 bg-border hover:bg-border/80 text-text-primary font-semibold py-2 px-3 rounded-lg transition text-sm flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed" disabled={campaign.status === 'Completed' || campaign.status === 'Draft'}>
                    {campaign.status === 'Active' ? <PauseIcon className="w-5 h-5 mr-1.5" /> : <PlayIcon className="w-5 h-5 mr-1.5" />}
                    {campaign.status === 'Active' ? 'Pause' : 'Start'}
                </button>
                <button onClick={() => onEdit(campaign)} className="bg-border hover:bg-border/80 text-text-primary font-semibold py-2 px-3 rounded-lg transition text-sm flex items-center justify-center">
                    <PencilIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    )
};

const CampaignForm: React.FC<{onSave: (c: Omit<Campaign, 'id'>) => void, onCancel: () => void}> = ({onSave, onCancel}) => {
    const { agents, leadGroups, leads } = useData();
    
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const agentId = formData.get('agentId') as string;
        const selectedAgent = agents.find(a => a.id === agentId);
        const selectedGroupIds = formData.getAll('groupIds') as string[];
        
        const totalLeads = leads.filter(l => l.groupIds.some(gId => selectedGroupIds.includes(gId))).length;


        const newCampaign: Omit<Campaign, 'id'> = {
            name,
            agentId,
            platform: selectedAgent!.platform,
            target: { groupIds: selectedGroupIds, individualLeadIds: [] },
            status: 'Draft',
            schedule: { start: '09:00', end: '17:00', weekdays: [1,2,3,4,5] },
            pacing: { gapMinutes: 5, maxConcurrent: 10 },
            stats: { totalLeads, attempted: 0, connected: 0, avgTalkTime: 0, bookings: 0 },
        };
        onSave(newCampaign);
    }
    
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onCancel}>
            <form onSubmit={handleSubmit} className="bg-surface rounded-lg shadow-xl w-full max-w-lg p-6 space-y-4" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold">Create Campaign</h2>
                <input name="name" placeholder="Campaign Name" required className="w-full bg-background border border-border rounded-md p-2"/>
                <select name="agentId" required className="w-full bg-background border border-border rounded-md p-2">
                    <option value="">Select an Agent</option>
                    {agents.filter(a => a.isActive).map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
                <div>
                    <label className="text-sm font-medium">Target Lead Groups</label>
                    <div className="max-h-40 overflow-y-auto mt-2 space-y-2 p-2 border border-border rounded-md">
                        {leadGroups.map(g => (
                            <label key={g.id} className="flex items-center space-x-2">
                                <input type="checkbox" name="groupIds" value={g.id} className="rounded text-primary focus:ring-primary bg-background border-border" />
                                <span>{g.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                    <button type="button" onClick={onCancel} className="bg-border px-4 py-2 rounded-lg text-sm font-semibold">Cancel</button>
                    <button type="submit" className="bg-primary hover:bg-primary-hover px-4 py-2 rounded-lg text-sm font-semibold text-white">Create</button>
                </div>
            </form>
        </div>
    );
};

const CampaignsScreen: React.FC = () => {
    const { campaigns, agents, refreshData } = useData();
    const [showCreate, setShowCreate] = useState(false);

    const handleToggleStatus = async (campaign: Campaign) => {
        let newStatus = campaign.status;
        if (campaign.status === 'Active') newStatus = 'Paused';
        else if (campaign.status === 'Paused') newStatus = 'Active';

        if (newStatus !== campaign.status) {
            await api.updateCampaign({ ...campaign, status: newStatus });
            refreshData();
        }
    };
    
    const handleCreateCampaign = async (campaignData: Omit<Campaign, 'id'>) => {
        await api.createCampaign(campaignData);
        refreshData();
        setShowCreate(false);
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Campaigns</h1>
                    <p className="text-text-secondary mt-1">Launch and monitor your outreach campaigns.</p>
                </div>
                <button 
                    onClick={() => setShowCreate(true)}
                    className="bg-primary hover:bg-primary-hover text-white font-semibold py-2 px-4 rounded-lg transition flex items-center"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    New Campaign
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map(c => {
                    const agent = agents.find(a => a.id === c.agentId);
                    return <CampaignCard key={c.id} campaign={c} onEdit={() => { /* Edit not implemented */ }} onToggleStatus={handleToggleStatus} agentName={agent?.name} />
                })}
            </div>
            {showCreate && <CampaignForm onSave={handleCreateCampaign} onCancel={() => setShowCreate(false)}/>}
        </div>
    );
};

export default CampaignsScreen;

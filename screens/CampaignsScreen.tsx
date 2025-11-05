import React, { useState, useMemo } from 'react';
import { useData } from '../App';
import { Campaign, AgentPlatform, Lead, LeadGroup } from '../types';
import { PlayIcon, PauseIcon, StopIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

const emptyCampaign: Omit<Campaign, 'id'> = {
    name: '',
    platform: AgentPlatform.Vapi,
    agentId: '',
    target: { groupIds: [], individualLeadIds: [] },
    status: 'Draft',
    schedule: { start: '09:00', end: '17:00', weekdays: [1,2,3,4,5] },
    pacing: { gapMinutes: 5, maxConcurrent: 10 },
    stats: { totalLeads: 0, attempted: 0, connected: 0, avgTalkTime: 0, bookings: 0 },
};

// A simple multi-select component for the modal
const MultiSelect: React.FC<{
    label: string;
    options: {value: string, label: string}[];
    selected: string[];
    onChange: (selected: string[]) => void;
}> = ({ label, options, selected, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedLabels = selected.map(s => options.find(o => o.value === s)?.label).filter(Boolean).join(', ');

    return (
        <div>
            <label className="text-sm font-medium text-text-secondary block mb-1.5">{label}</label>
            <div className="relative">
                <button type="button" onClick={() => setIsOpen(!isOpen)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-left text-text-primary focus:outline-none focus:ring-2 focus:ring-primary">
                    <span className="truncate">{selectedLabels || `Select...`}</span>
                </button>
                {isOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-surface border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {options.map(option => (
                            <label key={option.value} className="flex items-center space-x-2 px-3 py-2 cursor-pointer hover:bg-border">
                                <input
                                    type="checkbox"
                                    checked={selected.includes(option.value)}
                                    onChange={() => {
                                        const newSelected = selected.includes(option.value)
                                            ? selected.filter(s => s !== option.value)
                                            : [...selected, option.value];
                                        onChange(newSelected);
                                    }}
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <span>{option.label}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};


const CampaignModal: React.FC<{ campaign: Campaign | Omit<Campaign, 'id'>, onClose: () => void, onSave: (campaign: Campaign | Omit<Campaign, 'id'>) => void }> = ({ campaign, onClose, onSave }) => {
    const { agents, leads, leadGroups } = useData();
    const [formData, setFormData] = useState(campaign);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({...prev, [parent]: { ...prev[parent], [child]: value}}));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const totalLeads = useMemo(() => {
        const leadIdSet = new Set<string>();
        formData.target.groupIds.forEach(groupId => {
            leads.forEach(lead => {
                if (lead.groupIds.includes(groupId)) {
                    leadIdSet.add(lead.id);
                }
            });
        });
        formData.target.individualLeadIds.forEach(leadId => leadIdSet.add(leadId));
        return leadIdSet.size;
    }, [formData.target, leads]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({...formData, stats: {...formData.stats, totalLeads }});
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 overflow-y-auto">
            <div className="bg-surface border border-border rounded-lg shadow-xl w-full max-w-2xl p-6 m-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-text-primary">{'id' in campaign ? 'Edit' : 'Create'} Campaign</h2>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary"><XMarkIcon className="w-6 h-6" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <label className="text-sm font-medium text-text-secondary block mb-1.5">Campaign Name</label>
                    <input name="name" value={formData.name} onChange={handleChange} required className="w-full bg-background border border-border rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" />

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="text-sm font-medium text-text-secondary block mb-1.5">Platform</label>
                             <select name="platform" value={formData.platform} onChange={handleChange} className="w-full bg-background border border-border rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary">
                                <option value={AgentPlatform.Vapi}>Vapi</option>
                                <option value={AgentPlatform.Retell}>Retell AI</option>
                            </select>
                        </div>
                         <div>
                             <label className="text-sm font-medium text-text-secondary block mb-1.5">Agent</label>
                             <select name="agentId" value={formData.agentId} onChange={handleChange} required className="w-full bg-background border border-border rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary">
                                 <option value="" disabled>Select an agent</option>
                                 {agents.filter(a => a.platform === formData.platform).map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                            </select>
                        </div>
                    </div>
                    
                    <div className="bg-background/50 border border-border p-4 rounded-lg space-y-4">
                        <h3 className="font-semibold text-text-primary">Targeting ({totalLeads} total leads)</h3>
                        <MultiSelect
                            label="Target Lead Groups"
                            options={leadGroups.map(g => ({ value: g.id, label: g.name }))}
                            selected={formData.target.groupIds}
                            onChange={selected => setFormData(p => ({...p, target: {...p.target, groupIds: selected}}))}
                        />
                        <MultiSelect
                            label="Target Individual Leads"
                            options={leads.map(l => ({ value: l.id, label: `${l.name} (${l.phone})` }))}
                            selected={formData.target.individualLeadIds}
                            onChange={selected => setFormData(p => ({...p, target: {...p.target, individualLeadIds: selected}}))}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-text-secondary block mb-1.5">Gap between calls (minutes)</label>
                            <input type="number" name="pacing.gapMinutes" value={formData.pacing.gapMinutes} onChange={handleChange} required className="w-full bg-background border border-border rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" />
                        </div>
                         <div>
                             <label className="text-sm font-medium text-text-secondary block mb-1.5">Max concurrent calls</label>
                            <input type="number" name="pacing.maxConcurrent" value={formData.pacing.maxConcurrent} onChange={handleChange} required className="w-full bg-background border border-border rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" />
                        </div>
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

  const statusColors = {
      Active: 'text-green-400', Paused: 'text-yellow-400', Completed: 'text-blue-400', Draft: 'text-gray-400',
  };

  const handleOpenModal = (campaign: Campaign | null = null) => {
    setEditingCampaign(campaign);
    setIsModalOpen(true);
  }
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCampaign(null);
  }

  const handleSaveCampaign = (campaignData: Campaign | Omit<Campaign, 'id'>) => {
    if ('id' in campaignData) {
        setCampaigns(prev => prev.map(c => c.id === campaignData.id ? campaignData : c));
    } else {
        const newCampaign: Campaign = { ...campaignData, id: Date.now().toString() };
        setCampaigns(prev => [...prev, newCampaign]);
    }
    handleCloseModal();
  }

  const handleDeleteCampaign = (campaignId: string) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
        setCampaigns(prev => prev.filter(c => c.id !== campaignId));
    }
  }

  const handleStatusChange = (campaignId: string, status: 'Active' | 'Paused' | 'Completed') => {
    setCampaigns(prev => prev.map(c => c.id === campaignId ? {...c, status} : c));
  }


  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-text-primary">Campaigns</h1>
            <p className="text-text-secondary mt-1">Launch and monitor your outbound call campaigns.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-primary hover:bg-primary-hover text-white font-semibold py-2 px-4 rounded-lg transition">
            New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {campaigns.map(campaign => (
          <div key={campaign.id} className="bg-surface border border-border rounded-lg p-6 flex flex-col">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold text-text-primary">{campaign.name}</h2>
                    <p className={`font-semibold text-sm mt-1 ${statusColors[campaign.status]}`}>{campaign.status}</p>
                </div>
                <div className="flex space-x-2">
                    {campaign.status === 'Active' && <button onClick={() => handleStatusChange(campaign.id, 'Paused')} className="text-text-secondary hover:text-yellow-400 p-1.5 rounded-md hover:bg-border"><PauseIcon className="w-5 h-5"/></button>}
                    {campaign.status === 'Paused' && <button onClick={() => handleStatusChange(campaign.id, 'Active')} className="text-text-secondary hover:text-green-400 p-1.5 rounded-md hover:bg-border"><PlayIcon className="w-5 h-5"/></button>}
                    {campaign.status !== 'Completed' && <button onClick={() => handleStatusChange(campaign.id, 'Completed')} className="text-text-secondary hover:text-blue-400 p-1.5 rounded-md hover:bg-border"><StopIcon className="w-5 h-5"/></button>}
                    <button onClick={() => handleOpenModal(campaign)} className="text-text-secondary hover:text-primary p-1.5 rounded-md hover:bg-border"><PencilIcon className="w-5 h-5"/></button>
                    <button onClick={() => handleDeleteCampaign(campaign.id)} className="text-text-secondary hover:text-danger p-1.5 rounded-md hover:bg-border"><TrashIcon className="w-5 h-5"/></button>
                </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-border flex-grow">
                <div className="flex justify-between items-center">
                    <span className="text-text-primary font-medium">{campaign.stats.attempted} / {campaign.stats.totalLeads} Leads Called</span>
                    <span className="text-text-secondary text-sm">{campaign.stats.totalLeads > 0 ? ((campaign.stats.attempted / campaign.stats.totalLeads) * 100).toFixed(0) : 0}%</span>
                </div>
                <div className="w-full bg-background rounded-full h-2 mt-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${campaign.stats.totalLeads > 0 ? (campaign.stats.attempted / campaign.stats.totalLeads) * 100 : 0}%` }}></div>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                    <p className="text-sm text-text-secondary">Connected</p>
                    <p className="text-lg font-semibold text-text-primary">{campaign.stats.connected}</p>
                </div>
                 <div>
                    <p className="text-sm text-text-secondary">Bookings</p>
                    <p className="text-lg font-semibold text-text-primary">{campaign.stats.bookings}</p>
                </div>
                 <div>
                    <p className="text-sm text-text-secondary">Avg. Talk Time</p>
                    <p className="text-lg font-semibold text-text-primary">{campaign.stats.avgTalkTime}m</p>
                </div>
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && <CampaignModal campaign={editingCampaign || emptyCampaign} onClose={handleCloseModal} onSave={handleSaveCampaign} />}
    </div>
  );
};

export default CampaignsScreen;

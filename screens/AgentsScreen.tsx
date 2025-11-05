import React, { useState } from 'react';
import { useData } from '../App';
import { Agent, AgentPlatform } from '../types';
import { PlusIcon, PencilIcon } from '@heroicons/react/24/outline';
import * as api from '../apiService';

const AgentCard: React.FC<{ agent: Agent, onEdit: (agent: Agent) => void }> = ({ agent, onEdit }) => {
    return (
        <div className="bg-surface border border-border rounded-lg p-5">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-semibold text-text-primary">{agent.name}</h3>
                    <p className="text-sm text-text-secondary">{agent.platform}</p>
                </div>
                <div className="flex items-center space-x-3">
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${agent.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {agent.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <button onClick={() => onEdit(agent)} className="text-text-secondary hover:text-primary">
                        <PencilIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
            <p className="text-xs text-text-secondary mt-2 break-all">ID: {agent.providerAgentId}</p>
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border text-center">
                <div>
                    <p className="text-xl font-bold">{agent.calls}</p>
                    <p className="text-xs text-text-secondary">Calls Made</p>
                </div>
                <div>
                    <p className="text-xl font-bold">{agent.avgDuration}m</p>
                    <p className="text-xs text-text-secondary">Avg Duration</p>
                </div>
                <div>
                    <p className="text-xl font-bold">{agent.bookingRate}%</p>
                    <p className="text-xs text-text-secondary">Booking Rate</p>
                </div>
            </div>
        </div>
    );
}

const AgentForm: React.FC<{ agent: Partial<Agent> | null, onSave: (agent: Partial<Agent>) => void, onCancel: () => void }> = ({ agent, onSave, onCancel }) => {
    const [formData, setFormData] = useState(agent || { isActive: true, platform: AgentPlatform.Vapi, name: '', providerAgentId: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
            setFormData({ ...formData, [name]: e.target.checked });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onCancel}>
            <div className="bg-surface rounded-lg shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold mb-4">{agent?.id ? 'Edit Agent' : 'Create Agent'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="name" value={formData.name || ''} onChange={handleChange} placeholder="Agent Name" required className="w-full bg-background border border-border rounded-md p-2" />
                    <select name="platform" value={formData.platform || ''} onChange={handleChange} className="w-full bg-background border border-border rounded-md p-2">
                        <option value={AgentPlatform.Vapi}>Vapi</option>
                        <option value={AgentPlatform.Retell}>Retell AI</option>
                    </select>
                    <input name="providerAgentId" value={formData.providerAgentId || ''} onChange={handleChange} placeholder="Provider Agent ID" required className="w-full bg-background border border-border rounded-md p-2" />
                    <label className="flex items-center cursor-pointer">
                        <input type="checkbox" name="isActive" checked={formData.isActive || false} onChange={handleChange} className="sr-only peer" />
                        <div className="relative w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        <span className="ms-3 text-sm font-medium text-text-primary">Active</span>
                    </label>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onCancel} className="bg-border px-4 py-2 rounded-lg text-sm font-semibold">Cancel</button>
                        <button type="submit" className="bg-primary hover:bg-primary-hover px-4 py-2 rounded-lg text-sm font-semibold text-white">Save</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

const AgentsScreen: React.FC = () => {
    const { agents, refreshData } = useData();
    const [editingAgent, setEditingAgent] = useState<Partial<Agent> | null>(null);

    const handleSave = async (agentData: Partial<Agent>) => {
        if (agentData.id) {
            await api.updateAgent(agentData as Agent);
        } else {
            // Fill in missing fields for creation
            const newAgent = { ...agentData, calls: 0, avgDuration: 0, bookingRate: 0 } as Omit<Agent, 'id'>;
            await api.createAgent(newAgent);
        }
        refreshData();
        setEditingAgent(null);
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">Agents</h1>
                    <p className="text-text-secondary mt-1">Manage your AI calling agents.</p>
                </div>
                <button 
                    onClick={() => setEditingAgent({})}
                    className="bg-primary hover:bg-primary-hover text-white font-semibold py-2 px-4 rounded-lg transition flex items-center"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Create Agent
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agents.map(agent => (
                    <AgentCard key={agent.id} agent={agent} onEdit={setEditingAgent} />
                ))}
            </div>

            {editingAgent && <AgentForm agent={editingAgent} onSave={handleSave} onCancel={() => setEditingAgent(null)} />}
        </div>
    );
};

export default AgentsScreen;

import React, { useState } from 'react';
import { useData } from '../App';
import { Agent, AgentPlatform } from '../types';
import { PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';

const emptyAgent: Omit<Agent, 'id'> = {
    name: '',
    platform: AgentPlatform.Vapi,
    isActive: true,
    providerAgentId: '',
    calls: 0,
    avgDuration: 0,
    bookingRate: 0,
};

const AgentModal: React.FC<{ agent: Agent | Omit<Agent, 'id'>, onClose: () => void, onSave: (agent: Agent | Omit<Agent, 'id'>) => void }> = ({ agent, onClose, onSave }) => {
    const [formData, setFormData] = useState(agent);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-surface border border-border rounded-lg shadow-xl w-full max-w-lg p-6 m-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-text-primary">{'id' in agent ? 'Edit' : 'Create'} Agent</h2>
                    <button onClick={onClose} className="text-text-secondary hover:text-text-primary">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-text-secondary block mb-1.5">Agent Name</label>
                        <input name="name" value={formData.name} onChange={handleChange} required className="w-full bg-background border border-border rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-text-secondary block mb-1.5">Platform</label>
                        <select name="platform" value={formData.platform} onChange={handleChange} className="w-full bg-background border border-border rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary">
                            <option value={AgentPlatform.Vapi}>Vapi</option>
                            <option value={AgentPlatform.Retell}>Retell AI</option>
                        </select>
                    </div>
                     <div>
                        <label className="text-sm font-medium text-text-secondary block mb-1.5">Agent ID</label>
                        <input name="providerAgentId" value={formData.providerAgentId} onChange={handleChange} placeholder="Enter Vapi or Retell AI Agent ID" required className="w-full bg-background border border-border rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div className="flex items-center">
                        <input type="checkbox" id="isActive" name="isActive" checked={formData.isActive} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                        <label htmlFor="isActive" className="ml-2 block text-sm text-text-primary">Agent is Active</label>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="bg-surface hover:bg-border text-text-primary font-semibold py-2 px-4 rounded-lg transition border border-border">Cancel</button>
                        <button type="submit" className="bg-primary hover:bg-primary-hover text-white font-semibold py-2 px-4 rounded-lg transition">Save Agent</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AgentsScreen: React.FC = () => {
    const { agents, setAgents } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAgent, setEditingAgent] = useState<Agent | null>(null);

    const handleOpenModal = (agent: Agent | null = null) => {
        setEditingAgent(agent);
        setIsModalOpen(true);
    }
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingAgent(null);
    }

    const handleSaveAgent = (agentData: Agent | Omit<Agent, 'id'>) => {
        if ('id' in agentData) {
            // Editing
            setAgents(prev => prev.map(a => a.id === agentData.id ? agentData : a));
        } else {
            // Creating
            const newAgent: Agent = { ...agentData, id: Date.now().toString() };
            setAgents(prev => [...prev, newAgent]);
        }
        handleCloseModal();
    }
    
    const handleDeleteAgent = (agentId: string) => {
        if (window.confirm('Are you sure you want to delete this agent?')) {
            setAgents(prev => prev.filter(a => a.id !== agentId));
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">AI Agents</h1>
                    <p className="text-text-secondary mt-1">Create and configure your voice agents.</p>
                </div>
                <button onClick={() => handleOpenModal()} className="bg-primary hover:bg-primary-hover text-white font-semibold py-2 px-4 rounded-lg transition">
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
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {agents.map(agent => (
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
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                    <button onClick={() => handleOpenModal(agent)} className="text-primary hover:text-primary-hover"><PencilIcon className="w-5 h-5"/></button>
                                    <button onClick={() => handleDeleteAgent(agent.id)} className="text-danger hover:opacity-80"><TrashIcon className="w-5 h-5" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && <AgentModal agent={editingAgent || emptyAgent} onClose={handleCloseModal} onSave={handleSaveAgent} />}
        </div>
    );
};

export default AgentsScreen;

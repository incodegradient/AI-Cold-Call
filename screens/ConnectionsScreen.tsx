import React, { useState } from 'react';
import { useData } from '../App';
import { Connection, ConnectionProvider } from '../types';
import { CheckCircleIcon, XCircleIcon, PencilIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import * as api from '../apiService';

const providerDetails = {
    [ConnectionProvider.Vapi]: { docs: '#' },
    [ConnectionProvider.RetellAI]: { docs: '#' },
    [ConnectionProvider.Twilio]: { docs: '#' },
    [ConnectionProvider.CalCom]: { docs: '#' },
    [ConnectionProvider.OpenAI]: { docs: '#' },
    [ConnectionProvider.Gmail]: { docs: '#' },
};

const ConnectionCard: React.FC<{ connection: Connection, onEdit: (c: Connection) => void }> = ({ connection, onEdit }) => {
    return (
        <div className="bg-surface border border-border rounded-lg p-5 flex flex-col">
            <div className="flex items-center">
                {/* In a real app, you would have logos */}
                <div className="w-10 h-10 bg-border rounded-full mr-4 flex-shrink-0"></div>
                <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-text-primary">{connection.provider}</h3>
                    <a href={providerDetails[connection.provider].docs} className="text-xs text-primary hover:underline">Read Docs</a>
                </div>
                <div className={`ml-auto text-xs font-semibold flex items-center flex-shrink-0 ${connection.isConnected ? 'text-green-400' : 'text-text-secondary'}`}>
                    {connection.isConnected ? <CheckCircleIcon className="w-4 h-4 mr-1" /> : <XCircleIcon className="w-4 h-4 mr-1" />}
                    {connection.isConnected ? 'Connected' : 'Not Connected'}
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border flex-grow">
                <p className="text-sm text-text-secondary">
                    {connection.isConnected ? 'Your account is successfully linked.' : 'Connect your account to enable this integration.'}
                </p>
            </div>
            <button 
                onClick={() => onEdit(connection)}
                className="mt-4 w-full bg-primary/10 hover:bg-primary/20 text-primary font-semibold py-2 px-4 rounded-lg transition text-sm flex items-center justify-center"
            >
                <PencilIcon className="w-4 h-4 mr-2" />
                {connection.isConnected ? 'Manage Connection' : 'Set Up Connection'}
            </button>
        </div>
    );
};

const ConnectionsScreen: React.FC = () => {
    const { connections, refreshData } = useData();
    const [editingConnection, setEditingConnection] = useState<Connection | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingConnection) return;
        setIsSaving(true);
        try {
            await api.updateConnection(editingConnection);
            refreshData();
            setEditingConnection(null);
        } catch (error) {
            console.error('Failed to save connection', error);
        } finally {
            setIsSaving(false);
        }
    };
    
    const renderFormFields = () => {
        if (!editingConnection) return null;

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setEditingConnection({
                ...editingConnection,
                [e.target.name]: e.target.value
            });
        };

        switch (editingConnection.provider) {
            case ConnectionProvider.Vapi:
            case ConnectionProvider.RetellAI:
            case ConnectionProvider.OpenAI:
                return <input name="apiKey" value={editingConnection.apiKey || ''} onChange={handleInputChange} placeholder="API Key" className="w-full bg-background border border-border rounded-md p-2" />;
            case ConnectionProvider.Twilio:
                return (
                    <div className="space-y-4">
                        <input name="accountSid" value={editingConnection.accountSid || ''} onChange={handleInputChange} placeholder="Account SID" className="w-full bg-background border border-border rounded-md p-2" />
                        <input name="authToken" value={editingConnection.authToken || ''} onChange={handleInputChange} placeholder="Auth Token" className="w-full bg-background border border-border rounded-md p-2" />
                        <input name="phoneNumber" value={editingConnection.phoneNumber || ''} onChange={handleInputChange} placeholder="Phone Number" className="w-full bg-background border border-border rounded-md p-2" />
                    </div>
                );
            case ConnectionProvider.CalCom:
                 return (
                    <div className="space-y-4">
                        <input name="apiKey" value={editingConnection.apiKey || ''} onChange={handleInputChange} placeholder="API Key" className="w-full bg-background border border-border rounded-md p-2" />
                        <input name="eventType" value={editingConnection.eventType || ''} onChange={handleInputChange} placeholder="Event Type ID" className="w-full bg-background border border-border rounded-md p-2" />
                    </div>
                );
            case ConnectionProvider.Gmail:
                return (
                    <div className="space-y-4">
                         <input name="clientId" value={editingConnection.clientId || ''} onChange={handleInputChange} placeholder="Client ID" className="w-full bg-background border border-border rounded-md p-2" />
                        <input name="clientSecret" value={editingConnection.clientSecret || ''} onChange={handleInputChange} placeholder="Client Secret" className="w-full bg-background border border-border rounded-md p-2" />
                    </div>
                )
            default:
                return <p>Configuration not available for this provider.</p>;
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-text-primary">Connections</h1>
                <p className="text-text-secondary mt-1">Integrate your favorite tools with AetherDial.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {connections.map(c => (
                    <ConnectionCard key={c.id} connection={c} onEdit={setEditingConnection} />
                ))}
            </div>

            {editingConnection && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setEditingConnection(null)}>
                    <div className="bg-surface rounded-lg shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-4">Edit {editingConnection.provider} Connection</h2>
                        <form onSubmit={handleSave} className="space-y-4">
                            {renderFormFields()}
                            <div className="flex items-center">
                                <label className="flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={editingConnection.isConnected} 
                                        onChange={e => setEditingConnection({...editingConnection, isConnected: e.target.checked})}
                                        className="sr-only peer" />
                                    <div className="relative w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    <span className="ms-3 text-sm font-medium text-text-primary">
                                        {editingConnection.isConnected ? 'Connected' : 'Disconnected'}
                                    </span>
                                </label>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button type="button" onClick={() => setEditingConnection(null)} className="bg-border px-4 py-2 rounded-lg text-sm font-semibold">Cancel</button>
                                <button type="submit" disabled={isSaving} className="bg-primary hover:bg-primary-hover px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50">
                                    {isSaving ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConnectionsScreen;

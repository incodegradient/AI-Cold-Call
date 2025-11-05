
import React from 'react';
import { Connection, ConnectionProvider } from '../types';

const mockConnections: Connection[] = [
    { id: '1', provider: ConnectionProvider.Vapi, isConnected: true },
    { id: '2', provider: ConnectionProvider.RetellAI, isConnected: false },
    { id: '3', provider: ConnectionProvider.Twilio, isConnected: true },
    { id: '4', provider: ConnectionProvider.CalCom, isConnected: true },
    { id: '5', provider: ConnectionProvider.OpenAI, isConnected: true },
    { id: '6', provider: ConnectionProvider.Gmail, isConnected: false },
];

const ProviderIcon: React.FC<{ provider: ConnectionProvider }> = ({ provider }) => {
    // In a real app, you'd have actual icons
    return <div className="w-10 h-10 rounded-lg bg-border flex items-center justify-center font-bold text-sm">{provider.substring(0,2)}</div>
}

const ConnectionsScreen: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-text-primary">Connections</h1>
            <p className="text-text-secondary mt-1">Manage your integrations with third-party services.</p>
        </div>
        <button className="bg-primary hover:bg-primary-hover text-white font-semibold py-2 px-4 rounded-lg transition">
            Add New Connection
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockConnections.map(conn => (
            <div key={conn.id} className="bg-surface border border-border rounded-lg p-5 flex flex-col">
                <div className="flex items-center">
                    <ProviderIcon provider={conn.provider} />
                    <h2 className="text-lg font-semibold text-text-primary ml-4">{conn.provider}</h2>
                </div>
                <div className="flex-grow mt-4">
                    <p className="text-sm text-text-secondary">
                        {conn.isConnected ? 'Your account is connected and ready to use.' : 'Connect your account to enable this integration.'}
                    </p>
                </div>
                <div className="mt-6 flex items-center justify-between">
                     <span className={`text-sm font-medium ${conn.isConnected ? 'text-green-400' : 'text-yellow-400'}`}>
                        {conn.isConnected ? 'Connected' : 'Not Connected'}
                    </span>
                    <button className={`py-1.5 px-4 rounded-md text-sm font-semibold transition ${conn.isConnected ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'}`}>
                        {conn.isConnected ? 'Disconnect' : 'Connect'}
                    </button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default ConnectionsScreen;

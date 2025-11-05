import React, { useState } from 'react';
import { useData } from '../App';
import { Connection, ConnectionProvider } from '../types';

const ConnectionCard: React.FC<{ connection: Connection }> = ({ connection }) => {
    const { connections, setConnections } = useData();
    const [apiKey, setApiKey] = useState(connection.apiKey || '');
    const [eventType, setEventType] = useState(connection.eventType || '');
    const [clientId, setClientId] = useState(connection.clientId || '');
    const [clientSecret, setClientSecret] = useState(connection.clientSecret || '');
    const [accountSid, setAccountSid] = useState(connection.accountSid || '');
    const [authToken, setAuthToken] = useState(connection.authToken || '');
    const [phoneNumber, setPhoneNumber] = useState(connection.phoneNumber || '');
    
    const handleSave = () => {
        const updatedConnection: Connection = {
            ...connection,
            isConnected: true,
            apiKey, eventType, clientId, clientSecret, accountSid, authToken, phoneNumber
        };
        setConnections(connections.map(c => c.id === connection.id ? updatedConnection : c));
        alert(`${connection.provider} connection saved!`);
    };

    const handleTest = () => {
        if (connection.isConnected) {
            alert(`Testing ${connection.provider}... Success!`);
        } else {
            alert(`Please save your credentials for ${connection.provider} first.`);
        }
    };

    const isDirty = apiKey !== (connection.apiKey || '') ||
                      eventType !== (connection.eventType || '') ||
                      clientId !== (connection.clientId || '') ||
                      clientSecret !== (connection.clientSecret || '') ||
                      accountSid !== (connection.accountSid || '') ||
                      authToken !== (connection.authToken || '') ||
                      phoneNumber !== (connection.phoneNumber || '');

    return (
        <div className="bg-surface border border-border rounded-lg p-6 flex flex-col space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-text-primary">{connection.provider}</h2>
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${connection.isConnected ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {connection.isConnected ? 'Connected' : 'Not Connected'}
                </span>
            </div>
            
            {connection.provider === ConnectionProvider.CalCom && (
                 <>
                    <div>
                        <label className="text-sm font-medium text-text-secondary block mb-1.5" htmlFor={`apikey-${connection.id}`}>API Key (Cal.com)</label>
                        <input id={`apikey-${connection.id}`} type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                     <div>
                        <label className="text-sm font-medium text-text-secondary block mb-1.5" htmlFor={`eventtype-${connection.id}`}>Event Type ID (Cal.com)</label>
                        <input id={`eventtype-${connection.id}`} type="text" value={eventType} onChange={e => setEventType(e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                </>
            )}

            {connection.provider === ConnectionProvider.Gmail && (
                 <>
                    <div>
                        <label className="text-sm font-medium text-text-secondary block mb-1.5" htmlFor={`clientid-${connection.id}`}>Client ID</label>
                        <input id={`clientid-${connection.id}`} type="text" value={clientId} onChange={e => setClientId(e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                     <div>
                        <label className="text-sm font-medium text-text-secondary block mb-1.5" htmlFor={`clientsecret-${connection.id}`}>Client Secret</label>
                        <input id={`clientsecret-${connection.id}`} type="password" value={clientSecret} onChange={e => setClientSecret(e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                </>
            )}

            {connection.provider === ConnectionProvider.Twilio && (
                 <>
                    <div>
                        <label className="text-sm font-medium text-text-secondary block mb-1.5" htmlFor={`sid-${connection.id}`}>Account SID</label>
                        <input id={`sid-${connection.id}`} type="text" value={accountSid} onChange={e => setAccountSid(e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-text-secondary block mb-1.5" htmlFor={`token-${connection.id}`}>Auth Token</label>
                        <input id={`token-${connection.id}`} type="password" value={authToken} onChange={e => setAuthToken(e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-text-secondary block mb-1.5" htmlFor={`phone-${connection.id}`}>Twilio Phone Number</label>
                        <input id={`phone-${connection.id}`} type="text" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                </>
            )}
            
            {[ConnectionProvider.Vapi, ConnectionProvider.RetellAI, ConnectionProvider.OpenAI].includes(connection.provider) && (
                <div>
                    <label className="text-sm font-medium text-text-secondary block mb-1.5" htmlFor={`apikey-${connection.id}`}>API Key</label>
                    <input id={`apikey-${connection.id}`} type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" />
                </div>
            )}


            <div className="flex-grow"></div>
            <div className="flex items-center space-x-2 pt-2">
                <button 
                    onClick={handleSave}
                    disabled={!isDirty}
                    className="w-full bg-secondary hover:bg-secondary-hover text-white font-semibold py-2 px-4 rounded-lg transition disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                    Save
                </button>
                <button 
                    onClick={handleTest}
                    className="w-full bg-surface hover:bg-border text-text-primary font-semibold py-2 px-4 rounded-lg transition border border-border"
                >
                    Test
                </button>
            </div>
        </div>
    )
}

const ConnectionsScreen: React.FC = () => {
  const { connections } = useData();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Connections</h1>
        <p className="text-text-secondary mt-1">Manage your integrations with third-party services.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {connections.map(conn => (
            <ConnectionCard key={conn.id} connection={conn} />
        ))}
      </div>
    </div>
  );
};

export default ConnectionsScreen;

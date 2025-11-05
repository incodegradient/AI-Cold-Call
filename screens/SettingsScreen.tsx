import React, { useState } from 'react';
import { useAuth, useData } from '../App';

const SettingsScreen: React.FC = () => {
    const { user } = useAuth();
    const { users } = useData();
    const [currentTab, setCurrentTab] = useState('profile');

    const tabs = [
        { id: 'profile', label: 'My Profile' },
        { id: 'team', label: 'Team Members' },
        { id: 'billing', label: 'Billing' },
    ];

    const renderContent = () => {
        switch (currentTab) {
            case 'team':
                return (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Manage Team</h2>
                        <div className="bg-surface border border-border rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-border">
                                <thead className="bg-background">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Role</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {users.map(u => (
                                        <tr key={u.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">{u.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{u.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{u.role}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'billing':
                return (
                     <div>
                        <h2 className="text-xl font-semibold mb-4">Billing Information</h2>
                        <div className="bg-surface border border-border rounded-lg p-6 text-center">
                            <p className="text-text-secondary">Billing features are not yet implemented.</p>
                        </div>
                    </div>
                );
            case 'profile':
            default:
                return (
                     <div>
                        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                        <form className="bg-surface border border-border rounded-lg p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary">Full Name</label>
                                <input type="text" defaultValue={user?.name} className="mt-1 w-full bg-background border border-border rounded-md p-2" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-text-secondary">Email</label>
                                <input type="email" defaultValue={user?.email} disabled className="mt-1 w-full bg-border border-border rounded-md p-2 cursor-not-allowed" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-text-secondary">Role</label>
                                <input type="text" defaultValue={user?.role} disabled className="mt-1 w-full bg-border border-border rounded-md p-2 cursor-not-allowed" />
                            </div>
                             <div className="pt-2 text-right">
                                <button type="submit" className="bg-primary hover:bg-primary-hover px-4 py-2 rounded-lg text-sm font-semibold text-white">Save Changes</button>
                            </div>
                        </form>
                    </div>
                );
        }
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-text-primary">Settings</h1>
                <p className="text-text-secondary mt-1">Manage your account and workspace settings.</p>
            </div>
            <div className="flex border-b border-border">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setCurrentTab(tab.id)}
                        className={`px-4 py-2 text-sm font-medium ${
                            currentTab === tab.id
                                ? 'border-b-2 border-primary text-primary'
                                : 'text-text-secondary hover:text-text-primary'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="mt-6">
                {renderContent()}
            </div>
        </div>
    );
};

export default SettingsScreen;

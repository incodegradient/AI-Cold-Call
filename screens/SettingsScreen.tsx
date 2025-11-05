
import React from 'react';
// Fix: Import useAuth from App.tsx instead of App
import { useAuth } from '../App';

const SettingsScreen: React.FC = () => {
    const { user } = useAuth();
    
    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-text-primary">Settings</h1>
                <p className="text-text-secondary mt-1">Manage your account and workspace settings.</p>
            </div>

            {/* Profile Settings */}
            <div className="bg-surface border border-border rounded-lg">
                <div className="p-6 border-b border-border">
                    <h2 className="text-lg font-semibold text-text-primary">Profile</h2>
                    <p className="text-sm text-text-secondary mt-1">Update your personal information.</p>
                </div>
                <form className="p-6 space-y-4">
                    <div>
                        <label className="text-sm font-medium text-text-secondary block mb-2" htmlFor="name">Full Name</label>
                        <input
                          id="name"
                          type="text"
                          defaultValue={user?.name}
                          className="w-full max-w-sm bg-background border border-border rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-text-secondary block mb-2" htmlFor="email">Email Address</label>
                        <input
                          id="email"
                          type="email"
                          defaultValue={user?.email}
                          className="w-full max-w-sm bg-background border border-border rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                          readOnly
                        />
                         <p className="text-xs text-text-secondary mt-1">Email cannot be changed.</p>
                    </div>
                     <div className="pt-2">
                        <button type="submit" className="bg-primary hover:bg-primary-hover text-white font-semibold py-2 px-4 rounded-lg transition">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>

            {/* Other settings sections can be added here */}
             <div className="bg-surface border border-border rounded-lg">
                <div className="p-6 border-b border-border">
                    <h2 className="text-lg font-semibold text-text-primary">Billing</h2>
                    <p className="text-sm text-text-secondary mt-1">Manage your subscription and payment methods.</p>
                </div>
                <div className="p-6">
                    <p className="text-text-secondary">Billing settings are not available for this demo.</p>
                </div>
            </div>
        </div>
    );
};

export default SettingsScreen;

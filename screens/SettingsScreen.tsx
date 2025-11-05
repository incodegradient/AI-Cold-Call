import React, { useState } from 'react';
import { useAuth, useData } from '../App';
import { User, Role } from '../types';
import { TrashIcon } from '@heroicons/react/24/outline';

const SettingsScreen: React.FC = () => {
    const { user, updateUser } = useAuth();
    const { users, setUsers } = useData();
    const [name, setName] = useState(user?.name || '');
    
    // Mock DNC list for demo
    const [dncList, setDncList] = useState(['(555) 333-4444', '(555) 867-5309']);
    const [newDncNumber, setNewDncNumber] = useState('');

    const handleProfileSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (user) {
            updateUser({ ...user, name });
            alert('Profile updated successfully!');
        }
    };
    
    const handleRoleChange = (userId: string, newRole: Role) => {
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    }
    
    const handleAddDnc = () => {
        if (newDncNumber && !dncList.includes(newDncNumber)) {
            setDncList([...dncList, newDncNumber]);
            setNewDncNumber('');
        }
    }

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
                <form onSubmit={handleProfileSave} className="p-6 space-y-4">
                    <div>
                        <label className="text-sm font-medium text-text-secondary block mb-2" htmlFor="name">Full Name</label>
                        <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} className="w-full max-w-sm bg-background border border-border rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-text-secondary block mb-2" htmlFor="email">Email Address</label>
                        <input id="email" type="email" value={user?.email} className="w-full max-w-sm bg-gray-800 border border-border rounded-md px-3 py-2 text-text-secondary cursor-not-allowed" readOnly />
                         <p className="text-xs text-text-secondary mt-1">Email cannot be changed.</p>
                    </div>
                     <div className="pt-2">
                        <button type="submit" className="bg-primary hover:bg-primary-hover text-white font-semibold py-2 px-4 rounded-lg transition">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>

            {/* Role Management */}
            {user?.role !== Role.Member && (
                <div className="bg-surface border border-border rounded-lg">
                     <div className="p-6 border-b border-border">
                        <h2 className="text-lg font-semibold text-text-primary">User Management</h2>
                        <p className="text-sm text-text-secondary mt-1">Manage roles for your team members.</p>
                    </div>
                    <div className="p-6">
                        <ul className="space-y-3">
                            {users.map(u => (
                                <li key={u.id} className="flex justify-between items-center">
                                    <div>
                                        <p className="text-text-primary">{u.name}</p>
                                        <p className="text-sm text-text-secondary">{u.email}</p>
                                    </div>
                                    <select 
                                        value={u.role}
                                        onChange={(e) => handleRoleChange(u.id, e.target.value as Role)}
                                        disabled={user.role !== Role.Owner}
                                        className="bg-background border border-border rounded-md px-3 py-1.5 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed"
                                    >
                                        {Object.values(Role).map(role => <option key={role} value={role}>{role}</option>)}
                                    </select>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
            
             {/* DNC List */}
            <div className="bg-surface border border-border rounded-lg">
                <div className="p-6 border-b border-border">
                    <h2 className="text-lg font-semibold text-text-primary">Do-Not-Call List</h2>
                    <p className="text-sm text-text-secondary mt-1">Manage the global DNC list for all campaigns.</p>
                </div>
                <div className="p-6 space-y-4">
                     <div className="flex space-x-2">
                        <input type="text" value={newDncNumber} onChange={e => setNewDncNumber(e.target.value)} placeholder="(555) 555-5555" className="flex-grow bg-background border border-border rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary" />
                        <button onClick={handleAddDnc} className="bg-primary hover:bg-primary-hover text-white font-semibold py-2 px-4 rounded-lg transition">Add</button>
                    </div>
                    <ul className="space-y-2 pt-2">
                        {dncList.map(num => (
                             <li key={num} className="flex justify-between items-center bg-background p-2 rounded-md">
                                <span className="text-text-secondary font-mono">{num}</span>
                                <button onClick={() => setDncList(dncList.filter(n => n !== num))} className="text-danger hover:opacity-80"><TrashIcon className="w-5 h-5" /></button>
                             </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default SettingsScreen;

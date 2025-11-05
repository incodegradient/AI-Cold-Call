import React from 'react';
import { useAuth } from '../App';
import { Page } from '../types';
import {
    HomeIcon,
    CogIcon,
    ChartBarIcon,
    UsersIcon,
    PhoneIcon,
    BeakerIcon,
    LinkIcon,
    ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';

interface LayoutProps {
  children: React.ReactNode;
  onNavigate: (page: Page) => void;
  currentPage: Page;
}

const navItems = [
  { page: Page.Dashboard, label: 'Dashboard', icon: HomeIcon },
  { page: Page.Connections, label: 'Connections', icon: LinkIcon },
  { page: Page.Agents, label: 'Agents', icon: BeakerIcon },
  { page: Page.Leads, label: 'Leads', icon: UsersIcon },
  { page: Page.Campaigns, label: 'Campaigns', icon: PhoneIcon },
  { page: Page.Reports, label: 'Reports', icon: ChartBarIcon },
];

const settingsNav = [
    { page: Page.Settings, label: 'Settings', icon: CogIcon },
]

const Layout: React.FC<LayoutProps> = ({ children, onNavigate, currentPage }) => {
  const { user, logout } = useAuth();
  
  const getNavClassName = (page: Page) => {
    const baseClasses = "w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors";
    if (currentPage === page) {
        return `${baseClasses} bg-primary/10 text-primary`;
    }
    return `${baseClasses} text-text-secondary hover:bg-border hover:text-text-primary`;
  }

  return (
    <div className="flex h-screen bg-background text-text-primary">
      <aside className="w-64 flex-shrink-0 bg-surface border-r border-border flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-border">
          <h1 onClick={() => onNavigate(Page.Dashboard)} className="text-2xl font-display cursor-pointer">AetherDial</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map(item => (
                <button
                    key={item.label}
                    onClick={() => onNavigate(item.page)}
                    className={getNavClassName(item.page)}
                >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                </button>
            ))}
        </nav>
        <div className="px-4 py-4 border-t border-border">
             {settingsNav.map(item => (
                <button
                    key={item.label}
                    onClick={() => onNavigate(item.page)}
                    className={`${getNavClassName(item.page)} mb-2`}
                >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                </button>
            ))}
            <div className="flex items-center p-2 rounded-lg hover:bg-border transition-colors">
                <div className="w-9 h-9 rounded-full bg-border flex items-center justify-center font-bold text-primary-hover">
                    {user?.name.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3">
                    <p className="text-sm font-semibold">{user?.name}</p>
                    <p className="text-xs text-text-secondary">{user?.role}</p>
                </div>
                <button onClick={logout} className="ml-auto text-text-secondary hover:text-danger p-2 rounded-md">
                    <ArrowLeftOnRectangleIcon className="w-5 h-5"/>
                </button>
            </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
            {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;

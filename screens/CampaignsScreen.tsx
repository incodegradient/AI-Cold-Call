
import React from 'react';
import { Campaign, AgentPlatform } from '../types';

const mockCampaigns: Campaign[] = [
  { id: '1', name: 'Summer Sales Push', platform: AgentPlatform.Vapi, agentId: '1', leadListId: '1', status: 'Active', schedule: { start: '9am', end: '5pm', weekdays: [1,2,3,4,5] }, pacing: { gapMinutes: 5, maxConcurrent: 10 }, stats: { totalLeads: 500, attempted: 250, connected: 120, avgTalkTime: 2.1, bookings: 20 } },
  { id: '2', name: 'Q4 Lead Gen', platform: AgentPlatform.Retell, agentId: '2', leadListId: '2', status: 'Paused', schedule: { start: '10am', end: '4pm', weekdays: [1,2,3] }, pacing: { gapMinutes: 10, maxConcurrent: 5 }, stats: { totalLeads: 1000, attempted: 400, connected: 150, avgTalkTime: 1.8, bookings: 15 } },
  { id: '3', name: 'New Feature Outreach', platform: AgentPlatform.Vapi, agentId: '3', leadListId: '3', status: 'Completed', schedule: { start: '9am', end: '5pm', weekdays: [1,2,3,4,5] }, pacing: { gapMinutes: 3, maxConcurrent: 15 }, stats: { totalLeads: 200, attempted: 200, connected: 180, avgTalkTime: 2.5, bookings: 35 } },
  { id: '4', name: 'Website Visitor Follow-up', platform: AgentPlatform.Vapi, agentId: '1', leadListId: '4', status: 'Draft', schedule: { start: '9am', end: '5pm', weekdays: [1,2,3,4,5] }, pacing: { gapMinutes: 5, maxConcurrent: 10 }, stats: { totalLeads: 50, attempted: 0, connected: 0, avgTalkTime: 0, bookings: 0 } },
];

const statusColors = {
    Active: 'text-green-400',
    Paused: 'text-yellow-400',
    Completed: 'text-blue-400',
    Draft: 'text-gray-400',
};

const CampaignsScreen: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-text-primary">Campaigns</h1>
            <p className="text-text-secondary mt-1">Launch and monitor your outbound call campaigns.</p>
        </div>
        <button className="bg-primary hover:bg-primary-hover text-white font-semibold py-2 px-4 rounded-lg transition">
            New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockCampaigns.map(campaign => (
          <div key={campaign.id} className="bg-surface border border-border rounded-lg p-6">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold text-text-primary">{campaign.name}</h2>
                    <p className={`font-semibold text-sm mt-1 ${statusColors[campaign.status]}`}>{campaign.status}</p>
                </div>
                <div className="flex space-x-2">
                    {/* Placeholder actions */}
                    <button className="text-text-secondary hover:text-primary p-1">...</button>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border">
                <div className="flex justify-between items-center">
                    <span className="text-text-primary font-medium">{campaign.stats.attempted} / {campaign.stats.totalLeads} Leads Called</span>
                    <span className="text-text-secondary text-sm">{((campaign.stats.attempted / campaign.stats.totalLeads) * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-background rounded-full h-2 mt-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${(campaign.stats.attempted / campaign.stats.totalLeads) * 100}%` }}></div>
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
    </div>
  );
};

export default CampaignsScreen;

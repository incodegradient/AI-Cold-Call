
import React from 'react';
import { Page } from '../types';

interface LandingScreenProps {
  onNavigate: (page: Page) => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-[#111827] text-white">
      <header className="container mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-display">AetherDial</h1>
        <nav className="space-x-6 flex items-center">
          <a href="#" className="text-text-secondary hover:text-white transition">Features</a>
          <a href="#" className="text-text-secondary hover:text-white transition">Pricing</a>
          <button 
            onClick={() => onNavigate(Page.Login)}
            className="text-text-secondary hover:text-white transition"
          >
            Log In
          </button>
          <button 
            onClick={() => onNavigate(Page.Signup)}
            className="bg-primary hover:bg-primary-hover text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Sign Up Free
          </button>
        </nav>
      </header>
      
      <main className="container mx-auto px-6 text-center pt-24 pb-16">
        <h2 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-4">
          Automate Your Outreach with AI Voice
        </h2>
        <p className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto mb-8">
          Launch intelligent, human-like call campaigns in minutes. Connect your tools, define your agents, and watch your results soar. AetherDial is the ultimate platform for modern sales and support teams.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => onNavigate(Page.Signup)}
            className="bg-primary hover:bg-primary-hover text-white font-semibold py-3 px-8 rounded-lg text-lg transition"
          >
            Get Started
          </button>
          <button
            className="bg-surface hover:bg-border text-text-primary font-semibold py-3 px-8 rounded-lg text-lg transition"
          >
            Request a Demo
          </button>
        </div>
      </main>

      <div className="container mx-auto px-6 py-16">
        <div className="bg-surface/50 border border-border rounded-xl shadow-2xl overflow-hidden">
          <div className="p-2 bg-background border-b border-border flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <img src="https://picsum.photos/seed/dashboard/1200/600" alt="Dashboard preview" className="w-full h-auto" />
        </div>
      </div>
    </div>
  );
};

export default LandingScreen;

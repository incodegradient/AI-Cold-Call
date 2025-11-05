
import React from 'react';

const ReportsScreen: React.FC = () => {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-text-primary">Reports</h1>
                <p className="text-text-secondary mt-1">Analyze your campaign performance and generate reports.</p>
            </div>
            <div className="bg-surface border border-border rounded-lg p-12 text-center">
                <h2 className="text-xl font-semibold text-text-primary">Reporting Feature Coming Soon</h2>
                <p className="text-text-secondary mt-2 max-w-md mx-auto">
                    We're working on detailed analytics and customizable reports. Check back soon for updates!
                </p>
            </div>
        </div>
    );
};

export default ReportsScreen;

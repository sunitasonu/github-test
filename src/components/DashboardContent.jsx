
import React from 'react';
import MetricsCards from '@/components/MetricsCards';
import ChartsSection from '@/components/ChartsSection';
import DataTable from '@/components/DataTable';

const DashboardContent = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">Welcome back! Here's what's happening with your business today.</p>
      </div>
      
      <MetricsCards />
      <ChartsSection />
      <DataTable />
    </div>
  );
};

export default DashboardContent;

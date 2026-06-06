import React, { useEffect, useState } from 'react';
import { apiClient } from '../../services/apiClient';

const DashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await apiClient.get('/dashboard/metrics');
        setMetrics(response.data);
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (isLoading) {
    return <div className="text-center py-12">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium">Total Vendors</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{metrics?.totalVendors || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium">Active RFQs</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{metrics?.activeRFQs || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium">Pending Quotations</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{metrics?.pendingQuotations || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium">Issued POs</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{metrics?.issuedPOs || 0}</p>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium">Overdue Invoices</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{metrics?.overdueInvoices || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm font-medium">Total Spend</p>
          <p className="text-3xl font-bold text-green-600 mt-2">₹{(metrics?.totalSpend || 0).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

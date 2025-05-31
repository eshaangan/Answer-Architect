import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface AnalyticsData {
  total_requests: number;
  requests_24h: number;
  unique_users: number;
  model_usage: Array<{ model: string; count: number }>;
  mock_mode: boolean;
  uptime_seconds: number;
  database_available?: boolean;
  error?: string;
}

export const AnalyticsDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAnalytics();
      setAnalytics(data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    // Refresh every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours}h ${minutes}m ${secs}s`;
  };

  if (loading && !analytics) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics Dashboard</h3>
        <div className="text-red-600 text-sm">{error}</div>
        <button
          onClick={fetchAnalytics}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Analytics Dashboard</h3>
        <button
          onClick={fetchAnalytics}
          disabled={loading}
          className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Database status warning */}
      {!analytics.database_available && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-yellow-800">Database Not Connected</p>
              <p className="text-sm text-yellow-700">Analytics are limited to basic system information. Connect a PostgreSQL database for detailed usage tracking.</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{analytics.total_requests}</div>
          <div className="text-sm text-blue-800">Total Requests</div>
          {!analytics.database_available && (
            <div className="text-xs text-blue-600 mt-1">*Requires database</div>
          )}
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{analytics.requests_24h}</div>
          <div className="text-sm text-green-800">Last 24 Hours</div>
          {!analytics.database_available && (
            <div className="text-xs text-green-600 mt-1">*Requires database</div>
          )}
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">{analytics.unique_users}</div>
          <div className="text-sm text-purple-800">Unique Users</div>
          {!analytics.database_available && (
            <div className="text-xs text-purple-600 mt-1">*Requires database</div>
          )}
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">{formatUptime(analytics.uptime_seconds)}</div>
          <div className="text-sm text-orange-800">Uptime</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-3">Model Usage</h4>
          <div className="space-y-2">
            {analytics.model_usage.map((model, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="text-sm font-medium text-gray-700">{model.model}</span>
                <span className="text-sm text-gray-600">
                  {model.count} request{model.count !== 1 ? 's' : ''}
                  {!analytics.database_available && model.count === 0 && (
                    <span className="text-xs text-gray-500 ml-1">(configured)</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-md font-semibold text-gray-900 mb-3">System Status</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="text-sm font-medium text-gray-700">Mode</span>
              <span className={`text-sm px-2 py-1 rounded ${
                analytics.mock_mode 
                  ? 'bg-yellow-100 text-yellow-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {analytics.mock_mode ? 'Mock' : 'Live'}
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="text-sm font-medium text-gray-700">API Status</span>
              <span className="text-sm px-2 py-1 rounded bg-green-100 text-green-800">
                Healthy
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <span className="text-sm font-medium text-gray-700">Database</span>
              <span className={`text-sm px-2 py-1 rounded ${
                analytics.database_available 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {analytics.database_available ? 'Connected' : 'Not Connected'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {analytics.error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{analytics.error}</p>
        </div>
      )}
    </div>
  );
}; 
import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/dashboard/layout";
import StatusOverview from "@/components/dashboard/status-overview";
import ActiveAlerts from "@/components/dashboard/active-alerts";
import PerformanceChart from "@/components/dashboard/performance-chart";
import SitesTable from "@/components/dashboard/sites-table";
import AIInsights from "@/components/dashboard/ai-insights";
import { SelfHealingDashboard } from "@/components/dashboard/self-healing-dashboard";
import { LiveAlerts } from "@/components/alerts/live-alerts";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const queryClient = useQueryClient();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  
  // Auto-refresh logic
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (autoRefresh) {
      intervalId = setInterval(() => {
        refreshData();
      }, refreshInterval * 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoRefresh, refreshInterval]);
  
  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
    queryClient.invalidateQueries({ queryKey: ['/api/alerts'] });
    queryClient.invalidateQueries({ queryKey: ['/api/sites'] });
    queryClient.invalidateQueries({ queryKey: ['/api/ai-insights'] });
    setLastRefreshed(new Date());
  };
  
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery<any>({
    queryKey: ['/api/stats'],
    refetchInterval: autoRefresh ? refreshInterval * 1000 : false,
  });

  const defaultStats = {
    websitesCount: 0,
    websitesGrowth: 0,
    averageUptime: 0,
    uptimeChange: 0,
    alertsCount: 0,
    alertsChange: 0,
    avgResponseTime: 0,
    responseTimeChange: 0
  };

  return (
    <DashboardLayout title="Dashboard | Alertify">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Alertify</span>
          </h1>
          <p className="text-gray-500 mt-2">Your real-time website and application monitoring dashboard</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center mb-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center mr-2"
              onClick={refreshData}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh Now
            </Button>
            <Button
              variant={autoRefresh ? "default" : "outline"}
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className="flex items-center space-x-1"
            >
              <span className={`w-2 h-2 rounded-full ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></span>
              <span>{autoRefresh ? "Auto-refreshing" : "Auto-refresh off"}</span>
            </Button>
          </div>
          <div className="text-xs text-gray-500">
            Last updated: {lastRefreshed.toLocaleTimeString()}
            {autoRefresh && (
              <span> · Refreshing every {refreshInterval} seconds</span>
            )}
          </div>
        </div>
      </div>
      <StatusOverview stats={stats || defaultStats} />

      <div className="grid grid-cols-1 gap-6 mb-6 lg:grid-cols-3">
        <ActiveAlerts />
        <PerformanceChart />
        <LiveAlerts />
      </div>

      <SitesTable />

      <div className="mt-6 mb-6">
        <AIInsights />
      </div>
      
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Self-Healing Controls</h2>
        <SelfHealingDashboard />
      </div>
    </DashboardLayout>
  );
}

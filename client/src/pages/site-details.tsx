import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "wouter";
import DashboardLayout from "@/components/dashboard/layout";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SimpleLineChart, colors } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

// Generate sample data until actual API endpoint is working
const generateSampleData = (days: number) => {
  const data = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    
    data.push({
      time: format(date, 'MMM dd HH:mm'),
      responseTime: Math.round(200 + Math.random() * 300),
      errors: Math.random() > 0.9 ? 1 : 0
    });
  }
  
  return data;
};

export default function SiteDetailsPage() {
  const [, params] = useRoute<{ id: string }>("/sites/:id");
  const siteId = parseInt(params?.id || "0");
  const [activeTab, setActiveTab] = useState("overview");
  
  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/sites/${siteId}`],
  });

  if (isLoading) {
    return (
      <DashboardLayout title="Site Details">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="h-40 bg-gray-200 rounded"></div>
            <div className="h-40 bg-gray-200 rounded md:col-span-2"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Site Details">
        <div className="bg-danger-50 border border-danger-200 p-4 rounded-md">
          <p className="text-danger-700">Error loading site details: {(error as Error).message}</p>
        </div>
      </DashboardLayout>
    );
  }

  const site = data?.site;
  const stats = data?.stats;
  const chartData = generateSampleData(7);

  if (!site) {
    return (
      <DashboardLayout title="Site Details">
        <div className="bg-warning-50 border border-warning-200 p-4 rounded-md">
          <p className="text-warning-700">Site not found</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={`${site.name} Details`}>
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <div className="flex items-center mb-2">
              <h1 className="text-2xl font-semibold text-gray-900 mr-3">{site.name}</h1>
              <StatusBadge 
                status={stats?.uptimePercentage > 99 ? "success" : stats?.uptimePercentage > 98 ? "warning" : "error"} 
              />
            </div>
            <p className="text-gray-500">{site.url}</p>
          </div>
          
          <div className="mt-4 md:mt-0 space-x-2">
            <Button variant="outline">
              <span className="material-icons text-sm mr-2">refresh</span>
              Check Now
            </Button>
            <Button variant="outline" className="bg-danger-50 text-danger-600 hover:bg-danger-100 border-danger-200">
              <span className="material-icons text-sm mr-2">pause</span>
              Pause Monitoring
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="uptime">Uptime</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500">Uptime (Last 30 days)</p>
              <p className="text-2xl font-semibold mt-1">{stats?.uptimePercentage.toFixed(2)}%</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500">Avg. Response Time</p>
              <p className="text-2xl font-semibold font-mono mt-1">{stats?.avgResponseTime}ms</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500">Checks</p>
              <p className="text-2xl font-semibold mt-1">
                Every {site.checkFrequency} min
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({Math.floor(24 * 60 / site.checkFrequency)} daily)
                </span>
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-500">Active Alerts</p>
              <p className="text-2xl font-semibold mt-1">
                {data?.activeAlerts?.length || 0}
              </p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4">Response Time (Last 7 Days)</h2>
            <SimpleLineChart
              data={chartData}
              lines={[
                { dataKey: "responseTime", stroke: colors.primary, name: "Response Time" }
              ]}
              xAxisDataKey="time"
              unit="ms"
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium mb-4">Recent Alerts</h2>
              {data?.activeAlerts?.length ? (
                <ul className="divide-y divide-gray-200">
                  {data.activeAlerts.slice(0, 5).map((alert: any) => (
                    <li key={alert.id} className="py-3">
                      <div className="flex items-start">
                        <span className={`material-icons ${
                          alert.type === 'error' ? 'text-danger-500' : 
                          alert.type === 'warning' ? 'text-warning-500' : 'text-gray-500'
                        }`}>
                          {alert.type === 'error' ? 'error' : 'warning'}
                        </span>
                        <div className="ml-3">
                          <p className="text-sm font-medium">{alert.message}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(alert.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 py-6 text-center">No recent alerts</p>
              )}
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium mb-4">Recent Checks</h2>
              {data?.checkResults?.length ? (
                <ul className="divide-y divide-gray-200">
                  {data.checkResults.slice(0, 5).map((check: any) => (
                    <li key={check.id} className="py-3">
                      <div className="flex items-start">
                        <span className={`material-icons ${
                          check.status === 'error' ? 'text-danger-500' : 
                          check.status === 'warning' ? 'text-warning-500' : 'text-success-500'
                        }`}>
                          {check.status === 'error' ? 'error' : 
                           check.status === 'warning' ? 'warning' : 'check_circle'}
                        </span>
                        <div className="ml-3">
                          <p className="text-sm font-medium">
                            Status: {check.statusCode} 
                            <span className="font-mono text-gray-500 ml-2">
                              {check.responseTime}ms
                            </span>
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(check.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 py-6 text-center">No recent checks</p>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="uptime">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4">Uptime History</h2>
            <p className="text-gray-500">Detailed uptime information would be displayed here.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="performance">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4">Performance Metrics</h2>
            <p className="text-gray-500">Detailed performance metrics would be displayed here.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="alerts">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4">Alert History</h2>
            <p className="text-gray-500">Alert history would be displayed here.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4">Site Settings</h2>
            <p className="text-gray-500">Settings would be displayed here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}

import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/dashboard/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/ui/status-badge";
import { SimpleLineChart, colors } from "@/components/ui/chart";
import { format } from "date-fns";

// Generate sample data for demonstration
const generateAlertData = (days: number) => {
  const data = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    
    data.push({
      time: format(date, 'MMM dd'),
      alerts: Math.floor(Math.random() * 5)
    });
  }
  
  return data;
};

export default function AlertsPage() {
  const [activeTab, setActiveTab] = useState("active");
  const chartData = generateAlertData(14);
  
  const { data: alerts, isLoading, error } = useQuery({
    queryKey: ['/api/alerts'],
  });
  
  if (isLoading) {
    return (
      <DashboardLayout title="Alerts | Alertify">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 gap-6 mb-6">
            <div className="h-40 bg-gray-200 rounded"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (error) {
    return (
      <DashboardLayout title="Alerts | Alertify">
        <div className="bg-danger-50 border border-danger-200 p-4 rounded-md">
          <p className="text-danger-700">Error loading alerts: {(error as Error).message}</p>
        </div>
      </DashboardLayout>
    );
  }
  
  // Filter alerts based on the active tab
  const getFilteredAlerts = () => {
    if (!alerts) return [];
    
    switch (activeTab) {
      case "active":
        return alerts.filter((alert: any) => alert.status === "active");
      case "resolved":
        return alerts.filter((alert: any) => alert.status === "resolved");
      case "all":
      default:
        return alerts;
    }
  };
  
  const filteredAlerts = getFilteredAlerts();
  
  return (
    <DashboardLayout title="Alerts | Alertify">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Alerts</span> Management
        </h1>
        <p className="text-gray-500 mt-2">Manage and respond to alerts across all your monitored websites and applications</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{alerts?.length || 0}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{alerts?.filter((a: any) => a.status === 'active').length || 0}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Resolved Today</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{alerts?.filter((a: any) => a.status === 'resolved' && new Date(a.resolvedAt).toDateString() === new Date().toDateString()).length || 0}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Avg. Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">27m</p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Alert Trends (Last 14 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <SimpleLineChart
            data={chartData}
            height={300}
            lines={[
              { dataKey: "alerts", stroke: colors.danger, name: "Alerts" }
            ]}
            xAxisDataKey="time"
          />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle>Alert History</CardTitle>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="resolved">Resolved</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredAlerts.length > 0 ? (
            <div className="divide-y">
              {filteredAlerts.map((alert: any) => (
                <div key={alert.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <span className={`material-icons mt-1 ${
                        alert.type === 'error' ? 'text-red-500' : 
                        alert.type === 'warning' ? 'text-amber-500' : 'text-blue-500'
                      }`}>
                        {alert.type === 'error' ? 'error' : 
                         alert.type === 'warning' ? 'warning' : 'info'}
                      </span>
                      <div className="ml-3">
                        <h4 className="font-medium">{alert.message}</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          Site: {alert.siteName || `Site ID: ${alert.siteId}`} • 
                          {alert.status === 'active' ? 
                            ` Triggered ${format(new Date(alert.timestamp), 'MMM dd, yyyy HH:mm')}` : 
                            ` Resolved ${format(new Date(alert.resolvedAt), 'MMM dd, yyyy HH:mm')}`
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <StatusBadge status={alert.status} className="mr-3" />
                      {alert.status === 'active' && (
                        <Button size="sm" variant="outline">
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-500">No alerts found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/dashboard/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SimpleAreaChart, SimpleLineChart, colors } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, subDays } from "date-fns";

// Generate sample data for demonstration 
const generateUptimeData = (days: number) => {
  const data = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    
    data.push({
      time: format(date, 'MMM dd'),
      uptime: 99.7 + (Math.random() * 0.3),
      responseTime: 250 + Math.floor(Math.random() * 100)
    });
  }
  
  return data;
};

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("30");
  const [exportFormat, setExportFormat] = useState("pdf");
  
  const chartData = generateUptimeData(parseInt(timeRange));
  
  const { data: sites } = useQuery({
    queryKey: ['/api/sites'],
  });
  
  return (
    <DashboardLayout title="Reports | Alertify">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Performance</span> Reports
        </h1>
        <p className="text-gray-500 mt-2">Analyze performance metrics and generate detailed reports</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between mb-6">
        <div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="uptime">Uptime</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">Time Range:</span>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-28">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-2">Export:</span>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger className="w-28">
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button variant="outline" size="sm">
            <span className="material-icons text-sm mr-2">download</span>
            Export
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-0">
        <TabsContent value="overview" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Average Uptime</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end">
                  <p className="text-2xl font-bold">99.98%</p>
                  <span className="text-xs font-medium text-green-600 ml-2 mb-1">+0.05%</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Average Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end">
                  <p className="text-2xl font-bold">268ms</p>
                  <span className="text-xs font-medium text-red-600 ml-2 mb-1">+12ms</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Total Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end">
                  <p className="text-2xl font-bold">24</p>
                  <span className="text-xs font-medium text-green-600 ml-2 mb-1">-6</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Uptime Performance (Last {timeRange} Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleLineChart
                data={chartData}
                height={300}
                lines={[
                  { dataKey: "uptime", stroke: colors.success, name: "Uptime %" }
                ]}
                xAxisDataKey="time"
                unit="%"
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Response Time Trends (Last {timeRange} Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleAreaChart
                data={chartData}
                height={300}
                areas={[
                  { dataKey: "responseTime", fill: "rgba(59, 130, 246, 0.2)", stroke: colors.primary, name: "Avg. Response Time" }
                ]}
                xAxisDataKey="time"
                unit="ms"
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Site Performance Comparison</CardTitle>
              <Button variant="outline" size="sm">View All</Button>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {sites && sites.slice(0, 5).map((site: any) => (
                  <div key={site.id} className="py-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{site.name}</h4>
                      <p className="text-sm text-gray-500">{site.url}</p>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Uptime</p>
                        <p className="font-medium text-green-600">
                          {(99.5 + Math.random() * 0.5).toFixed(2)}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Resp. Time</p>
                        <p className="font-medium">
                          {Math.floor(200 + Math.random() * 300)}ms
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Alerts</p>
                        <p className="font-medium">
                          {Math.floor(Math.random() * 5)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="uptime" className="space-y-6 mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Uptime Report</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center py-12 text-gray-500">Detailed uptime analytics would be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-6 mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center py-12 text-gray-500">Detailed performance metrics would be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="alerts" className="space-y-6 mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Alert Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center py-12 text-gray-500">Detailed alert analytics would be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
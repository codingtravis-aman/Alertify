import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SimpleLineChart, colors } from "@/components/ui/chart";
import { format } from "date-fns";

// Sample data until real data is fetched
const generateSampleData = (days: number) => {
  const data = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    
    data.push({
      time: format(date, 'MMM dd'),
      responseTime: Math.round(200 + Math.random() * 300),
      errors: Math.round(Math.random() * 5)
    });
  }
  
  return data;
};

interface PerformanceChartProps {
  siteId?: number;
}

export default function PerformanceChart({ siteId }: PerformanceChartProps) {
  const [timeRange, setTimeRange] = useState<string>("24h");
  
  // Calculate days based on timeRange
  const getDaysFromTimeRange = (range: string): number => {
    switch (range) {
      case "7d": return 7;
      case "30d": return 30;
      default: return 1; // 24h
    }
  };
  
  const days = getDaysFromTimeRange(timeRange);
  
  // Query endpoint for chart data
  const { data, isLoading, error } = useQuery({
    queryKey: [siteId ? `/api/sites/${siteId}/check-results` : '/api/stats/performance', { days }],
    enabled: false, // Disable for now and use sample data
  });
  
  // Use sample data for now
  const chartData = generateSampleData(days);
  
  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeRange(e.target.value);
  };
  
  // Metrics calculated from chart data
  const avgResponse = Math.round(chartData.reduce((sum, item) => sum + item.responseTime, 0) / chartData.length);
  const peakResponse = Math.round(Math.max(...chartData.map(item => item.responseTime)));
  const errorRate = parseFloat((chartData.reduce((sum, item) => sum + item.errors, 0) / (chartData.length * 5) * 100).toFixed(1));
  
  return (
    <div className="bg-white rounded-lg shadow lg:col-span-2">
      <div className="px-5 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Performance Metrics</h3>
          <div className="inline-flex space-x-3">
            <select 
              className="text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              value={timeRange}
              onChange={handleTimeRangeChange}
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
          </div>
        </div>
      </div>
      <div className="p-5">
        <div className="chart-container">
          <SimpleLineChart
            data={chartData}
            lines={[
              { dataKey: "responseTime", stroke: colors.primary, name: "Response Time" }
            ]}
            xAxisDataKey="time"
            unit="ms"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6 sm:grid-cols-4">
          <div className="border border-gray-200 rounded-md p-3">
            <p className="text-sm font-medium text-gray-500">Avg Response</p>
            <p className="mt-1 text-lg font-semibold text-gray-900 font-mono">{avgResponse}ms</p>
          </div>
          <div className="border border-gray-200 rounded-md p-3">
            <p className="text-sm font-medium text-gray-500">Peak Response</p>
            <p className="mt-1 text-lg font-semibold text-gray-900 font-mono">{peakResponse}ms</p>
          </div>
          <div className="border border-gray-200 rounded-md p-3">
            <p className="text-sm font-medium text-gray-500">Error Rate</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">{errorRate}%</p>
          </div>
          <div className="border border-gray-200 rounded-md p-3">
            <p className="text-sm font-medium text-gray-500">Uptime</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">99.8%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

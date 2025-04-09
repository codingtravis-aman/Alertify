import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: string;
  iconBgColor: string;
  iconColor: string;
  title: string;
  value: string | number;
  change?: number;
  isMonoFont?: boolean;
}

function StatCard({ 
  icon, 
  iconBgColor, 
  iconColor, 
  title, 
  value, 
  change, 
  isMonoFont = false 
}: StatCardProps) {
  const changeIsPositive = change && change > 0;
  const changeColor = changeIsPositive ? "text-success-500" : "text-danger-500";
  const changeIcon = changeIsPositive ? "arrow_upward" : "arrow_downward";
  
  // Special case for response time where down is good
  const responseTimeChange = title.includes("Response Time") ? !changeIsPositive : changeIsPositive;
  const responseTimeColor = responseTimeChange ? "text-success-500" : "text-danger-500";
  
  return (
    <div className="overflow-hidden bg-white rounded-lg shadow">
      <div className="p-5">
        <div className="flex items-center">
          <div className={cn("flex-shrink-0 p-3 rounded-md", iconBgColor)}>
            <span className={cn("material-icons", iconColor)}>{icon}</span>
          </div>
          <div className="flex-1 w-0 ml-5">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-center">
                <div className={cn("text-2xl font-semibold text-gray-900", isMonoFont && "font-mono")}>
                  {value}
                </div>
                {change !== undefined && (
                  <div className={cn("flex items-center ml-2 text-sm", 
                    title.includes("Response Time") ? responseTimeColor : changeColor
                  )}>
                    <span className="material-icons text-sm">{changeIcon}</span>
                    <span>{Math.abs(change)}{title.includes("Time") ? "ms" : "%"}</span>
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatusOverviewProps {
  stats: any;
}

export default function StatusOverview({ stats }: StatusOverviewProps) {
  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 gap-5 mt-2 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon="monitor"
          iconBgColor="bg-primary-100"
          iconColor="text-primary-600"
          title="Websites Monitored"
          value={stats.websitesCount}
          change={stats.websitesGrowth}
        />
        
        <StatCard
          icon="verified"
          iconBgColor="bg-success-100"
          iconColor="text-success-500"
          title="Average Uptime"
          value={`${stats.averageUptime}%`}
          change={stats.uptimeChange}
        />
        
        <StatCard
          icon="notifications"
          iconBgColor="bg-warning-100"
          iconColor="text-warning-500"
          title="Alerts (Last 24h)"
          value={stats.alertsCount}
          change={stats.alertsChange}
        />
        
        <StatCard
          icon="speed"
          iconBgColor="bg-gray-100"
          iconColor="text-gray-600"
          title="Avg Response Time"
          value={`${stats.avgResponseTime}ms`}
          change={stats.responseTimeChange}
          isMonoFont={true}
        />
      </div>
    </div>
  );
}

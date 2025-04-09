import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import type { Alert } from "@shared/schema";

interface AlertItemProps {
  alert: Alert;
  onViewClick: (alertId: number) => void;
}

function AlertItem({ alert, onViewClick }: AlertItemProps) {
  // Determine icon based on alert type
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <span className="material-icons text-danger-600">error</span>;
      case 'warning':
        return <span className="material-icons text-warning-500">warning</span>;
      case 'performance':
        return <span className="material-icons text-warning-400">speed</span>;
      default:
        return <span className="material-icons text-gray-500">info</span>;
    }
  };

  const timeAgo = formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true });

  return (
    <li className="px-5 py-4 hover:bg-gray-50">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {getAlertIcon(alert.type)}
        </div>
        <div className="flex-1 min-w-0 ml-4">
          <p className="text-sm font-medium text-gray-900 truncate">{alert.message}</p>
          <p className="text-sm text-gray-500">Site ID: {alert.siteId}</p>
          <div className="flex items-center mt-1">
            <span className="text-xs text-gray-500">{timeAgo}</span>
            {alert.assignedTo && (
              <>
                <span className="material-icons text-gray-400 text-xs ml-2 mr-1">person</span>
                <span className="text-xs text-gray-500">Assigned</span>
              </>
            )}
            {!alert.assignedTo && (
              <>
                <span className="material-icons text-gray-400 text-xs ml-2 mr-1">person</span>
                <span className="text-xs text-gray-500">Unassigned</span>
              </>
            )}
          </div>
        </div>
        <div className="flex-shrink-0 ml-4">
          <button 
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
            onClick={() => onViewClick(alert.id)}
          >
            View
          </button>
        </div>
      </div>
    </li>
  );
}

interface ActiveAlertsProps {
  limit?: number;
}

export default function ActiveAlerts({ limit = 5 }: ActiveAlertsProps) {
  const { data: alerts, isLoading, error } = useQuery<Alert[]>({
    queryKey: ['/api/alerts?status=active'],
    refetchInterval: 15000, // Auto refresh every 15 seconds
  });

  const handleViewAlert = (alertId: number) => {
    // Navigate to alert details or show modal
    console.log(`View alert: ${alertId}`);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow lg:col-span-1">
        <div className="px-5 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Active Alerts</h3>
            <div className="animate-pulse w-16 h-6 bg-gray-200 rounded-full"></div>
          </div>
        </div>
        <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
          {[...Array(3)].map((_, i) => (
            <li key={i} className="px-5 py-4">
              <div className="animate-pulse flex items-center">
                <div className="flex-shrink-0 w-6 h-6 bg-gray-200 rounded-full"></div>
                <div className="flex-1 ml-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow lg:col-span-1 p-5">
        <p className="text-danger-500">Error loading alerts: {(error as Error).message}</p>
      </div>
    );
  }

  const displayAlerts = alerts?.slice(0, limit) || [];
  const criticalCount = displayAlerts.filter(alert => alert.type === 'error').length;

  return (
    <div className="bg-white rounded-lg shadow lg:col-span-1">
      <div className="px-5 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Active Alerts</h3>
          {criticalCount > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-danger-100 text-danger-800">
              {criticalCount} Critical
            </span>
          )}
        </div>
      </div>
      <ul className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {displayAlerts.length > 0 ? (
          displayAlerts.map((alert: Alert) => (
            <AlertItem key={alert.id} alert={alert} onViewClick={handleViewAlert} />
          ))
        ) : (
          <li className="px-5 py-6 text-center text-gray-500">
            <span className="material-icons text-gray-400 block mx-auto mb-2">
              notifications_off
            </span>
            No active alerts
          </li>
        )}
      </ul>
      <div className="px-5 py-3 bg-gray-50 text-right">
        <Link href="/alerts" className="text-sm font-medium text-primary-600 hover:text-primary-700">
          View all alerts →
        </Link>
      </div>
    </div>
  );
}

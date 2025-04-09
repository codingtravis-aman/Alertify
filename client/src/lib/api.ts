import { apiRequest } from "./queryClient";
import type { 
  Site, 
  InsertSite, 
  Alert, 
  CheckResult, 
  UptimeStat 
} from "@shared/schema";

// Sites API
export async function fetchSites(): Promise<Site[]> {
  const response = await apiRequest("GET", "/api/sites", undefined);
  return response.json();
}

export async function fetchSite(id: number): Promise<{
  site: Site;
  stats: UptimeStat;
  activeAlerts: Alert[];
  checkResults: CheckResult[];
}> {
  const response = await apiRequest("GET", `/api/sites/${id}`, undefined);
  return response.json();
}

export async function createSite(site: InsertSite): Promise<Site> {
  const response = await apiRequest("POST", "/api/sites", site);
  return response.json();
}

export async function updateSite(id: number, site: Partial<Site>): Promise<Site> {
  const response = await apiRequest("PUT", `/api/sites/${id}`, site);
  return response.json();
}

export async function deleteSite(id: number): Promise<void> {
  await apiRequest("DELETE", `/api/sites/${id}`, undefined);
}

// Alerts API
export async function fetchAlerts(status?: string): Promise<Alert[]> {
  const url = status ? `/api/alerts?status=${status}` : "/api/alerts";
  const response = await apiRequest("GET", url, undefined);
  return response.json();
}

export async function fetchSiteAlerts(siteId: number, status?: string): Promise<Alert[]> {
  const url = status ? 
    `/api/sites/${siteId}/alerts?status=${status}` : 
    `/api/sites/${siteId}/alerts`;
  const response = await apiRequest("GET", url, undefined);
  return response.json();
}

export async function updateAlert(id: number, alert: Partial<Alert>): Promise<Alert> {
  const response = await apiRequest("PATCH", `/api/alerts/${id}`, alert);
  return response.json();
}

// Check results API
export async function fetchSiteCheckResults(siteId: number, limit?: number): Promise<CheckResult[]> {
  const url = limit ? 
    `/api/sites/${siteId}/check-results?limit=${limit}` : 
    `/api/sites/${siteId}/check-results`;
  const response = await apiRequest("GET", url, undefined);
  return response.json();
}

// Uptime stats API
export async function fetchSiteUptimeStats(siteId: number): Promise<UptimeStat[]> {
  const response = await apiRequest("GET", `/api/sites/${siteId}/uptime-stats`, undefined);
  return response.json();
}

// Dashboard stats API
export async function fetchDashboardStats(): Promise<{
  websitesCount: number;
  websitesGrowth: number;
  averageUptime: number;
  uptimeChange: number;
  alertsCount: number;
  alertsChange: number;
  avgResponseTime: number;
  responseTimeChange: number;
}> {
  const response = await apiRequest("GET", "/api/stats", undefined);
  return response.json();
}

// AI insights API
export async function fetchAiInsights(limit?: number): Promise<any[]> {
  const url = limit ? `/api/ai-insights?limit=${limit}` : "/api/ai-insights";
  const response = await apiRequest("GET", url, undefined);
  return response.json();
}

export async function fetchSiteAiInsights(siteId: number): Promise<any[]> {
  const response = await apiRequest("GET", `/api/sites/${siteId}/ai-insights`, undefined);
  return response.json();
}

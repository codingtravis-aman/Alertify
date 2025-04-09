/**
 * Self-Healing Module for Alertify
 * 
 * This module provides automatic remediation capabilities for common 
 * monitoring and infrastructure issues detected in monitored sites.
 */

import { queryClient } from "./queryClient";
import { updateSite } from "./api";
import type { Site, Alert } from "../types";

// Types of issues that can be automatically remediated
export type SelfHealingIssueType = 
  | "connection_timeout" 
  | "dns_resolution" 
  | "certificate_expiry" 
  | "resource_overload"
  | "http_500"
  | "memory_leak"
  | "database_connection"
  | "rate_limiting";

// Map of issues to their remediation strategies
export const remediationStrategies: Record<SelfHealingIssueType, string> = {
  connection_timeout: "Automatically retry with exponential backoff",
  dns_resolution: "Flush DNS cache and retry resolution",
  certificate_expiry: "Notify with urgent alert and temporary disable HTTPS verification",
  resource_overload: "Scale resources or implement throttling",
  http_500: "Restart application service or clear cache",
  memory_leak: "Restart application service and apply memory limits",
  database_connection: "Reset database connection pool",
  rate_limiting: "Implement temporary request throttling"
};

// Interface for healing history logs
export interface HealingAction {
  timestamp: Date;
  siteId: number;
  siteName: string;
  issueType: SelfHealingIssueType;
  actionTaken: string;
  success: boolean;
  details?: string;
}

// In-memory store of healing actions (would be persisted in a real implementation)
const healingHistory: HealingAction[] = [];

/**
 * Detect issues that can be automatically remediated based on alert data
 */
export function detectSelfHealableIssues(alert: Alert): SelfHealingIssueType | null {
  // Extract potential error information from alert message
  const message = alert.message.toLowerCase();
  
  if (message.includes("timeout") || message.includes("connection refused")) {
    return "connection_timeout";
  }
  
  if (message.includes("dns") || message.includes("name resolution")) {
    return "dns_resolution";
  }
  
  if (message.includes("certificate") || message.includes("ssl")) {
    return "certificate_expiry";
  }
  
  if (message.includes("cpu") || message.includes("memory") || message.includes("load")) {
    return "resource_overload";
  }
  
  if (message.includes("500") || message.includes("internal server error")) {
    return "http_500";
  }
  
  if (message.includes("memory leak") || message.includes("out of memory")) {
    return "memory_leak";
  }
  
  if (message.includes("database") || message.includes("db connection")) {
    return "database_connection";
  }
  
  if (message.includes("rate limit") || message.includes("too many requests") || message.includes("429")) {
    return "rate_limiting";
  }
  
  return null;
}

/**
 * Apply self-healing remediation for an identified issue
 */
export async function applyRemediation(
  site: Site, 
  issueType: SelfHealingIssueType
): Promise<boolean> {
  // In a real implementation, these would actually perform recovery actions
  // using API calls to infrastructure or code that can fix the issues
  
  try {
    console.log(`Applying remediation for ${issueType} on site ${site.name}`);
    
    // Simulate recovery action based on issue type
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Log the healing action
    const actionTaken = remediationStrategies[issueType];
    const healingAction: HealingAction = {
      timestamp: new Date(),
      siteId: site.id,
      siteName: site.name,
      issueType,
      actionTaken,
      success: true,
      details: `Auto-remediated ${issueType} issue`
    };
    
    healingHistory.push(healingAction);
    
    // Enable self-healing flag on the site if not already enabled
    if (site.settings && site.settings.selfHealing !== true) {
      const updatedSettings = {
        ...site.settings,
        selfHealing: true,
        lastHealed: new Date().toISOString()
      };
      
      await updateSite(site.id, { 
        settings: updatedSettings
      });
      
      // Invalidate the site cache to reflect changes
      queryClient.invalidateQueries({queryKey: ['/api/sites']});
      queryClient.invalidateQueries({queryKey: ['/api/sites', site.id]});
    }
    
    return true;
  } catch (error) {
    // Log the failed healing attempt
    const healingAction: HealingAction = {
      timestamp: new Date(),
      siteId: site.id,
      siteName: site.name,
      issueType,
      actionTaken: remediationStrategies[issueType],
      success: false,
      details: `Failed to remediate: ${error instanceof Error ? error.message : String(error)}`
    };
    
    healingHistory.push(healingAction);
    return false;
  }
}

/**
 * Get healing history for a specific site or all sites
 */
export function getHealingHistory(siteId?: number): HealingAction[] {
  if (siteId) {
    return healingHistory.filter(action => action.siteId === siteId);
  }
  return [...healingHistory];
}

/**
 * Get healing success rate statistics
 */
export function getHealingStats() {
  const total = healingHistory.length;
  const successful = healingHistory.filter(a => a.success).length;
  const rate = total > 0 ? (successful / total) * 100 : 0;
  
  return {
    total,
    successful,
    failed: total - successful,
    successRate: Math.round(rate * 10) / 10,
    byIssueType: Object.fromEntries(
      Object.keys(remediationStrategies).map(type => [
        type,
        healingHistory.filter(a => a.issueType === type).length
      ])
    )
  };
}
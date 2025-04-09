import { apiRequest } from "./queryClient";

/**
 * This module contains functionality for the monitoring script 
 * that will be integrated into customer websites.
 */

interface MonitoringResult {
  siteId: number;
  url: string;
  statusCode?: number;
  responseTime?: number;
  error?: string;
}

/**
 * Send monitoring result to the server
 */
export async function sendMonitoringResult(result: MonitoringResult): Promise<void> {
  await apiRequest("POST", "/api/monitor", result);
}

/**
 * Generate JavaScript monitoring script for customer integration
 */
export function generateMonitoringScript(siteId: number): string {
  return `
// Alertify Monitoring Script
(function() {
  const SITE_ID = ${siteId};
  const MONITOR_URL = "${window.location.origin}/api/monitor";
  
  function checkPerformance() {
    try {
      const navTiming = performance.timing;
      const pageLoadTime = navTiming.loadEventEnd - navTiming.navigationStart;
      const domLoadTime = navTiming.domContentLoadedEventEnd - navTiming.navigationStart;
      
      return {
        pageLoadTime,
        domLoadTime
      };
    } catch (err) {
      return { error: err.message };
    }
  }
  
  function reportError(error) {
    const data = {
      siteId: SITE_ID,
      url: window.location.href,
      error: error.message || "Unknown error",
      stack: error.stack,
      timestamp: new Date().toISOString()
    };
    
    // Send error to monitor endpoint
    if (navigator.sendBeacon) {
      navigator.sendBeacon(MONITOR_URL, JSON.stringify(data));
    } else {
      fetch(MONITOR_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        keepalive: true
      }).catch(console.error);
    }
  }
  
  // Monitor uncaught errors
  window.addEventListener('error', function(event) {
    reportError(event.error || new Error(event.message));
  });
  
  // Monitor unhandled promise rejections
  window.addEventListener('unhandledrejection', function(event) {
    reportError(event.reason || new Error('Unhandled Promise rejection'));
  });
  
  // Send performance data when page loads
  window.addEventListener('load', function() {
    setTimeout(function() {
      const performanceData = checkPerformance();
      
      const data = {
        siteId: SITE_ID,
        url: window.location.href,
        responseTime: performanceData.pageLoadTime,
        timestamp: new Date().toISOString()
      };
      
      // Send performance data
      fetch(MONITOR_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).catch(console.error);
    }, 0);
  });
})();
  `;
}

/**
 * Generate an API integration code snippet
 */
export function generateApiIntegrationCode(siteId: number): string {
  return `
// Alertify API Integration
const axios = require('axios');

/**
 * Report site status to Alertify
 * @param {Object} options - Monitoring options
 * @param {number} options.statusCode - HTTP status code
 * @param {number} options.responseTime - Response time in ms
 * @param {string} options.error - Error message if any
 */
async function reportToAlertify(options = {}) {
  try {
    const data = {
      siteId: ${siteId},
      url: 'YOUR_API_ENDPOINT',
      statusCode: options.statusCode,
      responseTime: options.responseTime,
      error: options.error
    };
    
    await axios.post('${window.location.origin}/api/monitor', data);
  } catch (err) {
    console.error('Failed to report to Alertify:', err);
  }
}

// Example usage in your API
function yourApiMiddleware(req, res, next) {
  const startTime = Date.now();
  
  // Capture response
  const originalEnd = res.end;
  res.end = function(...args) {
    const responseTime = Date.now() - startTime;
    
    reportToAlertify({
      statusCode: res.statusCode,
      responseTime: responseTime
    });
    
    return originalEnd.apply(this, args);
  };
  
  // Capture errors
  try {
    next();
  } catch (error) {
    reportToAlertify({
      statusCode: 500,
      error: error.message
    });
    throw error;
  }
}

module.exports = yourApiMiddleware;
  `;
}

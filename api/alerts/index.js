/**
 * Alertify - API Endpoint: /api/alerts
 * 
 * Handles alerts management for the Alertify monitoring platform
 * Developed by Aman
 * 
 * © 2025 - All Rights Reserved
 */

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Return mock alert data for frontend development
    const alerts = [
      {
        id: 1,
        siteId: 1,
        timestamp: new Date().toISOString(),
        severity: "critical",
        status: "active",
        message: "Website is down - Connection refused",
        details: {
          errorCode: "ECONNREFUSED",
          lastChecked: new Date(Date.now() - 300000).toISOString(),
          attempts: 3
        }
      },
      {
        id: 2,
        siteId: 3,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        severity: "high",
        status: "acknowledged",
        message: "Slow response time detected - 5.2s average",
        details: {
          threshold: 2000,
          actual: 5200,
          trend: "increasing"
        },
        acknowledgedBy: 1
      },
      {
        id: 3,
        siteId: 4,
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        severity: "medium",
        status: "resolved",
        message: "API rate limiting detected",
        details: {
          rateLimit: "100/minute",
          rateLimitRemaining: 0
        },
        resolvedAt: new Date(Date.now() - 6000000).toISOString()
      },
      {
        id: 4,
        siteId: 2,
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        severity: "low",
        status: "resolved",
        message: "SSL certificate expiring soon",
        details: {
          expiresIn: "10 days",
          issuer: "Let's Encrypt"
        },
        resolvedAt: new Date(Date.now() - 43200000).toISOString()
      },
      {
        id: 5,
        siteId: 5,
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        severity: "critical",
        status: "active",
        message: "Database connection failure",
        details: {
          errorCode: "ETIMEDOUT",
          component: "database",
          attempts: 5
        }
      },
      {
        id: 6,
        siteId: 1,
        timestamp: new Date(Date.now() - 900000).toISOString(),
        severity: "high",
        status: "active",
        message: "CPU usage exceeded threshold (95%)",
        details: {
          threshold: 80,
          actual: 95,
          duration: "15 minutes"
        }
      },
      {
        id: 7,
        siteId: 3,
        timestamp: new Date(Date.now() - 7000000).toISOString(),
        severity: "info",
        status: "acknowledged",
        message: "Auto-healing attempted",
        details: {
          action: "service restart",
          result: "successful",
          recoveryTime: "45 seconds"
        },
        acknowledgedBy: 1
      }
    ];

    return res.status(200).json(alerts);
  } 
  else if (req.method === 'POST') {
    try {
      const alertData = req.body;
      
      // Validation would go here in a real implementation
      if (!alertData.siteId || !alertData.message || !alertData.severity) {
        return res.status(400).json({ error: "Site ID, message, and severity are required" });
      }
      
      // Mock successful creation
      const newAlert = {
        id: Math.floor(Math.random() * 1000) + 10,
        ...alertData,
        status: alertData.status || "active",
        timestamp: new Date().toISOString()
      };
      
      return res.status(201).json(newAlert);
    } catch (error) {
      return res.status(500).json({ error: "Failed to create alert" });
    }
  }
  
  return res.status(405).json({ error: "Method not allowed" });
}
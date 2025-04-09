/**
 * Alertify - API Endpoint: /api/stats
 * 
 * Provides statistics for the Alertify monitoring dashboard
 * Developed by Aman
 * 
 * © 2025 - All Rights Reserved
 */

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Return mock dashboard statistics
    const stats = {
      websitesCount: 5,
      websitesGrowth: 3,
      averageUptime: 99.7,
      uptimeChange: 0.2,
      activeAlerts: 3,
      alertsChange: -2,
      avgResponseTime: 856,
      responseTimeChange: -120
    };

    return res.status(200).json(stats);
  }
  
  return res.status(405).json({ error: "Method not allowed" });
}
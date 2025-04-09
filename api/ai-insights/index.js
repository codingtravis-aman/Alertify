/**
 * Alertify - API Endpoint: /api/ai-insights
 * 
 * Provides AI-generated insights for the Alertify monitoring platform
 * Developed by Aman
 * 
 * © 2025 - All Rights Reserved
 */

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Return mock AI insights data for frontend development
    const currentDate = new Date();
    
    const insights = [
      {
        id: 1,
        siteId: 1,
        timestamp: new Date(currentDate.getTime() - 2 * 60 * 60 * 1000).toISOString(),
        type: "prediction",
        message: "Traffic spike expected in 3 hours based on historical patterns",
        confidence: 0.87,
        relatedMetrics: ["traffic", "response_time", "load"],
        details: {
          expectedIncrease: "215%",
          duration: "2.5 hours",
          recommendation: "Consider scaling up resources temporarily"
        },
        status: "new"
      },
      {
        id: 2,
        siteId: 2,
        timestamp: new Date(currentDate.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        type: "anomaly",
        message: "Unusual spike in 404 errors detected",
        confidence: 0.95,
        relatedMetrics: ["errors", "user_experience"],
        details: {
          normalRate: "0.5%",
          currentRate: "4.8%",
          topPaths: ["/products/discontinued", "/old-campaign"],
          recommendation: "Check recent content changes or broken links"
        },
        status: "reviewed"
      },
      {
        id: 3,
        siteId: 3,
        timestamp: new Date().toISOString(),
        type: "trend",
        message: "Gradual increase in response time over the last 7 days",
        confidence: 0.82,
        relatedMetrics: ["response_time", "database_queries", "api_latency"],
        details: {
          startValue: "320ms",
          currentValue: "780ms",
          pattern: "linear increase",
          recommendation: "Review recent deployments and database performance"
        },
        status: "new"
      },
      {
        id: 4,
        siteId: 4,
        timestamp: new Date(currentDate.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        type: "optimization",
        message: "API endpoint '/api/users/list' performance could be improved",
        confidence: 0.78,
        relatedMetrics: ["api_latency", "database_queries"],
        details: {
          averageTime: "1.2s",
          bottleneck: "Database query",
          recommendation: "Add index on 'last_active' field and implement pagination"
        },
        status: "implemented"
      },
      {
        id: 5,
        siteId: 5,
        timestamp: new Date(currentDate.getTime() - 12 * 60 * 60 * 1000).toISOString(),
        type: "prediction",
        message: "Memory usage trend indicates possible resource exhaustion in ~48 hours",
        confidence: 0.91,
        relatedMetrics: ["memory_usage", "active_connections", "cache_size"],
        details: {
          currentUsage: "78%",
          projectedMax: "97%",
          timeToExhaustion: "~48 hours",
          recommendation: "Increase memory allocation or optimize application memory usage"
        },
        status: "new"
      }
    ];

    return res.status(200).json(insights);
  } 
  
  return res.status(405).json({ error: "Method not allowed" });
}
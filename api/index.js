/**
 * Alertify - API Base Endpoint
 * 
 * Main API entry point for the Alertify monitoring platform
 * Developed by Aman
 * 
 * © 2025 - All Rights Reserved
 */

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({
      name: "Alertify API",
      version: "1.0.0",
      description: "API for the Alertify intelligent monitoring platform",
      author: "Aman",
      endpoints: [
        {
          path: "/api/sites",
          methods: ["GET", "POST"],
          description: "Manage monitored websites and applications"
        },
        {
          path: "/api/sites/[id]",
          methods: ["GET", "PUT", "PATCH", "DELETE"],
          description: "Manage individual site by ID"
        },
        {
          path: "/api/alerts",
          methods: ["GET", "POST"],
          description: "Access and create system alerts"
        },
        {
          path: "/api/stats",
          methods: ["GET"],
          description: "Get dashboard statistics and metrics"
        },
        {
          path: "/api/ai-insights",
          methods: ["GET"],
          description: "Get AI-powered insights and recommendations"
        },
        {
          path: "/api/ws",
          methods: ["WebSocket"],
          description: "Connect for real-time updates and notifications"
        }
      ],
      documentation: "For more information, visit the documentation page"
    });
  }
  
  return res.status(405).json({ error: "Method not allowed" });
}
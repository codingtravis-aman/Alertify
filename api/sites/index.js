/**
 * Alertify - API Endpoint: /api/sites
 * 
 * Handles site management operations for Alertify monitoring platform
 * Developed by Aman
 * 
 * © 2025 - All Rights Reserved
 */

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Return mock site data for frontend development
    const sites = [
      {
        id: 1,
        name: "Main E-commerce Website",
        url: "https://shop.example.com",
        teamId: 1,
        checkFrequency: 5,
        status: "active",
        settings: {
          alertThreshold: 3,
          responseTimeThreshold: 1500,
          selfHealing: true,
          notificationChannels: ["email", "slack"]
        },
        type: "e-commerce"
      },
      {
        id: 2,
        name: "Marketing Blog",
        url: "https://blog.example.com",
        teamId: 1,
        checkFrequency: 15,
        status: "active",
        settings: {
          alertThreshold: 2,
          responseTimeThreshold: 800,
          selfHealing: false,
          notificationChannels: ["email"]
        },
        type: "blog"
      },
      {
        id: 3,
        name: "Customer Support Portal",
        url: "https://support.example.com",
        teamId: 1,
        checkFrequency: 10,
        status: "maintenance",
        settings: {
          alertThreshold: 5,
          responseTimeThreshold: 1200,
          selfHealing: true,
          notificationChannels: ["email", "sms", "slack"]
        },
        type: "support"
      },
      {
        id: 4,
        name: "Mobile API Endpoint",
        url: "https://api.example.com/mobile",
        teamId: 1,
        checkFrequency: 2,
        status: "active",
        settings: {
          alertThreshold: 1,
          responseTimeThreshold: 500,
          selfHealing: true,
          notificationChannels: ["email", "pagerduty"]
        },
        type: "api"
      },
      {
        id: 5,
        name: "Admin Dashboard",
        url: "https://admin.example.com",
        teamId: 1,
        checkFrequency: 10,
        status: "active",
        settings: {
          alertThreshold: 2,
          responseTimeThreshold: 1000,
          selfHealing: false,
          notificationChannels: ["email", "slack", "sms"]
        },
        type: "dashboard"
      }
    ];

    return res.status(200).json(sites);
  } 
  else if (req.method === 'POST') {
    try {
      const siteData = req.body;
      
      // Validation would go here in a real implementation
      if (!siteData.name || !siteData.url) {
        return res.status(400).json({ error: "Site name and URL are required" });
      }
      
      // Mock successful creation
      const newSite = {
        id: Math.floor(Math.random() * 1000) + 10,
        ...siteData,
        status: "active",
        createdAt: new Date().toISOString()
      };
      
      return res.status(201).json(newSite);
    } catch (error) {
      return res.status(500).json({ error: "Failed to create site" });
    }
  }
  
  return res.status(405).json({ error: "Method not allowed" });
}
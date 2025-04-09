/**
 * Alertify - API Endpoint: /api/sites/[id]
 * 
 * Handles operations for individual sites in the Alertify monitoring platform
 * Developed by Aman
 * 
 * © 2025 - All Rights Reserved
 */

export default function handler(req, res) {
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({ error: "Site ID is required" });
  }
  
  if (req.method === 'GET') {
    // For demo purposes, return mock data for any ID
    // In a real implementation, this would fetch from a database
    const site = {
      id: parseInt(id),
      name: "Site " + id,
      url: `https://example${id}.com`,
      teamId: 1,
      checkFrequency: 5,
      status: "active",
      settings: {
        alertThreshold: 3,
        responseTimeThreshold: 1200,
        selfHealing: true,
        notificationChannels: ["email", "slack"]
      },
      createdAt: "2025-01-01T00:00:00.000Z",
      type: "website"
    };
    
    return res.status(200).json(site);
  } 
  else if (req.method === 'PUT' || req.method === 'PATCH') {
    try {
      const updateData = req.body;
      
      // Mock update response
      const updatedSite = {
        id: parseInt(id),
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      
      return res.status(200).json(updatedSite);
    } catch (error) {
      return res.status(500).json({ error: "Failed to update site" });
    }
  } 
  else if (req.method === 'DELETE') {
    // Mock successful deletion
    return res.status(200).json({ success: true, message: "Site deleted successfully" });
  }
  
  return res.status(405).json({ error: "Method not allowed" });
}
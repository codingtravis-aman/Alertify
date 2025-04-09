import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSiteSchema, insertAlertSchema, insertCheckResultSchema, insertUptimeStatSchema, insertAiInsightSchema } from "@shared/schema";
import { ZodError } from "zod";
import { WebSocketServer, WebSocket } from "ws";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);
  
  // Create WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Store connected clients
  const clients: WebSocket[] = [];
  
  // WebSocket connection handler
  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    clients.push(ws);
    
    // Send welcome message
    ws.send(JSON.stringify({ type: 'connection', message: 'Connected to Alertify WebSocket Server' }));
    
    // Handle disconnect
    ws.on('close', () => {
      const index = clients.indexOf(ws);
      if (index !== -1) {
        clients.splice(index, 1);
      }
      console.log('WebSocket client disconnected');
    });
  });
  
  // Function to broadcast alerts to all connected clients
  function broadcastAlert(alert: any) {
    console.log('Broadcasting alert:', alert);
    
    const message = JSON.stringify({
      type: 'alert',
      data: alert
    });
    
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
  
  // Sites API endpoints
  app.get('/api/sites', async (req, res) => {
    try {
      const sites = await storage.getAllSites();
      
      // Enrich sites with their latest stats
      const enrichedSites = await Promise.all(sites.map(async (site) => {
        const stats = await storage.getUptimeStatsBySite(site.id);
        const latestStat = stats.length > 0 ? stats[0] : null;
        
        return {
          ...site,
          stats: latestStat
        };
      }));
      
      res.json(enrichedSites);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch sites' });
    }
  });
  
  app.get('/api/sites/:id', async (req, res) => {
    try {
      const siteId = parseInt(req.params.id);
      const site = await storage.getSite(siteId);
      
      if (!site) {
        return res.status(404).json({ error: 'Site not found' });
      }
      
      // Get related data
      const stats = await storage.getUptimeStatsBySite(siteId);
      const latestStat = stats.length > 0 ? stats[0] : null;
      const activeAlerts = await storage.getAlertsBySite(siteId, 'active');
      const checkResults = await storage.getCheckResultsBySite(siteId, 100);
      
      res.json({
        site,
        stats: latestStat,
        activeAlerts,
        checkResults
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch site details' });
    }
  });
  
  app.post('/api/sites', async (req, res) => {
    try {
      const siteData = insertSiteSchema.parse(req.body);
      const site = await storage.createSite(siteData);
      res.status(201).json(site);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to create site' });
    }
  });
  
  app.put('/api/sites/:id', async (req, res) => {
    try {
      const siteId = parseInt(req.params.id);
      const updatedSite = await storage.updateSite(siteId, req.body);
      
      if (!updatedSite) {
        return res.status(404).json({ error: 'Site not found' });
      }
      
      res.json(updatedSite);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update site' });
    }
  });
  
  app.delete('/api/sites/:id', async (req, res) => {
    try {
      const siteId = parseInt(req.params.id);
      const result = await storage.deleteSite(siteId);
      
      if (!result) {
        return res.status(404).json({ error: 'Site not found' });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete site' });
    }
  });
  
  // Alerts API endpoints
  app.get('/api/alerts', async (req, res) => {
    try {
      const status = req.query.status as string | undefined;
      let alerts;
      
      if (status === 'active') {
        alerts = await storage.getAllActiveAlerts();
      } else {
        // Get all active alerts for now
        alerts = await storage.getAllActiveAlerts();
      }
      
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch alerts' });
    }
  });
  
  app.get('/api/sites/:id/alerts', async (req, res) => {
    try {
      const siteId = parseInt(req.params.id);
      const status = req.query.status as string | undefined;
      
      const alerts = await storage.getAlertsBySite(siteId, status);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch site alerts' });
    }
  });
  
  app.post('/api/alerts', async (req, res) => {
    try {
      const alertData = insertAlertSchema.parse(req.body);
      const alert = await storage.createAlert(alertData);
      
      // Broadcast the new alert
      broadcastAlert(alert);
      
      res.status(201).json(alert);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to create alert' });
    }
  });
  
  app.patch('/api/alerts/:id', async (req, res) => {
    try {
      const alertId = parseInt(req.params.id);
      const updatedAlert = await storage.updateAlert(alertId, req.body);
      
      if (!updatedAlert) {
        return res.status(404).json({ error: 'Alert not found' });
      }
      
      res.json(updatedAlert);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update alert' });
    }
  });
  
  // Check results API endpoints
  app.get('/api/sites/:id/check-results', async (req, res) => {
    try {
      const siteId = parseInt(req.params.id);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      
      const checkResults = await storage.getCheckResultsBySite(siteId, limit);
      res.json(checkResults);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch check results' });
    }
  });
  
  app.post('/api/check-results', async (req, res) => {
    try {
      const checkResultData = insertCheckResultSchema.parse(req.body);
      const checkResult = await storage.createCheckResult(checkResultData);
      
      // If this check indicates a problem, create an alert
      if (checkResult.status === 'error' || checkResult.status === 'warning') {
        const message = checkResult.error || 
          `${checkResult.status === 'error' ? 'Error' : 'Warning'}: Status code ${checkResult.statusCode}`;
        
        const alert = await storage.createAlert({
          siteId: checkResult.siteId,
          timestamp: new Date(),
          type: checkResult.status,
          message: message,
          status: 'active'
        });
        
        // Broadcast the new alert
        broadcastAlert(alert);
      }
      
      res.status(201).json(checkResult);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to create check result' });
    }
  });
  
  // Uptime stats API endpoints
  app.get('/api/sites/:id/uptime-stats', async (req, res) => {
    try {
      const siteId = parseInt(req.params.id);
      const stats = await storage.getUptimeStatsBySite(siteId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch uptime stats' });
    }
  });
  
  app.post('/api/uptime-stats', async (req, res) => {
    try {
      const uptimeStatData = insertUptimeStatSchema.parse(req.body);
      const uptimeStat = await storage.createUptimeStat(uptimeStatData);
      res.status(201).json(uptimeStat);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to create uptime stat' });
    }
  });
  
  // AI insights API endpoints
  app.get('/api/ai-insights', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const insights = await storage.getAllAiInsights(limit);
      res.json(insights);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch AI insights' });
    }
  });
  
  app.get('/api/sites/:id/ai-insights', async (req, res) => {
    try {
      const siteId = parseInt(req.params.id);
      const insights = await storage.getAiInsightsBySite(siteId);
      res.json(insights);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch site AI insights' });
    }
  });
  
  app.post('/api/ai-insights', async (req, res) => {
    try {
      const aiInsightData = insertAiInsightSchema.parse(req.body);
      const aiInsight = await storage.createAiInsight(aiInsightData);
      res.status(201).json(aiInsight);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: 'Failed to create AI insight' });
    }
  });
  
  app.patch('/api/ai-insights/:id', async (req, res) => {
    try {
      const insightId = parseInt(req.params.id);
      const updatedInsight = await storage.updateAiInsight(insightId, req.body);
      
      if (!updatedInsight) {
        return res.status(404).json({ error: 'AI insight not found' });
      }
      
      res.json(updatedInsight);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update AI insight' });
    }
  });
  
  // Dashboard stats
  app.get('/api/stats', async (req, res) => {
    try {
      const sites = await storage.getAllSites();
      const activeAlerts = await storage.getAllActiveAlerts();
      
      // Calculate average metrics across all sites
      let totalUptime = 0;
      let totalResponseTime = 0;
      let sitesWithStats = 0;
      
      for (const site of sites) {
        const stats = await storage.getUptimeStatsBySite(site.id);
        if (stats.length > 0) {
          totalUptime += stats[0].uptimePercentage;
          totalResponseTime += stats[0].avgResponseTime || 0;
          sitesWithStats++;
        }
      }
      
      const avgUptime = sitesWithStats > 0 ? (totalUptime / sitesWithStats).toFixed(1) : '0.0';
      const avgResponseTime = sitesWithStats > 0 ? Math.round(totalResponseTime / sitesWithStats) : 0;
      
      res.json({
        websitesCount: sites.length,
        websitesGrowth: 3, // Mock growth for demo
        averageUptime: parseFloat(avgUptime),
        uptimeChange: 0.2, // Mock change for demo
        alertsCount: activeAlerts.length,
        alertsChange: 2, // Mock change for demo
        avgResponseTime: avgResponseTime,
        responseTimeChange: -12 // Mock change for demo
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch dashboard stats' });
    }
  });
  
  // Endpoint for monitoring script to send data
  app.post('/api/monitor', async (req, res) => {
    try {
      const { siteId, url, statusCode, responseTime, error } = req.body;
      
      if (!siteId || !url) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      // Determine status based on status code and response time
      let status = 'success';
      if (error || !statusCode || statusCode >= 500) {
        status = 'error';
      } else if (statusCode >= 400 || responseTime > 1000) {
        status = 'warning';
      }
      
      // Create a check result
      const checkResult = await storage.createCheckResult({
        siteId,
        timestamp: new Date(),
        status,
        responseTime,
        statusCode,
        error
      });
      
      // If there's an issue, create an alert
      if (status !== 'success') {
        const message = error || `HTTP ${statusCode} error at ${url}`;
        
        const alert = await storage.createAlert({
          siteId,
          timestamp: new Date(),
          type: status,
          message,
          status: 'active'
        });
        
        // Broadcast the new alert
        broadcastAlert(alert);
      }
      
      res.status(201).json({ success: true, checkResult });
    } catch (error) {
      res.status(500).json({ error: 'Failed to process monitoring data' });
    }
  });
  
  return httpServer;
}

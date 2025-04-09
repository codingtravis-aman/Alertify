import React, { useState, useEffect } from 'react';
import { Alert, Site } from '@/types';
import { useWebSocket, WebSocketMessage } from '@/hooks/use-websocket';
import { useToast } from '@/hooks/use-toast';
import { Bell, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchSites } from '@/lib/api';
import { AnimatePresence, motion } from 'framer-motion';

export const LiveAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [sites, setSites] = useState<Record<number, Site>>({});
  const { isConnected, lastMessage } = useWebSocket();
  const { toast } = useToast();

  // Load sites for mapping site IDs to names
  useEffect(() => {
    const loadSites = async () => {
      try {
        const sitesData = await fetchSites();
        const sitesMap: Record<number, Site> = {};
        sitesData.forEach(site => {
          sitesMap[site.id] = site;
        });
        setSites(sitesMap);
      } catch (error) {
        console.error('Error loading sites:', error);
      }
    };

    loadSites();
  }, []);

  // Process WebSocket messages
  useEffect(() => {
    if (lastMessage?.type === 'alert' && lastMessage.data) {
      const newAlert = lastMessage.data as Alert;
      
      // Add the new alert to our state
      setAlerts(prev => [newAlert, ...prev].slice(0, 5)); // Keep only last 5 alerts
      
      // Show toast notification
      const siteName = sites[newAlert.siteId]?.name || `Site #${newAlert.siteId}`;
      
      toast({
        title: `${getSeverityLabel(newAlert.severity)} Alert: ${siteName}`,
        description: newAlert.message,
        variant: getSeverityVariant(newAlert.severity),
      });
    }
  }, [lastMessage, sites, toast]);

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'critical': return 'Critical';
      case 'high': return 'High';
      case 'medium': return 'Medium';
      case 'low': return 'Low';
      default: return 'Info';
    }
  };

  const getSeverityVariant = (severity: string): 'default' | 'destructive' => {
    return ['critical', 'high'].includes(severity) ? 'destructive' : 'default';
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertCircle className="h-4 w-4" />;
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const handleAcknowledge = (alertId: number) => {
    // For visual demo - remove alert from local state
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    
    // In a real implementation, we would call the API to update the alert status
    toast({
      title: 'Alert Acknowledged',
      description: 'The alert has been acknowledged and will be handled.',
    });
  };

  const handleResolve = (alertId: number) => {
    // For visual demo - remove alert from local state
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    
    // In a real implementation, we would call the API to update the alert status
    toast({
      title: 'Alert Resolved',
      description: 'The alert has been marked as resolved.',
    });
  };

  if (!isConnected) {
    return (
      <Card className="w-full bg-muted/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-orange-500"></span>
            Live Alerts
          </CardTitle>
          <CardDescription>
            Connecting to alert system...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
          Live Alerts
        </CardTitle>
        <CardDescription>
          {alerts.length === 0 
            ? 'No active alerts at this time. System is healthy.'
            : `Showing ${alerts.length} active alerts`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AnimatePresence>
          {alerts.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-2 opacity-80" />
              <p>All systems operational</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.map(alert => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="border rounded-lg p-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2">
                      {getSeverityIcon(alert.severity)}
                      <div>
                        <div className="font-medium text-sm">
                          {sites[alert.siteId]?.name || `Site #${alert.siteId}`}
                        </div>
                        <div className="text-sm text-muted-foreground">{alert.message}</div>
                        <div className="flex items-center mt-1 gap-2">
                          <Badge variant={getSeverityVariant(alert.severity)}>
                            {getSeverityLabel(alert.severity)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(alert.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleAcknowledge(alert.id)}
                    >
                      Acknowledge
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => handleResolve(alert.id)}
                    >
                      Resolve
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </CardContent>
      {alerts.length > 0 && (
        <CardFooter className="pt-0">
          <Button variant="outline" size="sm" className="w-full">
            View All Alerts
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
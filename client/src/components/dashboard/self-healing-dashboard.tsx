import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  Shield,
  Zap,
} from "lucide-react";
import { fetchSites } from "@/lib/api";
import { 
  remediationStrategies, 
  getHealingHistory, 
  getHealingStats,
  SelfHealingIssueType,
  HealingAction
} from "@/lib/self-healing";
import type { Site } from "@/types";

function formatTimestamp(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }).format(date);
}

function StatusBadge({ success }: { success: boolean }) {
  return success ? (
    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
      <CheckCircle className="h-3 w-3 mr-1" />
      Success
    </Badge>
  ) : (
    <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100">
      <AlertTriangle className="h-3 w-3 mr-1" />
      Failed
    </Badge>
  );
}

function IssueTypeBadge({ type }: { type: SelfHealingIssueType }) {
  const colorMap: Record<SelfHealingIssueType, string> = {
    connection_timeout: "bg-yellow-100 text-yellow-800 border-yellow-200",
    dns_resolution: "bg-orange-100 text-orange-800 border-orange-200",
    certificate_expiry: "bg-red-100 text-red-800 border-red-200",
    resource_overload: "bg-purple-100 text-purple-800 border-purple-200",
    http_500: "bg-red-100 text-red-800 border-red-200",
    memory_leak: "bg-purple-100 text-purple-800 border-purple-200",
    database_connection: "bg-blue-100 text-blue-800 border-blue-200",
    rate_limiting: "bg-yellow-100 text-yellow-800 border-yellow-200"
  };

  const displayNames: Record<SelfHealingIssueType, string> = {
    connection_timeout: "Connection Timeout",
    dns_resolution: "DNS Resolution",
    certificate_expiry: "Certificate Expiry",
    resource_overload: "Resource Overload",
    http_500: "HTTP 500 Error",
    memory_leak: "Memory Leak",
    database_connection: "Database Connection",
    rate_limiting: "Rate Limiting"
  };

  return (
    <Badge variant="outline" className={colorMap[type]}>
      {displayNames[type]}
    </Badge>
  );
}

export function SelfHealingDashboard() {
  const [healingEnabled, setHealingEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [healingHistory, setHealingHistory] = useState<HealingAction[]>([]);
  const [healingStats, setHealingStats] = useState<ReturnType<typeof getHealingStats>>();
  const [selectedSite, setSelectedSite] = useState<number | undefined>(undefined);

  const { data: sites = [] } = useQuery<Site[]>({
    queryKey: ['/api/sites'],
  });

  // Initialize with mock history data
  useEffect(() => {
    // Get self healing data
    const history = getHealingHistory(selectedSite);
    const stats = getHealingStats();
    
    setHealingHistory(history);
    setHealingStats(stats);
  }, [selectedSite]);

  const handleToggleHealing = () => {
    setHealingEnabled(!healingEnabled);
  };

  const handleClearHistory = () => {
    // This would clear history in a real implementation
    setHealingHistory([]);
  };

  const handleSiteChange = (siteId: string) => {
    if (siteId === "all") {
      setSelectedSite(undefined);
    } else {
      setSelectedSite(parseInt(siteId, 10));
    }
  };

  const handleSimulateHealing = () => {
    // Simulate a new healing action for demonstration purposes
    const issueTypes = Object.keys(remediationStrategies) as SelfHealingIssueType[];
    const randomIssue = issueTypes[Math.floor(Math.random() * issueTypes.length)];
    const randomSite = sites[Math.floor(Math.random() * sites.length)];
    
    if (randomSite) {
      const newAction: HealingAction = {
        timestamp: new Date(),
        siteId: randomSite.id,
        siteName: randomSite.name,
        issueType: randomIssue,
        actionTaken: remediationStrategies[randomIssue],
        success: Math.random() > 0.2, // 80% success rate for simulation
        details: `Simulated auto-remediation for ${randomIssue}`
      };
      
      setHealingHistory([newAction, ...healingHistory]);
      
      // Update stats
      const updatedStats = getHealingStats();
      setHealingStats(updatedStats);
    }
  };

  // Handle the case when there's no healing history yet
  const noHistoryContent = (
    <div className="text-center py-6">
      <Shield className="h-12 w-12 mx-auto text-gray-300 mb-2" />
      <p className="text-gray-500 mb-2">No self-healing activity recorded yet</p>
      <p className="text-sm text-gray-400 mb-4">
        When issues are detected and auto-remediated, they will appear here
      </p>
      <Button onClick={handleSimulateHealing}>
        <Zap className="h-4 w-4 mr-2" />
        Simulate Healing Action
      </Button>
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center">
            <Shield className="h-5 w-5 mr-2 text-primary" />
            Self-Healing Dashboard
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Label htmlFor="healing-toggle" className="mr-2">
              {healingEnabled ? "Enabled" : "Disabled"}
            </Label>
            <Switch id="healing-toggle" checked={healingEnabled} onCheckedChange={handleToggleHealing} />
          </div>
        </div>
        <CardDescription>
          Monitor and manage automatic issue remediation capabilities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">
              <Activity className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="history">
              <Clock className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-6">
              {healingStats ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total Actions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{healingStats.total}</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Success Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">{healingStats.successRate}%</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Successful</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">{healingStats.successful}</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Failed</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-red-600">{healingStats.failed}</div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Success Rate</h3>
                    <Progress value={healingStats.successRate} className="h-2" />
                    <div className="flex justify-between mt-1 text-sm text-gray-500">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">Recent Activity</h3>
                    {healingHistory.length > 0 ? (
                      <div className="border rounded-md divide-y">
                        {healingHistory.slice(0, 3).map((action, index) => (
                          <div key={index} className="p-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium">{action.siteName}</div>
                                <div className="text-sm text-gray-500">{action.actionTaken}</div>
                              </div>
                              <StatusBadge success={action.success} />
                            </div>
                            <div className="mt-1 text-xs text-gray-400">
                              {formatTimestamp(action.timestamp)}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      noHistoryContent
                    )}
                  </div>
                </>
              ) : (
                <div className="py-6 text-center text-gray-500">
                  No self-healing data available.
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <Label htmlFor="site-filter">Filter by site:</Label>
                  <select
                    id="site-filter"
                    className="rounded-md border border-input bg-background p-2 text-sm"
                    onChange={(e) => handleSiteChange(e.target.value)}
                    value={selectedSite || "all"}
                  >
                    <option value="all">All sites</option>
                    {sites.map((site: Site) => (
                      <option key={site.id} value={site.id}>
                        {site.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handleClearHistory}>
                    Clear History
                  </Button>
                  <Button size="sm" onClick={handleSimulateHealing}>
                    <Zap className="h-4 w-4 mr-2" />
                    Simulate Action
                  </Button>
                </div>
              </div>

              {healingHistory.length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Site</TableHead>
                        <TableHead>Issue Type</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {healingHistory.map((action, index) => (
                        <TableRow key={index}>
                          <TableCell className="whitespace-nowrap">
                            {formatTimestamp(action.timestamp)}
                          </TableCell>
                          <TableCell>{action.siteName}</TableCell>
                          <TableCell>
                            <IssueTypeBadge type={action.issueType} />
                          </TableCell>
                          <TableCell className="max-w-[300px] truncate" title={action.actionTaken}>
                            {action.actionTaken}
                          </TableCell>
                          <TableCell>
                            <StatusBadge success={action.success} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                noHistoryContent
              )}
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-6">
              <div className="grid gap-6">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <h3 className="font-medium">Global Self-Healing</h3>
                    <p className="text-sm text-gray-500">Enable or disable auto-remediation system-wide</p>
                  </div>
                  <Switch checked={healingEnabled} onCheckedChange={handleToggleHealing} />
                </div>
                
                <div className="border-b pb-4">
                  <h3 className="font-medium mb-3">Issue Types</h3>
                  <p className="text-sm text-gray-500 mb-4">Configure which issues can be auto-remediated</p>
                  
                  <div className="space-y-3">
                    {(Object.keys(remediationStrategies) as SelfHealingIssueType[]).map((issueType) => (
                      <div key={issueType} className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-medium">
                              <IssueTypeBadge type={issueType} />
                            </h4>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{remediationStrategies[issueType]}</p>
                        </div>
                        <Switch defaultChecked id={`enable-${issueType}`} />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Notification Settings</h3>
                  <p className="text-sm text-gray-500 mb-4">Configure notifications for self-healing actions</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-success">Notify on successful remediation</Label>
                      <Switch id="notify-success" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-failure">Notify on failed remediation</Label>
                      <Switch id="notify-failure" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-summary">Daily summary report</Label>
                      <Switch id="notify-summary" defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <p className="text-sm text-gray-500">
          {healingEnabled 
            ? "Self-healing is actively monitoring and remediating issues" 
            : "Self-healing is disabled - issues require manual intervention"}
        </p>
        <Badge variant={healingEnabled ? "default" : "outline"} className="ml-2">
          {healingEnabled ? "Active" : "Inactive"}
        </Badge>
      </CardFooter>
    </Card>
  );
}
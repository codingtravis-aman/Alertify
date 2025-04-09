import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/dashboard/layout";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "@/components/ui/animated-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  BellRing,
  MessageSquare,
  Code,
  Webhook,
  Database,
  Mail,
  Smartphone,
  Copy,
  ExternalLink,
  Check,
} from "lucide-react";
import { SiSlack, SiDiscord, SiGithub, SiJira, SiPagerduty, SiTwilio, SiZapier } from "react-icons/si";
import { generateMonitoringScript, generateApiIntegrationCode } from "@/lib/monitoring";

// Example integration data
const integrations = [
  {
    id: "slack",
    name: "Slack",
    description: "Get alerts and notifications in your Slack channels",
    icon: SiSlack,
    isConnected: true,
    category: "chat",
  },
  {
    id: "discord",
    name: "Discord",
    description: "Send incident alerts to your Discord server",
    icon: SiDiscord,
    isConnected: false,
    category: "chat",
  },
  {
    id: "teams",
    name: "Microsoft Teams",
    description: "Receive notifications in Microsoft Teams channels",
    icon: MessageSquare,
    isConnected: false,
    category: "chat",
  },
  {
    id: "github",
    name: "GitHub",
    description: "Create issues for incidents automatically",
    icon: SiGithub,
    isConnected: true,
    category: "devtools",
  },
  {
    id: "jira",
    name: "Jira",
    description: "Create and track incidents in Jira",
    icon: SiJira,
    isConnected: false,
    category: "devtools",
  },
  {
    id: "pagerduty",
    name: "PagerDuty",
    description: "Forward critical alerts to PagerDuty",
    icon: SiPagerduty,
    isConnected: true,
    category: "escalation",
  },
  {
    id: "twilio",
    name: "Twilio",
    description: "Send SMS alerts for critical incidents",
    icon: SiTwilio,
    isConnected: false,
    category: "notification",
  },
  {
    id: "email",
    name: "Email",
    description: "Send email notifications",
    icon: Mail,
    isConnected: true,
    category: "notification",
  },
  {
    id: "webhooks",
    name: "Custom Webhooks",
    description: "Send alerts to any HTTP endpoint",
    icon: Webhook,
    isConnected: true,
    category: "custom",
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Connect with 3000+ apps via Zapier",
    icon: SiZapier,
    isConnected: false,
    category: "custom",
  },
];

function IntegrationCard({ integration, onToggle }: { 
  integration: typeof integrations[0];
  onToggle: (id: string, connected: boolean) => void;
}) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const IconComponent = integration.icon;
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-md">
              <IconComponent className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl">{integration.name}</CardTitle>
          </div>
          <Badge variant={integration.isConnected ? "default" : "outline"}>
            {integration.isConnected ? "Connected" : "Not Connected"}
          </Badge>
        </div>
        <CardDescription>{integration.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor={`toggle-${integration.id}`} className="font-medium">
            Enable {integration.name}
          </Label>
          <Switch
            id={`toggle-${integration.id}`}
            checked={integration.isConnected}
            onCheckedChange={(checked) => onToggle(integration.id, checked)}
          />
        </div>
        {integration.isConnected && (
          <div className="mt-4 space-y-4">
            {integration.id === "slack" && (
              <div className="space-y-2">
                <Label>Webhook URL</Label>
                <div className="flex">
                  <Input
                    value="https://hooks.slack.com/services/T..."
                    readOnly
                    className="rounded-r-none"
                  />
                  <Button 
                    variant="outline" 
                    className="rounded-l-none border-l-0"
                    onClick={handleCopy}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground">Connected to #alerts channel</div>
              </div>
            )}
            
            {integration.id === "webhooks" && (
              <div className="space-y-2">
                <Label>Webhook URL</Label>
                <div className="flex">
                  <Input
                    value="https://alertify.app/api/webhooks/inbound/a1b2c3d4"
                    readOnly
                    className="rounded-r-none"
                  />
                  <Button 
                    variant="outline" 
                    className="rounded-l-none border-l-0"
                    onClick={handleCopy}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t bg-muted/50 pt-4">
        <AnimatedButton 
          size="sm" 
          variant="outline" 
          className="w-full"
          animateType="scale"
        >
          {integration.isConnected ? "Manage Integration" : "Connect"}
        </AnimatedButton>
      </CardFooter>
    </Card>
  );
}

function CodeSnippet({ code, title }: { code: string; title?: string }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="space-y-2">
      {title && <Label>{title}</Label>}
      <div className="relative">
        <div className="absolute right-2 top-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
        <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">{code}</pre>
      </div>
    </div>
  );
}

export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState("integrations");
  const [filteredCategory, setFilteredCategory] = useState("all");
  
  const { data = integrations } = useQuery({
    queryKey: ['/api/integrations'],
    queryFn: () => Promise.resolve(integrations),
  });
  
  const handleToggle = (id: string, connected: boolean) => {
    console.log(`Toggle ${id} to ${connected ? 'connected' : 'disconnected'}`);
    // In a real app, would make API call to update integration status
  };
  
  const filteredIntegrations = filteredCategory === "all" 
    ? data 
    : data.filter(i => i.category === filteredCategory);
  
  const jsIntegrationCode = generateMonitoringScript(1);
  const apiIntegrationCode = generateApiIntegrationCode(1);
  
  return (
    <DashboardLayout title="Integrations">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
        <p className="text-muted-foreground">
          Connect Alertify with your favorite tools and services
        </p>
      </div>
      
      <Tabs defaultValue="integrations" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="integrations">
            <MessageSquare className="h-4 w-4 mr-2" />
            Services
          </TabsTrigger>
          <TabsTrigger value="developer">
            <Code className="h-4 w-4 mr-2" />
            Developer
          </TabsTrigger>
          <TabsTrigger value="webhooks">
            <Webhook className="h-4 w-4 mr-2" />
            Webhooks
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="integrations">
          <div className="mb-4 flex items-center space-x-2">
            <Button
              variant={filteredCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilteredCategory("all")}
            >
              All
            </Button>
            <Button
              variant={filteredCategory === "chat" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilteredCategory("chat")}
            >
              Chat
            </Button>
            <Button
              variant={filteredCategory === "devtools" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilteredCategory("devtools")}
            >
              DevTools
            </Button>
            <Button
              variant={filteredCategory === "notification" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilteredCategory("notification")}
            >
              Notifications
            </Button>
            <Button
              variant={filteredCategory === "escalation" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilteredCategory("escalation")}
            >
              Escalation
            </Button>
            <Button
              variant={filteredCategory === "custom" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilteredCategory("custom")}
            >
              Custom
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredIntegrations.map((integration) => (
              <IntegrationCard 
                key={integration.id} 
                integration={integration} 
                onToggle={handleToggle}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="developer">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>JavaScript Integration</CardTitle>
              <CardDescription>
                Add this script to your website to enable monitoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeSnippet code={jsIntegrationCode} />
              
              <div className="mt-4 flex items-center space-x-2">
                <AnimatedButton className="mt-2" size="sm" animateType="pulse">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Documentation
                </AnimatedButton>
                <AnimatedButton variant="outline" size="sm" className="mt-2" animateType="bounce">
                  Download SDK
                </AnimatedButton>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>REST API</CardTitle>
              <CardDescription>
                Use our REST API to integrate monitoring into your applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeSnippet 
                title="API Request Example" 
                code={apiIntegrationCode}
              />
              
              <div className="mt-6 space-y-2">
                <h3 className="font-medium">API Keys</h3>
                <div className="flex items-center justify-between border p-3 rounded-md">
                  <div>
                    <div className="font-medium">Production Key</div>
                    <div className="text-sm text-muted-foreground">••••••••••••••••</div>
                  </div>
                  <AnimatedButton variant="outline" size="sm" animateType="scale">Show</AnimatedButton>
                </div>
                <div className="flex items-center justify-between border p-3 rounded-md">
                  <div>
                    <div className="font-medium">Development Key</div>
                    <div className="text-sm text-muted-foreground">••••••••••••••••</div>
                  </div>
                  <AnimatedButton variant="outline" size="sm" animateType="scale">Show</AnimatedButton>
                </div>
                <AnimatedButton size="sm" className="mt-2" animateType="pulse">
                  Generate New Key
                </AnimatedButton>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="webhooks">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Configuration</CardTitle>
              <CardDescription>
                Configure webhooks to send real-time notifications to your systems
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="webhook-url">Webhook URL</Label>
                  <Input id="webhook-url" placeholder="https://example.com/webhook" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="secret-key">Secret Key</Label>
                  <Input id="secret-key" placeholder="Enter a secret key for signature verification" />
                </div>
                
                <div className="space-y-2">
                  <Label>Event Types</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="alert-created" />
                      <Label htmlFor="alert-created">Alert Created</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="alert-resolved" />
                      <Label htmlFor="alert-resolved">Alert Resolved</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="site-status-change" />
                      <Label htmlFor="site-status-change">Site Status Change</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="performance-threshold" />
                      <Label htmlFor="performance-threshold">Performance Threshold</Label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Webhook description" />
                </div>
                
                <AnimatedButton animateType="bounce">Save Webhook</AnimatedButton>
              </div>
              
              <div className="mt-8 space-y-2">
                <h3 className="font-medium">Active Webhooks</h3>
                <div className="border rounded-md divide-y">
                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium">Production Alerts</div>
                      <div className="text-sm text-muted-foreground">https://api.example.com/webhooks/alertify</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <AnimatedButton variant="outline" size="sm" animateType="scale">Edit</AnimatedButton>
                      <AnimatedButton variant="destructive" size="sm" animateType="pulse">Delete</AnimatedButton>
                    </div>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium">Incident Management</div>
                      <div className="text-sm text-muted-foreground">https://incidents.company.org/webhook</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <AnimatedButton variant="outline" size="sm" animateType="scale">Edit</AnimatedButton>
                      <AnimatedButton variant="destructive" size="sm" animateType="pulse">Delete</AnimatedButton>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      

    </DashboardLayout>
  );
}
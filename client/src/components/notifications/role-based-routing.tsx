import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertTriangle, 
  Bell, 
  CheckCircle2, 
  Mail, 
  Plus, 
  Smartphone, 
  Trash2, 
  Edit, 
  X,
  MessageSquare,
  Save
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AnimatedButton } from "@/components/ui/animated-button";

export type NotificationChannel = "email" | "push" | "sms" | "whatsapp";
export type AlertSeverity = "critical" | "high" | "medium" | "low" | "info";
export type TeamRole = "Administrator" | "CTO" | "Manager" | "Developer" | "Analyst" | "Support";

export interface NotificationRule {
  id: string;
  name: string;
  roles: TeamRole[];
  alertTypes: AlertSeverity[];
  channels: NotificationChannel[];
  enabled: boolean;
}

// Custom component for the form to add/edit notification rules
function RuleForm({ 
  onSubmit, 
  onCancel, 
  initialData 
}: { 
  onSubmit: (data: Omit<NotificationRule, "id">) => void; 
  onCancel: () => void; 
  initialData?: NotificationRule;
}) {
  const [name, setName] = useState(initialData?.name || "");
  const [roles, setRoles] = useState<TeamRole[]>(initialData?.roles || []);
  const [alertTypes, setAlertTypes] = useState<AlertSeverity[]>(initialData?.alertTypes || []);
  const [channels, setChannels] = useState<NotificationChannel[]>(initialData?.channels || []);

  const allRoles: TeamRole[] = ["Administrator", "CTO", "Manager", "Developer", "Analyst", "Support"];
  const allAlertTypes: AlertSeverity[] = ["critical", "high", "medium", "low", "info"];
  const allChannels: NotificationChannel[] = ["email", "push", "sms", "whatsapp"];

  const handleRoleToggle = (role: TeamRole) => {
    setRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role) 
        : [...prev, role]
    );
  };

  const handleAlertTypeToggle = (type: AlertSeverity) => {
    setAlertTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    );
  };

  const handleChannelToggle = (channel: NotificationChannel) => {
    setChannels(prev => 
      prev.includes(channel) 
        ? prev.filter(c => c !== channel) 
        : [...prev, channel]
    );
  };

  const handleSubmit = () => {
    if (!name) return;
    onSubmit({
      name,
      roles,
      alertTypes,
      channels,
      enabled: initialData?.enabled ?? true
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="rule-name">Rule Name</Label>
            <Input 
              id="rule-name" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="e.g., Critical Alerts for Developers"
            />
          </div>

          <div className="space-y-2">
            <Label>Team Roles</Label>
            <div className="grid grid-cols-2 gap-2">
              {allRoles.map(role => (
                <div key={role} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`role-${role}`} 
                    checked={roles.includes(role)}
                    onCheckedChange={() => handleRoleToggle(role)}
                  />
                  <Label htmlFor={`role-${role}`} className="cursor-pointer text-sm">
                    {role}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Alert Types</Label>
            <div className="flex flex-wrap gap-2">
              {allAlertTypes.map(type => (
                <Badge 
                  key={type}
                  variant={alertTypes.includes(type) ? "default" : "outline"}
                  className={`cursor-pointer ${alertTypes.includes(type) ? "" : "opacity-60"}`}
                  onClick={() => handleAlertTypeToggle(type)}
                >
                  {type === "critical" && <AlertTriangle className="h-3 w-3 mr-1" />}
                  {type === "high" && <AlertTriangle className="h-3 w-3 mr-1" />}
                  {type === "medium" && <AlertTriangle className="h-3 w-3 mr-1" />}
                  {type === "low" && <AlertTriangle className="h-3 w-3 mr-1" />}
                  {type === "info" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Notification Channels</Label>
            <div className="flex flex-wrap gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge 
                      variant={channels.includes("email") ? "default" : "outline"}
                      className={`cursor-pointer ${channels.includes("email") ? "" : "opacity-60"}`}
                      onClick={() => handleChannelToggle("email")}
                    >
                      <Mail className="h-3 w-3 mr-1" />
                      Email
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Send email notifications</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge 
                      variant={channels.includes("push") ? "default" : "outline"}
                      className={`cursor-pointer ${channels.includes("push") ? "" : "opacity-60"}`}
                      onClick={() => handleChannelToggle("push")}
                    >
                      <Bell className="h-3 w-3 mr-1" />
                      Push
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Send browser push notifications</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge 
                      variant={channels.includes("sms") ? "default" : "outline"}
                      className={`cursor-pointer ${channels.includes("sms") ? "" : "opacity-60"}`}
                      onClick={() => handleChannelToggle("sms")}
                    >
                      <Smartphone className="h-3 w-3 mr-1" />
                      SMS
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Send SMS alerts to mobile</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge 
                      variant={channels.includes("whatsapp") ? "default" : "outline"}
                      className={`cursor-pointer ${channels.includes("whatsapp") ? "" : "opacity-60"}`}
                      onClick={() => handleChannelToggle("whatsapp")}
                    >
                      <MessageSquare className="h-3 w-3 mr-1" />
                      WhatsApp
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Send WhatsApp messages</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <AnimatedButton 
              onClick={handleSubmit} 
              animateType="scale"
              disabled={!name || roles.length === 0 || alertTypes.length === 0 || channels.length === 0}
            >
              <Save className="h-4 w-4 mr-2" />
              {initialData ? "Update Rule" : "Add Rule"}
            </AnimatedButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Component to show a preview of a rule
function RulePreview({ rule }: { rule: NotificationRule }) {
  return (
    <div className={`border rounded-md p-3 ${rule.enabled ? "" : "opacity-60"}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="font-medium">{rule.name}</div>
        <Badge variant={rule.enabled ? "default" : "outline"}>
          {rule.enabled ? "Enabled" : "Disabled"}
        </Badge>
      </div>
      
      <div className="space-y-2">
        <div className="text-sm">
          <span className="text-muted-foreground">Roles: </span>
          <div className="flex flex-wrap gap-1 mt-1">
            {rule.roles.map(role => (
              <Badge key={role} variant="secondary" className="text-xs">
                {role}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="text-sm">
          <span className="text-muted-foreground">Alert types: </span>
          <div className="flex flex-wrap gap-1 mt-1">
            {rule.alertTypes.map(type => (
              <Badge key={type} variant="outline" className="text-xs">
                {type === "critical" && <AlertTriangle className="h-3 w-3 mr-1" />}
                {type === "high" && <AlertTriangle className="h-3 w-3 mr-1" />}
                {type === "medium" && <AlertTriangle className="h-3 w-3 mr-1" />}
                {type === "low" && <AlertTriangle className="h-3 w-3 mr-1" />}
                {type === "info" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="text-sm">
          <span className="text-muted-foreground">Channels: </span>
          <div className="flex flex-wrap gap-1 mt-1">
            {rule.channels.map(channel => (
              <Badge key={channel} variant="outline" className="text-xs">
                {channel === "email" && <Mail className="h-3 w-3 mr-1" />}
                {channel === "push" && <Bell className="h-3 w-3 mr-1" />}
                {channel === "sms" && <Smartphone className="h-3 w-3 mr-1" />}
                {channel === "whatsapp" && <MessageSquare className="h-3 w-3 mr-1" />}
                {channel.charAt(0).toUpperCase() + channel.slice(1)}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component
export function RoleBasedRouting() {
  const [rules, setRules] = useState<NotificationRule[]>([
    {
      id: "1",
      name: "Critical alerts for Admins & CTOs",
      roles: ["Administrator", "CTO"],
      alertTypes: ["critical", "high"],
      channels: ["email", "sms", "whatsapp"],
      enabled: true
    },
    {
      id: "2",
      name: "All alerts for DevOps team",
      roles: ["Developer", "Support"],
      alertTypes: ["critical", "high", "medium", "low", "info"],
      channels: ["email", "push"],
      enabled: true
    }
  ]);
  const [showForm, setShowForm] = useState(false);
  const [currentRule, setCurrentRule] = useState<NotificationRule | undefined>(undefined);
  const { toast } = useToast();
  
  const handleAddRule = () => {
    setCurrentRule(undefined);
    setShowForm(true);
  };
  
  const handleEditRule = (rule: NotificationRule) => {
    setCurrentRule(rule);
    setShowForm(true);
  };
  
  const handleDeleteRule = (id: string) => {
    setRules(prev => prev.filter(rule => rule.id !== id));
    toast({
      title: "Rule deleted",
      description: "Notification rule has been deleted successfully.",
    });
  };
  
  const handleSubmit = (data: Omit<NotificationRule, "id">) => {
    if (currentRule) {
      // Edit existing rule
      setRules(prev => prev.map(rule => 
        rule.id === currentRule.id 
          ? { ...data, id: rule.id } 
          : rule
      ));
      toast({
        title: "Rule updated",
        description: "Notification rule has been updated successfully.",
      });
    } else {
      // Add new rule
      const newRule: NotificationRule = {
        ...data,
        id: Date.now().toString()
      };
      setRules(prev => [...prev, newRule]);
      toast({
        title: "Rule added",
        description: "New notification rule has been added successfully.",
      });
    }
    setShowForm(false);
  };
  
  const handleToggleRule = (id: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === id 
        ? { ...rule, enabled: !rule.enabled } 
        : rule
    ));
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Role-Based Notification Routing</h3>
        {!showForm && (
          <AnimatedButton 
            onClick={handleAddRule} 
            animateType="scale"
            variant="outline"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Rule
          </AnimatedButton>
        )}
      </div>
      
      {showForm ? (
        <RuleForm 
          onSubmit={handleSubmit} 
          onCancel={() => setShowForm(false)} 
          initialData={currentRule}
        />
      ) : (
        <div className="space-y-3">
          {rules.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No notification rules defined yet. Add your first rule.
            </div>
          ) : (
            rules.map(rule => (
              <div key={rule.id} className="relative group">
                <RulePreview rule={rule} />
                <div className="absolute top-3 right-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleToggleRule(rule.id)}
                  >
                    {rule.enabled ? (
                      <X className="h-4 w-4" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEditRule(rule)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleDeleteRule(rule.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
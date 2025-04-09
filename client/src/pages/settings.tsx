import { useState } from "react";
import DashboardLayout from "@/components/dashboard/layout";
import { Button } from "@/components/ui/button";
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
import { RoleBasedRouting } from "@/components/notifications/role-based-routing";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  UserCog,
  Mail,
  Smartphone,
  ShieldAlert,
  CreditCard,
  Receipt,
  Building,
  Clock,
  Save,
  ChevronRight,
  AlertCircle,
  DownloadCloud,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  
  // Profile state
  const [profileData, setProfileData] = useState({
    fullName: "Aman Jha",
    email: "aman@alertify.com",
    jobTitle: "Senior Developer",
    phone: "+91 9876543210",
    timezone: "Asia/Kolkata"
  });
  
  // Notifications state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    whatsappNotifications: false,
    criticalAlerts: "immediate",
    warningAlerts: "hourly",
    infoAlerts: "daily"
  });
  
  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfileData({
      ...profileData,
      [id === "name" ? "fullName" : id === "job-title" ? "jobTitle" : id]: value
    });
  };
  
  // Handle timezone change
  const handleTimezoneChange = (value: string) => {
    setProfileData({
      ...profileData,
      timezone: value
    });
  };
  
  // Notification handlers
  const handleSwitchChange = (id: string, checked: boolean) => {
    const field = id.replace("-", "") as keyof typeof notificationSettings;
    setNotificationSettings({
      ...notificationSettings,
      [field]: checked
    });
  };
  
  const handleFrequencyChange = (id: string, value: string) => {
    const field = id.replace("-", "") as keyof typeof notificationSettings;
    setNotificationSettings({
      ...notificationSettings,
      [field]: value
    });
  };
  
  // Save profile changes
  const saveProfileChanges = async () => {
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Show success state
      setSaveSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Save notification settings
  const saveNotificationSettings = async () => {
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Show success state
      setSaveSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to save notification settings:", error);
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <DashboardLayout title="Settings">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-64 flex-shrink-0">
            <TabsList className="flex flex-col h-auto space-y-1 bg-transparent p-0">
              <TabsTrigger
                value="profile"
                className="justify-start w-full px-3 py-2 h-auto"
              >
                <UserCog className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="justify-start w-full px-3 py-2 h-auto"
              >
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="justify-start w-full px-3 py-2 h-auto"
              >
                <ShieldAlert className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger
                value="billing"
                className="justify-start w-full px-3 py-2 h-auto"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Billing
              </TabsTrigger>
              <TabsTrigger
                value="organization"
                className="justify-start w-full px-3 py-2 h-auto"
              >
                <Building className="h-4 w-4 mr-2" />
                Organization
              </TabsTrigger>
              <TabsTrigger
                value="data"
                className="justify-start w-full px-3 py-2 h-auto"
              >
                <DownloadCloud className="h-4 w-4 mr-2" />
                Data Export
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="flex-1">
            <TabsContent value="profile" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>
                    Manage your personal information and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input 
                            id="name" 
                            placeholder="Full Name" 
                            value={profileData.fullName}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            placeholder="Email" 
                            value={profileData.email}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="job-title">Job Title</Label>
                          <Input 
                            id="job-title" 
                            placeholder="Job Title" 
                            value={profileData.jobTitle}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input 
                            id="phone" 
                            placeholder="Phone Number" 
                            value={profileData.phone}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="timezone">Timezone</Label>
                          <Select 
                            value={profileData.timezone}
                            onValueChange={handleTimezoneChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select timezone" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Asia/Kolkata">Asia/Kolkata (GMT+5:30)</SelectItem>
                              <SelectItem value="America/New_York">America/New_York (GMT-4)</SelectItem>
                              <SelectItem value="Europe/London">Europe/London (GMT+1)</SelectItem>
                              <SelectItem value="Asia/Tokyo">Asia/Tokyo (GMT+9)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full md:w-1/3 space-y-6">
                      <div className="space-y-2">
                        <Label>Profile Picture</Label>
                        <div className="flex flex-col items-center gap-2 border rounded-md p-4">
                          <Avatar className="h-20 w-20">
                            <AvatarImage src="" />
                            <AvatarFallback className="text-xl">AJ</AvatarFallback>
                          </Avatar>
                          <Button variant="outline" size="sm" className="mt-2">
                            Change Photo
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Account Status</Label>
                        <div className="border rounded-md p-4">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">Status</span>
                            <Badge>Active</Badge>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-medium">Member Since</span>
                            <span className="text-sm">May 12, 2023</span>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-medium">Last Login</span>
                            <span className="text-sm">Today at 3:45 PM</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-end gap-4">
                  {saveSuccess && (
                    <div className="text-success-500 flex items-center">
                      <span className="material-icons text-sm mr-1">check_circle</span>
                      <span>Profile updated successfully!</span>
                    </div>
                  )}
                  <Button 
                    onClick={saveProfileChanges} 
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <span className="animate-spin material-icons h-4 w-4 mr-2">refresh</span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Manage how and when you receive alerts and notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Alert Channels</h3>
                    
                    <div className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-5 w-5 text-primary" />
                        <div>
                          <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                        </div>
                      </div>
                      <Switch 
                        id="email-notifications" 
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) => handleSwitchChange("emailNotifications", checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center space-x-2">
                        <Bell className="h-5 w-5 text-primary" />
                        <div>
                          <Label htmlFor="push-notifications" className="text-base">Push Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive notifications in browser</p>
                        </div>
                      </div>
                      <Switch 
                        id="push-notifications" 
                        checked={notificationSettings.pushNotifications}
                        onCheckedChange={(checked) => handleSwitchChange("pushNotifications", checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center space-x-2">
                        <Smartphone className="h-5 w-5 text-primary" />
                        <div>
                          <Label htmlFor="sms-notifications" className="text-base">SMS Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive critical alerts via SMS</p>
                        </div>
                      </div>
                      <Switch 
                        id="sms-notifications" 
                        checked={notificationSettings.smsNotifications}
                        onCheckedChange={(checked) => handleSwitchChange("smsNotifications", checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between pb-4">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-5 w-5 text-primary" />
                        <div>
                          <Label htmlFor="whatsapp-notifications" className="text-base">WhatsApp Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive alerts via WhatsApp</p>
                        </div>
                      </div>
                      <Switch 
                        id="whatsapp-notifications" 
                        checked={notificationSettings.whatsappNotifications}
                        onCheckedChange={(checked) => handleSwitchChange("whatsappNotifications", checked)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-4">
                    <h3 className="text-lg font-medium">Notification Frequency</h3>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="critical-alerts">Critical Alerts</Label>
                        <Select 
                          value={notificationSettings.criticalAlerts}
                          onValueChange={(value) => handleFrequencyChange("criticalAlerts", value)}
                        >
                          <SelectTrigger id="critical-alerts">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="immediate">Immediately</SelectItem>
                            <SelectItem value="hourly">Hourly Digest</SelectItem>
                            <SelectItem value="daily">Daily Digest</SelectItem>
                            <SelectItem value="off">Turn Off</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="warning-alerts">Warning Alerts</Label>
                        <Select 
                          value={notificationSettings.warningAlerts}
                          onValueChange={(value) => handleFrequencyChange("warningAlerts", value)}
                        >
                          <SelectTrigger id="warning-alerts">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="immediate">Immediately</SelectItem>
                            <SelectItem value="hourly">Hourly Digest</SelectItem>
                            <SelectItem value="daily">Daily Digest</SelectItem>
                            <SelectItem value="off">Turn Off</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="info-alerts">Informational Alerts</Label>
                        <Select 
                          value={notificationSettings.infoAlerts}
                          onValueChange={(value) => handleFrequencyChange("infoAlerts", value)}
                        >
                          <SelectTrigger id="info-alerts">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="immediate">Immediately</SelectItem>
                            <SelectItem value="hourly">Hourly Digest</SelectItem>
                            <SelectItem value="daily">Daily Digest</SelectItem>
                            <SelectItem value="off">Turn Off</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t mt-6">
                    <RoleBasedRouting />
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-end gap-4">
                  {saveSuccess && (
                    <div className="text-success-500 flex items-center">
                      <span className="material-icons text-sm mr-1">check_circle</span>
                      <span>Notification settings updated successfully!</span>
                    </div>
                  )}
                  <Button 
                    onClick={saveNotificationSettings} 
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <span className="animate-spin material-icons h-4 w-4 mr-2">refresh</span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Notification Settings
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="security" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your account security and authentication methods
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Password</h3>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" placeholder="••••••••" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" placeholder="••••••••" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" placeholder="••••••••" />
                      </div>
                      
                      <Button className="w-full md:w-auto">Change Password</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                      </div>
                      <Button variant="outline">Enable 2FA</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-medium">Sessions</h3>
                    <div className="space-y-4">
                      <div className="border rounded-md p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Current Session</p>
                            <p className="text-sm text-muted-foreground">Chrome on Windows • Delhi, India</p>
                          </div>
                          <Badge>Active Now</Badge>
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Mobile App</p>
                            <p className="text-sm text-muted-foreground">iPhone 13 • Last active 2 hours ago</p>
                          </div>
                          <Button variant="outline" size="sm">Logout</Button>
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Safari on MacBook</p>
                            <p className="text-sm text-muted-foreground">Last active 3 days ago</p>
                          </div>
                          <Button variant="outline" size="sm">Logout</Button>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline">Logout from All Devices</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="billing" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Billing Settings</CardTitle>
                  <CardDescription>
                    Manage your billing information and subscription
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border rounded-md p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-lg">Current Plan</h3>
                        <div className="flex items-center mt-1">
                          <Badge className="mr-2 bg-primary/20 text-primary hover:bg-primary/20 rounded-sm font-semibold">PRO</Badge>
                          <span className="text-muted-foreground">$49/month</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">Your plan renews on April 28, 2025</p>
                      </div>
                      <div>
                        <Button variant="outline">Change Plan</Button>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
                      <div className="flex items-center justify-between mb-1">
                        <span>Monitored Websites</span>
                        <span>15 / 25</span>
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <span>Team Members</span>
                        <span>5 / 10</span>
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <span>Historical Data</span>
                        <span>12 months</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Payment Method</h3>
                    <div className="border rounded-md p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="bg-slate-100 p-2 rounded-md mr-3">
                            <CreditCard className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium">Visa ending in 4242</p>
                            <p className="text-sm text-muted-foreground">Expires 06/2026</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                    <Button variant="outline">Add Payment Method</Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Billing History</h3>
                      <Button variant="link" className="gap-1 p-0">
                        View All
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="border rounded-md divide-y">
                      <div className="p-3 flex items-center justify-between">
                        <div>
                          <p className="font-medium">Pro Plan - Monthly</p>
                          <p className="text-sm text-muted-foreground">March 28, 2025</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">$49.00</p>
                          <Button variant="link" size="sm" className="h-auto p-0">
                            <Receipt className="h-3 w-3 mr-1" />
                            Invoice
                          </Button>
                        </div>
                      </div>
                      <div className="p-3 flex items-center justify-between">
                        <div>
                          <p className="font-medium">Pro Plan - Monthly</p>
                          <p className="text-sm text-muted-foreground">February 28, 2025</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">$49.00</p>
                          <Button variant="link" size="sm" className="h-auto p-0">
                            <Receipt className="h-3 w-3 mr-1" />
                            Invoice
                          </Button>
                        </div>
                      </div>
                      <div className="p-3 flex items-center justify-between">
                        <div>
                          <p className="font-medium">Pro Plan - Monthly</p>
                          <p className="text-sm text-muted-foreground">January 28, 2025</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">$49.00</p>
                          <Button variant="link" size="sm" className="h-auto p-0">
                            <Receipt className="h-3 w-3 mr-1" />
                            Invoice
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="organization" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Organization Settings</CardTitle>
                  <CardDescription>
                    Manage your organization details and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="org-name">Organization Name</Label>
                      <Input id="org-name" placeholder="Organization Name" defaultValue="Alertify Technologies Ltd." />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="org-email">Organization Email</Label>
                      <Input id="org-email" type="email" placeholder="Organization Email" defaultValue="contact@alertify.com" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="org-phone">Organization Phone</Label>
                      <Input id="org-phone" placeholder="Organization Phone" defaultValue="+91 11 4567 8900" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="org-website">Website</Label>
                      <Input id="org-website" placeholder="Website" defaultValue="https://alertify.com" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="org-address">Address</Label>
                      <Textarea 
                        id="org-address" 
                        placeholder="Address" 
                        defaultValue="742 Evergreen Terrace, Springfield"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="org-city">City</Label>
                        <Input id="org-city" placeholder="City" defaultValue="New Delhi" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="org-state">State</Label>
                        <Input id="org-state" placeholder="State" defaultValue="Delhi" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="org-zip">ZIP Code</Label>
                        <Input id="org-zip" placeholder="ZIP Code" defaultValue="110001" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="org-country">Country</Label>
                      <Select defaultValue="IN">
                        <SelectTrigger id="org-country">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="IN">India</SelectItem>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="GB">United Kingdom</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                          <SelectItem value="AU">Australia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Organization Logo</Label>
                      <div className="flex flex-col items-center gap-2 border rounded-md p-4">
                        <div className="w-32 h-32 bg-muted rounded-md flex items-center justify-center">
                          <span className="text-2xl font-bold text-primary">A</span>
                        </div>
                        <Button variant="outline" size="sm" className="mt-2">
                          Upload Logo
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Save Organization Settings
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="data" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Data Export</CardTitle>
                  <CardDescription>
                    Export your monitoring data and reports
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Export Options</h3>
                    
                    <div className="border rounded-md p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-medium">Alerts History</h4>
                          <p className="text-sm text-muted-foreground">Export all alerts and incidents</p>
                        </div>
                        <Button variant="outline">Export</Button>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="alerts-date-range">Date Range</Label>
                        <Select defaultValue="last30">
                          <SelectTrigger id="alerts-date-range">
                            <SelectValue placeholder="Select date range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="last7">Last 7 days</SelectItem>
                            <SelectItem value="last30">Last 30 days</SelectItem>
                            <SelectItem value="last90">Last 90 days</SelectItem>
                            <SelectItem value="custom">Custom range</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2 mt-4">
                        <Label htmlFor="alerts-format">Export Format</Label>
                        <Select defaultValue="csv">
                          <SelectTrigger id="alerts-format">
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="csv">CSV</SelectItem>
                            <SelectItem value="json">JSON</SelectItem>
                            <SelectItem value="excel">Excel</SelectItem>
                            <SelectItem value="pdf">PDF</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-medium">Performance Data</h4>
                          <p className="text-sm text-muted-foreground">Export uptime and response time metrics</p>
                        </div>
                        <Button variant="outline">Export</Button>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="perf-date-range">Date Range</Label>
                        <Select defaultValue="last90">
                          <SelectTrigger id="perf-date-range">
                            <SelectValue placeholder="Select date range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="last7">Last 7 days</SelectItem>
                            <SelectItem value="last30">Last 30 days</SelectItem>
                            <SelectItem value="last90">Last 90 days</SelectItem>
                            <SelectItem value="custom">Custom range</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2 mt-4">
                        <Label htmlFor="perf-format">Export Format</Label>
                        <Select defaultValue="excel">
                          <SelectTrigger id="perf-format">
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="csv">CSV</SelectItem>
                            <SelectItem value="json">JSON</SelectItem>
                            <SelectItem value="excel">Excel</SelectItem>
                            <SelectItem value="pdf">PDF</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-medium">Account Data</h4>
                          <p className="text-sm text-muted-foreground">Export all your account data</p>
                        </div>
                        <Button variant="outline">Export</Button>
                      </div>
                      
                      <div className="mt-2 text-sm text-muted-foreground">
                        <p>This includes your profile, monitored sites, settings, and preferences.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-medium">Scheduled Exports</h3>
                    
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <p className="font-medium">Weekly Performance Report</p>
                        <p className="text-sm text-muted-foreground">Sent every Monday at 9:00 AM</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="destructive" size="sm">Delete</Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Monthly Alert Summary</p>
                        <p className="text-sm text-muted-foreground">Sent on the 1st of each month</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="destructive" size="sm">Delete</Button>
                      </div>
                    </div>
                    
                    <Button>Schedule New Export</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </div>
      </Tabs>
      
      <div className="text-center text-sm text-muted-foreground mt-8">
        <p>Developed by Aman Jha</p>
      </div>
    </DashboardLayout>
  );
}
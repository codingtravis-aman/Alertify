import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/dashboard/layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AnimatedButton } from "@/components/ui/animated-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Mail, Phone, Globe, Users, Shield } from "lucide-react";

// Mock data for team members
const teamMembers = [
  {
    id: 1,
    name: "Aman Jha",
    role: "Administrator",
    email: "aman@alertify.com",
    phone: "+91 9876543210",
    avatar: "",
    joinedAt: "2023-05-12",
    lastActive: "2 hours ago",
    status: "active",
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Developer",
    email: "priya@alertify.com",
    phone: "+91 9876543211",
    avatar: "",
    joinedAt: "2023-06-15",
    lastActive: "30 minutes ago",
    status: "active",
  },
  {
    id: 3,
    name: "Rahul Verma",
    role: "Support",
    email: "rahul@alertify.com",
    phone: "+91 9876543212",
    avatar: "",
    joinedAt: "2023-07-20",
    lastActive: "1 day ago",
    status: "active",
  },
  {
    id: 4,
    name: "Neha Gupta",
    role: "Analyst",
    email: "neha@alertify.com",
    phone: "+91 9876543213",
    avatar: "",
    joinedAt: "2023-08-05",
    lastActive: "5 hours ago",
    status: "active",
  },
  {
    id: 5,
    name: "Vikram Singh",
    role: "Manager",
    email: "vikram@alertify.com",
    phone: "+91 9876543214",
    avatar: "",
    joinedAt: "2023-09-10",
    lastActive: "3 days ago",
    status: "inactive",
  },
  {
    id: 6,
    name: "Amit Kumar",
    role: "CTO",
    email: "amit@alertify.com",
    phone: "+91 9876543215",
    avatar: "",
    joinedAt: "2023-05-05",
    lastActive: "10 minutes ago",
    status: "active",
  }
];

// Mock data for teams
const teams = [
  {
    id: 1,
    name: "Development Team",
    memberCount: 8,
    description: "Responsible for product development and engineering",
    createdAt: "2023-05-01",
  },
  {
    id: 2,
    name: "Marketing Team",
    memberCount: 5,
    description: "Handles marketing, promotions and customer outreach",
    createdAt: "2023-06-01",
  },
  {
    id: 3,
    name: "Support Team",
    memberCount: 6,
    description: "Provides customer support and handles service requests",
    createdAt: "2023-07-01",
  }
];

function TeamMemberCard({ member }: { member: typeof teamMembers[0] }) {
  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="h-12 w-12 border">
            <AvatarImage src={member.avatar} alt={member.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                member.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {member.status === 'active' ? 'Online' : 'Offline'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{member.role}</p>
            <div className="flex items-center mt-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4 mr-1" />
              <span>{member.email}</span>
            </div>
            <div className="flex items-center mt-1 text-sm text-muted-foreground">
              <Phone className="h-4 w-4 mr-1" />
              <span>{member.phone}</span>
            </div>
            <div className="flex justify-between mt-3 text-xs text-muted-foreground">
              <span>Joined: {member.joinedAt}</span>
              <span>Last active: {member.lastActive}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TeamCard({ team }: { team: typeof teams[0] }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>{team.name}</CardTitle>
        <CardDescription>{team.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-1" />
            <span>{team.memberCount} members</span>
          </div>
          <AnimatedButton variant="outline" size="sm" animateType="scale">Manage</AnimatedButton>
        </div>
      </CardContent>
    </Card>
  );
}

function AddMemberForm({ onAddMember }: { onAddMember: (member: any) => void }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when field is changed
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    }
    
    if (!formData.role) {
      newErrors.role = "Role is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const submitForm = () => {
    if (validateForm()) {
      const newMember = {
        id: Date.now(), // Generate a unique ID
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role === "admin" ? "Administrator" :
              formData.role === "cto" ? "CTO" :
              formData.role === "manager" ? "Manager" :
              formData.role === "developer" ? "Developer" :
              formData.role === "analyst" ? "Analyst" : "Support",
        avatar: "",
        joinedAt: new Date().toISOString().split('T')[0],
        lastActive: "Just now",
        status: "active"
      };
      
      onAddMember(newMember);
    }
  };
  
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Full Name
        </Label>
        <div className="col-span-3 space-y-1">
          <Input 
            id="name" 
            placeholder="Full Name" 
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="email" className="text-right">
          Email
        </Label>
        <div className="col-span-3 space-y-1">
          <Input 
            id="email" 
            placeholder="Email" 
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="phone" className="text-right">
          Phone
        </Label>
        <div className="col-span-3 space-y-1">
          <Input 
            id="phone" 
            placeholder="Phone Number" 
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="role" className="text-right">
          Role
        </Label>
        <div className="col-span-3 space-y-1">
          <Select 
            value={formData.role} 
            onValueChange={(value) => handleChange("role", value)}
          >
            <SelectTrigger className={errors.role ? "border-red-500" : ""}>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Administrator</SelectItem>
              <SelectItem value="cto">CTO</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="developer">Developer</SelectItem>
              <SelectItem value="analyst">Analyst</SelectItem>
              <SelectItem value="support">Support</SelectItem>
            </SelectContent>
          </Select>
          {errors.role && <p className="text-xs text-red-500">{errors.role}</p>}
        </div>
      </div>
      
      <div className="col-span-4 flex justify-end">
        <AnimatedButton type="button" onClick={submitForm} className="mt-2" animateType="scale">
          Add Member
        </AnimatedButton>
      </div>
    </div>
  );
}

function AddTeamForm({ onAddTeam }: { onAddTeam?: (team: any) => void }) {
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });
  
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSubmit = () => {
    if (onAddTeam) {
      const newTeam = {
        id: Date.now(),
        name: formData.name,
        description: formData.description,
        memberCount: 1,
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      onAddTeam(newTeam);
    }
  };
  
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="teamName" className="text-right">
          Team Name
        </Label>
        <Input 
          id="teamName" 
          placeholder="Team Name" 
          className="col-span-3"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="description" className="text-right">
          Description
        </Label>
        <Input 
          id="description" 
          placeholder="Description" 
          className="col-span-3"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>
      
      <div className="col-span-4 flex justify-end">
        <AnimatedButton type="button" onClick={handleSubmit} className="mt-2" animateType="pulse">
          Create Team
        </AnimatedButton>
      </div>
    </div>
  );
}

export default function TeamPage() {
  const [activeTab, setActiveTab] = useState("members");
  const [membersList, setMembersList] = useState(teamMembers);
  const [teamList, setTeamList] = useState(teams);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [isAddTeamDialogOpen, setIsAddTeamDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
  const { data: members = membersList } = useQuery({
    queryKey: ['/api/team/members'],
    queryFn: () => Promise.resolve(membersList),
  });
  
  const { data: teamsList = teamList } = useQuery({
    queryKey: ['/api/teams'],
    queryFn: () => Promise.resolve(teamList),
  });
  
  const handleAddMember = (newMember: any) => {
    setMembersList(prev => [newMember, ...prev]);
    setIsAddMemberDialogOpen(false);
    
    // Show success message
    setSuccessMessage(`${newMember.name} has been added to the team successfully!`);
    
    // Clear the success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };
  
  const handleAddTeam = (newTeam: any) => {
    setTeamList(prev => [newTeam, ...prev]);
    setIsAddTeamDialogOpen(false);
    
    // Show success message
    setSuccessMessage(`Team "${newTeam.name}" has been created successfully!`);
    
    // Clear the success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  return (
    <DashboardLayout title="Team Management">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
          <p className="text-muted-foreground">
            Manage your team members and departments
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
            <DialogTrigger asChild>
              <AnimatedButton animateType="scale">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Member
              </AnimatedButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[475px]">
              <DialogHeader>
                <DialogTitle>Add Team Member</DialogTitle>
                <DialogDescription>
                  Add a new member to your team. They'll receive an invitation email.
                </DialogDescription>
              </DialogHeader>
              <AddMemberForm onAddMember={handleAddMember} />
            </DialogContent>
          </Dialog>
          
          <Dialog open={isAddTeamDialogOpen} onOpenChange={setIsAddTeamDialogOpen}>
            <DialogTrigger asChild>
              <AnimatedButton variant="outline" animateType="bounce">
                <Shield className="h-4 w-4 mr-2" />
                New Team
              </AnimatedButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[475px]">
              <DialogHeader>
                <DialogTitle>Create New Team</DialogTitle>
                <DialogDescription>
                  Create a new team or department for your organization.
                </DialogDescription>
              </DialogHeader>
              <AddTeamForm onAddTeam={handleAddTeam} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {successMessage && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 border border-green-200 rounded-md flex items-center">
          <span className="mr-2">✓</span>
          {successMessage}
        </div>
      )}
      
      <Tabs defaultValue="members" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="teams">Teams & Departments</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="members">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="teams">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamsList.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Role Permissions</CardTitle>
              <CardDescription>
                Configure access levels and permissions for different roles in your organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <h3 className="font-semibold mb-2">Administrator</h3>
                  <p className="text-sm text-muted-foreground mb-3">Full access to all features and settings</p>
                  <AnimatedButton size="sm" variant="outline" animateType="pulse">Edit Permissions</AnimatedButton>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-semibold mb-2">CTO</h3>
                  <p className="text-sm text-muted-foreground mb-3">Technical leadership with access to all engineering features</p>
                  <AnimatedButton size="sm" variant="outline" animateType="pulse">Edit Permissions</AnimatedButton>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-semibold mb-2">Manager</h3>
                  <p className="text-sm text-muted-foreground mb-3">Can manage team members and view all data</p>
                  <AnimatedButton size="sm" variant="outline" animateType="bounce">Edit Permissions</AnimatedButton>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-semibold mb-2">Developer</h3>
                  <p className="text-sm text-muted-foreground mb-3">Can view dashboards and manage sites</p>
                  <AnimatedButton size="sm" variant="outline" animateType="scale">Edit Permissions</AnimatedButton>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-semibold mb-2">Support</h3>
                  <p className="text-sm text-muted-foreground mb-3">Can view alerts and respond to incidents</p>
                  <AnimatedButton size="sm" variant="outline" animateType="spin">Edit Permissions</AnimatedButton>
                </div>
                
                <div className="border rounded-md p-4">
                  <h3 className="font-semibold mb-2">Analyst</h3>
                  <p className="text-sm text-muted-foreground mb-3">Can view reports and analytics data</p>
                  <AnimatedButton size="sm" variant="outline" animateType="bounce">Edit Permissions</AnimatedButton>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="text-center text-sm text-muted-foreground mt-8">
        <p>Developed by Aman Jha</p>
      </div>
    </DashboardLayout>
  );
}
import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogFooter, 
  DialogDescription,
  DialogHeader 
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { deleteSite, updateSite, createSite } from "@/lib/api";
import type { Site, InsertSite } from "@shared/schema";

interface EnrichedSite extends Site {
  stats?: {
    uptimePercentage: number;
    avgResponseTime: number;
    lastCheck?: Date;
    uptimeChange?: number;
    responseTimeChange?: number;
  };
}

interface SitesTableProps {
  limit?: number;
  teamId?: number;
}

// Define schemas for site forms
const addSiteSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  url: z.string().url("Please enter a valid URL"),
  checkFrequency: z.number().min(1).max(60),
  type: z.string(),
  active: z.boolean().optional(),
  teamId: z.number().default(1)
});

const editSiteSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  url: z.string().url("Please enter a valid URL"),
  checkFrequency: z.number().min(1).max(60),
  type: z.string(),
  active: z.boolean().optional()
});

type AddSiteFormValues = z.infer<typeof addSiteSchema>;
type EditSiteFormValues = z.infer<typeof editSiteSchema>;

// Add Site Form Component
function AddSiteForm({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const form = useForm<AddSiteFormValues>({
    resolver: zodResolver(addSiteSchema),
    defaultValues: {
      name: "",
      url: "",
      type: "website",
      checkFrequency: 5,
      active: true,
      teamId: 1
    },
  });
  
  const { handleSubmit, formState } = form;
  
  const onSubmit = async (data: AddSiteFormValues) => {
    try {
      await createSite(data);
      queryClient.invalidateQueries({ queryKey: ['/api/sites'] });
      onClose();
      toast({
        title: "Site Added",
        description: `${data.name} has been added successfully to monitoring.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to add site: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="My Website" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="mobile_app">Mobile App</SelectItem>
                  <SelectItem value="api">API</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="checkFrequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Check Interval (minutes)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min={1} 
                  max={60} 
                  {...field}
                  onChange={e => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter className="pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={formState.isSubmitting}
          >
            {formState.isSubmitting ? "Adding..." : "Add Site"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

// Edit Site Form Component
function EditSiteForm({ site, onClose }: { site: EnrichedSite, onClose: () => void }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const form = useForm<EditSiteFormValues>({
    resolver: zodResolver(editSiteSchema),
    defaultValues: {
      name: site.name,
      url: site.url,
      type: site.type || "website",
      checkFrequency: site.checkFrequency || 5,
      active: site.active === true,
    },
  });
  
  const { handleSubmit, formState } = form;
  
  const onSubmit = async (data: EditSiteFormValues) => {
    try {
      await updateSite(site.id, data);
      queryClient.invalidateQueries({ queryKey: ['/api/sites'] });
      onClose();
      toast({
        title: "Site Updated",
        description: `${data.name} has been updated successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to update site: ${(error as Error).message}`,
        variant: "destructive",
      });
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="My Website" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="mobile_app">Mobile App</SelectItem>
                  <SelectItem value="api">API</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="checkFrequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Check Interval (minutes)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min={1} 
                  max={60} 
                  {...field}
                  onChange={e => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter className="pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={formState.isSubmitting}
          >
            {formState.isSubmitting ? "Updating..." : "Update Site"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default function SitesTable({ limit, teamId }: SitesTableProps) {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isAddSiteOpen, setIsAddSiteOpen] = useState(false);
  const [isEditSiteOpen, setIsEditSiteOpen] = useState(false);
  const [isDeleteSiteOpen, setIsDeleteSiteOpen] = useState(false);
  const [currentSite, setCurrentSite] = useState<EnrichedSite | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const pageSize = limit || 5;

  const { data: sites, isLoading, error, refetch } = useQuery<EnrichedSite[]>({
    queryKey: ['/api/sites'],
    refetchInterval: 30000, // Auto refresh every 30 seconds
  });

  const getSiteStatus = (site: EnrichedSite): string => {
    if (!site.stats) return "default";
    
    const { uptimePercentage, avgResponseTime } = site.stats;
    
    if (uptimePercentage < 99) return "error";
    if (uptimePercentage < 99.8 || avgResponseTime > 700) return "warning";
    return "success";
  };

  const getSiteIcon = (type: string): string => {
    switch (type.toLowerCase()) {
      case "mobile_app":
        return "smartphone";
      case "api":
        return "api";
      default:
        return "language";
    }
  };

  if (isLoading) {
    return (
      <div className="mt-4 bg-white shadow sm:rounded-lg">
        <div className="animate-pulse p-4">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 bg-white shadow sm:rounded-lg p-6">
        <p className="text-danger-500">Error loading sites: {(error as Error).message}</p>
      </div>
    );
  }

  // Filter and paginate sites
  // Ensure sites data exists and apply filtering
  const filteredSites = sites ? 
    (teamId ? sites.filter(site => site.teamId === teamId) : sites)
      .filter(site => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
          site.name.toLowerCase().includes(query) || 
          site.url.toLowerCase().includes(query)
        );
      }) 
    : [];
  
  const paginatedSites = filteredSites
    .slice((currentPage - 1) * pageSize, currentPage * pageSize);
  
  const totalPages = Math.ceil(filteredSites.length / pageSize);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold text-gray-800">Monitored Websites & Apps</h2>
          <Button
            variant="ghost"
            size="sm"
            className="ml-2"
            onClick={() => refetch()}
            title="Refresh"
          >
            <span className="material-icons">refresh</span>
          </Button>
        </div>
        <Button 
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
          onClick={() => setIsAddSiteOpen(true)}
        >
          <span className="material-icons text-sm mr-2">add</span>
          Add New
        </Button>
      </div>
      
      {/* Search filter */}
      <div className="mt-4 mb-4 flex">
        <div className="relative w-full md:w-1/3">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="material-icons text-gray-400 text-sm">search</span>
          </div>
          <input
            type="text"
            className="pl-10 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Search websites by name or URL..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page when searching
            }}
          />
          {searchQuery && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <button 
                onClick={() => setSearchQuery("")}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="material-icons text-sm">close</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Name</th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Uptime</th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Response Time</th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Last Check</th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedSites.map((site) => {
                const status = getSiteStatus(site);
                const statusText = status === "success" ? "Operational" : 
                                  status === "warning" ? "Performance Issues" : 
                                  "Critical Issues";
                                  
                return (
                  <tr key={site.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded bg-gray-100">
                          <span className="material-icons text-gray-500">{getSiteIcon(site.type)}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{site.name}</div>
                          <div className="text-sm text-gray-500">{site.url}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={status} text={statusText} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{site.stats?.uptimePercentage.toFixed(1)}%</div>
                      {site.stats?.uptimeChange && (
                        <div className={cn(
                          "text-xs",
                          site.stats.uptimeChange >= 0 ? "text-success-500" : "text-danger-500"
                        )}>
                          {site.stats.uptimeChange > 0 ? "+" : ""}{site.stats.uptimeChange.toFixed(1)}%
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-mono">{site.stats?.avgResponseTime}ms</div>
                      {site.stats?.responseTimeChange && (
                        <div className={cn(
                          "text-xs",
                          site.stats.responseTimeChange <= 0 ? "text-success-500" : 
                          site.stats.responseTimeChange < 100 ? "text-warning-500" : "text-danger-500"
                        )}>
                          {site.stats.responseTimeChange > 0 ? "+" : ""}{site.stats.responseTimeChange}ms
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {site.stats?.lastCheck ? formatDistanceToNow(new Date(site.stats.lastCheck), { addSuffix: true }) : "Not checked yet"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/sites/${site.id}`} className="text-primary-600 hover:text-primary-700">
                          View
                        </Link>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <span className="material-icons">more_vert</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => {
                                setCurrentSite(site);
                                setIsEditSiteOpen(true);
                              }}
                              className="cursor-pointer"
                            >
                              <span className="material-icons text-sm mr-2">edit</span>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => {
                                setCurrentSite(site);
                                setIsDeleteSiteOpen(true);
                              }}
                              className="cursor-pointer text-red-600 focus:text-red-600"
                            >
                              <span className="material-icons text-sm mr-2">delete</span>
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="px-5 py-3 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-sm text-gray-700">
                Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(currentPage * pageSize, filteredSites.length)}
                </span>{" "}
                of <span className="font-medium">{filteredSites.length}</span> websites
              </span>
            </div>
            <nav className="inline-flex rounded-md">
              <button
                className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-l-md text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  className={cn(
                    "inline-flex items-center px-3 py-1 text-sm font-medium border",
                    currentPage === i + 1
                      ? "text-white bg-primary-600 border-primary-600"
                      : "text-gray-500 bg-white border-gray-300 hover:bg-gray-50"
                  )}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-r-md text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Add Site Dialog */}
      <Dialog open={isAddSiteOpen} onOpenChange={setIsAddSiteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Website or App</DialogTitle>
          </DialogHeader>
          
          <AddSiteForm onClose={() => setIsAddSiteOpen(false)} />
        </DialogContent>
      </Dialog>
      
      {/* Edit Site Dialog */}
      {currentSite && (
        <Dialog open={isEditSiteOpen} onOpenChange={setIsEditSiteOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Website</DialogTitle>
            </DialogHeader>
            
            <EditSiteForm 
              site={currentSite} 
              onClose={() => setIsEditSiteOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Site Dialog */}
      {currentSite && (
        <Dialog open={isDeleteSiteOpen} onOpenChange={setIsDeleteSiteOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription className="pt-2">
                Are you sure you want to delete <span className="font-semibold">{currentSite.name}</span>? This action cannot be undone and all monitoring data will be permanently lost.
              </DialogDescription>
            </DialogHeader>
            
            <DialogFooter className="gap-2 sm:justify-center mt-4">
              <Button
                variant="outline"
                onClick={() => setIsDeleteSiteOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={async () => {
                  try {
                    await deleteSite(currentSite.id);
                    queryClient.invalidateQueries({ queryKey: ['/api/sites'] });
                    setIsDeleteSiteOpen(false);
                    toast({
                      title: "Site Deleted",
                      description: `${currentSite.name} has been removed from monitoring.`,
                    });
                  } catch (error) {
                    toast({
                      title: "Error",
                      description: `Failed to delete site: ${(error as Error).message}`,
                      variant: "destructive",
                    });
                  }
                }}
              >
                Delete Site
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
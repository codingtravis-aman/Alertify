import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/dashboard/layout";
import SitesTable from "@/components/dashboard/sites-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertSiteSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

// Extend the insertSiteSchema with validation
const addSiteSchema = insertSiteSchema.extend({
  name: z.string().min(3, "Name must be at least 3 characters"),
  url: z.string().url("Please enter a valid URL"),
  checkFrequency: z.number().min(1).max(60),
});

type AddSiteFormValues = z.infer<typeof addSiteSchema>;

export default function SitesPage() {
  const [isAddSiteOpen, setIsAddSiteOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<AddSiteFormValues>({
    resolver: zodResolver(addSiteSchema),
    defaultValues: {
      name: "",
      url: "https://",
      type: "website",
      checkFrequency: 5,
      teamId: 1, // Default team ID
      active: true,
      settings: {},
    },
  });

  const { handleSubmit, formState } = form;

  const onSubmit = async (data: AddSiteFormValues) => {
    try {
      await apiRequest("POST", "/api/sites", data);
      queryClient.invalidateQueries({ queryKey: ['/api/sites'] });
      setIsAddSiteOpen(false);
      form.reset();
    } catch (error) {
      console.error("Failed to add site:", error);
    }
  };

  return (
    <DashboardLayout title="Websites & Apps">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Manage Monitored Websites & Apps</h1>
        <Button 
          onClick={() => setIsAddSiteOpen(true)}
          className="flex items-center"
        >
          <span className="material-icons text-sm mr-2">add</span>
          Add New
        </Button>
      </div>

      <SitesTable />

      {/* Add Site Dialog */}
      <Dialog open={isAddSiteOpen} onOpenChange={setIsAddSiteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Website or App</DialogTitle>
          </DialogHeader>
          
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
                  onClick={() => setIsAddSiteOpen(false)}
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
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

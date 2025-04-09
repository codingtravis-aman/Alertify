import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import SitesPage from "@/pages/sites";
import SiteDetailsPage from "@/pages/site-details";
import AlertsPage from "@/pages/alerts";
import ReportsPage from "@/pages/reports";
import TeamPage from "@/pages/team";
import IntegrationsPage from "@/pages/integrations";
import SettingsPage from "@/pages/settings";
import { ChatBot } from "@/components/chat/chat-bot";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/sites" component={SitesPage} />
      <Route path="/sites/:id" component={SiteDetailsPage} />
      <Route path="/alerts" component={AlertsPage} />
      <Route path="/reports" component={ReportsPage} />
      <Route path="/team" component={TeamPage} />
      <Route path="/integrations" component={IntegrationsPage} />
      <Route path="/settings" component={SettingsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <ChatBot />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;

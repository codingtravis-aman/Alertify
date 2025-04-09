import {
  users, type User, type InsertUser,
  teams, type Team, type InsertTeam,
  sites, type Site, type InsertSite,
  checkResults, type CheckResult, type InsertCheckResult,
  alerts, type Alert, type InsertAlert,
  uptimeStats, type UptimeStat, type InsertUptimeStat,
  aiInsights, type AiInsight, type InsertAiInsight,
  customers, type Customer, type InsertCustomer,
  plans, type Plan, type InsertPlan,
  billing, type Billing, type InsertBilling
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  getAllUsers(customerId?: number): Promise<User[]>;
  
  // Team operations
  getTeam(id: number): Promise<Team | undefined>;
  createTeam(team: InsertTeam): Promise<Team>;
  updateTeam(id: number, team: Partial<Team>): Promise<Team | undefined>;
  getAllTeams(customerId?: number): Promise<Team[]>;
  
  // Site operations
  getSite(id: number): Promise<Site | undefined>;
  getAllSites(customerId?: number): Promise<Site[]>;
  getSitesByTeam(teamId: number): Promise<Site[]>;
  createSite(site: InsertSite): Promise<Site>;
  updateSite(id: number, site: Partial<Site>): Promise<Site | undefined>;
  deleteSite(id: number): Promise<boolean>;
  
  // Check results operations
  getCheckResult(id: number): Promise<CheckResult | undefined>;
  getCheckResultsBySite(siteId: number, limit?: number): Promise<CheckResult[]>;
  createCheckResult(checkResult: InsertCheckResult): Promise<CheckResult>;
  
  // Alert operations
  getAlert(id: number): Promise<Alert | undefined>;
  getAlertsBySite(siteId: number, status?: string): Promise<Alert[]>;
  getAllActiveAlerts(limit?: number, customerId?: number): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  updateAlert(id: number, alert: Partial<Alert>): Promise<Alert | undefined>;
  
  // Uptime stats operations
  getUptimeStat(id: number): Promise<UptimeStat | undefined>;
  getUptimeStatsBySite(siteId: number): Promise<UptimeStat[]>;
  createUptimeStat(uptimeStat: InsertUptimeStat): Promise<UptimeStat>;
  
  // AI insights operations
  getAiInsight(id: number): Promise<AiInsight | undefined>;
  getAiInsightsBySite(siteId: number): Promise<AiInsight[]>;
  getAllAiInsights(limit?: number, customerId?: number): Promise<AiInsight[]>;
  createAiInsight(aiInsight: InsertAiInsight): Promise<AiInsight>;
  updateAiInsight(id: number, aiInsight: Partial<AiInsight>): Promise<AiInsight | undefined>;
  
  // Customer operations
  getCustomer(id: number): Promise<Customer | undefined>;
  getCustomerByEmail(email: string): Promise<Customer | undefined>;
  getAllCustomers(): Promise<Customer[]>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, customer: Partial<Customer>): Promise<Customer | undefined>;
  deleteCustomer(id: number): Promise<boolean>;
  
  // Plan operations
  getPlan(id: number): Promise<Plan | undefined>;
  getAllPlans(): Promise<Plan[]>;
  createPlan(plan: InsertPlan): Promise<Plan>;
  updatePlan(id: number, plan: Partial<Plan>): Promise<Plan | undefined>;
  deletePlan(id: number): Promise<boolean>;
  
  // Billing operations
  getBilling(id: number): Promise<Billing | undefined>;
  getBillingsByCustomer(customerId: number): Promise<Billing[]>;
  createBilling(billing: InsertBilling): Promise<Billing>;
  updateBilling(id: number, billing: Partial<Billing>): Promise<Billing | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private teams: Map<number, Team>;
  private sites: Map<number, Site>;
  private checkResults: Map<number, CheckResult>;
  private alerts: Map<number, Alert>;
  private uptimeStats: Map<number, UptimeStat>;
  private aiInsights: Map<number, AiInsight>;
  private customers: Map<number, Customer>;
  private plans: Map<number, Plan>;
  private billings: Map<number, Billing>;
  
  private userId: number;
  private teamId: number;
  private siteId: number;
  private checkResultId: number;
  private alertId: number;
  private uptimeStatId: number;
  private aiInsightId: number;
  private customerId: number;
  private planId: number;
  private billingId: number;

  constructor() {
    this.users = new Map();
    this.teams = new Map();
    this.sites = new Map();
    this.checkResults = new Map();
    this.alerts = new Map();
    this.uptimeStats = new Map();
    this.aiInsights = new Map();
    this.customers = new Map();
    this.plans = new Map();
    this.billings = new Map();
    
    this.userId = 1;
    this.teamId = 1;
    this.siteId = 1;
    this.checkResultId = 1;
    this.alertId = 1;
    this.uptimeStatId = 1;
    this.aiInsightId = 1;
    this.customerId = 1;
    this.planId = 1;
    this.billingId = 1;
    
    // Initialize with some default data
    this.seedInitialData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...userData, id };
    this.users.set(id, user);
    return user;
  }
  
  // Team operations
  async getTeam(id: number): Promise<Team | undefined> {
    return this.teams.get(id);
  }
  
  async createTeam(teamData: InsertTeam): Promise<Team> {
    const id = this.teamId++;
    const team: Team = { ...teamData, id };
    this.teams.set(id, team);
    return team;
  }
  
  // Site operations
  async getSite(id: number): Promise<Site | undefined> {
    return this.sites.get(id);
  }
  
  async getAllSites(): Promise<Site[]> {
    return Array.from(this.sites.values());
  }
  
  async getSitesByTeam(teamId: number): Promise<Site[]> {
    return Array.from(this.sites.values()).filter(
      (site) => site.teamId === teamId
    );
  }
  
  async createSite(siteData: InsertSite): Promise<Site> {
    const id = this.siteId++;
    const site: Site = { ...siteData, id };
    this.sites.set(id, site);
    return site;
  }
  
  async updateSite(id: number, siteData: Partial<Site>): Promise<Site | undefined> {
    const existingSite = this.sites.get(id);
    if (!existingSite) return undefined;
    
    const updatedSite = { ...existingSite, ...siteData };
    this.sites.set(id, updatedSite);
    return updatedSite;
  }
  
  async deleteSite(id: number): Promise<boolean> {
    return this.sites.delete(id);
  }
  
  // Check results operations
  async getCheckResult(id: number): Promise<CheckResult | undefined> {
    return this.checkResults.get(id);
  }
  
  async getCheckResultsBySite(siteId: number, limit?: number): Promise<CheckResult[]> {
    const results = Array.from(this.checkResults.values())
      .filter(result => result.siteId === siteId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return limit ? results.slice(0, limit) : results;
  }
  
  async createCheckResult(checkResultData: InsertCheckResult): Promise<CheckResult> {
    const id = this.checkResultId++;
    const checkResult: CheckResult = { ...checkResultData, id };
    this.checkResults.set(id, checkResult);
    return checkResult;
  }
  
  // Alert operations
  async getAlert(id: number): Promise<Alert | undefined> {
    return this.alerts.get(id);
  }
  
  async getAlertsBySite(siteId: number, status?: string): Promise<Alert[]> {
    let alerts = Array.from(this.alerts.values())
      .filter(alert => alert.siteId === siteId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    if (status) {
      alerts = alerts.filter(alert => alert.status === status);
    }
    
    return alerts;
  }
  
  async getAllActiveAlerts(limit?: number): Promise<Alert[]> {
    const alerts = Array.from(this.alerts.values())
      .filter(alert => alert.status === 'active')
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return limit ? alerts.slice(0, limit) : alerts;
  }
  
  async createAlert(alertData: InsertAlert): Promise<Alert> {
    const id = this.alertId++;
    const alert: Alert = { ...alertData, id };
    this.alerts.set(id, alert);
    return alert;
  }
  
  async updateAlert(id: number, alertData: Partial<Alert>): Promise<Alert | undefined> {
    const existingAlert = this.alerts.get(id);
    if (!existingAlert) return undefined;
    
    const updatedAlert = { ...existingAlert, ...alertData };
    this.alerts.set(id, updatedAlert);
    return updatedAlert;
  }
  
  // Uptime stats operations
  async getUptimeStat(id: number): Promise<UptimeStat | undefined> {
    return this.uptimeStats.get(id);
  }
  
  async getUptimeStatsBySite(siteId: number): Promise<UptimeStat[]> {
    return Array.from(this.uptimeStats.values())
      .filter(stat => stat.siteId === siteId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  async createUptimeStat(uptimeStatData: InsertUptimeStat): Promise<UptimeStat> {
    const id = this.uptimeStatId++;
    const uptimeStat: UptimeStat = { ...uptimeStatData, id };
    this.uptimeStats.set(id, uptimeStat);
    return uptimeStat;
  }
  
  // AI insights operations
  async getAiInsight(id: number): Promise<AiInsight | undefined> {
    return this.aiInsights.get(id);
  }
  
  async getAiInsightsBySite(siteId: number): Promise<AiInsight[]> {
    return Array.from(this.aiInsights.values())
      .filter(insight => insight.siteId === siteId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
  
  async getAllAiInsights(limit?: number): Promise<AiInsight[]> {
    const insights = Array.from(this.aiInsights.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return limit ? insights.slice(0, limit) : insights;
  }
  
  async createAiInsight(aiInsightData: InsertAiInsight): Promise<AiInsight> {
    const id = this.aiInsightId++;
    const aiInsight: AiInsight = { ...aiInsightData, id };
    this.aiInsights.set(id, aiInsight);
    return aiInsight;
  }
  
  async updateAiInsight(id: number, aiInsightData: Partial<AiInsight>): Promise<AiInsight | undefined> {
    const existingInsight = this.aiInsights.get(id);
    if (!existingInsight) return undefined;
    
    const updatedInsight = { ...existingInsight, ...aiInsightData };
    this.aiInsights.set(id, updatedInsight);
    return updatedInsight;
  }
  
  // Initialize with sample data for development
  private seedInitialData() {
    // Create default team
    const devTeam: Team = {
      id: this.teamId++,
      name: "Development Team",
      slackWebhook: "https://hooks.slack.com/services/dummy/webhook"
    };
    this.teams.set(devTeam.id, devTeam);
    
    // Create default user
    const adminUser: User = {
      id: this.userId++,
      username: "admin",
      password: "admin123", // In a real app, this would be hashed
      email: "admin@devmonitor.com",
      fullName: "Rahul Sharma",
      role: "admin",
      teamId: devTeam.id
    };
    this.users.set(adminUser.id, adminUser);
    
    // Create sample sites
    const sites: Partial<Site>[] = [
      {
        name: "Main E-commerce Website",
        url: "https://ecommerce-app.com",
        type: "website",
        interval: 5,
        teamId: devTeam.id,
        active: true,
        settings: {}
      },
      {
        name: "Mobile Banking App",
        url: "https://banking-app.io",
        type: "mobile_app",
        interval: 3,
        teamId: devTeam.id,
        active: true,
        settings: {}
      },
      {
        name: "Content Delivery API",
        url: "https://content-delivery-api.com",
        type: "api",
        interval: 2,
        teamId: devTeam.id,
        active: true,
        settings: {}
      },
      {
        name: "Analytics Dashboard",
        url: "https://analytics-dashboard.app",
        type: "website",
        interval: 5,
        teamId: devTeam.id,
        active: true,
        settings: {}
      },
      {
        name: "CRM System",
        url: "https://crm-system.io",
        type: "website",
        interval: 5,
        teamId: devTeam.id,
        active: true,
        settings: {}
      }
    ];
    
    // Add sites
    const createdSites: Site[] = sites.map(site => {
      const id = this.siteId++;
      const newSite: Site = { ...site, id } as Site;
      this.sites.set(id, newSite);
      return newSite;
    });
    
    // Create sample alerts
    const alerts: Partial<Alert>[] = [
      {
        siteId: createdSites[0].id,
        timestamp: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
        type: "error",
        message: "HTTP 500 Error",
        status: "active",
        assignedTo: adminUser.id
      },
      {
        siteId: createdSites[3].id,
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        type: "warning",
        message: "Slow Response Time",
        status: "active"
      },
      {
        siteId: createdSites[4].id,
        timestamp: new Date(Date.now() - 34 * 60 * 1000), // 34 minutes ago
        type: "error",
        message: "Database Connection Error",
        status: "active",
        assignedTo: adminUser.id
      },
      {
        siteId: createdSites[2].id,
        timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        type: "warning",
        message: "Memory Usage High",
        status: "active",
        assignedTo: adminUser.id
      }
    ];
    
    alerts.forEach(alert => {
      const id = this.alertId++;
      this.alerts.set(id, { ...alert, id } as Alert);
    });
    
    // Create uptime stats for sites
    createdSites.forEach(site => {
      const now = new Date();
      
      // Decide uptime and response time based on site index
      let uptimePercentage: number;
      let avgResponseTime: number;
      let errorRate: number;
      
      // Different stats for different sites to match the design
      if (site.id === createdSites[0].id) { // E-commerce site with issues
        uptimePercentage = 98.2;
        avgResponseTime = 452;
        errorRate = 1.8;
      } else if (site.id === createdSites[1].id) { // Banking app (good)
        uptimePercentage = 99.9;
        avgResponseTime = 189;
        errorRate = 0.1;
      } else if (site.id === createdSites[2].id) { // Content API (performance issues)
        uptimePercentage = 100.0;
        avgResponseTime = 752;
        errorRate = 0.0;
      } else if (site.id === createdSites[3].id) { // Analytics (warning)
        uptimePercentage = 99.7;
        avgResponseTime = 612;
        errorRate = 0.3;
      } else { // CRM (issues)
        uptimePercentage = 97.5;
        avgResponseTime = 831;
        errorRate = 2.5;
      }
      
      const id = this.uptimeStatId++;
      const stats: UptimeStat = {
        id,
        siteId: site.id,
        date: now,
        uptimePercentage,
        avgResponseTime,
        errorRate
      };
      
      this.uptimeStats.set(id, stats);
    });
    
    // Create AI insights
    const insights: Partial<AiInsight>[] = [
      {
        siteId: createdSites[2].id,
        timestamp: new Date(),
        type: "prediction",
        message: "Content Delivery API might experience increased response times in the next 2 hours based on current traffic patterns.",
        status: "new"
      },
      {
        siteId: createdSites[0].id,
        timestamp: new Date(),
        type: "suggestion",
        message: "For HTTP 500 Error on ecommerce-app.com/api/products, check database connection pool settings. Current pool may be exhausted under high load.",
        status: "new"
      }
    ];
    
    insights.forEach(insight => {
      const id = this.aiInsightId++;
      this.aiInsights.set(id, { ...insight, id } as AiInsight);
    });
  }
}

export const storage = new MemStorage();

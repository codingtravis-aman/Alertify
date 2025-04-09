// User types
export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: string;
  createdAt: Date;
  customerId?: number;
  planId?: number;
}

// Team types
export interface Team {
  id: number;
  name: string;
  description?: string;
  ownerId: number;
  createdAt: Date;
  customerId?: number;
}

// Site types
export interface Site {
  id: number;
  name: string;
  url: string;
  teamId: number | null; // Make teamId optional for compatibility
  checkFrequency: number;
  settings?: {
    alertThreshold?: number;
    responseTimeThreshold?: number;
    selfHealing?: boolean;
    lastHealed?: string;
    notificationChannels?: string[];
    [key: string]: any;
  };
  status?: 'active' | 'inactive' | 'maintenance';
  createdAt?: Date;
  active?: boolean | null;
  type?: string;
  customerId?: number;
}

// Check result types
export interface CheckResult {
  id: number;
  siteId: number;
  timestamp: Date;
  statusCode?: number;
  responseTime?: number;
  success: boolean;
  error?: string;
}

// Alert types
export interface Alert {
  id: number;
  siteId: number;
  timestamp: Date;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  status: 'active' | 'acknowledged' | 'resolved';
  message: string;
  details?: any;
  resolvedAt?: Date;
  acknowledgedBy?: number;
  type?: string; // For compatibility with API response
  customerId?: number;
}

// Uptime statistics types
export interface UptimeStat {
  id: number;
  siteId: number;
  timestamp: Date;
  period: 'hourly' | 'daily' | 'weekly' | 'monthly';
  uptimePercentage: number;
  avgResponseTime: number;
  checksCount: number;
  failedChecksCount: number;
  customerId?: number;
}

// AI insights types
export interface AiInsight {
  id: number;
  siteId: number;
  timestamp: Date;
  type: 'prediction' | 'anomaly' | 'trend' | 'optimization';
  message: string;
  confidence: number;
  relatedMetrics?: string[];
  details?: any;
  status?: 'new' | 'reviewed' | 'implemented' | 'dismissed';
  customerId?: number;
}

// Dashboard statistics types
export interface DashboardStats {
  websitesCount: number;
  websitesGrowth: number;
  averageUptime: number;
  uptimeChange: number;
  activeAlerts: number;
  alertsChange: number;
  avgResponseTime: number;
  responseTimeChange: number;
}

// Insert types (for creating new records)
export interface InsertSite {
  name: string;
  url: string;
  teamId: number;
  checkFrequency: number;
  settings?: Site['settings'];
  customerId?: number;
}

export interface InsertAlert {
  siteId: number;
  severity: Alert['severity'];
  message: string;
  details?: any;
  customerId?: number;
}

// Customer types
export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  planId: number;
  status: 'active' | 'suspended' | 'cancelled';
  createdAt: Date;
  billingInfo?: any;
}

export interface InsertCustomer {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  planId: number;
  status?: 'active' | 'suspended' | 'cancelled';
  billingInfo?: any;
}

// Plan types
export interface Plan {
  id: number;
  name: string;
  description?: string;
  price: number;
  billingCycle: 'monthly' | 'quarterly' | 'yearly';
  features: string[];
  limits: {
    sitesLimit?: number;
    usersLimit?: number;
    checksPerHour?: number;
    historyRetention?: number;
    [key: string]: any;
  };
  isActive: boolean;
  createdAt: Date;
}

export interface InsertPlan {
  name: string;
  description?: string;
  price: number;
  billingCycle?: 'monthly' | 'quarterly' | 'yearly';
  features?: string[];
  limits?: Plan['limits'];
  isActive?: boolean;
}

// Billing types
export interface Billing {
  id: number;
  customerId: number;
  planId: number;
  amount: number;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  dueDate: Date;
  paidAt?: Date;
  createdAt: Date;
  invoiceNumber: string;
  paymentMethod?: string;
  transactionId?: string;
  notes?: string;
}

export interface InsertBilling {
  customerId: number;
  planId: number;
  amount: number;
  status?: 'pending' | 'paid' | 'failed' | 'refunded';
  dueDate: Date;
  invoiceNumber: string;
  paymentMethod?: string;
  transactionId?: string;
  notes?: string;
}

// App settings
export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  notificationEmail: string;
  notificationEnabled: boolean;
  webhookUrl?: string;
  apiKey?: string;
  language: string;
  timezone: string;
}

// Integration types
export interface Integration {
  id: string;
  name: string;
  description: string;
  type: 'notification' | 'monitoring' | 'analytics' | 'security';
  enabled: boolean;
  logoUrl: string;
  configurable: boolean;
}
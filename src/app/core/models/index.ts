export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  tenantId: string;
  isActive: boolean;
  lastLoginAt?: string;
}

export type UserRole = 'super_admin' | 'admin' | 'agent' | 'viewer';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  plan: 'free' | 'pro' | 'enterprise';
  isActive: boolean;
}

export interface Property {
  id: string;
  tenantId: string;
  code: string;
  title: string;
  description: string;
  type: PropertyType;
  status: PropertyStatus;
  price: number;
  currency: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  lat?: number;
  lng?: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  parkingSpaces?: number;
  features?: string[];
  images: PropertyImage[];
  createdAt: string;
  updatedAt: string;
}

export type PropertyType = 'house' | 'apartment' | 'land' | 'commercial' | 'office';
export type PropertyStatus = 'available' | 'reserved' | 'sold' | 'rented';

export interface PropertyImage {
  url: string;
  caption: string;
  isPrimary: boolean;
}

export interface Client {
  id: string;
  tenantId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  type: ClientType;
  source: ClientSource;
  notes?: string;
  address?: string;
  isActive: boolean;
  createdAt: string;
}

export type ClientType = 'buyer' | 'seller' | 'renter' | 'investor';
export type ClientSource = 'website' | 'referral' | 'social' | 'cold_call' | 'other';

export interface Lead {
  id: string;
  tenantId: string;
  title: string;
  status: LeadStatus;
  priority: LeadPriority;
  budget?: number;
  notes?: string;
  source?: string;
  lastActivityAt?: string;
  closedAt?: string;
  client: Client;
  assignedTo?: User;
  createdAt: string;
  updatedAt: string;
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
export type LeadPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Visit {
  id: string;
  tenantId: string;
  scheduledAt: string;
  completedAt?: string;
  status: VisitStatus;
  notes?: string;
  feedback?: string;
  lead: Lead;
  property: Property;
  agent: User;
  createdAt: string;
}

export type VisitStatus = 'scheduled' | 'completed' | 'cancelled' | 'no_show';

export interface Sale {
  id: string;
  tenantId: string;
  price: number;
  commission: number;
  status: SaleStatus;
  notes?: string;
  signedAt?: string;
  completedAt?: string;
  lead: Lead;
  property: Property;
  agent: User;
  client: Client;
  createdAt: string;
}

export type SaleStatus = 'pending' | 'signed' | 'completed' | 'cancelled';

export interface Task {
  id: string;
  tenantId: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: string;
  dueDate?: string;
  assignedTo?: User;
  lead?: Lead;
  createdAt: string;
}

export interface Notification {
  id: string;
  tenantId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface PipelineStage {
  id: string;
  tenantId: string;
  name: string;
  order: number;
  color: string;
  isDefault: boolean;
  isActive: boolean;
}

export interface DashboardStats {
  totalProperties: number;
  totalClients: number;
  totalLeads: number;
  totalSales: number;
  totalRevenue: number;
  activeLeads: number;
  scheduledVisits: number;
  pendingTasks: number;
  leadsByStatus: Record<string, number>;
  salesByMonth: { month: string; total: number; count: number }[];
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AuthResponse {
  accessToken: string;
  user: User;
  tenant: Tenant;
}

export type CustomerStatus = 'active' | 'inactive';

export interface Customer {
  id: string;
  customerNumber: string; // e.g. CUST-1001
  name: string;
  email: string;
  phone: string;
  company?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  notes?: string;
  status: CustomerStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  defaultRate: number; // in currency
}

export type TechnicianStatus = 'Available' | 'Busy' | 'Unavailable';

export interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[]; // service category names or IDs
  status: TechnicianStatus;
  avatarUrl?: string;
  activeJobsCount?: number;
  completedJobsCount?: number;
  createdAt: string;
}

export type BookingStatus = 'Requested' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';

export interface Booking {
  id: string;
  bookingNumber: string; // e.g. BKG-2026-001
  customerId: string;
  serviceCategoryId: string;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm or e.g. 09:00 AM
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  notes?: string;
  status: BookingStatus;
  estimatedDurationHours: number;
  workOrderId?: string;
  createdAt: string;
  updatedAt: string;
}

export type WorkOrderPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type WorkOrderStatus = 'Pending' | 'Assigned' | 'In Progress' | 'Completed' | 'Cancelled';

export interface WorkOrderActivity {
  id: string;
  workOrderId: string;
  timestamp: string;
  authorName: string;
  action: string;
  notes?: string;
}

export interface WorkOrder {
  id: string;
  orderNumber: string; // e.g. WO-2026-001
  bookingId?: string;
  customerId: string;
  technicianId?: string;
  title: string;
  description: string;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  scheduledDate: string;
  scheduledTime?: string;
  internalNotes?: string;
  completionNotes?: string;
  completedAt?: string;
  activityHistory: WorkOrderActivity[];
  createdAt: string;
  updatedAt: string;
}

export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. INV-2026-001
  customerId: string;
  workOrderId?: string;
  issueDate: string; // YYYY-MM-DD
  dueDate: string;   // YYYY-MM-DD
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number; // e.g. 0.08 for 8%
  taxAmount: number;
  total: number;
  status: InvoiceStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  currency: string;
  currencySymbol: string;
  timeZone: string;
  taxRateDefault: number;
  logoUrl?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  timestamp: string;
  read: boolean;
  linkTo?: string;
}


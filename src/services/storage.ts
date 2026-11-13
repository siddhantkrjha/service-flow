import {
  Customer,
  Booking,
  WorkOrder,
  Technician,
  Invoice,
  ServiceCategory,
  BusinessProfile,
  NotificationItem,
} from '@/types';
import {
  initialCustomers,
  initialBookings,
  initialWorkOrders,
  initialTechnicians,
  initialInvoices,
  initialServiceCategories,
  initialBusinessProfile,
  initialNotifications,
} from '@/data/initialData';

const STORAGE_KEYS = {
  CUSTOMERS: 'serviceflow_customers',
  BOOKINGS: 'serviceflow_bookings',
  WORK_ORDERS: 'serviceflow_work_orders',
  TECHNICIANS: 'serviceflow_technicians',
  INVOICES: 'serviceflow_invoices',
  CATEGORIES: 'serviceflow_categories',
  BUSINESS_PROFILE: 'serviceflow_business_profile',
  NOTIFICATIONS: 'serviceflow_notifications',
  IS_INITIALIZED: 'serviceflow_is_initialized_v1',
};

// Generic storage helpers
function getItem<T>(key: string, defaultValue: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to storage:`, e);
  }
}

export const StorageService = {
  initDemoData(): void {
    if (!localStorage.getItem(STORAGE_KEYS.IS_INITIALIZED)) {
      this.resetAllData();
    }
  },

  resetAllData(): void {
    setItem(STORAGE_KEYS.CUSTOMERS, initialCustomers);
    setItem(STORAGE_KEYS.BOOKINGS, initialBookings);
    setItem(STORAGE_KEYS.WORK_ORDERS, initialWorkOrders);
    setItem(STORAGE_KEYS.TECHNICIANS, initialTechnicians);
    setItem(STORAGE_KEYS.INVOICES, initialInvoices);
    setItem(STORAGE_KEYS.CATEGORIES, initialServiceCategories);
    setItem(STORAGE_KEYS.BUSINESS_PROFILE, initialBusinessProfile);
    setItem(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
    localStorage.setItem(STORAGE_KEYS.IS_INITIALIZED, 'true');
  },

  // Business Profile
  getBusinessProfile(): BusinessProfile {
    return getItem<BusinessProfile>(STORAGE_KEYS.BUSINESS_PROFILE, initialBusinessProfile);
  },
  saveBusinessProfile(profile: BusinessProfile): void {
    setItem(STORAGE_KEYS.BUSINESS_PROFILE, profile);
  },

  // Customers
  getCustomers(): Customer[] {
    return getItem<Customer[]>(STORAGE_KEYS.CUSTOMERS, initialCustomers);
  },
  saveCustomers(customers: Customer[]): void {
    setItem(STORAGE_KEYS.CUSTOMERS, customers);
  },
  addCustomer(customer: Omit<Customer, 'id' | 'customerNumber' | 'createdAt' | 'updatedAt'>): Customer {
    const customers = this.getCustomers();
    const nextNum = customers.length + 1001;
    const newCustomer: Customer = {
      ...customer,
      id: `cust-${Date.now()}`,
      customerNumber: `CUST-${nextNum}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    customers.unshift(newCustomer);
    this.saveCustomers(customers);
    return newCustomer;
  },
  updateCustomer(id: string, updates: Partial<Customer>): Customer | null {
    const customers = this.getCustomers();
    const index = customers.findIndex((c) => c.id === id);
    if (index === -1) return null;
    customers[index] = {
      ...customers[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveCustomers(customers);
    return customers[index];
  },
  deleteCustomer(id: string): boolean {
    const customers = this.getCustomers();
    const filtered = customers.filter((c) => c.id !== id);
    if (filtered.length !== customers.length) {
      this.saveCustomers(filtered);
      return true;
    }
    return false;
  },

  // Service Categories
  getCategories(): ServiceCategory[] {
    return getItem<ServiceCategory[]>(STORAGE_KEYS.CATEGORIES, initialServiceCategories);
  },
  saveCategories(categories: ServiceCategory[]): void {
    setItem(STORAGE_KEYS.CATEGORIES, categories);
  },
  addCategory(category: Omit<ServiceCategory, 'id'>): ServiceCategory {
    const categories = this.getCategories();
    const newCategory: ServiceCategory = {
      ...category,
      id: `cat-${Date.now()}`,
    };
    categories.push(newCategory);
    this.saveCategories(categories);
    return newCategory;
  },
  updateCategory(id: string, updates: Partial<ServiceCategory>): ServiceCategory | null {
    const categories = this.getCategories();
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) return null;
    categories[index] = { ...categories[index], ...updates };
    this.saveCategories(categories);
    return categories[index];
  },
  deleteCategory(id: string): boolean {
    const categories = this.getCategories();
    const filtered = categories.filter((c) => c.id !== id);
    if (filtered.length !== categories.length) {
      this.saveCategories(filtered);
      return true;
    }
    return false;
  },

  // Technicians
  getTechnicians(): Technician[] {
    return getItem<Technician[]>(STORAGE_KEYS.TECHNICIANS, initialTechnicians);
  },
  saveTechnicians(technicians: Technician[]): void {
    setItem(STORAGE_KEYS.TECHNICIANS, technicians);
  },
  addTechnician(tech: Omit<Technician, 'id' | 'createdAt' | 'activeJobsCount' | 'completedJobsCount'>): Technician {
    const technicians = this.getTechnicians();
    const newTech: Technician = {
      ...tech,
      id: `tech-${Date.now()}`,
      activeJobsCount: 0,
      completedJobsCount: 0,
      createdAt: new Date().toISOString(),
    };
    technicians.push(newTech);
    this.saveTechnicians(technicians);
    return newTech;
  },
  updateTechnician(id: string, updates: Partial<Technician>): Technician | null {
    const technicians = this.getTechnicians();
    const index = technicians.findIndex((t) => t.id === id);
    if (index === -1) return null;
    technicians[index] = { ...technicians[index], ...updates };
    this.saveTechnicians(technicians);
    return technicians[index];
  },
  deleteTechnician(id: string): boolean {
    const technicians = this.getTechnicians();
    const filtered = technicians.filter((t) => t.id !== id);
    if (filtered.length !== technicians.length) {
      this.saveTechnicians(filtered);
      return true;
    }
    return false;
  },

  // Bookings
  getBookings(): Booking[] {
    return getItem<Booking[]>(STORAGE_KEYS.BOOKINGS, initialBookings);
  },
  saveBookings(bookings: Booking[]): void {
    setItem(STORAGE_KEYS.BOOKINGS, bookings);
  },
  addBooking(booking: Omit<Booking, 'id' | 'bookingNumber' | 'createdAt' | 'updatedAt'>): Booking {
    const bookings = this.getBookings();
    const nextNum = String(bookings.length + 1).padStart(3, '0');
    const newBooking: Booking = {
      ...booking,
      id: `bkg-${Date.now()}`,
      bookingNumber: `BKG-2026-${nextNum}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    bookings.unshift(newBooking);
    this.saveBookings(bookings);
    return newBooking;
  },
  updateBooking(id: string, updates: Partial<Booking>): Booking | null {
    const bookings = this.getBookings();
    const index = bookings.findIndex((b) => b.id === id);
    if (index === -1) return null;
    bookings[index] = {
      ...bookings[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveBookings(bookings);
    return bookings[index];
  },
  deleteBooking(id: string): boolean {
    const bookings = this.getBookings();
    const filtered = bookings.filter((b) => b.id !== id);
    if (filtered.length !== bookings.length) {
      this.saveBookings(filtered);
      return true;
    }
    return false;
  },

  // Work Orders
  getWorkOrders(): WorkOrder[] {
    return getItem<WorkOrder[]>(STORAGE_KEYS.WORK_ORDERS, initialWorkOrders);
  },
  saveWorkOrders(workOrders: WorkOrder[]): void {
    setItem(STORAGE_KEYS.WORK_ORDERS, workOrders);
  },
  addWorkOrder(order: Omit<WorkOrder, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'activityHistory'>): WorkOrder {
    const orders = this.getWorkOrders();
    const nextNum = String(orders.length + 1).padStart(3, '0');
    const newOrder: WorkOrder = {
      ...order,
      id: `wo-${Date.now()}`,
      orderNumber: `WO-2026-${nextNum}`,
      activityHistory: [
        {
          id: `act-${Date.now()}`,
          workOrderId: `wo-${Date.now()}`,
          timestamp: new Date().toISOString(),
          authorName: 'Dispatcher',
          action: 'Created Work Order',
          notes: order.bookingId ? `Linked to Booking ${order.bookingId}` : 'Direct work order created',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // If assigned to a technician, add an activity record and update tech activeJobs
    if (order.technicianId) {
      newOrder.activityHistory.push({
        id: `act-${Date.now() + 1}`,
        workOrderId: newOrder.id,
        timestamp: new Date().toISOString(),
        authorName: 'Operations Lead',
        action: 'Assigned Technician',
        notes: `Assigned to technician`,
      });
      this.recalculateTechJobCounts();
    }

    orders.unshift(newOrder);
    this.saveWorkOrders(orders);
    return newOrder;
  },
  updateWorkOrder(id: string, updates: Partial<WorkOrder>, activityAction?: string, activityNotes?: string): WorkOrder | null {
    const orders = this.getWorkOrders();
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) return null;

    const currentOrder = orders[index];
    const newActivities = [...(currentOrder.activityHistory || [])];

    if (activityAction) {
      newActivities.push({
        id: `act-${Date.now()}`,
        workOrderId: id,
        timestamp: new Date().toISOString(),
        authorName: 'Operations Manager',
        action: activityAction,
        notes: activityNotes || '',
      });
    }

    const updatedOrder: WorkOrder = {
      ...currentOrder,
      ...updates,
      activityHistory: newActivities,
      updatedAt: new Date().toISOString(),
    };

    if (updates.status === 'Completed' && !updatedOrder.completedAt) {
      updatedOrder.completedAt = new Date().toISOString();
    }

    orders[index] = updatedOrder;
    this.saveWorkOrders(orders);
    this.recalculateTechJobCounts();
    return updatedOrder;
  },
  deleteWorkOrder(id: string): boolean {
    const orders = this.getWorkOrders();
    const filtered = orders.filter((o) => o.id !== id);
    if (filtered.length !== orders.length) {
      this.saveWorkOrders(filtered);
      this.recalculateTechJobCounts();
      return true;
    }
    return false;
  },
  recalculateTechJobCounts(): void {
    const orders = this.getWorkOrders();
    const techs = this.getTechnicians();
    const updated = techs.map((tech) => {
      const activeCount = orders.filter(
        (o) => o.technicianId === tech.id && (o.status === 'In Progress' || o.status === 'Assigned')
      ).length;
      const completedCount = orders.filter(
        (o) => o.technicianId === tech.id && o.status === 'Completed'
      ).length;
      return {
        ...tech,
        activeJobsCount: activeCount,
        completedJobsCount: completedCount,
      };
    });
    this.saveTechnicians(updated);
  },

  // Invoices
  getInvoices(): Invoice[] {
    return getItem<Invoice[]>(STORAGE_KEYS.INVOICES, initialInvoices);
  },
  saveInvoices(invoices: Invoice[]): void {
    setItem(STORAGE_KEYS.INVOICES, invoices);
  },
  addInvoice(inv: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>): Invoice {
    const invoices = this.getInvoices();
    const nextNum = String(invoices.length + 1).padStart(3, '0');
    const newInvoice: Invoice = {
      ...inv,
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-2026-${nextNum}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    invoices.unshift(newInvoice);
    this.saveInvoices(invoices);
    return newInvoice;
  },
  updateInvoice(id: string, updates: Partial<Invoice>): Invoice | null {
    const invoices = this.getInvoices();
    const index = invoices.findIndex((i) => i.id === id);
    if (index === -1) return null;
    invoices[index] = {
      ...invoices[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveInvoices(invoices);
    return invoices[index];
  },
  deleteInvoice(id: string): boolean {
    const invoices = this.getInvoices();
    const filtered = invoices.filter((i) => i.id !== id);
    if (filtered.length !== invoices.length) {
      this.saveInvoices(filtered);
      return true;
    }
    return false;
  },

  // Notifications
  getNotifications(): NotificationItem[] {
    return getItem<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, initialNotifications);
  },
  saveNotifications(notifs: NotificationItem[]): void {
    setItem(STORAGE_KEYS.NOTIFICATIONS, notifs);
  },
  markNotificationAsRead(id: string): void {
    const notifs = this.getNotifications();
    const updated = notifs.map((n) => (n.id === id ? { ...n, read: true } : n));
    this.saveNotifications(updated);
  },
  markAllNotificationsAsRead(): void {
    const notifs = this.getNotifications();
    const updated = notifs.map((n) => ({ ...n, read: true }));
    this.saveNotifications(updated);
  },
  addNotification(item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>): NotificationItem {
    const notifs = this.getNotifications();
    const newNotif: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    notifs.unshift(newNotif);
    this.saveNotifications(notifs);
    return newNotif;
  },
};


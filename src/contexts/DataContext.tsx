import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
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
import { StorageService } from '@/services/storage';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

interface DataContextType {
  // Data
  customers: Customer[];
  bookings: Booking[];
  workOrders: WorkOrder[];
  technicians: Technician[];
  invoices: Invoice[];
  categories: ServiceCategory[];
  businessProfile: BusinessProfile;
  notifications: NotificationItem[];
  unreadNotificationsCount: number;

  // Computed Metrics
  metrics: {
    totalRevenue: number;
    activeJobsCount: number;
    upcomingBookingsCount: number;
    pendingInvoicesCount: number;
    pendingInvoicesTotal: number;
    completedJobsCount: number;
  };

  // Actions - Customers
  addCustomer: (data: Omit<Customer, 'id' | 'customerNumber' | 'createdAt' | 'updatedAt'>) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  // Actions - Bookings
  addBooking: (data: Omit<Booking, 'id' | 'bookingNumber' | 'createdAt' | 'updatedAt'>) => Booking;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  deleteBooking: (id: string) => void;

  // Actions - Work Orders
  addWorkOrder: (data: Omit<WorkOrder, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'activityHistory'>) => WorkOrder;
  updateWorkOrder: (id: string, updates: Partial<WorkOrder>, actionName?: string, notes?: string) => void;
  deleteWorkOrder: (id: string) => void;

  // Actions - Technicians
  addTechnician: (data: Omit<Technician, 'id' | 'createdAt' | 'activeJobsCount' | 'completedJobsCount'>) => Technician;
  updateTechnician: (id: string, updates: Partial<Technician>) => void;
  deleteTechnician: (id: string) => void;

  // Actions - Invoices
  addInvoice: (data: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>) => Invoice;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;

  // Actions - Service Categories
  addCategory: (data: Omit<ServiceCategory, 'id'>) => ServiceCategory;
  updateCategory: (id: string, updates: Partial<ServiceCategory>) => void;
  deleteCategory: (id: string) => void;

  // Business Profile
  updateBusinessProfile: (profile: BusinessProfile) => void;

  // Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Global Actions
  resetDemoData: () => void;

  // Toast System
  toasts: ToastMessage[];
  showToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => void;
  removeToast: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize storage if needed
  useEffect(() => {
    StorageService.initDemoData();
  }, []);

  const [customers, setCustomers] = useState<Customer[]>(() => StorageService.getCustomers());
  const [bookings, setBookings] = useState<Booking[]>(() => StorageService.getBookings());
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(() => StorageService.getWorkOrders());
  const [technicians, setTechnicians] = useState<Technician[]>(() => StorageService.getTechnicians());
  const [invoices, setInvoices] = useState<Invoice[]>(() => StorageService.getInvoices());
  const [categories, setCategories] = useState<ServiceCategory[]>(() => StorageService.getCategories());
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(() => StorageService.getBusinessProfile());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => StorageService.getNotifications());

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (type: 'success' | 'error' | 'info' | 'warning', title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync state helper
  const reloadAll = () => {
    setCustomers(StorageService.getCustomers());
    setBookings(StorageService.getBookings());
    setWorkOrders(StorageService.getWorkOrders());
    setTechnicians(StorageService.getTechnicians());
    setInvoices(StorageService.getInvoices());
    setCategories(StorageService.getCategories());
    setBusinessProfile(StorageService.getBusinessProfile());
    setNotifications(StorageService.getNotifications());
  };

  // Metrics computation
  const metrics = useMemo(() => {
    const totalRevenue = invoices
      .filter((inv) => inv.status === 'Paid')
      .reduce((sum, inv) => sum + inv.total, 0);

    const activeJobsCount = workOrders.filter(
      (wo) => wo.status === 'In Progress' || wo.status === 'Assigned'
    ).length;

    const completedJobsCount = workOrders.filter((wo) => wo.status === 'Completed').length;

    const upcomingBookingsCount = bookings.filter(
      (b) => b.status === 'Confirmed' || b.status === 'Requested'
    ).length;

    const pendingInvoicesList = invoices.filter(
      (inv) => inv.status === 'Sent' || inv.status === 'Overdue'
    );
    const pendingInvoicesCount = pendingInvoicesList.length;
    const pendingInvoicesTotal = pendingInvoicesList.reduce((sum, inv) => sum + inv.total, 0);

    return {
      totalRevenue,
      activeJobsCount,
      upcomingBookingsCount,
      pendingInvoicesCount,
      pendingInvoicesTotal,
      completedJobsCount,
    };
  }, [invoices, workOrders, bookings]);

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  // Customer actions
  const addCustomer = (data: Omit<Customer, 'id' | 'customerNumber' | 'createdAt' | 'updatedAt'>) => {
    const created = StorageService.addCustomer(data);
    setCustomers(StorageService.getCustomers());
    showToast('success', 'Customer Added', `${created.name} (${created.customerNumber}) has been added.`);
    return created;
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    const updated = StorageService.updateCustomer(id, updates);
    if (updated) {
      setCustomers(StorageService.getCustomers());
      showToast('success', 'Customer Updated', `${updated.name} has been updated.`);
    }
  };

  const deleteCustomer = (id: string) => {
    const customer = customers.find((c) => c.id === id);
    if (StorageService.deleteCustomer(id)) {
      setCustomers(StorageService.getCustomers());
      showToast('info', 'Customer Deleted', `${customer?.name || 'Customer'} has been removed.`);
    }
  };

  // Booking actions
  const addBooking = (data: Omit<Booking, 'id' | 'bookingNumber' | 'createdAt' | 'updatedAt'>) => {
    const created = StorageService.addBooking(data);
    setBookings(StorageService.getBookings());
    showToast('success', 'Booking Created', `Booking ${created.bookingNumber} created successfully.`);
    return created;
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    const updated = StorageService.updateBooking(id, updates);
    if (updated) {
      setBookings(StorageService.getBookings());
      showToast('success', 'Booking Updated', `Booking ${updated.bookingNumber} has been updated.`);
    }
  };

  const deleteBooking = (id: string) => {
    const bkg = bookings.find((b) => b.id === id);
    if (StorageService.deleteBooking(id)) {
      setBookings(StorageService.getBookings());
      showToast('info', 'Booking Cancelled', `Booking ${bkg?.bookingNumber || ''} has been removed.`);
    }
  };

  // Work Order actions
  const addWorkOrder = (data: Omit<WorkOrder, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'activityHistory'>) => {
    const created = StorageService.addWorkOrder(data);
    setWorkOrders(StorageService.getWorkOrders());
    setTechnicians(StorageService.getTechnicians());
    showToast('success', 'Work Order Created', `Order ${created.orderNumber} dispatched.`);
    return created;
  };

  const updateWorkOrder = (id: string, updates: Partial<WorkOrder>, actionName?: string, notes?: string) => {
    const updated = StorageService.updateWorkOrder(id, updates, actionName, notes);
    if (updated) {
      setWorkOrders(StorageService.getWorkOrders());
      setTechnicians(StorageService.getTechnicians());
      showToast('success', 'Work Order Updated', `Work Order ${updated.orderNumber} status is now ${updated.status}.`);
    }
  };

  const deleteWorkOrder = (id: string) => {
    const wo = workOrders.find((w) => w.id === id);
    if (StorageService.deleteWorkOrder(id)) {
      setWorkOrders(StorageService.getWorkOrders());
      setTechnicians(StorageService.getTechnicians());
      showToast('info', 'Work Order Deleted', `Work Order ${wo?.orderNumber || ''} has been deleted.`);
    }
  };

  // Technician actions
  const addTechnician = (data: Omit<Technician, 'id' | 'createdAt' | 'activeJobsCount' | 'completedJobsCount'>) => {
    const created = StorageService.addTechnician(data);
    setTechnicians(StorageService.getTechnicians());
    showToast('success', 'Technician Added', `${created.name} is now on the roster.`);
    return created;
  };

  const updateTechnician = (id: string, updates: Partial<Technician>) => {
    const updated = StorageService.updateTechnician(id, updates);
    if (updated) {
      setTechnicians(StorageService.getTechnicians());
      showToast('success', 'Technician Updated', `${updated.name}'s profile was updated.`);
    }
  };

  const deleteTechnician = (id: string) => {
    const tech = technicians.find((t) => t.id === id);
    if (StorageService.deleteTechnician(id)) {
      setTechnicians(StorageService.getTechnicians());
      showToast('info', 'Technician Removed', `${tech?.name || 'Technician'} removed.`);
    }
  };

  // Invoice actions
  const addInvoice = (data: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>) => {
    const created = StorageService.addInvoice(data);
    setInvoices(StorageService.getInvoices());
    showToast('success', 'Invoice Created', `Invoice ${created.invoiceNumber} created for $${created.total.toFixed(2)}.`);
    return created;
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    const updated = StorageService.updateInvoice(id, updates);
    if (updated) {
      setInvoices(StorageService.getInvoices());
      showToast('success', 'Invoice Updated', `Invoice ${updated.invoiceNumber} status is now ${updated.status}.`);
    }
  };

  const deleteInvoice = (id: string) => {
    const inv = invoices.find((i) => i.id === id);
    if (StorageService.deleteInvoice(id)) {
      setInvoices(StorageService.getInvoices());
      showToast('info', 'Invoice Deleted', `Invoice ${inv?.invoiceNumber || ''} deleted.`);
    }
  };

  // Category actions
  const addCategory = (data: Omit<ServiceCategory, 'id'>) => {
    const created = StorageService.addCategory(data);
    setCategories(StorageService.getCategories());
    showToast('success', 'Category Created', `Category "${created.name}" created.`);
    return created;
  };

  const updateCategory = (id: string, updates: Partial<ServiceCategory>) => {
    const updated = StorageService.updateCategory(id, updates);
    if (updated) {
      setCategories(StorageService.getCategories());
      showToast('success', 'Category Updated', `Category "${updated.name}" updated.`);
    }
  };

  const deleteCategory = (id: string) => {
    const cat = categories.find((c) => c.id === id);
    if (StorageService.deleteCategory(id)) {
      setCategories(StorageService.getCategories());
      showToast('info', 'Category Removed', `Category "${cat?.name || ''}" removed.`);
    }
  };

  // Business profile
  const updateBusinessProfile = (profile: BusinessProfile) => {
    StorageService.saveBusinessProfile(profile);
    setBusinessProfile(profile);
    showToast('success', 'Settings Saved', 'Business profile information updated.');
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    StorageService.markNotificationAsRead(id);
    setNotifications(StorageService.getNotifications());
  };

  const markAllNotificationsAsRead = () => {
    StorageService.markAllNotificationsAsRead();
    setNotifications(StorageService.getNotifications());
    showToast('info', 'Notifications Cleared', 'All notifications marked as read.');
  };

  // Demo reset
  const resetDemoData = () => {
    StorageService.resetAllData();
    reloadAll();
    showToast('info', 'Demo Data Reset', 'All records have been reset to default demo data.');
  };

  return (
    <DataContext.Provider
      value={{
        customers,
        bookings,
        workOrders,
        technicians,
        invoices,
        categories,
        businessProfile,
        notifications,
        unreadNotificationsCount,
        metrics,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addBooking,
        updateBooking,
        deleteBooking,
        addWorkOrder,
        updateWorkOrder,
        deleteWorkOrder,
        addTechnician,
        updateTechnician,
        deleteTechnician,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        addCategory,
        updateCategory,
        deleteCategory,
        updateBusinessProfile,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        resetDemoData,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};


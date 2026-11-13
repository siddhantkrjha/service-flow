import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from '@/contexts/DataContext';
import { AppLayout } from '@/components/layout/AppLayout';

import { OverviewPage } from '@/pages/OverviewPage';
import { BookingsPage } from '@/pages/BookingsPage';
import { WorkOrdersPage } from '@/pages/WorkOrdersPage';
import { CustomersPage } from '@/pages/CustomersPage';
import { TechniciansPage } from '@/pages/TechniciansPage';
import { InvoicesPage } from '@/pages/InvoicesPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { SettingsPage } from '@/pages/SettingsPage';

export function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<OverviewPage />} />
            <Route path="overview" element={<OverviewPage />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="work-orders" element={<WorkOrdersPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="technicians" element={<TechniciansPage />} />
            <Route path="invoices" element={<InvoicesPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;


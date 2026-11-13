import React from 'react';
import { useLocation } from 'react-router-dom';
import { InvoiceList } from '@/components/invoices/InvoiceList';
import { WorkOrder } from '@/types';

export const InvoicesPage: React.FC = () => {
  const location = useLocation();
  const fromWorkOrder: WorkOrder | null = location.state?.fromWorkOrder || null;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Invoices & Billing</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Generate professional service invoices, calculate tax, and track client receivables
        </p>
      </div>

      <InvoiceList fromWorkOrder={fromWorkOrder} />
    </div>
  );
};


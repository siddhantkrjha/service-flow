import React from 'react';
import { CustomerList } from '@/components/customers/CustomerList';

export const CustomersPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Customer Directory & Accounts</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Commercial facilities, property accounts, service addresses, and customer history
        </p>
      </div>

      <CustomerList />
    </div>
  );
};


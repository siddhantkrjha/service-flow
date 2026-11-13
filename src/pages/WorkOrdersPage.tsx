import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { WorkOrderList } from '@/components/work-orders/WorkOrderList';
import { WorkOrder, Booking } from '@/types';

export const WorkOrdersPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const dispatchedFromBooking: Booking | null = location.state?.fromBooking || null;

  const handleCreateInvoice = (workOrder: WorkOrder) => {
    navigate('/invoices', { state: { fromWorkOrder: workOrder } });
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Work Orders & Technician Dispatch</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Assign field technicians, track on-site execution, and monitor completion status
        </p>
      </div>

      <WorkOrderList
        dispatchedFromBooking={dispatchedFromBooking}
        onCreateInvoice={handleCreateInvoice}
      />
    </div>
  );
};


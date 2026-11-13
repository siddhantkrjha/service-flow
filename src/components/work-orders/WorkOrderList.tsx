import React, { useState, useMemo } from 'react';
import { WorkOrder, Booking } from '@/types';
import { useData } from '@/contexts/DataContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { WorkOrderFormModal } from './WorkOrderFormModal';
import { WorkOrderDetailsModal } from './WorkOrderDetailsModal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import {
  formatDate,
  getWorkOrderStatusColor,
  getPriorityColor,
} from '@/lib/utils';
import {
  Search,
  Plus,
  Wrench,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Clock,
  UserCheck,
  FileText,
} from 'lucide-react';

export interface WorkOrderListProps {
  onCreateInvoice?: (workOrder: WorkOrder) => void;
  dispatchedFromBooking?: Booking | null;
  onClearDispatchedBooking?: () => void;
}

export const WorkOrderList: React.FC<WorkOrderListProps> = ({
  onCreateInvoice,
  dispatchedFromBooking,
  onClearDispatchedBooking,
}) => {
  const { workOrders, customers, technicians, addWorkOrder, updateWorkOrder, deleteWorkOrder } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(Boolean(dispatchedFromBooking));
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
  const [detailsWorkOrder, setDetailsWorkOrder] = useState<WorkOrder | null>(null);
  const [workOrderToDelete, setWorkOrderToDelete] = useState<WorkOrder | null>(null);

  const filteredWorkOrders = useMemo(() => {
    return workOrders.filter((wo) => {
      const customer = customers.find((c) => c.id === wo.customerId);
      const technician = technicians.find((t) => t.id === wo.technicianId);

      const matchesSearch =
        wo.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer && customer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (technician && technician.name.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || wo.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || wo.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [workOrders, customers, technicians, searchTerm, statusFilter, priorityFilter]);

  const handleEdit = (wo: WorkOrder) => {
    setSelectedWorkOrder(wo);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedWorkOrder(null);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data: Omit<WorkOrder, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'activityHistory'>) => {
    if (selectedWorkOrder) {
      updateWorkOrder(selectedWorkOrder.id, data, 'Updated Work Order Details');
    } else {
      addWorkOrder(data);
    }
    if (onClearDispatchedBooking) onClearDispatchedBooking();
  };

  return (
    <div className="space-y-4">
      {/* Control bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2 max-w-md">
          <Input
            placeholder="Search work orders, title, technician..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="h-9 px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700"
          >
            <option value="all">All Priorities</option>
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
            <option value="Urgent">Urgent Priority</option>
          </select>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={handleCreate}
          >
            New Work Order
          </Button>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
        {['all', 'Pending', 'Assigned', 'In Progress', 'Completed', 'Cancelled'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-lg border font-medium whitespace-nowrap transition-colors ${
              statusFilter === st
                ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {st === 'all' ? `All Orders (${workOrders.length})` : st}
          </button>
        ))}
      </div>

      {/* Work Orders Table */}
      <Card>
        {filteredWorkOrders.length === 0 ? (
          <EmptyState
            icon={Wrench}
            title="No work orders found"
            description={
              searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'No work orders match the current search or filter criteria.'
                : 'Dispatch your first field service work order.'
            }
            actionText="Create Work Order"
            onAction={handleCreate}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Order #</th>
                  <th className="py-3.5 px-4">Job Title & Customer</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Technician</th>
                  <th className="py-3.5 px-4">Scheduled Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredWorkOrders.map((wo) => {
                  const customer = customers.find((c) => c.id === wo.customerId);
                  const technician = technicians.find((t) => t.id === wo.technicianId);
                  const statusStyle = getWorkOrderStatusColor(wo.status);
                  const priorityStyle = getPriorityColor(wo.priority);

                  return (
                    <tr
                      key={wo.id}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                      onClick={() => setDetailsWorkOrder(wo)}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {wo.orderNumber}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-semibold text-slate-900 group-hover:text-sky-600 transition-colors truncate">
                          {wo.title}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {customer?.name || 'Customer'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.border}`}
                        >
                          {wo.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {technician ? (
                          <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                            <div className="w-5 h-5 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-[9px]">
                              {technician.name.slice(0, 1)}
                            </div>
                            <span className="truncate">{technician.name}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatDate(wo.scheduledDate, 'MMM d, yyyy')}</span>
                        </div>
                        {wo.scheduledTime && (
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{wo.scheduledTime}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                          {wo.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setDetailsWorkOrder(wo)}
                            className="p-1.5 rounded-md text-slate-400 hover:text-sky-600 hover:bg-slate-100 transition-colors"
                            title="View Order"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(wo)}
                            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            title="Edit Order"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setWorkOrderToDelete(wo)}
                            className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Order"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Form Modal */}
      <WorkOrderFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          if (onClearDispatchedBooking) onClearDispatchedBooking();
        }}
        onSubmit={handleFormSubmit}
        workOrder={selectedWorkOrder}
        fromBooking={dispatchedFromBooking}
      />

      {/* Details Modal */}
      <WorkOrderDetailsModal
        isOpen={Boolean(detailsWorkOrder)}
        onClose={() => setDetailsWorkOrder(null)}
        workOrder={detailsWorkOrder}
        onEdit={handleEdit}
        onCreateInvoice={onCreateInvoice}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(workOrderToDelete)}
        onClose={() => setWorkOrderToDelete(null)}
        onConfirm={() => {
          if (workOrderToDelete) deleteWorkOrder(workOrderToDelete.id);
        }}
        title="Delete Work Order?"
        message={`Are you sure you want to delete ${workOrderToDelete?.orderNumber}?`}
        confirmText="Delete Work Order"
      />
    </div>
  );
};


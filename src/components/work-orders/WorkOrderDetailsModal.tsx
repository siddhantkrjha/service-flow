import React, { useState } from 'react';
import { WorkOrder, WorkOrderStatus } from '@/types';
import { useData } from '@/contexts/DataContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import {
  formatDate,
  formatDateTime,
  getWorkOrderStatusColor,
  getPriorityColor,
} from '@/lib/utils';
import {
  Wrench,
  Calendar,
  Clock,
  UserCheck,
  Building,
  CheckCircle2,
  AlertCircle,
  FileText,
  Edit,
  Trash2,
  History,
  Send,
} from 'lucide-react';

export interface WorkOrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  workOrder: WorkOrder | null;
  onEdit: (workOrder: WorkOrder) => void;
  onCreateInvoice?: (workOrder: WorkOrder) => void;
}

export const WorkOrderDetailsModal: React.FC<WorkOrderDetailsModalProps> = ({
  isOpen,
  onClose,
  workOrder,
  onEdit,
  onCreateInvoice,
}) => {
  const { customers, technicians, bookings, invoices, updateWorkOrder, deleteWorkOrder } = useData();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newStatusNote, setNewStatusNote] = useState('');
  const [completionNote, setCompletionNote] = useState('');

  if (!workOrder) return null;

  const customer = customers.find((c) => c.id === workOrder.customerId);
  const technician = technicians.find((t) => t.id === workOrder.technicianId);
  const booking = bookings.find((b) => b.id === workOrder.bookingId);
  const existingInvoice = invoices.find((i) => i.workOrderId === workOrder.id);

  const statusStyle = getWorkOrderStatusColor(workOrder.status);
  const priorityStyle = getPriorityColor(workOrder.priority);

  const handleStatusChange = (newStatus: WorkOrderStatus) => {
    let actionDesc = `Status changed to ${newStatus}`;
    let note = newStatusNote || `Updated status to ${newStatus}`;

    const updates: Partial<WorkOrder> = { status: newStatus };
    if (newStatus === 'Completed' && completionNote) {
      updates.completionNotes = completionNote;
    }

    updateWorkOrder(workOrder.id, updates, actionDesc, note);
    setNewStatusNote('');
  };

  const handleDelete = () => {
    deleteWorkOrder(workOrder.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                  {workOrder.orderNumber}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                  {workOrder.status}
                </span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded border uppercase ${priorityStyle.bg} ${priorityStyle.text} ${priorityStyle.border}`}
                >
                  {workOrder.priority} Priority
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1">{workOrder.title}</h2>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Edit className="w-3.5 h-3.5" />}
                onClick={() => {
                  onClose();
                  onEdit(workOrder);
                }}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete
              </Button>
            </div>
          </div>

          {/* Quick status progression buttons */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-600">Quick Update Status:</span>
              <div className="flex items-center gap-1.5">
                {workOrder.status !== 'Assigned' && (
                  <button
                    onClick={() => handleStatusChange('Assigned')}
                    className="px-2.5 py-1 text-xs font-medium rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
                  >
                    Mark Assigned
                  </button>
                )}
                {workOrder.status !== 'In Progress' && (
                  <button
                    onClick={() => handleStatusChange('In Progress')}
                    className="px-2.5 py-1 text-xs font-medium rounded-md bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200 transition-colors"
                  >
                    Mark In Progress
                  </button>
                )}
                {workOrder.status !== 'Completed' && (
                  <button
                    onClick={() => handleStatusChange('Completed')}
                    className="px-2.5 py-1 text-xs font-medium rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                  >
                    Mark Completed
                  </button>
                )}
                {workOrder.status !== 'Cancelled' && (
                  <button
                    onClick={() => handleStatusChange('Cancelled')}
                    className="px-2.5 py-1 text-xs font-medium rounded-md bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Invoicing Integration Card */}
          {workOrder.status === 'Completed' && !existingInvoice && onCreateInvoice && (
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/60 flex items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-emerald-950">Job Completed — Ready for Billing</h4>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Generate an invoice directly with line items for labor, diagnostics, and materials.
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<FileText className="w-3.5 h-3.5" />}
                onClick={() => {
                  onClose();
                  onCreateInvoice(workOrder);
                }}
              >
                Create Invoice
              </Button>
            </div>
          )}

          {existingInvoice && (
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">
                Invoice Generated: <strong>{existingInvoice.invoiceNumber}</strong> ({existingInvoice.status})
              </span>
            </div>
          )}

          {/* Customer & Technician Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1.5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Customer & Site
              </span>
              <div className="text-sm font-semibold text-slate-900">{customer?.name}</div>
              {customer?.company && (
                <div className="text-xs text-slate-500">{customer.company}</div>
              )}
              <div className="text-xs text-slate-600">
                {customer?.address.street}, {customer?.address.city}
              </div>
              <div className="text-xs text-slate-500">{customer?.phone}</div>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1.5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Assigned Technician
              </span>
              {technician ? (
                <>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-[10px]">
                      {technician.name.slice(0, 2)}
                    </div>
                    <span className="text-sm font-semibold text-slate-900">{technician.name}</span>
                  </div>
                  <div className="text-xs text-slate-600">{technician.email} • {technician.phone}</div>
                  <div className="text-[11px] text-slate-500">Skills: {technician.skills.join(', ')}</div>
                </>
              ) : (
                <div className="text-xs text-slate-400 py-2">
                  No technician currently assigned to this order
                </div>
              )}
            </div>
          </div>

          {/* Description & Completion Notes */}
          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-slate-100 bg-white">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Job Description
              </span>
              <p className="text-xs text-slate-700 mt-1.5 leading-relaxed">{workOrder.description}</p>
            </div>

            {workOrder.completionNotes && (
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  Technician Completion Report
                </span>
                <p className="text-xs text-emerald-950 mt-1.5 leading-relaxed">
                  {workOrder.completionNotes}
                </p>
                {workOrder.completedAt && (
                  <div className="text-[11px] text-emerald-700 mt-2 font-medium">
                    Completed at: {formatDateTime(workOrder.completedAt)}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Activity Timeline */}
          <div className="border-t border-slate-100 pt-4">
            <div className="flex items-center gap-2 mb-3">
              <History className="w-4 h-4 text-slate-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Activity & Audit Log
              </h4>
            </div>

            <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-200 pl-6">
              {workOrder.activityHistory.map((act) => (
                <div key={act.id} className="relative group">
                  <div className="absolute -left-[19px] top-1.5 w-2.5 h-2.5 rounded-full bg-sky-500 border-2 border-white" />
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900">{act.action}</span>
                    <span className="text-[10px] text-slate-400">
                      {formatDateTime(act.timestamp)}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">By {act.authorName}</div>
                  {act.notes && (
                    <p className="text-xs text-slate-600 mt-0.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      {act.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Work Order?"
        message={`Are you sure you want to delete ${workOrder.orderNumber}?`}
        confirmText="Delete Work Order"
      />
    </>
  );
};


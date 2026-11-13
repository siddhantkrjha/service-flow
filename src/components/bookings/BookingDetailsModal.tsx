import React, { useState } from 'react';
import { Booking } from '@/types';
import { useData } from '@/contexts/DataContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { formatDate, getBookingStatusColor } from '@/lib/utils';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Wrench,
  Edit,
  Trash2,
  FileCheck2,
  CheckCircle,
  XCircle,
} from 'lucide-react';

export interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onEdit: (booking: Booking) => void;
  onDispatchWorkOrder?: (booking: Booking) => void;
}

export const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({
  isOpen,
  onClose,
  booking,
  onEdit,
  onDispatchWorkOrder,
}) => {
  const { customers, categories, workOrders, updateBooking, deleteBooking } = useData();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!booking) return null;

  const customer = customers.find((c) => c.id === booking.customerId);
  const category = categories.find((cat) => cat.id === booking.serviceCategoryId);
  const linkedWorkOrder = workOrders.find((w) => w.bookingId === booking.id || w.id === booking.workOrderId);
  const statusStyle = getBookingStatusColor(booking.status);

  const handleDelete = () => {
    deleteBooking(booking.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleStatusChange = (newStatus: Booking['status']) => {
    updateBooking(booking.id, { status: newStatus });
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} maxWidth="xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                  {booking.bookingNumber}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                  {booking.status}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                {category?.name || 'Service Booking'}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Edit className="w-3.5 h-3.5" />}
                onClick={() => {
                  onClose();
                  onEdit(booking);
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

          {/* Quick status progress actions */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-600">Quick Status Update:</span>
            <div className="flex items-center gap-1.5">
              {booking.status !== 'Confirmed' && booking.status !== 'Completed' && (
                <button
                  onClick={() => handleStatusChange('Confirmed')}
                  className="px-2.5 py-1 text-xs font-medium rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
                >
                  Confirm
                </button>
              )}
              {booking.status !== 'In Progress' && booking.status !== 'Completed' && (
                <button
                  onClick={() => handleStatusChange('In Progress')}
                  className="px-2.5 py-1 text-xs font-medium rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors"
                >
                  Start Job
                </button>
              )}
              {booking.status !== 'Completed' && (
                <button
                  onClick={() => handleStatusChange('Completed')}
                  className="px-2.5 py-1 text-xs font-medium rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                >
                  Complete
                </button>
              )}
              {booking.status !== 'Cancelled' && (
                <button
                  onClick={() => handleStatusChange('Cancelled')}
                  className="px-2.5 py-1 text-xs font-medium rounded-md bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Work Order Dispatch Prompt */}
          {!linkedWorkOrder && booking.status !== 'Cancelled' && onDispatchWorkOrder && (
            <div className="p-4 rounded-xl border border-sky-200 bg-sky-50/60 flex items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-sky-900">Ready to Dispatch Technician?</h4>
                <p className="text-xs text-sky-700 mt-0.5">
                  Convert this booking into a formal work order and assign a field technician.
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Wrench className="w-3.5 h-3.5" />}
                onClick={() => {
                  onClose();
                  onDispatchWorkOrder(booking);
                }}
              >
                Dispatch Work Order
              </Button>
            </div>
          )}

          {linkedWorkOrder && (
            <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/60 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 font-medium text-emerald-800">
                <FileCheck2 className="w-4 h-4 text-emerald-600" />
                Linked to Work Order: <strong>{linkedWorkOrder.orderNumber}</strong> ({linkedWorkOrder.status})
              </span>
            </div>
          )}

          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Customer & Contact
              </span>
              <div className="text-sm font-semibold text-slate-900">{customer?.name}</div>
              {customer?.company && (
                <div className="text-xs text-slate-500">{customer.company}</div>
              )}
              <div className="text-xs text-slate-600">
                {customer?.phone} • {customer?.email}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Appointment Schedule
              </span>
              <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                <Calendar className="w-4 h-4 text-sky-600" />
                <span>{formatDate(booking.scheduledDate, 'EEEE, MMMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {booking.scheduledTime} (Estimated {booking.estimatedDurationHours} hrs)
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Service Location
            </span>
            <div className="flex items-start gap-2 text-sm text-slate-800 mt-1">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <div>{booking.address.street}</div>
                <div className="text-xs text-slate-500">
                  {booking.address.city}, {booking.address.state} {booking.address.zip}
                </div>
              </div>
            </div>
          </div>

          {booking.notes && (
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Customer Notes / Service Request
              </span>
              <p className="text-xs text-slate-700 mt-1 whitespace-pre-wrap leading-relaxed">
                {booking.notes}
              </p>
            </div>
          )}
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Booking Record?"
        message={`Are you sure you want to delete ${booking.bookingNumber}?`}
        confirmText="Delete Booking"
      />
    </>
  );
};


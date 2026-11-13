import React, { useState, useMemo } from 'react';
import { Booking, BookingStatus } from '@/types';
import { useData } from '@/contexts/DataContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { BookingCalendar } from './BookingCalendar';
import { BookingFormModal } from './BookingFormModal';
import { BookingDetailsModal } from './BookingDetailsModal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { formatDate, getBookingStatusColor } from '@/lib/utils';
import {
  Search,
  Plus,
  Calendar as CalendarIcon,
  List,
  Edit,
  Trash2,
  Eye,
  Clock,
  MapPin,
  Wrench,
} from 'lucide-react';

export interface BookingListProps {
  onDispatchWorkOrder?: (booking: Booking) => void;
}

export const BookingList: React.FC<BookingListProps> = ({ onDispatchWorkOrder }) => {
  const { bookings, customers, categories, addBooking, updateBooking, deleteBooking } = useData();

  const [viewMode, setViewMode] = useState<'table' | 'calendar'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [detailsBooking, setDetailsBooking] = useState<Booking | null>(null);
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const customer = customers.find((c) => c.id === b.customerId);
      const category = categories.find((cat) => cat.id === b.serviceCategoryId);

      const matchesSearch =
        b.bookingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer && customer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (category && category.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        b.address.street.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.notes && b.notes.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || b.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, customers, categories, searchTerm, statusFilter]);

  const handleEdit = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedBooking(null);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data: Omit<Booking, 'id' | 'bookingNumber' | 'createdAt' | 'updatedAt'>) => {
    if (selectedBooking) {
      updateBooking(selectedBooking.id, data);
    } else {
      addBooking(data);
    }
  };

  return (
    <div className="space-y-4">
      {/* Control bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2 max-w-md">
          <Input
            placeholder="Search bookings, customers, services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Table vs Calendar Toggle */}
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 text-xs font-semibold text-slate-600">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                viewMode === 'table' ? 'bg-slate-900 text-white' : 'hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                viewMode === 'calendar' ? 'bg-slate-900 text-white' : 'hover:text-slate-900'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Calendar</span>
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={handleCreate}
          >
            New Booking
          </Button>
        </div>
      </div>

      {/* Filter status tabs */}
      {viewMode === 'table' && (
        <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
          {['all', 'Requested', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg border font-medium whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {st === 'all' ? `All (${bookings.length})` : st}
            </button>
          ))}
        </div>
      )}

      {/* View Mode Rendering */}
      {viewMode === 'calendar' ? (
        <BookingCalendar
          onSelectBooking={(b) => setDetailsBooking(b)}
          onCreateForDate={(dateStr) => {
            setSelectedBooking(null);
            setIsFormOpen(true);
          }}
        />
      ) : (
        <Card>
          {filteredBookings.length === 0 ? (
            <EmptyState
              icon={CalendarIcon}
              title="No bookings found"
              description={
                searchTerm || statusFilter !== 'all'
                  ? 'No service bookings match your search or filter criteria.'
                  : 'Schedule your first customer service appointment.'
              }
              actionText="Create New Booking"
              onAction={handleCreate}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Booking #</th>
                    <th className="py-3.5 px-4">Customer & Service</th>
                    <th className="py-3.5 px-4">Appointment Date</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBookings.map((b) => {
                    const customer = customers.find((c) => c.id === b.customerId);
                    const category = categories.find((cat) => cat.id === b.serviceCategoryId);
                    const statusStyle = getBookingStatusColor(b.status);

                    return (
                      <tr
                        key={b.id}
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                        onClick={() => setDetailsBooking(b)}
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                          {b.bookingNumber}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-900 group-hover:text-sky-600 transition-colors">
                            {customer?.name || 'Customer'}
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium">
                            {category?.name || 'Service'}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 font-medium">
                            <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                            <span>{formatDate(b.scheduledDate, 'MMM d, yyyy')}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>
                              {b.scheduledTime} ({b.estimatedDurationHours}h)
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          <div className="flex items-start gap-1 max-w-xs">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <span className="truncate">
                              {b.address.street}, {b.address.city}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                            {b.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setDetailsBooking(b)}
                              className="p-1.5 rounded-md text-slate-400 hover:text-sky-600 hover:bg-slate-100 transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(b)}
                              className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                              title="Edit Booking"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setBookingToDelete(b)}
                              className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete Booking"
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
      )}

      {/* Booking Form Modal */}
      <BookingFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        booking={selectedBooking}
      />

      {/* Booking Details Modal */}
      <BookingDetailsModal
        isOpen={Boolean(detailsBooking)}
        onClose={() => setDetailsBooking(null)}
        booking={detailsBooking}
        onEdit={handleEdit}
        onDispatchWorkOrder={onDispatchWorkOrder}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(bookingToDelete)}
        onClose={() => setBookingToDelete(null)}
        onConfirm={() => {
          if (bookingToDelete) deleteBooking(bookingToDelete.id);
        }}
        title="Delete Booking Record?"
        message={`Are you sure you want to delete ${bookingToDelete?.bookingNumber}?`}
        confirmText="Delete Booking"
      />
    </div>
  );
};


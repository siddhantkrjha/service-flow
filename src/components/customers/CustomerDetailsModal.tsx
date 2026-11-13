import React, { useState } from 'react';
import { Customer } from '@/types';
import { useData } from '@/contexts/DataContext';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { formatCurrency, formatDate, getBookingStatusColor, getInvoiceStatusColor } from '@/lib/utils';
import { Mail, Phone, MapPin, Building, Calendar, FileText, Edit, Trash2, Clock } from 'lucide-react';

export interface CustomerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  onEdit: (customer: Customer) => void;
}

export const CustomerDetailsModal: React.FC<CustomerDetailsModalProps> = ({
  isOpen,
  onClose,
  customer,
  onEdit,
}) => {
  const { bookings, invoices, deleteCustomer } = useData();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'invoices'>('overview');

  if (!customer) return null;

  const customerBookings = bookings.filter((b) => b.customerId === customer.id);
  const customerInvoices = invoices.filter((i) => i.customerId === customer.id);
  const totalBilled = customerInvoices.reduce((sum, inv) => sum + inv.total, 0);

  const handleDelete = () => {
    deleteCustomer(customer.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl">
        <div className="space-y-6">
          {/* Header section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  {customer.customerNumber}
                </span>
                <Badge variant={customer.status === 'active' ? 'success' : 'default'} dot>
                  {customer.status === 'active' ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1">{customer.name}</h2>
              {customer.company && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>{customer.company}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Edit className="w-3.5 h-3.5" />}
                onClick={() => {
                  onClose();
                  onEdit(customer);
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

          {/* Navigation tabs */}
          <div className="flex items-center border-b border-slate-200 text-xs font-medium text-slate-500">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2.5 px-3 border-b-2 font-semibold transition-colors ${
                activeTab === 'overview'
                  ? 'border-sky-600 text-sky-600'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              Overview & Contact
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`pb-2.5 px-3 border-b-2 font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'bookings'
                  ? 'border-sky-600 text-sky-600'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              <span>Service Bookings</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700 text-[10px]">
                {customerBookings.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('invoices')}
              className={`pb-2.5 px-3 border-b-2 font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'invoices'
                  ? 'border-sky-600 text-sky-600'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              <span>Invoices & Billing</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700 text-[10px]">
                {customerInvoices.length}
              </span>
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Contact Details
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-800">
                    <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                    <a href={`mailto:${customer.email}`} className="hover:text-sky-600 truncate">
                      {customer.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-800">
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <a href={`tel:${customer.phone}`} className="hover:text-sky-600">
                      {customer.phone}
                    </a>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Service Address
                  </div>
                  <div className="flex items-start gap-2 text-sm text-slate-800">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <div>{customer.address.street}</div>
                      <div className="text-xs text-slate-500">
                        {customer.address.city}, {customer.address.state} {customer.address.zip}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {customer.notes && (
                <div className="p-4 rounded-xl border border-slate-100 bg-amber-50/30">
                  <div className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                    Special Service Notes
                  </div>
                  <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {customer.notes}
                  </p>
                </div>
              )}

              {/* Quick stats banner */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-slate-900 text-white">
                <div>
                  <div className="text-[11px] text-slate-400">Total Billed</div>
                  <div className="text-base font-bold text-sky-400">
                    {formatCurrency(totalBilled)}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400">Total Bookings</div>
                  <div className="text-base font-bold">{customerBookings.length}</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400">Customer Since</div>
                  <div className="text-xs font-medium mt-0.5">
                    {formatDate(customer.createdAt, 'MMM yyyy')}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="space-y-3">
              {customerBookings.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No bookings found for this customer
                </div>
              ) : (
                customerBookings.map((b) => {
                  const statusStyle = getBookingStatusColor(b.status);
                  return (
                    <div
                      key={b.id}
                      className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{b.bookingNumber}</span>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[10px] font-semibold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                          >
                            <span className={`w-1 h-1 rounded-full ${statusStyle.dot}`} />
                            {b.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {formatDate(b.scheduledDate)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {b.scheduledTime}
                          </span>
                        </div>
                        {b.notes && (
                          <p className="text-[11px] text-slate-600 mt-1 line-clamp-1">{b.notes}</p>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'invoices' && (
            <div className="space-y-3">
              {customerInvoices.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No invoices found for this customer
                </div>
              ) : (
                customerInvoices.map((inv) => {
                  const statusStyle = getInvoiceStatusColor(inv.status);
                  return (
                    <div
                      key={inv.id}
                      className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{inv.invoiceNumber}</span>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[10px] font-semibold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                          >
                            <span className={`w-1 h-1 rounded-full ${statusStyle.dot}`} />
                            {inv.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          Issued: {formatDate(inv.issueDate)} • Due: {formatDate(inv.dueDate)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-slate-900">
                          {formatCurrency(inv.total)}
                        </div>
                        <div className="text-[10px] text-slate-400">{inv.items.length} items</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Customer?"
        message={`Are you sure you want to delete ${customer.name}? This will permanently remove their profile.`}
        confirmText="Delete Customer"
      />
    </>
  );
};


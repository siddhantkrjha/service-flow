import React, { useState } from 'react';
import { Invoice } from '@/types';
import { useData } from '@/contexts/DataContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { PrintableInvoice } from './PrintableInvoice';
import { formatCurrency, formatDate, getInvoiceStatusColor } from '@/lib/utils';
import { Printer, Edit, Trash2, CheckCircle, FileText, User, Calendar } from 'lucide-react';

export interface InvoiceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice | null;
  onEdit: (invoice: Invoice) => void;
}

export const InvoiceDetailsModal: React.FC<InvoiceDetailsModalProps> = ({
  isOpen,
  onClose,
  invoice,
  onEdit,
}) => {
  const { customers, workOrders, updateInvoice, deleteInvoice } = useData();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPrintView, setShowPrintView] = useState(false);

  if (!invoice) return null;

  const customer = customers.find((c) => c.id === invoice.customerId);
  const workOrder = workOrders.find((w) => w.id === invoice.workOrderId);
  const statusStyle = getInvoiceStatusColor(invoice.status);

  const handleDelete = () => {
    deleteInvoice(invoice.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleStatusChange = (newStatus: Invoice['status']) => {
    updateInvoice(invoice.id, { status: newStatus });
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
                  {invoice.invoiceNumber}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                  {invoice.status}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                {formatCurrency(invoice.total)}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Printer className="w-3.5 h-3.5" />}
                onClick={() => setShowPrintView(true)}
              >
                Print / View
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Edit className="w-3.5 h-3.5" />}
                onClick={() => {
                  onClose();
                  onEdit(invoice);
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

          {/* Quick status actions */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold text-slate-600">Update Invoice Status:</span>
            <div className="flex items-center gap-1.5">
              {invoice.status !== 'Paid' && (
                <button
                  onClick={() => handleStatusChange('Paid')}
                  className="px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                >
                  Mark Paid
                </button>
              )}
              {invoice.status !== 'Sent' && (
                <button
                  onClick={() => handleStatusChange('Sent')}
                  className="px-2.5 py-1 text-xs font-medium rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
                >
                  Mark Sent
                </button>
              )}
              {invoice.status !== 'Draft' && (
                <button
                  onClick={() => handleStatusChange('Draft')}
                  className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  Mark Draft
                </button>
              )}
              {invoice.status !== 'Overdue' && (
                <button
                  onClick={() => handleStatusChange('Overdue')}
                  className="px-2.5 py-1 text-xs font-medium rounded-md bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors"
                >
                  Mark Overdue
                </button>
              )}
            </div>
          </div>

          {/* Customer & Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Billed Customer
              </span>
              <div className="text-sm font-semibold text-slate-900">{customer?.name}</div>
              {customer?.company && (
                <div className="text-xs text-slate-500">{customer.company}</div>
              )}
              <div className="text-xs text-slate-600">{customer?.email}</div>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Dates & Terms
              </span>
              <div className="text-xs text-slate-700">
                <strong>Issue Date:</strong> {formatDate(invoice.issueDate)}
              </div>
              <div className="text-xs text-slate-700">
                <strong>Payment Due:</strong> {formatDate(invoice.dueDate)}
              </div>
              {workOrder && (
                <div className="text-xs text-sky-600 font-medium">
                  Linked WO: {workOrder.orderNumber}
                </div>
              )}
            </div>
          </div>

          {/* Line items summary */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Itemized Charges
            </span>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <tr>
                    <th className="p-3">Description</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Price</th>
                    <th className="p-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoice.items.map((item) => (
                    <tr key={item.id}>
                      <td className="p-3 text-slate-900 font-medium">{item.description}</td>
                      <td className="p-3 text-center text-slate-600">{item.quantity}</td>
                      <td className="p-3 text-right text-slate-600">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="p-3 text-right font-bold text-slate-900">
                        {formatCurrency(item.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end text-xs space-y-1">
            <div className="w-64 space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-semibold">{formatCurrency(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax:</span>
                <span className="font-semibold">{formatCurrency(invoice.taxAmount)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 pt-1 border-t border-slate-200">
                <span>Total:</span>
                <span className="text-sky-600">{formatCurrency(invoice.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Printable Invoice Modal View */}
      {showPrintView && (
        <PrintableInvoice invoice={invoice} onClose={() => setShowPrintView(false)} />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Invoice?"
        message={`Are you sure you want to delete ${invoice.invoiceNumber}?`}
        confirmText="Delete Invoice"
      />
    </>
  );
};


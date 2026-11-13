import React, { useState, useMemo } from 'react';
import { Invoice, WorkOrder } from '@/types';
import { useData } from '@/contexts/DataContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { InvoiceFormModal } from './InvoiceFormModal';
import { InvoiceDetailsModal } from './InvoiceDetailsModal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { PrintableInvoice } from './PrintableInvoice';
import { formatCurrency, formatDate, getInvoiceStatusColor } from '@/lib/utils';
import {
  Search,
  Plus,
  FileText,
  Printer,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
} from 'lucide-react';

export interface InvoiceListProps {
  fromWorkOrder?: WorkOrder | null;
  onClearWorkOrder?: () => void;
}

export const InvoiceList: React.FC<InvoiceListProps> = ({ fromWorkOrder, onClearWorkOrder }) => {
  const { invoices, customers, addInvoice, updateInvoice, deleteInvoice } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(Boolean(fromWorkOrder));
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [detailsInvoice, setDetailsInvoice] = useState<Invoice | null>(null);
  const [printInvoice, setPrintInvoice] = useState<Invoice | null>(null);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const customer = customers.find((c) => c.id === inv.customerId);

      const matchesSearch =
        inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (customer && customer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        inv.total.toString().includes(searchTerm);

      const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [invoices, customers, searchTerm, statusFilter]);

  const handleEdit = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedInvoice(null);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data: Omit<Invoice, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt'>) => {
    if (selectedInvoice) {
      updateInvoice(selectedInvoice.id, data);
    } else {
      addInvoice(data);
    }
    if (onClearWorkOrder) onClearWorkOrder();
  };

  return (
    <div className="space-y-4">
      {/* Control bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2 max-w-md">
          <Input
            placeholder="Search invoice number, customer, amount..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={handleCreate}
          >
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
        {['all', 'Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-lg border font-medium whitespace-nowrap transition-colors ${
              statusFilter === st
                ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {st === 'all' ? `All Invoices (${invoices.length})` : st}
          </button>
        ))}
      </div>

      {/* Invoices Table */}
      <Card>
        {filteredInvoices.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No invoices found"
            description={
              searchTerm || statusFilter !== 'all'
                ? 'No invoices match your search or filter parameters.'
                : 'Draft and send your first service invoice to a customer.'
            }
            actionText="Create Invoice"
            onAction={handleCreate}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Invoice #</th>
                  <th className="py-3.5 px-4">Customer Account</th>
                  <th className="py-3.5 px-4">Issue Date</th>
                  <th className="py-3.5 px-4">Due Date</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map((inv) => {
                  const customer = customers.find((c) => c.id === inv.customerId);
                  const statusStyle = getInvoiceStatusColor(inv.status);

                  return (
                    <tr
                      key={inv.id}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                      onClick={() => setDetailsInvoice(inv)}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 group-hover:text-sky-600 transition-colors">
                          {customer?.name || 'Customer'}
                        </div>
                        {customer?.company && (
                          <div className="text-[11px] text-slate-500">{customer.company}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {formatDate(inv.issueDate, 'MMM d, yyyy')}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {formatDate(inv.dueDate, 'MMM d, yyyy')}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {formatCurrency(inv.total)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setPrintInvoice(inv)}
                            className="p-1.5 rounded-md text-slate-400 hover:text-sky-600 hover:bg-slate-100 transition-colors"
                            title="Print Invoice"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDetailsInvoice(inv)}
                            className="p-1.5 rounded-md text-slate-400 hover:text-sky-600 hover:bg-slate-100 transition-colors"
                            title="View Invoice"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(inv)}
                            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            title="Edit Invoice"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setInvoiceToDelete(inv)}
                            className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Invoice"
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
      <InvoiceFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          if (onClearWorkOrder) onClearWorkOrder();
        }}
        onSubmit={handleFormSubmit}
        invoice={selectedInvoice}
        fromWorkOrder={fromWorkOrder}
      />

      {/* Details Modal */}
      <InvoiceDetailsModal
        isOpen={Boolean(detailsInvoice)}
        onClose={() => setDetailsInvoice(null)}
        invoice={detailsInvoice}
        onEdit={handleEdit}
      />

      {/* Printable Modal */}
      {printInvoice && (
        <PrintableInvoice invoice={printInvoice} onClose={() => setPrintInvoice(null)} />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(invoiceToDelete)}
        onClose={() => setInvoiceToDelete(null)}
        onConfirm={() => {
          if (invoiceToDelete) deleteInvoice(invoiceToDelete.id);
        }}
        title="Delete Invoice?"
        message={`Are you sure you want to delete ${invoiceToDelete?.invoiceNumber}?`}
        confirmText="Delete Invoice"
      />
    </div>
  );
};


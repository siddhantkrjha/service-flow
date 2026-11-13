import React from 'react';
import { Invoice } from '@/types';
import { useData } from '@/contexts/DataContext';
import { formatCurrency, formatDate, getInvoiceStatusColor } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Printer, X, Zap } from 'lucide-react';

export interface PrintableInvoiceProps {
  invoice: Invoice;
  onClose: () => void;
}

export const PrintableInvoice: React.FC<PrintableInvoiceProps> = ({ invoice, onClose }) => {
  const { customers, businessProfile } = useData();
  const customer = customers.find((c) => c.id === invoice.customerId);
  const statusStyle = getInvoiceStatusColor(invoice.status);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl p-8 sm:p-12 text-slate-900 my-8">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100 no-print">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Printable Commercial Invoice
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
            >
              {invoice.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Printer className="w-4 h-4" />}
              onClick={handlePrint}
            >
              Print Invoice
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Document Body */}
        <div className="pt-6 space-y-8">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center text-white">
                  <Zap className="w-4 h-4 fill-white" />
                </div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  {businessProfile.name}
                </h1>
              </div>
              <div className="text-xs text-slate-500 space-y-0.5">
                <div>{businessProfile.address.street}</div>
                <div>
                  {businessProfile.address.city}, {businessProfile.address.state}{' '}
                  {businessProfile.address.zip}
                </div>
                <div>{businessProfile.email} • {businessProfile.phone}</div>
              </div>
            </div>

            <div className="text-right">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">INVOICE</h2>
              <div className="text-sm font-mono font-bold text-sky-600 mt-0.5">
                {invoice.invoiceNumber}
              </div>
              <div className="text-xs text-slate-500 mt-2 space-y-0.5">
                <div>
                  <strong>Issue Date:</strong> {formatDate(invoice.issueDate)}
                </div>
                <div>
                  <strong>Payment Due:</strong> {formatDate(invoice.dueDate)}
                </div>
              </div>
            </div>
          </div>

          {/* Bill To */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Billed To
            </span>
            <div className="text-sm font-bold text-slate-900">{customer?.name}</div>
            {customer?.company && (
              <div className="text-xs font-medium text-slate-700">{customer.company}</div>
            )}
            <div className="text-xs text-slate-600 mt-1">
              <div>{customer?.address.street}</div>
              <div>
                {customer?.address.city}, {customer?.address.state} {customer?.address.zip}
              </div>
              <div className="mt-1 text-slate-500">{customer?.email}</div>
            </div>
          </div>

          {/* Line Items Table */}
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b-2 border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                <th className="py-2.5">Description</th>
                <th className="py-2.5 text-center">Qty</th>
                <th className="py-2.5 text-right">Unit Price</th>
                <th className="py-2.5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoice.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-3 font-medium text-slate-800">{item.description}</td>
                  <td className="py-3 text-center text-slate-600">{item.quantity}</td>
                  <td className="py-3 text-right text-slate-600">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="py-3 text-right font-bold text-slate-900">
                    {formatCurrency(item.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end pt-4 border-t border-slate-200">
            <div className="w-72 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-slate-900">{formatCurrency(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax ({(invoice.taxRate * 100).toFixed(2)}%):</span>
                <span className="font-semibold text-slate-900">{formatCurrency(invoice.taxAmount)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Due:</span>
                <span className="text-sky-600">{formatCurrency(invoice.total)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
              <strong className="text-slate-700">Payment Instructions:</strong> {invoice.notes}
            </div>
          )}

          {/* Footer */}
          <div className="pt-8 border-t border-slate-200 text-center text-[11px] text-slate-400">
            Service Flow Open-Source Business Platform • Generated invoice for client records.
          </div>
        </div>
      </div>
    </div>
  );
};


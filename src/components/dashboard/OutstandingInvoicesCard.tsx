import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useData } from '@/contexts/DataContext';
import { formatCurrency, formatDate, getInvoiceStatusColor } from '@/lib/utils';
import { AlertCircle, ArrowUpRight } from 'lucide-react';

export const OutstandingInvoicesCard: React.FC = () => {
  const { invoices, customers, updateInvoice } = useData();

  const outstanding = invoices
    .filter((i) => i.status === 'Sent' || i.status === 'Overdue' || i.status === 'Draft')
    .slice(0, 4);

  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle>Outstanding & Recent Invoices</CardTitle>
          <p className="text-xs text-slate-500">Pending collections and active receivables</p>
        </div>
        <Link
          to="/invoices"
          className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
        >
          View all invoices <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-2.5">Invoice #</th>
                <th className="pb-2.5">Customer</th>
                <th className="pb-2.5">Due Date</th>
                <th className="pb-2.5">Total</th>
                <th className="pb-2.5">Status</th>
                <th className="pb-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {outstanding.map((inv) => {
                const customer = customers.find((c) => c.id === inv.customerId);
                const statusStyle = getInvoiceStatusColor(inv.status);

                return (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 font-semibold text-slate-900">
                      <Link to="/invoices" className="hover:text-sky-600">
                        {inv.invoiceNumber}
                      </Link>
                    </td>
                    <td className="py-3 font-medium text-slate-800">
                      {customer?.name || 'Customer'}
                    </td>
                    <td className="py-3 text-slate-600">
                      {formatDate(inv.dueDate, 'MMM d, yyyy')}
                    </td>
                    <td className="py-3 font-bold text-slate-900">
                      {formatCurrency(inv.total)}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      {inv.status !== 'Paid' ? (
                        <button
                          onClick={() => updateInvoice(inv.id, { status: 'Paid' })}
                          className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-200 transition-colors"
                        >
                          Mark Paid
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">Settled</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};


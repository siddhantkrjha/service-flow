import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { Modal } from './Modal';
import { Search, Users, Calendar, Wrench, FileText, UserCheck, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { customers, bookings, workOrders, technicians, invoices } = useData();
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  const results = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();

    const matchedCustomers = customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.customerNumber.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.company && c.company.toLowerCase().includes(q))
    ).slice(0, 3);

    const matchedWorkOrders = workOrders.filter(
      (w) =>
        w.orderNumber.toLowerCase().includes(q) ||
        w.title.toLowerCase().includes(q) ||
        w.description.toLowerCase().includes(q)
    ).slice(0, 3);

    const matchedBookings = bookings.filter(
      (b) =>
        b.bookingNumber.toLowerCase().includes(q) ||
        (b.notes && b.notes.toLowerCase().includes(q)) ||
        b.address.street.toLowerCase().includes(q)
    ).slice(0, 3);

    const matchedTechnicians = technicians.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.skills.some((s) => s.toLowerCase().includes(q))
    ).slice(0, 3);

    const matchedInvoices = invoices.filter(
      (i) =>
        i.invoiceNumber.toLowerCase().includes(q) ||
        i.total.toString().includes(q)
    ).slice(0, 3);

    const hasAny =
      matchedCustomers.length > 0 ||
      matchedWorkOrders.length > 0 ||
      matchedBookings.length > 0 ||
      matchedTechnicians.length > 0 ||
      matchedInvoices.length > 0;

    return {
      customers: matchedCustomers,
      workOrders: matchedWorkOrders,
      bookings: matchedBookings,
      technicians: matchedTechnicians,
      invoices: matchedInvoices,
      hasAny,
    };
  }, [query, customers, workOrders, bookings, technicians, invoices]);

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="xl">
      <div className="space-y-4">
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-slate-200 pb-3">
          <Search className="w-5 h-5 text-slate-400 absolute left-1" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search customers, work orders, bookings, invoices..."
            className="w-full pl-9 pr-4 text-base bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-100 text-slate-500 border border-slate-200">
            ESC
          </span>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto space-y-4 pt-1">
          {!query.trim() && (
            <div className="py-8 text-center text-slate-400 text-sm">
              Type to quickly find any record in Service Flow...
            </div>
          )}

          {query.trim() && results && !results.hasAny && (
            <div className="py-8 text-center text-slate-500 text-sm">
              No matching records found for "{query}".
            </div>
          )}

          {/* Customers section */}
          {results && results.customers.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" /> Customers
              </div>
              <div className="space-y-1">
                {results.customers.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => handleSelect('/customers')}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100/80 cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{c.name}</div>
                      <div className="text-xs text-slate-500">
                        {c.customerNumber} {c.company ? `• ${c.company}` : ''} • {c.phone}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Work Orders section */}
          {results && results.workOrders.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5" /> Work Orders
              </div>
              <div className="space-y-1">
                {results.workOrders.map((wo) => (
                  <div
                    key={wo.id}
                    onClick={() => handleSelect('/work-orders')}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100/80 cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{wo.orderNumber}: {wo.title}</div>
                      <div className="text-xs text-slate-500">
                        Status: {wo.status} • Priority: {wo.priority}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bookings section */}
          {results && results.bookings.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Bookings
              </div>
              <div className="space-y-1">
                {results.bookings.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => handleSelect('/bookings')}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100/80 cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{b.bookingNumber}</div>
                      <div className="text-xs text-slate-500">
                        {b.scheduledDate} at {b.scheduledTime} • Status: {b.status}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Technicians section */}
          {results && results.technicians.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5" /> Technicians
              </div>
              <div className="space-y-1">
                {results.technicians.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => handleSelect('/technicians')}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100/80 cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{t.name}</div>
                      <div className="text-xs text-slate-500">
                        {t.skills.join(', ')} • {t.status}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Invoices section */}
          {results && results.invoices.length > 0 && (
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Invoices
              </div>
              <div className="space-y-1">
                {results.invoices.map((inv) => (
                  <div
                    key={inv.id}
                    onClick={() => handleSelect('/invoices')}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100/80 cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{inv.invoiceNumber}</div>
                      <div className="text-xs text-slate-500">
                        {formatCurrency(inv.total)} • Status: {inv.status}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};


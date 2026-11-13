import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useData } from '@/contexts/DataContext';
import { getBookingStatusColor, formatDate } from '@/lib/utils';
import { ArrowUpRight } from 'lucide-react';

export const RecentBookingsTable: React.FC = () => {
  const { bookings, customers, categories } = useData();

  const recent = bookings.slice(0, 5);

  return (
    <Card className="col-span-full xl:col-span-7">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle>Recent Bookings</CardTitle>
          <p className="text-xs text-slate-500">Latest scheduled customer service requests</p>
        </div>
        <Link
          to="/bookings"
          className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
        >
          View all <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="pb-2.5">Booking #</th>
                <th className="pb-2.5">Customer</th>
                <th className="pb-2.5">Service</th>
                <th className="pb-2.5">Scheduled</th>
                <th className="pb-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recent.map((b) => {
                const customer = customers.find((c) => c.id === b.customerId);
                const category = categories.find((cat) => cat.id === b.serviceCategoryId);
                const statusStyle = getBookingStatusColor(b.status);

                return (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 font-semibold text-slate-900">
                      <Link to="/bookings" className="hover:text-sky-600">
                        {b.bookingNumber}
                      </Link>
                    </td>
                    <td className="py-3">
                      <div className="font-medium text-slate-800">{customer?.name || 'Unknown'}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[140px]">
                        {b.address.street}
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="text-slate-600 font-medium truncate max-w-[150px] block">
                        {category?.name || 'General Service'}
                      </span>
                    </td>
                    <td className="py-3 text-slate-600 whitespace-nowrap">
                      <div>{formatDate(b.scheduledDate, 'MMM d, yyyy')}</div>
                      <div className="text-[11px] text-slate-400">{b.scheduledTime}</div>
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                        {b.status}
                      </span>
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


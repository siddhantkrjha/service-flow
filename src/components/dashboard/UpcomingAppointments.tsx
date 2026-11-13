import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useData } from '@/contexts/DataContext';
import { formatDate } from '@/lib/utils';
import { Calendar, Clock, MapPin, UserCheck, ArrowUpRight } from 'lucide-react';

export const UpcomingAppointments: React.FC = () => {
  const { workOrders, customers, technicians } = useData();

  // Find active and assigned upcoming work orders
  const upcoming = workOrders
    .filter((w) => w.status === 'Assigned' || w.status === 'In Progress' || w.status === 'Pending')
    .slice(0, 4);

  return (
    <Card className="col-span-full xl:col-span-5">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle>Upcoming Jobs & Dispatch</CardTitle>
          <p className="text-xs text-slate-500">Field work orders scheduled for execution</p>
        </div>
        <Link
          to="/work-orders"
          className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
        >
          Dispatch Board <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {upcoming.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No upcoming appointments currently queued
            </div>
          ) : (
            upcoming.map((wo) => {
              const customer = customers.find((c) => c.id === wo.customerId);
              const tech = technicians.find((t) => t.id === wo.technicianId);

              return (
                <div
                  key={wo.id}
                  className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {wo.orderNumber}: {wo.title}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                        wo.priority === 'Urgent'
                          ? 'bg-rose-100 text-rose-700'
                          : wo.priority === 'High'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {wo.priority}
                    </span>
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5 truncate">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{wo.scheduledTime || 'TBD'} • {formatDate(wo.scheduledDate, 'MMM d')}</span>
                    </div>
                    <div className="flex items-center gap-1.5 truncate">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{tech ? tech.name : 'Unassigned'}</span>
                    </div>
                  </div>

                  <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-slate-500 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">
                      {customer?.name} ({customer?.address.street})
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};


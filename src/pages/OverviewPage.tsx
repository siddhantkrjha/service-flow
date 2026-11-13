import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { StatCard } from '@/components/dashboard/StatCard';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { JobsStatusChart } from '@/components/dashboard/JobsStatusChart';
import { RecentBookingsTable } from '@/components/dashboard/RecentBookingsTable';
import { UpcomingAppointments } from '@/components/dashboard/UpcomingAppointments';
import { OutstandingInvoicesCard } from '@/components/dashboard/OutstandingInvoicesCard';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import {
  DollarSign,
  Wrench,
  Calendar,
  FileText,
  Plus,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
} from 'lucide-react';

export const OverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { metrics, customers } = useData();
  const [selectedRange, setSelectedRange] = useState<'month' | 'quarter' | 'all'>('month');

  return (
    <div className="space-y-6">
      {/* Welcome & Workflow Quick Actions Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 text-white shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
              Operations Center
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-1">
            Service Flow Command Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Customer Request → Booking → Work Order → Technician Assignment → Job Completion → Invoice → Feedback
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/bookings')}
            leftIcon={<Calendar className="w-3.5 h-3.5" />}
            className="bg-white/10 text-white hover:bg-white/20 border-white/20 text-xs shadow-none"
          >
            New Booking
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/work-orders')}
            leftIcon={<Wrench className="w-3.5 h-3.5" />}
            className="bg-white/10 text-white hover:bg-white/20 border-white/20 text-xs shadow-none"
          >
            Dispatch Job
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/invoices')}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            className="text-xs"
          >
            Create Invoice
          </Button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Paid Revenue"
          value={formatCurrency(metrics.totalRevenue)}
          subtitle="Settled customer collections"
          trend={{ value: '+12.4% vs last mo', isPositive: true }}
          icon={DollarSign}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />

        <StatCard
          title="Active Field Jobs"
          value={metrics.activeJobsCount.toString()}
          subtitle={`${metrics.completedJobsCount} completed this period`}
          trend={{ value: 'Realtime dispatch', isPositive: true }}
          icon={Wrench}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />

        <StatCard
          title="Upcoming Bookings"
          value={metrics.upcomingBookingsCount.toString()}
          subtitle="Scheduled service appointments"
          trend={{ value: 'On schedule', isPositive: true }}
          icon={Calendar}
          iconColor="text-sky-600"
          iconBg="bg-sky-50"
        />

        <StatCard
          title="Pending Invoices"
          value={formatCurrency(metrics.pendingInvoicesTotal)}
          subtitle={`${metrics.pendingInvoicesCount} invoices awaiting payment`}
          trend={{ value: 'Net 15 terms', isPositive: false }}
          icon={FileText}
          iconColor="text-rose-600"
          iconBg="bg-rose-50"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <RevenueChart />
        <JobsStatusChart />
      </div>

      {/* Tables & Queue Section */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <RecentBookingsTable />
        <UpcomingAppointments />
      </div>

      {/* Outstanding Invoices Section */}
      <OutstandingInvoicesCard />
    </div>
  );
};


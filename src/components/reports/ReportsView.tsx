import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { BarChart3, TrendingUp, DollarSign, Calendar, Wrench, UserCheck } from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { invoices, workOrders, bookings, technicians, categories } = useData();
  const [dateRange, setDateRange] = useState<'30d' | '90d' | 'ytd'>('90d');

  // Revenue by Service Category
  const categoryRevenue = categories.map((cat) => {
    // Count bookings in this category
    const catBookings = bookings.filter((b) => b.serviceCategoryId === cat.id);
    const count = catBookings.length;
    // Estimate billing or actual
    const estimatedRev = count * cat.defaultRate * 2.5;

    return {
      name: cat.name.split(' ')[0] + ' ' + (cat.name.split(' ')[1] || ''),
      fullName: cat.name,
      bookings: count,
      revenue: estimatedRev,
      color: cat.color,
    };
  });

  // Technician performance
  const techPerformance = technicians.map((t) => {
    const assigned = workOrders.filter((w) => w.technicianId === t.id).length;
    const completed = workOrders.filter((w) => w.technicianId === t.id && w.status === 'Completed').length;

    return {
      name: t.name.split(' ')[0],
      fullName: t.name,
      assigned,
      completed: completed + (t.completedJobsCount || 0),
    };
  });

  // Monthly trends
  const monthlyData = [
    { month: 'Sep', revenue: 9400, jobs: 28 },
    { month: 'Oct', revenue: 11200, jobs: 34 },
    { month: 'Nov', revenue: 10800, jobs: 31 },
    { month: 'Dec', revenue: 13500, jobs: 42 },
    { month: 'Jan', revenue: 12100, jobs: 38 },
    {
      month: 'Feb',
      revenue: invoices.filter((i) => i.status === 'Paid').reduce((sum, i) => sum + i.total, 11400),
      jobs: workOrders.length + 30,
    },
  ];

  const totalRevenue = invoices
    .filter((i) => i.status === 'Paid')
    .reduce((sum, i) => sum + i.total, 0);

  const pendingAmount = invoices
    .filter((i) => i.status === 'Sent' || i.status === 'Overdue')
    .reduce((sum, i) => sum + i.total, 0);

  return (
    <div className="space-y-6">
      {/* Header and Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Analytics & Business Intelligence</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational metrics, technician dispatch efficiency, and cash-flow health
          </p>
        </div>

        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5 text-xs font-semibold text-slate-600">
          <button
            onClick={() => setDateRange('30d')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              dateRange === '30d' ? 'bg-slate-900 text-white' : 'hover:text-slate-900'
            }`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setDateRange('90d')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              dateRange === '90d' ? 'bg-slate-900 text-white' : 'hover:text-slate-900'
            }`}
          >
            Last 90 Days
          </button>
          <button
            onClick={() => setDateRange('ytd')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              dateRange === 'ytd' ? 'bg-slate-900 text-white' : 'hover:text-slate-900'
            }`}
          >
            Year to Date
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-sky-500">
          <span className="text-xs font-semibold text-slate-500 uppercase">Paid Invoices</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(totalRevenue)}</div>
          <span className="text-[11px] text-emerald-600 font-medium">Settled collections</span>
        </Card>

        <Card className="p-4 border-l-4 border-l-amber-500">
          <span className="text-xs font-semibold text-slate-500 uppercase">Outstanding Receivables</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(pendingAmount)}</div>
          <span className="text-[11px] text-amber-600 font-medium">Pending invoices</span>
        </Card>

        <Card className="p-4 border-l-4 border-l-emerald-500">
          <span className="text-xs font-semibold text-slate-500 uppercase">Total Field Jobs</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{workOrders.length}</div>
          <span className="text-[11px] text-slate-500 font-medium">Active work order pipeline</span>
        </Card>

        <Card className="p-4 border-l-4 border-l-indigo-500">
          <span className="text-xs font-semibold text-slate-500 uppercase">Service Categories</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{categories.length}</div>
          <span className="text-[11px] text-slate-500 font-medium">Commercial service offerings</span>
        </Card>
      </div>

      {/* Revenue & Jobs over Time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <CardHeader className="p-0 pb-4">
            <CardTitle>Monthly Revenue Growth</CardTitle>
            <p className="text-xs text-slate-500">Billed monthly gross revenue ($USD)</p>
          </CardHeader>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(val) => `$${val / 1000}k`}
                />
                <Tooltip
                  formatter={(val: any) => [formatCurrency(Number(val)), 'Revenue']}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="revenue" fill="#0284c7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <CardHeader className="p-0 pb-4">
            <CardTitle>Completed Jobs Trajectory</CardTitle>
            <p className="text-xs text-slate-500">Monthly job completion and fulfillment rate</p>
          </CardHeader>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Line
                  type="monotone"
                  dataKey="jobs"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#10b981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Services Breakdown & Technician Efficiency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <CardHeader className="p-0 pb-4">
            <CardTitle>Most Frequently Requested Services</CardTitle>
            <p className="text-xs text-slate-500">Booking volume by service category</p>
          </CardHeader>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={categoryRevenue}
                margin={{ top: 5, right: 15, left: 35, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(val: any) => [`${val} Bookings`, 'Total Requests']}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="bookings" fill="#38bdf8" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <CardHeader className="p-0 pb-4">
            <CardTitle>Technician Dispatch & Job Count</CardTitle>
            <p className="text-xs text-slate-500">Total jobs completed across technician team</p>
          </CardHeader>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={techPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="completed" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};


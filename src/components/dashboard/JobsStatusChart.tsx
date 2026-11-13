import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useData } from '@/contexts/DataContext';

export const JobsStatusChart: React.FC = () => {
  const { workOrders } = useData();

  const counts = {
    'In Progress': workOrders.filter((w) => w.status === 'In Progress').length,
    Assigned: workOrders.filter((w) => w.status === 'Assigned').length,
    Pending: workOrders.filter((w) => w.status === 'Pending').length,
    Completed: workOrders.filter((w) => w.status === 'Completed').length,
  };

  const data = [
    { name: 'In Progress', value: counts['In Progress'], color: '#f59e0b' },
    { name: 'Assigned', value: counts.Assigned, color: '#0284c7' },
    { name: 'Pending', value: counts.Pending, color: '#94a3b8' },
    { name: 'Completed', value: counts.Completed, color: '#10b981' },
  ].filter((d) => d.value > 0);

  const total = workOrders.length;

  return (
    <Card className="col-span-full lg:col-span-4">
      <CardHeader className="pb-2">
        <CardTitle>Jobs by Status</CardTitle>
        <p className="text-xs text-slate-500">Distribution across active pipeline</p>
      </CardHeader>
      <CardContent>
        <div className="h-48 w-full relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0];
                    return (
                      <div className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 shadow-md text-xs">
                        <span className="font-semibold text-slate-900">{item.name}: </span>
                        <span className="font-bold text-slate-700">{item.value} jobs</span>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-slate-900">{total}</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Orders</span>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-50">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-slate-600 truncate">{item.name}</span>
              <span className="ml-auto font-bold text-slate-900">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};


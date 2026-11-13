import React, { useState } from 'react';
import { Booking } from '@/types';
import { useData } from '@/contexts/DataContext';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { getBookingStatusColor } from '@/lib/utils';

export interface BookingCalendarProps {
  onSelectBooking: (booking: Booking) => void;
  onCreateForDate?: (dateString: string) => void;
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  onSelectBooking,
  onCreateForDate,
}) => {
  const { bookings, customers, categories } = useData();
  const [currentDate, setCurrentDate] = useState(new Date('2026-02-12T00:00:00'));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date('2026-02-12T00:00:00'));

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-5 h-5 text-sky-600" />
          <h3 className="text-base font-bold text-slate-900">
            {format(currentDate, 'MMMM yyyy')}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="text-xs font-semibold px-2.5 py-1 rounded-md bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
          >
            Today
          </button>
          <div className="flex items-center rounded-lg border border-slate-200 bg-white">
            <button
              onClick={prevMonth}
              className="p-1 text-slate-600 hover:bg-slate-100 rounded-l-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="w-[1px] h-4 bg-slate-200" />
            <button
              onClick={nextMonth}
              className="p-1 text-slate-600 hover:bg-slate-100 rounded-r-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-100/70 text-center text-xs font-bold text-slate-600 uppercase tracking-wider py-2">
        {weekdays.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 min-h-[500px]">
        {days.map((day) => {
          const dayString = format(day, 'yyyy-MM-dd');
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isCurrentDay = isSameDay(day, new Date('2026-02-12T00:00:00'));

          const dayBookings = bookings.filter((b) => b.scheduledDate === dayString);

          return (
            <div
              key={day.toISOString()}
              className={`p-2 min-h-[100px] flex flex-col justify-between transition-colors ${
                !isCurrentMonth ? 'bg-slate-50/50 text-slate-400' : 'bg-white text-slate-900'
              } hover:bg-sky-50/20`}
            >
              {/* Day header */}
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                    isCurrentDay
                      ? 'bg-sky-600 text-white shadow-xs'
                      : !isCurrentMonth
                      ? 'text-slate-400'
                      : 'text-slate-700'
                  }`}
                >
                  {format(day, 'd')}
                </span>
                {dayBookings.length > 0 && (
                  <span className="text-[10px] font-semibold text-slate-400">
                    {dayBookings.length} {dayBookings.length === 1 ? 'job' : 'jobs'}
                  </span>
                )}
              </div>

              {/* Day Bookings chips */}
              <div className="space-y-1 overflow-y-auto max-h-[85px]">
                {dayBookings.map((b) => {
                  const customer = customers.find((c) => c.id === b.customerId);
                  const statusStyle = getBookingStatusColor(b.status);

                  return (
                    <div
                      key={b.id}
                      onClick={() => onSelectBooking(b)}
                      className={`px-1.5 py-1 rounded text-[11px] font-medium border truncate cursor-pointer transition-all hover:scale-[1.02] shadow-2xs ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                      title={`${b.bookingNumber} - ${customer?.name || 'Customer'} (${b.scheduledTime})`}
                    >
                      <div className="flex items-center gap-1 font-semibold truncate">
                        <Clock className="w-2.5 h-2.5 shrink-0 opacity-70" />
                        <span className="truncate">{b.scheduledTime.split(' ')[0]}</span>
                        <span className="truncate font-bold">
                          {customer?.name.split(' ')[0] || 'Customer'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add slot placeholder */}
              {onCreateForDate && (
                <div
                  onClick={() => onCreateForDate(dayString)}
                  className="mt-1 opacity-0 hover:opacity-100 text-[10px] text-center text-sky-600 font-semibold cursor-pointer py-0.5 rounded hover:bg-sky-100/50 transition-opacity"
                >
                  + Add
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};


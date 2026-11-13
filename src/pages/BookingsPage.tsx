import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookingList } from '@/components/bookings/BookingList';
import { Booking } from '@/types';

export const BookingsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleDispatchWorkOrder = (booking: Booking) => {
    // Navigate to work orders page and trigger creation prefilled with this booking
    navigate('/work-orders', { state: { fromBooking: booking } });
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Service Bookings & Schedule</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage upcoming appointments, client booking requests, and calendar allocations
        </p>
      </div>

      <BookingList onDispatchWorkOrder={handleDispatchWorkOrder} />
    </div>
  );
};


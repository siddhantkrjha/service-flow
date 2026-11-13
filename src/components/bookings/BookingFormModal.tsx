import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Booking, BookingStatus } from '@/types';
import { useData } from '@/contexts/DataContext';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

const bookingSchema = z.object({
  customerId: z.string().min(1, 'Please select a customer'),
  serviceCategoryId: z.string().min(1, 'Please select a service category'),
  scheduledDate: z.string().min(1, 'Scheduled date is required'),
  scheduledTime: z.string().min(1, 'Appointment time is required'),
  street: z.string().min(3, 'Service address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zip: z.string().min(3, 'ZIP code is required'),
  estimatedDurationHours: z.number().min(0.5, 'Duration must be at least 30 minutes'),
  status: z.enum(['Requested', 'Confirmed', 'In Progress', 'Completed', 'Cancelled']),
  notes: z.string().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export interface BookingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Booking, 'id' | 'bookingNumber' | 'createdAt' | 'updatedAt'>) => void;
  booking?: Booking | null;
}

export const BookingFormModal: React.FC<BookingFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  booking,
}) => {
  const { customers, categories } = useData();
  const isEditing = Boolean(booking);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      customerId: '',
      serviceCategoryId: '',
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: '09:00 AM',
      street: '',
      city: 'Austin',
      state: 'TX',
      zip: '',
      estimatedDurationHours: 2.0,
      status: 'Requested',
      notes: '',
    },
  });

  const selectedCustomerId = watch('customerId');

  // Automatically autofill customer address if selected
  useEffect(() => {
    if (selectedCustomerId && !isEditing) {
      const cust = customers.find((c) => c.id === selectedCustomerId);
      if (cust) {
        setValue('street', cust.address.street);
        setValue('city', cust.address.city);
        setValue('state', cust.address.state);
        setValue('zip', cust.address.zip);
      }
    }
  }, [selectedCustomerId, customers, setValue, isEditing]);

  useEffect(() => {
    if (booking) {
      reset({
        customerId: booking.customerId,
        serviceCategoryId: booking.serviceCategoryId,
        scheduledDate: booking.scheduledDate,
        scheduledTime: booking.scheduledTime,
        street: booking.address.street,
        city: booking.address.city,
        state: booking.address.state,
        zip: booking.address.zip,
        estimatedDurationHours: booking.estimatedDurationHours,
        status: booking.status,
        notes: booking.notes || '',
      });
    } else {
      reset({
        customerId: customers[0]?.id || '',
        serviceCategoryId: categories[0]?.id || '',
        scheduledDate: new Date().toISOString().split('T')[0],
        scheduledTime: '09:00 AM',
        street: customers[0]?.address.street || '',
        city: customers[0]?.address.city || 'Austin',
        state: customers[0]?.address.state || 'TX',
        zip: customers[0]?.address.zip || '',
        estimatedDurationHours: 2.0,
        status: 'Requested',
        notes: '',
      });
    }
  }, [booking, reset, isOpen, customers, categories]);

  const handleFormSubmit = (data: BookingFormData) => {
    onSubmit({
      customerId: data.customerId,
      serviceCategoryId: data.serviceCategoryId,
      scheduledDate: data.scheduledDate,
      scheduledTime: data.scheduledTime,
      address: {
        street: data.street,
        city: data.city,
        state: data.state,
        zip: data.zip,
      },
      estimatedDurationHours: data.estimatedDurationHours,
      status: data.status as BookingStatus,
      notes: data.notes || undefined,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Booking: ${booking?.bookingNumber}` : 'Create New Booking'}
      description="Schedule customer service appointment and address location"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Customer *"
            {...register('customerId')}
            error={errors.customerId?.message}
          >
            <option value="">Select a customer...</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.company ? `(${c.company})` : ''}
              </option>
            ))}
          </Select>

          <Select
            label="Service Category *"
            {...register('serviceCategoryId')}
            error={errors.serviceCategoryId?.message}
          >
            <option value="">Select service category...</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name} (${cat.defaultRate}/hr)
              </option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="Appointment Date *"
            type="date"
            {...register('scheduledDate')}
            error={errors.scheduledDate?.message}
          />

          <Select label="Time Slot *" {...register('scheduledTime')}>
            <option value="08:00 AM">08:00 AM</option>
            <option value="08:30 AM">08:30 AM</option>
            <option value="09:00 AM">09:00 AM</option>
            <option value="10:00 AM">10:00 AM</option>
            <option value="11:00 AM">11:00 AM</option>
            <option value="01:00 PM">01:00 PM</option>
            <option value="02:00 PM">02:00 PM</option>
            <option value="03:30 PM">03:30 PM</option>
            <option value="05:00 PM">05:00 PM</option>
          </Select>

          <Input
            label="Est. Duration (Hours) *"
            type="number"
            step="0.5"
            min="0.5"
            max="12"
            {...register('estimatedDurationHours', { valueAsNumber: true })}
            error={errors.estimatedDurationHours?.message}
          />
        </div>

        <div className="pt-2 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Service Location
          </h4>
          <div className="space-y-3">
            <Input
              label="Street Address *"
              placeholder="123 Main St"
              {...register('street')}
              error={errors.street?.message}
            />
            <div className="grid grid-cols-3 gap-3">
              <Input label="City *" {...register('city')} error={errors.city?.message} />
              <Input label="State *" {...register('state')} error={errors.state?.message} />
              <Input label="ZIP Code *" {...register('zip')} error={errors.zip?.message} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <Select
            label="Booking Status *"
            {...register('status')}
            options={[
              { value: 'Requested', label: 'Requested (New)' },
              { value: 'Confirmed', label: 'Confirmed' },
              { value: 'In Progress', label: 'In Progress' },
              { value: 'Completed', label: 'Completed' },
              { value: 'Cancelled', label: 'Cancelled' },
            ]}
          />
        </div>

        <Textarea
          label="Job Description & Special Instructions"
          placeholder="Describe symptoms, equipment model, entry notes, or parts needed..."
          rows={3}
          {...register('notes')}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {isEditing ? 'Save Booking' : 'Create Booking'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};


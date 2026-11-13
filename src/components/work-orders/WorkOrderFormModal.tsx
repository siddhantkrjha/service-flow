import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { WorkOrder, WorkOrderPriority, WorkOrderStatus, Booking } from '@/types';
import { useData } from '@/contexts/DataContext';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

const workOrderSchema = z.object({
  title: z.string().min(3, 'Work order title is required'),
  customerId: z.string().min(1, 'Please select a customer'),
  bookingId: z.string().optional(),
  technicianId: z.string().optional(),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']),
  status: z.enum(['Pending', 'Assigned', 'In Progress', 'Completed', 'Cancelled']),
  scheduledDate: z.string().min(1, 'Scheduled date is required'),
  scheduledTime: z.string().optional(),
  description: z.string().min(5, 'Job description is required'),
  internalNotes: z.string().optional(),
  completionNotes: z.string().optional(),
});

type WorkOrderFormData = z.infer<typeof workOrderSchema>;

export interface WorkOrderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<WorkOrder, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'activityHistory'>) => void;
  workOrder?: WorkOrder | null;
  fromBooking?: Booking | null;
}

export const WorkOrderFormModal: React.FC<WorkOrderFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  workOrder,
  fromBooking,
}) => {
  const { customers, technicians, bookings } = useData();
  const isEditing = Boolean(workOrder);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<WorkOrderFormData>({
    resolver: zodResolver(workOrderSchema),
    defaultValues: {
      title: '',
      customerId: '',
      bookingId: '',
      technicianId: '',
      priority: 'Medium',
      status: 'Pending',
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTime: '09:00 AM',
      description: '',
      internalNotes: '',
      completionNotes: '',
    },
  });

  useEffect(() => {
    if (workOrder) {
      reset({
        title: workOrder.title,
        customerId: workOrder.customerId,
        bookingId: workOrder.bookingId || '',
        technicianId: workOrder.technicianId || '',
        priority: workOrder.priority,
        status: workOrder.status,
        scheduledDate: workOrder.scheduledDate,
        scheduledTime: workOrder.scheduledTime || '09:00 AM',
        description: workOrder.description,
        internalNotes: workOrder.internalNotes || '',
        completionNotes: workOrder.completionNotes || '',
      });
    } else if (fromBooking) {
      reset({
        title: `Service Order for ${fromBooking.bookingNumber}`,
        customerId: fromBooking.customerId,
        bookingId: fromBooking.id,
        technicianId: '',
        priority: 'Medium',
        status: 'Assigned',
        scheduledDate: fromBooking.scheduledDate,
        scheduledTime: fromBooking.scheduledTime,
        description: fromBooking.notes || 'Service dispatched from customer booking.',
        internalNotes: 'Dispatched directly from booking.',
        completionNotes: '',
      });
    } else {
      reset({
        title: '',
        customerId: customers[0]?.id || '',
        bookingId: '',
        technicianId: '',
        priority: 'Medium',
        status: 'Pending',
        scheduledDate: new Date().toISOString().split('T')[0],
        scheduledTime: '09:00 AM',
        description: '',
        internalNotes: '',
        completionNotes: '',
      });
    }
  }, [workOrder, fromBooking, reset, isOpen, customers]);

  const handleFormSubmit = (data: WorkOrderFormData) => {
    onSubmit({
      title: data.title,
      customerId: data.customerId,
      bookingId: data.bookingId || undefined,
      technicianId: data.technicianId || undefined,
      priority: data.priority as WorkOrderPriority,
      status: data.status as WorkOrderStatus,
      scheduledDate: data.scheduledDate,
      scheduledTime: data.scheduledTime || undefined,
      description: data.description,
      internalNotes: data.internalNotes || undefined,
      completionNotes: data.completionNotes || undefined,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Work Order: ${workOrder?.orderNumber}` : 'Create Work Order & Dispatch'}
      description="Assign technician, schedule dispatch, and specify service requirements"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          label="Job Title *"
          placeholder="e.g. Clean-Room HVAC Calibration & HEPA Differential Check"
          {...register('title')}
          error={errors.title?.message}
        />

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
            label="Assign Field Technician"
            {...register('technicianId')}
          >
            <option value="">Unassigned (Pending Dispatch)</option>
            {technicians.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} — {t.status} ({t.skills[0] || 'Tech'})
              </option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="Scheduled Date *"
            type="date"
            {...register('scheduledDate')}
            error={errors.scheduledDate?.message}
          />

          <Select label="Time Slot" {...register('scheduledTime')}>
            <option value="08:00 AM">08:00 AM</option>
            <option value="08:30 AM">08:30 AM</option>
            <option value="09:00 AM">09:00 AM</option>
            <option value="10:00 AM">10:00 AM</option>
            <option value="11:00 AM">11:00 AM</option>
            <option value="01:00 PM">01:00 PM</option>
            <option value="02:00 PM">02:00 PM</option>
            <option value="03:30 PM">03:30 PM</option>
          </Select>

          <Select
            label="Priority *"
            {...register('priority')}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <Select
            label="Dispatch Status *"
            {...register('status')}
          >
            <option value="Pending">Pending (Not Dispatched)</option>
            <option value="Assigned">Assigned to Tech</option>
            <option value="In Progress">In Progress on Site</option>
            <option value="Completed">Completed & Verified</option>
            <option value="Cancelled">Cancelled</option>
          </Select>

          <Select
            label="Link to Booking (Optional)"
            {...register('bookingId')}
          >
            <option value="">None / Standalone Order</option>
            {bookings.map((b) => (
              <option key={b.id} value={b.id}>
                {b.bookingNumber} ({b.scheduledDate})
              </option>
            ))}
          </Select>
        </div>

        <Textarea
          label="Job Description & Scope of Work *"
          placeholder="Detailed task list, diagnostic steps, tools or equipment needed..."
          rows={3}
          {...register('description')}
          error={errors.description?.message}
        />

        <Textarea
          label="Internal Dispatch Notes"
          placeholder="Access codes, safety precautions, gate clearance..."
          rows={2}
          {...register('internalNotes')}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {isEditing ? 'Save Work Order' : 'Create & Dispatch'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};


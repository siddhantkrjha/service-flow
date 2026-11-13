import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Customer } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

const customerSchema = z.object({
  name: z.string().min(2, 'Customer name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(7, 'Please enter a valid phone number'),
  company: z.string().optional(),
  street: z.string().min(3, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zip: z.string().min(3, 'ZIP / Postal code is required'),
  notes: z.string().optional(),
  status: z.enum(['active', 'inactive']),
});

type CustomerFormData = z.infer<typeof customerSchema>;

export interface CustomerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Customer, 'id' | 'customerNumber' | 'createdAt' | 'updatedAt'>) => void;
  customer?: Customer | null;
}

export const CustomerFormModal: React.FC<CustomerFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  customer,
}) => {
  const isEditing = Boolean(customer);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      street: '',
      city: '',
      state: 'TX',
      zip: '',
      notes: '',
      status: 'active',
    },
  });

  useEffect(() => {
    if (customer) {
      reset({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        company: customer.company || '',
        street: customer.address.street,
        city: customer.address.city,
        state: customer.address.state,
        zip: customer.address.zip,
        notes: customer.notes || '',
        status: customer.status,
      });
    } else {
      reset({
        name: '',
        email: '',
        phone: '',
        company: '',
        street: '',
        city: '',
        state: 'TX',
        zip: '',
        notes: '',
        status: 'active',
      });
    }
  }, [customer, reset, isOpen]);

  const handleFormSubmit = (data: CustomerFormData) => {
    onSubmit({
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company || undefined,
      address: {
        street: data.street,
        city: data.city,
        state: data.state,
        zip: data.zip,
      },
      notes: data.notes || undefined,
      status: data.status,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Customer: ${customer?.name}` : 'Add New Customer'}
      description="Enter customer contact and service site address details"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Customer Name *"
            placeholder="e.g. John Doe or Acme Corp"
            {...register('name')}
            error={errors.name?.message}
          />
          <Input
            label="Company / Account Name"
            placeholder="e.g. Highland Realty"
            {...register('company')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Email Address *"
            type="email"
            placeholder="client@example.com"
            {...register('email')}
            error={errors.email?.message}
          />
          <Input
            label="Phone Number *"
            placeholder="(555) 000-0000"
            {...register('phone')}
            error={errors.phone?.message}
          />
        </div>

        <div className="pt-2 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            Primary Service Address
          </h4>
          <div className="space-y-3">
            <Input
              label="Street Address *"
              placeholder="123 Main St, Suite 400"
              {...register('street')}
              error={errors.street?.message}
            />
            <div className="grid grid-cols-3 gap-3">
              <Input
                label="City *"
                placeholder="Austin"
                {...register('city')}
                error={errors.city?.message}
              />
              <Input
                label="State *"
                placeholder="TX"
                {...register('state')}
                error={errors.state?.message}
              />
              <Input
                label="ZIP Code *"
                placeholder="78701"
                {...register('zip')}
                error={errors.zip?.message}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <Select
            label="Account Status *"
            {...register('status')}
            options={[
              { value: 'active', label: 'Active Account' },
              { value: 'inactive', label: 'Inactive / Archived' },
            ]}
          />
        </div>

        <Textarea
          label="Service Notes & Gate Instructions"
          placeholder="e.g. Key code, preferred technician, access restrictions..."
          rows={3}
          {...register('notes')}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {isEditing ? 'Save Changes' : 'Create Customer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};


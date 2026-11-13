import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Technician, TechnicianStatus } from '@/types';
import { useData } from '@/contexts/DataContext';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

const technicianSchema = z.object({
  name: z.string().min(2, 'Technician name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(7, 'Please enter a valid phone number'),
  status: z.enum(['Available', 'Busy', 'Unavailable']),
});

type TechnicianFormData = z.infer<typeof technicianSchema>;

export interface TechnicianFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Technician, 'id' | 'createdAt' | 'activeJobsCount' | 'completedJobsCount'>) => void;
  technician?: Technician | null;
}

export const TechnicianFormModal: React.FC<TechnicianFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  technician,
}) => {
  const { categories } = useData();
  const isEditing = Boolean(technician);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TechnicianFormData>({
    resolver: zodResolver(technicianSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      status: 'Available',
    },
  });

  useEffect(() => {
    if (technician) {
      reset({
        name: technician.name,
        email: technician.email,
        phone: technician.phone,
        status: technician.status,
      });
      setSelectedSkills(technician.skills || []);
    } else {
      reset({
        name: '',
        email: '',
        phone: '',
        status: 'Available',
      });
      setSelectedSkills([categories[0]?.name || 'HVAC Diagnostics & Repair']);
    }
  }, [technician, reset, isOpen, categories]);

  const toggleSkill = (skillName: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skillName) ? prev.filter((s) => s !== skillName) : [...prev, skillName]
    );
  };

  const handleFormSubmit = (data: TechnicianFormData) => {
    onSubmit({
      name: data.name,
      email: data.email,
      phone: data.phone,
      status: data.status as TechnicianStatus,
      skills: selectedSkills.length > 0 ? selectedSkills : ['General Maintenance'],
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Technician: ${technician?.name}` : 'Add New Field Technician'}
      description="Register field technician contact info, skills, and current dispatch status"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          label="Full Name *"
          placeholder="e.g. Marcus Vance"
          {...register('name')}
          error={errors.name?.message}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Email Address *"
            type="email"
            placeholder="tech@example.com"
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

        <Select
          label="Availability Status *"
          {...register('status')}
        >
          <option value="Available">Available (Ready for Dispatch)</option>
          <option value="Busy">Busy (Currently on Job)</option>
          <option value="Unavailable">Unavailable (Off-Shift / Leave)</option>
        </Select>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
            Skillsets & Certifications
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const isSelected = selectedSkills.includes(cat.name);
              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => toggleSkill(cat.name)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                    isSelected
                      ? 'bg-sky-50 text-sky-700 border-sky-300 font-bold'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {isSelected ? '✓ ' : '+ '}
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isSubmitting}>
            {isEditing ? 'Save Changes' : 'Add Technician'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};


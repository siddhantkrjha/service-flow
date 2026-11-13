import React, { useState, useMemo } from 'react';
import { Technician } from '@/types';
import { useData } from '@/contexts/DataContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { TechnicianFormModal } from './TechnicianFormModal';
import { TechnicianDetailsModal } from './TechnicianDetailsModal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { getTechnicianStatusColor } from '@/lib/utils';
import { Search, Plus, UserCheck, Edit, Trash2, Mail, Phone, Wrench, Eye } from 'lucide-react';

export const TechnicianList: React.FC = () => {
  const { technicians, workOrders, addTechnician, updateTechnician, deleteTechnician } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTech, setSelectedTech] = useState<Technician | null>(null);
  const [detailsTech, setDetailsTech] = useState<Technician | null>(null);
  const [techToDelete, setTechToDelete] = useState<Technician | null>(null);

  const filteredTechnicians = useMemo(() => {
    return technicians.filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.phone.includes(searchTerm) ||
        t.skills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = statusFilter === 'all' || t.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [technicians, searchTerm, statusFilter]);

  const handleEdit = (t: Technician) => {
    setSelectedTech(t);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedTech(null);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data: Omit<Technician, 'id' | 'createdAt' | 'activeJobsCount' | 'completedJobsCount'>) => {
    if (selectedTech) {
      updateTechnician(selectedTech.id, data);
    } else {
      addTechnician(data);
    }
  };

  return (
    <div className="space-y-4">
      {/* Control bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2 max-w-md">
          <Input
            placeholder="Search technicians by name, skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 text-xs font-semibold text-slate-600">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                statusFilter === 'all' ? 'bg-slate-900 text-white' : 'hover:text-slate-900'
              }`}
            >
              All ({technicians.length})
            </button>
            <button
              onClick={() => setStatusFilter('Available')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                statusFilter === 'Available' ? 'bg-slate-900 text-white' : 'hover:text-slate-900'
              }`}
            >
              Available ({technicians.filter((t) => t.status === 'Available').length})
            </button>
            <button
              onClick={() => setStatusFilter('Busy')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                statusFilter === 'Busy' ? 'bg-slate-900 text-white' : 'hover:text-slate-900'
              }`}
            >
              Busy ({technicians.filter((t) => t.status === 'Busy').length})
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={handleCreate}
          >
            Add Technician
          </Button>
        </div>
      </div>

      {/* Technicians Grid / List */}
      {filteredTechnicians.length === 0 ? (
        <Card>
          <EmptyState
            icon={UserCheck}
            title="No technicians found"
            description={
              searchTerm || statusFilter !== 'all'
                ? 'No technicians match your search or filter.'
                : 'Add field technicians to start dispatching jobs.'
            }
            actionText="Add Field Technician"
            onAction={handleCreate}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTechnicians.map((t) => {
            const statusStyle = getTechnicianStatusColor(t.status);
            const activeCount = workOrders.filter(
              (w) => w.technicianId === t.id && (w.status === 'In Progress' || w.status === 'Assigned')
            ).length;

            return (
              <Card
                key={t.id}
                className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => setDetailsTech(t)}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-900 text-sky-400 font-bold text-sm flex items-center justify-center border border-slate-700 shadow-xs">
                        {t.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                          {t.name}
                        </h4>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border mt-1 ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                          {t.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleEdit(t)}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                        title="Edit Technician"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setTechToDelete(t)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                        title="Remove Technician"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{t.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{t.phone}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                      Service Specialties
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {t.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>
                    Active Jobs: <strong className="text-slate-900">{activeCount}</strong>
                  </span>
                  <span>
                    Completed: <strong className="text-slate-900">{(t.completedJobsCount || 0)}</strong>
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Form Modal */}
      <TechnicianFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        technician={selectedTech}
      />

      {/* Details Modal */}
      <TechnicianDetailsModal
        isOpen={Boolean(detailsTech)}
        onClose={() => setDetailsTech(null)}
        technician={detailsTech}
        onEdit={handleEdit}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(techToDelete)}
        onClose={() => setTechToDelete(null)}
        onConfirm={() => {
          if (techToDelete) deleteTechnician(techToDelete.id);
        }}
        title="Remove Technician?"
        message={`Are you sure you want to remove ${techToDelete?.name} from your technician roster?`}
        confirmText="Remove Technician"
      />
    </div>
  );
};


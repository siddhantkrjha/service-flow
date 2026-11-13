import React, { useState } from 'react';
import { Technician } from '@/types';
import { useData } from '@/contexts/DataContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { formatDate, getTechnicianStatusColor, getWorkOrderStatusColor } from '@/lib/utils';
import { Mail, Phone, Wrench, Edit, Trash2, CheckCircle2, Clock } from 'lucide-react';

export interface TechnicianDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  technician: Technician | null;
  onEdit: (technician: Technician) => void;
}

export const TechnicianDetailsModal: React.FC<TechnicianDetailsModalProps> = ({
  isOpen,
  onClose,
  technician,
  onEdit,
}) => {
  const { workOrders, deleteTechnician } = useData();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!technician) return null;

  const statusStyle = getTechnicianStatusColor(technician.status);
  const techJobs = workOrders.filter((w) => w.technicianId === technician.id);
  const activeJobs = techJobs.filter((w) => w.status === 'In Progress' || w.status === 'Assigned');
  const completedJobs = techJobs.filter((w) => w.status === 'Completed');

  const handleDelete = () => {
    deleteTechnician(technician.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} maxWidth="xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-900 text-sky-400 font-bold text-base flex items-center justify-center border border-slate-700 shadow-sm">
                {technician.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">{technician.name}</h3>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`} />
                    {technician.status}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Joined {formatDate(technician.createdAt, 'MMMM yyyy')}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Edit className="w-3.5 h-3.5" />}
                onClick={() => {
                  onClose();
                  onEdit(technician);
                }}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                onClick={() => setShowDeleteConfirm(true)}
              >
                Remove
              </Button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div>
              <span className="text-[11px] text-slate-500 font-medium">Active Dispatches</span>
              <div className="text-lg font-bold text-amber-600">{activeJobs.length}</div>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 font-medium">Completed Jobs</span>
              <div className="text-lg font-bold text-emerald-600">
                {completedJobs.length + (technician.completedJobsCount || 0)}
              </div>
            </div>
          </div>

          {/* Contact & Skills */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Direct Contact
              </span>
              <div className="flex items-center gap-2 text-sm text-slate-800">
                <Mail className="w-4 h-4 text-slate-400" />
                <a href={`mailto:${technician.email}`} className="hover:text-sky-600">
                  {technician.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-800">
                <Phone className="w-4 h-4 text-slate-400" />
                <a href={`tel:${technician.phone}`} className="hover:text-sky-600">
                  {technician.phone}
                </a>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-100 bg-white">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Certified Service Categories
              </span>
              <div className="flex flex-wrap gap-2 mt-2">
                {technician.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-md bg-sky-50 text-sky-800 border border-sky-200 text-xs font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Assigned Orders */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Assigned Work Orders ({techJobs.length})
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {techJobs.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                    No work orders assigned to this technician
                  </div>
                ) : (
                  techJobs.map((wo) => {
                    const statusStyle = getWorkOrderStatusColor(wo.status);
                    return (
                      <div
                        key={wo.id}
                        className="p-2.5 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-semibold text-slate-900">{wo.orderNumber}: </span>
                          <span className="text-slate-700">{wo.title}</span>
                          <div className="text-[10px] text-slate-400">
                            {formatDate(wo.scheduledDate)}
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                        >
                          {wo.status}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Remove Technician?"
        message={`Are you sure you want to remove ${technician.name} from the crew?`}
        confirmText="Remove Technician"
      />
    </>
  );
};


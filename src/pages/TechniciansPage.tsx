import React from 'react';
import { TechnicianList } from '@/components/technicians/TechnicianList';

export const TechniciansPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Field Service Technicians</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage technician profiles, skill certifications, dispatch availability, and job track records
        </p>
      </div>

      <TechnicianList />
    </div>
  );
};


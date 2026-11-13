import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { Sparkles, RotateCcw, Info } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

export const DemoBanner: React.FC = () => {
  const { resetDemoData } = useData();
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <div className="bg-gradient-to-r from-sky-900 via-slate-900 to-slate-950 text-white text-xs px-4 py-1.5 flex items-center justify-between shadow-inner">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 font-semibold text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800">
            <Sparkles className="w-3.5 h-3.5" /> Demo Mode Active
          </span>
          <span className="hidden sm:inline text-slate-300">
            Simulated live environment. Changes persist in your browser. No Supabase credentials required.
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-0.5 rounded transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={resetDemoData}
        title="Reset All Demo Data?"
        message="This will restore all customers, bookings, work orders, technicians, and invoices back to their original sample seed state."
        confirmText="Reset Everything"
      />
    </>
  );
};


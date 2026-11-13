import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import { Menu, Search, Plus, User, ShieldCheck, HelpCircle } from 'lucide-react';
import { NotificationsDropdown } from './NotificationsDropdown';
import { Button } from '@/components/ui/Button';

export interface TopNavProps {
  onOpenMobileSidebar: () => void;
  onOpenSearch: () => void;
  onPrimaryAction?: () => void;
  primaryActionLabel?: string;
}

export const TopNav: React.FC<TopNavProps> = ({
  onOpenMobileSidebar,
  onOpenSearch,
  onPrimaryAction,
  primaryActionLabel,
}) => {
  const location = useLocation();
  const { businessProfile } = useData();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  // Derive title from pathname
  const getPageInfo = () => {
    const path = location.pathname;
    if (path === '/' || path === '/overview') {
      return { title: 'Dashboard Overview', breadcrumb: 'Service Flow / Overview' };
    }
    if (path.startsWith('/bookings')) {
      return { title: 'Bookings & Schedule', breadcrumb: 'Service Flow / Bookings' };
    }
    if (path.startsWith('/work-orders')) {
      return { title: 'Work Orders & Dispatch', breadcrumb: 'Service Flow / Work Orders' };
    }
    if (path.startsWith('/customers')) {
      return { title: 'Customer Directory', breadcrumb: 'Service Flow / Customers' };
    }
    if (path.startsWith('/technicians')) {
      return { title: 'Technicians & Field Crew', breadcrumb: 'Service Flow / Technicians' };
    }
    if (path.startsWith('/invoices')) {
      return { title: 'Invoices & Billing', breadcrumb: 'Service Flow / Invoices' };
    }
    if (path.startsWith('/reports')) {
      return { title: 'Analytics & Reports', breadcrumb: 'Service Flow / Reports' };
    }
    if (path.startsWith('/settings')) {
      return { title: 'Business Settings', breadcrumb: 'Service Flow / Settings' };
    }
    return { title: 'Service Flow', breadcrumb: 'Service Flow' };
  };

  const { title, breadcrumb } = getPageInfo();

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 md:px-6 backdrop-blur">
      {/* Left: Mobile hamburger & Page Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="p-2 -ml-2 rounded-lg text-slate-600 hover:text-slate-900 md:hidden hover:bg-slate-100 transition-colors"
          title="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <div className="hidden sm:block text-[11px] font-medium text-slate-400">
            {breadcrumb}
          </div>
          <h1 className="text-lg font-bold text-slate-900 leading-tight">
            {title}
          </h1>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Search trigger */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200/70 border border-slate-200 rounded-lg transition-colors"
        >
          <Search className="w-4 h-4 text-slate-400" />
          <span className="hidden sm:inline">Search records...</span>
          <kbd className="hidden sm:inline-block font-sans text-[10px] bg-white text-slate-500 px-1.5 py-0.5 rounded border border-slate-200 font-semibold shadow-2xs">
            ⌘K
          </kbd>
        </button>

        {/* Notifications */}
        <NotificationsDropdown />

        {/* Contextual Action Button if provided */}
        {onPrimaryAction && primaryActionLabel && (
          <Button
            size="sm"
            variant="primary"
            onClick={onPrimaryAction}
            leftIcon={<Plus className="w-4 h-4" />}
            className="hidden sm:inline-flex"
          >
            {primaryActionLabel}
          </Button>
        )}

        {/* Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-sky-500/20 transition-all"
            title="User Profile"
          >
            <div className="w-8 h-8 rounded-full bg-slate-900 text-sky-400 border border-slate-700 flex items-center justify-center font-bold text-xs shadow-sm">
              AD
            </div>
          </button>

          {profileMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-dropdown border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
              onMouseLeave={() => setProfileMenuOpen(false)}
            >
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">Admin User</p>
                <p className="text-[11px] text-slate-500 truncate">{businessProfile.email}</p>
                <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                  <ShieldCheck className="w-3 h-3" /> Business Owner
                </div>
              </div>

              <Link
                to="/settings"
                onClick={() => setProfileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-slate-400" /> Business Profile & Settings
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" /> Open-Source Docs
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};


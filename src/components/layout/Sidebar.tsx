import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useData } from '@/contexts/DataContext';
import {
  LayoutDashboard,
  Calendar,
  Wrench,
  Users,
  UserCheck,
  FileText,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const { businessProfile, metrics } = useData();
  const location = useLocation();

  const navItems = [
    {
      label: 'Overview',
      to: '/',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      label: 'Bookings',
      to: '/bookings',
      icon: Calendar,
      badge: metrics.upcomingBookingsCount > 0 ? metrics.upcomingBookingsCount : null,
      badgeColor: 'bg-sky-500 text-white',
    },
    {
      label: 'Work Orders',
      to: '/work-orders',
      icon: Wrench,
      badge: metrics.activeJobsCount > 0 ? metrics.activeJobsCount : null,
      badgeColor: 'bg-amber-500 text-slate-900 font-bold',
    },
    {
      label: 'Customers',
      to: '/customers',
      icon: Users,
      badge: null,
    },
    {
      label: 'Technicians',
      to: '/technicians',
      icon: UserCheck,
      badge: null,
    },
    {
      label: 'Invoices',
      to: '/invoices',
      icon: FileText,
      badge: metrics.pendingInvoicesCount > 0 ? metrics.pendingInvoicesCount : null,
      badgeColor: 'bg-rose-500 text-white',
    },
    {
      label: 'Reports',
      to: '/reports',
      icon: BarChart3,
      badge: null,
    },
    {
      label: 'Settings',
      to: '/settings',
      icon: Settings,
      badge: null,
    },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between bg-slate-900 text-slate-300">
      {/* Brand Header */}
      <div>
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-sky-400 flex items-center justify-center text-white shrink-0 shadow-md shadow-sky-900/30">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            {!collapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="font-bold text-white text-base tracking-tight leading-tight">
                  Service Flow
                </span>
                <span className="text-[11px] text-sky-400 font-medium truncate">
                  {businessProfile.name}
                </span>
              </div>
            )}
          </div>
          {/* Collapse toggle (desktop only) */}
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex items-center justify-center w-6 h-6 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.to === '/'
                ? location.pathname === '/' || location.pathname === '/overview'
                : location.pathname.startsWith(item.to);

            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                className={cn(
                  'group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative',
                  isActive
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80',
                  collapsed && 'justify-center px-2'
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon
                  className={cn(
                    'w-5 h-5 shrink-0 transition-colors',
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                  )}
                />
                {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                {!collapsed && item.badge !== null && (
                  <span
                    className={cn(
                      'text-xs px-2 py-0.5 rounded-full font-semibold',
                      item.badgeColor || 'bg-slate-800 text-slate-300'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
                {collapsed && item.badge !== null && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-sky-400" />
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Business Workspace Footer */}
      <div className="p-3 border-t border-slate-800">
        {!collapsed ? (
          <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/50">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-200 uppercase">
              {businessProfile.name.slice(0, 2)}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="text-xs font-semibold text-white truncate">{businessProfile.name}</div>
              <div className="text-[10px] text-slate-400 truncate">{businessProfile.email}</div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-200 uppercase">
              {businessProfile.name.slice(0, 2)}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden md:block shrink-0 transition-all duration-200 z-30 h-screen sticky top-0',
          collapsed ? 'w-18' : 'w-64'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 md:hidden transition-transform duration-200 ease-in-out',
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </div>
    </>
  );
};


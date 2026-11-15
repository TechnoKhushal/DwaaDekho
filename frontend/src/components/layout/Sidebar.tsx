import React from 'react';
import { Pill } from 'lucide-react';
import { BuyerNavigation } from './Navigation';

export function Sidebar({
  role = 'buyer',
  className = '',
  children,
}: {
  role?: 'buyer' | 'pharmacy' | 'doctor' | 'admin';
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <aside className={`w-full lg:w-64 xl:w-72 bg-surface border-r border-border flex flex-col h-full shrink-0 ${className}`}>
      {/* Brand */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white shrink-0">
          <Pill className="w-4 h-4" />
        </div>
        <span className="font-bold text-sm text-text-primary hidden lg:block">DwaaDekho</span>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {role === 'buyer' && <BuyerNavigation />}
      </div>

      {/* User Profile */}
      <div className="border-t border-border p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
            <Pill className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">Ram Sharma</p>
            <p className="text-[11px] text-text-secondary truncate">Patient Member</p>
          </div>
          <button className="p-1 rounded-md text-text-secondary hover:bg-elevated hover:text-text-primary transition-colors">
            Logout
          </button>
        </div>
      </div>

      {children}
    </aside>
  );
}
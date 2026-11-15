import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';

export interface DashboardLayoutProps {
  className?: string;
  children: React.ReactNode;
}

export function DashboardLayout({
  className = '',
  children,
}: DashboardLayoutProps) {
  return (
    <div className={cn('flex flex-col h-screen bg-background overflow-hidden', className)}>
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
import React from 'react';
import Link from 'next/link';
import { Pill, Sparkles, ShoppingBag, User, Stethoscope, Building2, ShieldCheck, Search, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header({
  role = 'buyer',
  unreadNotifications = 0,
  cartCount = 0,
  onCartClick,
}: {
  role?: 'buyer' | 'pharmacy' | 'doctor' | 'admin';
  unreadNotifications?: number;
  cartCount?: number;
  onCartClick?: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-border shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-lg text-text-primary tracking-tight block leading-tight">DwaaDekho</span>
            <span className="text-[10px] text-brand-600 font-semibold tracking-wider uppercase block">Smart Medicine</span>
          </div>
        </Link>

        {/* Global Navigation Role Switcher Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-text-secondary">
          <Link href="/buyer" className={`px-3 py-1.5 rounded-lg transition-colors ${role === 'buyer' ? 'bg-brand-50 text-brand-700 font-semibold' : 'hover:bg-elevated text-text-secondary'}`}>
            Patient Portal
          </Link>
          <Link href="/pharmacy" className={`px-3 py-1.5 rounded-lg transition-colors ${role === 'pharmacy' ? 'bg-brand-50 text-brand-700 font-semibold' : 'hover:bg-elevated text-text-secondary'}`}>
            Chemist Desk
          </Link>
          <Link href="/doctor" className={`px-3 py-1.5 rounded-lg transition-colors ${role === 'doctor' ? 'bg-brand-50 text-brand-700 font-semibold' : 'hover:bg-elevated text-text-secondary'}`}>
            Doctor Portal
          </Link>
          <Link href="/admin" className={`px-3 py-1.5 rounded-lg transition-colors ${role === 'admin' ? 'bg-brand-50 text-brand-700 font-semibold' : 'hover:bg-elevated text-text-secondary'}`}>
            Admin Panel
          </Link>
        </nav>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          {role === 'buyer' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCartClick}
              className="relative hover:bg-brand-50 hover:text-brand-600"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          )}

          <Button variant="ghost" size="sm" className="relative hover:bg-brand-50 hover:text-brand-600">
            <Bell className="w-5 h-5" />
            {unreadNotifications > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            )}
          </Button>

          <div className="h-6 w-[1px] bg-border mx-1" />

          <Link href="/login">
            <Button size="sm" className="bg-brand-600 hover:bg-brand-700 text-white gap-1.5 font-medium shadow-xs">
              <User className="w-4 h-4" /> Account
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
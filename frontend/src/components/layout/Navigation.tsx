import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Home, Pill, UserPlus, Handshake, ClipboardList, Calendar, FileText, ClipboardCheck, HeartPulse, Settings, ShieldCheck } from 'lucide-react';

type Role = 'buyer' | 'pharmacy' | 'doctor' | 'admin';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  excludeRoles?: Role[];
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/buyer',
    icon: Home,
    excludeRoles: ['pharmacy', 'doctor', 'admin'],
  },
  {
    label: 'Search Medicines',
    href: '/buyer/medicines',
    icon: Search,
    excludeRoles: ['admin', 'pharmacy', 'doctor'],
  },
  {
    label: 'Find Pharmacies',
    href: '/buyer/pharmacy',
    icon: Pill,
    badge: 'Soon',
    excludeRoles: ['admin', 'pharmacy', 'doctor'],
  },
  {
    label: 'Prescriptions',
    href: '/buyer/prescription',
    icon: FileText,
    excludeRoles: ['admin', 'pharmacy'],
  },
  {
    label: 'My Requests',
    href: '/buyer/requests',
    icon: Handshake,
    badge: '4',
    excludeRoles: ['admin', 'pharmacy', 'doctor'],
  },
  {
    label: 'My Reservations',
    href: '/buyer/reservations',
    icon: ClipboardCheck,
    badge: '2',
    excludeRoles: ['admin', 'pharmacy', 'doctor'],
  },
  {
    label: 'Orders',
    href: '/buyer/orders',
    icon: ClipboardList,
    badge: '12',
    excludeRoles: ['admin', 'pharmacy', 'doctor'],
  },
  {
    label: 'Reminders',
    href: '/buyer/reminder',
    icon: HeartPulse,
    excludeRoles: ['admin', 'pharmacy', 'doctor'],
  },
  {
    label: 'Consult Doctor',
    href: '/buyer/chat',
    icon: UserPlus,
    excludeRoles: ['admin', 'pharmacy'],
  },
  {
    label: 'Safety',
    href: '/buyer/safety',
    icon: ShieldCheck,
    excludeRoles: ['admin', 'pharmacy', 'doctor'],
  },
  {
    label: 'Profile',
    href: '/buyer/profile',
    icon: Settings,
    excludeRoles: ['admin', 'pharmacy', 'doctor'],
  },
];

export function BuyerNavigation({
  className = '',
}: {
  className?: string;
}) {
  const pathname = usePathname();
  const currentRole: Role = 'buyer';

  return (
    <nav className={`flex flex-col gap-1 ${className}`}>
      <p className="px-3 py-2 text-[10px] font-bold text-brand-600 uppercase tracking-wider">Main Menu</p>
      {navItems
        .filter(
          (item) =>
            !item.excludeRoles?.includes(currentRole) ||
            !item.excludeRoles?.length
        )
        .map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-brand-50 text-brand-700 font-semibold'
                  : 'text-text-secondary hover:bg-elevated hover:text-text-primary'
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
    </nav>
  );
}
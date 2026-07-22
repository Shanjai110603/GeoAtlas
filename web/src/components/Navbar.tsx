'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, Search, GitCompare, ShieldCheck, PlusCircle, LogIn, LogOut, User, Globe, Palette, Trophy } from 'lucide-react';
import { useSession } from '@/hooks/useSession';
import { NotificationBell } from '@/components/notifications/NotificationBell';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, isAuthenticated, isModerator, logout } = useSession();

  const navItems = [
    { label: 'Search', href: '/search', icon: Search },
    { label: 'Compare', href: '/compare', icon: GitCompare },
    { label: 'True Size', href: '/true-size', icon: Globe },
    { label: 'Map Creator', href: '/map-creator', icon: Palette },
    { label: 'Leaderboard', href: '/leaderboard', icon: Trophy },
    { label: 'Contribute', href: '/contribute', icon: PlusCircle },
  ];

  if (isModerator) {
    navItems.push({ label: 'Moderate', href: '/moderate', icon: ShieldCheck });
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-blue-500 font-bold text-xl tracking-tight">
          <Compass className="h-6 w-6 text-blue-400 animate-pulse" />
          <span>GeoAtlas</span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-300 hover:text-slate-100 hover:bg-slate-900'
                }`}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {/* Notification Bell Feed */}
          <NotificationBell />

          {isAuthenticated && user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="text-xs font-medium text-slate-200 flex items-center gap-1 bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-800 transition"
              >
                <User size={14} className="text-blue-400" />
                <span className="hidden md:inline">{user.display_name}</span>
              </Link>
              <button
                onClick={() => logout()}
                className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-900 rounded-xl transition-all"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
            >
              <LogIn size={16} />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

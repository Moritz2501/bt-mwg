'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Clock, 
  Calendar, 
  Music, 
  Inbox, 
  User, 
  Settings, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Stempeln', href: '/stempeln', icon: Clock },
  { name: 'Kalender', href: '/kalender', icon: Calendar },
  { name: 'Events', href: '/events', icon: Music },
  { name: 'Anfragen', href: '/anfragen', icon: Inbox },
  { name: 'Profil', href: '/profil', icon: User },
];

export default function Sidebar({ userRole }: { userRole: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen fixed left-0 top-0 z-50">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
          BT Events
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-indigo-600/10 text-indigo-400 border border-indigo-600/20" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
              )}
            >
              <item.icon size={20} className={cn(isActive ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-100")} />
              <span className="font-medium">{item.name}</span>
              {isActive && <ChevronRight size={16} className="ml-auto" />}
            </Link>
          );
        })}

        {userRole === 'admin' && (
          <Link
            href="/admin"
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 mt-8 group",
              pathname.startsWith('/admin')
                ? "bg-purple-600/10 text-purple-400 border border-purple-600/20"
                : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
            )}
          >
            <Settings size={20} className={cn(pathname.startsWith('/admin') ? "text-purple-400" : "text-slate-400 group-hover:text-slate-100")} />
            <span className="font-medium">Admin</span>
          </Link>
        )}
      </nav>

      <div className="p-4 mt-auto border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="font-medium">Abmelden</span>
        </button>
      </div>
    </div>
  );
}

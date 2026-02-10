import Sidebar from './Sidebar';
import { getAuthUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { User as UserIcon, Bell } from 'lucide-react';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar userRole={user.role} />
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-slate-400 text-sm font-medium">Willkommen zurück,</h2>
            <h1 className="text-2xl font-bold text-slate-100">{user.username}</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-100 transition-all">
              <Bell size={20} />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-100">{user.username}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">{user.role}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <UserIcon size={20} className="text-white" />
              </div>
            </div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}

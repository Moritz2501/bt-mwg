import DashboardLayout from '@/components/DashboardLayout';
import AdminGate from './AdminGate';
import { prisma } from '@/lib/prisma';
import { Users, Shield, UserPlus, Trash2, Edit } from 'lucide-react';
import { format } from 'date-fns';

export default async function AdminPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <DashboardLayout>
      <AdminGate>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="text-purple-400" /> Admin-Verwaltung
          </h1>
          <button className="btn-secondary">
            <UserPlus size={18} /> Benutzer anlegen
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <h3 className="text-slate-400 text-sm mb-1">Gesamtbenutzer</h3>
            <p className="text-3xl font-bold">{users.length}</p>
          </div>
          <div className="card">
            <h3 className="text-slate-400 text-sm mb-1">Admins</h3>
            <p className="text-3xl font-bold text-purple-400">{users.filter(u => u.role === 'admin').length}</p>
          </div>
          <div className="card">
            <h3 className="text-slate-400 text-sm mb-1">Aktive Nutzer</h3>
            <p className="text-3xl font-bold text-green-400">{users.filter(u => u.active).length}</p>
          </div>
        </div>

        <div className="card p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50">
            <h2 className="font-bold">Benutzerverwaltung</h2>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 text-sm border-b border-slate-800">
                <th className="px-6 py-4 font-medium">Username</th>
                <th className="px-6 py-4 font-medium">Rolle</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Erstellt am</th>
                <th className="px-6 py-4 font-medium text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {users.map((user) => (
                <tr key={user.id} className="text-sm">
                  <td className="px-6 py-4 font-medium">{user.username}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${user.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-slate-700 text-slate-300'}`}>
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${user.active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      {user.active ? 'Aktiv' : 'Deaktiviert'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {format(user.createdAt, 'dd.MM.yyyy')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-all">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminGate>
    </DashboardLayout>
  );
}

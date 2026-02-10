import DashboardLayout from '@/components/DashboardLayout';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import Link from 'next/link';
import { Inbox, Filter, Search } from 'lucide-react';

export default async function AnfragenPage() {
  const requests = await prisma.bookingRequest.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'neu': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'in Prüfung': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'angenommen': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'abgelehnt': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Inbox className="text-indigo-400" /> Buchungsanfragen
        </h1>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input type="text" placeholder="Suchen..." className="input pl-10 w-64 h-10" />
          </div>
          <button className="btn-outline h-10">
            <Filter size={18} /> Filter
          </button>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-900/50 border-b border-slate-800 text-slate-400 text-sm">
              <th className="px-6 py-4 font-medium uppercase tracking-wider">Datum</th>
              <th className="px-6 py-4 font-medium uppercase tracking-wider">Event / Kunde</th>
              <th className="px-6 py-4 font-medium uppercase tracking-wider">Zeitraum</th>
              <th className="px-6 py-4 font-medium uppercase tracking-wider">Ort</th>
              <th className="px-6 py-4 font-medium uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 font-medium uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {requests.map((req) => (
              <tr key={req.id} className="hover:bg-slate-800/30 transition-all group">
                <td className="px-6 py-4 text-sm text-slate-500">
                  {format(req.createdAt, 'dd.MM.yyyy')}
                </td>
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-100">{req.eventTitle}</p>
                  <p className="text-xs text-slate-400">{req.requesterName}</p>
                </td>
                <td className="px-6 py-4 text-sm">
                  {format(req.start, 'dd.MM. HH:mm')} - {format(req.end, 'HH:mm')}
                </td>
                <td className="px-6 py-4 text-sm text-slate-400">
                  {req.location}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(req.status)}`}>
                    {req.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/anfragen/${req.id}`} className="text-indigo-400 hover:text-indigo-300 font-medium text-sm transition-all opacity-0 group-hover:opacity-100">
                    Details anzeigen →
                  </Link>
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500 italic">
                  Keine Anfragen vorhanden.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

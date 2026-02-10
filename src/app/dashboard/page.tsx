import DashboardLayout from '@/components/DashboardLayout';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth.server';
import { 
  Calendar, 
  Clock, 
  Music, 
  ArrowUpRight, 
  CheckCircle2, 
  Inbox 
} from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import Link from 'next/link';

export default async function DashboardPage() {
  const user = await getAuthUser();
  const now = new Date();

  // Fetch some stats
  const upcomingEvents = await prisma.event.findMany({
    where: { start: { gte: now } },
    take: 3,
    orderBy: { start: 'asc' },
  });

  const recentRequests = await prisma.bookingRequest.findMany({
    where: { status: 'neu' },
    take: 3,
    orderBy: { createdAt: 'desc' },
  });

  const todayEntries = await prisma.timeEntry.findMany({
    where: {
      userId: user?.id,
      start: {
        gte: new Date(now.setHours(0, 0, 0, 0)),
      }
    }
  });

  const totalMinutesToday = todayEntries.reduce((acc, curr) => {
    if (curr.duration) return acc + curr.duration / 60;
    return acc;
  }, 0);

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card border-l-4 border-indigo-500">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
              <Clock size={24} />
            </div>
            <span className="text-xs font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full">+12%</span>
          </div>
          <h3 className="text-slate-400 text-sm font-medium mb-1">Stunden heute</h3>
          <p className="text-2xl font-bold">{(totalMinutesToday / 60).toFixed(1)} h</p>
        </div>

        <div className="card border-l-4 border-purple-500">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
              <Calendar size={24} />
            </div>
          </div>
          <h3 className="text-slate-400 text-sm font-medium mb-1">Anstehende Events</h3>
          <p className="text-2xl font-bold">{upcomingEvents.length}</p>
        </div>

        <div className="card border-l-4 border-rose-500">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400">
              <Inbox size={24} />
            </div>
          </div>
          <h3 className="text-slate-400 text-sm font-medium mb-1">Neue Anfragen</h3>
          <p className="text-2xl font-bold">{recentRequests.length}</p>
        </div>

        <div className="card border-l-4 border-emerald-500">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
              <CheckCircle2 size={24} />
            </div>
          </div>
          <h3 className="text-slate-400 text-sm font-medium mb-1">Abgeschlossen (Monat)</h3>
          <p className="text-2xl font-bold">8</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Music className="text-indigo-400" /> Nächste Events
              </h2>
              <Link href="/events" className="text-sm text-indigo-400 hover:text-indigo-300 transition-all flex items-center gap-1">
                Alle ansehen <ArrowUpRight size={14} />
              </Link>
            </div>
            <div className="space-y-4">
              {upcomingEvents.length > 0 ? upcomingEvents.map(event => (
                <div key={event.id} className="card p-4 flex items-center gap-6 hover:border-slate-700 transition-all cursor-pointer">
                  <div className="w-16 h-16 bg-slate-800 rounded-xl flex flex-col items-center justify-center border border-slate-700">
                    <span className="text-xs font-bold text-indigo-400 uppercase">{format(event.start, 'MMM', { locale: de })}</span>
                    <span className="text-xl font-bold">{format(event.start, 'dd')}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg">{event.name}</h4>
                    <p className="text-slate-400 text-sm">{event.venue}</p>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 rounded-full text-xs font-bold uppercase tracking-wider">
                      {event.status}
                    </span>
                    <p className="text-xs text-slate-500 mt-2">{format(event.start, 'HH:mm')} Uhr</p>
                  </div>
                </div>
              )) : (
                <p className="text-slate-500 italic py-8 text-center border-2 border-dashed border-slate-800 rounded-2xl">Keine anstehenden Events gefunden.</p>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Inbox className="text-purple-400" /> Neue Anfragen
              </h2>
            </div>
            <div className="space-y-4">
              {recentRequests.map(req => (
                <div key={req.id} className="card p-4 hover:border-slate-700 transition-all">
                  <h4 className="font-bold mb-1">{req.eventTitle}</h4>
                  <p className="text-slate-400 text-xs mb-3">Von: {req.requesterName}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-500">{format(req.createdAt, 'dd.MM.yyyy')}</span>
                    <Link href={`/anfragen/${req.id}`} className="text-xs bg-slate-800 hover:bg-indigo-600 px-3 py-1 rounded-full transition-all">
                      Details
                    </Link>
                  </div>
                </div>
              ))}
              <Link href="/anfragen" className="block text-center text-sm text-slate-500 hover:text-indigo-400 transition-all mt-4">
                Alle Anfragen anzeigen
              </Link>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}

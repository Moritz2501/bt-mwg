import DashboardLayout from '@/components/DashboardLayout';
import { prisma } from '@/lib/prisma';
import { Music, Plus, Calendar, MapPin, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import Link from 'next/link';

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { start: 'asc' },
    include: {
      _count: {
        select: { checklist: true, equipment: true }
      }
    }
  });

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Music className="text-indigo-400" /> Event-Management
        </h1>
        <button className="btn-primary">
          <Plus size={18} /> Event anlegen
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="card group hover:border-indigo-500/50 transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                event.status === 'aktiv' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                event.status === 'geplant' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 
                'bg-slate-500/10 text-slate-400 border-slate-500/20'
              }`}>
                {event.status}
              </span>
              <div className="flex gap-2">
                <div className="text-right">
                  <p className="text-sm font-bold">{format(event.start, 'dd. MMMM', { locale: de })}</p>
                  <p className="text-xs text-slate-500">{format(event.start, 'yyyy')}</p>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-2 group-hover:text-indigo-400 transition-all">{event.name}</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <MapPin size={16} className="text-slate-600" />
                {event.venue}
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Calendar size={16} className="text-slate-600" />
                {format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')} Uhr
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
              <div className="text-center p-2 bg-slate-800/50 rounded-xl">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Checklist</p>
                <p className="text-lg font-bold">{event._count.checklist}</p>
              </div>
              <div className="text-center p-2 bg-slate-800/50 rounded-xl">
                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Equipment</p>
                <p className="text-lg font-bold">{event._count.equipment}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Link href={`/events/${event.id}`} className="flex items-center gap-1 text-sm font-bold text-indigo-400">
                Verwalten <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        ))}

        {events.length === 0 && (
          <div className="col-span-full py-20 text-center card border-2 border-dashed border-slate-800 bg-transparent">
            <Music size={48} className="mx-auto text-slate-700 mb-4" />
            <h3 className="text-xl font-bold text-slate-400">Keine Events geplant</h3>
            <p className="text-slate-500 mt-2">Legen Sie Ihr erstes Event an, um zu starten.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

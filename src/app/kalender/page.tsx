import DashboardLayout from '@/components/DashboardLayout';
import { prisma } from '@/lib/prisma';
import { Calendar as CalendarIcon, Filter, Plus, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

export default async function KalenderPage() {
  const entries = await prisma.calendarEntry.findMany({
    orderBy: { start: 'asc' },
  });

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <CalendarIcon className="text-indigo-400" /> Kalender
        </h1>
        <div className="flex gap-3">
          <button className="btn-outline">
            <Filter size={18} /> Filter
          </button>
          <button className="btn-primary">
            <Plus size={18} /> Termin
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
        <div className="md:col-span-5 space-y-6">
          <div className="card p-0 overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <h2 className="font-bold text-lg">Februar 2026</h2>
              <div className="flex gap-2">
                <button className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400">Heute</button>
                <div className="flex bg-slate-800 rounded-lg p-1">
                  <button className="px-3 py-1 text-xs font-bold bg-indigo-600 rounded-md">Monat</button>
                  <button className="px-3 py-1 text-xs font-bold text-slate-400 hover:text-slate-100 transition-all">Woche</button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {/* Simplified List View for Demo */}
              <div className="space-y-4">
                {entries.map(entry => (
                  <div key={entry.id} className="flex gap-6 p-4 rounded-2xl hover:bg-slate-800/50 transition-all border border-transparent hover:border-slate-700 group">
                    <div className="w-14 text-center">
                      <p className="text-xs font-bold text-slate-500 uppercase">{format(entry.start, 'EEE', { locale: de })}</p>
                      <p className="text-2xl font-bold">{format(entry.start, 'dd')}</p>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-2 h-2 rounded-full ${
                          entry.category === 'Probe' ? 'bg-blue-500' : 
                          entry.category === 'Show' ? 'bg-rose-500' : 
                          entry.category === 'Aufbau' ? 'bg-amber-500' : 'bg-slate-500'
                        }`}></span>
                        <h4 className="font-bold">{entry.title}</h4>
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700 uppercase tracking-widest ml-2">
                          {entry.category}
                        </span>
                      </div>
                      <div className="flex gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-1"><Clock size={14} /> {format(entry.start, 'HH:mm')} - {format(entry.end, 'HH:mm')}</span>
                        {entry.location && <span className="flex items-center gap-1"><MapPin size={14} /> {entry.location}</span>}
                      </div>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-indigo-400 transition-all self-center">
                      Bearbeiten
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="card">
            <h3 className="font-bold mb-4">Kategorien</h3>
            <div className="space-y-2">
              {[
                { name: 'Show', color: 'bg-rose-500' },
                { name: 'Probe', color: 'bg-blue-500' },
                { name: 'Aufbau', color: 'bg-amber-500' },
                { name: 'Abbau', color: 'bg-indigo-500' },
              ].map(cat => (
                <div key={cat.name} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-800 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${cat.color}`}></div>
                    <span className="text-sm font-medium">{cat.name}</span>
                  </div>
                  <span className="text-xs text-slate-500">12</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

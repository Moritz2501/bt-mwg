'use client';

import DashboardLayout from '@/components/DashboardLayout';
import { useState, useEffect, useCallback } from 'react';
import { Play, Square, Clock, Calendar, History, Download, Loader2 } from 'lucide-react';
import { format, differenceInSeconds } from 'date-fns';
import { de } from 'date-fns/locale';

interface TimeEntry {
  id: string;
  start: string;
  end: string | null;
  duration: number | null;
}

export default function StempelnPage() {
  const [activeSession, setActiveSession] = useState<TimeEntry | null>(null);
  const [history, setHistory] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/time-tracking');
      const data = await res.json();
      setActiveSession(data.activeSession);
      setHistory(data.history);
      
      if (data.activeSession) {
        const start = new Date(data.activeSession.start);
        setElapsedTime(differenceInSeconds(new Date(), start));
      }
    } catch (err) {
      console.error('Failed to fetch time tracking status');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeSession) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeSession]);

  const handleToggle = async () => {
    setActionLoading(true);
    try {
      const method = activeSession ? 'PATCH' : 'POST';
      const body = activeSession ? { id: activeSession.id } : {};
      
      const res = await fetch('/api/time-tracking', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      
      if (res.ok) {
        fetchStatus();
      }
    } catch (err) {
      console.error('Failed to update time tracking');
    } finally {
      setActionLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="card text-center py-12 flex flex-col items-center justify-center border-t-8 border-indigo-600">
            <h2 className="text-xl font-bold mb-8 text-slate-400">Aktuelle Session</h2>
            <div className="text-6xl font-mono font-bold mb-10 tracking-widest text-white">
              {formatDuration(elapsedTime)}
            </div>
            
            <button
              onClick={handleToggle}
              disabled={actionLoading || loading}
              className={activeSession 
                ? "w-24 h-24 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white transition-all shadow-xl shadow-red-500/20"
                : "w-24 h-24 rounded-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center text-white transition-all shadow-xl shadow-indigo-500/20"
              }
            >
              {actionLoading ? <Loader2 className="animate-spin" size={32} /> : (activeSession ? <Square fill="white" size={32} /> : <Play fill="white" size={32} />)}
            </button>
            <p className="mt-6 text-sm font-medium">
              {activeSession ? 'Sitzung beenden' : 'Sitzung starten'}
            </p>
            {activeSession && (
              <p className="mt-2 text-xs text-slate-500">Gestartet um {format(new Date(activeSession.start), 'HH:mm:ss')} Uhr</p>
            )}
          </div>

          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold">Zusammenfassung</h3>
              <Clock size={18} className="text-indigo-400" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-slate-400">Heute</span>
                <span className="font-bold">
                  {formatDuration(history.filter(h => format(new Date(h.start), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')).reduce((acc, curr) => acc + (curr.duration || 0), 0))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Diese Woche</span>
                <span className="font-bold">24:30:00</span>
              </div>
              <div className="pt-4 border-t border-slate-800">
                <button className="btn-outline w-full text-sm">
                  <Download size={14} /> CSV Export (Monat)
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <History className="text-purple-400" /> Letzte Einträge
              </h3>
              <Calendar size={20} className="text-slate-500" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-slate-500 text-sm border-b border-slate-800">
                    <th className="pb-4 font-medium">Datum</th>
                    <th className="pb-4 font-medium">Start</th>
                    <th className="pb-4 font-medium">Ende</th>
                    <th className="pb-4 font-medium text-right">Dauer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {history.map((entry) => (
                    <tr key={entry.id} className="text-slate-300">
                      <td className="py-4">{format(new Date(entry.start), 'dd.MM.yyyy')}</td>
                      <td className="py-4">{format(new Date(entry.start), 'HH:mm')}</td>
                      <td className="py-4">{entry.end ? format(new Date(entry.end), 'HH:mm') : '-'}</td>
                      <td className="py-4 text-right font-mono text-indigo-400">
                        {entry.duration ? formatDuration(entry.duration) : 'läuft...'}
                      </td>
                    </tr>
                  ))}
                  {history.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-500 italic">Keine Einträge gefunden.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Music, 
  Send, 
  Calendar, 
  MapPin, 
  Users, 
  Mail, 
  User, 
  Phone, 
  CheckCircle2,
  ChevronLeft
} from 'lucide-react';
import Link from 'next/link';

const techCategories = ['Ton', 'Licht', 'Bühne', 'Video', 'Strom', 'Sonstiges'];

export default function BookPage() {
  const [formData, setFormData] = useState({
    requesterName: '',
    email: '',
    phone: '',
    eventTitle: '',
    start: '',
    end: '',
    location: '',
    audienceSize: '',
    techNeedsText: '',
    notes: '',
  });

  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/public/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          audienceSize: parseInt(formData.audienceSize) || 0,
          techNeedsCategories: selectedTech,
          start: new Date(formData.start),
          end: new Date(formData.end),
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      }
    } catch (err) {
      console.error('Failed to submit booking request');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 text-center">
        <div className="max-w-md w-full card py-12">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mx-auto mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-3xl font-bold mb-4">Vielen Dank!</h1>
          <p className="text-slate-400 mb-10">
            Ihre Anfrage wurde erfolgreich übermittelt. Wir werden uns in Kürze mit Ihnen in Verbindung setzen.
          </p>
          <Link href="/" className="btn-primary w-full">
            Zurück zur Startseite
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-all mb-8">
          <ChevronLeft size={16} /> Zurück
        </Link>
        
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold mb-4">Event anfragen</h1>
          <p className="text-slate-400 text-lg">Teilen Sie uns Ihre Vision mit, und wir planen die technische Umsetzung.</p>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card space-y-6">
            <h2 className="text-xl font-bold border-b border-slate-800 pb-4 mb-4 flex items-center gap-2 text-indigo-400">
              <User size={20} /> Kontaktinformationen
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Name / Organisation</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="text" required className="input w-full pl-10" placeholder="Max Mustermann"
                    value={formData.requesterName} onChange={e => setFormData({...formData, requesterName: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">E-Mail</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="email" required className="input w-full pl-10" placeholder="max@beispiel.de"
                      value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Telefon (optional)</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="tel" className="input w-full pl-10" placeholder="+49..."
                      value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card space-y-6">
            <h2 className="text-xl font-bold border-b border-slate-800 pb-4 mb-4 flex items-center gap-2 text-purple-400">
              <Calendar size={20} /> Event-Details
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Veranstaltungsname</label>
                <input
                  type="text" required className="input w-full" placeholder="z.B. Open Air Sommerfest"
                  value={formData.eventTitle} onChange={e => setFormData({...formData, eventTitle: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Start</label>
                  <input
                    type="datetime-local" required className="input w-full"
                    value={formData.start} onChange={e => setFormData({...formData, start: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Ende</label>
                  <input
                    type="datetime-local" required className="input w-full"
                    value={formData.end} onChange={e => setFormData({...formData, end: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Veranstaltungsort</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="text" required className="input w-full pl-10" placeholder="Stadthalle Mainz"
                    value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Erwartete Besucher</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input
                    type="number" className="input w-full pl-10" placeholder="500"
                    value={formData.audienceSize} onChange={e => setFormData({...formData, audienceSize: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="card md:col-span-2 space-y-6">
            <h2 className="text-xl font-bold border-b border-slate-800 pb-4 mb-4 flex items-center gap-2 text-rose-400">
              <Music size={20} /> Technikbedarf
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-4">Welche Bereiche werden benötigt?</label>
              <div className="flex flex-wrap gap-3">
                {techCategories.map(cat => (
                  <button
                    key={cat} type="button"
                    onClick={() => setSelectedTech(prev => prev.includes(cat) ? prev.filter(p => p !== cat) : [...prev, cat])}
                    className={selectedTech.includes(cat)
                      ? "px-6 py-2 rounded-full bg-indigo-600 text-white border border-indigo-500 transition-all shadow-lg shadow-indigo-500/20"
                      : "px-6 py-2 rounded-full bg-slate-800 text-slate-400 border border-slate-700 hover:border-slate-500 transition-all"
                    }
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Weitere Infos / Spezielle Anforderungen</label>
              <textarea
                className="input w-full h-32 resize-none py-3"
                placeholder="Beschreiben Sie kurz Ihren Bedarf..."
                value={formData.techNeedsText} onChange={e => setFormData({...formData, techNeedsText: e.target.value})}
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-lg">
              {loading ? 'Sende Anfrage...' : 'Anfrage verbindlich absenden'} <Send size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

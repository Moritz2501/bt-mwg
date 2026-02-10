import Link from 'next/link';
import { Music, Calendar, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <nav className="p-6 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
          BT Events
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="px-6 py-2 rounded-full border border-slate-700 hover:bg-slate-900 transition-all">
            Login
          </Link>
          <Link href="/book" className="btn-primary">
            Event anfragen
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 text-center mt-20">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
          Ihre Vision, <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">unsere Technik.</span>
        </h1>
        <p className="text-slate-400 text-xl max-w-2xl mb-10">
          Professionelle Bühnentechnik, Lichtdesign und Sound-Engineering für Ihre Events. Einfach online anfragen und wir kümmern uns um den Rest.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/book" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full text-lg flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20">
            Jetzt Event anfragen <ArrowRight size={20} />
          </Link>
          <Link href="/login" className="px-8 py-4 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-bold rounded-full text-lg transition-all">
            Interner Bereich
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6">
              <Music size={32} />
            </div>
            <h3 className="text-xl font-bold mb-4">Event Management</h3>
            <p className="text-slate-400">Vollständige Planung von Ton, Licht und Video für Veranstaltungen jeder Größe.</p>
          </div>
          <div className="card text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 mb-6">
              <Calendar size={32} />
            </div>
            <h3 className="text-xl font-bold mb-4">Terminplanung</h3>
            <p className="text-slate-400">Präzise Koordinierung von Auf- und Abbau sowie Proben und Shows.</p>
          </div>
          <div className="card text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-400 mb-6">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-xl font-bold mb-4">Equipment & Sicherheit</h3>
            <p className="text-slate-400">Geprüftes Equipment und erfahrene Crew für maximale Ausfallsicherheit.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="p-12 border-t border-slate-900 text-center text-slate-500">
        <p>© 2026 BT Events Management. Alle Rechte vorbehalten.</p>
      </footer>
    </div>
  );
}
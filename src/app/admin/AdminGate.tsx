'use client';

import { useState } from 'react';
import { Lock, ShieldAlert, ArrowRight } from 'lucide-react';

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this should be a server action or API call
    // For demo, we use a fixed second-level password
    if (password === 'adminadmin') {
      setIsAuthorized(true);
    } else {
      setError('Falsches Admin-Passwort');
    }
  };

  if (isAuthorized) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="max-w-md w-full card text-center space-y-8">
        <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center text-purple-400 mx-auto">
          <ShieldAlert size={32} />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-2">Gesicherter Bereich</h2>
          <p className="text-slate-400 text-sm">Bitte geben Sie das zusätzliche Admin-Passwort ein, um fortzufahren.</p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="password"
              className="input w-full pl-10"
              placeholder="Admin-Passwort"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
          </div>
          
          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button type="submit" className="btn-secondary w-full py-3">
            Zugang freischalten <ArrowRight size={18} />
          </button>
        </form>
        
        <p className="text-[10px] text-slate-500 italic">Demo-Passwort: adminadmin</p>
      </div>
    </div>
  );
}

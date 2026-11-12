import React from 'react';
import { useHousehold } from '../context/HouseholdContext';
import { Search, ShieldCheck, Users } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useHousehold();

  return (
    <nav
      aria-label="Navigation principale mobile"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 pb-safe"
    >
      <div className="grid grid-cols-3 h-14 max-w-md mx-auto">
        <button
          onClick={() => setActiveTab('situations')}
          className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors ${
            activeTab === 'situations'
              ? 'text-emerald-800 font-semibold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Search className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] tracking-tight">Vérifier</span>
        </button>

        <button
          onClick={() => setActiveTab('protections')}
          className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors ${
            activeTab === 'protections'
              ? 'text-emerald-800 font-semibold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] tracking-tight">Protections</span>
        </button>

        <button
          onClick={() => setActiveTab('foyer')}
          className={`flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors ${
            activeTab === 'foyer'
              ? 'text-emerald-800 font-semibold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] tracking-tight">Foyer</span>
        </button>
      </div>
    </nav>
  );
};

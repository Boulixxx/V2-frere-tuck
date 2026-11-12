import React from 'react';
import { useHousehold } from '../context/HouseholdContext';
import { Shield, Sparkles, RotateCcw, Palette } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isZeroDataMode,
    setZeroDataMode,
    resetDemoData,
    openHouseholdManager,
    openWorkspaceModal,
    openPaletteModal,
    palette,
  } = useHousehold();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Zone 1: Single text brand wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('situations')}
            className="flex items-center gap-2 text-left group"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shadow-sm transition-colors"
              style={{
                backgroundColor: 'var(--color-brand-logo-bg)',
                color: 'var(--color-brand-logo-text)',
              }}
            >
              FT
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold font-display tracking-tight text-slate-900 group-hover:opacity-80 transition-opacity whitespace-nowrap">
                Frère Tuck
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Clean single-line navigation links (desktop/tablet) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('situations')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'situations'
                ? 'text-emerald-800 font-semibold border-b-2 border-emerald-800'
                : 'hover:text-slate-900'
            }`}
          >
            Vérifier une situation
          </button>
          <button
            onClick={() => setActiveTab('protections')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'protections'
                ? 'text-emerald-800 font-semibold border-b-2 border-emerald-800'
                : 'hover:text-slate-900'
            }`}
          >
            Mes protections
          </button>
          <button
            onClick={() => setActiveTab('foyer')}
            className={`whitespace-nowrap transition-colors py-1 ${
              activeTab === 'foyer'
                ? 'text-emerald-800 font-semibold border-b-2 border-emerald-800'
                : 'hover:text-slate-900'
            }`}
          >
            Foyer & Contrats
          </button>
        </nav>

        {/* Zone 3: Actions & switches */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={openPaletteModal}
            className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center gap-1.5 shadow-xs"
            title="Choisir une palette de couleurs (Bleu Nuit, Scribe, Basalte, Émeraude)"
          >
            <Palette className="w-3.5 h-3.5 text-slate-700 shrink-0" />
            <span className="hidden sm:inline font-medium">Palettes</span>
          </button>

          <button
            onClick={() => openWorkspaceModal('overview')}
            className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center gap-1.5 shadow-xs"
            title="Ouvrir Google Workspace (Drive, Docs, Sheets, Gmail)"
          >
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="hidden lg:inline font-medium">Google Workspace</span>
            <span className="lg:hidden text-[11px] font-medium">Workspace</span>
          </button>

          <button
            onClick={openHouseholdManager}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              isZeroDataMode
                ? 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
            title="Gérer les informations du foyer"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden sm:inline">
              {isZeroDataMode ? 'Mode sans données' : 'Foyer Thomas & Camille'}
            </span>
            <span className="sm:hidden">
              {isZeroDataMode ? 'Sans données' : 'Foyer'}
            </span>
          </button>

          <button
            onClick={resetDemoData}
            title="Réinitialiser la démonstration"
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center"
            aria-label="Réinitialiser la démo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import { useHousehold } from '../context/HouseholdContext';
import { X, Check, Sparkles, Palette, Shield, Compass, BookOpen, Layers } from 'lucide-react';

interface PaletteOption {
  id: 'navy' | 'parchment' | 'basalt' | 'forest';
  name: string;
  subtitle: string;
  description: string;
  tags: string[];
  swatches: {
    bg: string;
    card: string;
    primary: string;
    accent: string;
    badge: string;
  };
  sampleButtonClass: string;
  sampleBadgeClass: string;
}

export const PALETTES: PaletteOption[] = [
  {
    id: 'navy',
    name: 'Bleu Nuit & Céleste',
    subtitle: 'Assurance Souveraine & Banque Privée',
    description:
      'Un bleu nuit très profond allié à un bleu cobalt lumineux et un fond gris perle glacé. Évacue toute impression de "bricolage" et inspire une autorité institutionnelle digne d’un grand assureur patrimonial.',
    tags: ['Recommandé', 'Souverain', 'Haut de gamme', 'Alan / Qonto'],
    swatches: {
      bg: '#F8FAFC',
      card: '#FFFFFF',
      primary: '#0F172A',
      accent: '#1E40AF',
      badge: '#EFF6FF',
    },
    sampleButtonClass: 'bg-slate-900 text-white hover:bg-slate-800',
    sampleBadgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    id: 'parchment',
    name: 'Scribe & Travertin',
    subtitle: 'Éditorial Minéral & Cabinet d’Audit',
    description:
      'Une texture feutrée inspirée des grands cabinets d’arbitrage juridique et de revues comme The Economist ou Monocle. Anthracite chaud, fond travertin doux et accents cuivre/cognac raffinés.',
    tags: ['Éditorial', 'Chaleureux', 'Littéraire', 'Cabinet juridique'],
    swatches: {
      bg: '#FBFBF9',
      card: '#FFFFFF',
      primary: '#1C1917',
      accent: '#9A3412',
      badge: '#FEF3C7',
    },
    sampleButtonClass: 'bg-stone-900 text-stone-100 hover:bg-stone-800',
    sampleBadgeClass: 'bg-amber-50 text-amber-900 border-amber-200',
  },
  {
    id: 'basalt',
    name: 'Basalte & Cobalt Studio',
    subtitle: 'Haute Précision & Actuariat Moderne',
    description:
      'Inspiré des outils d’ingénierie et d’actuariat les plus tranchants (Linear, Stripe). Noir basalte net, gris technique zéro-bruit et indigo électrique ultra précis.',
    tags: ['Précis', 'Chirurgical', 'Moderne', 'Linear / Stripe'],
    swatches: {
      bg: '#F4F4F5',
      card: '#FFFFFF',
      primary: '#09090B',
      accent: '#4338CA',
      badge: '#EEF2FF',
    },
    sampleButtonClass: 'bg-zinc-950 text-white hover:bg-zinc-900',
    sampleBadgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  {
    id: 'forest',
    name: 'Émeraude Alpine & Bronze',
    subtitle: 'Nature Alpine Noble & Horlogerie',
    description:
      'Une réinterprétation mature et sobre du vert "Frère Tuck" : vert sapin profond presque noir, touches bronze cognac et vert sauge givré. Zéro vert criard, 100% élégance alpine.',
    tags: ['Alpin', 'Montagne', 'Sauge & Bronze', 'Hôtellerie alpine'],
    swatches: {
      bg: '#F6F8F6',
      card: '#FFFFFF',
      primary: '#062C22',
      accent: '#065F46',
      badge: '#ECFDF5',
    },
    sampleButtonClass: 'bg-emerald-950 text-amber-200 hover:bg-emerald-900',
    sampleBadgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
];

export const PaletteSwitcherModal: React.FC = () => {
  const { isPaletteModalOpen, closePaletteModal, palette, setPalette } = useHousehold();

  if (!isPaletteModalOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-white w-full sm:max-w-2xl max-h-[92vh] sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-300 flex items-center justify-center">
              <Palette className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Direction Artistique & Rendu
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Choisir une palette pour Frère Tuck
              </h3>
            </div>
          </div>

          <button
            onClick={closePaletteModal}
            className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-sm flex-1">
          <p className="text-xs text-slate-600 leading-relaxed">
            Cliquez sur l'une des 4 propositions ci-dessous pour tester immédiatement son rendu sur l'ensemble de l'application (en-tête, cartes d'audit, boutons et modales).
          </p>

          <div className="grid gap-3">
            {PALETTES.map((opt) => {
              const isSelected = palette === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setPalette(opt.id)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer text-left relative ${
                    isSelected
                      ? 'border-slate-900 bg-slate-50/70 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{opt.name}</h4>
                        {isSelected && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-white flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 font-medium mt-0.5">
                        {opt.subtitle}
                      </div>
                    </div>

                    {/* Color Swatches preview */}
                    <div className="flex items-center gap-1 shrink-0 bg-white p-1 rounded-lg border border-slate-200 shadow-xs">
                      <div
                        className="w-5 h-5 rounded-md border border-slate-300 shadow-2xs"
                        style={{ backgroundColor: opt.swatches.primary }}
                        title="Primaire / Titres"
                      />
                      <div
                        className="w-5 h-5 rounded-md border border-slate-300 shadow-2xs"
                        style={{ backgroundColor: opt.swatches.accent }}
                        title="Boutons / Accent"
                      />
                      <div
                        className="w-5 h-5 rounded-md border border-slate-300 shadow-2xs"
                        style={{ backgroundColor: opt.swatches.badge }}
                        title="Fonds doux / Badges"
                      />
                      <div
                        className="w-5 h-5 rounded-md border border-slate-300 shadow-2xs"
                        style={{ backgroundColor: opt.swatches.bg }}
                        title="Toile de fond"
                      />
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    {opt.description}
                  </p>

                  {/* Micro-preview component */}
                  <div className="pt-2.5 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {opt.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${opt.sampleBadgeClass}`}
                      >
                        Protection acquise
                      </span>
                      <button
                        type="button"
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded transition-colors ${opt.sampleButtonClass}`}
                      >
                        Tester
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Palette sélectionnée :{' '}
            <strong className="text-slate-900 font-semibold">
              {PALETTES.find((p) => p.id === palette)?.name}
            </strong>
          </span>
          <button
            onClick={closePaletteModal}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
          >
            Appliquer & Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

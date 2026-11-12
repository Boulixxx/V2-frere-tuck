import React, { useState } from 'react';
import { useHousehold } from '../context/HouseholdContext';
import { Layers, X, ShieldAlert, ArrowRight, FileText, Briefcase, Shield, Lock, AlertTriangle } from 'lucide-react';

export const OverlapModal: React.FC = () => {
  const { isOverlapModalOpen, closeOverlapModal, openProofModal } = useHousehold();
  const [activeCompareTab, setActiveCompareTab] = useState<'rc' | 'vol'>('rc');

  if (!isOverlapModalOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-white w-full sm:max-w-2xl max-h-[92vh] sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-indigo-700">
                Comparateur de garanties croisées
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Habitation Multirisque vs Carte Gold
              </h3>
            </div>
          </div>
          <button
            onClick={closeOverlapModal}
            className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
            aria-label="Fermer le comparateur"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-5 pt-3 pb-0 bg-slate-50 border-b border-slate-200 flex gap-2">
          <button
            onClick={() => setActiveCompareTab('rc')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeCompareTab === 'rc'
                ? 'border-indigo-700 text-indigo-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            1. Responsabilité Civile
          </button>
          <button
            onClick={() => setActiveCompareTab('vol')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeCompareTab === 'vol'
                ? 'border-indigo-700 text-indigo-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            2. Vol d’objets & Matériel de ski
          </button>
        </div>

        {/* Comparison Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-sm">
          {activeCompareTab === 'rc' ? (
            <>
              {/* RC Explanation Banner */}
              <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs text-indigo-950 leading-relaxed">
                <span className="font-semibold">Pourquoi ce point mérite votre attention :</span> Vous disposez de deux contrats couvrant les dommages causés aux tiers lors de votre séjour. L'assureur adverse vous demandera de choisir une déclaration principale.
              </div>

              {/* Side-by-side Table RC */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="grid grid-cols-2 bg-slate-100 text-xs font-semibold text-slate-700 border-b border-slate-200">
                  <div className="p-3 border-r border-slate-200">
                    Habitation Multirisque
                    <button
                      onClick={() => openProofModal('clause-rc-mrh')}
                      className="mt-1 text-[11px] text-emerald-700 hover:underline flex items-center gap-1 font-normal"
                    >
                      <FileText className="w-3 h-3" />
                      Notice p. 8 · Art. 2
                    </button>
                  </div>
                  <div className="p-3">
                    Carte Gold Mastercard
                    <button
                      onClick={() => openProofModal('clause-rc-gold')}
                      className="mt-1 text-[11px] text-emerald-700 hover:underline flex items-center gap-1 font-normal"
                    >
                      <FileText className="w-3 h-3" />
                      Notice p. 15 · Art. 5
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-slate-100 text-xs">
                  {/* Row 1: Who is covered */}
                  <div className="p-3 bg-white">
                    <div className="font-semibold text-slate-500 uppercase text-[10px] mb-1">
                      1. Qui est couvert ?
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-slate-800">
                        <span className="font-medium">Thomas, Camille et Léo</span> (toute personne vivant sous le même toit).
                      </div>
                      <div className="text-slate-800">
                        <span className="font-medium">Thomas, Camille et Léo</span> (titulaire et ayants droit de moins de 25 ans).
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Condition de déclenchement */}
                  <div className="p-3 bg-slate-50/50">
                    <div className="font-semibold text-slate-500 uppercase text-[10px] mb-1">
                      2. Condition déterminante
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-emerald-800">
                        <span className="font-semibold">Inconditionnelle :</span> s'applique quel que soit le mode de règlement du voyage.
                      </div>
                      <div className="text-amber-800">
                        <span className="font-semibold">Conditionnelle :</span> exige que le séjour ait été payé avec la Carte Gold.
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Plafonds */}
                  <div className="p-3 bg-white">
                    <div className="font-semibold text-slate-500 uppercase text-[10px] mb-1">
                      3. Plafonds de garantie
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-slate-800 font-medium">
                        Corporels : Illimité<br />
                        Matériels : 20 000 000 €
                      </div>
                      <div className="text-slate-800 font-medium">
                        Dommages globaux :<br />
                        1 000 000 € par sinistre
                      </div>
                    </div>
                  </div>

                  {/* Row 4: Franchises */}
                  <div className="p-3 bg-slate-50/50">
                    <div className="font-semibold text-slate-500 uppercase text-[10px] mb-1">
                      4. Franchise par sinistre
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-slate-800 font-bold text-emerald-700">
                        120 € (plus favorable)
                      </div>
                      <div className="text-slate-800 font-bold text-slate-700">
                        150 €
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Frere Tuck Verdict RC */}
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                  <ShieldAlert className="w-4 h-4 text-emerald-700" />
                  L'arbitrage de Frère Tuck pour la Responsabilité Civile
                </div>
                <p className="text-xs text-emerald-950 leading-relaxed">
                  Pour tout dommage causé à un tiers sur les pistes ou dans votre hébergement de vacances, <span className="font-semibold">déclarez en priorité votre contrat Habitation Multirisque</span>. Elle vous protège avec un plafond vingt fois plus élevé et une franchise plus basse de 30 €, sans que l'assureur puisse contester la preuve de paiement.
                </p>
              </div>
            </>
          ) : (
            <>
              {/* VOL D'OBJETS Explanation Banner */}
              <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl text-xs text-indigo-950 leading-relaxed">
                <span className="font-semibold">Vol d’objets, bagages & matériel de glisse :</span> La différence entre votre assurance Habitation et votre Carte bancaire est capitale selon le lieu où le vol survient (chalet loué vs avion/train).
              </div>

              {/* Side-by-side Table VOL */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="grid grid-cols-2 bg-slate-100 text-xs font-semibold text-slate-700 border-b border-slate-200">
                  <div className="p-3 border-r border-slate-200">
                    Habitation Multirisque
                    <button
                      onClick={() => openProofModal('clause-vol-objets-mrh')}
                      className="mt-1 text-[11px] text-emerald-700 hover:underline flex items-center gap-1 font-normal"
                    >
                      <FileText className="w-3 h-3" />
                      Notice p. 14 · Art. 6
                    </button>
                  </div>
                  <div className="p-3">
                    Carte Gold Mastercard
                    <button
                      onClick={() => openProofModal('clause-vol-bagages-gold')}
                      className="mt-1 text-[11px] text-emerald-700 hover:underline flex items-center gap-1 font-normal"
                    >
                      <FileText className="w-3 h-3" />
                      Notice p. 24 · Art. 8.3
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-slate-100 text-xs">
                  {/* Row 1: Lieux et circonstances couverts */}
                  <div className="p-3 bg-white">
                    <div className="font-semibold text-slate-500 uppercase text-[10px] mb-1">
                      1. Lieux et circonstances garantis
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-emerald-800 font-medium">
                        <span className="font-semibold">Dans la location de vacances :</span> chalet, appartement ou casier à skis privatif fermé avec effraction ou agression.
                      </div>
                      <div className="text-rose-700 font-medium">
                        <span className="font-semibold">Exclusivement sous garde d’un transporteur :</span> avion ou train. <span className="font-bold underline">Exclusion formelle</span> des vols en hôtel, chalet et casiers à skis.
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Matériel de ski et de sport */}
                  <div className="p-3 bg-slate-50/50">
                    <div className="font-semibold text-slate-500 uppercase text-[10px] mb-1">
                      2. Skis & matériel de glisse (détenu ou loué)
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-emerald-800">
                        <span className="font-semibold">Couvert :</span> jusqu’à 2 000 € pour le matériel de ski dérobé dans le casier sécurisé ou le logement.
                      </div>
                      <div className="text-rose-700">
                        <span className="font-semibold">Exclu :</span> le matériel de sport en cours d’usage ou de séjour est expressément non couvert.
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Plafond global */}
                  <div className="p-3 bg-white">
                    <div className="font-semibold text-slate-500 uppercase text-[10px] mb-1">
                      3. Plafond d’indemnisation
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-slate-900 font-bold">
                        Jusqu’à 4 000 € par événement
                      </div>
                      <div className="text-slate-800 font-medium">
                        800 € / bagage (max 1 600 €)
                      </div>
                    </div>
                  </div>

                  {/* Row 4: Franchises & justificatifs */}
                  <div className="p-3 bg-slate-50/50">
                    <div className="font-semibold text-slate-500 uppercase text-[10px] mb-1">
                      4. Franchise et justificatifs
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-slate-800">
                        <span className="font-semibold">100 €</span> · Plainte gendarmerie sous 48h + factures ou contrat de location ski.
                      </div>
                      <div className="text-slate-800">
                        <span className="font-semibold">70 €</span> · Rapport d’irrégularité (PIR) de la compagnie aérienne/SNCF + billet CB.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Frere Tuck Verdict VOL */}
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                  <ShieldAlert className="w-4 h-4 text-emerald-700" />
                  L'arbitrage de Frère Tuck pour le vol d'objets en station
                </div>
                <p className="text-xs text-emerald-950 leading-relaxed">
                  Si vos valises, vos vêtements ou votre matériel de ski sont dérobés dans votre logement aux Menuires ou dans votre casier privatif fermé à clé, <span className="font-semibold">la Carte Gold refusera immédiatement toute indemnisation</span>. Vous devez obligatoirement déclarer ce sinistre auprès de votre <span className="font-semibold">assurance Habitation Multirisque</span> en déposant plainte sous 48 heures auprès de la gendarmerie.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
          <span className="text-xs text-slate-500">
            Dossier My Guaranties vérifié
          </span>
          <button
            onClick={closeOverlapModal}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition-colors"
          >
            Fermer le comparateur
          </button>
        </div>
      </div>
    </div>
  );
};

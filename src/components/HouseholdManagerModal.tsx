import React from 'react';
import { useHousehold } from '../context/HouseholdContext';
import {
  Users,
  X,
  CreditCard,
  Home,
  Calendar,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  PlusCircle,
  FileText,
} from 'lucide-react';

export const HouseholdManagerModal: React.FC = () => {
  const {
    isHouseholdManagerOpen,
    closeHouseholdManager,
    isZeroDataMode,
    setZeroDataMode,
    members,
    stay,
    updateStay,
    hasComplementaryDoc,
    documents,
    addComplementaryDocument,
    removeComplementaryDocument,
    resetDemoData,
    openProofModal,
  } = useHousehold();

  if (!isHouseholdManagerOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-white w-full sm:max-w-xl max-h-[92vh] sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Dossier & Faits connus
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Paramètres du foyer et des contrats
              </h3>
            </div>
          </div>

          <button
            onClick={closeHouseholdManager}
            className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-sm">
          {/* Mode Switcher: Demo vs Zero-Data */}
          <div className="p-3.5 bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-slate-900">
                Mode d’exploration
              </div>
              <div className="text-[11px] text-slate-500">
                {isZeroDataMode
                  ? 'Foyer vierge : voir comment Frère Tuck demande les données manquantes'
                  : 'Foyer préchargé : Thomas, Camille & Léo avec séjour et contrats'}
              </div>
            </div>

            <button
              onClick={() => setZeroDataMode(!isZeroDataMode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                isZeroDataMode
                  ? 'bg-emerald-800 text-white hover:bg-emerald-900'
                  : 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300'
              }`}
            >
              {isZeroDataMode ? 'Charger la démo' : 'Découvrir sans données'}
            </button>
          </div>

          {!isZeroDataMode ? (
            <>
              {/* Section 1: Membres du foyer */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-semibold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    Composition du foyer
                  </div>
                  <span className="text-[11px] text-slate-500">Source : Profil My Guaranties</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {members.map((m) => (
                    <div
                      key={m.id}
                      className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-center"
                    >
                      <div className="font-semibold text-slate-900 text-xs">{m.name}</div>
                      <div className="text-[11px] text-slate-500 capitalize">{m.role}</div>
                      <div className="text-[10px] text-slate-400">{m.age} ans</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2: Séjour en cours */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Projet de séjour au ski
                  </div>
                  <span className="text-[11px] text-slate-500">Source : Déclaratif</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                    <span className="text-slate-600">Destination :</span>
                    <span className="font-semibold text-slate-900">{stay.destination}</span>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                    <span className="text-slate-600">Dates :</span>
                    <span className="font-medium text-slate-900">15 au 22 février 2025</span>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="space-y-1.5">
                    <label className="text-slate-700 font-medium block">
                      Moyen de paiement utilisé pour le voyage :
                    </label>
                    <select
                      value={stay.paymentMethod}
                      onChange={(e) =>
                        updateStay({
                          paymentMethod: e.target.value as any,
                          paymentConfirmedDoc: e.target.value === 'carte_gold',
                        })
                      }
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-emerald-600"
                    >
                      <option value="carte_gold">Carte Gold Mastercard (Règlement 100%)</option>
                      <option value="autre_carte">Autre carte bancaire classique (Sans assurance)</option>
                      <option value="virement">Virement bancaire direct</option>
                      <option value="inconnu">Inconnu / Facture non retrouvée</option>
                    </select>
                  </div>

                  {/* Off-piste selector */}
                  <div className="space-y-1.5">
                    <label className="text-slate-700 font-medium block">
                      Pratique du ski hors-piste prévue :
                    </label>
                    <select
                      value={stay.offPistePlanned}
                      onChange={(e) =>
                        updateStay({ offPistePlanned: e.target.value as any })
                      }
                      className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-emerald-600"
                    >
                      <option value="non">Non (uniquement pistes balisées)</option>
                      <option value="oui_seul">Oui, individuel sans moniteur</option>
                      <option value="oui_guide">Oui, encadré par moniteur ESF / guide</option>
                    </select>
                  </div>

                  {/* Amounts */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Coût total</span>
                      <span className="font-bold text-slate-900">{stay.totalCost} €</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Remboursé station</span>
                      <span className="font-bold text-emerald-700">{stay.refundedByProvider} €</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Contrats rattachés */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5" />
                    Contrats enregistrés dans My Guaranties
                  </div>
                  <span className="text-[11px] text-slate-500">Source : Documents</span>
                </div>

                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          {doc.title}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {doc.issuer} · Réf {doc.contractNumber}
                        </div>
                      </div>
                      {doc.clauses.length > 0 && (
                        <button
                          onClick={() => openProofModal(doc.clauses[0].id)}
                          className="px-2.5 py-1 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-md hover:bg-emerald-100 flex items-center gap-1 font-medium"
                        >
                          <FileText className="w-3 h-3" />
                          Notice
                        </button>
                      )}
                    </div>
                  ))}

                  {/* Complementary doc toggle */}
                  <div className="p-3 rounded-xl border border-dashed border-emerald-300 bg-emerald-50/50 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-emerald-950">
                        Attestation Neige & Montagne Famille
                      </div>
                      <div className="text-[11px] text-emerald-800">
                        {hasComplementaryDoc
                          ? 'Document actif : couvre le hors-piste & la garde des enfants'
                          : 'Document simulé disponible pour tester la résolution d’un point'}
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        hasComplementaryDoc
                          ? removeComplementaryDocument()
                          : addComplementaryDocument()
                      }
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                        hasComplementaryDoc
                          ? 'bg-rose-100 text-rose-800 hover:bg-rose-200 border border-rose-300'
                          : 'bg-emerald-800 text-white hover:bg-emerald-900'
                      }`}
                    >
                      {hasComplementaryDoc ? 'Retirer ce document' : 'Ajouter ce document'}
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Mode Découvrir sans données */
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                <HelpCircle className="w-4 h-4 text-amber-700" />
                Mode « Découvrir sans données » actif
              </div>
              <p className="text-xs text-amber-950 leading-relaxed">
                Toutes les données du foyer ont été temporairement retirées. Lorsque vous posez une question dans cet état, Frère Tuck vous indique précisément quelles informations manquent (contrats, dates de séjour, personnes à couvrir) pour rendre une conclusion fiable.
              </p>
              <button
                onClick={() => setZeroDataMode(false)}
                className="w-full py-2 bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Recharger le foyer de démonstration (Thomas, Camille, Léo)
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={resetDemoData}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5 py-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Réinitialiser les données initiales
          </button>
          <button
            onClick={closeHouseholdManager}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition-colors"
          >
            Appliquer et fermer
          </button>
        </div>
      </div>
    </div>
  );
};

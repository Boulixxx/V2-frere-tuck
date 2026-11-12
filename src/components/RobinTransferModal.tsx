import React, { useState } from 'react';
import { useHousehold } from '../context/HouseholdContext';
import {
  Send,
  X,
  FileCheck2,
  FileWarning,
  Copy,
  Check,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const RobinTransferModal: React.FC = () => {
  const {
    isRobinModalOpen,
    closeRobinModal,
    claimPreparation,
    addAuditItem,
    openWorkspaceModal,
  } = useHousehold();

  const [hasConfirmedAgreement, setHasConfirmedAgreement] = useState(false);
  const [isTransferred, setIsTransferred] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState(false);

  if (!isRobinModalOpen || !claimPreparation) return null;

  const handleCopyDraft = () => {
    navigator.clipboard.writeText(claimPreparation.draftLetter);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSaveInFolder = () => {
    addAuditItem({
      id: 'audit-dossier-annulation-sauvegarde',
      title: 'Dossier d’annulation séjour ski (1 450 € réclamés)',
      category: 'annulation',
      status: 'a_verifier',
      source: 'declared',
      summary: 'Dossier préparé et sauvegardé dans le dossier familial. En attente de transmission ou de justificatif médical.',
      actionRequired: 'Fournir le certificat médical pour déclencher le recours formel.',
      attachedToStay: true,
    });
    setSaveSuccessMessage(true);
    setTimeout(() => setSaveSuccessMessage(false), 3000);
  };

  const handleTransferToRobin = () => {
    if (!hasConfirmedAgreement) return;
    setIsTransferred(true);
    addAuditItem({
      id: 'audit-dossier-annulation-robin',
      title: 'Recours en cours avec Robin : Annulation ski (Réf #ROBIN-SKI-2025-084)',
      category: 'annulation',
      status: 'couvert',
      source: 'document',
      summary: 'Dossier formellement transmis à Robin. 1 450 € en cours de réclamation auprès de l’assisteur Carte Gold.',
      actionRequired: 'Robin effectue la relance sous 72h. Aucun nouvel appel nécessaire.',
      attachedToStay: true,
    });
  };

  const handleClose = () => {
    setIsTransferred(false);
    setHasConfirmedAgreement(false);
    closeRobinModal();
  };

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
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-xs">
              R
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                Préparer la suite avec Robin
              </div>
              <h3 className="text-sm font-bold text-slate-900 truncate">
                {claimPreparation.situationTitle}
              </h3>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-sm">
          {!isTransferred ? (
            <>
              {/* Financial Recap Box */}
              <div className="bg-slate-900 text-white rounded-xl p-4 shadow-sm">
                <div className="text-xs text-slate-300 font-medium mb-1">
                  Bilan financier récapitulatif
                </div>
                <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-800 pb-3 mb-3">
                  <div>
                    <span className="text-2xl font-bold font-mono tracking-tight text-emerald-400 tabular-nums">
                      {claimPreparation.estimatedPayout} €
                    </span>
                    <span className="text-xs text-slate-400 ml-2">
                      indemnité nette estimée
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Plafond contractuel : {claimPreparation.ceilingAmount.toLocaleString()} €
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <div className="text-slate-400">Frais initiaux</div>
                    <div className="font-semibold tabular-nums">{claimPreparation.totalCost} €</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Remboursement station</div>
                    <div className="font-semibold text-emerald-400 tabular-nums">
                      - {claimPreparation.refundedAmount} €
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400">Franchise déduite</div>
                    <div className="font-semibold text-amber-400 tabular-nums">
                      - {claimPreparation.deductibleAmount} €
                    </div>
                  </div>
                </div>
              </div>

              {/* Verified Proofs */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <FileCheck2 className="w-4 h-4 text-emerald-600" />
                  Preuves réunies dans votre dossier
                </div>
                <div className="space-y-1.5">
                  {claimPreparation.proofsUsed.map((proof, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200/80 text-xs flex items-start justify-between gap-2"
                    >
                      <div>
                        <span className="font-semibold text-emerald-950">{proof.name}</span>
                        <div className="text-emerald-800 text-[11px] mt-0.5">{proof.details}</div>
                      </div>
                      <span className="text-[10px] bg-emerald-200/60 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                        Validé
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Missing proofs to attach */}
              {claimPreparation.missingProofs.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <FileWarning className="w-4 h-4 text-amber-600" />
                    Pièce indispensable à joindre
                  </div>
                  <div className="space-y-1.5">
                    {claimPreparation.missingProofs.map((missing, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200 text-xs flex items-start justify-between gap-2"
                      >
                        <div>
                          <span className="font-semibold text-amber-950">{missing.name}</span>
                          <div className="text-amber-800 text-[11px] mt-0.5">
                            {missing.howToGet}
                          </div>
                        </div>
                        <span className="text-[10px] bg-amber-200 text-amber-900 font-semibold px-2 py-0.5 rounded shrink-0">
                          Requis
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Draft Letter */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Brouillon officiel rédigé par Frère Tuck
                  </label>
                  <button
                    onClick={handleCopyDraft}
                    className="text-xs text-emerald-700 hover:text-emerald-900 font-medium flex items-center gap-1"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        Copié !
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copier le texte
                      </>
                    )}
                  </button>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
                  {claimPreparation.draftLetter}
                </div>

                {/* Google Workspace Direct Actions */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      closeRobinModal();
                      openWorkspaceModal('docs');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                    <span>Créer dans Google Docs</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      closeRobinModal();
                      openWorkspaceModal('gmail');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <span>Envoyer via Gmail</span>
                  </button>
                </div>
              </div>

              {/* Explicit agreement checkbox */}
              <div className="p-3.5 bg-slate-100 rounded-xl border border-slate-200 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="robin-consent"
                  checked={hasConfirmedAgreement}
                  onChange={(e) => setHasConfirmedAgreement(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-emerald-800 rounded border-slate-300 focus:ring-emerald-600 cursor-pointer"
                />
                <label
                  htmlFor="robin-consent"
                  className="text-xs text-slate-700 leading-normal cursor-pointer select-none"
                >
                  <span className="font-semibold text-slate-900">
                    Validation explicite de transmission :
                  </span>{' '}
                  Je certifie avoir relu ces éléments et donne mandat à Robin pour introduire ma demande d'indemnisation auprès de l'assisteur Carte Gold.
                </label>
              </div>

              {saveSuccessMessage && (
                <div className="p-2.5 bg-emerald-100 text-emerald-900 text-xs rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Dossier enregistré avec succès dans votre audit familial !
                </div>
              )}
            </>
          ) : (
            /* Confirmation Screen */
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                  Dossier transmis à Robin
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  Référence #ROBIN-SKI-2025-084
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
                  Robin a bien pris le relais de Frère Tuck. Votre dossier est complet et le recours est introduit avec les arguments contractuels pré-validés.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left max-w-md mx-auto space-y-2.5 text-xs">
                <div className="font-semibold text-slate-900">Les 3 prochaines étapes prises en charge :</div>
                <div className="flex items-start gap-2 text-slate-700">
                  <span className="font-bold text-emerald-700">1.</span>
                  <span>Accusé de réception formel expédié à l’assureur Mondial Assistance.</span>
                </div>
                <div className="flex items-start gap-2 text-slate-700">
                  <span className="font-bold text-emerald-700">2.</span>
                  <span>Relance automatique à J+3 si absence de réponse sur l’accord d’indemnisation de 1 450 €.</span>
                </div>
                <div className="flex items-start gap-2 text-slate-700">
                  <span className="font-bold text-emerald-700">3.</span>
                  <span>Notification par message dès le virement effectif sur votre compte bancaire.</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          {!isTransferred ? (
            <>
              <button
                onClick={handleSaveInFolder}
                className="px-3.5 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-medium transition-colors"
              >
                Enregistrer dans mon dossier
              </button>

              <button
                onClick={handleTransferToRobin}
                disabled={!hasConfirmedAgreement}
                className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
                  hasConfirmedAgreement
                    ? 'bg-emerald-800 hover:bg-emerald-900 text-white shadow-emerald-900/10'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                Transmettre à Robin
              </button>
            </>
          ) : (
            <button
              onClick={handleClose}
              className="w-full py-2.5 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition-colors"
            >
              Terminer et retourner à l'accueil
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

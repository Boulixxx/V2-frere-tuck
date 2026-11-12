import React from 'react';
import { useHousehold } from '../context/HouseholdContext';
import { FileText, X, CheckCircle2, AlertCircle, Users, ArrowLeft } from 'lucide-react';

export const ProofModal: React.FC = () => {
  const { isProofModalOpen, closeProofModal, selectedClauseForProof } = useHousehold();

  if (!isProofModalOpen || !selectedClauseForProof) return null;

  const clause = selectedClauseForProof;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-white w-full sm:max-w-xl max-h-[90vh] sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Preuve contractuelle extraite
              </div>
              <h3 className="text-sm font-bold text-slate-900 truncate max-w-[280px] sm:max-w-md">
                {clause.documentTitle}
              </h3>
            </div>
          </div>

          <button
            onClick={closeProofModal}
            className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
            aria-label="Fermer la preuve"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-sm">
          {/* Metadata Bar */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 bg-slate-100/70 p-3 rounded-lg border border-slate-200/70">
            <span className="font-semibold text-slate-900">{clause.article}</span>
            <span aria-hidden="true">·</span>
            <span>Page {clause.page}</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-medium">Authentifié My Guaranties</span>
          </div>

          {/* Verified Text Quote */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">
              Extrait officiel de la notice
            </label>
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 text-slate-800 text-sm leading-relaxed font-serif italic relative">
              {clause.fullExtract}
            </div>
          </div>

          {/* Beneficiaries */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-2">
              <Users className="w-4 h-4 text-slate-500" />
              Personnes couvertes par cette clause
            </div>
            <div className="flex flex-wrap gap-1.5">
              {clause.appliesTo.map((person) => (
                <span
                  key={person}
                  className="text-xs font-medium bg-white border border-slate-200 text-slate-800 px-2.5 py-1 rounded-md"
                >
                  {person}
                </span>
              ))}
            </div>
          </div>

          {/* Amounts & Deductibles */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 mb-0.5">Plafond garanti</div>
              <div className="font-semibold text-slate-900 text-sm">{clause.guaranteedAmount}</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 mb-0.5">Franchise applicable</div>
              <div className="font-semibold text-slate-900 text-sm">{clause.deductible}</div>
            </div>
          </div>

          {/* Conditions */}
          {clause.conditions.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Conditions impératives à réunir
              </div>
              <ul className="space-y-1.5 pl-1">
                {clause.conditions.map((cond, i) => (
                  <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                    <span className="text-emerald-700 font-bold shrink-0">✓</span>
                    <span>{cond}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Exclusions */}
          {clause.exclusions.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                Exclusions et limites contractuelles
              </div>
              <ul className="space-y-1.5 pl-1">
                {clause.exclusions.map((excl, i) => (
                  <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                    <span className="text-amber-600 font-bold shrink-0">✕</span>
                    <span>{excl}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer Return Button */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Source : Dossier My Guaranties
          </span>
          <button
            onClick={closeProofModal}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Revenir à l'analyse
          </button>
        </div>
      </div>
    </div>
  );
};

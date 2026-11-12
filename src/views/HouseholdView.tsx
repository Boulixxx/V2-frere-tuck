import React from 'react';
import { useHousehold } from '../context/HouseholdContext';
import {
  Users,
  CreditCard,
  Calendar,
  FileText,
  RotateCcw,
  PlusCircle,
  HelpCircle,
  CheckCircle2,
  ExternalLink,
  Shield,
  FileCheck2,
} from 'lucide-react';

export const HouseholdView: React.FC = () => {
  const {
    isZeroDataMode,
    setZeroDataMode,
    members,
    stay,
    documents,
    hasComplementaryDoc,
    addComplementaryDocument,
    removeComplementaryDocument,
    openHouseholdManager,
    resetDemoData,
    openProofModal,
    setActiveTab,
    setRequestedScenario,
    openWorkspaceModal,
  } = useHousehold();

  const handleLaunchScenario = (scenario: 'scene1_ski' | 'scene3_annulation') => {
    setRequestedScenario(scenario);
    setActiveTab('situations');
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Banner */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-emerald-800" />
            Données du foyer & Documents My Guaranties
          </div>
          <button
            onClick={resetDemoData}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Réinitialiser la démo
          </button>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900 tracking-tight">
          Foyer Thomas & Camille
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed max-w-2xl">
          Frère Tuck réutilise les faits déclarés, les personnes à charge et les contrats certifiés disponibles dans My Guaranties pour éviter de vous reposer des questions déjà résolues.
        </p>

        {/* Mode Switcher */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-600">
            État actuel :{' '}
            <span className="font-semibold text-slate-900">
              {isZeroDataMode
                ? 'Mode « Découvrir sans données » (Foyer vierge)'
                : 'Foyer complet de démonstration (2 adultes, 1 enfant, séjour ski)'}
            </span>
          </div>

          <button
            onClick={() => setZeroDataMode(!isZeroDataMode)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              isZeroDataMode
                ? 'bg-emerald-800 text-white hover:bg-emerald-900'
                : 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300'
            }`}
          >
            {isZeroDataMode ? 'Recharger le foyer de démo' : 'Basculer en « Sans données »'}
          </button>
        </div>
      </section>

      {!isZeroDataMode ? (
        <>
          {/* Members & Stay in 2 columns */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Box 1: Members */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    <Users className="w-4 h-4" />
                  </div>
                  <h2 className="text-sm font-bold text-slate-900">Membres du foyer</h2>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">Source : Profil My Guaranties</span>
              </div>

              <div className="space-y-2">
                {members.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{m.name}</div>
                      <div className="text-slate-500 capitalize">{m.role} · {m.age} ans</div>
                    </div>
                    <span className="text-[10px] bg-slate-200 text-slate-700 font-semibold px-2 py-0.5 rounded">
                      Assuré
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Box 2: Stay project */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <h2 className="text-sm font-bold text-slate-900">Séjour à venir</h2>
                </div>
                <span className="text-[11px] text-slate-500 font-medium">Source : Déclaratif</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Destination :</span>
                  <span className="font-bold text-slate-900">{stay.destination}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Dates :</span>
                  <span className="font-medium text-slate-800">15–22 février 2025</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Règlement :</span>
                  <span className="font-semibold text-emerald-800">
                    {stay.paymentMethod === 'carte_gold'
                      ? 'Carte Gold Mastercard (100%)'
                      : stay.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Budget engagé :</span>
                  <span className="font-bold text-slate-900">{stay.totalCost} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Hors-piste :</span>
                  <span className="font-medium text-slate-800">
                    {stay.offPistePlanned === 'non'
                      ? 'Non (pistes uniquement)'
                      : stay.offPistePlanned === 'oui_guide'
                      ? 'Oui, avec guide ESF'
                      : 'Oui, individuel sans guide'}
                  </span>
                </div>
              </div>

              <button
                onClick={openHouseholdManager}
                className="w-full py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold transition-colors"
              >
                Modifier les détails du séjour
              </button>
            </div>
          </div>

          {/* Section: Documents & Notices in My Guaranties */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Contrats et notices disponibles dans My Guaranties
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Documents numérisés et certifiés servant de base légale aux analyses de Frère Tuck.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => openWorkspaceModal('drive')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                  <span>Rechercher sur Google Drive</span>
                </button>

                <button
                  onClick={() =>
                    hasComplementaryDoc
                      ? removeComplementaryDocument()
                      : addComplementaryDocument()
                  }
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    hasComplementaryDoc
                      ? 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
                      : 'bg-emerald-800 text-white hover:bg-emerald-900'
                  }`}
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  {hasComplementaryDoc ? 'Retirer attestation' : 'Ajouter attestation'}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{doc.title}</span>
                      <span className="text-[10px] bg-slate-200 text-slate-800 font-semibold px-2 py-0.5 rounded">
                        {doc.contractNumber}
                      </span>
                    </div>
                    <div className="text-slate-500">
                      Émetteur : {doc.issuer} · {doc.uploadedAt}
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {doc.clauses.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => openProofModal(c)}
                          className="bg-white hover:bg-emerald-50 text-emerald-800 border border-slate-200 hover:border-emerald-300 px-2 py-0.5 rounded text-[11px] font-medium transition-colors flex items-center gap-1"
                        >
                          <FileText className="w-3 h-3 text-emerald-700" />
                          <span>{c.topic} (p. {c.page})</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <span className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    Numérisé My Guaranties
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Launchers for Scenarios */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-3">
            <div className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
              Moments de vie pré-configurés
            </div>
            <div className="text-sm font-semibold text-slate-100">
              Testez la réutilisation instantanée des données du foyer dans deux situations concrètes :
            </div>

            <div className="grid sm:grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => handleLaunchScenario('scene1_ski')}
                className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-left border border-slate-700 transition-all group"
              >
                <div className="text-xs font-bold text-emerald-300 group-hover:text-emerald-200">
                  Scène 1 : Je prépare mon séjour au ski
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Vérification des secours sur piste, hors-piste et rapatriement des enfants.
                </div>
              </button>

              <button
                onClick={() => handleLaunchScenario('scene3_annulation')}
                className="p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-left border border-slate-700 transition-all group"
              >
                <div className="text-xs font-bold text-emerald-300 group-hover:text-emerald-200">
                  Scène 3 : Mon enfant est malade, j’annule
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Calcul des 1 500 € récupérables et passage du dossier à Robin.
                </div>
              </button>
            </div>
          </div>
        </>
      ) : (
        /* Zero data state */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto">
            <h2 className="text-base font-bold text-slate-900">
              Aucun profil ou document chargé
            </h2>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Vous êtes en mode « Découvrir sans données ». Ce mode permet d'observer comment Frère Tuck guide un utilisateur sans historique en lui indiquant les pièces et faits indispensables à renseigner.
            </p>
          </div>
          <button
            onClick={() => setZeroDataMode(false)}
            className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Recharger le foyer de démonstration (Thomas & Camille)
          </button>
        </div>
      )}
    </div>
  );
};

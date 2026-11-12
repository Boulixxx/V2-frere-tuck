import React from 'react';
import { useHousehold } from '../context/HouseholdContext';
import {
  ShieldCheck,
  AlertTriangle,
  Layers,
  FileText,
  CheckCircle2,
  HelpCircle,
  PlusCircle,
  Trash2,
  Calendar,
  Settings2,
  ArrowRight,
  ExternalLink,
  CreditCard,
  Home,
  HeartPulse,
  Backpack,
  Shield,
} from 'lucide-react';

export const ProtectionsAudit: React.FC = () => {
  const {
    isZeroDataMode,
    setZeroDataMode,
    stay,
    updateStay,
    auditItems,
    documents,
    hasComplementaryDoc,
    addComplementaryDocument,
    removeComplementaryDocument,
    openProofModal,
    openOverlapModal,
    openHouseholdManager,
    openWorkspaceModal,
  } = useHousehold();

  if (isZeroDataMode) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Audit indisponible : Aucune donnée foyer chargée
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
              Pour réaliser l’audit de vos protections et détecter les zones inconnues ou les chevauchements, Frère Tuck doit connaître vos contrats actifs et vos projets en cours.
            </p>
          </div>
        </div>

        <button
          onClick={() => setZeroDataMode(false)}
          className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors"
        >
          Recharger le foyer de démonstration (Thomas, Camille, Léo)
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Banner */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            Audit 360° du foyer & de vos projets
          </div>
          <span className="text-xs text-slate-500">
            Foyer Thomas & Camille · {documents.length} contrats My Guaranties analysés
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900 tracking-tight">
            Faire le point sur mes protections
          </h1>
          <button
            type="button"
            onClick={() => openWorkspaceModal('sheets')}
            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
          >
            <svg className="w-3.5 h-3.5 text-emerald-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <line x1="3" x2="21" y1="9" y2="9" />
              <line x1="3" x2="21" y1="15" y2="15" />
              <line x1="9" x2="9" y1="3" y2="21" />
              <line x1="15" x2="15" y1="3" y2="21" />
            </svg>
            <span>Exporter vers Google Sheets</span>
          </button>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed max-w-2xl">
          Frère Tuck rapproche votre profil familial et vos projets de l’ensemble de vos contrats : <span className="font-semibold text-slate-900">assurance habitation, mutuelle santé, assurance scolaire, prévoyance et carte bancaire</span>. Retrouvez ici les protections acquises, les vérifications à faire et les garanties qui se recoupent.
        </p>

        {/* Live Simulation Controls Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50/80 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-4 rounded-b-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <Settings2 className="w-4 h-4 text-slate-500" />
            <span>Simulateur d’audit en direct :</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Quick off-piste toggle */}
            <button
              onClick={() =>
                updateStay({
                  offPistePlanned:
                    stay.offPistePlanned === 'non' ? 'oui_seul' : 'non',
                })
              }
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                stay.offPistePlanned !== 'non'
                  ? 'bg-amber-100 text-amber-900 border-amber-300 font-semibold'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300'
              }`}
            >
              {stay.offPistePlanned !== 'non'
                ? '⛷️ Hors-piste activé'
                : '+ Ajouter hors-piste au séjour'}
            </button>

            {/* Quick doc toggle */}
            <button
              onClick={() =>
                hasComplementaryDoc
                  ? removeComplementaryDocument()
                  : addComplementaryDocument()
              }
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                hasComplementaryDoc
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300'
              }`}
            >
              {hasComplementaryDoc
                ? '📄 Attestation Neige active (Retirer)'
                : '+ Ajouter attestation Neige (Résout rapatriement)'}
            </button>
          </div>
        </div>
      </section>

      {/* PRIORITY 1: DÉCISIONS ET VÉRIFICATIONS QUI CONCERNENT LE FOYER MAINTENANT */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Priorités actuelles du foyer
            </h2>
            <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              Séjour Les Menuires
            </span>
          </div>
          <span className="text-xs text-slate-500">Classé par niveau d'urgence</span>
        </div>

        {/* 1. SECOURS SUR PISTE: COUVERTURE CROISÉE CARTE GOLD + ASSURANCE SCOLAIRE */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    Secours sur piste : Vous avez déjà une protection
                  </h3>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                  <span className="text-emerald-700 font-medium">Carte Gold (5 000 €) + Assurance Scolaire Léo (2 500 €)</span>
                  <span aria-hidden="true">·</span>
                  <span>Thomas, Camille, Léo</span>
                </div>
              </div>
            </div>

            <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md">
              Protection acquise
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Les frais réels de recherche en montagne et de premier transport médicalisé vers le centre de soins le plus proche sont garantis jusqu’à <span className="font-semibold text-slate-900">5 000 € par événement sans franchise</span> par votre Carte Gold. L’Assurance Scolaire de Léo apporte en complément <span className="font-semibold text-slate-900">2 500 € supplémentaires</span> pour votre enfant (Art. 5.2).
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-slate-100">
            <span className="text-slate-500">
              Condition : séjour à plus de 50 km de votre domicile principal (respecté pour Les Menuires).
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => openProofModal('clause-secours-piste')}
                className="text-emerald-800 hover:underline font-semibold flex items-center gap-1"
              >
                <FileText className="w-3.5 h-3.5" />
                Notice Carte Gold (p. 12)
              </button>
              <button
                onClick={() => openProofModal('clause-scolaire-secours')}
                className="text-sky-800 hover:underline font-semibold flex items-center gap-1"
              >
                <FileText className="w-3.5 h-3.5" />
                Assurance Scolaire (p. 5)
              </button>
            </div>
          </div>
        </div>

        {/* 2. RAPATRIEMENT DES ENFANTS : UN POINT EST À VÉRIFIER AVANT LE DÉPART */}
        <div
          className={`rounded-2xl border p-4 sm:p-5 shadow-sm space-y-3 ${
            hasComplementaryDoc
              ? 'bg-white border-emerald-300'
              : 'bg-white border-amber-300'
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="flex items-start gap-3">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  hasComplementaryDoc
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {hasComplementaryDoc ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <AlertTriangle className="w-4 h-4" />
                )}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {hasComplementaryDoc
                    ? 'Rapatriement de Léo (7 ans) : Couvert par votre nouveau document'
                    : 'Rapatriement des enfants : Un point est à vérifier avant le départ'}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                  <span
                    className={
                      hasComplementaryDoc
                        ? 'text-emerald-700 font-medium'
                        : 'text-amber-800 font-medium'
                    }
                  >
                    Source : {hasComplementaryDoc ? 'Attestation Neige & Montagne' : 'Notice Carte Gold p. 18'}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Concerne : Léo (7 ans)</span>
                </div>
              </div>
            </div>

            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                hasComplementaryDoc
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-900'
              }`}
            >
              {hasComplementaryDoc ? 'Résolu & Couvert' : 'À vérifier avant départ'}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {hasComplementaryDoc ? (
              <span>
                L'attestation Neige & Montagne récemment ajoutée organise la garde sur place (80 €/jour) ou le billet de retour avec accompagnateur dédié dès lors qu'un seul parent est immobilisé. La restriction de la carte bancaire est neutralisée.
              </span>
            ) : (
              <span>
                La notice de votre Carte Gold prévoit le rapatriement des mineurs uniquement si les <span className="font-semibold text-slate-900">deux parents accompagnateurs sont simultanément hospitalisés plus de 48h</span>. Si un seul parent est blessé, l’autre est supposé garder l'enfant sans aide au retour.
              </span>
            )}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-slate-100">
            <span className="text-slate-500">
              {hasComplementaryDoc
                ? 'Nouvelle source active dans My Guaranties'
                : 'Document à retrouver : Notice assistance séjour ou garantie familiale spécifique'}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  openProofModal(
                    hasComplementaryDoc
                      ? 'clause-neige-garde-enfants'
                      : 'clause-rapatriement-enfants'
                  )
                }
                className="text-emerald-800 hover:underline font-semibold flex items-center gap-1"
              >
                <FileText className="w-3.5 h-3.5" />
                {hasComplementaryDoc ? 'Voir extrait attestation' : 'Voir la clause restrictive (p. 18)'}
              </button>

              {!hasComplementaryDoc && (
                <button
                  onClick={addComplementaryDocument}
                  className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md hover:bg-emerald-100 font-semibold flex items-center gap-1"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Simuler l’ajout d’attestation
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 3. CHEVAUCHEMENT : DEUX PROTECTIONS PEUVENT SE RECOUPER */}
        <div className="bg-white rounded-2xl border border-indigo-200 p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center shrink-0 mt-0.5">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Responsabilité Civile : Deux protections peuvent se recouper
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                  <span className="text-indigo-700 font-medium">Contrat Habitation MRH vs Carte Gold</span>
                  <span aria-hidden="true">·</span>
                  <span>Dommages aux tiers en villégiature</span>
                </div>
              </div>
            </div>

            <span className="text-xs font-semibold bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-md">
              Chevauchement à examiner
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Votre assurance Multirisque Habitation et votre Carte Gold couvrent toutes deux les conséquences pécuniaires des dommages causés à autrui lors de votre séjour. Leurs plafonds et leurs conditions de déclenchement diffèrent sensiblement.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-slate-100">
            <span className="text-slate-500">
              Arbitrage Frère Tuck : Déclarer en premier l'assurance Habitation (franchise plus basse, plafond 20M€).
            </span>

            <button
              onClick={openOverlapModal}
              className="px-3.5 py-1.5 bg-indigo-900 hover:bg-indigo-950 text-white rounded-lg font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>Ouvrir l’écran de comparaison</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 4. SOINS ET SANTÉ EN STATION (COMPLÉMENTAIRE SANTÉ) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center shrink-0 mt-0.5">
                <HeartPulse className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Médecine de station, radiologie & pharmacie : Complémentaire Santé
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                  <span className="text-rose-700 font-medium">Harmonie Mutuelle · Niveau Confort Plus</span>
                  <span aria-hidden="true">·</span>
                  <span>Thomas, Camille, Léo</span>
                </div>
              </div>
            </div>

            <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-md">
              Couvert à 200%
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Les consultations des médecins généralistes et spécialistes en station de ski comportent souvent des dépassements d'honoraires. Votre mutuelle rembourse jusqu’à <span className="font-semibold text-slate-900">200% du barème de la Sécurité sociale</span> et prend en charge le forfait hospitalier aux frais réels en cas d'hospitalisation d'urgence.
          </p>

          <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
            <span className="text-slate-500">
              Pensez à emporter votre attestation de tiers-payant sur smartphone.
            </span>
            <button
              onClick={() => openProofModal('clause-mutuelle-montagne')}
              className="text-emerald-800 hover:underline font-semibold flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5" />
              Notice Mutuelle (p. 6)
            </button>
          </div>
        </div>

        {/* DYNAMIC ITEM IF HORS PISTE IS ACTIVE */}
        {stay.offPistePlanned !== 'non' && (
          <div className="bg-white rounded-2xl border border-amber-300 p-4 sm:p-5 shadow-sm space-y-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Hors-piste déclaré au programme du séjour
                  </h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Source : Déclaration de Thomas · Modification récente du profil
                  </div>
                </div>
              </div>

              <span className="text-xs font-semibold bg-amber-100 text-amber-900 px-2.5 py-1 rounded-md">
                Condition stricte
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Le hors-piste sans encadrement est formellement exclu de votre Carte Gold (Article 4.2). Pour skier hors-piste en sécurité financière, vous devez soit être accompagné par un moniteur diplômé d’État, soit disposer d’une garantie Neige dédiée. Vos dommages corporels restent couverts par votre Garantie Accidents de la Vie (GAV).
            </p>

            <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
              <button
                onClick={() => openProofModal('clause-hors-piste')}
                className="text-emerald-800 hover:underline font-semibold flex items-center gap-1"
              >
                <FileText className="w-3.5 h-3.5" />
                Voir la clause hors-piste (Notice p. 14)
              </button>
              <button
                onClick={() => updateStay({ offPistePlanned: 'non' })}
                className="text-slate-500 hover:underline"
              >
                Retirer le hors-piste du séjour
              </button>
            </div>
          </div>
        )}
      </section>

      {/* OVERVIEW OF ALL IDENTIFIED GUARANTEES IN HOUSEHOLD */}
      <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Inventaire complet des {documents.length} contrats du foyer
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Chaque contrat est scanné lors de vos démarches pour trouver la protection la plus avantageuse.
            </p>
          </div>
          <button
            onClick={openHouseholdManager}
            className="text-xs text-emerald-800 hover:underline font-semibold"
          >
            Gérer les contrats
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {/* Contrat 1: Habitation */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Home className="w-3.5 h-3.5 text-indigo-700" />
                Assurance Habitation Foyer
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                Active
              </span>
            </div>
            <div className="text-slate-600 leading-relaxed text-[11px]">
              • Responsabilité civile villégiature (20 000 000 €)<br />
              • Dégâts locatifs au chalet (500 000 €)<br />
              • Dommages corporels illimités (franchise 120 €)<br />
              • Valable sans paiement par carte bancaire
            </div>
          </div>

          {/* Contrat 2: Carte Gold */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-amber-700" />
                Carte Gold Mastercard
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                Active
              </span>
            </div>
            <div className="text-slate-600 leading-relaxed text-[11px]">
              • Secours sur piste de ski (5 000 € sans franchise)<br />
              • Annulation de séjour maladie (5 000 €/an)<br />
              • Rapatriement médicalisé sous conditions<br />
              • Nécessite règlement préalable par CB
            </div>
          </div>

          {/* Contrat 3: Complémentaire Santé */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <HeartPulse className="w-3.5 h-3.5 text-rose-700" />
                Complémentaire Santé
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                Active
              </span>
            </div>
            <div className="text-slate-600 leading-relaxed text-[11px]">
              • Dépassements honoraires médecins station (200%)<br />
              • Radiographies, plâtres et soins post-chute<br />
              • Forfait hospitalier aux frais réels<br />
              • Tiers-payant national pour tout le foyer
            </div>
          </div>

          {/* Contrat 4: Assurance Scolaire Léo */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Backpack className="w-3.5 h-3.5 text-sky-700" />
                Assurance Scolaire (Léo)
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                Active
              </span>
            </div>
            <div className="text-slate-600 leading-relaxed text-[11px]">
              • Frais de recherche & secours montagne (2 500 €)<br />
              • Individuelle accident corporel 24h/24 en vacances<br />
              • Capital invalidité jusqu'à 150 000 € pour Léo<br />
              • Rapatriement sanitaire de l'enfant
            </div>
          </div>

          {/* Contrat 5: Garantie Accidents de la Vie */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-700" />
                Garantie Accidents Vie (GAV)
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                Active
              </span>
            </div>
            <div className="text-slate-600 leading-relaxed text-[11px]">
              • Préjudice corporel permanent suite à chute de ski<br />
              • Intervention dès 5% d'incapacité (AIPP)<br />
              • Jusqu'à 1 000 000 € d'indemnisation par victime<br />
              • Couvre Thomas, Camille et Léo sans tiers requis
            </div>
          </div>

          {/* Optional Complement */}
          {hasComplementaryDoc && (
            <div className="p-3.5 rounded-xl border border-emerald-300 bg-emerald-50/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  Attestation Neige Famille
                </span>
                <span className="text-[10px] bg-emerald-200 text-emerald-900 font-semibold px-2 py-0.5 rounded">
                  Ajoutée
                </span>
              </div>
              <div className="text-emerald-900 leading-relaxed text-[11px]">
                • Secours hors-piste individuel illimités<br />
                • Garde de Léo (80 €/j) dès hospitalisation d'un parent<br />
                • Rapatriement de l'enfant facilité
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

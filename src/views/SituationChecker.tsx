import React, { useState, useEffect } from 'react';
import { useHousehold } from '../context/HouseholdContext';
import {
  Search,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  HelpCircle,
  ArrowRight,
  FileText,
  BookmarkPlus,
  CheckCircle2,
  Calendar,
  CreditCard,
  Send,
  XCircle,
  FileCheck,
  Users,
  HeartPulse,
  Backpack,
  Home,
  Shield,
  Layers,
} from 'lucide-react';
import { ClaimPreparationData, ContractScanResult } from '../types';
import { scanHouseholdContractsForSituation } from '../data/mockData';

export const SituationChecker: React.FC = () => {
  const {
    isZeroDataMode,
    stay,
    updateStay,
    members,
    openProofModal,
    addAuditItem,
    auditItems,
    openRobinModal,
    hasComplementaryDoc,
    openHouseholdManager,
    openOverlapModal,
    setZeroDataMode,
    requestedScenario,
    setRequestedScenario,
  } = useHousehold();

  // Active situation selection
  const [selectedScenario, setSelectedScenario] = useState<
    'ski_preparation' | 'trip_cancellation' | 'theft_chalet' | 'custom_unknown' | null
  >('ski_preparation');

  const [theftCircumstance, setTheftCircumstance] = useState<
    'effraction_chalet' | 'sans_effraction' | 'transport_public'
  >('effraction_chalet');

  const [searchQuery, setSearchQuery] = useState(
    'Je pars au ski en famille. Est-ce que je suis déjà couvert ?'
  );
  const [savedCheckSuccess, setSavedCheckSuccess] = useState(false);
  const [activeContractFilter, setActiveContractFilter] = useState<string>('all');

  // Sync when requested from outside (e.g. home shortcut or header)
  useEffect(() => {
    if (requestedScenario === 'scene1_ski') {
      setSelectedScenario('ski_preparation');
      setSearchQuery('Je pars au ski en famille. Est-ce que je suis déjà couvert ?');
      setRequestedScenario(null);
    } else if (requestedScenario === 'scene3_annulation') {
      setSelectedScenario('trip_cancellation');
      setSearchQuery('Mon enfant est malade, je dois annuler le séjour. Que puis-je récupérer ?');
      setRequestedScenario(null);
    }
  }, [requestedScenario, setRequestedScenario]);

  // Handle free text query search
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.toLowerCase();
    if (query.includes('annul') || query.includes('malade') || query.includes('recuperer')) {
      setSelectedScenario('trip_cancellation');
    } else if (
      query.includes('vol') ||
      query.includes('bagage') ||
      query.includes('materiel') ||
      query.includes('ski vole') ||
      query.includes('chalet')
    ) {
      setSelectedScenario('theft_chalet');
    } else if (
      query.includes('ski') ||
      query.includes('sejour') ||
      query.includes('neige') ||
      query.includes('couvert') ||
      query.includes('contrat')
    ) {
      setSelectedScenario('ski_preparation');
    } else {
      setSelectedScenario('custom_unknown');
    }
  };

  const handleSelectQuickPrompt = (
    prompt: string,
    type: 'ski_preparation' | 'trip_cancellation' | 'theft_chalet' | 'custom_unknown'
  ) => {
    setSearchQuery(prompt);
    setSelectedScenario(type);
  };

  const handleSaveRepatriationAuditItem = () => {
    addAuditItem({
      id: 'audit-rapatriement-enfants',
      title: 'Rapatriement et garde de Léo (7 ans) en cas d’accident d’un parent',
      category: 'sejour_ski',
      status: hasComplementaryDoc ? 'couvert' : 'a_verifier',
      source: 'document',
      summary: hasComplementaryDoc
        ? 'Garde et retour de Léo couverts dès l’hospitalisation d’un parent grâce à l’attestation Neige.'
        : 'Point à vérifier avant le départ : la notice Carte Gold n’organise le retour de Léo que si les DEUX parents sont simultanément hospitalisés.',
      actionRequired: hasComplementaryDoc
        ? 'Conserver l’attestation avec les forfaits.'
        : 'Consulter la garantie d’assistance rapatriement familiale ou souscrire un ticket Carré Neige.',
      clauseRef: hasComplementaryDoc ? 'clause-neige-garde-enfants' : 'clause-rapatriement-enfants',
      attachedToStay: true,
    });
    setSavedCheckSuccess(true);
    setTimeout(() => setSavedCheckSuccess(false), 3000);
  };

  // Systematic multi-contract scan for the current situation
  const scannedContracts: ContractScanResult[] =
    selectedScenario === 'ski_preparation'
      ? scanHouseholdContractsForSituation('ski_stay', stay, hasComplementaryDoc)
      : selectedScenario === 'trip_cancellation'
      ? scanHouseholdContractsForSituation('cancellation', stay, hasComplementaryDoc)
      : selectedScenario === 'theft_chalet'
      ? scanHouseholdContractsForSituation('theft', stay, hasComplementaryDoc)
      : [];

  // Preparation of Robin claim payload for theft
  const handlePrepareTheftClaim = () => {
    const isEffraction = theftCircumstance === 'effraction_chalet';
    const totalClaim = 1400;
    const deductible = isEffraction ? 100 : 0;
    const payout = isEffraction ? totalClaim - deductible : 0;

    const data: ClaimPreparationData = {
      situationTitle: 'Déclaration de vol de matériel de ski au chalet des Menuires',
      insuredPerson: 'Thomas, Camille et Léo (Habitation Multirisque Foyer)',
      totalCost: totalClaim,
      refundedAmount: 0,
      remainingAmount: totalClaim,
      deductibleAmount: deductible,
      estimatedPayout: payout,
      ceilingAmount: 4000,
      certaintyLevel: isEffraction ? 'eleve' : 'a_confirmer',
      proofsUsed: [
        {
          name: 'Contrat Habitation Multirisque',
          type: 'document',
          details: 'Article 6 — Vol d’effets personnels et matériel de ski en villégiature',
        },
        {
          name: 'Bail de villégiature Les Menuires',
          type: 'document',
          details: 'Contrat de location meublée saisonnière du 15 au 22 février 2025',
        },
        {
          name: 'Factures d’achat & location des skis',
          type: 'document',
          details: 'Justificatifs de valeur du matériel dérobé (2 paires de skis + casques) : 1 400 €',
        },
      ],
      missingProofs: [
        {
          name: 'Récépissé de dépôt de plainte pour vol avec effraction',
          howToGet:
            'À déposer sous 48h auprès de la brigade de gendarmerie de Saint-Martin-de-Belleville / Les Menuires.',
          mandatory: true,
        },
      ],
      draftLetter: `Madame, Monsieur le gestionnaire sinistres Habitation Multirisque,

Je soussigné Thomas, titulaire du contrat Habitation Multirisque n° MRH-FOYER-77312, vous déclare par la présente un sinistre de vol avec effraction survenu le 17/02/2025 dans le casier à skis privatif fermé à clé attenant à notre hébergement temporaire de villégiature situé aux Menuires (Savoie).

Conformément à l’Article 6 de nos Conditions Générales (« Vol d'effets personnels et matériel de ski en villégiature »), nous sollicitons l'indemnisation du matériel de glisse dérobé pour un montant total de 1 400,00 €.

Déduction faite de la franchise contractuelle de 100,00 €, nous sollicitons le versement de 1 300,00 €.

Pièces jointes :
- Récépissé du procès-verbal de plainte pour vol avec effraction
- Factures d'achat et ticket de location du matériel
- Bail de location saisonnière

Veuillez agréer l'expression de mes salutations distinguées.
Thomas`,
    };

    openRobinModal(data);
  };

  // Preparation of Robin claim payload
  const handlePrepareClaim = () => {
    const isGold = stay.paymentMethod === 'carte_gold';
    const isMedical = stay.cancellationReason === 'maladie_enfant';
    const remainingAmount = stay.totalCost - stay.refundedByProvider;
    const deductible = isGold ? 50 : 0;
    const estimatedPayout = isGold && isMedical ? remainingAmount - deductible : 0;

    const data: ClaimPreparationData = {
      situationTitle: 'Annulation du séjour aux Menuires pour maladie de Léo (7 ans)',
      insuredPerson: 'Thomas, Camille et Léo (Enfant mineur à charge)',
      totalCost: stay.totalCost,
      refundedAmount: stay.refundedByProvider,
      remainingAmount,
      deductibleAmount: deductible,
      estimatedPayout,
      ceilingAmount: 5000,
      certaintyLevel: isGold && isMedical && stay.medicalCertAvailable ? 'eleve' : 'a_confirmer',
      proofsUsed: [
        {
          name: 'Contrat hébergement Les Menuires',
          type: 'document',
          details: 'Facture de séjour du 15/02/2025 au 22/02/2025 · 1 800,00 € TTC',
        },
        {
          name: 'Décompte de remboursement voyagiste',
          type: 'document',
          details: 'Avoir / remboursement partiel émis le 12/02/2025 · 300,00 € TTC',
        },
        {
          name: 'Moyen de règlement',
          type: 'document',
          details: isGold
            ? 'Carte Gold Mastercard (débit vérifié sur relevé bancaire de janvier 2025)'
            : 'Moyen de paiement déclaré : ' + stay.paymentMethod,
        },
        {
          name: 'Consultation pédiatrique Léo',
          type: 'document',
          details: 'Complémentaire Santé Harmonie : télétransmission feuille de soins validée',
        },
      ],
      missingProofs: [
        {
          name: 'Certificat médical d’inaptitude temporaire au voyage',
          howToGet:
            'À faire établir par le médecin traitant de Léo avant la date initiale de départ (mentionnant l’inaptitude formelle au séjour en altitude).',
          mandatory: true,
        },
      ],
      draftLetter: `Madame, Monsieur l'assureur Mondial Assistance / Carte Gold,

Je soussigné Thomas, titulaire de la Carte Gold Mastercard n° CB-GOLD-84920-FR, vous notifie par la présente l'annulation de notre séjour familial prévu du 15/02/2025 au 22/02/2025 aux Menuires pour un montant total de 1 800,00 €.

Ce voyage a été intégralement réglé au moyen de ma Carte Gold assurée. Conformément à l'Article 7.1 de la notice d'information (« Annulation et modification de voyage »), cette annulation est motivée par la survenance d'une maladie imprévue de mon fils mineur à charge, Léo (7 ans), justifiée par le certificat médical ci-joint attestant de sa contre-indication formelle au déplacement.

L'hébergeur m'ayant remboursé la somme de 300,00 €, le préjudice financier direct restant contractuellement à ma charge s'élève à 1 500,00 €. 

Déduction faite de la franchise contractuelle de 50,00 €, je sollicite le versement de l'indemnité compensatoire de 1 450,00 € sur mon compte bancaire associé à la carte.

Pièces jointes :
- Facture acquittée du séjour (1 800 €)
- Attestation de remboursement partiel (300 €)
- Relevé porteur attestant du paiement par Carte Gold
- Certificat médical du praticien

Veuillez agréer l'expression de mes salutations distinguées.
Thomas`,
    };

    openRobinModal(data);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'bancaire':
        return <CreditCard className="w-3.5 h-3.5 text-amber-700" />;
      case 'habitation':
        return <Home className="w-3.5 h-3.5 text-indigo-700" />;
      case 'sante':
        return <HeartPulse className="w-3.5 h-3.5 text-rose-700" />;
      case 'scolaire':
        return <Backpack className="w-3.5 h-3.5 text-sky-700" />;
      case 'prevoyance':
        return <Shield className="w-3.5 h-3.5 text-emerald-700" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-slate-700" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Search Header Banner */}
      <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
        <div className="max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            J’ai une situation à vérifier
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900 tracking-tight">
            Quelle situation souhaitez-vous analyser ?
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            Frère Tuck rapproche votre question de <span className="font-semibold text-slate-900">l’ensemble des contrats de votre foyer</span> (habitation, santé, scolaire, prévoyance et carte bancaire) pour déceler qui vous protège et où se trouvent les failles.
          </p>
        </div>

        {/* Search input form */}
        <form onSubmit={handleSearchSubmit} className="mt-4 flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ex: Je pars au ski en famille, suis-je couvert ?"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 btn-primary rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 shrink-0"
          >
            <span>Analyser</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick clickable examples */}
        <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium text-[11px]">Exemples cliquables :</span>
          <button
            type="button"
            onClick={() =>
              handleSelectQuickPrompt(
                'Je pars au ski en famille. Est-ce que je suis déjà couvert ?',
                'ski_preparation'
              )
            }
            className={`px-2.5 py-1 rounded-md text-xs transition-colors border ${
              selectedScenario === 'ski_preparation'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-medium'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
            }`}
          >
            🎿 Séjour ski en famille (Multi-contrats)
          </button>

          <button
            type="button"
            onClick={() =>
              handleSelectQuickPrompt(
                'Mon enfant est malade, je dois annuler le séjour. Que puis-je récupérer ?',
                'trip_cancellation'
              )
            }
            className={`px-2.5 py-1 rounded-md text-xs transition-colors border ${
              selectedScenario === 'trip_cancellation'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-medium'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
            }`}
          >
            🩺 Annulation séjour maladie (Recours complet)
          </button>

          <button
            type="button"
            onClick={() =>
              handleSelectQuickPrompt(
                'On m’a volé mon matériel de ski au chalet : quel contrat m’indemnise ?',
                'theft_chalet'
              )
            }
            className={`px-2.5 py-1 rounded-md text-xs transition-colors border ${
              selectedScenario === 'theft_chalet'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-medium'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
            }`}
          >
            🧳 Vol de matériel au chalet (MRH vs Carte Gold)
          </button>

          <button
            type="button"
            onClick={() =>
              handleSelectQuickPrompt(
                'Dégât des eaux causé dans une location de vacances',
                'custom_unknown'
              )
            }
            className={`px-2.5 py-1 rounded-md text-xs transition-colors border ${
              selectedScenario === 'custom_unknown'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300 font-medium'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
            }`}
          >
            🏠 Dégât des eaux location
          </button>
        </div>
      </section>

      {/* ZERO DATA MODE WARNING IF ACTIVE */}
      {isZeroDataMode && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-amber-950">
                Découvrir sans données : 3 informations indispensables manquent
              </h2>
              <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                Vous explorez actuellement Frère Tuck avec un dossier vierge. Pour analyser vos protections sur tous vos contrats (« {searchQuery} »), Frère Tuck a besoin de connaître :
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-2.5 text-xs">
            <div className="p-3 bg-white/80 rounded-xl border border-amber-200">
              <div className="font-semibold text-amber-950 flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5 text-amber-700" />
                1. Le séjour & dates
              </div>
              <p className="text-slate-600 text-[11px]">
                Lieu du séjour, distance depuis le domicile principal (&gt; 50 km requis pour les secours carte).
              </p>
            </div>

            <div className="p-3 bg-white/80 rounded-xl border border-amber-200">
              <div className="font-semibold text-amber-950 flex items-center gap-1.5 mb-1">
                <Users className="w-3.5 h-3.5 text-amber-700" />
                2. Les voyageurs
              </div>
              <p className="text-slate-600 text-[11px]">
                Noms et liens de parenté (titulaire, conjoint, enfants de moins de 25 ans à charge).
              </p>
            </div>

            <div className="p-3 bg-white/80 rounded-xl border border-amber-200">
              <div className="font-semibold text-amber-950 flex items-center gap-1.5 mb-1">
                <CreditCard className="w-3.5 h-3.5 text-amber-700" />
                3. Les contrats existants
              </div>
              <p className="text-slate-600 text-[11px]">
                Assurance habitation, mutuelle santé, assurance scolaire, carte bancaire, etc.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setZeroDataMode(false)}
              className="px-4 py-2 btn-primary text-xs font-semibold rounded-xl transition-colors"
            >
              Recharger le foyer de démonstration (Thomas, Camille, Léo)
            </button>
            <button
              onClick={openHouseholdManager}
              className="text-xs text-amber-900 hover:underline font-medium"
            >
              Ou renseigner manuellement ces données
            </button>
          </div>
        </div>
      )}

      {/* MULTI-CONTRACT SCOPE PANEL: EXAMEN SYSTÉMATIQUE DE TOUS LES CONTRATS DU FOYER */}
      {!isZeroDataMode && (selectedScenario === 'ski_preparation' || selectedScenario === 'trip_cancellation') && (
        <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-emerald-800 text-amber-200 flex items-center justify-center font-bold text-xs">
                FT
              </div>
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Examen systématique des {scannedContracts.length} contrats du foyer
                </h2>
                <div className="text-[11px] text-slate-500">
                  Frère Tuck ne se limite pas à un seul moyen : chaque contrat a été interrogé pour cette situation.
                </div>
              </div>
            </div>
            <button
              onClick={openHouseholdManager}
              className="text-emerald-800 hover:underline font-medium text-xs"
            >
              Gérer mes contrats
            </button>
          </div>

          {/* Grid of all household contracts analyzed */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1 text-xs">
            {scannedContracts.map((c) => (
              <div
                key={c.contractId}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between space-y-2 hover:bg-white transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5 truncate">
                      {getCategoryIcon(c.category)}
                      {c.contractName}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded shrink-0 ${
                        c.status === 'couvre_totalement'
                          ? 'bg-emerald-100 text-emerald-800'
                          : c.status === 'couvre_partiellement'
                          ? 'bg-amber-100 text-amber-900'
                          : c.status === 'a_verifier'
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {c.status === 'couvre_totalement'
                        ? 'Actif'
                        : c.status === 'couvre_partiellement'
                        ? 'Partiel'
                        : c.status === 'a_verifier'
                        ? 'À vérifier'
                        : 'Non concerné'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {c.contribution}
                  </p>
                </div>

                {c.clauseRef && (
                  <button
                    onClick={() => openProofModal(c.clauseRef!)}
                    className="text-[11px] text-emerald-800 hover:underline font-semibold flex items-center gap-1 pt-1 border-t border-slate-200/60"
                  >
                    <FileText className="w-3 h-3" />
                    Voir la clause certifiée
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* SCENE 1: JE PRÉPARE MON SÉJOUR AU SKI */}
      {!isZeroDataMode && selectedScenario === 'ski_preparation' && (
        <div className="space-y-5 animate-in fade-in duration-300">
          {/* Context Recognition Banner */}
          <div className="bg-slate-100/80 border border-slate-200/80 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span className="text-slate-600">Dossier identifié :</span>
              <span className="font-semibold text-slate-900">
                Séjour Les Menuires (15–22 fév. 2025)
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-slate-600">
                3 personnes (Thomas, Camille, Léo)
              </span>
            </div>
            <button
              onClick={openHouseholdManager}
              className="text-emerald-800 hover:underline font-medium text-[11px]"
            >
              Modifier ces informations
            </button>
          </div>

          {/* THE DECISIVE QUESTION */}
          <section className="bg-white rounded-2xl border-2 border-emerald-800/20 p-5 shadow-sm space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                  La question qui change la conclusion
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-0.5">
                  Prévoyez-vous de skier hors-piste ?
                </h2>
              </div>
              <span className="text-xs text-slate-400">1 seule question</span>
            </div>

            {/* Answer Selector */}
            <div className="grid sm:grid-cols-3 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => updateStay({ offPistePlanned: 'non' })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  stay.offPistePlanned === 'non'
                    ? 'border-emerald-700 bg-emerald-50/70 text-emerald-950 font-medium ring-1 ring-emerald-700'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs font-semibold">Non, pistes balisées uniquement</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Séjour classique en station sur domaine ouvert
                </div>
              </button>

              <button
                type="button"
                onClick={() => updateStay({ offPistePlanned: 'oui_guide' })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  stay.offPistePlanned === 'oui_guide'
                    ? 'border-emerald-700 bg-emerald-50/70 text-emerald-950 font-medium ring-1 ring-emerald-700'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs font-semibold">Oui, encadré par moniteur/guide</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Sortie encadrée par un professionnel diplômé
                </div>
              </button>

              <button
                type="button"
                onClick={() => updateStay({ offPistePlanned: 'oui_seul' })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  stay.offPistePlanned === 'oui_seul'
                    ? 'border-amber-600 bg-amber-50/70 text-amber-950 font-medium ring-1 ring-amber-600'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs font-semibold">Oui, hors-piste individuel</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Hors-piste autonome sans guide ESF
                </div>
              </button>
            </div>
          </section>

          {/* SHORT HEADLINE ANSWER: INTEGRATING ALL HOUSEHOLD CONTRACTS */}
          <div className="p-4 rounded-xl bg-slate-900 text-white flex items-start gap-3 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
                Verdict Frère Tuck sur l’ensemble de vos contrats
              </div>
              <p className="text-sm font-medium mt-0.5 leading-relaxed text-slate-100">
                {stay.offPistePlanned === 'non'
                  ? 'Excellente couverture croisée : Vos secours sur piste sont garantis par votre Carte Gold (5 000 €) et renforcés par l’Assurance Scolaire de Léo (2 500 €). Les soins médicaux sont pris en charge par votre Mutuelle et la Responsabilité Civile par votre Assurance Habitation (20M€). Un seul point reste à surveiller : le retour de l’enfant si un seul parent est blessé.'
                  : stay.offPistePlanned === 'oui_guide'
                  ? 'Votre sortie hors-piste avec moniteur breveté est couverte par la Carte Gold (Art. 4.2). En cas d’accident corporel, votre Mutuelle et votre Garantie Accidents de la Vie (GAV) interviennent sans restriction.'
                  : 'Vigilance forte : le hors-piste individuel sans guide est exclu de votre Carte Gold. Vos séquelles corporelles restent couvertes par votre GAV, mais les frais d’hélicoptère de recherche nécessitent une assurance Neige dédiée.'}
              </p>
            </div>
          </div>

          {/* DETAILED GUARANTEE CARDS */}
          <div className="grid md:grid-cols-3 gap-4">
            {/* Card 1: Secours sur piste (Carte Gold + Assurance Scolaire) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    1. Secours sur piste
                  </span>
                  <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    Protégé à 100%
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Frais réels de recherche et de premier transport médicalisé vers l’hôpital le plus proche.
                </p>

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Carte Gold :</span>
                    <span className="font-semibold text-slate-800">5 000 € (0 € franchise)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Assurance Scolaire Léo :</span>
                    <span className="font-semibold text-emerald-700">+ 2 500 € (Art. 5.2)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bénéficiaires :</span>
                    <span className="font-medium text-slate-800">Thomas, Camille, Léo</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => openProofModal('clause-secours-piste')}
                  className="text-emerald-800 hover:underline flex items-center gap-1 font-semibold"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Notice Carte Gold
                </button>
                <button
                  type="button"
                  onClick={() => openProofModal('clause-scolaire-secours')}
                  className="text-sky-800 hover:underline flex items-center gap-1 font-semibold"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Assurance Léo
                </button>
              </div>
            </div>

            {/* Card 2: Hors-piste */}
            <div
              className={`rounded-2xl border p-4 flex flex-col justify-between shadow-sm ${
                stay.offPistePlanned === 'non'
                  ? 'bg-white border-slate-200'
                  : stay.offPistePlanned === 'oui_guide'
                  ? 'bg-white border-emerald-300'
                  : hasComplementaryDoc
                  ? 'bg-emerald-50/50 border-emerald-300'
                  : 'bg-amber-50/30 border-amber-300'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    2. Hors-piste
                  </span>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                      stay.offPistePlanned === 'non'
                        ? 'bg-slate-100 text-slate-700'
                        : stay.offPistePlanned === 'oui_guide'
                        ? 'bg-emerald-100 text-emerald-800'
                        : hasComplementaryDoc
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {stay.offPistePlanned === 'non'
                      ? 'Non concerné'
                      : stay.offPistePlanned === 'oui_guide'
                      ? 'Couvert sous condition'
                      : hasComplementaryDoc
                      ? 'Couvert (Doc ajouté)'
                      : 'Exclu par la carte'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {stay.offPistePlanned === 'non'
                    ? 'Aucun hors-piste prévu. Si vous changez d’avis, la Carte Gold exclut le hors-piste sans encadrement par un moniteur breveté.'
                    : stay.offPistePlanned === 'oui_guide'
                    ? 'Couvert par la Carte Gold (Art. 4.2) car encadré par un guide ou moniteur titulaire d’un brevet d’État.'
                    : hasComplementaryDoc
                    ? 'Couvert intégralement aux frais réels grâce à votre Attestation Neige & Montagne récemment ajoutée.'
                    : 'Le ski hors des pistes sans guide officiel est exclu par la Carte Gold. Votre contrat GAV couvre les blessures mais pas les secours.'}
                </p>

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Condition :</span>
                    <span className="font-semibold text-slate-800">
                      {hasComplementaryDoc ? 'Aucune (attestation neige)' : 'Moniteur breveté obligatoire'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Action requise :</span>
                    <span className="font-medium text-slate-800">
                      {stay.offPistePlanned === 'oui_seul' && !hasComplementaryDoc
                        ? 'Souscrire Carré Neige (3,30 €/j)'
                        : 'Conserver la facture du cours'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() =>
                    openProofModal(
                      hasComplementaryDoc
                        ? 'clause-neige-hors-piste-total'
                        : 'clause-hors-piste'
                    )
                  }
                  className="text-xs text-emerald-800 hover:underline flex items-center gap-1 font-semibold"
                >
                  <FileText className="w-3.5 h-3.5" />
                  {hasComplementaryDoc ? 'Voir l’attestation' : 'Voir clause (Notice p. 14)'}
                </button>
              </div>
            </div>

            {/* Card 3: Rapatriement des enfants */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col justify-between shadow-sm">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    3. Rapatriement de Léo
                  </span>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                      hasComplementaryDoc
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {hasComplementaryDoc ? 'Résolu' : 'À vérifier'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {hasComplementaryDoc
                    ? 'Votre attestation Neige prend en charge la garde de Léo (80 €/j) ou son retour dès qu’un seul parent est immobilisé.'
                    : 'La Carte Gold n’organise le retour de Léo (7 ans) que si les DEUX parents accompagnateurs sont simultanément hospitalisés.'}
                </p>

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-[11px] text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Clause Carte Gold :</span>
                    <span className="font-semibold text-slate-800">Article 4.5 restrictive</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Enfant concerné :</span>
                    <span className="font-medium text-slate-800">Léo (7 ans)</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 mt-4 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() =>
                    openProofModal(
                      hasComplementaryDoc
                        ? 'clause-neige-garde-enfants'
                        : 'clause-rapatriement-enfants'
                    )
                  }
                  className="text-xs text-emerald-800 hover:underline flex items-center gap-1 font-semibold"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Voir la clause
                </button>

                <button
                  type="button"
                  onClick={handleSaveRepatriationAuditItem}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                  title="Ajouter à l’audit du foyer"
                >
                  <BookmarkPlus className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Enregistrer le point</span>
                </button>
              </div>
            </div>
          </div>

          {/* Success banner when item saved */}
          {savedCheckSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>
                Le point de vigilance sur le rapatriement des enfants a bien été enregistré dans l’audit de votre foyer.
              </span>
            </div>
          )}
        </div>
      )}

      {/* SCENE 3: JE DOIS FINALEMENT ANNULER LE SÉJOUR */}
      {!isZeroDataMode && selectedScenario === 'trip_cancellation' && (
        <div className="space-y-5 animate-in fade-in duration-300">
          {/* Context Recognition Banner */}
          <div className="bg-slate-100/80 border border-slate-200/80 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span className="text-slate-600">Dossier réutilisé :</span>
              <span className="font-semibold text-slate-900">
                Séjour Les Menuires (1 800 €)
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-slate-600">
                Voyageurs : Thomas, Camille, Léo
              </span>
            </div>
            <button
              onClick={openHouseholdManager}
              className="text-emerald-800 hover:underline font-medium text-[11px]"
            >
              Modifier le dossier
            </button>
          </div>

          {/* DECISIVE QUESTIONS & MODIFIABLE FACTS */}
          <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                  Les éléments qui changent la conclusion
                </span>
                <h2 className="text-sm font-bold text-slate-900">
                  Vérifiez vos faits déclarés et justificatifs
                </h2>
              </div>
              <span className="text-xs text-slate-500">Modifiable en direct</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              {/* Question 1: Payment Method */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="font-semibold text-slate-800 block">
                  1. Quel moyen a réglé le séjour ?
                </label>
                <select
                  value={stay.paymentMethod}
                  onChange={(e) =>
                    updateStay({
                      paymentMethod: e.target.value as any,
                      paymentConfirmedDoc: e.target.value === 'carte_gold',
                    })
                  }
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="carte_gold">Carte Gold Mastercard (Règlement 100% de 1 800 €)</option>
                  <option value="autre_carte">Autre carte bancaire classique (Sans assurance voyage)</option>
                  <option value="virement">Virement bancaire direct depuis compte courant</option>
                  <option value="inconnu">Inconnu / Facture ou reçu introuvable</option>
                </select>
                <div className="text-[11px] text-slate-500">
                  {stay.paymentMethod === 'carte_gold'
                    ? 'Condition de règlement vérifiée sur le relevé porteur.'
                    : 'Attention : Vos autres contrats (MRH, Mutuelle, Scolaire) ne remboursent pas l’annulation de séjour.'}
                </div>
              </div>

              {/* Question 2: Medical certificate & motive */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="font-semibold text-slate-800 block">
                  2. Motif d’annulation & justificatif médical :
                </label>
                <select
                  value={stay.cancellationReason}
                  onChange={(e) =>
                    updateStay({ cancellationReason: e.target.value as any })
                  }
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900 font-medium focus:ring-2 focus:ring-emerald-700"
                >
                  <option value="maladie_enfant">
                    Maladie soudaine de Léo (avec certificat médical d’inaptitude)
                  </option>
                  <option value="convenance">
                    Convenance personnelle / Changement d’avis du foyer
                  </option>
                  <option value="meteo">
                    Mauvaise météo annoncée en station
                  </option>
                </select>
                <div className="text-[11px] text-slate-500">
                  {stay.cancellationReason === 'maladie_enfant'
                    ? 'Motif couvert par l’Article 7.1. Les frais médicaux de Léo sont quant à eux pris en charge par votre Complémentaire Santé.'
                    : 'Les motifs de convenance ou météo sont expressément exclus par les contrats d’assurance.'}
                </div>
              </div>
            </div>
          </section>

          {/* EXACT 4-PART RESTITUTION AS SPECIFIED */}

          {/* PART 1: RÉPONSE COURTE & NIVEAU DE CERTITUDE */}
          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                1. La réponse courte & certitude
              </span>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded ${
                  stay.paymentMethod === 'carte_gold' &&
                  stay.cancellationReason === 'maladie_enfant'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                    : stay.paymentMethod === 'inconnu'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                }`}
              >
                {stay.paymentMethod === 'carte_gold' &&
                stay.cancellationReason === 'maladie_enfant'
                  ? 'Certitude élevée : Prise en charge possible sous conditions'
                  : stay.paymentMethod === 'inconnu'
                  ? 'Certitude modérée : À vérifier'
                  : 'Certitude élevée : Non éligible par la carte'}
              </span>
            </div>

            <div className="text-base font-semibold text-slate-100">
              {stay.paymentMethod === 'carte_gold' &&
              stay.cancellationReason === 'maladie_enfant' ? (
                <div>
                  Une prise en charge est possible sous conditions :{' '}
                  <span className="text-emerald-400 font-bold font-mono">
                    1 500 € de frais restant à examiner
                  </span>{' '}
                  (1 450 € nets après déduction de la franchise contractuelle de 50 €). Vos frais de consultation pédiatrique sont quant à eux réglés par votre Complémentaire Santé.
                </div>
              ) : stay.paymentMethod === 'inconnu' ? (
                <div>
                  À vérifier : la prise en charge de vos 1 500 € dépend impérativement de la preuve que le séjour a été réglé avec votre Carte Gold (vos autres contrats ne prévoyant pas d’annulation).
                </div>
              ) : stay.cancellationReason !== 'maladie_enfant' ? (
                <div>
                  Aucune indemnisation possible : l’Article 7.3 exclut formellement les changements de convenance personnelle et les aléas météo.
                </div>
              ) : (
                <div>
                  Aucun remboursement d’annulation possible : le séjour ayant été payé par {stay.paymentMethod}, la Carte Gold ne peut intervenir. Votre assurance Habitation et votre mutuelle ne garantissent pas les annulations de séjour.
                </div>
              )}
            </div>

            {/* Financial Detail Grid */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs border-t border-slate-800">
              <div>
                <span className="text-slate-400 block text-[11px]">Coût initial</span>
                <span className="font-bold text-slate-200">{stay.totalCost} €</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Déjà remboursé station</span>
                <span className="font-bold text-emerald-400">- {stay.refundedByProvider} €</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Reste à charge</span>
                <span className="font-bold text-amber-300">
                  {stay.totalCost - stay.refundedByProvider} €
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Plafond annuel</span>
                <span className="font-bold text-slate-200">5 000 € / assuré</span>
              </div>
            </div>
          </div>

          {/* PART 2: POURQUOI (Faits retenus, clause et conditions déterminantes sur l'ensemble des contrats) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-700" />
                2. Pourquoi : Les faits retenus et la clause déterminante
              </h3>
              <button
                type="button"
                onClick={() => openProofModal('clause-annulation-voyage')}
                className="text-xs text-emerald-800 hover:underline flex items-center gap-1 font-medium"
              >
                <FileText className="w-3.5 h-3.5" />
                Ouvrir la clause officielle (Notice p. 21)
              </button>
            </div>

            <div className="grid sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-semibold text-slate-900 block mb-1">
                  Fait n°1 : Le paiement CB
                </span>
                <p className="text-slate-600">
                  {stay.paymentMethod === 'carte_gold'
                    ? 'Le séjour a été payé avec la Carte Gold (débit de 1 800 € vérifié).'
                    : 'Le paiement n’est pas rattaché à la Carte Gold assurée.'}
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-semibold text-slate-900 block mb-1">
                  Fait n°2 : L’assuré malade
                </span>
                <p className="text-slate-600">
                  Léo (7 ans) est un ayant droit fiscalement à charge de Thomas, couvert par la Carte Gold et par la Mutuelle Santé.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="font-semibold text-slate-900 block mb-1">
                  Fait n°3 : La clause
                </span>
                <p className="text-slate-600">
                  Article 7.1 : l’altération de santé interdisant médicalement tout déplacement ouvre droit à indemnisation sous franchise de 50 €.
                </p>
              </div>
            </div>
          </div>

          {/* PART 3: CE QU'IL RESTE À CONFIRMER (La preuve à retrouver) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              3. Ce qu'il reste à confirmer et la preuve à retrouver
            </h3>

            <div className="space-y-2 text-xs">
              {stay.paymentMethod === 'inconnu' && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 flex items-start gap-2">
                  <span className="font-bold text-amber-800">Preuve n°1 :</span>
                  <div>
                    <span className="font-semibold">Relevé bancaire ou reçu CB :</span> Retrouvez l’extrait de compte ou la confirmation de commande attestant du débit Carte Gold. Sans ce justificatif, l’assisteur refusera le dossier.
                  </div>
                </div>
              )}

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 flex items-start gap-2">
                <span className="font-bold text-slate-700">Preuve n°2 :</span>
                <div>
                  <span className="font-semibold">Certificat médical initial :</span> Daté d’avant la date de départ (15/02), attestant formellement de la contre-indication médicale absolue au voyage pour Léo.
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 flex items-start gap-2">
                <span className="font-bold text-slate-700">Preuve n°3 :</span>
                <div>
                  <span className="font-semibold">Facture d’annulation du voyagiste :</span> Mentionnant les frais retenus (1 500 €) et les frais d’ores et déjà remboursés (300 €).
                </div>
              </div>
            </div>
          </div>

          {/* PART 4: LA PROCHAINE ACTION AVEC LE BOUTON PRÉPARER LA SUITE */}
          <div className="bg-emerald-50/70 border-2 border-emerald-800/30 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                4. La prochaine action recommandée
              </span>
              <span className="text-xs text-emerald-800 font-medium">Étape suivante</span>
            </div>

            <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed">
              Ne laissez pas passer le délai contractuel de 5 jours ouvrés. Frère Tuck compile les preuves de tous vos contrats, liste les pièces justificatives et rédige votre déclaration formelle d'indemnisation pour Robin.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-emerald-800">
                1 450 € nets à réclamer auprès de Mondial Assistance
              </div>

              <button
                type="button"
                onClick={handlePrepareClaim}
                className="px-5 py-3 btn-primary rounded-xl text-xs sm:text-sm font-bold shadow-md flex items-center gap-2 transition-all active:scale-[0.98]"
              >
                <span>Préparer la suite</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCENE VOL : ON M'A VOLÉ MON MATÉRIEL DE SKI AU CHALET */}
      {!isZeroDataMode && selectedScenario === 'theft_chalet' && (
        <div className="space-y-5 animate-in fade-in duration-300">
          {/* Context Recognition Banner */}
          <div className="bg-slate-100/80 border border-slate-200/80 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span className="text-slate-600">Dossier identifié :</span>
              <span className="font-semibold text-slate-900">
                Séjour Les Menuires · Matériel de glisse & effets personnels
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-slate-600">
                Comparatif Habitation Multirisque vs Carte Gold
              </span>
            </div>
            <button
              onClick={openOverlapModal}
              className="text-indigo-800 hover:underline font-semibold text-[11px] flex items-center gap-1"
            >
              <Layers className="w-3.5 h-3.5" />
              Ouvrir le comparateur
            </button>
          </div>

          {/* THE DECISIVE QUESTION FOR THEFT */}
          <section className="bg-white rounded-2xl border-2 border-indigo-700/20 p-5 shadow-sm space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                  La question déterminante pour le vol
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-0.5">
                  Où et dans quelles circonstances le vol a-t-il été commis ?
                </h2>
              </div>
              <span className="text-xs text-slate-400">1 seule condition clé</span>
            </div>

            {/* Answer Selector */}
            <div className="grid sm:grid-cols-3 gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setTheftCircumstance('effraction_chalet')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  theftCircumstance === 'effraction_chalet'
                    ? 'border-indigo-700 bg-indigo-50/70 text-indigo-950 font-medium ring-1 ring-indigo-700'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs font-semibold">Chalet / Casier fermé avec effraction</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Porte forcée, cadenas brisé ou agression constatée
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTheftCircumstance('sans_effraction')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  theftCircumstance === 'sans_effraction'
                    ? 'border-amber-600 bg-amber-50/70 text-amber-950 font-medium ring-1 ring-amber-600'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs font-semibold">Sur piste / Devant restaurant</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Skis posés sans antivol ou négligence
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTheftCircumstance('transport_public')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  theftCircumstance === 'transport_public'
                    ? 'border-indigo-700 bg-indigo-50/70 text-indigo-950 font-medium ring-1 ring-indigo-700'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs font-semibold">En train ou avion (Transporteur)</div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Bagages enregistrés sous la responsabilité de la compagnie
                </div>
              </button>
            </div>
          </section>

          {/* EXACT 4-PART RESTITUTION FOR THEFT */}

          {/* PART 1: RÉPONSE COURTE & NIVEAU DE CERTITUDE */}
          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                1. La réponse courte & arbitrage Frère Tuck
              </span>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded ${
                  theftCircumstance === 'effraction_chalet'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                    : theftCircumstance === 'transport_public'
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                }`}
              >
                {theftCircumstance === 'effraction_chalet'
                  ? 'Contrat Habitation Multirisque à actionner en priorité'
                  : theftCircumstance === 'transport_public'
                  ? 'Carte Gold à actionner (Bagages enregistrés)'
                  : 'Exclusion générale (Sans effraction)'}
              </span>
            </div>

            <div className="text-base font-semibold text-slate-100">
              {theftCircumstance === 'effraction_chalet' ? (
                <div>
                  Votre <span className="text-emerald-400 font-bold">contrat Habitation Multirisque vous couvre</span> : jusqu’à{' '}
                  <span className="text-emerald-400 font-bold font-mono">4 000 € d’indemnisation</span> (dont 2 000 € pour le matériel de ski loué ou personnel), déduction faite de la franchise de 100 €. La Carte Gold refusera le dossier car elle exclut formellement les hébergements de vacances et casiers.
                </div>
              ) : theftCircumstance === 'transport_public' ? (
                <div>
                  Votre <span className="text-emerald-400 font-bold">Carte Gold Mastercard intervient</span> : jusqu’à 800 € par bagage (max 1 600 € par événement), franchise de 70 €, sur présentation du rapport d'irrégularité (PIR).
                </div>
              ) : (
                <div>
                  Aucune indemnisation possible : ni votre contrat Habitation Multirisque (Art. 6) ni la Carte Gold ne couvrent le vol sans effraction ou les objets laissés sans surveillance sur le domaine public.
                </div>
              )}
            </div>

            {/* Financial Detail Grid for Theft */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs border-t border-slate-800">
              <div>
                <span className="text-slate-400 block text-[11px]">Préjudice estimé</span>
                <span className="font-bold text-slate-200">1 400 €</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Contrat éligible</span>
                <span className="font-bold text-emerald-400">
                  {theftCircumstance === 'effraction_chalet'
                    ? 'Habitation Multirisque'
                    : theftCircumstance === 'transport_public'
                    ? 'Carte Gold CB'
                    : 'Aucun'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Franchise déduite</span>
                <span className="font-bold text-amber-300">
                  {theftCircumstance === 'effraction_chalet' ? '100 €' : theftCircumstance === 'transport_public' ? '70 €' : '—'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Indemnité nette</span>
                <span className="font-bold text-emerald-400">
                  {theftCircumstance === 'effraction_chalet' ? '1 300 €' : theftCircumstance === 'transport_public' ? '1 330 €' : '0 €'}
                </span>
              </div>
            </div>
          </div>

          {/* PART 2: POURQUOI (Habitation vs Carte Gold) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-700" />
                2. Pourquoi : Les clauses et exclusions comparées
              </h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => openProofModal('clause-vol-objets-mrh')}
                  className="text-xs text-emerald-800 hover:underline flex items-center gap-1 font-semibold"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Clause Habitation (p. 14)
                </button>
                <button
                  type="button"
                  onClick={() => openProofModal('clause-vol-bagages-gold')}
                  className="text-xs text-amber-800 hover:underline flex items-center gap-1 font-semibold"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Clause Carte Gold (p. 24)
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200">
                <span className="font-bold text-emerald-950 block mb-1">
                  Habitation Multirisque (Article 6) — Éligible
                </span>
                <p className="text-emerald-900 leading-relaxed text-[11px]">
                  « Nous garantissons le vol avec effraction de vos effets personnels et matériel de ski vous appartenant ou loués par vous à l’intérieur d’un hébergement temporaire ou casier à skis privatif fermé à clé, jusqu’à 4 000 € (dont 2 000 € de matériel de glisse). Franchise : 100 €. »
                </p>
              </div>

              <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200">
                <span className="font-bold text-rose-950 block mb-1">
                  Carte Gold Mastercard (Article 8.3) — Inapplicable
                </span>
                <p className="text-rose-900 leading-relaxed text-[11px]">
                  « Sont formellement exclus les vols survenus dans les hébergements de vacances, locations meublées, coffres de véhicules, chalets et casiers à skis, ainsi que le matériel de sport de glisse. »
                </p>
              </div>
            </div>
          </div>

          {/* PART 3: CE QU'IL RESTE À CONFIRMER */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              3. Ce qu'il reste à confirmer et justificatifs indispensables
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 flex items-start gap-2">
                <span className="font-bold text-emerald-700">Pièce n°1 :</span>
                <div>
                  <span className="font-semibold">Procès-verbal de dépôt de plainte :</span> À déposer sous 48h auprès de la gendarmerie des Menuires ou de Saint-Martin-de-Belleville, en faisant mentionner les traces d’effraction sur la porte ou le casier.
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 flex items-start gap-2">
                <span className="font-bold text-emerald-700">Pièce n°2 :</span>
                <div>
                  <span className="font-semibold">Factures ou contrat de location ski :</span> Justificatifs prouvant la détention et la valeur du matériel dérobé (skis, bâtons, chaussures, casques).
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 flex items-start gap-2">
                <span className="font-bold text-emerald-700">Pièce n°3 :</span>
                <div>
                  <span className="font-semibold">Attestation de villégiature :</span> Bail de location meublée saisonnière justifiant de votre séjour aux Menuires.
                </div>
              </div>
            </div>
          </div>

          {/* PART 4: LA PROCHAINE ACTION AVEC PRÉPARATION ROBIN */}
          <div className="bg-indigo-50/70 border-2 border-indigo-800/30 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-700" />
                4. La prochaine action recommandée
              </span>
              <span className="text-xs text-indigo-800 font-medium">Recours Habitation</span>
            </div>

            <p className="text-xs sm:text-sm text-indigo-950 leading-relaxed">
              Ne perdez pas de temps à contacter l’assisteur Carte Gold qui rejettera votre demande. Frère Tuck a déjà préparé votre déclaration complète pour votre assureur <span className="font-semibold">Habitation Multirisque</span> afin d’obtenir vos 1 300 € nets.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={openOverlapModal}
                className="px-4 py-2 bg-white border border-indigo-200 text-indigo-900 rounded-xl text-xs font-semibold hover:bg-indigo-50 transition-colors flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Consulter le comparateur détaillé</span>
              </button>

              <button
                type="button"
                onClick={handlePrepareTheftClaim}
                className="px-5 py-3 bg-indigo-900 hover:bg-indigo-950 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-indigo-950/10 flex items-center gap-2 transition-all active:scale-[0.98]"
              >
                <span>Transmettre la déclaration de vol à Robin</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM OR OUT OF SCOPE QUESTION */}
      {selectedScenario === 'custom_unknown' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Précision nécessaire pour votre situation
              </h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Pour « {searchQuery} », Frère Tuck a besoin de vérifier quel contrat encadre ce logement (l’assurance Habitation Foyer ou l’assurance villégiature de la carte bancaire).
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
            <div className="font-semibold text-slate-900">
              Scénarios pré-validés avec clauses réelles dans cette démonstration :
            </div>
            <ul className="space-y-1.5 list-disc pl-4 text-slate-600">
              <li>
                <strong>Séjour ski en famille :</strong> Secours sur piste, hors-piste et rapatriement des enfants (Carte Gold vs Carré Neige).
              </li>
              <li>
                <strong>Annulation séjour maladie :</strong> Calcul du remboursement (1 500 € restant à charge) et transmission du dossier à Robin.
              </li>
              <li>
                <strong>Responsabilité civile :</strong> Comparatif du chevauchement entre votre contrat Habitation et votre Carte Gold.
              </li>
            </ul>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setSearchQuery('Je pars au ski en famille. Est-ce que je suis déjà couvert ?');
                setSelectedScenario('ski_preparation');
              }}
              className="px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Voir la préparation du séjour au ski
            </button>
            <button
              onClick={() => {
                setSearchQuery('Mon enfant est malade, je dois annuler le séjour. Que puis-je récupérer ?');
                setSelectedScenario('trip_cancellation');
              }}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
            >
              Voir l'annulation maladie
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

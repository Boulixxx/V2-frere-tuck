import { ContractDocument, FamilyMember, SkiStay, AuditCheckItem, ContractScanResult } from '../types';

export const INITIAL_MEMBERS: FamilyMember[] = [
  { id: 'm1', name: 'Thomas', role: 'souscripteur', age: 38 },
  { id: 'm2', name: 'Camille', role: 'conjoint', age: 36 },
  { id: 'm3', name: 'Léo', role: 'enfant', age: 7 },
];

export const INITIAL_SKI_STAY: SkiStay = {
  id: 'stay-menuires-2025',
  destination: 'Les Menuires (Savoie)',
  resort: 'Domaine des 3 Vallées',
  startDate: '2025-02-15',
  endDate: '2025-02-22',
  totalCost: 1800,
  refundedByProvider: 300,
  paymentMethod: 'carte_gold',
  paymentConfirmedDoc: true,
  medicalCertAvailable: true,
  offPistePlanned: 'non',
  cancellationReason: 'maladie_enfant',
};

export const CONTRACT_DOCUMENTS: ContractDocument[] = [
  {
    id: 'doc-gold-cb',
    title: 'Notice d’Information Assistance & Assurance Carte Gold',
    issuer: 'Banque Populaire / Mondial Assistance',
    contractNumber: 'CB-GOLD-84920-FR',
    category: 'bancaire',
    uploadedAt: '12/01/2024 via My Guaranties',
    isFictional: true,
    clauses: [
      {
        id: 'clause-secours-piste',
        documentTitle: 'Notice d’Assurance Carte Gold',
        contractType: 'carte_bancaire',
        page: 12,
        article: 'Article 3.1 — Secours sur pistes de ski',
        topic: 'Secours et recherche sur domaine skiable',
        guaranteedAmount: 'Jusqu’à 5 000 € par événement',
        deductible: '0 € (Sans franchise)',
        conditions: [
          'Séjour situé à plus de 50 km du domicile principal',
          'Accident survenu sur un domaine skiable ouvert',
          'Titulaire ou ayant droit (conjoint et enfants de moins de 25 ans à charge)',
        ],
        exclusions: [
          'Frais de remontées mécaniques non utilisées (sauf garantie optionnelle)',
          'Pratique en compétition professionnelle',
        ],
        fullExtract:
          '« L’Assureur prend en charge à concurrence de 5 000 € TTC par événement et par Assuré les frais réels de recherche en montagne et de premier transport médicalisé depuis le lieu de l’accident de ski sur les pistes ouvertes jusqu’au centre de soins ou établissement hospitalier le plus proche. La garantie s’applique aux Assurés se trouvant à plus de 50 km de leur résidence principale. »',
        appliesTo: ['Thomas', 'Camille', 'Léo'],
      },
      {
        id: 'clause-hors-piste',
        documentTitle: 'Notice d’Assurance Carte Gold',
        contractType: 'carte_bancaire',
        page: 14,
        article: 'Article 4.2 — Pratique du ski hors des pistes balisées',
        topic: 'Condition d’encadrement du hors-piste',
        guaranteedAmount: 'Jusqu’à 5 000 € (sous condition stricte)',
        deductible: '0 €',
        conditions: [
          'Pratique encadrée par un guide de haute montagne ou un moniteur diplômé d’État en exercice',
          'OU domaine relié balisé autorisé par les arrêtés municipaux du jour',
        ],
        exclusions: [
          'Ski hors-piste non encadré en dehors des zones autorisées par la station',
          'Non-respect des drapeaux d’avalanche (niveau 4 et 5)',
        ],
        fullExtract:
          '« Les opérations de recherche et de sauvetage consécutives à un accident survenu lors de la pratique du ski hors-piste sont formellement exclues, SAUF lorsque l’Assuré évolue sous la responsabilité directe d’un guide ou moniteur titulaire d’un brevet d’État, ou lorsque l’itinéraire emprunté relie deux pistes balisées ouvertes et fait l’objet d’un bulletin municipal favorable. »',
        appliesTo: ['Thomas', 'Camille', 'Léo'],
      },
      {
        id: 'clause-rapatriement-enfants',
        documentTitle: 'Notice d’Assistance Carte Gold',
        contractType: 'carte_bancaire',
        page: 18,
        article: 'Article 4.5 — Accompagnement des enfants de moins de 15 ans',
        topic: 'Rapatriement et garde des mineurs accompagnants',
        guaranteedAmount: 'Prise en charge intégrale du transport d’un proche',
        deductible: '0 €',
        conditions: [
          'Hospitalisation simultanée imprévue de plus de 48h des DEUX parents accompagnateurs',
          'Enfant de moins de 15 ans laissé seul sans garde sur le lieu de séjour',
        ],
        exclusions: [
          'Si un des deux parents demeure apte et présent sur place',
          'Frais de garde d’enfants hors transport',
        ],
        fullExtract:
          '« Si les deux parents accompagnateurs de l’Assuré mineur de moins de 15 ans sont simultanément hospitalisés pour une durée supérieure à 48 heures ou rapatriés médicalement, l’Assisteur organise et prend en charge le titre de transport aller-retour en train (1re classe) ou avion (classe éco) d’une personne désignée par la famille résidant en France pour ramener l’enfant au domicile. Si un seul parent est hospitalisé, le second parent accompagnateur est réputé assurer la garde. »',
        appliesTo: ['Léo (7 ans)'],
      },
      {
        id: 'clause-annulation-voyage',
        documentTitle: 'Notice d’Assurance Carte Gold',
        contractType: 'carte_bancaire',
        page: 21,
        article: 'Article 7.1 — Annulation et modification de voyage',
        topic: 'Remboursement des frais non récupérables',
        guaranteedAmount: 'Jusqu’à 5 000 € par assuré et par année civile',
        deductible: '50 € par dossier',
        conditions: [
          'Règlement intégral ou partiel (au moins 50%) de la prestation avec la Carte Gold',
          'Altération de santé grave, imprévue et médicalement constatée avant le départ',
          'Certificat médical attestant de la contre-indication formelle au voyage',
          'Déclaration dans les 5 jours ouvrés suivant la survenance du motif',
        ],
        exclusions: [
          'Convenance personnelle, changement d’avis ou modification d’emploi du temps',
          'Maladie ou affection préexistante non stabilisée dans les 6 mois précédents',
          'Frais déjà remboursés par le voyagiste ou le transporteur',
        ],
        fullExtract:
          '« L’Assureur rembourse à l’Assuré les frais d’annulation restant contractuellement à sa charge selon le barème du voyagiste, dans la limite de 5 000 € par Assuré, lorsque le voyage a été payé au moyen de la Carte Assurée et que l’annulation est motivée par une maladie grave ou un accident corporel de l’Assuré, de son conjoint ou d’un enfant à charge, interdisant médicalement tout déplacement. Une franchise de 50 € est déduite de l’indemnité globale. »',
        appliesTo: ['Thomas', 'Camille', 'Léo'],
      },
      {
        id: 'clause-rc-gold',
        documentTitle: 'Notice d’Assurance Carte Gold',
        contractType: 'carte_bancaire',
        page: 15,
        article: 'Article 5 — Responsabilité Civile à l’Étranger et Villégiature',
        topic: 'Dommages causés aux tiers en séjour',
        guaranteedAmount: 'Jusqu’à 1 000 000 € par sinistre',
        deductible: '150 € par sinistre',
        conditions: [
          'Séjour de villégiature réglé au moins partiellement avec la Carte Gold',
          'Sinistre survenu à plus de 50 km du domicile',
        ],
        exclusions: [
          'Pratique de sports motorisés',
          'Dommages intentionnels',
        ],
        fullExtract:
          '« L’Assureur garantit les conséquences pécuniaires de la responsabilité civile encourue par l’Assuré pour les dommages corporels et matériels causés aux tiers au cours d’un séjour de villégiature réglé au moyen de la Carte, à concurrence de 1 000 000 € avec une franchise de 150 €. »',
        appliesTo: ['Thomas', 'Camille', 'Léo'],
      },
      {
        id: 'clause-vol-bagages-gold',
        documentTitle: 'Notice d’Assurance Carte Gold',
        contractType: 'carte_bancaire',
        page: 24,
        article: 'Article 8.3 — Perte, vol et détérioration de bagages',
        topic: 'Vol de bagages sous garde exclusive d’un transporteur public',
        guaranteedAmount: 'Jusqu’à 800 € par bagage (max 1 600 € par événement)',
        deductible: '70 € par dossier',
        conditions: [
          'Bagages enregistrés sous la responsabilité exclusive d’une compagnie aérienne ou ferroviaire',
          'Titre de transport réglé à 100% avec la Carte Gold',
          'Déclaration de perte ou PIR (Property Irregularity Report) établi par le transporteur',
        ],
        exclusions: [
          'Vol survenu dans les hôtels, résidences de vacances, chalets, meublés ou casiers à skis',
          'Vol dans un véhicule particulier ou coffre de voiture',
          'Vol de matériel de sport (skis, snowboards, bâtons) en cours d’usage ou de location',
          'Vol sans effraction ou disparition inexpliquée',
        ],
        fullExtract:
          '« La garantie Vol de Bagages intervient exclusivement lorsque les bagages ont été enregistrés et confiés à un Transporteur Public régulier pour un trajet payé avec la Carte. Sont formellement exclus les vols survenus dans les hébergements de vacances, locations meublées, coffres de véhicules, chalets et casiers à skis, ainsi que le matériel de sport de glisse. »',
        appliesTo: ['Thomas', 'Camille', 'Léo'],
      },
    ],
  },
  {
    id: 'doc-mrh',
    title: 'Conditions Générales Multirisque Habitation Foyer',
    issuer: 'Assurance Habitation Foyer (Formule Intégrale)',
    contractNumber: 'MRH-FOYER-77312',
    category: 'habitation',
    uploadedAt: '03/09/2023 via My Guaranties',
    isFictional: true,
    clauses: [
      {
        id: 'clause-rc-mrh',
        documentTitle: 'Contrat Habitation Multirisque',
        contractType: 'assurance_habitation',
        page: 8,
        article: 'Article 2 — Responsabilité Civile Vie Privée et Villégiature',
        topic: 'Dommages causés aux tiers au quotidien et en vacances',
        guaranteedAmount: 'Dommages corporels : Illimités / Matériels : jusqu’à 20 000 000 €',
        deductible: '120 € par sinistre',
        conditions: [
          'Toute personne vivant habituellement au foyer souscripteur',
          'Valable en France et dans le monde entier (séjours de moins de 3 mois)',
          'Aucune obligation d’avoir payé le séjour avec un moyen spécifique',
        ],
        exclusions: [
          'Activités professionnelles ou commerciales',
          'Véhicules terrestres à moteur',
        ],
        fullExtract:
          '« Nous garantissons la Responsabilité Civile que vous pouvez encourir en raison des dommages corporels, matériels et immatériels causés à autrui par le fait de votre vie privée, de celle de vos enfants mineurs et des personnes vivant sous votre toit. La garantie s’étend aux séjours de vacances et de villégiature sans restriction géographique de durée inférieure à 90 jours. »',
        appliesTo: ['Thomas', 'Camille', 'Léo'],
      },
      {
        id: 'clause-degats-locatif',
        documentTitle: 'Contrat Habitation Multirisque',
        contractType: 'assurance_habitation',
        page: 11,
        article: 'Article 4 — Garantie Responsabilité Villégiature & Location de Vacances',
        topic: 'Dommages accidentels causés au logement loué (incendie, bris, dégât des eaux)',
        guaranteedAmount: 'Jusqu’à 500 000 € par événement',
        deductible: '120 € par sinistre',
        conditions: [
          'Location saisonnière de moins de 90 jours consécutifs',
        ],
        exclusions: ['Usure normale ou défaut d’entretien avéré'],
        fullExtract:
          '« Nous couvrons votre responsabilité en qualité de locataire saisonnier à l’égard du propriétaire pour les dommages matériels causés au bien immobilier loué et à son mobilier (incendie, explosion, dégât des eaux, bris de glaces). »',
        appliesTo: ['Thomas', 'Camille', 'Léo'],
      },
      {
        id: 'clause-vol-objets-mrh',
        documentTitle: 'Contrat Habitation Multirisque',
        contractType: 'assurance_habitation',
        page: 14,
        article: 'Article 6 — Vol d’effets personnels et matériel de ski en villégiature',
        topic: 'Vol avec effraction dans la location de vacances ou casier sécurisé',
        guaranteedAmount: 'Jusqu’à 4 000 € par événement (dont 2 000 € pour le matériel de ski)',
        deductible: '100 € par sinistre',
        conditions: [
          'Vol commis avec effraction dans les locaux de vacances clos et couverts ou casier à skis privatif fermé à clé',
          'OU vol perpétré avec agression ou violences physiques dûment constatées',
          'Dépôt de plainte officiel sous 48h auprès des services de police ou de gendarmerie',
          'Présentation des factures d’achat ou de location des matériels dérobés',
        ],
        exclusions: [
          'Vol commis sans effraction (fenêtre ou baie vitrée laissée ouverte, absence de verrouillage)',
          'Skis et matériels laissés sans surveillance sur le domaine public (ex: râtelier de restaurant d’altitude)',
          'Espèces, billets de banque et bijoux de très haute valeur non placés en coffre',
        ],
        fullExtract:
          '« Nous garantissons le vol avec effraction ou agression de vos effets personnels, vêtements, bagages et matériel de loisirs ou de ski vous appartenant ou loués par vous, lorsqu’ils se trouvent à l’intérieur d’un hébergement temporaire de villégiature clos et couvert ou dans un casier à skis privatif fermé à clé, à concurrence de 4 000 € par événement (dont 2 000 € pour le matériel de glisse). Franchise : 100 €. »',
        appliesTo: ['Thomas', 'Camille', 'Léo'],
      },
    ],
  },
  {
    id: 'doc-mutuelle-sante',
    title: 'Complémentaire Santé Familiale — Niveau Confort Plus',
    issuer: 'Harmonie & Santé Mutuelle',
    contractNumber: 'MUT-FAM-99410',
    category: 'sante',
    uploadedAt: '15/10/2023 via My Guaranties',
    isFictional: true,
    clauses: [
      {
        id: 'clause-mutuelle-montagne',
        documentTitle: 'Complémentaire Santé Familiale',
        contractType: 'mutuelle_sante',
        page: 6,
        article: 'Article 4 — Soins médicaux et consultations de station',
        topic: 'Prise en charge des dépassements d’honoraires et examens',
        guaranteedAmount: '200% du tarif conventionnel de la Sécurité sociale + Forfait pharmacie',
        deductible: '0 € (Tiers-payant national)',
        conditions: [
          'Consultations médicales en cabinet de station ou centre médical d’altitude',
          'Radiographies, plâtres et soins post-chute',
        ],
        exclusions: ['Actes de confort sans prescription médicale'],
        fullExtract:
          '« La Mutuelle prend en charge le ticket modérateur et les dépassements d’honoraires des médecins spécialistes et généralistes de station de montagne jusqu’à 200% du barème de la Sécurité sociale, ainsi que les examens radiologiques et le forfait hospitalier journalier aux frais réels en cas d’hospitalisation. »',
        appliesTo: ['Thomas', 'Camille', 'Léo'],
      },
    ],
  },
  {
    id: 'doc-scolaire-leo',
    title: 'Assurance Scolaire & Extrascolaire 24h/24 Léo',
    issuer: 'Mutuelle Assurance de l’Éducation',
    contractNumber: 'SCO-LEO-2024-88',
    category: 'scolaire',
    uploadedAt: '01/09/2024 via My Guaranties',
    isFictional: true,
    clauses: [
      {
        id: 'clause-scolaire-secours',
        documentTitle: 'Assurance Scolaire & Extrascolaire 24h/24',
        contractType: 'assurance_scolaire',
        page: 5,
        article: 'Article 5.2 — Recherche et sauvetage en montagne de l’enfant',
        topic: 'Frais de recherche et premier secours sur piste pour Léo',
        guaranteedAmount: 'Jusqu’à 2 500 € par événement',
        deductible: '0 €',
        conditions: [
          'Enfant scolarisé garanti 24h/24, y compris en vacances familiales et sports de neige',
          'En France et pays limitrophes',
        ],
        exclusions: ['Pratique en club de compétition de haut niveau'],
        fullExtract:
          '« Les frais de recherche en montagne et de sauvetage engagés par des sauveteurs professionnels pour retrouver ou évacuer l’enfant assuré sur piste de ski ou en séjour de vacances sont remboursés jusqu’à 2 500 € par sinistre, en complément ou à défaut de toute autre assurance. »',
        appliesTo: ['Léo (7 ans)'],
      },
      {
        id: 'clause-scolaire-accident-corporel',
        documentTitle: 'Assurance Scolaire & Extrascolaire 24h/24',
        contractType: 'assurance_scolaire',
        page: 7,
        article: 'Article 7 — Individuelle Accident corporel de l’enfant',
        topic: 'Capital invalidité et soins médicaux de Léo suite à chute',
        guaranteedAmount: 'Capital jusqu’à 150 000 € selon séquelles + frais d’interruption de scolarité',
        deductible: '0 €',
        conditions: ['Accident corporel survenu au cours de toute activité privée ou scolaire'],
        exclusions: [],
        fullExtract:
          '« En cas d’accident corporel de l’enfant causant un dommage physique sans tiers responsable identifié, l’assureur verse une indemnité calculée selon le barème d’invalidité permanente et prend en charge les cours à domicile si l’incapacité scolaire dépasse 14 jours. »',
        appliesTo: ['Léo (7 ans)'],
      },
    ],
  },
  {
    id: 'doc-gav-foyer',
    title: 'Garantie des Accidents de la Vie (GAV Famille)',
    issuer: 'Assurance Prévoyance Famille',
    contractNumber: 'GAV-PROTEC-55214',
    category: 'prevoyance',
    uploadedAt: '18/02/2023 via My Guaranties',
    isFictional: true,
    clauses: [
      {
        id: 'clause-gav-corporel',
        documentTitle: 'Garantie des Accidents de la Vie',
        contractType: 'prevoyance_gav',
        page: 10,
        article: 'Article 2 — Dommages corporels graves de la vie privée et sportive',
        topic: 'Indemnisation des préjudices physiques et économiques permanents',
        guaranteedAmount: 'Jusqu’à 1 000 000 € par victime',
        deductible: 'Seuil d’intervention dès 5% d’Atteinte à l’Intégrité Physique et Psychique (AIPP)',
        conditions: [
          'Accidents survenus lors de la pratique de sports de loisir (ski, randonnée, vélo)',
          'Tous les membres du foyer souscripteur',
        ],
        exclusions: ['Sports extrêmes avec interdiction municipale avérée'],
        fullExtract:
          '« Le contrat indemnise selon les règles du droit commun le préjudice corporel de l’Assuré consécutif à un accident de ski ou de sport de montagne causant une incapacité permanente d’au moins 5% (souffrances endurées, préjudice esthétique, perte de revenus, aménagement du domicile). »',
        appliesTo: ['Thomas', 'Camille', 'Léo'],
      },
    ],
  },
];

export const OPTIONAL_COMPLEMENT_DOC: ContractDocument = {
  id: 'doc-complement-neige',
  title: 'Attestation Individuelle Assurance Neige & Montagne Famille',
  issuer: 'Fédération / Assurance Spécialisée Montagne',
  contractNumber: 'NEIGE-PLUS-2025-44',
  category: 'complementaire',
  uploadedAt: 'Ajouté par le foyer en cours d’analyse',
  isFictional: true,
  clauses: [
    {
      id: 'clause-neige-hors-piste-total',
      documentTitle: 'Attestation Assurance Neige & Montagne',
      contractType: 'assurance_ski',
      page: 2,
      article: 'Article 2.4 — Hors-piste individuel et familial',
      topic: 'Couverture hors-piste sans obligation d’encadrement',
      guaranteedAmount: 'Frais réels illimités',
      deductible: '0 €',
      conditions: [
        'Hors-piste accessible par gravité depuis les remontées',
        'Signalement météo respecté (hors risque 5 avéré)',
      ],
      exclusions: ['Zones d’interdiction préfectorale stricte'],
      fullExtract:
        '« Les opérations de recherche, sauvetage et secours héliportés en hors-piste sur tout le massif des 3 Vallées sont couvertes aux frais réels sans exigence de moniteur ou d’accompagnateur diplômé. »',
      appliesTo: ['Thomas', 'Camille', 'Léo'],
    },
    {
      id: 'clause-neige-garde-enfants',
      documentTitle: 'Attestation Assurance Neige & Montagne',
      contractType: 'assurance_ski',
      page: 4,
      article: 'Article 5.1 — Prise en charge des enfants dès hospitalisation d’un parent',
      topic: 'Garde et retour des enfants facilité',
      guaranteedAmount: 'Prise en charge forfaitaire 80 €/jour + retour accompagné',
      deductible: '0 €',
      conditions: [
        'Incapacité temporaire de skier d’au moins un parent',
      ],
      exclusions: [],
      fullExtract:
        '« Dès lors qu’un parent accompagnateur est immobilisé médicalement sur le lieu de séjour, l’assureur met à disposition une garde d’enfant agréée sur place (80 €/jour) ou prend en charge le rapatriement anticipé de l’enfant avec accompagnateur dédié. »',
      appliesTo: ['Léo (7 ans)'],
    },
  ],
};

export const INITIAL_AUDIT_ITEMS: AuditCheckItem[] = [
  {
    id: 'audit-secours-piste',
    title: 'Secours sur piste de ski (Recherche & Évacuation)',
    category: 'sejour_ski',
    status: 'couvert',
    source: 'document',
    summary: 'Vous avez déjà une protection : la Carte Gold couvre jusqu’à 5 000 € et l’Assurance Scolaire de Léo apporte 2 500 € complémentaires pour votre enfant.',
    actionRequired: 'Aucune action requise. Conservez les attestations dans votre smartphone.',
    clauseRef: 'clause-secours-piste',
    attachedToStay: true,
  },
  {
    id: 'audit-rapatriement-enfants',
    title: 'Rapatriement et garde de Léo (7 ans) en cas d’accident d’un parent',
    category: 'sejour_ski',
    status: 'a_verifier',
    source: 'document',
    summary: 'Point à vérifier avant le départ : la notice Carte Gold n’organise le retour de l’enfant que si les DEUX parents sont simultanément hospitalisés.',
    actionRequired: 'Vérifier si un contrat d’assistance complémentaire ou l’assurance séjour couvre la garde si un seul parent est blessé.',
    clauseRef: 'clause-rapatriement-enfants',
    attachedToStay: true,
  },
  {
    id: 'audit-rc-overlap',
    title: 'Responsabilité Civile : chevauchement Carte Gold et Assurance Habitation',
    category: 'responsabilite',
    status: 'chevauchement',
    source: 'document',
    summary: 'Deux protections se recoupent sur la responsabilité civile en villégiature. Votre contrat Habitation est prioritaire (plafond 20M€ vs 1M€).',
    actionRequired: 'Déclarer en premier lieu le contrat Habitation pour éviter toute contestation de moyen de paiement.',
    clauseRef: 'clause-rc-mrh',
    attachedToStay: false,
  },
  {
    id: 'audit-sante-soins',
    title: 'Soins médicaux, examens et pharmacie de montagne',
    category: 'foyer_general',
    status: 'couvert',
    source: 'document',
    summary: 'Votre Complémentaire Santé Familiale couvre les dépassements d’honoraires des médecins de station à 200% du barème Sécurité sociale.',
    actionRequired: 'Penser à emporter la carte de tiers-payant de la mutuelle pour Thomas, Camille et Léo.',
    clauseRef: 'clause-mutuelle-montagne',
    attachedToStay: true,
  },
];

/**
 * Helper: systematic multi-contract scanner for any situation!
 * Frère Tuck checks EVERY active contract of the household and details its contribution.
 */
export function scanHouseholdContractsForSituation(
  situation: 'ski_stay' | 'cancellation' | 'theft' | 'accident',
  stay: SkiStay,
  hasComplementaryDoc: boolean
): ContractScanResult[] {
  const results: ContractScanResult[] = [];

  // 1. Carte Gold Mastercard
  if (situation === 'ski_stay') {
    results.push({
      contractId: 'doc-gold-cb',
      contractName: 'Carte Gold Mastercard',
      issuer: 'Banque Populaire / Mondial Assistance',
      category: 'bancaire',
      status: stay.offPistePlanned === 'oui_seul' ? 'couvre_partiellement' : 'couvre_totalement',
      contribution:
        stay.offPistePlanned === 'oui_seul'
          ? 'Couvre les secours sur pistes balisées (5 000 € sans franchise), mais exclut le hors-piste non encadré (Art. 4.2).'
          : 'Couvre les frais de recherche et premier secours sur pistes ouvertes jusqu’à 5 000 € par événement sans franchise.',
      clauseRef: 'clause-secours-piste',
    });
  } else if (situation === 'cancellation') {
    const isGold = stay.paymentMethod === 'carte_gold';
    const isMedical = stay.cancellationReason === 'maladie_enfant';
    results.push({
      contractId: 'doc-gold-cb',
      contractName: 'Carte Gold Mastercard',
      issuer: 'Banque Populaire / Mondial Assistance',
      category: 'bancaire',
      status: isGold && isMedical ? 'couvre_totalement' : 'a_verifier',
      contribution: isGold
        ? isMedical
          ? 'Garantie Annulation activée (Art. 7.1) : rembourse jusqu’à 5 000 €/an/assuré pour maladie imprévue d’un ayant droit.'
          : 'Garantie Annulation non applicable pour convenance personnelle ou changement de météo (Art. 7.3).'
        : 'Non éligible via la Carte Gold : le voyage n’a pas été réglé avec la carte assurée.',
      clauseRef: 'clause-annulation-voyage',
    });
  } else if (situation === 'theft') {
    results.push({
      contractId: 'doc-gold-cb',
      contractName: 'Carte Gold Mastercard',
      issuer: 'Banque Populaire / Mondial Assistance',
      category: 'bancaire',
      status: 'non_applicable',
      contribution:
        'Refuse formellement l’indemnisation : l’Art. 8.3 exclut les vols en meublé, hôtel, chalet ou casier à skis. Couvre uniquement les bagages enregistrés auprès d’une compagnie aérienne ou SNCF.',
      clauseRef: 'clause-vol-bagages-gold',
    });
  }

  // 2. Assurance Habitation Multirisque (MRH)
  if (situation === 'ski_stay') {
    results.push({
      contractId: 'doc-mrh',
      contractName: 'Assurance Habitation Foyer',
      issuer: 'Formule Intégrale',
      category: 'habitation',
      status: 'couvre_totalement',
      contribution:
        'Couvre la Responsabilité Civile villégiature (dommages corporels illimités, matériels jusqu’à 20M€) et les dégâts locatifs au chalet loué jusqu’à 500 000 €.',
      clauseRef: 'clause-rc-mrh',
    });
  } else if (situation === 'cancellation') {
    results.push({
      contractId: 'doc-mrh',
      contractName: 'Assurance Habitation Foyer',
      issuer: 'Formule Intégrale',
      category: 'habitation',
      status: 'non_applicable',
      contribution:
        'Ne couvre pas l’annulation de séjour (l’option villégiature MRH couvre uniquement les dégâts causés au logement loué).',
      clauseRef: 'clause-degats-locatif',
    });
  } else if (situation === 'theft') {
    results.push({
      contractId: 'doc-mrh',
      contractName: 'Assurance Habitation Foyer',
      issuer: 'Formule Intégrale',
      category: 'habitation',
      status: 'couvre_totalement',
      contribution:
        'Contrat à actionner : l’Art. 6 garantit le vol avec effraction au chalet ou dans le casier à skis jusqu’à 4 000 € (dont 2 000 € pour le matériel de glisse). Franchise 100 €.',
      clauseRef: 'clause-vol-objets-mrh',
    });
  }

  // 3. Complémentaire Santé Familiale
  if (situation === 'ski_stay') {
    results.push({
      contractId: 'doc-mutuelle-sante',
      contractName: 'Complémentaire Santé Familiale',
      issuer: 'Harmonie & Santé Mutuelle',
      category: 'sante',
      status: 'couvre_totalement',
      contribution:
        'Prend en charge les consultations des médecins de station, radiographies, plâtres et dépassements d’honoraires de montagne à 200% du barème Sécurité sociale.',
      clauseRef: 'clause-mutuelle-montagne',
    });
  } else if (situation === 'cancellation') {
    results.push({
      contractId: 'doc-mutuelle-sante',
      contractName: 'Complémentaire Santé Familiale',
      issuer: 'Harmonie & Santé Mutuelle',
      category: 'sante',
      status: 'couvre_partiellement',
      contribution:
        'Prend en charge la consultation médicale pédiatrique de Léo et les médicaments prescrits ayant motivé l’inaptitude au voyage.',
      clauseRef: 'clause-mutuelle-montagne',
    });
  }

  // 4. Assurance Scolaire & Extrascolaire de Léo
  if (situation === 'ski_stay') {
    results.push({
      contractId: 'doc-scolaire-leo',
      contractName: 'Assurance Scolaire & Extrascolaire (Léo)',
      issuer: 'MAE / Mutuelle de l’Éducation',
      category: 'scolaire',
      status: 'couvre_totalement',
      contribution:
        'Protège Léo 24h/24 en vacances : prévoit 2 500 € pour les frais de recherche et sauvetage en montagne de l’enfant + garantie individuelle accident.',
      clauseRef: 'clause-scolaire-secours',
    });
  } else if (situation === 'cancellation') {
    results.push({
      contractId: 'doc-scolaire-leo',
      contractName: 'Assurance Scolaire & Extrascolaire (Léo)',
      issuer: 'MAE / Mutuelle de l’Éducation',
      category: 'scolaire',
      status: 'non_applicable',
      contribution:
        'L’assurance scolaire n’intervient pas sur les frais d’annulation d’un voyage de vacances familial.',
    });
  }

  // 5. Garantie des Accidents de la Vie (GAV)
  results.push({
    contractId: 'doc-gav-foyer',
    contractName: 'Garantie Accidents de la Vie (GAV)',
    issuer: 'Prévoyance Famille',
    category: 'prevoyance',
    status: situation === 'ski_stay' ? 'couvre_totalement' : 'non_applicable',
    contribution:
      situation === 'ski_stay'
        ? 'Indemnise les séquelles physiques graves consécutives à une chute ou un accident de ski de loisir dès 5% d’AIPP (jusqu’à 1 000 000 € par victime).'
        : 'Non mobilisable pour une simple annulation sans incapacité physique durable.',
    clauseRef: 'clause-gav-corporel',
  });

  // 6. Attestation Neige si ajoutée par l'utilisateur
  if (hasComplementaryDoc && situation === 'ski_stay') {
    results.push({
      contractId: 'doc-complement-neige',
      contractName: 'Attestation Neige & Montagne Famille',
      issuer: 'Assurance Spécialisée Montagne',
      category: 'complementaire',
      status: 'couvre_totalement',
      contribution:
        'Couvre le hors-piste sans encadrement obligatoire (frais réels illimités) et organise la garde de Léo dès l’immobilisation d’un seul parent (80 €/j).',
      clauseRef: 'clause-neige-hors-piste-total',
    });
  }

  return results;
}

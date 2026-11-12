export type InformationSource = 'declared' | 'document' | 'unknown';

export interface FamilyMember {
  id: string;
  name: string;
  role: 'souscripteur' | 'conjoint' | 'enfant';
  age: number;
}

export interface SkiStay {
  id: string;
  destination: string;
  resort: string;
  startDate: string;
  endDate: string;
  totalCost: number;
  refundedByProvider: number;
  paymentMethod: 'carte_gold' | 'autre_carte' | 'virement' | 'inconnu';
  paymentConfirmedDoc: boolean;
  medicalCertAvailable: boolean;
  offPistePlanned: 'non' | 'oui_seul' | 'oui_guide';
  cancellationReason: 'maladie_enfant' | 'convenance' | 'meteo' | 'inconnu';
}

export interface ContractClause {
  id: string;
  documentTitle: string;
  contractType:
    | 'carte_bancaire'
    | 'assurance_habitation'
    | 'mutuelle_sante'
    | 'assurance_scolaire'
    | 'prevoyance_gav'
    | 'assurance_ski';
  page: number;
  article: string;
  topic: string;
  guaranteedAmount: string;
  deductible: string;
  conditions: string[];
  exclusions: string[];
  fullExtract: string;
  appliesTo: string[];
}

export interface ContractDocument {
  id: string;
  title: string;
  issuer: string;
  contractNumber: string;
  category: 'bancaire' | 'habitation' | 'sante' | 'scolaire' | 'prevoyance' | 'complementaire';
  uploadedAt: string;
  clauses: ContractClause[];
  isFictional: boolean;
}

export interface ContractScanResult {
  contractId: string;
  contractName: string;
  issuer: string;
  category: 'bancaire' | 'habitation' | 'sante' | 'scolaire' | 'prevoyance' | 'complementaire';
  status: 'couvre_totalement' | 'couvre_partiellement' | 'non_applicable' | 'a_verifier';
  contribution: string;
  clauseRef?: string;
}

export interface AuditCheckItem {
  id: string;
  title: string;
  category: 'sejour_ski' | 'foyer_general' | 'annulation' | 'responsabilite';
  status: 'couvert' | 'a_verifier' | 'chevauchement' | 'non_couvert';
  source: InformationSource;
  summary: string;
  actionRequired?: string;
  clauseRef?: string;
  attachedToStay?: boolean;
}

export interface ClaimPreparationData {
  situationTitle: string;
  insuredPerson: string;
  totalCost: number;
  refundedAmount: number;
  remainingAmount: number;
  deductibleAmount: number;
  estimatedPayout: number;
  ceilingAmount: number;
  certaintyLevel: 'eleve' | 'modere' | 'a_confirmer';
  proofsUsed: { name: string; type: 'document' | 'declaration'; details: string }[];
  missingProofs: { name: string; howToGet: string; mandatory: boolean }[];
  draftLetter: string;
}

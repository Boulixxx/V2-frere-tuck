import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  FamilyMember,
  SkiStay,
  ContractDocument,
  ContractClause,
  AuditCheckItem,
  ClaimPreparationData,
} from '../types';
import {
  INITIAL_MEMBERS,
  INITIAL_SKI_STAY,
  CONTRACT_DOCUMENTS,
  INITIAL_AUDIT_ITEMS,
  OPTIONAL_COMPLEMENT_DOC,
} from '../data/mockData';

interface HouseholdContextType {
  isZeroDataMode: boolean;
  setZeroDataMode: (enabled: boolean) => void;
  members: FamilyMember[];
  stay: SkiStay;
  documents: ContractDocument[];
  auditItems: AuditCheckItem[];
  hasComplementaryDoc: boolean;
  activeTab: 'situations' | 'protections' | 'foyer';
  setActiveTab: (tab: 'situations' | 'protections' | 'foyer') => void;
  
  // Modals & Drawers
  selectedClauseForProof: ContractClause | null;
  isProofModalOpen: boolean;
  openProofModal: (clauseIdOrClause: string | ContractClause) => void;
  closeProofModal: () => void;
  
  isOverlapModalOpen: boolean;
  openOverlapModal: () => void;
  closeOverlapModal: () => void;
  
  isRobinModalOpen: boolean;
  claimPreparation: ClaimPreparationData | null;
  openRobinModal: (claimData: ClaimPreparationData) => void;
  closeRobinModal: () => void;

  isHouseholdManagerOpen: boolean;
  openHouseholdManager: () => void;
  closeHouseholdManager: () => void;

  // Actions
  updateStay: (fields: Partial<SkiStay>) => void;
  updateMember: (id: string, fields: Partial<FamilyMember>) => void;
  addAuditItem: (item: AuditCheckItem) => void;
  removeAuditItem: (id: string) => void;
  addComplementaryDocument: () => void;
  removeComplementaryDocument: () => void;
  resetDemoData: () => void;
  
  // Google Workspace Modal
  isWorkspaceModalOpen: boolean;
  workspaceActiveTab: 'overview' | 'drive' | 'docs' | 'sheets' | 'gmail';
  openWorkspaceModal: (tab?: 'overview' | 'drive' | 'docs' | 'sheets' | 'gmail') => void;
  closeWorkspaceModal: () => void;

  // Visual Palettes & Themes
  palette: 'navy' | 'parchment' | 'basalt' | 'forest';
  setPalette: (p: 'navy' | 'parchment' | 'basalt' | 'forest') => void;
  isPaletteModalOpen: boolean;
  openPaletteModal: () => void;
  closePaletteModal: () => void;

  // Direct scenario triggers
  requestedScenario: 'scene1_ski' | 'scene3_annulation' | null;
  setRequestedScenario: (scene: 'scene1_ski' | 'scene3_annulation' | null) => void;
}

const STORAGE_KEY = 'frere_tuck_household_state_v1';

const HouseholdContext = createContext<HouseholdContextType | undefined>(undefined);

export const HouseholdProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage or defaults
  const [isZeroDataMode, setIsZeroDataModeState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Boolean(parsed.isZeroDataMode);
      }
    } catch (e) {
      console.warn('Storage read failed', e);
    }
    return false;
  });

  const [members, setMembers] = useState<FamilyMember[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.members) return parsed.members;
      }
    } catch (e) {
      console.warn('Storage read failed', e);
    }
    return INITIAL_MEMBERS;
  });

  const [stay, setStay] = useState<SkiStay>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.stay) return parsed.stay;
      }
    } catch (e) {
      console.warn('Storage read failed', e);
    }
    return INITIAL_SKI_STAY;
  });

  const [hasComplementaryDoc, setHasComplementaryDoc] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Boolean(parsed.hasComplementaryDoc);
      }
    } catch (e) {
      console.warn('Storage read failed', e);
    }
    return false;
  });

  const [documents, setDocuments] = useState<ContractDocument[]>(() => {
    return hasComplementaryDoc
      ? [...CONTRACT_DOCUMENTS, OPTIONAL_COMPLEMENT_DOC]
      : CONTRACT_DOCUMENTS;
  });

  const [auditItems, setAuditItems] = useState<AuditCheckItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.auditItems) return parsed.auditItems;
      }
    } catch (e) {
      console.warn('Storage read failed', e);
    }
    return INITIAL_AUDIT_ITEMS;
  });

  const [activeTab, setActiveTab] = useState<'situations' | 'protections' | 'foyer'>('situations');
  const [selectedClauseForProof, setSelectedClauseForProof] = useState<ContractClause | null>(null);
  const [isProofModalOpen, setIsProofModalOpen] = useState(false);
  const [isOverlapModalOpen, setIsOverlapModalOpen] = useState(false);
  const [isRobinModalOpen, setIsRobinModalOpen] = useState(false);
  const [claimPreparation, setClaimPreparation] = useState<ClaimPreparationData | null>(null);
  const [isHouseholdManagerOpen, setIsHouseholdManagerOpen] = useState(false);
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [workspaceActiveTab, setWorkspaceActiveTab] = useState<'overview' | 'drive' | 'docs' | 'sheets' | 'gmail'>('overview');
  const [palette, setPaletteState] = useState<'navy' | 'parchment' | 'basalt' | 'forest'>(() => {
    try {
      const saved = localStorage.getItem('frere_tuck_palette');
      if (saved && ['navy', 'parchment', 'basalt', 'forest'].includes(saved)) {
        return saved as any;
      }
    } catch {}
    return 'navy';
  });
  const [isPaletteModalOpen, setIsPaletteModalOpen] = useState(false);
  const [requestedScenario, setRequestedScenario] = useState<'scene1_ski' | 'scene3_annulation' | null>(null);

  // Sync data-theme with HTML root element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', palette);
    try {
      localStorage.setItem('frere_tuck_palette', palette);
    } catch {}
  }, [palette]);

  // Sync documents whenever hasComplementaryDoc changes
  useEffect(() => {
    if (hasComplementaryDoc) {
      setDocuments([...CONTRACT_DOCUMENTS, OPTIONAL_COMPLEMENT_DOC]);
    } else {
      setDocuments(CONTRACT_DOCUMENTS);
    }
  }, [hasComplementaryDoc]);

  // Recalculate audit items dynamically based on stay facts and documents
  useEffect(() => {
    if (isZeroDataMode) {
      setAuditItems([]);
      return;
    }

    setAuditItems((prev) => {
      let updated = [...prev];

      // 1. Secours piste item check
      const hasSecours = updated.some((item) => item.id === 'audit-secours-piste');
      if (!hasSecours) {
        updated.push({
          id: 'audit-secours-piste',
          title: 'Secours sur piste de ski',
          category: 'sejour_ski',
          status: 'couvert',
          source: 'document',
          summary: 'Vous avez déjà une protection pour les secours sur piste (Carte Gold p. 12).',
          actionRequired: 'Aucune action requise. Frais réels pris en charge jusqu’à 5 000 €.',
          clauseRef: 'clause-secours-piste',
          attachedToStay: true,
        });
      }

      // 2. Hors-piste check: if offPiste is oui_seul or oui_guide, it becomes high priority in audit!
      const horsPisteIndex = updated.findIndex((item) => item.id === 'audit-hors-piste');
      if (stay.offPistePlanned !== 'non') {
        const isCoveredByComplement = hasComplementaryDoc;
        const status = isCoveredByComplement
          ? 'couvert'
          : stay.offPistePlanned === 'oui_guide'
          ? 'couvert'
          : 'a_verifier';

        const summary = isCoveredByComplement
          ? 'Hors-piste couvert intégralement grâce à votre attestation Neige & Montagne récemment ajoutée.'
          : stay.offPistePlanned === 'oui_guide'
          ? 'Hors-piste couvert sous condition de présence d’un moniteur ou guide diplômé d’État (Carte Gold p. 14).'
          : 'Point prioritaire : le hors-piste individuel sans encadrement est exclu par la Carte Gold (Art. 4.2).';

        const action = isCoveredByComplement
          ? 'Conservez l’attestation Neige & Montagne avec vous.'
          : stay.offPistePlanned === 'oui_guide'
          ? 'Conserver la preuve de réservation / facture ESF ou du bureau des guides.'
          : 'Vérifier la souscription d’un ticket Carré Neige (environ 3,30 €/jour/personne) ou skier uniquement encadré.';

        const horsPisteItem: AuditCheckItem = {
          id: 'audit-hors-piste',
          title: 'Pratique du ski hors des pistes balisées',
          category: 'sejour_ski',
          status,
          source: isCoveredByComplement ? 'document' : 'declared',
          summary,
          actionRequired: action,
          clauseRef: isCoveredByComplement ? 'clause-neige-hors-piste-total' : 'clause-hors-piste',
          attachedToStay: true,
        };

        if (horsPisteIndex >= 0) {
          updated[horsPisteIndex] = horsPisteItem;
        } else {
          updated.unshift(horsPisteItem); // high priority at top
        }
      } else if (horsPisteIndex >= 0) {
        // If not planned, remove or downgrade
        updated.splice(horsPisteIndex, 1);
      }

      // 3. Rapatriement enfants check: if complement doc added, it resolves!
      const rapatriementIndex = updated.findIndex((item) => item.id === 'audit-rapatriement-enfants');
      if (rapatriementIndex >= 0) {
        if (hasComplementaryDoc) {
          updated[rapatriementIndex] = {
            ...updated[rapatriementIndex],
            status: 'couvert',
            source: 'document',
            summary: 'Garde et retour de Léo couverts dès l’hospitalisation d’un seul parent (Attestation Neige p. 4).',
            actionRequired: 'Résolu par le nouveau document ajouté. La clause restrictive de la Carte Gold est compensée.',
            clauseRef: 'clause-neige-garde-enfants',
          };
        } else {
          updated[rapatriementIndex] = {
            ...updated[rapatriementIndex],
            status: 'a_verifier',
            source: 'document',
            summary: 'Un point est à vérifier avant le départ concernant le rapatriement des enfants : la notice Carte Gold n’organise le retour de Léo que si les DEUX parents sont hospitalisés.',
            actionRequired: 'Retrouver la clause d’assistance rapatriement familiale ou souscrire une garantie secours station.',
            clauseRef: 'clause-rapatriement-enfants',
          };
        }
      }

      return updated;
    });
  }, [stay.offPistePlanned, hasComplementaryDoc, isZeroDataMode]);

  // Save state to localStorage
  useEffect(() => {
    try {
      const stateToSave = {
        isZeroDataMode,
        members,
        stay,
        hasComplementaryDoc,
        auditItems,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.warn('Storage save failed', e);
    }
  }, [isZeroDataMode, members, stay, hasComplementaryDoc, auditItems]);

  const setZeroDataMode = (enabled: boolean) => {
    setIsZeroDataModeState(enabled);
    if (enabled) {
      // Clear data for demonstration of "empty slate"
      setMembers([]);
      setStay({
        id: 'stay-empty',
        destination: '',
        resort: '',
        startDate: '',
        endDate: '',
        totalCost: 0,
        refundedByProvider: 0,
        paymentMethod: 'inconnu',
        paymentConfirmedDoc: false,
        medicalCertAvailable: false,
        offPistePlanned: 'non',
        cancellationReason: 'inconnu',
      });
      setHasComplementaryDoc(false);
      setAuditItems([]);
    } else {
      // Restore demo household
      resetDemoData();
    }
  };

  const resetDemoData = () => {
    setIsZeroDataModeState(false);
    setMembers(INITIAL_MEMBERS);
    setStay(INITIAL_SKI_STAY);
    setHasComplementaryDoc(false);
    setAuditItems(INITIAL_AUDIT_ITEMS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Storage remove failed', e);
    }
  };

  const updateStay = (fields: Partial<SkiStay>) => {
    setStay((prev) => ({ ...prev, ...fields }));
  };

  const updateMember = (id: string, fields: Partial<FamilyMember>) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...fields } : m))
    );
  };

  const addAuditItem = (item: AuditCheckItem) => {
    setAuditItems((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      if (exists) {
        return prev.map((i) => (i.id === item.id ? item : i));
      }
      return [item, ...prev];
    });
  };

  const removeAuditItem = (id: string) => {
    setAuditItems((prev) => prev.filter((i) => i.id !== id));
  };

  const addComplementaryDocument = () => {
    setHasComplementaryDoc(true);
  };

  const removeComplementaryDocument = () => {
    setHasComplementaryDoc(false);
  };

  const openProofModal = (clauseIdOrClause: string | ContractClause) => {
    if (typeof clauseIdOrClause === 'string') {
      // Search across all documents
      let found: ContractClause | undefined;
      for (const doc of documents) {
        const c = doc.clauses.find((cl) => cl.id === clauseIdOrClause);
        if (c) {
          found = c;
          break;
        }
      }
      if (!found) {
        // search in complement too just in case
        found = OPTIONAL_COMPLEMENT_DOC.clauses.find((cl) => cl.id === clauseIdOrClause);
      }
      if (found) {
        setSelectedClauseForProof(found);
        setIsProofModalOpen(true);
      }
    } else {
      setSelectedClauseForProof(clauseIdOrClause);
      setIsProofModalOpen(true);
    }
  };

  const closeProofModal = () => {
    setIsProofModalOpen(false);
    setSelectedClauseForProof(null);
  };

  const openOverlapModal = () => setIsOverlapModalOpen(true);
  const closeOverlapModal = () => setIsOverlapModalOpen(false);

  const openRobinModal = (data: ClaimPreparationData) => {
    setClaimPreparation(data);
    setIsRobinModalOpen(true);
  };
  const closeRobinModal = () => {
    setIsRobinModalOpen(false);
  };

  const openHouseholdManager = () => setIsHouseholdManagerOpen(true);
  const closeHouseholdManager = () => setIsHouseholdManagerOpen(false);

  const openWorkspaceModal = (tab: 'overview' | 'drive' | 'docs' | 'sheets' | 'gmail' = 'overview') => {
    setWorkspaceActiveTab(tab);
    setIsWorkspaceModalOpen(true);
  };
  const closeWorkspaceModal = () => setIsWorkspaceModalOpen(false);

  const openPaletteModal = () => setIsPaletteModalOpen(true);
  const closePaletteModal = () => setIsPaletteModalOpen(false);

  return (
    <HouseholdContext.Provider
      value={{
        isZeroDataMode,
        setZeroDataMode,
        members,
        stay,
        documents,
        auditItems,
        hasComplementaryDoc,
        activeTab,
        setActiveTab,
        selectedClauseForProof,
        isProofModalOpen,
        openProofModal,
        closeProofModal,
        isOverlapModalOpen,
        openOverlapModal,
        closeOverlapModal,
        isRobinModalOpen,
        claimPreparation,
        openRobinModal,
        closeRobinModal,
        isHouseholdManagerOpen,
        openHouseholdManager,
        closeHouseholdManager,
        isWorkspaceModalOpen,
        workspaceActiveTab,
        openWorkspaceModal,
        closeWorkspaceModal,
        palette,
        setPalette: setPaletteState,
        isPaletteModalOpen,
        openPaletteModal,
        closePaletteModal,
        updateStay,
        updateMember,
        addAuditItem,
        removeAuditItem,
        addComplementaryDocument,
        removeComplementaryDocument,
        resetDemoData,
        requestedScenario,
        setRequestedScenario,
      }}
    >
      {children}
    </HouseholdContext.Provider>
  );
};

export const useHousehold = () => {
  const context = useContext(HouseholdContext);
  if (!context) {
    throw new Error('useHousehold must be used within a HouseholdProvider');
  }
  return context;
};

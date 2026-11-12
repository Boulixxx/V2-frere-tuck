import React, { useState, useEffect } from 'react';
import { useHousehold } from '../context/HouseholdContext';
import {
  initAuth,
  googleSignIn,
  logoutGoogle,
  getAccessToken,
  listDriveFiles,
  createGoogleDoc,
  createAuditSpreadsheet,
  sendGmailMessage,
  DriveFileItem,
} from '../services/googleWorkspace';
import { User } from 'firebase/auth';
import {
  X,
  FileText,
  Table,
  Mail,
  FolderOpen,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Search,
  Send,
  Loader2,
  RefreshCw,
  LogOut,
  ShieldCheck,
  FileCheck,
  Info,
} from 'lucide-react';

export const GoogleWorkspaceModal: React.FC = () => {
  const {
    isWorkspaceModalOpen,
    workspaceActiveTab,
    openWorkspaceModal,
    closeWorkspaceModal,
    documents,
    stay,
    claimPreparation,
    auditItems,
    addAuditItem,
  } = useHousehold();

  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Active sub-tab inside the modal
  const [activeTab, setActiveTab] = useState<'overview' | 'drive' | 'docs' | 'sheets' | 'gmail'>('overview');

  // Drive state
  const [driveQuery, setDriveQuery] = useState('assurance');
  const [driveFiles, setDriveFiles] = useState<DriveFileItem[]>([]);
  const [isSearchingDrive, setIsSearchingDrive] = useState(false);
  const [driveError, setDriveError] = useState<string | null>(null);
  const [hasSearchedDrive, setHasSearchedDrive] = useState(false);

  // Docs state
  const [isCreatingDoc, setIsCreatingDoc] = useState(false);
  const [createdDocUrl, setCreatedDocUrl] = useState<string | null>(null);
  const [docTitle, setDocTitle] = useState('Dossier Sinistre - Annulation Ski (Foyer Thomas & Camille)');
  const [docError, setDocError] = useState<string | null>(null);

  // Sheets state
  const [isCreatingSheet, setIsCreatingSheet] = useState(false);
  const [createdSheetUrl, setCreatedSheetUrl] = useState<string | null>(null);
  const [sheetTitle, setSheetTitle] = useState('Audit des Protections du Foyer - Frère Tuck');
  const [sheetError, setSheetError] = useState<string | null>(null);

  // Gmail state & Mandatory Confirmation
  const [gmailRecipient, setGmailRecipient] = useState('service.sinistres@mondial-assistance.fr');
  const [gmailSubject, setGmailSubject] = useState(
    'Déclaration de sinistre : Annulation séjour ski - Dossier Thomas & Camille'
  );
  const [gmailBody, setGmailBody] = useState('');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSentSuccess, setEmailSentSuccess] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [showEmailConfirmDialog, setShowEmailConfirmDialog] = useState(false);

  // Sync activeTab when modal is opened with specific tab
  useEffect(() => {
    if (workspaceActiveTab) {
      setActiveTab(workspaceActiveTab);
    }
  }, [workspaceActiveTab, isWorkspaceModalOpen]);

  // Initialize Auth state listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setCurrentUser(user);
        setAccessToken(token);
        setAuthError(null);
      },
      () => {
        setCurrentUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Update default email body based on claimPreparation if available
  useEffect(() => {
    if (claimPreparation?.draftLetter) {
      setGmailBody(claimPreparation.draftLetter);
    } else {
      setGmailBody(
        `Madame, Monsieur,\n\nJe vous adresse par la présente une demande d’ouverture de dossier de prise en charge au titre de nos garanties d’assurance et d’assistance pour le foyer Thomas & Camille.\n\nSéjour concerné : Station Les Menuires\nMontant engagé : ${stay.totalCost} €\nContrats analysés : Carte Gold Mastercard & Assurance Habitation\n\nMerci de bien vouloir m'indiquer les pièces complémentaires requises pour le versement des indemnités.\n\nCordialement,\nThomas & Camille`
      );
    }
  }, [claimPreparation, stay.totalCost]);

  if (!isWorkspaceModalOpen) return null;

  // Handle Google Sign-in
  const handleSignIn = async () => {
    setIsAuthLoading(true);
    setAuthError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setCurrentUser(result.user);
        setAccessToken(result.accessToken);
      }
    } catch (err: any) {
      console.error('Google sign-in failure:', err);
      setAuthError(
        err?.message ||
          'La connexion à Google Workspace a échoué. Vérifiez vos autorisations dans la fenêtre contextuelle.'
      );
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Handle Sign-out
  const handleSignOut = async () => {
    await logoutGoogle();
    setCurrentUser(null);
    setAccessToken(null);
    setDriveFiles([]);
    setCreatedDocUrl(null);
    setCreatedSheetUrl(null);
    setEmailSentSuccess(false);
  };

  // Google Drive: Search files
  const handleSearchDrive = async () => {
    if (!accessToken) return;
    setIsSearchingDrive(true);
    setDriveError(null);
    try {
      const files = await listDriveFiles(accessToken, driveQuery.trim());
      setDriveFiles(files);
      setHasSearchedDrive(true);
    } catch (err: any) {
      console.error('Drive search failed:', err);
      setDriveError(err?.message || 'Impossible de rechercher dans Google Drive');
    } finally {
      setIsSearchingDrive(false);
    }
  };

  // Google Docs: Create document
  const handleCreateDoc = async () => {
    if (!accessToken) return;
    setIsCreatingDoc(true);
    setDocError(null);
    setCreatedDocUrl(null);

    const content = claimPreparation?.draftLetter
      ? `${docTitle}\n\nDate: ${new Date().toLocaleDateString('fr-FR')}\nDossier: #${
          claimPreparation.situationTitle
        }\nIndemnité estimée: ${claimPreparation.estimatedPayout} €\n\n${claimPreparation.draftLetter}`
      : `${docTitle}\n\nDate: ${new Date().toLocaleDateString('fr-FR')}\nFoyer: Thomas & Camille\nSéjour: Les Menuires (${
          stay.startDate
        } au ${stay.endDate})\n\nRésumé des garanties applicables :\n${documents
          .map((d) => `- ${d.title} (${d.issuer}) : ${d.clauses.length} clauses actives`)
          .join('\n')}`;

    try {
      const result = await createGoogleDoc(accessToken, docTitle, content);
      setCreatedDocUrl(result.docUrl);
      addAuditItem({
        id: `audit-gdoc-${Date.now()}`,
        title: `Document Google Docs créé : ${docTitle}`,
        category: 'annulation',
        status: 'couvert',
        source: 'document',
        summary: `Le document officiel a été généré dans Google Docs (${result.docUrl}).`,
        actionRequired: 'Consulter ou partager le document créé.',
        attachedToStay: true,
      });
    } catch (err: any) {
      console.error('Doc creation error:', err);
      setDocError(err?.message || 'Erreur lors de la création du Google Doc');
    } finally {
      setIsCreatingDoc(false);
    }
  };

  // Google Sheets: Create Spreadsheet
  const handleCreateSheet = async () => {
    if (!accessToken) return;
    setIsCreatingSheet(true);
    setSheetError(null);
    setCreatedSheetUrl(null);

    // Build tabular rows for all contracts
    const rows: Array<Array<string | number>> = [
      ['Audit des Protections du Foyer — Frère Tuck', '', '', '', '', ''],
      [`Date de génération: ${new Date().toLocaleDateString('fr-FR')}`, '', '', '', '', ''],
      ['', '', '', '', '', ''],
      [
        'Contrat',
        'Assureur / Organisme',
        'Garantie Principale',
        'Plafond',
        'Franchise',
        'Condition Clé',
      ],
      [
        'Assurance Multirisque Habitation',
        'Pacificia Assurances',
        'Responsabilité Civile Villégiature',
        '20 000 000 €',
        '120 €',
        'Valable en France et monde entier sans paiement CB requis',
      ],
      [
        'Carte Gold Mastercard',
        'Mondial Assistance',
        'Secours sur piste & Annulation séjour',
        '5 000 € / an',
        '0 € (Secours), 50 € (Annulation)',
        'Obligation d’avoir réglé le séjour avec la Carte Gold',
      ],
      [
        'Complémentaire Santé',
        'Harmonie Mutuelle',
        'Dépassements honoraires & Hospitalisation',
        '200% BRSS / Frais réels',
        '0 €',
        'Tiers-payant national pour Thomas, Camille et Léo',
      ],
      [
        'Assurance Scolaire 24h/24',
        'MAE / MMA',
        'Secours montagne & Individuelle accident Léo',
        '2 500 € secours / 150 000 € invalidité',
        '0 €',
        'Couvre Léo en permanence, y compris en vacances familiales',
      ],
      [
        'Garantie Accidents de la Vie (GAV)',
        'AXA France',
        'Indemnisation préjudices corporels graves',
        '1 000 000 € / victime',
        'AIPP > 5%',
        'Prise en charge sans recherche de responsable tiers',
      ],
    ];

    try {
      const result = await createAuditSpreadsheet(accessToken, sheetTitle, rows);
      setCreatedSheetUrl(result.sheetUrl);
      addAuditItem({
        id: `audit-gsheet-${Date.now()}`,
        title: `Feuille Google Sheets générée : ${sheetTitle}`,
        category: 'foyer_general',
        status: 'couvert',
        source: 'document',
        summary: `La synthèse tabulaire de vos 5 contrats est disponible dans Google Sheets.`,
        actionRequired: 'Consulter la grille d’audit dans Google Sheets.',
      });
    } catch (err: any) {
      console.error('Sheet creation error:', err);
      setSheetError(err?.message || 'Erreur lors de la création de la feuille Google Sheets');
    } finally {
      setIsCreatingSheet(false);
    }
  };

  // Gmail: Open mandatory confirmation dialog
  const handleInitiateSendEmail = () => {
    if (!gmailRecipient || !gmailSubject || !gmailBody) {
      setEmailError('Veuillez renseigner le destinataire, l’objet et le corps du message.');
      return;
    }
    setEmailError(null);
    setShowEmailConfirmDialog(true);
  };

  // Gmail: Confirm and send email
  const handleConfirmSendEmail = async () => {
    if (!accessToken) return;
    setIsSendingEmail(true);
    setEmailError(null);
    setShowEmailConfirmDialog(false);

    try {
      await sendGmailMessage(accessToken, gmailRecipient, gmailSubject, gmailBody);
      setEmailSentSuccess(true);
      addAuditItem({
        id: `audit-gmail-${Date.now()}`,
        title: `Courriel expédié via Gmail à ${gmailRecipient}`,
        category: 'annulation',
        status: 'couvert',
        source: 'document',
        summary: `Déclaration formelle envoyée le ${new Date().toLocaleDateString(
          'fr-FR'
        )} avec accusé de transmission.`,
        actionRequired: 'Conserver la copie dans vos messages envoyés Gmail.',
        attachedToStay: true,
      });
    } catch (err: any) {
      console.error('Gmail send error:', err);
      setEmailError(err?.message || 'Erreur lors de l’envoi du courriel via Gmail');
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-white w-full sm:max-w-3xl max-h-[92vh] sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-amber-300 flex items-center justify-center font-bold text-xs shadow-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
                Espace Google Workspace
              </div>
              <h3 className="text-sm font-bold text-slate-900">
                Drive · Docs · Sheets · Gmail
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentUser && (
              <button
                onClick={handleSignOut}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 px-2.5 py-1 rounded-md hover:bg-slate-200/60 transition-colors"
                title="Se déconnecter"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            )}
            <button
              onClick={closeWorkspaceModal}
              className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              aria-label="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* User Connection Banner (if signed in) */}
        {currentUser && (
          <div className="px-5 py-2.5 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between text-xs text-emerald-900">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>
                Connecté en tant que{' '}
                <strong className="font-semibold text-emerald-950">
                  {currentUser.displayName || currentUser.email}
                </strong>
              </span>
            </div>
            <span className="text-[11px] text-emerald-700 font-mono hidden sm:inline">
              Session Google active
            </span>
          </div>
        )}

        {/* Sub-navigation tabs (visible always) */}
        <div className="flex border-b border-slate-200 px-5 bg-slate-50/50 gap-1 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-emerald-800 text-emerald-900 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Vue d’ensemble
          </button>

          <button
            onClick={() => setActiveTab('drive')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'drive'
                ? 'border-emerald-800 text-emerald-900 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5 text-blue-600" />
            Google Drive
          </button>

          <button
            onClick={() => setActiveTab('docs')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'docs'
                ? 'border-emerald-800 text-emerald-900 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-sky-600" />
            Google Docs
          </button>

          <button
            onClick={() => setActiveTab('sheets')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'sheets'
                ? 'border-emerald-800 text-emerald-900 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Table className="w-3.5 h-3.5 text-emerald-600" />
            Google Sheets
          </button>

          <button
            onClick={() => setActiveTab('gmail')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'gmail'
                ? 'border-emerald-800 text-emerald-900 font-semibold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-red-600" />
            Gmail
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-sm flex-1">
          {/* If NOT authenticated, show standard Google Sign-in card */}
          {!currentUser ? (
            <div className="py-6 px-4 text-center max-w-md mx-auto space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-700 shadow-sm border border-slate-200">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Connecter vos outils Google Workspace
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Autorisez Frère Tuck à interagir avec vos documents : rechercher vos contrats d'assurance dans Google Drive, générer des dossiers de réclamation dans Google Docs, exporter l'audit dans Google Sheets et expédier vos déclarations par Gmail.
                </p>
              </div>

              {authError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2 text-left">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Official Google Material Sign-in Button */}
              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  onClick={handleSignIn}
                  disabled={isAuthLoading}
                  className="px-5 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs sm:text-sm flex items-center gap-3 shadow-sm hover:shadow transition-all disabled:opacity-60 cursor-pointer"
                >
                  {isAuthLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
                      <span>Connexion en cours...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
                        <path
                          fill="#EA4335"
                          d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                        />
                        <path
                          fill="#4285F4"
                          d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                        />
                        <path
                          fill="#34A853"
                          d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                        />
                      </svg>
                      <span>Se connecter avec Google</span>
                    </>
                  )}
                </button>
              </div>

              <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-500 text-left">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Jeton conservé en mémoire uniquement</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Confirmation obligatoire avant envoi Gmail</span>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">
                        Intégration Google Workspace prête pour le foyer
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                        Frère Tuck est connecté à votre espace personnel. Choisissez une action pour synchroniser vos protections d’assurance avec vos outils bureautiques Google.
                      </p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {/* Action 1: Drive */}
                    <div
                      onClick={() => setActiveTab('drive')}
                      className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 bg-white hover:bg-blue-50/30 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <FolderOpen className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-bold text-slate-900 group-hover:text-blue-900">
                          1. Google Drive
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Recherchez vos contrats, attestations et quittances stockés sur votre Drive pour les rapprocher de Frère Tuck.
                      </p>
                      <span className="text-[11px] font-semibold text-blue-700 mt-2 block">
                        Parcourir les fichiers →
                      </span>
                    </div>

                    {/* Action 2: Docs */}
                    <div
                      onClick={() => setActiveTab('docs')}
                      className="p-4 rounded-xl border border-slate-200 hover:border-sky-400 bg-white hover:bg-sky-50/30 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-sky-600" />
                        <span className="text-xs font-bold text-slate-900 group-hover:text-sky-900">
                          2. Google Docs
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Générez un dossier formel de réclamation ou une lettre de mise en jeu des garanties au format Google Docs.
                      </p>
                      <span className="text-[11px] font-semibold text-sky-700 mt-2 block">
                        Créer le document →
                      </span>
                    </div>

                    {/* Action 3: Sheets */}
                    <div
                      onClick={() => setActiveTab('sheets')}
                      className="p-4 rounded-xl border border-slate-200 hover:border-emerald-400 bg-white hover:bg-emerald-50/30 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Table className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-900">
                          3. Google Sheets
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Exportez la matrice des 5 contrats du foyer (plafonds, franchises, statut) sous forme de feuille de calcul.
                      </p>
                      <span className="text-[11px] font-semibold text-emerald-700 mt-2 block">
                        Exporter le tableau →
                      </span>
                    </div>

                    {/* Action 4: Gmail */}
                    <div
                      onClick={() => setActiveTab('gmail')}
                      className="p-4 rounded-xl border border-slate-200 hover:border-red-400 bg-white hover:bg-red-50/30 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Mail className="w-4 h-4 text-red-600" />
                        <span className="text-xs font-bold text-slate-900 group-hover:text-red-900">
                          4. Gmail
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">
                        Envoyez directement la déclaration de sinistre ou la demande d’attestation à votre assureur avec confirmation préalable.
                      </p>
                      <span className="text-[11px] font-semibold text-red-700 mt-2 block">
                        Rédiger le courriel →
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: GOOGLE DRIVE */}
              {activeTab === 'drive' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <FolderOpen className="w-4 h-4 text-blue-600" />
                        Rechercher vos contrats dans Google Drive
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Trouvez vos notices, attestations d’assurance ou factures récentes enregistrées sur Google Drive.
                      </p>
                    </div>
                  </div>

                  {/* Search Bar */}
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        value={driveQuery}
                        onChange={(e) => setDriveQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearchDrive()}
                        placeholder="Ex : assurance, mutuelle, contrat, séjour ski..."
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>
                    <button
                      onClick={handleSearchDrive}
                      disabled={isSearchingDrive}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
                    >
                      {isSearchingDrive ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Recherche...</span>
                        </>
                      ) : (
                        <>
                          <Search className="w-3.5 h-3.5" />
                          <span>Rechercher</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Quick Filters */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="text-slate-500">Mots-clés suggérés :</span>
                    {['assurance', 'contrat', 'notice', 'attestation', 'ski'].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => {
                          setDriveQuery(tag);
                        }}
                        className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  {driveError && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{driveError}</span>
                    </div>
                  )}

                  {/* Results list */}
                  {driveFiles.length > 0 ? (
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-slate-700">
                        {driveFiles.length} fichier(s) trouvé(s) sur votre Google Drive :
                      </div>
                      <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50 max-h-60 overflow-y-auto">
                        {driveFiles.map((file) => (
                          <div
                            key={file.id}
                            className="p-3 flex items-center justify-between gap-3 text-xs hover:bg-white transition-colors"
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              <FileCheck className="w-4 h-4 text-blue-600 shrink-0" />
                              <div className="truncate">
                                <div className="font-medium text-slate-900 truncate">
                                  {file.name}
                                </div>
                                <div className="text-[11px] text-slate-500">
                                  {file.modifiedTime
                                    ? `Modifié le ${new Date(file.modifiedTime).toLocaleDateString('fr-FR')}`
                                    : 'Fichier Drive'}
                                </div>
                              </div>
                            </div>

                            {file.webViewLink && (
                              <a
                                href={file.webViewLink}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-medium flex items-center gap-1 shrink-0"
                              >
                                <span>Ouvrir</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : hasSearchedDrive && !isSearchingDrive ? (
                    <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      Aucun document correspondant à « {driveQuery} » sur votre Google Drive.
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
                      <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>
                        Cliquez sur <strong>Rechercher</strong> pour lister les contrats et factures d’assurance disponibles dans votre Drive personnel.
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: GOOGLE DOCS */}
              {activeTab === 'docs' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-sky-600" />
                      Générer un dossier dans Google Docs
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Crée automatiquement un document Google Docs structuré contenant l’argumentaire contractuel rédigé par Frère Tuck.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 block">
                      Titre du document Google Docs
                    </label>
                    <input
                      type="text"
                      value={docTitle}
                      onChange={(e) => setDocTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  {/* Document preview */}
                  <div className="space-y-1.5">
                    <div className="text-xs font-semibold text-slate-700">
                      Aperçu du contenu qui sera inséré :
                    </div>
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 whitespace-pre-line leading-relaxed max-h-40 overflow-y-auto">
                      {claimPreparation?.draftLetter ||
                        `Audit des Protections du Foyer — Frère Tuck\nFoyer: Thomas & Camille\nSéjour: Les Menuires (1 800 €)\n\nContrats analysés : Carte Gold Mastercard, Assurance Habitation, Complémentaire Santé, Assurance Scolaire, GAV.`}
                    </div>
                  </div>

                  {docError && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{docError}</span>
                    </div>
                  )}

                  {createdDocUrl && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Document créé avec succès dans votre Google Drive !</span>
                      </div>
                      <a
                        href={createdDocUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-semibold text-xs flex items-center gap-1.5 shrink-0"
                      >
                        <span>Ouvrir dans Google Docs</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleCreateDoc}
                      disabled={isCreatingDoc}
                      className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {isCreatingDoc ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Création en cours...</span>
                        </>
                      ) : (
                        <>
                          <FileText className="w-3.5 h-3.5" />
                          <span>Créer le Google Doc</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: GOOGLE SHEETS */}
              {activeTab === 'sheets' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Table className="w-4 h-4 text-emerald-600" />
                      Exporter l’audit des protections dans Google Sheets
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Exporte un tableau exhaustif des 5 contrats du foyer, leurs plafonds, franchises et statuts de couverture.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 block">
                      Nom de la feuille Google Sheets
                    </label>
                    <input
                      type="text"
                      value={sheetTitle}
                      onChange={(e) => setSheetTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>

                  {/* Table summary */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50">
                    <div className="px-3.5 py-2.5 bg-slate-100 font-semibold text-xs text-slate-800 border-b border-slate-200">
                      Données qui composeront votre tableur :
                    </div>
                    <div className="p-3 text-xs space-y-1 text-slate-600 font-mono">
                      <div>✓ 5 contrats complets du foyer (MRH, Gold, Mutuelle, Scolaire, GAV)</div>
                      <div>✓ Colonnes : Organisme, Garantie Clé, Plafond d’indemnisation, Franchise, Condition</div>
                      <div>✓ Formatage Google Sheets prêt pour vos archives patrimoniales</div>
                    </div>
                  </div>

                  {sheetError && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{sheetError}</span>
                    </div>
                  )}

                  {createdSheetUrl && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Feuille Google Sheets créée avec succès !</span>
                      </div>
                      <a
                        href={createdSheetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-semibold text-xs flex items-center gap-1.5 shrink-0"
                      >
                        <span>Ouvrir dans Google Sheets</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleCreateSheet}
                      disabled={isCreatingSheet}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {isCreatingSheet ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Génération du tableur...</span>
                        </>
                      ) : (
                        <>
                          <Table className="w-3.5 h-3.5" />
                          <span>Générer la feuille Google Sheets</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 5: GMAIL WITH EXPLICIT CONFIRMATION */}
              {activeTab === 'gmail' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-red-600" />
                      Expédier la déclaration par Gmail
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Transmettez directement votre dossier argumenté à l’assureur depuis votre adresse Gmail personnelle.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Destinataire
                      </label>
                      <input
                        type="email"
                        value={gmailRecipient}
                        onChange={(e) => setGmailRecipient(e.target.value)}
                        placeholder="Ex : service.sinistres@mondial-assistance.fr"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Objet du message
                      </label>
                      <input
                        type="text"
                        value={gmailSubject}
                        onChange={(e) => setGmailSubject(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">
                        Corps du courriel
                      </label>
                      <textarea
                        rows={7}
                        value={gmailBody}
                        onChange={(e) => setGmailBody(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 leading-relaxed"
                      />
                    </div>
                  </div>

                  {emailError && (
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{emailError}</span>
                    </div>
                  )}

                  {emailSentSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        Courriel expédié avec succès via Gmail à <strong>{gmailRecipient}</strong> ! Retrouvez-le dans vos éléments envoyés.
                      </span>
                    </div>
                  )}

                  {/* Send Button triggering explicit confirmation */}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <span className="text-[11px] text-slate-500">
                      Expéditeur : {currentUser.email}
                    </span>
                    <button
                      onClick={handleInitiateSendEmail}
                      disabled={isSendingEmail}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Envoyer via Gmail</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Google Workspace · Sécurisé par OAuth</span>
          </div>
          <button
            onClick={closeWorkspaceModal}
            className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-medium transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>

      {/* MANDATORY EXPLICIT CONFIRMATION DIALOG FOR GMAIL SEND */}
      {showEmailConfirmDialog && currentUser && (
        <div
          role="alertdialog"
          aria-modal="true"
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Confirmer l’envoi du courriel via Gmail
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Cette action va expédier un courriel réel depuis votre compte{' '}
                  <strong className="text-slate-900">{currentUser.email}</strong> vers{' '}
                  <strong className="text-slate-900">{gmailRecipient}</strong>.
                </p>
              </div>
            </div>

            {/* Email summary recap */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <div>
                <span className="text-slate-500">De :</span>{' '}
                <span className="font-medium text-slate-800">{currentUser.email}</span>
              </div>
              <div>
                <span className="text-slate-500">À :</span>{' '}
                <span className="font-semibold text-slate-900">{gmailRecipient}</span>
              </div>
              <div>
                <span className="text-slate-500">Objet :</span>{' '}
                <span className="font-medium text-slate-800">{gmailSubject}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowEmailConfirmDialog(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-medium transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmSendEmail}
                disabled={isSendingEmail}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
              >
                {isSendingEmail ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Confirmer et expédier l'e-mail</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

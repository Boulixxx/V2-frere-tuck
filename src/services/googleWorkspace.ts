import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
  signOut,
} from 'firebase/auth';
import firebaseConfig from '@/firebase-applet-config.json';

// Initialize Firebase (reuse instance if already initialized)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Configure Google Auth Provider with requested Workspace Scopes
export const WORKSPACE_SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/spreadsheets.readonly',
  'https://www.googleapis.com/auth/documents',
  'https://www.googleapis.com/auth/documents.readonly',
];

const provider = new GoogleAuthProvider();
WORKSPACE_SCOPES.forEach((scope) => {
  provider.addScope(scope);
});

// Prompt consent to ensure tokens have proper scopes
provider.setCustomParameters({
  prompt: 'consent',
  access_type: 'offline',
});

// In-memory token cache (never stored in localStorage)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Impossible de récupérer le jeton d’accès Google Workspace.');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Erreur lors de la connexion Google Workspace:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logoutGoogle = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

// ==========================================
// 1. GOOGLE DRIVE HELPERS
// ==========================================

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime?: string;
  webViewLink?: string;
}

export const listDriveFiles = async (
  accessToken: string,
  searchQuery?: string
): Promise<DriveFileItem[]> => {
  let query = "trashed = false";
  if (searchQuery) {
    query += ` and name contains '${searchQuery.replace(/'/g, "\\'")}'`;
  }

  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
    query
  )}&fields=files(id,name,mimeType,modifiedTime,webViewLink)&pageSize=15&orderBy=modifiedTime desc`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Erreur lors de la lecture de Google Drive');
  }

  const data = await res.json();
  return data.files || [];
};

// ==========================================
// 2. GOOGLE DOCS HELPERS
// ==========================================

export const createGoogleDoc = async (
  accessToken: string,
  title: string,
  bodyContent: string
): Promise<{ documentId: string; title: string; docUrl: string }> => {
  // Step 1: Create empty document
  const createRes = await fetch('https://docs.googleapis.com/v1/documents', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title }),
  });

  if (!createRes.ok) {
    const err = await createRes.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Erreur lors de la création du document Google Docs');
  }

  const doc = await createRes.json();
  const documentId = doc.documentId;

  // Step 2: Insert text into document
  if (bodyContent) {
    await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            insertText: {
              location: { index: 1 },
              text: bodyContent,
            },
          },
        ],
      }),
    });
  }

  return {
    documentId,
    title,
    docUrl: `https://docs.google.com/document/d/${documentId}/edit`,
  };
};

// ==========================================
// 3. GOOGLE SHEETS HELPERS
// ==========================================

export interface SheetRowData {
  [key: string]: string | number;
}

export const createAuditSpreadsheet = async (
  accessToken: string,
  title: string,
  rows: Array<Array<string | number>>
): Promise<{ spreadsheetId: string; sheetUrl: string }> => {
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: { title },
      sheets: [
        {
          properties: {
            title: 'Audit Protections Foyer',
            gridProperties: { rowCount: 50, columnCount: 10 },
          },
        },
      ],
    }),
  });

  if (!createRes.ok) {
    const err = await createRes.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Erreur lors de la création de la feuille Google Sheets');
  }

  const sheet = await createRes.json();
  const spreadsheetId = sheet.spreadsheetId;

  // Append data rows
  if (rows.length > 0) {
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Audit%20Protections%20Foyer!A1:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: rows,
        }),
      }
    );
  }

  return {
    spreadsheetId,
    sheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
  };
};

// ==========================================
// 4. GMAIL HELPERS
// ==========================================

export interface GmailMessageSummary {
  id: string;
  snippet: string;
  subject?: string;
  from?: string;
  date?: string;
}

export const listRecentEmails = async (
  accessToken: string,
  searchQuery = 'label:INBOX'
): Promise<GmailMessageSummary[]> => {
  const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${encodeURIComponent(
    searchQuery
  )}&maxResults=8`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Erreur lors de la lecture des messages Gmail');
  }

  const data = await res.json();
  const messages = data.messages || [];

  // Fetch snippets & headers for the first batch
  const details = await Promise.all(
    messages.slice(0, 5).map(async (m: { id: string }) => {
      try {
        const msgRes = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${m.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        if (!msgRes.ok) return { id: m.id, snippet: '' };
        const msgData = await msgRes.json();
        const headers = msgData.payload?.headers || [];
        const subject = headers.find((h: any) => h.name === 'Subject')?.value || 'Sans objet';
        const from = headers.find((h: any) => h.name === 'From')?.value || '';
        const date = headers.find((h: any) => h.name === 'Date')?.value || '';
        return {
          id: m.id,
          snippet: msgData.snippet || '',
          subject,
          from,
          date,
        };
      } catch {
        return { id: m.id, snippet: '' };
      }
    })
  );

  return details;
};

/**
 * Send an email via Gmail API
 * Note: Must be preceded by explicit user confirmation!
 */
export const sendGmailMessage = async (
  accessToken: string,
  to: string,
  subject: string,
  bodyText: string
): Promise<{ id: string }> => {
  // Construct RFC 2822 email message encoded in base64url
  const emailLines = [
    `To: ${to}`,
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
    '',
    bodyText,
  ];

  const emailRaw = emailLines.join('\r\n');
  const base64EncodedEmail = btoa(unescape(encodeURIComponent(emailRaw)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: base64EncodedEmail }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Erreur lors de l’envoi du courriel via Gmail');
  }

  return await res.json();
};

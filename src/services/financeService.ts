import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  getDoc,
  onSnapshot,
  writeBatch,
  query,
  orderBy,
} from 'firebase/firestore';

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface LedgerTransaction {
  id: string;
  date: string; // YYYY-MM-DD
  type: TransactionType;
  category: string;
  description: string;
  amount: number; // IDR
  paymentMethod: string;
  createdAt: number;
}

export interface VaultChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  badge?: string;
  createdAt: number;
}

export interface DeepSeekLedgerAction {
  action: 'ADD' | 'UPDATE' | 'DELETE' | 'CLEAR_ALL';
  targetId?: string;
  matchKeyword?: string;
  transaction?: {
    date?: string;
    type?: TransactionType;
    category?: string;
    description?: string;
    amount?: number;
    paymentMethod?: string;
  };
}

export interface DeepSeekParseResult {
  actions: DeepSeekLedgerAction[];
  executiveReply: string;
}

const FIREBASE_CONFIG = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
};

const app = getApps().length === 0 ? initializeApp(FIREBASE_CONFIG) : getApps()[0];
const db = getFirestore(app);

const LEDGER_COLLECTION = 'greyvaldo_finance_vault';
const CHAT_COLLECTION = 'greyvaldo_vault_chat';
const META_COLLECTION = 'greyvaldo_vault_meta';
const META_DOC_ID = 'vault_state';

const LOCAL_STORAGE_KEY = 'greyvaldo_finance_ledger_v2';
const LOCAL_CHAT_KEY = 'greyvaldo_finance_chat_v2';

export const EXPENSE_CATEGORIES = [
  'Housing & Kos',
  'Field Equipment & PPE',
  'Food & Coffee',
  'Transport & Flights',
  'Utilities & Data',
  'Certifications & Books',
  'Savings & Investment',
  'Other Expense',
];

export const INCOME_CATEGORIES = [
  'Engineering Salary',
  'Project Site Allowance',
  'Consulting & QC Audit',
  'Award & Bonus',
  'Investment Return',
  'Other Income',
];

export const INITIAL_SEED_TRANSACTIONS: LedgerTransaction[] = [
  {
    id: 'tx-seed-01',
    date: '2026-11-01',
    type: 'INCOME',
    category: 'Engineering Salary',
    description: 'Monthly QC Officer Salary & IKN Site Allowance (PT. PP Persero)',
    amount: 18500000,
    paymentMethod: 'Bank Mandiri',
    createdAt: 1762000000001,
  },
  {
    id: 'tx-seed-02',
    date: '2026-11-02',
    type: 'EXPENSE',
    category: 'Housing & Kos',
    description: 'Executive Boarding / Kos Monthly Rent & Maintenance',
    amount: 2500000,
    paymentMethod: 'QRIS / Transfer',
    createdAt: 1762000000002,
  },
  {
    id: 'tx-seed-03',
    date: '2026-11-03',
    type: 'EXPENSE',
    category: 'Field Equipment & PPE',
    description: 'Steel-Toe Safety Site Boots & Digital Laser Distance Meter',
    amount: 1250000,
    paymentMethod: 'Debit Card',
    createdAt: 1762000000003,
  },
  {
    id: 'tx-seed-04',
    date: '2026-11-04',
    type: 'EXPENSE',
    category: 'Transport & Flights',
    description: 'Balikpapan — Manado Return Flight Ticket Booking',
    amount: 2150000,
    paymentMethod: 'Credit Card',
    createdAt: 1762000000004,
  },
  {
    id: 'tx-seed-05',
    date: '2026-11-05',
    type: 'INCOME',
    category: 'Award & Bonus',
    description: 'QHSE Awards Honorarium & Rigid Pavement Publication Grant',
    amount: 3500000,
    paymentMethod: 'Bank Mandiri',
    createdAt: 1762000000005,
  },
  {
    id: 'tx-seed-06',
    date: '2026-11-06',
    type: 'EXPENSE',
    category: 'Food & Coffee',
    description: 'Specialty Arabica Coffee & Field Team Briefing Refreshments',
    amount: 185000,
    paymentMethod: 'QRIS',
    createdAt: 1762000000006,
  },
];

export const INITIAL_CHAT_MESSAGE: VaultChatMessage = {
  id: 'msg-init',
  role: 'assistant',
  text: 'TEXT-TO-LEDGER READY // Enter transactions or edits in English or Bahasa Indonesia (e.g., "Gaji masuk 18.5 juta, bayar kos 2.5 juta, beli kopi 55k" or "Salary came in 18.5 juta, paid kos 2.5 juta"). All entries sync directly to Cloud Firestore.',
  timestamp: 'READY',
  badge: 'LEDGER PARSER // FIRESTORE',
  createdAt: 1762000000000,
};

export function loadLocalTransactions(): LedgerTransaction[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw === null) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SEED_TRANSACTIONS));
      return INITIAL_SEED_TRANSACTIONS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return INITIAL_SEED_TRANSACTIONS;
  } catch {
    return INITIAL_SEED_TRANSACTIONS;
  }
}

export function saveLocalTransactions(txs: LedgerTransaction[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(txs));
  } catch {
    // ignore storage quota errors
  }
}

export function loadLocalChat(): VaultChatMessage[] {
  try {
    const raw = localStorage.getItem(LOCAL_CHAT_KEY);
    if (!raw) return [INITIAL_CHAT_MESSAGE];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [INITIAL_CHAT_MESSAGE];
  } catch {
    return [INITIAL_CHAT_MESSAGE];
  }
}

export function saveLocalChat(msgs: VaultChatMessage[]): void {
  try {
    localStorage.setItem(LOCAL_CHAT_KEY, JSON.stringify(msgs));
  } catch {
    // ignore
  }
}

/**
 * Subscribe to real-time Firestore updates for Ledger Transactions
 */
export function subscribeToFirestoreLedger(
  onUpdate: (txs: LedgerTransaction[], cloudConnected: boolean, lastSyncTime: string) => void
): () => void {
  let unsubscribeSnap: (() => void) | null = null;

  const initAndListen = async () => {
    try {
      const metaRef = doc(db, META_COLLECTION, META_DOC_ID);
      const metaSnap = await getDoc(metaRef);

      if (!metaSnap.exists()) {
        // First time initialization in Firestore: seed initial transactions if collection is empty
        const existingSnap = await getDocs(collection(db, LEDGER_COLLECTION));
        if (existingSnap.empty) {
          const batch = writeBatch(db);
          for (const item of INITIAL_SEED_TRANSACTIONS) {
            batch.set(doc(db, LEDGER_COLLECTION, item.id), item);
          }
          batch.set(metaRef, {
            initialized: true,
            status: 'SEEDED',
            updatedAt: Date.now(),
          });
          await batch.commit();
        } else {
          await setDoc(metaRef, {
            initialized: true,
            status: 'ACTIVE',
            updatedAt: Date.now(),
          });
        }
      }

      const q = query(collection(db, LEDGER_COLLECTION), orderBy('createdAt', 'asc'));
      unsubscribeSnap = onSnapshot(
        q,
        (snapshot) => {
          const items: LedgerTransaction[] = [];
          snapshot.forEach((d) => {
            items.push(d.data() as LedgerTransaction);
          });
          saveLocalTransactions(items);
          const nowStr = new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });
          onUpdate(items, true, nowStr);
        },
        () => {
          onUpdate(loadLocalTransactions(), false, 'LOCAL FALLBACK');
        }
      );
    } catch {
      onUpdate(loadLocalTransactions(), false, 'LOCAL FALLBACK');
    }
  };

  initAndListen();

  return () => {
    if (unsubscribeSnap) unsubscribeSnap();
  };
}

/**
 * Subscribe to real-time Firestore updates for Chat Messages
 */
export function subscribeToFirestoreChat(
  onUpdate: (msgs: VaultChatMessage[]) => void
): () => void {
  const q = query(collection(db, CHAT_COLLECTION), orderBy('createdAt', 'asc'));
  const unsub = onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        onUpdate([INITIAL_CHAT_MESSAGE]);
        return;
      }
      const items: VaultChatMessage[] = [];
      snapshot.forEach((d) => items.push(d.data() as VaultChatMessage));
      const fullList = items.some((m) => m.id === 'msg-init')
        ? items
        : [INITIAL_CHAT_MESSAGE, ...items];
      saveLocalChat(fullList);
      onUpdate(fullList);
    },
    () => {
      onUpdate(loadLocalChat());
    }
  );
  return unsub;
}

export async function saveChatMessageToFirestore(msg: VaultChatMessage): Promise<boolean> {
  try {
    await setDoc(doc(db, CHAT_COLLECTION, msg.id), msg);
    return true;
  } catch {
    return false;
  }
}

export async function resetChatHistoryInFirestore(): Promise<boolean> {
  try {
    const snap = await getDocs(collection(db, CHAT_COLLECTION));
    const batch = writeBatch(db);
    snap.forEach((d) => batch.delete(d.ref));
    batch.set(doc(db, CHAT_COLLECTION, INITIAL_CHAT_MESSAGE.id), INITIAL_CHAT_MESSAGE);
    await batch.commit();
    saveLocalChat([INITIAL_CHAT_MESSAGE]);
    return true;
  } catch {
    saveLocalChat([INITIAL_CHAT_MESSAGE]);
    return false;
  }
}

export async function upsertTransaction(tx: LedgerTransaction): Promise<boolean> {
  try {
    await setDoc(doc(db, LEDGER_COLLECTION, tx.id), tx);
    return true;
  } catch {
    return false;
  }
}

export async function removeTransactionFromCloud(id: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, LEDGER_COLLECTION, id));
    return true;
  } catch {
    return false;
  }
}

/**
 * Clear All Transactions to Rp 0 (Empty Ledger Slate) in Firestore + LocalStorage
 */
export async function clearAllTransactionsInFirestore(): Promise<boolean> {
  try {
    const snap = await getDocs(collection(db, LEDGER_COLLECTION));
    const batch = writeBatch(db);
    snap.forEach((d) => batch.delete(d.ref));
    batch.set(doc(db, META_COLLECTION, META_DOC_ID), {
      initialized: true,
      status: 'CLEARED_EMPTY',
      updatedAt: Date.now(),
    });
    await batch.commit();
    saveLocalTransactions([]);
    return true;
  } catch {
    saveLocalTransactions([]);
    return false;
  }
}

/**
 * Restore Default 6 Engineering Demo Transactions in Firestore + LocalStorage
 */
export async function restoreSeedTransactionsInFirestore(): Promise<boolean> {
  try {
    const snap = await getDocs(collection(db, LEDGER_COLLECTION));
    const batch = writeBatch(db);
    snap.forEach((d) => batch.delete(d.ref));
    for (const item of INITIAL_SEED_TRANSACTIONS) {
      batch.set(doc(db, LEDGER_COLLECTION, item.id), item);
    }
    batch.set(doc(db, META_COLLECTION, META_DOC_ID), {
      initialized: true,
      status: 'RESTORED_SEED',
      updatedAt: Date.now(),
    });
    await batch.commit();
    saveLocalTransactions(INITIAL_SEED_TRANSACTIONS);
    return true;
  } catch {
    saveLocalTransactions(INITIAL_SEED_TRANSACTIONS);
    return false;
  }
}

/**
 * DeepSeek Chat-to-Ledger Engine
 * Endpoint: https://api.deepseek.com/chat/completions
 * Model: deepseek-chat
 */
const DEEPSEEK_ENDPOINT =
  import.meta.env.VITE_DEEPSEEK_ENDPOINT || 'https://api.deepseek.com/chat/completions';
const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY || '';

export async function parseChatToLedgerWithDeepSeek(
  userPrompt: string,
  currentTransactions: LedgerTransaction[]
): Promise<DeepSeekParseResult> {
  const todayStr = new Date().toISOString().slice(0, 10);

  const systemPrompt = `You are the Surgical AI Financial Ledger Engine for Greyvaldo Christian, S.T (Civil Engineer & QA/QC Specialist).
Today's date is ${todayStr}.
Currency is Indonesian Rupiah (IDR).
Understand Indonesian and English shorthand numbers accurately:
- "juta" / "jt" / "m" = * 1,000,000 (e.g. "18.5 juta" = 18500000, "2.7 juta" = 2700000)
- "ribu" / "rb" / "k" = * 1,000 (e.g. "55k" = 55000, "850k" = 850000)

Current ledger transactions (so you can UPDATE, DELETE, or CLEAR_ALL existing items when asked):
${JSON.stringify(
  currentTransactions.map((t) => ({
    id: t.id,
    date: t.date,
    type: t.type,
    category: t.category,
    description: t.description,
    amount: t.amount,
  }))
)}

Allowed Expense Categories: ${EXPENSE_CATEGORIES.join(', ')}
Allowed Income Categories: ${INCOME_CATEGORIES.join(', ')}

Respond ONLY with valid JSON matching this exact structure:
{
  "actions": [
    {
      "action": "ADD" | "UPDATE" | "DELETE" | "CLEAR_ALL",
      "targetId": "existing id if UPDATE or DELETE",
      "matchKeyword": "keyword if matching by description/category",
      "transaction": {
        "date": "YYYY-MM-DD",
        "type": "INCOME" | "EXPENSE",
        "category": "Category Name",
        "description": "Concise surgical description",
        "amount": 18500000,
        "paymentMethod": "Bank Mandiri | QRIS | Cash | Debit Card | Credit Card"
      }
    }
  ],
  "executiveReply": "Concise executive summary of ledger updates with IDR numbers."
}`;

  try {
    const response = await fetch(DEEPSEEK_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        temperature: 0.1,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek HTTP ${response.status}`);
    }

    const data = await response.json();
    const rawContent = data?.choices?.[0]?.message?.content || '{}';
    const cleaned = rawContent.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned) as DeepSeekParseResult;
    if (Array.isArray(parsed.actions)) {
      return parsed;
    }
    throw new Error('Malformed JSON response');
  } catch {
    return localFallbackParser(userPrompt, todayStr);
  }
}

function parseIdrAmount(rawNumber: string, unit?: string): number {
  const normalized = parseFloat(rawNumber.replace(/,/g, '.'));
  if (isNaN(normalized)) return 0;
  const u = (unit || '').toLowerCase();
  if (u === 'juta' || u === 'jt' || u === 'm') return Math.round(normalized * 1_000_000);
  if (u === 'ribu' || u === 'rb' || u === 'k') return Math.round(normalized * 1_000);
  return normalized < 1000 ? Math.round(normalized * 1_000) : Math.round(normalized);
}

function localFallbackParser(prompt: string, todayStr: string): DeepSeekParseResult {
  const lower = prompt.toLowerCase();
  const actions: DeepSeekLedgerAction[] = [];

  if (
    lower.includes('reset all') ||
    lower.includes('clear all') ||
    lower.includes('hapus semua')
  ) {
    actions.push({ action: 'CLEAR_ALL' });
    return {
      actions,
      executiveReply: 'EXECUTED // All ledger transactions cleared to Rp 0 in Firestore.',
    };
  }

  if (lower.startsWith('delete ') || lower.startsWith('hapus ') || lower.includes('delete the ')) {
    const kw = lower
      .replace(/delete|hapus|the|expense|income|transaction/g, '')
      .trim();
    actions.push({
      action: 'DELETE',
      matchKeyword: kw,
    });
    return {
      actions,
      executiveReply: `EXECUTED // Removed ledger entry matching "${kw}".`,
    };
  }

  if (lower.startsWith('change ') || lower.startsWith('update ') || lower.startsWith('ubah ')) {
    const amountMatch = prompt.match(/(\d+(?:[.,]\d+)?)\s*(juta|jt|m|ribu|rb|k)?/i);
    const amount = amountMatch ? parseIdrAmount(amountMatch[1], amountMatch[2]) : 0;
    const kw = lower
      .replace(/change|update|ubah|to|ke|\d+(?:[.,]\d+)?\s*(juta|jt|m|ribu|rb|k)?/gi, '')
      .trim();
    if (amount > 0 && kw) {
      actions.push({
        action: 'UPDATE',
        matchKeyword: kw,
        transaction: { amount },
      });
      return {
        actions,
        executiveReply: `EXECUTED // Updated "${kw}" to IDR ${amount.toLocaleString('id-ID')}.`,
      };
    }
  }

  const segments = prompt.split(/,|(?:\band\b)|(?:\bdan\b)/i);
  for (const seg of segments) {
    const match = seg.match(/(\d+(?:[.,]\d+)?)\s*(juta|jt|m|ribu|rb|k)/i);
    if (!match) continue;
    const amount = parseIdrAmount(match[1], match[2]);
    if (amount <= 0) continue;

    const segLower = seg.toLowerCase();
    const isIncome =
      segLower.includes('salary') ||
      segLower.includes('gaji') ||
      segLower.includes('bonus') ||
      segLower.includes('income') ||
      segLower.includes('allowance') ||
      segLower.includes('masuk');

    let category = isIncome ? 'Engineering Salary' : 'Other Expense';
    if (!isIncome) {
      if (segLower.includes('kos') || segLower.includes('rent') || segLower.includes('sewa')) {
        category = 'Housing & Kos';
      } else if (segLower.includes('coffee') || segLower.includes('kopi') || segLower.includes('food') || segLower.includes('makan')) {
        category = 'Food & Coffee';
      } else if (segLower.includes('boot') || segLower.includes('site') || segLower.includes('ppe') || segLower.includes('helm')) {
        category = 'Field Equipment & PPE';
      } else if (segLower.includes('flight') || segLower.includes('tiket') || segLower.includes('grab') || segLower.includes('fuel')) {
        category = 'Transport & Flights';
      }
    }

    const cleanDesc = seg
      .replace(match[0], '')
      .replace(/\b(paid|bought|came in|bayar|beli|masuk|for)\b/gi, '')
      .trim();

    actions.push({
      action: 'ADD',
      transaction: {
        date: todayStr,
        type: isIncome ? 'INCOME' : 'EXPENSE',
        category,
        description: cleanDesc ? cleanDesc.charAt(0).toUpperCase() + cleanDesc.slice(1) : category,
        amount,
        paymentMethod: isIncome ? 'Bank Mandiri' : 'QRIS',
      },
    });
  }

  return {
    actions,
    executiveReply:
      actions.length > 0
        ? `EXECUTED // Logged ${actions.length} transaction(s) into Firestore Ledger.`
        : 'READY // Specify transaction description and amount (e.g., "Salary came in 18.5 juta, paid kos 2.5 juta").',
  };
}

export function formatIDR(amount: number): string {
  const sign = amount < 0 ? '-' : '';
  return `${sign}Rp ${Math.abs(Math.round(amount)).toLocaleString('id-ID')}`;
}

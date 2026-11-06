import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import * as XLSX from 'xlsx';
import { Language } from '../data/portfolioData';
import {
  LedgerTransaction,
  TransactionType,
  VaultChatMessage,
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  INITIAL_SEED_TRANSACTIONS,
  INITIAL_CHAT_MESSAGE,
  loadLocalTransactions,
  saveLocalTransactions,
  loadLocalChat,
  saveLocalChat,
  subscribeToFirestoreLedger,
  subscribeToFirestoreChat,
  saveChatMessageToFirestore,
  resetChatHistoryInFirestore,
  upsertTransaction,
  removeTransactionFromCloud,
  clearAllTransactionsInFirestore,
  restoreSeedTransactionsInFirestore,
  parseChatToLedgerWithDeepSeek,
  formatIDR,
} from '../services/financeService';

const VAULT_PIN = import.meta.env.VITE_VAULT_PIN || '';
const SESSION_UNLOCK_KEY = 'greyvaldo_vault_unlocked_v1';

const MONOCHROME_SHADES = ['#EDEDED', '#BDBDBD', '#8F8F8F', '#525252', '#262626'];

const VAULT_COPY = {
  en: {
    gateBadge: 'ACCESS CONTROL // PIN REQUIRED',
    gateTitle: 'Financial Ledger & Cashflow Vault',
    gateDesc:
      'Private income, expense, and project allowance ledger for Greyvaldo Christian, S.T. Enter your access PIN to open the workspace.',
    gateLabel: 'ACCESS PIN',
    gatePlaceholder: 'Enter PIN code...',
    gateError: 'INVALID PIN // PLEASE TRY AGAIN',
    gateUnlockBtn: 'Open Financial Vault',
    gateExitBtn: '[BACK TO PORTFOLIO]',
    gateFooterLeft: 'PARSER: DEEPSEEK-CHAT',
    gateFooterRight: 'DATABASE: CLOUD FIRESTORE',
    headerBadge: 'FINANCIAL VAULT // GREYVALDO CHRISTIAN, S.T',
    headerCloudOnline: 'FIRESTORE SYNCED',
    headerCloudOffline: 'LOCAL CACHE',
    headerTitle: 'Personal & Project Financial Ledger',
    btnResetZero: '[RESET TO RP 0]',
    btnConfirmZero: 'CONFIRM ZERO?',
    btnCancel: 'CANCEL',
    btnRestoreDemo: '[RESTORE DEMO]',
    btnConfirmDemo: 'RESTORE 6 ROWS?',
    btnPortfolio: '[PORTFOLIO]',
    btnLock: '[LOCK VAULT]',
    tab1Title: '01 // OVERVIEW & SPREADSHEET LEDGER',
    tab1Desc: 'Summary Metrics, Category Charts & Editable Table',
    tab2Title: '02 // TEXT-TO-LEDGER QUICK INPUT',
    tab2Desc: 'Record or Edit Transactions in Plain English / Indonesian',
    activeBadge: 'ACTIVE',
    openBadge: 'VIEW',
    kpi1Title: '01 // TOTAL INCOME',
    kpi1Sub: 'RECORDED INFLOW',
    kpi2Title: '02 // TOTAL EXPENSE',
    kpi2Sub: 'RECORDED OUTFLOW',
    kpi3Title: '03 // NET BALANCE',
    kpi3Sub: 'SAVINGS RATIO',
    kpi4Title: '04 // LARGEST EXPENSE CATEGORY',
    kpi4TopItem: 'HIGHEST ITEM:',
    entriesLabel: 'ENTRIES',
    categoriesLabel: 'CATEGORIES',
    shareLabel: 'SHARE',
    chart1Title: 'EXPENSE BREAKDOWN BY CATEGORY',
    chart1Action: 'CLICK SLICE TO FILTER',
    chart1Sub: 'Largest or selected expense category is highlighted in blue (#0070F3).',
    chart1Empty: 'NO EXPENSE ENTRIES RECORDED',
    chart1EmptyAction: '+ Add entries via Quick Input or + Add Row below',
    chart2Title: 'INCOME VS. EXPENSE RATIO',
    chart2Action: 'CLICK TO FILTER STREAM',
    chart2Sub: 'Select INCOME or EXPENSE to filter the ledger rows below.',
    chart2Empty: 'CURRENT LEDGER BALANCE IS RP 0',
    inflowLabel: 'TOTAL INCOME',
    outflowLabel: 'TOTAL EXPENSE',
    retentionLabel: 'NET SAVINGS RATE',
    tableTitle: 'Transaction Spreadsheet',
    tableSubtitle: 'CLICK ANY CELL TO EDIT DATE, TYPE, CATEGORY, DESCRIPTION, METHOD, OR AMOUNT',
    btnAddRow: '+ Add Row',
    btnQuickInput: '[TEXT INPUT]',
    btnExportCsv: '[EXPORT CSV]',
    btnExportXlsx: '[EXCEL .XLSX]',
    searchPlaceholder: 'Search description, category, payment method...',
    allCategories: 'ALL CATEGORIES',
    cardsView: 'CARDS',
    sheetView: 'TABLE',
    resetFilter: 'RESET',
    colDate: 'DATE',
    colType: 'TYPE',
    colCategory: 'CATEGORY',
    colDesc: 'DESCRIPTION',
    colMethod: 'METHOD',
    colAmount: 'AMOUNT (IDR)',
    colBalance: 'RUNNING BALANCE',
    colDel: 'DEL',
    emptyTableMsg:
      'LEDGER IS EMPTY (RP 0) // Click "+ Add Row", "[TEXT INPUT]", or "[RESTORE DEMO]" above.',
    summaryLabel: 'SUMMARY TOTALS',
    rowsLabel: 'ROWS',
    chatHeader: '02 // NATURAL LANGUAGE TRANSACTION INPUT',
    btnResetChat: '[CLEAR LOG]',
    confirmChat: 'CLEAR?',
    chatPresetsLabel: 'EXAMPLE INPUTS (CLICK TO RUN):',
    chatInputPlaceholder:
      'Type transactions or edits (e.g. "Salary came in 18.5 juta, paid kos 2.5 juta, bought coffee 55k")...',
    chatSubmitBtn: 'RECORD TO LEDGER',
    chatSubmitting: 'PROCESSING...',
    sideTitle: 'LIVE FIRESTORE SUMMARY',
    sideRecent: 'RECENT TRANSACTIONS',
    sideEmpty: '0 TRANSACTIONS RECORDED',
    sideOpenTableBtn: 'Back to Full Spreadsheet & Charts',
  },
  id: {
    gateBadge: 'KONTROL AKSES // PIN DIPERLUKAN',
    gateTitle: 'Buku Besar & Brankas Keuangan',
    gateDesc:
      'Catatan pemasukan, pengeluaran, dan operasional proyek untuk Greyvaldo Christian, S.T. Masukkan kode PIN untuk membuka brankas.',
    gateLabel: 'KODE PIN AKSES',
    gatePlaceholder: 'Masukkan PIN...',
    gateError: 'PIN TIDAK VALID // SILAKAN COBA LAGI',
    gateUnlockBtn: 'Buka Brankas Keuangan',
    gateExitBtn: '[KEMBALI KE PORTOFOLIO]',
    gateFooterLeft: 'MESIN: DEEPSEEK-CHAT',
    gateFooterRight: 'DATABASE: CLOUD FIRESTORE',
    headerBadge: 'BRANKAS KEUANGAN // GREYVALDO CHRISTIAN, S.T',
    headerCloudOnline: 'FIRESTORE TERSINKRONISASI',
    headerCloudOffline: 'PENYIMPANAN LOKAL',
    headerTitle: 'Buku Besar Keuangan Pribadi & Proyek',
    btnResetZero: '[RESET KE RP 0]',
    btnConfirmZero: 'KOSONGKAN DATA?',
    btnCancel: 'BATAL',
    btnRestoreDemo: '[PULIHKAN CONTOH]',
    btnConfirmDemo: 'PULIHKAN 6 DATA?',
    btnPortfolio: '[PORTOFOLIO]',
    btnLock: '[KUNCI BRANKAS]',
    tab1Title: '01 // RINGKASAN & TABEL TRANSAKSI',
    tab1Desc: ' Kartu Indikator, Grafik Kategori & Tabel Kas Interaktif',
    tab2Title: '02 // INPUT TRANSAKSI CEPAT (TEKS / CHAT)',
    tab2Desc: 'Catat atau Ubah Transaksi dengan Kalimat Bahasa Indonesia / Inggris',
    activeBadge: 'AKTIF',
    openBadge: 'BUKA',
    kpi1Title: '01 // TOTAL PEMASUKAN',
    kpi1Sub: 'ARUS KAS MASUK',
    kpi2Title: '02 // TOTAL PENGELUARAN',
    kpi2Sub: 'ARUS KAS KELUAR',
    kpi3Title: '03 // SALDO BERSIH',
    kpi3Sub: 'RASIO TABUNGAN',
    kpi4Title: '04 // PENGELUARAN TERBESAR',
    kpi4TopItem: 'ITEM TERBESAR:',
    entriesLabel: 'TRANSAKSI',
    categoriesLabel: 'KATEGORI',
    shareLabel: 'PORSI',
    chart1Title: 'RINCIAN PENGELUARAN PER KATEGORI',
    chart1Action: 'KLIK UNTUK FILTER',
    chart1Sub: 'Kategori pengeluaran terbesar atau yang dipilih ditandai warna biru (#0070F3).',
    chart1Empty: 'BELUM ADA DATA PENGELUARAN',
    chart1EmptyAction: '+ Tambah transaksi melalui Input Cepat atau + Tambah Baris di bawah',
    chart2Title: 'RASIO PEMASUKAN VS. PENGELUARAN',
    chart2Action: 'KLIK UNTUK FILTER ARUS KAS',
    chart2Sub: 'Klik potongan grafik untuk memfilter tabel berdasarkan Pemasukan atau Pengeluaran.',
    chart2Empty: 'SALDO BUKU BESAR SAAT INI RP 0',
    inflowLabel: 'TOTAL PEMASUKAN',
    outflowLabel: 'TOTAL PENGELUARAN',
    retentionLabel: 'RASIO SISA SALDO',
    tableTitle: 'Tabel Buku Besar Transaksi',
    tableSubtitle:
      'KLIK SEL MANA SAJA UNTUK MENGUBAH TANGGAL, TIPE, KATEGORI, DESKRIPSI, METODE, ATAU NOMINAL',
    btnAddRow: '+ Tambah Baris',
    btnQuickInput: '[INPUT TEKS]',
    btnExportCsv: '[UNDUH CSV]',
    btnExportXlsx: '[EXCEL .XLSX]',
    searchPlaceholder: 'Cari deskripsi, kategori, metode pembayaran...',
    allCategories: 'SEMUA KATEGORI',
    cardsView: 'KARTU',
    sheetView: 'TABEL',
    resetFilter: 'RESET',
    colDate: 'TANGGAL',
    colType: 'TIPE',
    colCategory: 'KATEGORI',
    colDesc: 'DESKRIPSI',
    colMethod: 'METODE',
    colAmount: 'NOMINAL (IDR)',
    colBalance: 'SALDO BERJALAN',
    colDel: 'HAPUS',
    emptyTableMsg:
      'TABEL KOSONG (RP 0) // Klik "+ Tambah Baris", "[INPUT TEKS]", atau "[PULIHKAN CONTOH]" di atas.',
    summaryLabel: 'TOTAL RINGKASAN',
    rowsLabel: 'BARIS',
    chatHeader: '02 // INPUT TRANSAKSI DENGAN KALIMAT NATURAL',
    btnResetChat: '[BERSIHKAN LOG]',
    confirmChat: 'HAPUS LOG?',
    chatPresetsLabel: 'CONTOH KALIMAT PERINTAH (KLIK UNTUK MENCOBA):',
    chatInputPlaceholder:
      'Ketik transaksi atau perubahan (misal: "Gaji masuk 18.5 juta, bayar kos 2.5 juta, beli kopi 55k")...',
    chatSubmitBtn: 'SIMPAN KE BUKU BESAR',
    chatSubmitting: 'MEMPROSES...',
    sideTitle: 'RINGKASAN FIRESTORE LANGSUNG',
    sideRecent: 'TRANSAKSI TERBARU',
    sideEmpty: '0 TRANSAKSI TERSIMPAN',
    sideOpenTableBtn: 'Lihat Tabel Lengkap & Grafik',
  },
};

interface FinanceVaultProps {
  onBackToPortfolio: () => void;
  lang: Language;
}

export const FinanceVault: React.FC<FinanceVaultProps> = ({ onBackToPortfolio, lang }) => {
  const v = VAULT_COPY[lang];

  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem(SESSION_UNLOCK_KEY) === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'chat'>('dashboard');

  const [transactions, setTransactions] = useState<LedgerTransaction[]>(() =>
    loadLocalTransactions()
  );
  const [cloudSynced, setCloudSynced] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('...');

  const [confirmClearAll, setConfirmClearAll] = useState(false);
  const [confirmRestoreSeed, setConfirmRestoreSeed] = useState(false);
  const [confirmResetChat, setConfirmResetChat] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const [typeFilter, setTypeFilter] = useState<'ALL' | TransactionType>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileLedgerMode, setMobileLedgerMode] = useState<'cards' | 'table'>('cards');

  const [editingCell, setEditingCell] = useState<{
    id: string;
    field: keyof LedgerTransaction;
  } | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');

  const [chatInput, setChatInput] = useState('');
  const [isParsingChat, setIsParsingChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<VaultChatMessage[]>(() => loadLocalChat());

  useEffect(() => {
    if (!isUnlocked) return;

    const unsubLedger = subscribeToFirestoreLedger((txs, connected, syncTime) => {
      setTransactions(txs);
      setCloudSynced(connected);
      setLastSyncTime(syncTime);
    });

    const unsubChat = subscribeToFirestoreChat((msgs) => {
      setChatMessages(msgs);
    });

    return () => {
      unsubLedger();
      unsubChat();
    };
  }, [isUnlocked]);

  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === VAULT_PIN) {
      sessionStorage.setItem(SESSION_UNLOCK_KEY, 'true');
      setIsUnlocked(true);
      setPinError(false);
      setPinInput('');
    } else {
      setPinError(true);
    }
  };

  const handleLockVault = () => {
    sessionStorage.removeItem(SESSION_UNLOCK_KEY);
    setIsUnlocked(false);
    setPinInput('');
  };

  const updateTransactionsState = (next: LedgerTransaction[]) => {
    setTransactions(next);
    saveLocalTransactions(next);
  };

  const handleClearAllLedger = async () => {
    setIsResetting(true);
    setConfirmClearAll(false);
    updateTransactionsState([]);
    await clearAllTransactionsInFirestore();
    setIsResetting(false);
  };

  const handleRestoreDemoSeed = async () => {
    setIsResetting(true);
    setConfirmRestoreSeed(false);
    updateTransactionsState(INITIAL_SEED_TRANSACTIONS);
    await restoreSeedTransactionsInFirestore();
    setIsResetting(false);
  };

  const handleResetChatHistory = async () => {
    setConfirmResetChat(false);
    setChatMessages([INITIAL_CHAT_MESSAGE]);
    saveLocalChat([INITIAL_CHAT_MESSAGE]);
    await resetChatHistoryInFirestore();
  };

  const telemetry = useMemo(() => {
    const incomes = transactions.filter((t) => t.type === 'INCOME');
    const expenses = transactions.filter((t) => t.type === 'EXPENSE');

    const totalIncome = incomes.reduce((acc, t) => acc + Number(t.amount || 0), 0);
    const totalExpense = expenses.reduce((acc, t) => acc + Number(t.amount || 0), 0);
    const netBalance = totalIncome - totalExpense;
    const savingsRatio =
      totalIncome > 0 ? ((netBalance / totalIncome) * 100).toFixed(1) : '0.0';

    const categoryTotals: Record<string, number> = {};
    for (const exp of expenses) {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + Number(exp.amount || 0);
    }

    const sortedCategories = Object.entries(categoryTotals)
      .map(([name, value]) => ({
        name,
        value,
        share: totalExpense > 0 ? (value / totalExpense) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value);

    const peakCategory = sortedCategories[0] || {
      name: lang === 'id' ? 'Belum Ada Data' : 'No Expenses Yet',
      value: 0,
      share: 0,
    };

    const largestSingleExpense = [...expenses].sort((a, b) => b.amount - a.amount)[0] || null;

    const ratioData = [
      { name: 'INCOME', value: totalIncome, type: 'INCOME' as TransactionType },
      { name: 'EXPENSE', value: totalExpense, type: 'EXPENSE' as TransactionType },
    ];

    return {
      totalIncome,
      incomeCount: incomes.length,
      totalExpense,
      expenseCount: expenses.length,
      netBalance,
      savingsRatio,
      sortedCategories,
      peakCategory,
      largestSingleExpense,
      ratioData,
    };
  }, [transactions, lang]);

  const filteredRowsWithBalance = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.createdAt - b.createdAt;
    });

    let running = 0;
    const withBalance = sorted.map((t) => {
      running += t.type === 'INCOME' ? Number(t.amount) : -Number(t.amount);
      return { ...t, runningBalance: running };
    });

    return withBalance.filter((row) => {
      if (typeFilter !== 'ALL' && row.type !== typeFilter) return false;
      if (categoryFilter !== 'ALL' && row.category !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          row.description.toLowerCase().includes(q) ||
          row.category.toLowerCase().includes(q) ||
          row.paymentMethod.toLowerCase().includes(q) ||
          row.date.includes(q)
        );
      }
      return true;
    });
  }, [transactions, typeFilter, categoryFilter, searchQuery]);

  const handleSendChat = async (customPrompt?: string) => {
    const promptText = (customPrompt ?? chatInput).trim();
    if (!promptText || isParsingChat) return;

    const nowTs = Date.now();
    const userMsg: VaultChatMessage = {
      id: `user-${nowTs}`,
      role: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: nowTs,
    };

    const nextMessages = [...chatMessages, userMsg];
    setChatMessages(nextMessages);
    saveLocalChat(nextMessages);
    saveChatMessageToFirestore(userMsg);

    if (!customPrompt) setChatInput('');
    setIsParsingChat(true);

    try {
      const result = await parseChatToLedgerWithDeepSeek(promptText, transactions);
      let updated = [...transactions];
      let appliedCount = 0;

      for (const act of result.actions) {
        if (act.action === 'CLEAR_ALL') {
          updated = [];
          await clearAllTransactionsInFirestore();
          appliedCount++;
        } else if (act.action === 'ADD' && act.transaction && act.transaction.amount) {
          const newTx: LedgerTransaction = {
            id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            date: act.transaction.date || new Date().toISOString().slice(0, 10),
            type: act.transaction.type === 'INCOME' ? 'INCOME' : 'EXPENSE',
            category:
              act.transaction.category ||
              (act.transaction.type === 'INCOME' ? 'Engineering Salary' : 'Other Expense'),
            description: act.transaction.description || 'Ledger Entry',
            amount: Math.abs(Number(act.transaction.amount)),
            paymentMethod: act.transaction.paymentMethod || 'QRIS / Transfer',
            createdAt: Date.now() + appliedCount,
          };
          updated.push(newTx);
          await upsertTransaction(newTx);
          appliedCount++;
        } else if (act.action === 'DELETE') {
          const kw = (act.matchKeyword || '').toLowerCase();
          const target = updated.find(
            (t) =>
              (act.targetId && t.id === act.targetId) ||
              (kw &&
                (t.description.toLowerCase().includes(kw) ||
                  t.category.toLowerCase().includes(kw)))
          );
          if (target) {
            updated = updated.filter((t) => t.id !== target.id);
            await removeTransactionFromCloud(target.id);
            appliedCount++;
          }
        } else if (act.action === 'UPDATE' && act.transaction) {
          const kw = (act.matchKeyword || '').toLowerCase();
          const targetIndex = updated.findIndex(
            (t) =>
              (act.targetId && t.id === act.targetId) ||
              (kw &&
                (t.description.toLowerCase().includes(kw) ||
                  t.category.toLowerCase().includes(kw)))
          );
          if (targetIndex !== -1) {
            const existing = updated[targetIndex];
            const modified: LedgerTransaction = {
              ...existing,
              ...(act.transaction.date ? { date: act.transaction.date } : {}),
              ...(act.transaction.type ? { type: act.transaction.type } : {}),
              ...(act.transaction.category ? { category: act.transaction.category } : {}),
              ...(act.transaction.description ? { description: act.transaction.description } : {}),
              ...(act.transaction.amount !== undefined
                ? { amount: Math.abs(Number(act.transaction.amount)) }
                : {}),
              ...(act.transaction.paymentMethod
                ? { paymentMethod: act.transaction.paymentMethod }
                : {}),
            };
            updated[targetIndex] = modified;
            await upsertTransaction(modified);
            appliedCount++;
          }
        }
      }

      updateTransactionsState(updated);

      const aiTs = Date.now() + 1;
      const aiMsg: VaultChatMessage = {
        id: `ai-${aiTs}`,
        role: 'assistant',
        text: result.executiveReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        badge: `SYNCED // ${appliedCount} ITEM(S)`,
        createdAt: aiTs,
      };
      setChatMessages((prev) => {
        const merged = [...prev, aiMsg];
        saveLocalChat(merged);
        return merged;
      });
      await saveChatMessageToFirestore(aiMsg);
    } catch {
      const errTs = Date.now() + 2;
      const errMsg: VaultChatMessage = {
        id: `err-${errTs}`,
        role: 'assistant',
        text:
          lang === 'id'
            ? 'Gagal memproses kalimat. Pastikan menyertakan nama transaksi dan nominal (contoh: "Bayar kos 2.5 juta").'
            : 'Unable to parse input. Please specify item description and IDR amount.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        badge: 'NOTICE',
        createdAt: errTs,
      };
      setChatMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsParsingChat(false);
    }
  };

  const startEditing = (tx: LedgerTransaction, field: keyof LedgerTransaction) => {
    setEditingCell({ id: tx.id, field });
    setEditingValue(String(tx[field]));
  };

  const commitCellEdit = () => {
    if (!editingCell) return;
    const { id, field } = editingCell;
    const next = transactions.map((tx) => {
      if (tx.id !== id) return tx;
      let val: string | number = editingValue;
      if (field === 'amount') {
        const num = Number(editingValue.replace(/[^0-9.-]/g, ''));
        val = isNaN(num) || num < 0 ? tx.amount : num;
      }
      const updatedTx = { ...tx, [field]: val } as LedgerTransaction;
      upsertTransaction(updatedTx);
      return updatedTx;
    });
    updateTransactionsState(next);
    setEditingCell(null);
  };

  const handleQuickFieldUpdate = (
    id: string,
    field: keyof LedgerTransaction,
    newValue: string | number
  ) => {
    const next = transactions.map((tx) => {
      if (tx.id !== id) return tx;
      const updatedTx = { ...tx, [field]: newValue } as LedgerTransaction;
      upsertTransaction(updatedTx);
      return updatedTx;
    });
    updateTransactionsState(next);
  };

  const handleAddManualRow = () => {
    const newTx: LedgerTransaction = {
      id: `tx-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      type: 'EXPENSE',
      category: 'Field Equipment & PPE',
      description:
        lang === 'id' ? 'Pengeluaran Operasional Baru' : 'New Field / Personal Expense',
      amount: 250000,
      paymentMethod: 'QRIS',
      createdAt: Date.now(),
    };
    const next = [...transactions, newTx];
    updateTransactionsState(next);
    upsertTransaction(newTx);
  };

  const handleDeleteRow = (id: string) => {
    const next = transactions.filter((t) => t.id !== id);
    updateTransactionsState(next);
    removeTransactionFromCloud(id);
  };

  const handleExportCSV = () => {
    const headers = [
      'Date',
      'Type',
      'Category',
      'Description',
      'Payment Method',
      'Amount (IDR)',
      'Running Balance (IDR)',
    ];
    const rows = filteredRowsWithBalance.map((r) => [
      r.date,
      r.type,
      `"${r.category.replace(/"/g, '""')}"`,
      `"${r.description.replace(/"/g, '""')}"`,
      `"${r.paymentMethod.replace(/"/g, '""')}"`,
      r.amount,
      r.runningBalance,
    ]);
    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Greyvaldo_Finance_Ledger_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportExcel = () => {
    const worksheetData = filteredRowsWithBalance.map((r) => ({
      Date: r.date,
      Type: r.type,
      Category: r.category,
      Description: r.description,
      'Payment Method': r.paymentMethod,
      'Amount (IDR)': r.amount,
      'Running Balance (IDR)': r.runningBalance,
    }));
    const ws = XLSX.utils.json_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Finance_Ledger');
    XLSX.writeFile(
      wb,
      `Greyvaldo_Finance_Ledger_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  // LOCKED STATE: PIN Gate
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#000000] text-[#EDEDED] pt-20 pb-20 px-4 flex items-center justify-center relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          className="w-full max-w-md bg-[#0A0A0A] border border-[#1F1F1F] rounded-[12px] p-5 sm:p-8"
        >
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#1F1F1F]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#0070F3]" />
              <span className="ink-label text-[#8F8F8F]">{v.gateBadge}</span>
            </div>
            <span className="ink-label text-[#0070F3]">[LOCKED]</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#EDEDED] mb-2">
            {v.gateTitle}
          </h1>
          <p className="ink-body text-[#8F8F8F] text-sm mb-6">{v.gateDesc}</p>

          <form onSubmit={handleUnlockSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="vault-pin-input"
                className="block ink-label text-[#8F8F8F] mb-2"
              >
                {v.gateLabel}
              </label>
              <input
                id="vault-pin-input"
                type="password"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder={v.gatePlaceholder}
                autoFocus
                className="w-full bg-[#000000] border border-[#1F1F1F] focus:border-[#0070F3] rounded-[8px] px-4 py-3 font-mono text-base sm:text-sm text-[#EDEDED] outline-none transition-colors"
              />
              {pinError && (
                <div className="mt-2 text-xs font-mono text-[#0070F3]">{v.gateError}</div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-2">
              <button type="submit" className="ink-btn-primary flex-1 text-center">
                {v.gateUnlockBtn}
              </button>
              <button
                type="button"
                onClick={onBackToPortfolio}
                className="ink-btn-secondary py-3 px-4 text-center"
              >
                {v.gateExitBtn}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-[#1F1F1F] flex flex-wrap items-center justify-between gap-2">
            <span className="ink-label text-[#8F8F8F]">{v.gateFooterLeft}</span>
            <span className="ink-label text-[#0070F3]">{v.gateFooterRight}</span>
          </div>
        </motion.div>
      </div>
    );
  }

  const filteredIncomeSum = filteredRowsWithBalance
    .filter((r) => r.type === 'INCOME')
    .reduce((a, b) => a + b.amount, 0);
  const filteredExpenseSum = filteredRowsWithBalance
    .filter((r) => r.type === 'EXPENSE')
    .reduce((a, b) => a + b.amount, 0);

  return (
    <div className="min-h-screen bg-[#000000] text-[#EDEDED] pt-20 pb-24 px-3 sm:px-8 relative z-20">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Vault Control Header + Separated Workspace Switcher */}
        <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-[12px] p-4 sm:p-6 space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="w-2 h-2 bg-[#0070F3]" />
                <span className="ink-label text-[#0070F3]">{v.headerBadge}</span>
                <span className="text-[#1F1F1F] hidden sm:inline">|</span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] bg-[#000000] border border-[#1F1F1F] ink-label text-[11px]">
                  <span
                    className={`w-1.5 h-1.5 ${
                      cloudSynced ? 'bg-[#0070F3]' : 'bg-[#8F8F8F]'
                    }`}
                  />
                  <span className={cloudSynced ? 'text-[#0070F3]' : 'text-[#8F8F8F]'}>
                    {cloudSynced
                      ? `${v.headerCloudOnline} (${lastSyncTime})`
                      : v.headerCloudOffline}
                  </span>
                </span>
              </div>
              <h1 className="ink-h1">{v.headerTitle}</h1>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Reset Controls */}
              {!confirmClearAll ? (
                <button
                  type="button"
                  onClick={() => {
                    setConfirmClearAll(true);
                    setConfirmRestoreSeed(false);
                  }}
                  disabled={isResetting}
                  className="ink-btn-secondary text-[#8F8F8F] hover:text-[#EDEDED]"
                >
                  {v.btnResetZero}
                </button>
              ) : (
                <div className="flex items-center gap-1 bg-[#000000] border border-[#0070F3] rounded-[8px] p-1">
                  <button
                    type="button"
                    onClick={handleClearAllLedger}
                    className="px-2.5 py-1 bg-[#0070F3] text-[#FFFFFF] rounded-[6px] font-mono text-[11px] font-medium"
                  >
                    {v.btnConfirmZero}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmClearAll(false)}
                    className="px-2 py-1 text-[#8F8F8F] hover:text-[#EDEDED] font-mono text-[11px]"
                  >
                    {v.btnCancel}
                  </button>
                </div>
              )}

              {!confirmRestoreSeed ? (
                <button
                  type="button"
                  onClick={() => {
                    setConfirmRestoreSeed(true);
                    setConfirmClearAll(false);
                  }}
                  disabled={isResetting}
                  className="ink-btn-secondary text-[#8F8F8F] hover:text-[#EDEDED]"
                >
                  {v.btnRestoreDemo}
                </button>
              ) : (
                <div className="flex items-center gap-1 bg-[#000000] border border-[#0070F3] rounded-[8px] p-1">
                  <button
                    type="button"
                    onClick={handleRestoreDemoSeed}
                    className="px-2.5 py-1 bg-[#0070F3] text-[#FFFFFF] rounded-[6px] font-mono text-[11px] font-medium"
                  >
                    {v.btnConfirmDemo}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmRestoreSeed(false)}
                    className="px-2 py-1 text-[#8F8F8F] hover:text-[#EDEDED] font-mono text-[11px]"
                  >
                    {v.btnCancel}
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={onBackToPortfolio}
                className="ink-btn-secondary"
              >
                {v.btnPortfolio}
              </button>

              <button
                type="button"
                onClick={handleLockVault}
                className="ink-btn-secondary border-[#0070F3] text-[#EDEDED]"
              >
                {v.btnLock}
              </button>
            </div>
          </div>

          {/* Dedicated Two-Tab Workspace Selector */}
          <div className="pt-4 border-t border-[#1F1F1F] grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`p-3.5 rounded-[8px] border text-left transition-all flex items-center justify-between gap-3 ${
                activeTab === 'dashboard'
                  ? 'bg-[#0070F3] border-[#0070F3] text-[#FFFFFF]'
                  : 'bg-[#000000] border-[#1F1F1F] text-[#8F8F8F] hover:border-[#0070F3] hover:text-[#EDEDED]'
              }`}
            >
              <div>
                <div className="font-mono text-xs font-semibold">{v.tab1Title}</div>
                <div
                  className={`font-mono text-[11px] mt-0.5 ${
                    activeTab === 'dashboard' ? 'text-[#FFFFFF]/85' : 'text-[#8F8F8F]'
                  }`}
                >
                  {v.tab1Desc} ({transactions.length})
                </div>
              </div>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded border border-current shrink-0">
                {activeTab === 'dashboard' ? v.activeBadge : v.openBadge}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('chat')}
              className={`p-3.5 rounded-[8px] border text-left transition-all flex items-center justify-between gap-3 ${
                activeTab === 'chat'
                  ? 'bg-[#0070F3] border-[#0070F3] text-[#FFFFFF]'
                  : 'bg-[#000000] border-[#1F1F1F] text-[#8F8F8F] hover:border-[#0070F3] hover:text-[#EDEDED]'
              }`}
            >
              <div>
                <div className="font-mono text-xs font-semibold">{v.tab2Title}</div>
                <div
                  className={`font-mono text-[11px] mt-0.5 ${
                    activeTab === 'chat' ? 'text-[#FFFFFF]/85' : 'text-[#8F8F8F]'
                  }`}
                >
                  {v.tab2Desc}
                </div>
              </div>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded border border-current shrink-0">
                {activeTab === 'chat' ? v.activeBadge : v.openBadge}
              </span>
            </button>
          </div>
        </div>

        {/* =================================================================== */}
        {/* WORKSPACE VIEW 1: OVERVIEW DASHBOARD & SPREADSHEET LEDGER           */}
        {/* =================================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* 4 Highlight Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="ink-card flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <span className="ink-label text-[#8F8F8F]">{v.kpi1Title}</span>
                  <span className="ink-label text-[#0070F3]">
                    {telemetry.incomeCount} {v.entriesLabel}
                  </span>
                </div>
                <div className="font-mono text-xl sm:text-2xl font-semibold text-[#EDEDED] tabular-nums">
                  {formatIDR(telemetry.totalIncome)}
                </div>
                <div className="mt-3 pt-2.5 border-t border-[#1F1F1F] flex items-center justify-between">
                  <span className="ink-label text-[#8F8F8F]">{v.kpi1Sub}</span>
                  <span className="ink-label text-[#EDEDED]">IDR</span>
                </div>
              </div>

              <div className="ink-card flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <span className="ink-label text-[#8F8F8F]">{v.kpi2Title}</span>
                  <span className="ink-label text-[#8F8F8F]">
                    {telemetry.expenseCount} {v.entriesLabel}
                  </span>
                </div>
                <div className="font-mono text-xl sm:text-2xl font-semibold text-[#EDEDED] tabular-nums">
                  {formatIDR(telemetry.totalExpense)}
                </div>
                <div className="mt-3 pt-2.5 border-t border-[#1F1F1F] flex items-center justify-between">
                  <span className="ink-label text-[#8F8F8F]">{v.kpi2Sub}</span>
                  <span className="ink-label text-[#8F8F8F]">
                    {telemetry.sortedCategories.length} {v.categoriesLabel}
                  </span>
                </div>
              </div>

              <div className="ink-card flex flex-col justify-between border-[#0070F3]/60">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <span className="ink-label text-[#0070F3]">{v.kpi3Title}</span>
                  <span className="ink-label text-[#0070F3]">
                    {telemetry.savingsRatio}%
                  </span>
                </div>
                <div className="font-mono text-xl sm:text-2xl font-semibold text-[#FFFFFF] tabular-nums">
                  {formatIDR(telemetry.netBalance)}
                </div>
                <div className="mt-3 pt-2.5 border-t border-[#1F1F1F] flex items-center justify-between">
                  <span className="ink-label text-[#8F8F8F]">{v.kpi3Sub}</span>
                  <span className="ink-label text-[#0070F3]">{telemetry.savingsRatio}% NET</span>
                </div>
              </div>

              <div className="ink-card flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <span className="ink-label text-[#8F8F8F]">{v.kpi4Title}</span>
                  <span className="ink-label text-[#0070F3]">
                    {telemetry.peakCategory.share.toFixed(1)}% {v.shareLabel}
                  </span>
                </div>
                <div className="font-sans text-base sm:text-lg font-semibold text-[#EDEDED] truncate">
                  {telemetry.peakCategory.name}
                </div>
                <div className="font-mono text-sm text-[#0070F3] tabular-nums mt-0.5">
                  {formatIDR(telemetry.peakCategory.value)}
                </div>
                <div className="mt-3 pt-2.5 border-t border-[#1F1F1F] truncate">
                  <span className="ink-label text-[#8F8F8F]">
                    {v.kpi4TopItem}{' '}
                    {telemetry.largestSingleExpense
                      ? `${telemetry.largestSingleExpense.description} (${formatIDR(
                          telemetry.largestSingleExpense.amount
                        )})`
                      : '—'}
                  </span>
                </div>
              </div>
            </div>

            {/* 2-Column Interactive Pie / Donut Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="ink-card flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#1F1F1F] gap-2">
                    <span className="ink-label text-[#EDEDED]">{v.chart1Title}</span>
                    <span className="ink-label text-[#0070F3]">{v.chart1Action}</span>
                  </div>
                  <p className="ink-label text-[11px] text-[#8F8F8F] mb-2">{v.chart1Sub}</p>
                </div>

                {telemetry.sortedCategories.length === 0 ? (
                  <div className="h-60 flex flex-col items-center justify-center border border-[#1F1F1F] rounded-[8px] bg-[#000000]">
                    <span className="ink-label text-[#8F8F8F]">{v.chart1Empty}</span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('chat')}
                      className="mt-2 ink-label text-[#0070F3] hover:underline"
                    >
                      {v.chart1EmptyAction}
                    </button>
                  </div>
                ) : (
                  <div className="h-60 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={telemetry.sortedCategories}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={56}
                          outerRadius={92}
                          paddingAngle={2}
                          onClick={(entry) => {
                            if (entry && entry.name) {
                              setCategoryFilter((prev) =>
                                prev === entry.name ? 'ALL' : entry.name
                              );
                            }
                          }}
                          className="cursor-pointer outline-none"
                        >
                          {telemetry.sortedCategories.map((entry, idx) => {
                            const isHighlighted =
                              categoryFilter === entry.name ||
                              (categoryFilter === 'ALL' && idx === 0);
                            const fill = isHighlighted
                              ? '#0070F3'
                              : MONOCHROME_SHADES[idx % MONOCHROME_SHADES.length];
                            return (
                              <Cell
                                key={entry.name}
                                fill={fill}
                                stroke="#0A0A0A"
                                strokeWidth={2}
                              />
                            );
                          })}
                        </Pie>
                        <Tooltip
                          content={({ active, payload }) => {
                            if (!active || !payload || !payload.length) return null;
                            const data = payload[0].payload;
                            return (
                              <div className="bg-[#000000] border border-[#0070F3] rounded-[6px] p-2.5">
                                <div className="ink-label text-[#EDEDED]">{data.name}</div>
                                <div className="ink-label text-[#0070F3] mt-0.5">
                                  {formatIDR(data.value)} ({data.share.toFixed(1)}%)
                                </div>
                              </div>
                            );
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}

                <div className="space-y-1.5 pt-3 mt-2 border-t border-[#1F1F1F]">
                  {telemetry.sortedCategories.map((cat, idx) => {
                    const isHighlighted =
                      categoryFilter === cat.name || (categoryFilter === 'ALL' && idx === 0);
                    return (
                      <button
                        key={cat.name}
                        type="button"
                        onClick={() =>
                          setCategoryFilter((prev) => (prev === cat.name ? 'ALL' : cat.name))
                        }
                        className="w-full flex items-center justify-between text-left py-1 hover:text-[#FFFFFF]"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span
                            className="w-2.5 h-2.5 shrink-0"
                            style={{
                              backgroundColor: isHighlighted
                                ? '#0070F3'
                                : MONOCHROME_SHADES[idx % MONOCHROME_SHADES.length],
                            }}
                          />
                          <span
                            className={`ink-label truncate ${
                              isHighlighted ? 'text-[#EDEDED]' : 'text-[#8F8F8F]'
                            }`}
                          >
                            {cat.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="ink-label text-[#8F8F8F]">
                            {formatIDR(cat.value)}
                          </span>
                          <span className="ink-label text-[#EDEDED] w-12 text-right">
                            {cat.share.toFixed(1)}%
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="ink-card flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#1F1F1F] gap-2">
                    <span className="ink-label text-[#EDEDED]">{v.chart2Title}</span>
                    <span className="ink-label text-[#0070F3]">{v.chart2Action}</span>
                  </div>
                  <p className="ink-label text-[11px] text-[#8F8F8F] mb-2">{v.chart2Sub}</p>
                </div>

                {telemetry.totalIncome === 0 && telemetry.totalExpense === 0 ? (
                  <div className="h-60 flex flex-col items-center justify-center border border-[#1F1F1F] rounded-[8px] bg-[#000000]">
                    <span className="ink-label text-[#8F8F8F]">{v.chart2Empty}</span>
                  </div>
                ) : (
                  <div className="h-60 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={telemetry.ratioData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={92}
                          paddingAngle={3}
                          onClick={(entry) => {
                            if (entry && entry.type) {
                              setTypeFilter((prev) =>
                                prev === entry.type ? 'ALL' : entry.type
                              );
                            }
                          }}
                          className="cursor-pointer outline-none"
                        >
                          {telemetry.ratioData.map((entry) => {
                            const isIncome = entry.type === 'INCOME';
                            const fill = isIncome ? '#0070F3' : '#8F8F8F';
                            return (
                              <Cell
                                key={entry.name}
                                fill={fill}
                                stroke="#0A0A0A"
                                strokeWidth={2}
                              />
                            );
                          })}
                        </Pie>
                        <Tooltip
                          content={({ active, payload }) => {
                            if (!active || !payload || !payload.length) return null;
                            const data = payload[0].payload;
                            return (
                              <div className="bg-[#000000] border border-[#0070F3] rounded-[6px] p-2.5">
                                <div className="ink-label text-[#EDEDED]">{data.name}</div>
                                <div className="ink-label text-[#0070F3] mt-0.5">
                                  {formatIDR(data.value)}
                                </div>
                              </div>
                            );
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}

                <div className="space-y-2.5 pt-3 mt-2 border-t border-[#1F1F1F]">
                  <button
                    type="button"
                    onClick={() => setTypeFilter((p) => (p === 'INCOME' ? 'ALL' : 'INCOME'))}
                    className="w-full flex items-center justify-between py-1"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-[#0070F3]" />
                      <span className="ink-label text-[#EDEDED]">{v.inflowLabel}</span>
                    </div>
                    <span className="ink-label text-[#0070F3]">
                      {formatIDR(telemetry.totalIncome)}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTypeFilter((p) => (p === 'EXPENSE' ? 'ALL' : 'EXPENSE'))}
                    className="w-full flex items-center justify-between py-1"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 bg-[#8F8F8F]" />
                      <span className="ink-label text-[#8F8F8F]">{v.outflowLabel}</span>
                    </div>
                    <span className="ink-label text-[#EDEDED]">
                      {formatIDR(telemetry.totalExpense)}
                    </span>
                  </button>
                  <div className="pt-2 border-t border-[#1F1F1F] flex items-center justify-between">
                    <span className="ink-label text-[#8F8F8F]">{v.retentionLabel}</span>
                    <span className="ink-label text-[#0070F3]">{telemetry.savingsRatio}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Spreadsheet Ledger */}
            <div className="ink-card">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-[#1F1F1F]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#0070F3] shrink-0" />
                    <h2 className="font-semibold text-base text-[#EDEDED]">{v.tableTitle}</h2>
                  </div>
                  <p className="ink-label text-[#8F8F8F] mt-0.5">{v.tableSubtitle}</p>
                </div>

                <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAddManualRow}
                    className="ink-btn-primary py-2 px-3.5 text-xs font-mono text-center"
                  >
                    {v.btnAddRow}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('chat')}
                    className="ink-btn-secondary border-[#0070F3] text-[#EDEDED] py-2 px-3 text-center"
                  >
                    {v.btnQuickInput}
                  </button>
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="ink-btn-secondary py-2 px-3 text-center"
                  >
                    {v.btnExportCsv}
                  </button>
                  <button
                    type="button"
                    onClick={handleExportExcel}
                    className="ink-btn-secondary py-2 px-3 text-center"
                  >
                    {v.btnExportXlsx}
                  </button>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 sm:gap-3 mb-4">
                <div className="sm:col-span-5">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={v.searchPlaceholder}
                    className="w-full bg-[#000000] border border-[#1F1F1F] focus:border-[#0070F3] rounded-[6px] px-3 py-2 font-mono text-base sm:text-xs text-[#EDEDED] outline-none"
                  />
                </div>

                <div className="sm:col-span-3 flex items-center gap-1.5">
                  {(['ALL', 'INCOME', 'EXPENSE'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTypeFilter(t)}
                      className={`flex-1 py-2 rounded-[6px] border ink-label text-[11px] transition-colors ${
                        typeFilter === t
                          ? 'border-[#0070F3] bg-[#0070F3] text-[#FFFFFF]'
                          : 'border-[#1F1F1F] bg-[#000000] text-[#8F8F8F] hover:text-[#EDEDED]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="sm:col-span-3">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    aria-label="Filter by category"
                    className="w-full bg-[#000000] border border-[#1F1F1F] focus:border-[#0070F3] rounded-[6px] px-3 py-2 font-mono text-base sm:text-xs text-[#EDEDED] outline-none"
                  >
                    <option value="ALL">{v.allCategories}</option>
                    {[...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-1 flex items-center justify-end gap-1.5">
                  <div className="flex md:hidden flex-1 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setMobileLedgerMode('cards')}
                      className={`flex-1 py-2 rounded-[6px] border font-mono text-[11px] ${
                        mobileLedgerMode === 'cards'
                          ? 'border-[#0070F3] text-[#0070F3] bg-[#000000]'
                          : 'border-[#1F1F1F] text-[#8F8F8F]'
                      }`}
                    >
                      {v.cardsView}
                    </button>
                    <button
                      type="button"
                      onClick={() => setMobileLedgerMode('table')}
                      className={`flex-1 py-2 rounded-[6px] border font-mono text-[11px] ${
                        mobileLedgerMode === 'table'
                          ? 'border-[#0070F3] text-[#0070F3] bg-[#000000]'
                          : 'border-[#1F1F1F] text-[#8F8F8F]'
                      }`}
                    >
                      {v.sheetView}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setTypeFilter('ALL');
                      setCategoryFilter('ALL');
                      setSearchQuery('');
                    }}
                    className="px-2.5 sm:w-full h-full py-2 border border-[#1F1F1F] hover:border-[#0070F3] rounded-[6px] font-mono text-[10px] text-[#8F8F8F] hover:text-[#EDEDED]"
                  >
                    {v.resetFilter}
                  </button>
                </div>
              </div>

              {/* Mobile Tactical Ledger Cards */}
              <div
                className={`${
                  mobileLedgerMode === 'cards' ? 'block md:hidden' : 'hidden'
                } space-y-3 mb-4`}
              >
                {filteredRowsWithBalance.map((row) => (
                  <div
                    key={row.id}
                    className="bg-[#000000] border border-[#1F1F1F] rounded-[8px] p-3.5 space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#1F1F1F]">
                      <div className="flex items-center gap-2">
                        <input
                          type="date"
                          value={row.date}
                          onChange={(e) => handleQuickFieldUpdate(row.id, 'date', e.target.value)}
                          className="bg-[#0A0A0A] border border-[#1F1F1F] rounded px-2 py-1 font-mono text-xs text-[#8F8F8F]"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            handleQuickFieldUpdate(
                              row.id,
                              'type',
                              row.type === 'INCOME' ? 'EXPENSE' : 'INCOME'
                            )
                          }
                          className={`px-2 py-1 rounded-[4px] font-mono text-[10px] border ${
                            row.type === 'INCOME'
                              ? 'border-[#0070F3] text-[#0070F3]'
                              : 'border-[#1F1F1F] text-[#8F8F8F]'
                          }`}
                        >
                          {row.type}
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteRow(row.id)}
                        className="font-mono text-[10px] text-[#8F8F8F] hover:text-[#0070F3] px-1.5 py-0.5 border border-[#1F1F1F] rounded"
                      >
                        [{v.colDel}]
                      </button>
                    </div>

                    <div className="space-y-2">
                      <input
                        type="text"
                        value={row.description}
                        onChange={(e) =>
                          handleQuickFieldUpdate(row.id, 'description', e.target.value)
                        }
                        className="w-full bg-[#0A0A0A] border border-[#1F1F1F] focus:border-[#0070F3] rounded px-2.5 py-1.5 font-mono text-xs text-[#EDEDED] outline-none"
                      />

                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={row.category}
                          onChange={(e) =>
                            handleQuickFieldUpdate(row.id, 'category', e.target.value)
                          }
                          className="bg-[#0A0A0A] border border-[#1F1F1F] focus:border-[#0070F3] rounded px-2 py-1 font-mono text-[11px] text-[#8F8F8F] outline-none"
                        />
                        <input
                          type="number"
                          value={row.amount}
                          onChange={(e) =>
                            handleQuickFieldUpdate(
                              row.id,
                              'amount',
                              Math.max(0, Number(e.target.value) || 0)
                            )
                          }
                          className={`bg-[#0A0A0A] border border-[#1F1F1F] focus:border-[#0070F3] rounded px-2 py-1 font-mono text-xs text-right font-semibold outline-none ${
                            row.type === 'INCOME' ? 'text-[#0070F3]' : 'text-[#EDEDED]'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#1F1F1F] flex items-center justify-between font-mono text-[11px]">
                      <span className="text-[#8F8F8F]">{row.paymentMethod}</span>
                      <span className="text-[#8F8F8F]">
                        BAL:{' '}
                        <strong className="text-[#EDEDED]">
                          {formatIDR(row.runningBalance)}
                        </strong>
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* High-Density Spreadsheet Table */}
              <div
                className={`${
                  mobileLedgerMode === 'table' ? 'block' : 'hidden md:block'
                } overflow-x-auto border border-[#1F1F1F] rounded-[8px]`}
              >
                <table className="w-full text-left border-collapse min-w-[720px]">
                  <thead>
                    <tr className="bg-[#000000] border-b border-[#1F1F1F] ink-label text-[#8F8F8F]">
                      <th className="py-3 px-3 border-r border-[#1F1F1F]">{v.colDate}</th>
                      <th className="py-3 px-3 border-r border-[#1F1F1F]">{v.colType}</th>
                      <th className="py-3 px-3 border-r border-[#1F1F1F]">{v.colCategory}</th>
                      <th className="py-3 px-3 border-r border-[#1F1F1F]">{v.colDesc}</th>
                      <th className="py-3 px-3 border-r border-[#1F1F1F]">{v.colMethod}</th>
                      <th className="py-3 px-3 border-r border-[#1F1F1F] text-right">
                        {v.colAmount}
                      </th>
                      <th className="py-3 px-3 border-r border-[#1F1F1F] text-right">
                        {v.colBalance}
                      </th>
                      <th className="py-3 px-2 text-center">{v.colDel}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1F1F1F] font-mono text-xs">
                    {filteredRowsWithBalance.length === 0 ? (
                      <tr>
                        <td
                          colSpan={8}
                          className="py-8 text-center text-[#8F8F8F] bg-[#0A0A0A]"
                        >
                          {v.emptyTableMsg}
                        </td>
                      </tr>
                    ) : (
                      filteredRowsWithBalance.map((row) => (
                        <tr
                          key={row.id}
                          className="bg-[#0A0A0A] hover:bg-[#000000] transition-colors"
                        >
                          <td
                            onClick={() => startEditing(row, 'date')}
                            className="py-2.5 px-3 border-r border-[#1F1F1F] cursor-pointer whitespace-nowrap text-[#8F8F8F] hover:text-[#EDEDED]"
                          >
                            {editingCell?.id === row.id && editingCell.field === 'date' ? (
                              <input
                                type="date"
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                onBlur={commitCellEdit}
                                onKeyDown={(e) => e.key === 'Enter' && commitCellEdit()}
                                autoFocus
                                className="bg-[#000000] border border-[#0070F3] px-1.5 py-0.5 rounded text-xs text-[#EDEDED] outline-none"
                              />
                            ) : (
                              row.date
                            )}
                          </td>

                          <td
                            onClick={() => startEditing(row, 'type')}
                            className="py-2.5 px-3 border-r border-[#1F1F1F] cursor-pointer whitespace-nowrap"
                          >
                            {editingCell?.id === row.id && editingCell.field === 'type' ? (
                              <select
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                onBlur={commitCellEdit}
                                autoFocus
                                className="bg-[#000000] border border-[#0070F3] px-1.5 py-0.5 rounded text-xs text-[#EDEDED] outline-none"
                              >
                                <option value="INCOME">INCOME</option>
                                <option value="EXPENSE">EXPENSE</option>
                              </select>
                            ) : (
                              <span
                                className={`px-2 py-0.5 rounded-[4px] text-[10px] border ${
                                  row.type === 'INCOME'
                                    ? 'border-[#0070F3] text-[#0070F3]'
                                    : 'border-[#1F1F1F] text-[#8F8F8F]'
                                }`}
                              >
                                {row.type}
                              </span>
                            )}
                          </td>

                          <td
                            onClick={() => startEditing(row, 'category')}
                            className="py-2.5 px-3 border-r border-[#1F1F1F] cursor-pointer text-[#EDEDED]"
                          >
                            {editingCell?.id === row.id && editingCell.field === 'category' ? (
                              <input
                                type="text"
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                onBlur={commitCellEdit}
                                onKeyDown={(e) => e.key === 'Enter' && commitCellEdit()}
                                autoFocus
                                className="w-full bg-[#000000] border border-[#0070F3] px-1.5 py-0.5 rounded text-xs text-[#EDEDED] outline-none"
                              />
                            ) : (
                              row.category
                            )}
                          </td>

                          <td
                            onClick={() => startEditing(row, 'description')}
                            className="py-2.5 px-3 border-r border-[#1F1F1F] cursor-pointer text-[#EDEDED]"
                          >
                            {editingCell?.id === row.id && editingCell.field === 'description' ? (
                              <input
                                type="text"
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                onBlur={commitCellEdit}
                                onKeyDown={(e) => e.key === 'Enter' && commitCellEdit()}
                                autoFocus
                                className="w-full bg-[#000000] border border-[#0070F3] px-1.5 py-0.5 rounded text-xs text-[#EDEDED] outline-none"
                              />
                            ) : (
                              row.description
                            )}
                          </td>

                          <td
                            onClick={() => startEditing(row, 'paymentMethod')}
                            className="py-2.5 px-3 border-r border-[#1F1F1F] cursor-pointer text-[#8F8F8F]"
                          >
                            {editingCell?.id === row.id &&
                            editingCell.field === 'paymentMethod' ? (
                              <input
                                type="text"
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                onBlur={commitCellEdit}
                                onKeyDown={(e) => e.key === 'Enter' && commitCellEdit()}
                                autoFocus
                                className="w-full bg-[#000000] border border-[#0070F3] px-1.5 py-0.5 rounded text-xs text-[#EDEDED] outline-none"
                              />
                            ) : (
                              row.paymentMethod
                            )}
                          </td>

                          <td
                            onClick={() => startEditing(row, 'amount')}
                            className={`py-2.5 px-3 border-r border-[#1F1F1F] cursor-pointer text-right tabular-nums font-medium ${
                              row.type === 'INCOME' ? 'text-[#0070F3]' : 'text-[#EDEDED]'
                            }`}
                          >
                            {editingCell?.id === row.id && editingCell.field === 'amount' ? (
                              <input
                                type="number"
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                onBlur={commitCellEdit}
                                onKeyDown={(e) => e.key === 'Enter' && commitCellEdit()}
                                autoFocus
                                className="w-28 bg-[#000000] border border-[#0070F3] px-1.5 py-0.5 rounded text-xs text-right text-[#EDEDED] outline-none"
                              />
                            ) : (
                              <>
                                {row.type === 'INCOME' ? '+' : '-'}
                                {formatIDR(row.amount)}
                              </>
                            )}
                          </td>

                          <td className="py-2.5 px-3 border-r border-[#1F1F1F] text-right tabular-nums text-[#8F8F8F]">
                            {formatIDR(row.runningBalance)}
                          </td>

                          <td className="py-2.5 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleDeleteRow(row.id)}
                              className="font-mono text-[10px] text-[#8F8F8F] hover:text-[#0070F3] px-1.5 py-0.5"
                            >
                              [×]
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>

                  <tfoot>
                    <tr className="bg-[#000000] border-t border-[#1F1F1F] font-mono text-xs">
                      <td colSpan={5} className="py-3 px-3 border-r border-[#1F1F1F] text-[#8F8F8F]">
                        {v.summaryLabel} ({filteredRowsWithBalance.length} {v.rowsLabel}) // IN:{' '}
                        <span className="text-[#0070F3]">{formatIDR(filteredIncomeSum)}</span> |
                        OUT: <span className="text-[#EDEDED]">{formatIDR(filteredExpenseSum)}</span>
                      </td>
                      <td className="py-3 px-3 border-r border-[#1F1F1F] text-right font-semibold text-[#0070F3] tabular-nums">
                        NET: {formatIDR(filteredIncomeSum - filteredExpenseSum)}
                      </td>
                      <td className="py-3 px-3 border-r border-[#1F1F1F] text-right font-semibold text-[#EDEDED] tabular-nums">
                        {formatIDR(telemetry.netBalance)}
                      </td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* WORKSPACE VIEW 2: TEXT-TO-LEDGER QUICK INPUT                        */}
        {/* =================================================================== */}
        {activeTab === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 ink-card flex flex-col justify-between min-h-[540px]">
              <div>
                <div className="flex flex-wrap items-center justify-between pb-4 mb-4 border-b border-[#1F1F1F] gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#0070F3]" />
                    <span className="ink-label text-[#EDEDED]">{v.chatHeader}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="ink-label text-[#8F8F8F] hidden sm:inline">
                      DEEPSEEK-CHAT
                    </span>
                    {!confirmResetChat ? (
                      <button
                        type="button"
                        onClick={() => setConfirmResetChat(true)}
                        className="ink-btn-secondary py-1 px-2.5 text-[11px]"
                      >
                        {v.btnResetChat}
                      </button>
                    ) : (
                      <div className="flex items-center gap-1 bg-[#000000] border border-[#0070F3] rounded px-1.5 py-0.5">
                        <button
                          type="button"
                          onClick={handleResetChatHistory}
                          className="font-mono text-[10px] text-[#0070F3] font-semibold px-1"
                        >
                          {v.confirmChat}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmResetChat(false)}
                          className="font-mono text-[10px] text-[#8F8F8F] px-1"
                        >
                          {v.btnCancel}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Message Log */}
                <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1 mb-6">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-4 rounded-[8px] border ${
                        msg.role === 'user'
                          ? 'bg-[#000000] border-[#0070F3] ml-4 sm:ml-12'
                          : 'bg-[#000000] border-[#1F1F1F] mr-4 sm:mr-12'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5 gap-2">
                        <span className="ink-label text-[10px] text-[#0070F3]">
                          {msg.role === 'user'
                            ? 'GREYVALDO // INPUT'
                            : msg.badge || 'LEDGER PARSER'}
                        </span>
                        <span className="ink-label text-[10px] text-[#8F8F8F]">
                          {msg.timestamp}
                        </span>
                      </div>
                      <p className="font-mono text-xs sm:text-sm text-[#EDEDED] leading-relaxed break-words">
                        {msg.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Presets & Input Bar */}
              <div className="pt-4 border-t border-[#1F1F1F]">
                <div className="mb-3">
                  <div className="ink-label text-[10px] text-[#8F8F8F] mb-2">
                    {v.chatPresetsLabel}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      'Salary came in 18.5 juta, paid kos 2.5 juta, bought coffee 55k and site boots 850k',
                      'Gaji masuk 18.5 juta, bayar kos 2.5 juta, beli kopi 55k',
                      'Change kos to 2.7 juta',
                      'Delete the coffee expense',
                    ].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => handleSendChat(preset)}
                        disabled={isParsingChat}
                        className="text-left bg-[#000000] border border-[#1F1F1F] hover:border-[#0070F3] px-3 py-2 rounded-[6px] font-mono text-[11px] text-[#8F8F8F] hover:text-[#EDEDED] transition-colors whitespace-normal leading-snug"
                      >
                        &gt; {preset}
                      </button>
                    ))}
                  </div>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendChat();
                  }}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    disabled={isParsingChat}
                    placeholder={v.chatInputPlaceholder}
                    className="flex-1 bg-[#000000] border border-[#1F1F1F] focus:border-[#0070F3] rounded-[8px] px-4 py-3 font-mono text-base sm:text-xs text-[#EDEDED] outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isParsingChat || !chatInput.trim()}
                    className="ink-btn-primary py-3 px-6 text-center font-mono text-xs disabled:opacity-50"
                  >
                    {isParsingChat ? v.chatSubmitting : v.chatSubmitBtn}
                  </button>
                </form>
              </div>
            </div>

            {/* Right 4 Cols: Live Firestore Summary */}
            <div className="lg:col-span-4 space-y-4">
              <div className="ink-card space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#1F1F1F]">
                  <span className="ink-label text-[#0070F3]">{v.sideTitle}</span>
                  <span className="w-2 h-2 bg-[#0070F3]" />
                </div>

                <div className="space-y-2.5">
                  <div className="bg-[#000000] border border-[#1F1F1F] rounded-[8px] p-3 flex items-center justify-between">
                    <span className="ink-label text-[#8F8F8F]">{v.kpi3Title}</span>
                    <span className="font-mono text-base font-semibold text-[#0070F3]">
                      {formatIDR(telemetry.netBalance)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="bg-[#000000] border border-[#1F1F1F] rounded-[8px] p-3">
                      <div className="ink-label text-[10px] text-[#8F8F8F]">{v.inflowLabel}</div>
                      <div className="font-mono text-xs font-semibold text-[#EDEDED] mt-1">
                        {formatIDR(telemetry.totalIncome)}
                      </div>
                    </div>
                    <div className="bg-[#000000] border border-[#1F1F1F] rounded-[8px] p-3">
                      <div className="ink-label text-[10px] text-[#8F8F8F]">{v.outflowLabel}</div>
                      <div className="font-mono text-xs font-semibold text-[#EDEDED] mt-1">
                        {formatIDR(telemetry.totalExpense)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#1F1F1F]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="ink-label text-[#8F8F8F]">
                      {v.sideRecent} ({transactions.length})
                    </span>
                  </div>

                  <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
                    {transactions.length === 0 ? (
                      <div className="p-3 bg-[#000000] border border-[#1F1F1F] rounded-[6px] ink-label text-[#8F8F8F] text-center">
                        {v.sideEmpty}
                      </div>
                    ) : (
                      [...transactions]
                        .sort((a, b) => b.createdAt - a.createdAt)
                        .slice(0, 6)
                        .map((tx) => (
                          <div
                            key={tx.id}
                            className="p-2.5 bg-[#000000] border border-[#1F1F1F] rounded-[6px] flex items-center justify-between gap-2"
                          >
                            <div className="min-w-0">
                              <div className="font-mono text-xs text-[#EDEDED] truncate">
                                {tx.description}
                              </div>
                              <div className="ink-label text-[10px] text-[#8F8F8F]">
                                {tx.date} // {tx.category}
                              </div>
                            </div>
                            <span
                              className={`font-mono text-xs font-semibold shrink-0 ${
                                tx.type === 'INCOME' ? 'text-[#0070F3]' : 'text-[#EDEDED]'
                              }`}
                            >
                              {tx.type === 'INCOME' ? '+' : '-'}
                              {formatIDR(tx.amount)}
                            </span>
                          </div>
                        ))
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className="ink-btn-primary w-full text-center"
                >
                  {v.sideOpenTableBtn}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

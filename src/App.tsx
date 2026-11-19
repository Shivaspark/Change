import React, { useState } from 'react';
import { ScreenType, BudgetCategory, Transaction, MindfulNote } from './types.ts';
import {
  INITIAL_CATEGORIES,
  INITIAL_TODAY_EXPENSES,
  CATEGORY_TRANSACTIONS,
  INITIAL_MINDFUL_NOTES,
} from './data/initialData.ts';
import { SvgDefs } from './components/SvgDefs.tsx';
import { IntroOverlay } from './components/IntroOverlay.tsx';
import { HeaderNav } from './components/HeaderNav.tsx';
import { DashboardScreen } from './components/DashboardScreen.tsx';
import { AnalyticsScreen } from './components/AnalyticsScreen.tsx';
import { BudgetScreen } from './components/BudgetScreen.tsx';
import {
  TransactionsModal,
  MonthPickerModal,
} from './components/Modals.tsx';
import { GeminiAssistantModal } from './components/GeminiAssistantModal.tsx';
import { MindfulNotesSheet } from './components/MindfulNotesSheet.tsx';
import { InstallPwaBanner } from './components/InstallPwaBanner.tsx';
import { vibrateTap, vibrateSuccess } from './utils/haptics.ts';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('dashboard');
  const [categories, setCategories] = useState<BudgetCategory[]>(INITIAL_CATEGORIES);
  const [todayExpenses, setTodayExpenses] = useState<Transaction[]>(INITIAL_TODAY_EXPENSES);
  const [notes, setNotes] = useState<MindfulNote[]>(INITIAL_MINDFUL_NOTES);
  const [isIntroOpen, setIsIntroOpen] = useState(true);

  // Modals state
  const [isAssistantModalOpen, setIsAssistantModalOpen] = useState(false);
  const [isNotesSheetOpen, setIsNotesSheetOpen] = useState(false);
  const [selectedCategoryForModal, setSelectedCategoryForModal] = useState<BudgetCategory | null>(null);
  const [isMonthPickerModalOpen, setIsMonthPickerModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Month & balance state
  const [activeMonth, setActiveMonth] = useState('Oct 2024');
  const [dayIndicator, setDayIndicator] = useState('Day 26 of 31 • Oct');
  const [totalBalance, setTotalBalance] = useState(2440.75);

  const totalOutflow = categories.reduce((sum, c) => sum + c.spent, 0);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  const handleUpdateCategory = (catId: string, updates: Partial<BudgetCategory>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === catId ? { ...c, ...updates } : c))
    );
  };

  const handleAddCategory = (newCat: BudgetCategory) => {
    setCategories((prev) => [...prev, newCat]);
  };

  // Add a newly logged expense (from Gemini assistant voice/text or preset)
  const handleAddExpense = (expenseData: {
    merchant: string;
    amount: number;
    category: 'essentials' | 'fun' | 'savings';
    categoryName: string;
    note: string;
  }) => {
    vibrateSuccess();

    const newTx: Transaction = {
      id: 'tx_' + Date.now(),
      name: expenseData.merchant,
      time: `Just now - ${expenseData.note}`,
      amount: expenseData.amount,
      type: expenseData.category === 'savings' ? 'savings' : 'expense',
      categoryKey: expenseData.category,
      categoryName: expenseData.categoryName,
      icon:
        expenseData.category === 'essentials'
          ? 'local_grocery_store'
          : expenseData.category === 'savings'
          ? 'savings'
          : 'local_cafe',
    };

    setTodayExpenses((prev) => [newTx, ...prev]);

    // Update category spent total and burn percentage
    setCategories((prev) =>
      prev.map((cat) => {
        if (
          cat.id.includes(expenseData.category) ||
          cat.name.toLowerCase().includes(expenseData.category)
        ) {
          const newSpent = cat.spent + expenseData.amount;
          const burnPct = ((newSpent / (cat.amount || 1000)) * 100).toFixed(1) + '%';
          return {
            ...cat,
            spent: newSpent,
            burnPct,
          };
        }
        return cat;
      })
    );

    // Update remaining cushion
    setTotalBalance((prev) => Math.max(0, prev - expenseData.amount));
    showToast(`✓ Logged: -$${expenseData.amount.toFixed(2)} for ${expenseData.merchant}`);
  };

  // Add a mindful note / reflection
  const handleAddNote = (newNoteData: Omit<MindfulNote, 'id' | 'timestamp'>) => {
    vibrateSuccess();

    const newNote: MindfulNote = {
      ...newNoteData,
      id: 'note_' + Date.now(),
      timestamp: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setNotes((prev) => [newNote, ...prev]);
    showToast(`✓ Mindful Note saved: "${newNote.title}"`);
  };

  const handleDeleteNote = (id: string) => {
    vibrateTap();
    setNotes((prev) => prev.filter((n) => n.id !== id));
    showToast('Note deleted');
  };

  const handleTogglePinNote = (id: string) => {
    vibrateTap();
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
    );
  };

  const handleOpenTransactions = (categoryKey: string) => {
    vibrateTap();
    if (categoryKey === 'all') {
      setSelectedCategoryForModal({
        id: 'cat_all',
        name: 'All Outflow',
        subtitle: 'All Categories',
        icon: 'receipt_long',
        amount: 4800,
        spent: totalOutflow,
        percentage: '100%',
        burnPct: '43%',
        patternType: 'hatch',
      });
    } else {
      const match =
        categories.find((c) => c.id.includes(categoryKey) || c.name.toLowerCase().includes(categoryKey)) ||
        categories[0];
      setSelectedCategoryForModal(match);
    }
  };

  const modalTransactions = selectedCategoryForModal
    ? selectedCategoryForModal.id === 'cat_all'
      ? [
          ...(CATEGORY_TRANSACTIONS.essentials || []),
          ...(CATEGORY_TRANSACTIONS.fun || []),
          ...(CATEGORY_TRANSACTIONS.savings || []),
        ]
      : CATEGORY_TRANSACTIONS[
          selectedCategoryForModal.id.replace('cat_', '') as 'essentials' | 'fun' | 'savings'
        ] || []
    : [];

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-0 sm:p-4 bg-[#f0eee9]">
      {/* SVG Pattern Definitions */}
      <SvgDefs />

      {/* Intro Overlay Animation */}
      <IntroOverlay isOpen={isIntroOpen} onClose={() => setIsIntroOpen(false)} />

      {/* Mobile Device Frame Container (Full Android PWA Presentation) */}
      <main className="w-full max-w-[420px] bg-[#f9f9f9] sm:rounded-[44px] shadow-2xl relative flex flex-col justify-between border-0 sm:border-[6px] border-[#141414] min-h-screen overflow-x-hidden selection:bg-black selection:text-white">
        {/* Ambient Sketch Paper Texture Background Layer */}
        <div aria-hidden="true" className="fixed inset-0 pointer-events-none opacity-[0.10] z-0 overflow-hidden">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <rect fill="url(#grid-doodle)" height="100%" width="100%" />
          </svg>
        </div>

        {/* 1. Header Navigation & Status Bar */}
        <HeaderNav
          currentScreen={currentScreen}
          onNavigate={(screen) => {
            vibrateTap();
            setCurrentScreen(screen);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onReplayIntro={() => {
            vibrateTap();
            setIsIntroOpen(true);
          }}
          onOpenNotifications={() => {
            vibrateTap();
            showToast('No unread notifications');
          }}
          onOpenNotesSheet={() => {
            vibrateTap();
            setIsNotesSheetOpen(true);
          }}
        />

        {/* 2. Android PWA Install Banner */}
        <InstallPwaBanner />

        {/* 3. Main Active Screen */}
        <div className="flex-1 flex flex-col w-full relative z-10">
          {currentScreen === 'dashboard' && (
            <DashboardScreen
              categories={categories}
              todayExpenses={todayExpenses}
              totalBalance={totalBalance}
              totalOutflow={totalOutflow}
              onNavigate={(s) => {
                vibrateTap();
                setCurrentScreen(s);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenVoiceCapture={() => {
                vibrateTap();
                setIsAssistantModalOpen(true);
              }}
              onInspectTransaction={(tx) => {
                vibrateTap();
                showToast(`${tx.name}: -$${tx.amount.toFixed(2)} (${tx.time})`);
              }}
            />
          )}

          {currentScreen === 'analytics' && (
            <AnalyticsScreen
              categories={categories}
              totalBalance={totalBalance}
              totalOutflow={totalOutflow}
              activeMonth={activeMonth}
              dayIndicator={dayIndicator}
              onNavigate={(s) => {
                vibrateTap();
                setCurrentScreen(s);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenMonthPicker={() => {
                vibrateTap();
                setIsMonthPickerModalOpen(true);
              }}
              onOpenTransactions={handleOpenTransactions}
              onExportReport={() => {
                vibrateSuccess();
                showToast('Exporting Oct 2024 CSV statement...');
              }}
            />
          )}

          {currentScreen === 'budget' && (
            <BudgetScreen
              categories={categories}
              onUpdateCategory={handleUpdateCategory}
              onAddCategory={handleAddCategory}
              onNavigate={(s) => {
                vibrateTap();
                setCurrentScreen(s);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onShowToast={showToast}
            />
          )}
        </div>

        {/* 4. Native Android / iOS Bottom Indicator Bar */}
        <footer className="w-full pb-2 pt-1 flex justify-center z-20 bg-transparent pointer-events-none">
          <div className="w-32 h-1 bg-black/40 rounded-full" />
        </footer>
      </main>

      {/* Shared Modals */}
      <TransactionsModal
        isOpen={Boolean(selectedCategoryForModal)}
        onClose={() => setSelectedCategoryForModal(null)}
        category={selectedCategoryForModal}
        transactions={modalTransactions}
      />

      <MonthPickerModal
        isOpen={isMonthPickerModalOpen}
        onClose={() => setIsMonthPickerModalOpen(false)}
        selectedMonth={activeMonth}
        onSelect={(m, rem, _spent, _cap, dayInd) => {
          vibrateTap();
          setActiveMonth(m);
          setDayIndicator(dayInd);
          const num = parseFloat(rem.replace(/[^0-9.]/g, '')) || 2450;
          setTotalBalance(num);
          showToast(`Switched view to ${m}`);
        }}
      />

      {/* Upgraded Conversational Gemini Live Assistant Modal */}
      <GeminiAssistantModal
        isOpen={isAssistantModalOpen}
        onClose={() => setIsAssistantModalOpen(false)}
        todayExpenses={todayExpenses}
        categories={categories}
        totalBalance={totalBalance}
        totalOutflow={totalOutflow}
        notes={notes}
        onAddExpense={handleAddExpense}
        onAddNote={handleAddNote}
        onOpenNotesSheet={() => {
          setIsAssistantModalOpen(false);
          setIsNotesSheetOpen(true);
        }}
      />

      {/* Dedicated Mindful Notes Sheet */}
      <MindfulNotesSheet
        isOpen={isNotesSheetOpen}
        onClose={() => setIsNotesSheetOpen(false)}
        notes={notes}
        categories={categories}
        onAddNote={handleAddNote}
        onDeleteNote={handleDeleteNote}
        onTogglePin={handleTogglePinNote}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 bg-[#141414] text-white px-5 py-2.5 rounded-full font-montez text-2xl shadow-xl transition-all duration-300 pointer-events-none flex items-center gap-2 border border-white/20">
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

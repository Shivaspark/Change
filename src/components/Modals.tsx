import React, { useState } from 'react';
import { Transaction, BudgetCategory } from '../types.ts';

// 1. Category Transactions Modal
interface TransactionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: BudgetCategory | null;
  transactions: Transaction[];
}

export const TransactionsModal: React.FC<TransactionsModalProps> = ({
  isOpen,
  onClose,
  category,
  transactions,
}) => {
  if (!isOpen || !category) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end justify-center transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-t-3xl p-5 shadow-2xl border-t-2 border-black flex flex-col max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1 bg-black/20 rounded-full mx-auto mb-3" />
        <div className="flex items-center justify-between pb-3 border-b border-black/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full border border-black flex items-center justify-center text-lg">
              <span className="material-symbols-outlined text-[20px]">{category.icon}</span>
            </div>
            <div className="flex flex-col">
              <h3 className="font-montez text-2xl text-black leading-tight">
                {category.name} Breakdown
              </h3>
              <span className="font-mono text-[10px] text-zinc-500">
                ${category.spent.toFixed(2)} used of ${category.amount.toFixed(2)} ($
                {Math.max(0, category.amount - category.spent).toFixed(2)} left)
              </span>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-black text-sm hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-2.5 py-4">
          {transactions.length === 0 ? (
            <div className="text-center py-6 text-zinc-400 font-montez text-xl">
              No transactions recorded in this bucket yet.
            </div>
          ) : (
            transactions.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#f3f3f4] border border-black/10 hover:border-black/30 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black border border-black/10">
                    <span className="material-symbols-outlined text-[17px]">{item.icon}</span>
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-space text-xs font-semibold text-black">{item.name}</span>
                    <span className="font-mono text-[10px] text-zinc-500">{item.time}</span>
                  </div>
                </div>
                <span className="font-montez text-xl text-black font-normal">
                  {item.type === 'savings' ? `+$${item.amount.toFixed(2)}` : `-$${item.amount.toFixed(2)}`}
                </span>
              </div>
            ))
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-full bg-black text-white font-space text-xs font-semibold cursor-pointer active:scale-95 transition-all mt-1 shadow-sm"
        >
          Done
        </button>
      </div>
    </div>
  );
};

// 2. Month Picker Modal
interface MonthPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMonth: string;
  onSelect: (month: string, rem: string, spent: string, cap: string, dayIndicator: string) => void;
}

export const MonthPickerModal: React.FC<MonthPickerModalProps> = ({
  isOpen,
  onClose,
  selectedMonth,
  onSelect,
}) => {
  if (!isOpen) return null;

  const months = [
    {
      label: 'Oct 2024',
      name: 'October 2024',
      status: 'Active • 26 days spent',
      rem: '$2,450.00',
      spent: '$1,850.00',
      cap: '$4,800.00',
      dayIndicator: 'Day 26 of 31 • Oct',
    },
    {
      label: 'Sep 2024',
      name: 'September 2024',
      status: 'Completed • $3,120 left',
      rem: '$3,120.00',
      spent: '$1,680.00',
      cap: '$4,800.00',
      dayIndicator: 'Closed • 30 days',
    },
    {
      label: 'Aug 2024',
      name: 'August 2024',
      status: 'Completed • $2,890 left',
      rem: '$2,890.00',
      spent: '$1,910.00',
      cap: '$4,800.00',
      dayIndicator: 'Closed • 31 days',
    },
    {
      label: 'Nov 2024',
      name: 'November 2024',
      status: 'Planned Target Month',
      rem: '$4,800.00',
      spent: '$0.00',
      cap: '$4,800.00',
      dayIndicator: 'Upcoming • 30 days',
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border-2 border-black flex flex-col gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-2 border-b border-black/10">
          <span className="font-montez text-2xl text-black">Select Period</span>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center text-black cursor-pointer hover:bg-zinc-200"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-2 py-1">
          {months.map((m) => {
            const isCurrent = selectedMonth.includes(m.label.slice(0, 3));
            return (
              <button
                key={m.label}
                type="button"
                onClick={() => {
                  onSelect(m.label, m.rem, m.spent, m.cap, m.dayIndicator);
                  onClose();
                }}
                className={`p-3 rounded-xl border text-left flex items-center justify-between cursor-pointer transition-all active:scale-98 ${
                  isCurrent
                    ? 'border-2 border-black bg-stone-50 shadow-xs'
                    : 'border-black/10 hover:bg-stone-50'
                }`}
              >
                <div className="flex flex-col text-left">
                  <span className="font-montez text-2xl text-black">{m.name}</span>
                  <span className="font-mono text-xs text-zinc-500">{m.status}</span>
                </div>
                <span className="font-montez text-2xl text-black font-bold">{m.rem} rem</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// 3. Rename Category Modal
interface RenameModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  onConfirm: (newName: string) => void;
}

export const RenameCategoryModal: React.FC<RenameModalProps> = ({
  isOpen,
  onClose,
  currentName,
  onConfirm,
}) => {
  const [val, setVal] = useState(currentName);

  React.useEffect(() => {
    setVal(currentName);
  }, [currentName, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white rounded-2xl p-4 border-2 border-black shadow-xl relative max-h-[85vh] flex flex-col gap-3.5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-2 border-b border-black/15">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-black text-base border border-black/20">
              <span className="material-symbols-outlined text-[18px]">edit_note</span>
            </div>
            <div>
              <h3 className="font-montez text-2xl text-black leading-none">Edit Category</h3>
              <span className="text-[10px] font-sans text-neutral-500">Customize portion title</span>
            </div>
          </div>
          <button
            type="button"
            aria-label="Close modal"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center border border-black/20 text-xs text-black active:scale-95 transition-transform cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-montez text-lg text-black">Category Title</label>
          <input
            type="text"
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (val.trim()) onConfirm(val.trim());
              }
            }}
            placeholder="e.g. Health & Wellness, Travel, Hobbies"
            className="w-full px-3 py-2 border-2 border-black rounded-xl font-sans text-sm text-black focus:outline-none focus:ring-1 focus:ring-black placeholder-neutral-400"
            autoFocus
          />
          <div className="flex flex-wrap gap-1.5 pt-1">
            {['Travel & Getaway', 'Health & Care', 'Entertainment', 'Pet Supplies'].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setVal(preset)}
                className="px-2 py-0.5 rounded-full bg-stone-100 hover:bg-stone-200 text-[11px] font-sans text-black border border-black/10 cursor-pointer"
              >
                + {preset.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-black/15 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-100 text-black text-xs font-sans font-medium hover:bg-stone-200 active:scale-95 transition-transform cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (val.trim()) onConfirm(val.trim());
            }}
            className="flex-1 py-2 rounded-xl bg-black text-white font-montez text-xl hover:bg-neutral-800 active:scale-95 transition-transform cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">check</span>
            <span>Update Name</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// 4. Gemini Voice / Instant Expense Capture Modal
interface GeminiExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExpense: (expense: {
    merchant: string;
    amount: number;
    category: 'essentials' | 'fun' | 'savings';
    categoryName: string;
    note: string;
  }) => void;
}

export const GeminiExpenseModal: React.FC<GeminiExpenseModalProps> = ({
  isOpen,
  onClose,
  onAddExpense,
}) => {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const presets = [
    { label: '☕ Artisan Roast $6.50', text: 'Spent 6.50 on Artisan coffee and bun' },
    { label: '🚇 Metro transit $2.75', text: 'Paid 2.75 for Metro commute pass' },
    { label: '🥑 Co-op Groceries $48.80', text: 'Spent 48.80 at Organic grocery market' },
    { label: '🎬 Movie tickets $32.00', text: 'Spent 32 on weekend movie cinema tickets' },
    { label: '⚡ Electric bill $110.00', text: 'Paid 110 for monthly electric utility' },
    { label: '💰 Rainy Day SIP $150.00', text: 'Saved 150 into rainy day growth fund' },
  ];

  const handleCapture = async (promptToUse?: string) => {
    const textToParse = (promptToUse || inputText).trim();
    if (!textToParse) return;

    setIsProcessing(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/parse-expense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToParse }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        onAddExpense(json.data);
        setInputText('');
        onClose();
      } else {
        setErrorMsg('Could not extract expense. Try: "Spent 20 on coffee"');
      }
    } catch (err: any) {
      console.error('Failed to parse expense:', err);
      // Fallback local parser
      const amtMatch = textToParse.match(/\$?(\d+(?:\.\d+)?)/);
      const amt = amtMatch ? parseFloat(amtMatch[1]) : 15.0;
      onAddExpense({
        merchant: textToParse.split(' ')[0] || 'Quick Expense',
        amount: amt,
        category: 'fun',
        categoryName: 'Fun & Life',
        note: textToParse,
      });
      setInputText('');
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSpeechToggle = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMsg('Speech recognition not supported in this browser. You can type or tap a preset below.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsRecording(true);
        setErrorMsg('');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsRecording(false);
        handleCapture(transcript);
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech error:', e);
        setIsRecording(false);
        setErrorMsg('Microphone input ended. You can type your expense above.');
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch (e: any) {
      setIsRecording(false);
      setErrorMsg('Could not access microphone.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-3xl p-5 border-2 border-black shadow-2xl flex flex-col gap-3 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-2 border-b border-black/10">
          <div className="flex items-center gap-2">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-white transition-all ${
                isRecording ? 'bg-red-500 animate-pulse' : 'bg-black'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isRecording ? 'graphic_eq' : 'mic'}
              </span>
            </div>
            <div>
              <h3 className="font-montez text-2xl text-black leading-tight">Gemini Instant Expense</h3>
              <p className="font-mono text-[10px] text-zinc-500">
                AI parses amount, category, & merchant automatically
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center text-black hover:bg-zinc-200 cursor-pointer text-xs"
          >
            ✕
          </button>
        </div>

        {/* Voice Trigger Bar */}
        <div className="flex items-center gap-2 pt-1">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCapture();
              }}
              placeholder='e.g. "Spent 18 on ramen", "Electric bill 95"'
              className="w-full pl-3 pr-10 py-2.5 rounded-xl border-2 border-black text-sm font-space focus:outline-none focus:ring-1 focus:ring-black"
              autoFocus
            />
            {inputText && (
              <button
                type="button"
                onClick={() => setInputText('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleSpeechToggle}
            className={`w-11 h-11 rounded-xl border-2 border-black flex items-center justify-center active:scale-95 transition-all cursor-pointer ${
              isRecording ? 'bg-red-500 text-white animate-bounce' : 'bg-zinc-100 text-black hover:bg-zinc-200'
            }`}
            title="Tap to speak"
          >
            <span className="material-symbols-outlined text-[22px]">
              {isRecording ? 'mic' : 'mic_none'}
            </span>
          </button>
        </div>

        {errorMsg && (
          <p className="text-xs text-red-600 font-space bg-red-50 px-2.5 py-1.5 rounded-lg border border-red-200">
            {errorMsg}
          </p>
        )}

        {/* Action Button */}
        <button
          type="button"
          disabled={isProcessing || !inputText.trim()}
          onClick={() => handleCapture()}
          className={`w-full py-2.5 rounded-xl font-montez text-2xl flex items-center justify-center gap-2 border-2 border-black transition-all cursor-pointer ${
            isProcessing || !inputText.trim()
              ? 'bg-zinc-200 text-zinc-400 border-zinc-300 cursor-not-allowed'
              : 'bg-black text-white hover:bg-zinc-800 active:scale-98 shadow-sm'
          }`}
        >
          {isProcessing ? (
            <>
              <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
              <span>Gemini Parsing...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]">magic_button</span>
              <span>Log Expense</span>
            </>
          )}
        </button>

        {/* Quick Suggestion Chips */}
        <div className="pt-2 border-t border-black/10">
          <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider block mb-1.5">
            Quick One-Tap Presets
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {presets.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setInputText(p.text);
                  handleCapture(p.text);
                }}
                className="text-left px-2.5 py-2 rounded-xl bg-stone-50 hover:bg-stone-100 border border-black/10 text-xs font-space text-black active:scale-98 transition-all flex items-center justify-between group cursor-pointer"
              >
                <span className="truncate">{p.label}</span>
                <span className="material-symbols-outlined text-[14px] text-zinc-400 group-hover:text-black">
                  arrow_forward
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

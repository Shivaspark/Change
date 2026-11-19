import React, { useState } from 'react';
import { Transaction, BudgetCategory, MindfulNote, GeminiAssistantResponse } from '../types.ts';
import { vibrateTap, vibrateSuccess, vibrateWarning } from '../utils/haptics.ts';

interface GeminiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  todayExpenses: Transaction[];
  categories: BudgetCategory[];
  totalBalance: number;
  totalOutflow: number;
  notes: MindfulNote[];
  onAddExpense: (expense: {
    merchant: string;
    amount: number;
    category: 'essentials' | 'fun' | 'savings';
    categoryName: string;
    note: string;
  }) => void;
  onAddNote: (note: Omit<MindfulNote, 'id' | 'timestamp'>) => void;
  onOpenNotesSheet: () => void;
}

export const GeminiAssistantModal: React.FC<GeminiAssistantModalProps> = ({
  isOpen,
  onClose,
  todayExpenses,
  categories,
  totalBalance,
  totalOutflow,
  onAddExpense,
  onAddNote,
  onOpenNotesSheet,
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [lastResponse, setLastResponse] = useState<GeminiAssistantResponse | null>(null);

  if (!isOpen) return null;

  const quickPrompts = [
    { label: '📊 How much did I spend today?', query: 'How much did I spend today?' },
    { label: '💰 What is my remaining balance?', query: 'What is my remaining month balance?' },
    { label: '☕ Spent 18 on coffee', query: 'Spent 18 on coffee' },
    { label: '📝 Note: Lunch meeting with client $24', query: 'Note: Lunch meeting with client $24' },
    { label: '🔥 How is my burn rate tracking?', query: 'How is my burn rate tracking?' },
  ];

  const handleAskGemini = async (queryToUse?: string) => {
    const prompt = (queryToUse || inputText).trim();
    if (!prompt) return;

    setIsProcessing(true);
    setErrorMsg('');
    vibrateTap();

    try {
      const payload = {
        prompt,
        ledgerContext: {
          todayExpenses,
          categories,
          totalBalance,
          totalOutflow,
        },
      };

      const res = await fetch('/api/gemini-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setLastResponse(json.data);
        vibrateSuccess();

        // Perform any action requested by the assistant
        const action = json.data.actionTaken;
        if (action?.type === 'logged_expense' && action.details) {
          onAddExpense(action.details);
        } else if (action?.type === 'created_note' && action.details) {
          onAddNote({
            title: action.details.title || 'Mindful Voice Note',
            content: action.details.content || prompt,
            categoryKey: action.details.categoryKey || 'fun',
            categoryName: action.details.categoryName || 'Fun & Life',
            associatedAmount: action.details.associatedAmount,
            tags: action.details.tags || ['Mindful Note'],
            pinned: false,
          });
        }
      } else {
        setErrorMsg('Gemini could not process query. Try asking: "How much did I spend today?"');
        vibrateWarning();
      }
    } catch (err: any) {
      console.warn('Network call failed, computing local financial answer:', err);
      // Local fallback calculation
      const todayTotal = todayExpenses.reduce((sum, t) => sum + t.amount, 0);
      setLastResponse({
        answer: `Today you have spent $${todayTotal.toFixed(2)} across ${todayExpenses.length} transactions. You have $${totalBalance.toFixed(2)} left to spend this month with a safe cushion!`,
        quickMetrics: {
          todaySpent: todayTotal,
          todayCount: todayExpenses.length,
          remainingMonthBalance: totalBalance,
          topCategoryToday: 'Fun & Life',
        },
        suggestedFollowUps: ['How is my burn rate?', 'View today\'s expenses'],
        actionTaken: { type: 'none' },
      });
      vibrateSuccess();
    } finally {
      setIsProcessing(false);
      setInputText('');
    }
  };

  const handleToggleVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMsg('Microphone recognition not supported in this browser. You can type or tap a question below.');
      return;
    }

    vibrateTap();

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMsg('');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
        handleAskGemini(transcript);
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition error:', e);
        setIsListening(false);
        setErrorMsg('Microphone input completed. You can type your question above.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
      setErrorMsg('Unable to access device microphone.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-3xl p-5 border-2 border-black shadow-2xl flex flex-col gap-3 relative max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-black/10">
          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center">
              <div
                className={`absolute -inset-1 rounded-full blur-xs transition-opacity duration-300 ${
                  isListening ? 'opacity-100 gemini-aura-active' : 'opacity-40'
                }`}
                style={{
                  background: 'conic-gradient(from 0deg, #4285F4, #9B72CB, #EA4335, #FBBC05, #4285F4)',
                }}
              />
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-white relative z-10 ${
                  isListening ? 'bg-red-500 animate-pulse' : 'bg-black'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {isListening ? 'graphic_eq' : 'auto_awesome'}
                </span>
              </div>
            </div>
            <div className="text-left">
              <h3 className="font-montez text-2xl text-black leading-tight">Gemini Live Assistant</h3>
              <p className="font-mono text-[10px] text-zinc-500">
                Ask "How much did I spend today?" or log voice notes
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              vibrateTap();
              onClose();
            }}
            className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center text-black hover:bg-zinc-200 cursor-pointer text-xs"
          >
            ✕
          </button>
        </div>

        {/* Input Bar with Voice Mic */}
        <div className="flex items-center gap-2 pt-1">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAskGemini();
              }}
              placeholder='Ask: "How much did I spend today?" or "Spent 20 on lunch"'
              className="w-full pl-3 pr-10 py-2.5 rounded-xl border-2 border-black text-xs font-space focus:outline-none focus:ring-1 focus:ring-black bg-stone-50"
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
            onClick={handleToggleVoice}
            className={`w-11 h-11 rounded-xl border-2 border-black flex items-center justify-center active:scale-95 transition-all cursor-pointer relative shrink-0 ${
              isListening ? 'bg-red-500 text-white animate-bounce' : 'bg-zinc-100 text-black hover:bg-zinc-200'
            }`}
            title="Tap to speak"
          >
            <span className="material-symbols-outlined text-[22px]">
              {isListening ? 'graphic_eq' : 'mic'}
            </span>
          </button>
        </div>

        {errorMsg && (
          <p className="text-xs text-red-600 font-space bg-red-50 px-2.5 py-1.5 rounded-lg border border-red-200">
            {errorMsg}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="button"
          disabled={isProcessing || !inputText.trim()}
          onClick={() => handleAskGemini()}
          className={`w-full py-2 rounded-xl font-montez text-2xl flex items-center justify-center gap-2 border-2 border-black transition-all cursor-pointer ${
            isProcessing || !inputText.trim()
              ? 'bg-zinc-200 text-zinc-400 border-zinc-300 cursor-not-allowed'
              : 'bg-black text-white hover:bg-zinc-800 active:scale-98 shadow-sm'
          }`}
        >
          {isProcessing ? (
            <>
              <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
              <span>Thinking with Gemini...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]">send</span>
              <span>Ask or Log</span>
            </>
          )}
        </button>

        {/* Text Answer Card (Shown when an answer is received) */}
        {lastResponse && (
          <div className="p-3.5 rounded-2xl bg-stone-50 border-2 border-black shadow-xs flex flex-col gap-2.5 animate-in fade-in duration-300 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[17px] text-black">insights</span>
                <span className="font-montez text-lg text-black font-bold">Gemini Financial Insight</span>
              </div>
              {lastResponse.actionTaken?.type !== 'none' && (
                <span className="text-[10px] font-mono bg-black text-white px-2 py-0.5 rounded-full font-semibold">
                  {lastResponse.actionTaken?.type === 'logged_expense' ? '✓ Expense Logged' : '✓ Note Saved'}
                </span>
              )}
            </div>

            {/* Answer Text */}
            <p className="text-xs font-space text-zinc-800 leading-relaxed font-medium">
              {lastResponse.answer}
            </p>

            {/* Quick Metrics Breakdown Strip */}
            {lastResponse.quickMetrics && (
              <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-black/10 text-center">
                <div className="bg-white p-1.5 rounded-lg border border-black/10">
                  <span className="text-[9px] font-mono text-zinc-500 block uppercase">Spent Today</span>
                  <span className="font-montez text-xl text-black font-bold">
                    ${lastResponse.quickMetrics.todaySpent.toFixed(2)}
                  </span>
                </div>
                <div className="bg-white p-1.5 rounded-lg border border-black/10">
                  <span className="text-[9px] font-mono text-zinc-500 block uppercase">Today's Logs</span>
                  <span className="font-montez text-xl text-black font-bold">
                    {lastResponse.quickMetrics.todayCount} items
                  </span>
                </div>
                <div className="bg-white p-1.5 rounded-lg border border-black/10">
                  <span className="text-[9px] font-mono text-zinc-500 block uppercase">Safe Cushion</span>
                  <span className="font-montez text-xl text-black font-bold">
                    ${lastResponse.quickMetrics.remainingMonthBalance.toFixed(0)}
                  </span>
                </div>
              </div>
            )}

            {/* Suggested Follow-ups */}
            {lastResponse.suggestedFollowUps && lastResponse.suggestedFollowUps.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[10px] font-mono text-zinc-500">Ask:</span>
                {lastResponse.suggestedFollowUps.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => handleAskGemini(q)}
                    className="text-[10px] font-space px-2 py-0.5 rounded-full bg-white border border-black/15 hover:border-black active:scale-95 transition-all text-black cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quick One-Tap Prompts */}
        <div className="pt-2 border-t border-black/10 text-left">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
              Quick Suggestions
            </span>
            <button
              type="button"
              onClick={() => {
                vibrateTap();
                onOpenNotesSheet();
              }}
              className="text-[10px] font-mono text-black font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[13px]">sticky_note_2</span>
              <span>Open Notes Sheet</span>
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            {quickPrompts.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => handleAskGemini(p.query)}
                className="w-full text-left px-2.5 py-1.5 rounded-xl bg-stone-50 hover:bg-stone-100 border border-black/10 text-xs font-space text-black active:scale-98 transition-all flex items-center justify-between group cursor-pointer"
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

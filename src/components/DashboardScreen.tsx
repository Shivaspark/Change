import React, { useState } from 'react';
import { Transaction, BudgetCategory, ScreenType } from '../types.ts';
import { vibrateTap } from '../utils/haptics.ts';

interface DashboardScreenProps {
  categories: BudgetCategory[];
  todayExpenses: Transaction[];
  totalBalance: number;
  totalOutflow: number;
  onNavigate: (screen: ScreenType) => void;
  onOpenVoiceCapture: () => void;
  onInspectTransaction: (tx: Transaction) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  categories,
  todayExpenses,
  totalBalance,
  totalOutflow,
  onNavigate,
  onOpenVoiceCapture,
  onInspectTransaction,
}) => {
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string | null>(null);

  const selectedCategory = categories.find((c) =>
    c.id.includes(selectedCategoryKey || '') || c.name.toLowerCase().includes(selectedCategoryKey || '')
  );

  const handleSelectSlice = (key: string) => {
    if (selectedCategoryKey === key) {
      setSelectedCategoryKey(null);
    } else {
      setSelectedCategoryKey(key);
    }
  };

  const handleClearSelection = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedCategoryKey(null);
  };

  // Center stat content
  const centerTitle = selectedCategory ? selectedCategory.name : 'Burn Rate';
  const centerStat = selectedCategory ? selectedCategory.percentage : '57%';
  const centerSubtitle = selectedCategory ? `$${selectedCategory.spent.toFixed(2)}` : 'On Track';

  return (
    <div className="flex flex-col w-full relative z-10 max-w-md mx-auto px-4 pb-16">
      {/* 1. Available Balance Hero (Clickable to switch to Analytics view) */}
      <div
        className="relative z-10 flex flex-col items-center justify-center pt-1 pb-1 text-center cursor-pointer group active:scale-98 transition-transform"
        onClick={() => onNavigate('analytics')}
        title="Click to view Analytics & Balance"
      >
        <div className="relative my-0.5">
          <div className="font-montez text-5xl text-black font-normal leading-none tracking-tight group-hover:scale-105 transition-transform">
            ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </div>
          <svg className="w-28 h-2 mx-auto text-black mt-0.5" fill="none" viewBox="0 0 144 10">
            <path
              d="M2 7.5C18 3.5 35 8.5 52 5C68 1.5 86 8.5 103 4.5C118 1 131 7 142 5"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2.5"
            />
          </svg>
        </div>
        <div className="inline-flex items-center bg-[#e8e8e8] px-2.5 py-0.5 rounded-full text-[11px] text-black font-medium mt-0.5">
          <span>~ This month's left-to-spend</span>
        </div>
      </div>

      {/* 2. Monthly Outflow Card with Donut Pie Chart */}
      <div className="relative z-10 bg-[#ffffff] rounded-2xl p-3 my-1.5 shadow-sm border border-black/5 flex flex-col items-center">
        <div className="flex items-center justify-between w-full mb-0.5">
          <div className="flex items-center gap-1.5">
            <span className="font-montez text-xl text-black font-normal">Monthly Outflow</span>
            <span className="font-mono text-[9px] bg-[#eeeeee] px-1 py-0.5 rounded text-[#5e5e5e] font-semibold">
              Oct 2024
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-space text-xs font-semibold text-black">
              ${totalOutflow.toLocaleString('en-US', { minimumFractionDigits: 0 })} Total
            </span>
            <span className="text-[10px] text-[#5e5e5e] font-mono tracking-tighter">(tap slice)</span>
          </div>
        </div>

        {/* Rotary Donut Wheel */}
        <div className="relative w-44 h-44 my-0.5 flex items-center justify-center">
          <svg
            className={`w-full h-full overflow-visible ${
              selectedCategoryKey ? 'pie-paused' : 'pie-rotating'
            }`}
            fill="none"
            viewBox="0 0 200 200"
          >
            {/* Slice 1: Essentials (48%) - Hatch */}
            <g
              aria-label="Essentials slice 48 percent"
              className={`slice-interactive ${
                selectedCategoryKey === 'essentials' ? 'slice-selected-essentials' : ''
              }`}
              onClick={() => handleSelectSlice('essentials')}
              role="button"
              tabIndex={0}
            >
              <path
                d="M 100 20 A 80 80 0 0 1 179.3 110.1 L 149.6 106.3 A 50 50 0 0 0 100 50 Z"
                fill="#d4d4d8"
              />
              <path
                d="M 100 20 A 80 80 0 0 1 179.3 110.1 L 149.6 106.3 A 50 50 0 0 0 100 50 Z"
                fill="url(#doodleHatch)"
                stroke="#1a1a1a"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.2"
              />
              <path
                d="M 101 22 A 79 79 0 0 1 178 109 L 149 106 A 49 49 0 0 0 101 51 Z"
                fill="none"
                opacity="0.6"
                stroke="#262626"
                strokeDasharray="8 4"
                strokeWidth="1"
              />
            </g>

            {/* Slice 2: Fun & Life (32%) - Polka dots */}
            <g
              aria-label="Fun and Life slice 32 percent"
              className={`slice-interactive ${
                selectedCategoryKey === 'fun' ? 'slice-selected-fun' : ''
              }`}
              onClick={() => handleSelectSlice('fun')}
              role="button"
              tabIndex={0}
            >
              <path
                d="M 179.3 110.1 A 80 80 0 0 1 23.9 124.7 L 52.4 115.4 A 50 50 0 0 0 149.6 106.3 Z"
                fill="#e4e4e7"
              />
              <path
                d="M 179.3 110.1 A 80 80 0 0 1 23.9 124.7 L 52.4 115.4 A 50 50 0 0 0 149.6 106.3 Z"
                fill="url(#doodleDots)"
                stroke="#1a1a1a"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.2"
              />
              <path
                d="M 178 111 A 79 79 0 0 1 25.5 124 L 53 115 A 49 49 0 0 0 148 106 Z"
                fill="none"
                opacity="0.5"
                stroke="#262626"
                strokeDasharray="6 3"
                strokeWidth="1"
              />
            </g>

            {/* Slice 3: Savings (20%) - Rupee */}
            <g
              aria-label="Savings slice 20 percent"
              className={`slice-interactive ${
                selectedCategoryKey === 'savings' ? 'slice-selected-savings' : ''
              }`}
              onClick={() => handleSelectSlice('savings')}
              role="button"
              tabIndex={0}
            >
              <path
                d="M 23.9 124.7 A 80 80 0 0 1 100 20 L 100 50 A 50 50 0 0 0 52.4 115.4 Z"
                fill="#f4f4f5"
              />
              <path
                d="M 23.9 124.7 A 80 80 0 0 1 100 20 L 100 50 A 50 50 0 0 0 52.4 115.4 Z"
                fill="url(#doodleRupee)"
                stroke="#1a1a1a"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.2"
              />
              <path
                d="M 25.5 123.5 A 79 79 0 0 1 99 22 L 99 51 A 49 49 0 0 0 53 115 Z"
                fill="none"
                opacity="0.5"
                stroke="#262626"
                strokeDasharray="5 3"
                strokeWidth="1"
              />
            </g>

            <circle cx="100" cy="100" fill="none" pointerEvents="none" r="80" stroke="#1a1a1a" strokeLinecap="round" strokeWidth="2.2" />
            <circle cx="100" cy="100" fill="none" pointerEvents="none" r="50" stroke="#1a1a1a" strokeLinecap="round" strokeWidth="2.2" />
          </svg>

          {/* Donut Center Readout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="font-mono text-[8px] uppercase tracking-wider text-[#5e5e5e] font-bold">
              {centerTitle}
            </span>
            <span className="font-montez text-3xl text-black font-normal leading-none my-0.5">
              {centerStat}
            </span>
            <span className="font-mono text-[9px] text-black font-medium tracking-tight">
              {centerSubtitle}
            </span>
          </div>
        </div>

        {/* Category Pills (Essentials, Fun & Life, Savings) */}
        <div className="grid grid-cols-3 gap-1.5 w-full pt-1">
          <button
            type="button"
            onClick={() => handleSelectSlice('essentials')}
            className={`flex flex-col items-center py-1.5 px-1 rounded-xl text-center border active:scale-95 transition-all cursor-pointer ${
              selectedCategoryKey === 'essentials'
                ? 'bg-[#e8e8e8] border-black ring-2 ring-black'
                : 'bg-[#f3f3f4] border-black/5 hover:border-black/30'
            }`}
          >
            <div
              className="w-3.5 h-3.5 rounded-full border border-black/80 mb-0.5 overflow-hidden"
              style={{
                background:
                  'repeating-linear-gradient(45deg, #18181b, #18181b 2px, #d4d4d8 2px, #d4d4d8 4px)',
                backgroundColor: '#d4d4d8',
              }}
            />
            <span className="font-space text-[11px] font-semibold text-black leading-tight">Essentials</span>
            <span className="font-mono text-[9px] text-[#5e5e5e] mt-0.5">48% - $888</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectSlice('fun')}
            className={`flex flex-col items-center py-1.5 px-1 rounded-xl text-center border active:scale-95 transition-all cursor-pointer ${
              selectedCategoryKey === 'fun'
                ? 'bg-[#e8e8e8] border-black ring-2 ring-black'
                : 'bg-[#f3f3f4] border-black/5 hover:border-black/30'
            }`}
          >
            <div
              className="w-3.5 h-3.5 rounded-full border border-black/80 mb-0.5 overflow-hidden"
              style={{
                backgroundColor: '#e4e4e7',
                backgroundImage: 'radial-gradient(#52525b 1.5px, transparent 1.5px)',
                backgroundSize: '5px 5px',
              }}
            />
            <span className="font-space text-[11px] font-semibold text-black leading-tight">Fun & Life</span>
            <span className="font-mono text-[9px] text-[#5e5e5e] mt-0.5">32% - $592</span>
          </button>

          <button
            type="button"
            onClick={() => handleSelectSlice('savings')}
            className={`flex flex-col items-center py-1.5 px-1 rounded-xl text-center border active:scale-95 transition-all cursor-pointer ${
              selectedCategoryKey === 'savings'
                ? 'bg-[#e8e8e8] border-black ring-2 ring-black'
                : 'bg-[#f3f3f4] border-black/5 hover:border-black/30'
            }`}
          >
            <div className="w-3.5 h-3.5 rounded-full border border-black/80 mb-0.5 bg-[#f4f4f5] flex items-center justify-center text-[8px] font-bold text-zinc-700 leading-none">
              ₹
            </div>
            <span className="font-space text-[11px] font-semibold text-black leading-tight">Savings</span>
            <span className="font-mono text-[9px] text-[#5e5e5e] mt-0.5">20% - $370</span>
          </button>
        </div>

        {/* Selected Category Detail Drawer Card */}
        {selectedCategory && (
          <div className="w-full mt-2.5 pt-2 border-t border-black/10 flex flex-col text-left transition-all duration-300">
            <div className="bg-[#f3f3f4]/70 rounded-xl p-2.5 border border-black/15 shadow-xs sketch-card relative">
              <button
                type="button"
                aria-label="Close category details"
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white hover:bg-[#eeeeee] flex items-center justify-center border border-black/20 text-black text-xs active:scale-90 transition-transform cursor-pointer"
                onClick={handleClearSelection}
              >
                ✕
              </button>

              <div className="flex items-center gap-2 pr-6">
                <div className="w-8 h-8 rounded-full border border-black/70 flex items-center justify-center bg-white text-base">
                  <span className="material-symbols-outlined text-[18px]">
                    {selectedCategory.icon || 'star'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-montez text-2xl text-black leading-none">
                    {selectedCategory.name}
                  </span>
                  <span className="font-mono text-[10px] text-[#5e5e5e]">
                    {selectedCategory.percentage} of outflow • Burn {selectedCategory.burnPct}
                  </span>
                </div>
              </div>

              {/* 3 Metric Columns */}
              <div className="grid grid-cols-3 gap-1.5 mt-2 pt-2 border-t border-black/10 text-center">
                <div className="flex flex-col">
                  <span className="font-mono text-[8px] uppercase tracking-wider text-[#5e5e5e]">Spent</span>
                  <div className="font-montez text-2xl text-black leading-none mt-0.5">
                    ${selectedCategory.spent.toFixed(2)}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[8px] uppercase tracking-wider text-[#5e5e5e]">Budget</span>
                  <div className="font-montez text-2xl text-black leading-none mt-0.5">
                    ${selectedCategory.amount.toFixed(2)}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[8px] uppercase tracking-wider text-[#5e5e5e]">Remaining</span>
                  <div className="font-montez text-2xl text-black leading-none mt-0.5">
                    ${Math.max(0, selectedCategory.amount - selectedCategory.spent).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Progress Squiggle Line */}
              <div className="mt-2">
                <div className="w-full py-1 relative flex items-center">
                  <svg className="w-full h-5 overflow-visible" preserveAspectRatio="none" viewBox="0 0 280 18">
                    <path
                      d="M 2 9 Q 25 2, 50 10 T 98 9 T 146 10 T 194 8 T 242 10 T 278 9"
                      fill="none"
                      stroke="#e2e2e2"
                      strokeDasharray="4 3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="4"
                    />
                    <path
                      d="M 2 9 Q 25 2, 50 10 T 98 9 T 146 10 T 194 8 T 242 10 T 278 9"
                      fill="none"
                      stroke="#1a1a1a"
                      strokeOpacity="0.15"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="6"
                    />
                    <path
                      d="M 2 9 Q 25 2, 50 10 T 98 9 T 146 10 T 194 8 T 242 10 T 278 9"
                      fill="none"
                      pathLength="100"
                      stroke="#000000"
                      strokeDasharray="100"
                      strokeDashoffset={100 - (parseFloat(selectedCategory.burnPct) || 75)}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="4.5"
                      style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                    />
                    <circle
                      cx={
                        20 +
                        Math.min(250, (250 * (parseFloat(selectedCategory.burnPct) || 75)) / 100)
                      }
                      cy="9.5"
                      fill="#ffffff"
                      r="4"
                      stroke="#000000"
                      strokeWidth="2"
                      style={{ transition: 'cx 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
                    />
                  </svg>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-2.5 pt-1">
                <button
                  type="button"
                  className="flex-1 py-1.5 px-3 rounded-full bg-black text-white text-xs font-medium hover:bg-zinc-800 active:scale-95 transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                  onClick={() => onNavigate('analytics')}
                >
                  <span className="material-symbols-outlined text-[15px]">insights</span>
                  <span className="font-space text-[11px] font-semibold">View Analytics & Balance</span>
                </button>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-full bg-white text-black text-xs border border-black/20 hover:bg-[#eeeeee] active:scale-95 transition-all font-mono text-[10px] cursor-pointer"
                  onClick={handleClearSelection}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. GEMINI VOICE TRIGGER BUTTON */}
      <div className="relative z-10 flex flex-col items-center justify-center py-2 text-center">
        <div className="relative flex items-center justify-center">
          {/* Animated Rainbow Aura */}
          <div
            className="absolute -inset-3 rounded-full blur-xl pointer-events-none transition-all duration-500 ease-out opacity-80 scale-100 gemini-aura-active"
            style={{
              background: 'conic-gradient(from 0deg, #4285F4, #9B72CB, #EA4335, #FBBC05, #4285F4)',
            }}
          />
          <button
            type="button"
            aria-label="Record voice expense"
            onClick={() => {
              vibrateTap();
              onOpenVoiceCapture();
            }}
            className="relative z-10 w-16 h-16 rounded-full flex items-center justify-center sketch-border shadow-md active:scale-95 transition-transform duration-200 cursor-pointer bg-[#ffffff] text-black hover:bg-zinc-50"
            title="Tap to speak with Gemini"
          >
            <span className="material-symbols-outlined text-[30px]">mic</span>
          </button>
        </div>
        <div
          className="mt-1.5 text-center cursor-pointer"
          onClick={() => {
            vibrateTap();
            onOpenVoiceCapture();
          }}
        >
          <p className="font-space text-xs font-semibold text-black hover:underline">
            Tap or say "How much did I spend today?"
          </p>
          <p className="font-montez text-base text-[#5e5e5e] leading-tight mt-0.5">
            Gemini Live Voice & Notes Assistant
          </p>
        </div>
      </div>

      {/* 4. TODAY'S EXPENSES LIST */}
      <div className="flex flex-col gap-2 w-full mt-4 pt-1 relative z-10">
        <div className="flex justify-between items-center px-1">
          <span className="font-montez text-2xl text-black font-normal">Today's Expenses</span>
          <span
            className="font-mono text-xs text-black cursor-pointer hover:underline"
            onClick={() => onNavigate('analytics')}
          >
            See All
          </span>
        </div>

        {todayExpenses.map((tx) => (
          <div
            key={tx.id}
            onClick={() => onInspectTransaction(tx)}
            className="relative z-10 flex items-center justify-between p-3 bg-[#ffffff] rounded-xl shadow-xs border border-black/5 cursor-pointer active:scale-98 transition-transform hover:border-black/20"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#e8e8e8] flex items-center justify-center text-black">
                <span className="material-symbols-outlined text-[20px]">{tx.icon}</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="font-space text-sm font-semibold text-black">{tx.name}</span>
                <span className="font-mono text-[11px] text-[#5e5e5e]">{tx.time}</span>
              </div>
            </div>
            <span className="font-montez text-2xl text-black font-normal">-${tx.amount.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

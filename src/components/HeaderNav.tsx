import React, { useState, useEffect, useRef } from 'react';
import { ScreenType } from '../types.ts';
import { ChangeLogo } from './IntroOverlay.tsx';

interface HeaderNavProps {
  currentScreen: ScreenType;
  onNavigate: (screen: ScreenType) => void;
  onReplayIntro: () => void;
  onOpenNotifications: () => void;
  onOpenNotesSheet: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentScreen,
  onNavigate,
  onReplayIntro,
  onOpenNotifications,
  onOpenNotesSheet,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
      {/* 1. iOS Style System Status Bar */}
      <header className="w-full bg-[#f9f9f9]/90 backdrop-blur-md pt-3 pb-1 select-none">
        <div className="max-w-md mx-auto flex items-center justify-between px-6 text-black text-xs font-semibold">
          <span
            className="text-[14px] font-bold tracking-tight"
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
          >
            9:41
          </span>
          <div
            className="flex items-center gap-1.5"
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}
          >
            <span className="material-symbols-outlined text-[16px]">signal_cellular_4_bar</span>
            <span className="material-symbols-outlined text-[16px]">wifi</span>
            <div className="flex items-center gap-0.5 ml-0.5">
              <div className="w-5 h-2.5 border border-black rounded-sm p-0.5 flex items-center">
                <div className="w-full h-full bg-black rounded-[1px]" />
              </div>
              <div className="w-0.5 h-1 bg-black rounded-r-xs" />
            </div>
          </div>
        </div>
      </header>

      {/* 2. Top Header Navigation (Dashboard view) */}
      {currentScreen === 'dashboard' && (
        <div className="relative z-30 flex items-center justify-between w-full max-w-md mx-auto px-4 pt-1 pb-1.5">
          {/* Change Logo */}
          <div
            className="flex items-center cursor-pointer active:scale-95 transition-transform"
            onClick={onReplayIntro}
            title="Click to replay intro animation"
          >
            <ChangeLogo className="h-8 w-auto object-contain" />
          </div>

          {/* Screen Pills Switcher */}
          <div className="flex items-center gap-1 bg-[#eeeeee] p-0.5 rounded-full border border-black/10 text-xs font-mono">
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="px-2.5 py-0.5 rounded-full transition-all cursor-pointer bg-black text-white font-bold shadow-xs"
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => onNavigate('analytics')}
              className="px-2.5 py-0.5 rounded-full transition-all cursor-pointer text-zinc-600 hover:text-black"
            >
              Report
            </button>
            <button
              type="button"
              onClick={() => onNavigate('budget')}
              className="px-2.5 py-0.5 rounded-full transition-all cursor-pointer text-zinc-600 hover:text-black"
            >
              Dial
            </button>
          </div>

          {/* Action Buttons */}
          <div className="relative flex items-center gap-1.5" ref={menuRef}>
            {/* Mindful Notes button */}
            <button
              type="button"
              aria-label="Mindful Notes"
              onClick={onOpenNotesSheet}
              title="Open Mindful Notes & Reflections"
              className="w-7 h-7 rounded-full bg-[#f3f3f4] hover:bg-[#eeeeee] flex items-center justify-center text-black active:scale-95 transition-transform border border-black/5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">sticky_note_2</span>
            </button>

            <button
              type="button"
              aria-label="Notifications"
              onClick={onOpenNotifications}
              className="w-7 h-7 rounded-full bg-[#f3f3f4] hover:bg-[#eeeeee] flex items-center justify-center text-black active:scale-95 transition-transform border border-black/5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">notifications</span>
            </button>

            {/* Quick Actions Dropdown Menu Button */}
            <div className="relative">
              <button
                type="button"
                aria-expanded={isMenuOpen}
                aria-label="Menu"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen((prev) => !prev);
                }}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-black active:scale-95 transition-all border border-black/5 cursor-pointer ${
                  isMenuOpen ? 'bg-[#eeeeee]' : 'bg-[#f3f3f4] hover:bg-[#eeeeee]'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">
                  {isMenuOpen ? 'close' : 'menu'}
                </span>
              </button>

              {/* Doodle Dropdown Menu */}
              {isMenuOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-52 bg-white sketch-dropdown z-50 p-1.5 transition-all duration-200 ease-out origin-top-right shadow-xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-2 pt-1 pb-1 border-b border-black/10 flex items-center justify-between">
                    <span className="font-montez text-sm text-[#5e5e5e] leading-none">
                      Quick Actions
                    </span>
                    <svg className="w-4 h-2 text-black/40" fill="none" viewBox="0 0 24 8">
                      <path
                        d="M1 4 C6 1, 10 7, 15 4 C18 2, 21 6, 23 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  <div className="flex flex-col py-1">
                    {/* Option 1: Set / Add Budget */}
                    <button
                      type="button"
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left hover:bg-[#f3f3f4] active:bg-[#eeeeee] transition-colors group cursor-pointer"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onNavigate('budget');
                      }}
                    >
                      <div className="w-7 h-7 rounded-full border border-black/80 flex items-center justify-center bg-[#f3f3f4] group-hover:bg-white group-hover:scale-105 transition-all shrink-0">
                        <span className="material-symbols-outlined text-[16px]">tune</span>
                      </div>
                      <span className="font-montez text-xl text-black leading-tight flex-1">
                        Set Monthly Budget
                      </span>
                    </button>

                    {/* Option 2: Analytics / Reports */}
                    <button
                      type="button"
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left hover:bg-[#f3f3f4] active:bg-[#eeeeee] transition-colors group cursor-pointer"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onNavigate('analytics');
                      }}
                    >
                      <div className="w-7 h-7 rounded-full border border-black/80 flex items-center justify-center bg-[#f3f3f4] group-hover:bg-white group-hover:scale-105 transition-all shrink-0">
                        <span className="material-symbols-outlined text-[16px]">insights</span>
                      </div>
                      <span className="font-montez text-xl text-black leading-tight flex-1">
                        Analytics / Reports
                      </span>
                    </button>

                    {/* Option 3: Mindful Notes Sheet */}
                    <button
                      type="button"
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left hover:bg-[#f3f3f4] active:bg-[#eeeeee] transition-colors group cursor-pointer"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onOpenNotesSheet();
                      }}
                    >
                      <div className="w-7 h-7 rounded-full border border-black/80 flex items-center justify-center bg-[#f3f3f4] group-hover:bg-white group-hover:scale-105 transition-all shrink-0">
                        <span className="material-symbols-outlined text-[16px]">sticky_note_2</span>
                      </div>
                      <span className="font-montez text-xl text-black leading-tight flex-1">
                        Mindful Notes & Ledger
                      </span>
                    </button>

                    {/* Option 3: Replay Intro */}
                    <button
                      type="button"
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left hover:bg-[#f3f3f4] active:bg-[#eeeeee] transition-colors group cursor-pointer"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onReplayIntro();
                      }}
                    >
                      <div className="w-7 h-7 rounded-full border border-black/80 flex items-center justify-center bg-[#f3f3f4] group-hover:bg-white group-hover:scale-105 transition-all shrink-0">
                        <span className="material-symbols-outlined text-[16px]">replay</span>
                      </div>
                      <span className="font-montez text-xl text-black leading-tight flex-1">
                        Replay Intro
                      </span>
                    </button>
                  </div>

                  <div className="pt-0.5 pb-0.5 border-t border-black/10 px-2 flex items-center justify-between">
                    <span className="font-montez text-xs text-[#5e5e5e]/80">Change v1.2</span>
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-black/30" />
                      <span className="w-1.5 h-1.5 rounded-full bg-black/60" />
                      <span className="w-1.5 h-1.5 rounded-full bg-black" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

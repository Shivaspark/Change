import React, { useState, useEffect } from 'react';
import { vibrateTap, vibrateSuccess } from '../utils/haptics.ts';

export const InstallPwaBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already in standalone Android PWA mode
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    vibrateTap();
    if (!deferredPrompt) {
      // If browser doesn't support beforeinstallprompt (e.g. preview iframe), give helpful tip
      alert('To install on Android: Tap the 3 dots in Chrome and select "Install app" or "Add to Home screen".');
      return;
    }

    try {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        vibrateSuccess();
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } catch (e) {
      console.warn('Install prompt error:', e);
    }
  };

  if (isInstalled || isDismissed) return null;

  return (
    <div className="w-full max-w-md mx-auto px-4 pt-1 pb-1 z-30">
      <div className="bg-stone-50 border-2 border-black rounded-2xl p-2.5 shadow-sm flex items-center justify-between gap-2 sketch-card">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px]">phone_android</span>
          </div>
          <div className="flex flex-col text-left">
            <span className="font-montez text-lg text-black font-bold leading-tight">
              Install Android App
            </span>
            <span className="font-mono text-[9px] text-zinc-500">
              Fast offline ledger & voice notes
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleInstallClick}
            className="px-3 py-1 rounded-full bg-black text-white text-[11px] font-space font-semibold active:scale-95 transition-transform shadow-xs cursor-pointer flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[14px]">download</span>
            <span>Install</span>
          </button>
          <button
            type="button"
            aria-label="Dismiss banner"
            onClick={() => {
              vibrateTap();
              setIsDismissed(true);
            }}
            className="w-6 h-6 rounded-full bg-zinc-200 hover:bg-zinc-300 text-zinc-700 flex items-center justify-center text-xs active:scale-90 transition-transform cursor-pointer"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

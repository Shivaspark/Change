import React, { useEffect, useState } from 'react';

interface IntroOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LOGO_IMAGE_SRC =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA2MB0ly1cOQqqujsHnO4sC536PlARRpav--zW4PiK9lPSrLjpsgsAvMOwv6r2ee16m-DzQebaaZ1KxGWkb0zxidLaQ36pFrrjXcVi7Yc7Ry9kbQwK4DmT3EPDCNNhlXwXmIF8krf0qA824L1Ulj1nibxc22slT8QlGHqww883o3UnBob-5OXNNm-w6Gr5mySA_6nEwQWuM2dsWpd3PSQUjRRTXpza6XyGFIS5tD1L5FEK6s0XdTFggWXblkLIUXrzhAA';

export const ChangeLogo: React.FC<{ className?: string; onClick?: () => void }> = ({
  className = 'h-8 w-auto object-contain',
  onClick,
}) => {
  const [imgFailed, setImgFailed] = useState(false);

  if (imgFailed) {
    return (
      <div
        onClick={onClick}
        className="flex items-center gap-1.5 cursor-pointer select-none group"
        title="Change Finance"
      >
        <div className="w-7 h-7 rounded-full border-2 border-black flex items-center justify-center font-montez text-lg font-bold group-hover:scale-105 transition-transform">
          ¢
        </div>
        <span className="font-montez text-2xl font-bold text-black tracking-tight leading-none">
          Change
        </span>
      </div>
    );
  }

  return (
    <img
      src={LOGO_IMAGE_SRC}
      alt="Change Logo"
      className={className}
      onError={() => setImgFailed(true)}
      onClick={onClick}
    />
  );
};

export const IntroOverlay: React.FC<IntroOverlayProps> = ({ isOpen, onClose }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setIsFadingOut(false);
    const timer = setTimeout(() => {
      handleClose();
    }, 3400);

    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleClose = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      onClose();
      setIsFadingOut(false);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#ffffff] flex flex-col items-center justify-center select-none overflow-hidden transition-opacity duration-600 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Skip Intro Pill Button at Top Right */}
      <div className="absolute top-12 right-6 z-30">
        <button
          type="button"
          onClick={handleClose}
          className="px-4 py-1.5 rounded-full bg-[#f3f3f4] text-black text-xs font-semibold tracking-wide border border-black/10 hover:bg-[#eeeeee] active:scale-95 transition-all shadow-sm flex items-center gap-1 cursor-pointer"
        >
          <span className="font-montez text-sm">Skip Intro</span>
          <span className="text-[13px] leading-none">✕</span>
        </button>
      </div>

      {/* Center Stage Container */}
      <div className="relative w-80 h-80 flex items-center justify-center">
        {/* STEP 2: 3 Smooth Concentric Circles (organic ripples, delayed start) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none fade-in-delayed-rings">
          <div className="absolute w-44 h-44 rounded-full border border-black/35 ring-pulse-1" />
          <div className="absolute w-44 h-44 rounded-full border border-black/25 ring-pulse-2" />
          <div className="absolute w-44 h-44 rounded-full border border-black/15 ring-pulse-3" />
        </div>

        {/* STEP 3: Small Doodle Finance Icons Floating in Orbit (delayed fade-in) */}
        <div className="absolute w-64 h-64 pointer-events-none flex items-center justify-center fade-in-delayed-icons">
          <div className="relative w-full h-full orbit-track">
            {/* 1. Hand-Drawn Doodle Rupee Coin (Top) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="counter-orbit bobbing">
                <svg
                  className="w-6 h-6 text-black"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="9.2" />
                  <circle cx="12" cy="12" opacity="0.4" r="7.2" strokeDasharray="2.5 2" strokeWidth="1.2" />
                  <path d="M9.5 7.5h5" strokeWidth="1.8" />
                  <path d="M9.5 9.8h4.2" strokeWidth="1.8" />
                  <path d="M11.2 7.5v4.5c1.4 0 2.6.4 2.6 1.8 0 1.2-1 1.7-2.3 1.7" strokeWidth="1.8" />
                  <path d="M11.5 15.2l3 3.3" strokeWidth="1.8" />
                </svg>
              </div>
            </div>

            {/* 2. Bar Chart (Top-Right) */}
            <div className="absolute top-[18%] right-[8%] translate-x-1/2 -translate-y-1/2">
              <div className="counter-orbit bobbing" style={{ animationDelay: '0.5s' }}>
                <svg
                  className="w-6 h-6 text-black"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <line x1="18" x2="18" y1="20" y2="10" />
                  <line x1="12" x2="12" y1="20" y2="4" />
                  <line x1="6" x2="6" y1="20" y2="14" />
                  <line x1="3" x2="21" y1="20" y2="20" />
                </svg>
              </div>
            </div>

            {/* 3. Calculator (Bottom-Right) */}
            <div className="absolute bottom-[18%] right-[8%] translate-x-1/2 translate-y-1/2">
              <div className="counter-orbit bobbing" style={{ animationDelay: '1s' }}>
                <svg
                  className="w-6 h-6 text-black"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <rect height="18" rx="2" width="14" x="5" y="3" />
                  <line x1="8" x2="16" y1="7" y2="7" />
                  <circle cx="9" cy="12" fill="currentColor" r="1" />
                  <circle cx="12" cy="12" fill="currentColor" r="1" />
                  <circle cx="15" cy="12" fill="currentColor" r="1" />
                  <circle cx="9" cy="16" fill="currentColor" r="1" />
                  <circle cx="12" cy="16" fill="currentColor" r="1" />
                  <circle cx="15" cy="16" fill="currentColor" r="1" />
                </svg>
              </div>
            </div>

            {/* 4. Pie Chart (Bottom) */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
              <div className="counter-orbit bobbing" style={{ animationDelay: '1.5s' }}>
                <svg
                  className="w-6 h-6 text-black"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                  <path d="M22 12A10 10 0 0 0 12 2v10z" />
                </svg>
              </div>
            </div>

            {/* 5. Receipt (Bottom-Left) */}
            <div className="absolute bottom-[18%] left-[8%] -translate-x-1/2 translate-y-1/2">
              <div className="counter-orbit bobbing" style={{ animationDelay: '2s' }}>
                <svg
                  className="w-6 h-6 text-black"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 2v20l3-2 3 2 3-2 3 2 4-2V2l-4 2-3-2-3 2-3-2-3 2z" />
                  <line x1="8" x2="16" y1="8" y2="8" />
                  <line x1="8" x2="16" y1="12" y2="12" />
                  <line x1="8" x2="12" y1="16" y2="16" />
                </svg>
              </div>
            </div>

            {/* 6. Hand-Drawn Doodle Rupee Banknote (Top-Left) */}
            <div className="absolute top-[18%] left-[8%] -translate-x-1/2 -translate-y-1/2">
              <div className="counter-orbit bobbing" style={{ animationDelay: '2.5s' }}>
                <svg
                  className="w-6 h-6 text-black"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <rect height="13" rx="2" width="20" x="2" y="5.5" />
                  <circle cx="12" cy="12" r="3.2" strokeWidth="1.3" />
                  <path d="M11 10.3h2m-2 1.3h1.7m-.9-1.3v2c.5 0 .9.2.9.7 0 .5-.4.7-.9.7m0 0l1.1 1.2" strokeWidth="1.3" />
                  <path d="M5 8.5v7m14-7v7" strokeDasharray="1.5 1.5" strokeWidth="1.2" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* STEP 1: Centered Change Logo (Starts scaled up, smoothly zooms out to central rest) */}
        <div className="relative z-20 flex items-center justify-center p-2">
          <ChangeLogo className="w-56 max-w-[260px] h-auto object-contain select-none intro-logo-anim" />
        </div>
      </div>

      {/* Intro Bottom Caption */}
      <div className="absolute bottom-12 flex flex-col items-center text-center">
        <span className="font-montez text-black text-3xl font-normal leading-tight">Change</span>
        <span className="font-mono text-[11px] text-[#5e5e5e] tracking-widest uppercase mt-0.5">
          Mindful Micro Finance
        </span>
      </div>
    </div>
  );
};

import React from 'react';

export const SvgDefs: React.FC = () => {
  return (
    <svg
      aria-hidden="true"
      className="absolute w-0 h-0 pointer-events-none"
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
    >
      <defs>
        {/* Pattern 1: Diagonal Hatch / Striped (Essentials 48%) */}
        <pattern
          id="doodleHatch"
          width="8"
          height="8"
          patternTransform="rotate(45)"
          patternUnits="userSpaceOnUse"
        >
          <line x1="0" y1="0" x2="0" y2="8" stroke="#1c1917" strokeWidth="2.4" strokeLinecap="round" />
        </pattern>

        {/* Pattern 2: Dotted / Polka-dot (Fun & Life 32%) */}
        <pattern id="doodleDots" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="1.8" fill="#52525b" />
        </pattern>

        {/* Pattern 3: Currency / Speckle Doodle Pattern (Savings 20%) */}
        <pattern id="doodleRupee" width="14" height="14" patternUnits="userSpaceOnUse">
          <text
            x="7"
            y="11"
            fill="#71717a"
            fontFamily="'Space Grotesk', sans-serif"
            fontSize="10"
            fontWeight="700"
            textAnchor="middle"
          >
            ₹
          </text>
        </pattern>

        {/* Background Paper Texture Ambient Watermark */}
        <pattern id="grid-doodle" width="48" height="48" patternUnits="userSpaceOnUse">
          <circle cx="12" cy="12" r="1.2" fill="#000000" />
          <circle cx="36" cy="36" r="0.9" fill="#000000" />
          <path d="M4 42 Q 14 46, 24 42" fill="none" stroke="#000000" strokeWidth="0.8" strokeLinecap="round" />
          <path d="M38 8 Q 44 4, 46 12" fill="none" stroke="#000000" strokeWidth="0.6" />
          <text x="32" y="22" fill="#000000" fontFamily="'Montez', cursive" fontSize="10">
            ₹
          </text>
        </pattern>

        {/* Burn bar diagonal hatch */}
        <pattern
          id="ink-bar-hatch-merged"
          width="6"
          height="6"
          patternTransform="rotate(45 0 0)"
          patternUnits="userSpaceOnUse"
        >
          <line x1="0" y1="0" x2="0" y2="6" stroke="#ffffff" strokeWidth="2" />
        </pattern>
      </defs>
    </svg>
  );
};

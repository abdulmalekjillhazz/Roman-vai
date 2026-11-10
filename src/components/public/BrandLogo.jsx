import React from 'react';
import { CLIENT_INFO } from '../../config/clientInfo.js';

export function HouseMonogram({ className = "w-9 h-9", color = "#E5A924" }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Classical Decor ID Architectural House Logo"
    >
      <g stroke={color} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        {/* Left outer wall and Main Gable to Right outer wall */}
        <path d="M18 92 V38 L50 6 L82 38 V92" />
        {/* Baseline from tall pillar to right wall (left wall detached) */}
        <line x1="33" y1="92" x2="82" y2="92" />
        {/* Tall architectural vertical pillar */}
        <line x1="33" y1="10" x2="33" y2="92" />
        {/* Inner overlapping gable slope and hanging drop */}
        <path d="M33 10 L65 42 V68" />
        {/* Central entrance door */}
        <path d="M43 92 V72 H57 V92" />
      </g>
    </svg>
  );
}

// Backward compatibility alias
export const CDMonogram = HouseMonogram;

export default function BrandLogo({ variant = 'dark', showTagline = true, iconOnly = false, compact = false }) {
  const strokeColor = '#E5A924';
  const textColor = variant === 'light' ? 'text-white' : 'text-brand-charcoal';
  const taglineColor = variant === 'light' ? 'text-stone-300' : 'text-stone-600';

  if (iconOnly) {
    return <HouseMonogram className="w-9 h-9 shrink-0" color={strokeColor} />;
  }

  return (
    <div className={`inline-flex items-center ${compact ? 'gap-2 sm:gap-3.5' : 'gap-3.5'} select-none`}>
      <HouseMonogram className="w-9 h-9 shrink-0" color={strokeColor} />

      <div className="flex flex-col">
        <span className={`font-display ${compact ? 'text-base sm:text-xl tracking-[0.08em] sm:tracking-[0.14em]' : 'text-lg sm:text-xl tracking-[0.14em]'} font-bold leading-none ${textColor}`}>
          {CLIENT_INFO.brandName}
        </span>
        {showTagline && (
          <div className={`${compact ? 'hidden sm:flex' : 'flex'} items-center gap-1.5 mt-1.5`}>
            <span className={`font-sans text-[10px] tracking-[0.22em] font-semibold uppercase ${taglineColor}`}>
              DESIGN
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
            <span className={`font-sans text-[10px] tracking-[0.22em] font-semibold uppercase ${taglineColor}`}>
              DECOR
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
            <span className={`font-sans text-[10px] tracking-[0.22em] font-semibold uppercase ${taglineColor}`}>
              PERFECT
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export { BrandLogo };

import React from 'react';
import { CLIENT_INFO } from '../../config/clientInfo.js';

export function HouseMonogram({ className = "w-8 h-8", color = "#141414" }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="CLASSICAL DECOR I D Logo"
    >
      {/* Outer Architectural Gabled Roof */}
      <path
        d="M50 8L92 42V90H8V42L50 8Z"
        stroke={color}
        strokeWidth="6"
        strokeLinejoin="round"
      />
      {/* Inner Precision Structural Core */}
      <path
        d="M50 24L78 46V80H22V46L50 24Z"
        stroke={color}
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Central Pillar Symmetry */}
      <line
        x1="50"
        y1="34"
        x2="50"
        y2="80"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function BrandLogo({ variant = 'dark', showTagline = true, iconOnly = false, compact = false }) {
  const strokeColor = variant === 'light' ? '#FFFFFF' : '#141414';
  const textColor = variant === 'light' ? 'text-white' : 'text-brand-charcoal';
  const taglineColor = variant === 'light' ? 'text-stone-300' : 'text-stone-600';

  if (iconOnly) {
    return <HouseMonogram className="w-9 h-9" color={strokeColor} />;
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

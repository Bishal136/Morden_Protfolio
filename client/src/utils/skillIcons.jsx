import React from 'react';

/**
 * Technical SVG Icons matching dark engineering design system
 */
export const getSkillIcon = (iconName, size = 18) => {
  const iconLower = (iconName || '').toLowerCase();

  // React Atom
  if (iconLower.includes('react')) {
    return (
      <svg width={size} height={size} viewBox="-11.5 -10.23174 23 20.46348" fill="none" className="text-sky-400">
        <circle cx="0" cy="0" r="2.05" fill="#38BDF8" />
        <g stroke="#38BDF8" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    );
  }

  // Node.js Hexagon
  if (iconLower.includes('node')) {
    return (
      <svg width={size} height={size} viewBox="0 0 256 289" fill="none">
        <path
          d="M128 0L256 73.9V215.1L128 289L0 215.1V73.9L128 0Z"
          stroke="#22C55E"
          strokeWidth="20"
          fill="rgba(34, 197, 94, 0.15)"
        />
        <text
          x="128"
          y="180"
          textAnchor="middle"
          fill="#4ADE80"
          fontSize="105"
          fontWeight="bold"
          fontFamily="monospace"
        >
          JS
        </text>
      </svg>
    );
  }

  // Express.js
  if (iconLower.includes('express')) {
    return (
      <div className="flex items-center justify-center font-mono font-bold text-xs tracking-tighter text-slate-200">
        <span className="text-emerald-400">ex</span>
      </div>
    );
  }

  // MongoDB Leaf
  if (iconLower.includes('mongo')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2C12 2 6 9 6 15C6 18.5 8.5 22 12 22C15.5 22 18 18.5 18 15C18 9 12 2 12 2Z"
          fill="#10B981"
          opacity="0.9"
        />
        <path
          d="M12 2V22C12.5 22 13 21.8 13.5 21.5C16.5 19.5 17.5 16.5 17.5 14.5C17.5 9.5 12 2 12 2Z"
          fill="#059669"
        />
      </svg>
    );
  }

  // Redux Toolkit
  if (iconLower.includes('redux')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="2">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3a9 9 0 0 0 0 18" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }

  // Tailwind CSS
  if (iconLower.includes('tailwind') || iconLower.includes('css')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="#38BDF8">
        <path d="M12 6C9.6 6 8.1 7.2 7.5 9.6C8.4 8.4 9.45 7.95 10.65 8.25C11.55 8.475 12.2 9.125 12.9 9.85C14.05 11.025 15.35 12.35 18 12.35C20.4 12.35 21.9 11.15 22.5 8.75C21.6 9.95 20.55 10.4 19.35 10.1C18.45 9.875 17.8 9.225 17.1 8.5C15.95 7.325 14.65 6 12 6ZM6 12C3.6 12 2.1 13.2 1.5 15.6C2.4 14.4 3.45 13.95 4.65 14.25C5.55 14.475 6.2 15.125 6.9 15.85C8.05 17.025 9.35 18.35 12 18.35C14.4 18.35 15.9 17.15 16.5 14.75C15.6 15.95 14.55 16.4 13.35 16.1C12.45 15.875 11.8 15.225 11.1 14.5C9.95 13.325 8.65 12 6 12Z" />
      </svg>
    );
  }

  // C Systems & Memory
  if (iconLower === 'c' || iconLower.includes('c lang') || iconLower.includes('c prog') || iconLower.includes('cpp')) {
    return (
      <div className="flex items-center gap-1">
        <div className="w-4 h-4 rounded bg-indigo-950 border border-indigo-500/60 flex items-center justify-center font-bold font-mono text-[10px] text-indigo-300">
          C
        </div>
      </div>
    );
  }

  // JavaScript
  if (iconLower.includes('js') || iconLower.includes('javascript')) {
    return (
      <div className="w-4 h-4 rounded bg-amber-400 text-black font-black font-mono text-[9px] flex items-end justify-end p-0.5 leading-none">
        JS
      </div>
    );
  }

  // MySQL / Relational DB
  if (iconLower.includes('sql') || iconLower.includes('mysql') || iconLower.includes('postgres')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
        <path d="M12 13v7" />
        <path d="M16 16l-4-4" />
      </svg>
    );
  }

  // Git & GitHub
  if (iconLower.includes('git')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="18" r="3" />
        <circle cx="6" cy="6" r="3" />
        <circle cx="18" cy="6" r="3" />
        <path d="M18 9v2a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9" />
        <path d="M12 12v3" />
      </svg>
    );
  }

  // Default Code motif
  return (
    <div className="text-sky-400 font-mono font-bold text-xs">
      &lt;/&gt;
    </div>
  );
};

/**
 * Calculates human-readable proficiency tier from numeric proficiency or tier string.
 */
export const getProficiencyTier = (proficiency) => {
  if (typeof proficiency === 'string') {
    const lower = proficiency.toLowerCase();
    if (lower.includes('core')) return 'Core';
    if (lower.includes('prod')) return 'Production';
    return 'Familiar';
  }
  const score = Number(proficiency) || 75;
  if (score >= 85) return 'Core';
  if (score >= 70) return 'Production';
  return 'Familiar';
};

export default getSkillIcon;


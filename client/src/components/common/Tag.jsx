import React from 'react';

export const Tag = ({ children, variant = 'default', size = 'sm', className = '' }) => {
  const sizeClasses = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-1 text-xs font-medium',
    md: 'px-3 py-1.5 text-sm font-medium',
  };

  const variantClasses = {
    default: 'bg-slate-800/80 text-slate-300 border border-slate-700/60',
    primary: 'bg-blue-950/60 text-blue-400 border border-blue-800/50',
    cyan: 'bg-cyan-950/60 text-cyan-400 border border-cyan-800/50',
    emerald: 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50',
    purple: 'bg-purple-950/60 text-purple-400 border border-purple-800/50',
    amber: 'bg-amber-950/60 text-amber-400 border border-amber-800/50',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full transition-all duration-200 ${sizeClasses[size] || sizeClasses.sm} ${variantClasses[variant] || variantClasses.default} ${className}`}
    >
      {children}
    </span>
  );
};

export default Tag;

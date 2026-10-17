import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { getSkillIcon, getProficiencyTier } from '../../utils/skillIcons';

/**
 * Tier styling classes
 */
const tierStyles = {
  Core: 'bg-emerald-50 text-emerald-700 border-emerald-200/90',
  Production: 'bg-sky-50 text-sky-700 border-sky-200/90',
  Familiar: 'bg-slate-100 text-slate-700 border-slate-200',
};

export const SkillCard = ({ skill, showFilterLink = true }) => {
  const { name, icon, proficiency = 80, category } = skill;
  const tier = getProficiencyTier(proficiency);

  return (
    <div className="group relative bg-white hover:bg-slate-50/70 border border-slate-200 hover:border-sky-300 rounded-2xl p-4 transition-all duration-300 flex items-center justify-between gap-3 shadow-xs hover:shadow-md">
      {/* Icon + Label */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform text-slate-700">
          {getSkillIcon(icon || name, 18)}
        </div>
        <div className="min-w-0">
          <h4 className="font-semibold text-slate-900 text-sm tracking-tight truncate group-hover:text-sky-600 transition-colors">
            {name}
          </h4>
          {category && (
            <span className="text-[11px] text-slate-500 block font-mono">
              {category}
            </span>
          )}
        </div>
      </div>

      {/* Right: Tier Badge + Filter Link */}
      <div className="flex items-center gap-2 shrink-0">
        <span
          className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-medium border ${
            tierStyles[tier] || tierStyles.Production
          }`}
        >
          {tier}
        </span>

        {showFilterLink && (
          <Link
            to={`/projects?tag=${encodeURIComponent(name)}`}
            className="p-1 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-slate-100 transition-colors"
            title={`View projects built with ${name}`}
            aria-label={`View projects built with ${name}`}
          >
            <ArrowUpRight size={14} />
          </Link>
        )}
      </div>
    </div>
  );
};

export default SkillCard;

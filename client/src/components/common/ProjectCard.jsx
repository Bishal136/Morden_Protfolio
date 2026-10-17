import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight, Sparkles } from 'lucide-react';
import { GithubIcon } from './SocialIcons';
import { normalizeTags } from '../../utils/tagNormalizer';

export const ProjectCard = ({ project }) => {
  const {
    title,
    slug,
    shortDescription,
    coverImageUrl,
    techStack = [],
    liveSiteUrl,
    githubRepoUrl,
    isFeatured,
  } = project;

  const defaultImage =
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80';

  const normalizedTechStack = normalizeTags(techStack);

  return (
    <article className="group flex flex-col bg-white hover:bg-white border border-slate-200 hover:border-sky-300 rounded-3xl p-5 sm:p-6 transition-all duration-300 shadow-xs hover:shadow-xl hover:-translate-y-0.5 justify-between space-y-5">
      {/* 16:10 Browser-Frame Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-100 border border-slate-200 group-hover:border-sky-300/50 transition-colors">
        {/* Mock Browser Header with Window Controls */}
        <div className="absolute top-0 inset-x-0 h-7 bg-slate-100/90 backdrop-blur-md border-b border-slate-200 z-20 flex items-center px-3 justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-rose-400" />
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <span className="text-[10px] font-mono text-slate-500 truncate max-w-[160px]">
            {slug}.dev
          </span>
          <div className="w-3" />
        </div>

        <img
          src={coverImageUrl || defaultImage}
          alt={`Screenshot preview of ${title}`}
          className="w-full h-full object-cover object-top pt-7 group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Featured Pill */}
        {isFeatured && (
          <div className="absolute top-9 left-3 z-10">
            <span className="inline-flex items-center gap-1 bg-sky-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-md backdrop-blur-md">
              <Sparkles size={11} className="fill-white" />
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Card Content & Metadata */}
      <div className="space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2.5">
          {/* Canonical Tech Stack Pills */}
          <div className="flex flex-wrap gap-1.5">
            {normalizedTechStack.slice(0, 4).map((tech, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 bg-slate-100 border border-slate-200/80 text-sky-700 text-[11px] font-mono rounded-lg font-medium"
              >
                {tech}
              </span>
            ))}
            {normalizedTechStack.length > 4 && (
              <span className="px-2 py-0.5 bg-slate-50 text-slate-500 text-[11px] font-mono rounded-lg border border-slate-200/60">
                +{normalizedTechStack.length - 4}
              </span>
            )}
          </div>

          {/* Project Title */}
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight group-hover:text-sky-600 transition-colors">
            <Link
              to={`/projects/${slug}`}
              className="focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none rounded-lg"
            >
              {title}
            </Link>
          </h3>

          {/* Problem / Solution Summary */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
            {shortDescription}
          </p>
        </div>

        {/* Direct Action Links Row */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {liveSiteUrl && (
              <a
                href={liveSiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-sky-300 text-slate-700 hover:text-slate-900 text-xs font-semibold flex items-center gap-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
                aria-label={`View live demo of ${title}`}
                title="Live Demo"
              >
                <span>Live Demo</span>
                <ExternalLink size={12} className="opacity-70" />
              </a>
            )}

            {githubRepoUrl && (
              <a
                href={githubRepoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-sky-300 text-slate-600 hover:text-slate-900 transition-colors focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
                aria-label={`View source code of ${title} on GitHub`}
                title="Source Code"
              >
                <GithubIcon size={14} />
              </a>
            )}
          </div>

          <Link
            to={`/projects/${slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors group/link focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none rounded-lg p-1"
          >
            <span>Case Study</span>
            <ArrowRight
              size={13}
              className="group-hover/link:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;

import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { GithubIcon } from './SocialIcons';

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

  return (
    <div className="group flex flex-col bg-[#0e1424] hover:bg-[#121a30] border border-slate-800/90 hover:border-cyan-500/40 rounded-3xl p-5 sm:p-6 transition-all duration-300 shadow-xl hover:shadow-[0_0_25px_-5px_rgba(6,182,212,0.15)] justify-between space-y-5">
      {/* Cover Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-slate-900 border border-slate-800/80">
        <img
          src={coverImageUrl || defaultImage}
          alt={title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />

        {isFeatured && (
          <div className="absolute top-3 left-3">
            <span className="bg-blue-600/90 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-md shadow-md">
              Featured
            </span>
          </div>
        )}

        {/* Quick Action Links Overlay */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {githubRepoUrl && (
            <a
              href={githubRepoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/60 backdrop-blur-md transition-colors"
              title="GitHub Repository"
              onClick={(e) => e.stopPropagation()}
            >
              <GithubIcon size={15} />
            </a>
          )}
          {liveSiteUrl && (
            <a
              href={liveSiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/60 backdrop-blur-md transition-colors"
              title="Live Demo"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={15} />
            </a>
          )}
        </div>
      </div>

      {/* Card Info */}
      <div className="space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <h3 className="text-xl font-extrabold text-white group-hover:text-cyan-400 transition-colors">
            {title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-2">
            {shortDescription}
          </p>
        </div>

        {/* Tech Stack Pills (Matching Project Page.jpeg) */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {techStack.map((tech, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-[#16233d] border border-blue-900/60 text-[#38BDF8] text-xs font-semibold rounded-xl"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Full Width Button (Matching Project Page.jpeg) */}
        <div className="pt-2">
          <Link
            to={`/projects/${slug}`}
            className="w-full py-3 px-4 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-sm flex items-center justify-center transition-all shadow-lg shadow-blue-600/25 active:scale-[0.98]"
          >
            View Project
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;


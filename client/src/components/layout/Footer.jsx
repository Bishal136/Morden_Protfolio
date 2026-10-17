import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Mail, ArrowUp, Lock } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../common/SocialIcons';
import { useGetProfileQuery } from '../../features/profile/profileApiSlice';
import { selectIsAuthenticated } from '../../features/auth/authSlice';
import siteConfig from '../../config/siteConfig';

export const Footer = () => {
  const { data: profile } = useGetProfileQuery();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const name = profile?.name || siteConfig.name;
  const githubUrl = profile?.socialLinks?.github || siteConfig.socialLinks.github;
  const linkedinUrl = profile?.socialLinks?.linkedin || siteConfig.socialLinks.linkedin;
  const email = profile?.socialLinks?.email || siteConfig.socialLinks.email;
  const emailUrl = `mailto:${email}`;

  return (
    <footer className="w-full border-t border-slate-200 bg-slate-50/80 text-slate-600 py-14 px-4 sm:px-6 lg:px-8 mt-24">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Brand & Identity Info */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span className="font-extrabold text-slate-900 text-base tracking-tight font-mono">
              {name}
            </span>
            <span className="text-[11px] bg-sky-50 text-sky-700 border border-sky-200 px-2 py-0.5 rounded-full font-mono font-medium">
              v2.0
            </span>
          </div>
          <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
            {profile?.tagline || siteConfig.tagline}
          </p>
        </div>

        {/* Center: Social Links & Back to Top */}
        <div className="flex items-center gap-2.5">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-600 hover:text-sky-600 hover:border-sky-300 hover:bg-slate-50 transition-all focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
            aria-label="GitHub Profile (Bishal136)"
          >
            <GithubIcon size={18} />
          </a>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-600 hover:text-sky-600 hover:border-sky-300 hover:bg-slate-50 transition-all focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
            aria-label="LinkedIn Profile"
          >
            <LinkedinIcon size={18} />
          </a>
          <a
            href={emailUrl}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-600 hover:text-sky-600 hover:border-sky-300 hover:bg-slate-50 transition-all focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
            aria-label={`Send Email to ${email}`}
          >
            <Mail size={18} />
          </a>

          {/* Discreet Admin Lock Button */}
          <Link
            to={isAuthenticated ? '/admin' : '/admin/login'}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-400 hover:text-sky-600 hover:border-sky-300 hover:bg-slate-50 transition-all focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
            title={isAuthenticated ? 'Admin Dashboard' : 'Admin Portal'}
            aria-label={isAuthenticated ? 'Admin Dashboard' : 'Admin Portal'}
          >
            <Lock size={15} />
          </Link>

          {/* Scroll to Top */}
          <button
            onClick={scrollToTop}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 transition-all focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none ml-1"
            title="Scroll to top of page"
            aria-label="Scroll to top of page"
          >
            <ArrowUp size={16} />
          </button>
        </div>

        {/* Right: Copyright & Engineering Stack */}
        <div className="text-xs text-slate-500 text-center md:text-right space-y-1">
          <p>© {new Date().getFullYear()} Bishal Biswas. All rights reserved.</p>
          <p className="text-[11px] text-slate-400 font-mono">
            Engineered with React 19, RTK Query, Node.js & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

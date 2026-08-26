import { Mail, ArrowUp } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../common/SocialIcons';
import { useGetProfileQuery } from '../../features/profile/profileApiSlice';

export const Footer = () => {
  const { data: profile } = useGetProfileQuery();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const githubUrl = profile?.socialLinks?.github || 'https://github.com';
  const linkedinUrl = profile?.socialLinks?.linkedin || 'https://linkedin.com';
  const emailUrl = profile?.socialLinks?.email ? `mailto:${profile.socialLinks.email}` : 'mailto:bishal@example.com';

  return (
    <footer className="w-full border-t border-slate-800/80 bg-[#060910] text-slate-400 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Info */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-100 text-lg tracking-wider">
              {profile?.name || 'BISHAL BISWAS'}
            </span>
            <span className="text-xs bg-blue-950 text-blue-400 border border-blue-800/40 px-2 py-0.5 rounded-full font-mono">
              v1.0
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            {profile?.tagline || 'Crafting Robust Web Solutions with Core Logic Passion'}
          </p>
        </div>

        {/* Center: Social Links */}
        <div className="flex items-center gap-3">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:border-blue-500/50 hover:bg-slate-800 transition-all hover:scale-110"
            aria-label="GitHub Profile"
          >
            <GithubIcon size={18} />
          </a>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:border-blue-500/50 hover:bg-slate-800 transition-all hover:scale-110"
            aria-label="LinkedIn Profile"
          >
            <LinkedinIcon size={18} />
          </a>
          <a
            href={emailUrl}
            className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:border-blue-500/50 hover:bg-slate-800 transition-all hover:scale-110"
            aria-label="Email Me"
          >
            <Mail size={18} />
          </a>
          <button
            onClick={scrollToTop}
            className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-500/50 hover:bg-slate-800 transition-all hover:scale-110 ml-2"
            title="Back to top"
            aria-label="Back to top"
          >
            <ArrowUp size={18} />
          </button>
        </div>

        {/* Right: Copyright */}
        <div className="text-xs text-slate-500 text-center md:text-right">
          <p>© {new Date().getFullYear()} Bishal Biswas. All rights reserved.</p>
          <p className="mt-0.5 text-slate-600 flex items-center justify-center md:justify-end gap-1">
            Built with MERN, Redux Toolkit & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

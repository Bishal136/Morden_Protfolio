import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Download,
  Mail,
  Sparkles,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/common/SocialIcons';
import { useGetProfileQuery } from '../features/profile/profileApiSlice';
import { useGetSkillsQuery } from '../features/skills/skillsApiSlice';
import { useGetProjectsQuery } from '../features/projects/projectsApiSlice';
import SkillCard from '../components/common/SkillCard';
import ProjectCard from '../components/common/ProjectCard';

// Default skills matching the exact wireframe (Home page.jpeg)
const fallbackSkills = [
  { _id: 's1', name: 'React', icon: 'react', proficiency: 85, category: 'Frontend', order: 1 },
  { _id: 's2', name: 'Node.js', icon: 'node', proficiency: 90, category: 'Backend', order: 2 },
  { _id: 's3', name: 'Express', icon: 'express', proficiency: 80, category: 'Backend', order: 3 },
  { _id: 's4', name: 'MongoDB', icon: 'mongodb', proficiency: 85, category: 'Database', order: 4 },
  { _id: 's5', name: 'MySQL', icon: 'mysql', proficiency: 80, category: 'Database', order: 5 },
  { _id: 's6', name: 'C Programming', icon: 'c', proficiency: 75, category: 'Language', order: 6 },
];

export const Home = () => {
  const { data: profile } = useGetProfileQuery();
  const { data: skillsData, isError: isSkillsError } = useGetSkillsQuery();
  const { data: projectsData, isError: isProjectsError } = useGetProjectsQuery({
    featured: true,
  });

  const skills = isSkillsError ? fallbackSkills : (skillsData || []);
  const projects = isProjectsError ? [] : (projectsData || []);

  const sortedProjects = [...projects].sort((a, b) => {
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return timeB - timeA;
  });

  const defaultHeroAvatar = '/ME.jpg';
  const defaultAboutAvatar = '/ME.jpg';

  return (
    <div className="flex flex-col space-y-20 sm:space-y-28 pb-24">
      {/* 1. HERO SECTION (Matching Home page.jpeg) */}
      <section className="relative pt-8 sm:pt-14 lg:pt-20">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[380px] bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
                <Sparkles size={14} className="animate-pulse text-cyan-400" />
                <span>Available for Full-Time & Freelance Roles</span>
              </div>

              {/* Title & Name matching wireframe */}
              <div className="space-y-2">
                <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight leading-tight">
                  <span className="text-white block font-black">BISHAL</span>
                  <span className="text-[#38BDF8] block font-black">BISWAS</span>
                </h1>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-200 tracking-wide pt-1">
                  {profile?.title || 'Full-Stack MERN & C Developer'}
                </h2>
              </div>

              <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                {profile?.tagline ||
                  'Crafting Robust Web Solutions with Core Logic Passion'}
              </p>

              {/* Social Links & CTAs */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/projects"
                  className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
                >
                  <span>Explore Projects</span>
                  <ArrowRight size={16} />
                </Link>

                <Link
                  to="/contact"
                  className="px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm border border-slate-700/80 transition-all hover:scale-105 active:scale-95"
                >
                  Get In Touch
                </Link>

                {profile?.resumeUrl && (
                  <a
                    href={profile.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors flex items-center gap-1.5 text-sm"
                    title="Download Resume"
                  >
                    <Download size={16} />
                    <span>CV</span>
                  </a>
                )}
              </div>

              {/* Social Icons row */}
              <div className="pt-3 flex items-center justify-center lg:justify-start gap-3 text-slate-400">
                <a
                  href={profile?.socialLinks?.github || 'https://github.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:text-cyan-400 hover:border-cyan-500/40 transition-all"
                  aria-label="GitHub"
                >
                  <GithubIcon size={18} />
                </a>
                <a
                  href={profile?.socialLinks?.linkedin || 'https://linkedin.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:text-cyan-400 hover:border-cyan-500/40 transition-all"
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon size={18} />
                </a>
                <a
                  href={`mailto:${profile?.socialLinks?.email || 'bishalbiswas2026@gmail.com'}`}
                  className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:text-cyan-400 hover:border-cyan-500/40 transition-all"
                  aria-label="Email"
                >
                  <Mail size={18} />
                </a>
              </div>
            </div>

            {/* Right Hero Image with Neon Cyan Glow (Matching Wireframe) */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative">
                {/* Glowing border frame */}
                <div className="relative w-64 sm:w-80 aspect-[4/5] rounded-3xl overflow-hidden bg-slate-900 neon-glow-box">
                  <img
                    src={profile?.photoUrl || defaultHeroAvatar}
                    alt={profile?.name || 'Bishal Biswas'}
                    className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SKILLS & EXPERTISE SECTION (Matching Home page.jpeg) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-wider uppercase font-mono">
            SKILLS & EXPERTISE
          </h2>
          <div className="h-1 w-16 bg-cyan-400 mt-2 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
        </div>

        {/* Skills Grid - 6 cards matching mockup */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skills.map((skill) => (
            <SkillCard key={skill._id} skill={skill} />
          ))}
        </div>
      </section>

      {/* 3. ABOUT ME SECTION (Matching Home page.jpeg) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-wider uppercase font-mono">
            ABOUT ME
          </h2>
          <div className="h-1 w-16 bg-cyan-400 mt-2 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
        </div>

        <div className="bg-[#0b101c]/90 border border-slate-800/90 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: Glowing Circular Photo */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative">
                <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden neon-glow-circle">
                  <img
                    src={profile?.aboutPhotoUrl || profile?.photoUrl || defaultAboutAvatar}
                    alt={profile?.name || 'About Bishal Biswas'}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Right: Bio Text */}
            <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {profile?.aboutText ||
                  "I am a passionate Full-Stack MERN & C Developer dedicated to building scalable and user-centric web solutions. I find immense joy in the core logic of programming and the challenge of creating efficient, elegant code. My expertise spans the entire MERN stack, from frontend user experience to backend API design and database management. I love solving complex puzzles and am always looking to push the boundaries of what's possible with code. Let's build something amazing together!"}
              </p>

              {/* Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 size={16} className="text-cyan-400 shrink-0" />
                  <span>Full-Stack MERN Architecture</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 size={16} className="text-cyan-400 shrink-0" />
                  <span>State Management with Redux Toolkit</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 size={16} className="text-cyan-400 shrink-0" />
                  <span>Systems & Memory Mastery in C</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
                  <CheckCircle2 size={16} className="text-cyan-400 shrink-0" />
                  <span>REST API Design & DB Optimization</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED PROJECTS PREVIEW (Newest on top) */}
      {sortedProjects && sortedProjects.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-wider uppercase font-mono">
                FEATURED PROJECTS
              </h2>
              <div className="h-1 w-16 bg-cyan-400 mt-2 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            </div>

            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 border border-slate-800 text-xs font-semibold transition-all group"
            >
              <span>View All Projects</span>
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sortedProjects.slice(0, 4).map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        </section>
      )}

      {/* 5. CTA CONNECT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-gradient-to-r from-blue-950/30 via-slate-900 to-cyan-950/30 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Have a Project in Mind or an Opportunity?
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              I am open to discussing full-time engineering roles, high-impact consulting, or open-source collaborations.
            </p>
            <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/contact"
                className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
              >
                Send a Message
              </Link>
              <a
                href={profile?.socialLinks?.github || 'https://github.com'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm transition-all hover:scale-105"
              >
                Browse GitHub
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;


import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Download,
  Mail,
  ChevronRight,
  Cpu,
  Layers,
  Database,
  Terminal,
  Zap,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/common/SocialIcons';
import { useGetProfileQuery } from '../features/profile/profileApiSlice';
import { useGetSkillsQuery } from '../features/skills/skillsApiSlice';
import { useGetProjectsQuery } from '../features/projects/projectsApiSlice';
import SkillCard from '../components/common/SkillCard';
import ProjectCard from '../components/common/ProjectCard';
import { HeroSkeleton, SkillsBentoSkeleton, CardSkeleton } from '../components/common/Skeleton';
import useDocumentTitle from '../hooks/useDocumentTitle';
import siteConfig from '../config/siteConfig';

// Fallback categorized skills for the 4-Card Bento Grid
const fallbackBentoSkills = {
  frontend: [
    { _id: 'fs1', name: 'React.js', icon: 'react', proficiency: 'Core', category: 'Frontend' },
    { _id: 'fs2', name: 'Redux Toolkit', icon: 'redux', proficiency: 'Core', category: 'Frontend' },
    { _id: 'fs3', name: 'Tailwind CSS', icon: 'tailwind', proficiency: 'Production', category: 'Frontend' },
    { _id: 'fs4', name: 'JavaScript', icon: 'javascript', proficiency: 'Core', category: 'Frontend' },
  ],
  backend: [
    { _id: 'bs1', name: 'Node.js', icon: 'node', proficiency: 'Core', category: 'Backend' },
    { _id: 'bs2', name: 'Express.js', icon: 'express', proficiency: 'Core', category: 'Backend' },
    { _id: 'bs3', name: 'RESTful APIs', icon: 'code', proficiency: 'Production', category: 'Backend' },
    { _id: 'bs4', name: 'JWT & OAuth', icon: 'shield', proficiency: 'Production', category: 'Backend' },
  ],
  database: [
    { _id: 'ds1', name: 'MongoDB', icon: 'mongodb', proficiency: 'Core', category: 'Database' },
    { _id: 'ds2', name: 'MySQL', icon: 'mysql', proficiency: 'Production', category: 'Database' },
    { _id: 'ds3', name: 'Mongoose ODM', icon: 'mongodb', proficiency: 'Core', category: 'Database' },
    { _id: 'ds4', name: 'RTK Query Cache', icon: 'redux', proficiency: 'Core', category: 'Database' },
  ],
  systems: [
    { _id: 'ss1', name: 'C Programming', icon: 'c', proficiency: 'Core', category: 'Systems' },
    { _id: 'ss2', name: 'Git & GitHub', icon: 'git', proficiency: 'Production', category: 'Systems' },
    { _id: 'ss3', name: 'Memory & Valgrind', icon: 'c', proficiency: 'Core', category: 'Systems' },
    { _id: 'ss4', name: 'Linux / VPS CLI', icon: 'code', proficiency: 'Production', category: 'Systems' },
  ],
};

export const Home = () => {
  useDocumentTitle('Bishal Biswas | Full-Stack MERN & Systems (C) Developer');

  const { data: profile, isLoading: isProfileLoading } = useGetProfileQuery();
  const { data: skillsData, isLoading: isSkillsLoading } = useGetSkillsQuery();
  const { data: projectsData, isLoading: isProjectsLoading } = useGetProjectsQuery({
    featured: true,
  });

  const rawProjects = projectsData || [];
  const sortedProjects = [...rawProjects].sort((a, b) => {
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return timeB - timeA;
  });

  // Categorize dynamic skills into 4 Bento Boxes if available
  const bentoSkills = React.useMemo(() => {
    if (!skillsData || !Array.isArray(skillsData) || skillsData.length === 0) {
      return fallbackBentoSkills;
    }

    const categories = {
      frontend: [],
      backend: [],
      database: [],
      systems: [],
    };

    skillsData.forEach((skill) => {
      const cat = (skill.category || '').toLowerCase();
      const name = (skill.name || '').toLowerCase();

      if (cat.includes('front') || name.includes('react') || name.includes('tailwind') || name.includes('redux')) {
        categories.frontend.push(skill);
      } else if (cat.includes('back') || name.includes('node') || name.includes('express')) {
        categories.backend.push(skill);
      } else if (cat.includes('data') || name.includes('mongo') || name.includes('sql')) {
        categories.database.push(skill);
      } else {
        categories.systems.push(skill);
      }
    });

    // If any category is empty from DB, populate fallback items
    if (categories.frontend.length === 0) categories.frontend = fallbackBentoSkills.frontend;
    if (categories.backend.length === 0) categories.backend = fallbackBentoSkills.backend;
    if (categories.database.length === 0) categories.database = fallbackBentoSkills.database;
    if (categories.systems.length === 0) categories.systems = fallbackBentoSkills.systems;

    return categories;
  }, [skillsData]);

  const defaultHeroAvatar = '/ME.jpg';
  const resumeUrl = profile?.resumeUrl || siteConfig.resumeUrl;
  const githubUrl = profile?.socialLinks?.github || siteConfig.socialLinks.github;
  const linkedinUrl = profile?.socialLinks?.linkedin || siteConfig.socialLinks.linkedin;
  const email = profile?.socialLinks?.email || siteConfig.socialLinks.email;

  return (
    <div className="pt-28 md:pt-32 scroll-mt-28 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 md:space-y-32 pb-24">
      {/* 1. ASYMMETRIC 12-COLUMN HERO SECTION */}
      <section className="relative w-full" aria-label="Introduction and summary">
        {isProfileLoading ? (
          <HeroSkeleton />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* 7 Columns: Typography, Status Badge & CTAs */}
            <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
              {/* Title & Headline Hierarchy */}
              <div className="space-y-3">
                <p className="text-xs sm:text-sm font-mono uppercase tracking-widest text-sky-600 font-semibold">
                  Full-Stack Developer & Deployment Engineer
                </p>
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.08]">
                  Bishal <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-sky-500 to-indigo-600">Biswas</span>
                </h1>
              </div>

              {/* Core Philosophy Paragraph */}
              <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Full-Stack MERN Developer and Forward-Deployed Engineer architecting scalable applications with MongoDB, Express, React.js, Node.js, and Redux Toolkit, alongside hands-on experience deploying and integrating Large Language Models (LLMs).
              </p>

              {/* Action Buttons: 2 Clear CTAs */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <a
                  href="#featured"
                  className="px-6 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm tracking-tight flex items-center gap-2 shadow-lg shadow-sky-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
                >
                  <span>View Featured Work</span>
                  <ArrowRight size={16} />
                </a>

                {resumeUrl && (
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-200 hover:border-slate-300 shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
                  >
                    <Download size={16} />
                    <span>Download CV</span>
                  </a>
                )}
              </div>

              {/* Social Profiles Row */}
              <div className="pt-2 flex items-center justify-center lg:justify-start gap-3 text-slate-600">
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs hover:text-sky-600 hover:border-sky-300 hover:bg-slate-50 transition-all focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
                  aria-label="GitHub Profile"
                  title="GitHub (Bishal136)"
                >
                  <GithubIcon size={18} />
                </a>
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs hover:text-sky-600 hover:border-sky-300 hover:bg-slate-50 transition-all focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
                  aria-label="LinkedIn Profile"
                  title="LinkedIn"
                >
                  <LinkedinIcon size={18} />
                </a>
                <a
                  href={`mailto:${email}`}
                  className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-xs hover:text-sky-600 hover:border-sky-300 hover:bg-slate-50 transition-all focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
                  aria-label="Direct Email"
                  title="Send Email"
                >
                  <Mail size={18} />
                </a>
              </div>
            </div>

            {/* 5 Columns: Sleek Framed Developer Card */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-sm sm:max-w-md">
                {/* Framed Card Container */}
                <div className="relative rounded-3xl p-2 bg-white border border-slate-200 shadow-xl">
                  {/* Portrait Container */}
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100">
                    <img
                      src={profile?.photoUrl || defaultHeroAvatar}
                      alt={profile?.name || 'Bishal Biswas'}
                      className="w-full h-full object-cover object-center filter grayscale-[10%] hover:grayscale-0 transition-all duration-700"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 2. SKILLS & EXPERTISE: 4-CARD BENTO GRID WITHOUT SUBJECTIVE PERCENTAGES */}
      <section className="space-y-8" aria-label="Technical skills and expertise">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-sky-600">
            <Zap size={14} />
            <span>Technical Capabilities</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Skills & Architectural Proficiency
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl">
            Categorized by engineering tier (Core, Production, Familiar) across the entire stack. Click on any skill to inspect related projects.
          </p>
        </div>

        {isSkillsLoading ? (
          <SkillsBentoSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bento Card 1: Frontend Architecture */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xs hover:shadow-md hover:border-sky-300 transition-all">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
                  <Layers size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">Frontend Architecture</h3>
                  <p className="text-xs text-slate-500">Reactive component lifecycle, optimistic UI & design systems</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {bentoSkills.frontend.map((skill) => (
                  <SkillCard key={skill._id} skill={skill} />
                ))}
              </div>
            </div>

            {/* Bento Card 2: Backend & APIs */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <Terminal size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">Backend & APIs</h3>
                  <p className="text-xs text-slate-500">RESTful design, authentication hardening & middleware pipelines</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {bentoSkills.backend.map((skill) => (
                  <SkillCard key={skill._id} skill={skill} />
                ))}
              </div>
            </div>

            {/* Bento Card 3: Databases & State */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                  <Database size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">Databases & State</h3>
                  <p className="text-xs text-slate-500">Document indexing, relational integrity & cache invalidation</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {bentoSkills.database.map((skill) => (
                  <SkillCard key={skill._id} skill={skill} />
                ))}
              </div>
            </div>

            {/* Bento Card 4: Systems & Tooling */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xs hover:shadow-md hover:border-purple-300 transition-all">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
                  <Cpu size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">Systems & Tooling</h3>
                  <p className="text-xs text-slate-500">Low-level memory management, Linux systems & build workflows</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {bentoSkills.systems.map((skill) => (
                  <SkillCard key={skill._id} skill={skill} />
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 3. FEATURED PROJECTS CASE STUDY SECTION */}
      <section id="featured" className="space-y-8 scroll-mt-28" aria-label="Featured case studies">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-sky-600">
              <Layers size={14} />
              <span>Selected Work</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Case Studies
            </h2>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl">
              Deep-dive engineering projects demonstrating end-to-end full-stack development, control panel dashboards, and systems logic.
            </p>
          </div>

          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-300 shadow-xs text-xs font-semibold transition-all group shrink-0 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
          >
            <span>Explore All Projects</span>
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isProjectsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sortedProjects.slice(0, 4).map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </section>

      {/* 4. CONNECT & COLLABORATE CTA */}
      <section className="w-full" aria-label="Call to action">
        <div className="bg-gradient-to-br from-slate-50 via-white to-sky-50/50 border border-slate-200 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-md">
          <div className="max-w-xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Have an Engineering Role or Challenge?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              I am open to full-time developer positions, high-impact consulting, or systems-level collaboration. Let's discuss how I can add immediate value to your engineering team.
            </p>
            <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/contact"
                className="px-6 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm shadow-lg shadow-sky-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
              >
                Send Direct Message
              </Link>
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 hover:border-slate-300 font-semibold text-sm transition-all hover:scale-[1.02] shadow-xs focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
              >
                Browse GitHub (Bishal136)
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

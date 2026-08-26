import React, { useState, useMemo } from 'react';
import { Layers, Search, Filter } from 'lucide-react';
import { useGetProjectsQuery } from '../features/projects/projectsApiSlice';
import ProjectCard from '../components/common/ProjectCard';
import { CardSkeleton } from '../components/common/Skeleton';

// Fallback projects matching wireframe (Project Page.jpeg)
const fallbackProjects = [
  {
    _id: 'p1',
    title: 'MERN E-commerce',
    slug: 'mern-e-commerce-store',
    shortDescription:
      'Full-stack platform with cart, user accounts, and secure payment integration.',
    coverImageUrl:
      'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=1200&q=80',
    techStack: ['React', 'MongoDB', 'Node.js', 'Express'],
    liveSiteUrl: 'https://shop-mern-demo.com',
    githubRepoUrl: 'https://github.com/example/mern-ecommerce',
    isFeatured: true,
  },
  {
    _id: 'p2',
    title: 'Task Manager with MySQL',
    slug: 'task-manager-with-mysql',
    shortDescription:
      'A collaborative Kanban tool for teams, built on a robust relational database.',
    coverImageUrl:
      'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?auto=format&fit=crop&w=1200&q=80',
    techStack: ['React', 'MySQL', 'Node.js', 'Redis'],
    liveSiteUrl: 'https://kanban-demo.example.com',
    githubRepoUrl: 'https://github.com/example/task-manager',
    isFeatured: true,
  },
  {
    _id: 'p3',
    title: 'C Language File Utility',
    slug: 'c-language-file-utility',
    shortDescription:
      'A command-line tool for advanced file encryption, compression, and analysis.',
    coverImageUrl:
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    techStack: ['C', 'System Programming', 'CLI'],
    liveSiteUrl: '',
    githubRepoUrl: 'https://github.com/example/c-memory-utility',
    isFeatured: true,
  },
  {
    _id: 'p4',
    title: 'Weather Dashboard',
    slug: 'weather-dashboard',
    shortDescription:
      'A responsive web application displaying real-time weather data and forecasts using APIs.',
    coverImageUrl:
      'https://images.unsplash.com/photo-1592210454359-9043f067919b?auto=format&fit=crop&w=1200&q=80',
    techStack: ['Vue.js', 'Weather API', 'HTML/CSS'],
    liveSiteUrl: 'https://weather-demo.example.com',
    githubRepoUrl: 'https://github.com/example/weather-dashboard',
    isFeatured: false,
  },
];

export const Projects = () => {
  const [selectedTag, setSelectedTag] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const { data: serverProjects, isLoading, isError } = useGetProjectsQuery();

  const projects = isError ? fallbackProjects : (serverProjects || []);

  // Extract all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set(['All']);
    projects.forEach((p) => {
      if (Array.isArray(p.techStack)) {
        p.techStack.forEach((t) => tagSet.add(t));
      }
    });
    return Array.from(tagSet);
  }, [projects]);

  // Filter projects by tag and search term (newest first)
  const filteredProjects = useMemo(() => {
    return [...projects]
      .sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      })
      .filter((project) => {
        const matchesTag =
          selectedTag === 'All' ||
          (Array.isArray(project.techStack) &&
            project.techStack.some(
              (t) => t.toLowerCase() === selectedTag.toLowerCase()
            ));
        const matchesSearch =
          searchTerm === '' ||
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (Array.isArray(project.techStack) &&
            project.techStack.some((t) =>
              t.toLowerCase().includes(searchTerm.toLowerCase())
            ));
        return matchesTag && matchesSearch;
      });
  }, [projects, selectedTag, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-950/60 border border-blue-800/40 text-blue-400 text-xs font-semibold uppercase tracking-wider">
          <Layers size={14} />
          <span>Portfolio Catalog</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          ALL PROJECTS
        </h1>
        <p className="text-slate-400 text-base sm:text-lg">
          Explore real-world full-stack applications, distributed tools, and low-level system software.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            placeholder="Search projects or tech..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Tag Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-xs font-semibold text-slate-500 uppercase mr-1 hidden sm:inline flex items-center gap-1">
            <Filter size={12} /> Filter:
          </span>
          {allTags.slice(0, 8).map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedTag === tag
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-700/80'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : isError ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-red-900/30 p-6">
          <p className="text-red-400 font-semibold">Failed to load projects from server.</p>
          <p className="text-xs text-slate-500 mt-1">Please ensure the backend API is online.</p>
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-900/30 rounded-3xl border border-slate-800/60 p-8 space-y-3">
          <p className="text-lg font-bold text-slate-300">No projects match your filter</p>
          <p className="text-sm text-slate-500">
            Try searching for a different keyword or reset the category filter.
          </p>
          <button
            onClick={() => {
              setSelectedTag('All');
              setSearchTerm('');
            }}
            className="px-4 py-2 bg-blue-600/80 hover:bg-blue-600 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Projects;

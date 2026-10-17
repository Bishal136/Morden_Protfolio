import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import { useGetProjectsQuery } from '../features/projects/projectsApiSlice';
import ProjectCard from '../components/common/ProjectCard';
import { CardSkeleton } from '../components/common/Skeleton';
import { normalizeTag, normalizeTags } from '../utils/tagNormalizer';
import useDocumentTitle from '../hooks/useDocumentTitle';

export const Projects = () => {
  useDocumentTitle('Projects | Bishal Biswas — Full-Stack MERN Developer');

  const [searchParams, setSearchParams] = useSearchParams();
  const urlTag = searchParams.get('tag');
  const selectedTag = urlTag ? normalizeTag(urlTag) : 'All';
  const [searchTerm, setSearchTerm] = useState('');
  const { data: serverProjects, isLoading } = useGetProjectsQuery();

  // Safely extract projects from server without demo fallbacks
  const projects = useMemo(() => {
    return Array.isArray(serverProjects) ? serverProjects : [];
  }, [serverProjects]);

  // Extract canonical, case-insensitive deduplicated filter tags
  const allTags = useMemo(() => {
    const rawTags = [];
    projects.forEach((p) => {
      if (Array.isArray(p.techStack)) {
        rawTags.push(...p.techStack);
      }
    });

    // Normalize and deduplicate tags
    const normalized = normalizeTags(rawTags);

    // Preferred primary tags in order
    const priority = [
      'React.js',
      'Node.js',
      'Express.js',
      'MongoDB',
      'Redux Toolkit',
      'Tailwind CSS',
      'C',
      'MySQL',
      'JavaScript',
      'Stripe',
    ];

    const sortedTags = [
      ...priority.filter((t) => normalized.includes(t)),
      ...normalized.filter((t) => !priority.includes(t)),
    ];

    return ['All', ...sortedTags];
  }, [projects]);

  // Handle Tag Selection
  const handleSelectTag = (tag) => {
    if (tag === 'All') {
      searchParams.delete('tag');
    } else {
      searchParams.set('tag', tag);
    }
    setSearchParams(searchParams);
  };

  // Filter projects by tag and search query (newest first)
  const filteredProjects = useMemo(() => {
    return [...projects]
      .sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      })
      .filter((project) => {
        const normalizedProjectTags = normalizeTags(project.techStack || []);

        const matchesTag =
          selectedTag === 'All' ||
          normalizedProjectTags.some(
            (t) => t.toLowerCase() === selectedTag.toLowerCase()
          );

        const query = searchTerm.toLowerCase().trim();
        const matchesSearch =
          query === '' ||
          project.title.toLowerCase().includes(query) ||
          project.shortDescription.toLowerCase().includes(query) ||
          normalizedProjectTags.some((t) => t.toLowerCase().includes(query));

        return matchesTag && matchesSearch;
      });
  }, [projects, selectedTag, searchTerm]);

  return (
    <div className="pt-28 md:pt-32 scroll-mt-28 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-24">
      {/* Header Container */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-mono font-semibold uppercase tracking-widest text-sky-600 block">
          Portfolio & Case Studies
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Engineering Case Studies
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-lg mx-auto">
          Explore complete full-stack web applications, IoT cut-off systems, and production database solutions.
        </p>
      </div>

      {/* Filter and Search Bar Container */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white border border-slate-200 p-4 rounded-3xl shadow-xs">
        {/* Search Input Field */}
        <div className="relative w-full md:w-80">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search by title, feature, or tech..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-sky-500 focus-visible:ring-2 focus-visible:ring-sky-500/20 focus-visible:outline-none transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              aria-label="Clear search input"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Canonical Deduplicated Tag Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-xs font-mono font-semibold text-slate-500 uppercase mr-1 hidden sm:inline-flex items-center gap-1 shrink-0">
            <Filter size={12} /> Filter:
          </span>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleSelectTag(tag)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none ${
                selectedTag.toLowerCase() === tag.toLowerCase()
                  ? 'bg-sky-500 text-white shadow-xs font-bold'
                  : 'bg-slate-50 text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid Container */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 space-y-3 shadow-xs">
          <p className="text-base font-bold text-slate-900">No projects match the current filter</p>
          <p className="text-xs sm:text-sm text-slate-500">
            No projects matched tag "{selectedTag}" and query "{searchTerm}".
          </p>
          <button
            onClick={() => {
              handleSelectTag('All');
              setSearchTerm('');
            }}
            className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Projects;

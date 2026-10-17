import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  User,
  ShieldCheck,
  CreditCard,
  Layout,
  ShoppingBag,
  Cpu,
  Layers,
  CheckCircle2,
  Send,
  MessageSquare,
  Terminal,
  Play,
  Image as ImageIcon,
  Maximize2,
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { GithubIcon } from '../components/common/SocialIcons';
import { useGetProjectBySlugQuery } from '../features/projects/projectsApiSlice';
import {
  useGetCommentsByProjectQuery,
  useAddCommentMutation,
} from '../features/comments/commentsApiSlice';
import { getSkillIcon } from '../utils/skillIcons';
import VideoPlayer from '../components/common/VideoPlayer';
import { normalizeTags } from '../utils/tagNormalizer';
import useDocumentTitle from '../hooks/useDocumentTitle';


const getFeatureIcon = (iconName) => {
  const lower = (iconName || '').toLowerCase();
  if (lower.includes('auth') || lower.includes('shield') || lower.includes('lock'))
    return <ShieldCheck size={18} className="text-sky-400" />;
  if (lower.includes('pay') || lower.includes('credit') || lower.includes('stripe'))
    return <CreditCard size={18} className="text-sky-400" />;
  if (lower.includes('admin') || lower.includes('dashboard') || lower.includes('chart') || lower.includes('layout'))
    return <Layout size={18} className="text-sky-400" />;
  if (lower.includes('catalog') || lower.includes('product') || lower.includes('shopping'))
    return <ShoppingBag size={18} className="text-sky-400" />;
  if (lower.includes('cpu') || lower.includes('memory') || lower.includes('c'))
    return <Cpu size={18} className="text-sky-400" />;
  return <CheckCircle2 size={18} className="text-sky-400" />;
};

export const ProjectDetails = () => {
  const { slug } = useParams();
  const { data: serverProject, isLoading, isError } = useGetProjectBySlugQuery(slug);

  const project = serverProject;

  useDocumentTitle(project?.title ? `${project.title} — Case Study` : 'Project Case Study');

  // Comments state
  const { data: serverComments } = useGetCommentsByProjectQuery(slug, {
    skip: !slug,
  });
  const [addComment, { isLoading: isPostingComment }] = useAddCommentMutation();

  const [localComments, setLocalComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentSuccessMsg, setCommentSuccessMsg] = useState('');

  // Aggregate all unique non-empty images
  const allImages = React.useMemo(() => {
    const rawList = [
      project?.coverImageUrl,
      ...(Array.isArray(project?.images) ? project.images : []),
    ];
    return Array.from(
      new Set(
        rawList
          .map((url) => (typeof url === 'string' ? url.trim() : ''))
          .filter(Boolean)
      )
    );
  }, [project]);

  // Aggregate all unique non-empty videos
  const allVideos = React.useMemo(() => {
    const rawList = [
      project?.demoVideoUrl,
      ...(Array.isArray(project?.videos) ? project.videos : []),
    ];
    return Array.from(
      new Set(
        rawList
          .map((url) => (typeof url === 'string' ? url.trim() : ''))
          .filter(Boolean)
      )
    );
  }, [project]);

  // Combined playlist of all media items
  const mediaList = React.useMemo(() => {
    const items = [];
    allVideos.forEach((url, idx) => {
      items.push({
        id: `vid-${idx}`,
        type: 'video',
        url,
        title: allVideos.length > 1 ? `Walkthrough Video ${idx + 1}` : 'Walkthrough Video',
        badge: 'Video',
        videoIndex: idx,
      });
    });
    allImages.forEach((url, idx) => {
      items.push({
        id: `img-${idx}`,
        type: 'image',
        url,
        title: allImages.length > 1 ? `Screenshot ${idx + 1}` : 'Architecture & UI Screenshot',
        badge: 'Image',
        imageIndex: idx,
      });
    });
    return items;
  }, [allVideos, allImages]);

  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Ensure activeMediaIndex stays within valid bounds if mediaList changes
  const safeMediaIndex =
    mediaList.length > 0 ? Math.min(activeMediaIndex, mediaList.length - 1) : 0;
  const currentMedia = mediaList[safeMediaIndex] || null;

  const handlePrevMedia = () => {
    if (mediaList.length <= 1) return;
    setActiveMediaIndex((prev) => (prev > 0 ? prev - 1 : mediaList.length - 1));
  };

  const handleNextMedia = () => {
    if (mediaList.length <= 1) return;
    setActiveMediaIndex((prev) => (prev < mediaList.length - 1 ? prev + 1 : 0));
  };

  const openLightboxAtImage = (indexOrUrl) => {
    if (typeof indexOrUrl === 'number') {
      setLightboxIndex(indexOrUrl);
    } else if (typeof indexOrUrl === 'string') {
      const idx = allImages.findIndex((img) => img === indexOrUrl);
      setLightboxIndex(idx !== -1 ? idx : 0);
    } else {
      setLightboxIndex(0);
    }
  };

  const handlePrevLightbox = (e) => {
    e?.stopPropagation();
    if (allImages.length <= 1) return;
    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
  };

  const handleNextLightbox = (e) => {
    e?.stopPropagation();
    if (allImages.length <= 1) return;
    setLightboxIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
  };

  // Lock scroll and handle Escape / Arrow keys for fullscreen lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev > 0 ? prev - 1 : allImages.length - 1));
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev < allImages.length - 1 ? prev + 1 : 0));
      }
    };
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxIndex, allImages.length]);

  const commentsList = Array.isArray(serverComments) ? serverComments : [];
  const displayComments = [...localComments, ...commentsList];

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      _id: Date.now().toString(),
      name: commentAuthor.trim() || 'Engineering Peer',
      role: 'Developer Peer',
      text: commentText.trim(),
      createdAt: new Date().toISOString(),
    };

    setLocalComments([newComment, ...localComments]);
    setCommentText('');
    setCommentAuthor('');
    setCommentSuccessMsg('Feedback posted successfully!');
    setTimeout(() => setCommentSuccessMsg(''), 4000);

    try {
      await addComment({
        projectIdOrSlug: slug,
        name: newComment.name,
        role: newComment.role,
        text: newComment.text,
      }).unwrap();
    } catch {
      // Graceful optimistic state
    }
  };

  if (isLoading) {
    return (
      <div className="pt-28 md:pt-32 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="h-6 w-32 bg-slate-200 rounded-md animate-pulse" />
        <div className="h-96 w-full bg-slate-100 rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="pt-28 md:pt-32 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 mx-auto font-mono text-xl font-bold">
          404
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">Project Not Found</h1>
        <p className="text-slate-600 text-sm">
          The requested engineering case study does not exist or may have been updated.
        </p>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
        >
          <ArrowLeft size={16} />
          <span>Browse All Projects</span>
        </Link>
      </div>
    );
  }

  const normalizedTechStack = normalizeTags(project?.techStack || []);

  return (
    <div className="pt-28 md:pt-32 scroll-mt-28 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 pb-24">
      {/* Back Navigation Bar */}
      <div>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-slate-500 hover:text-sky-600 transition-colors focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none rounded-lg p-1"
        >
          <ArrowLeft size={15} />
          <span>Back to Projects Catalog</span>
        </Link>
      </div>

      {/* Case Study Header & Outcome */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-mono font-medium">
          <Layers size={13} />
          <span>Architecture Deep Dive</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {project.title}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          {project.fullDescription || project.shortDescription}
        </p>
      </div>

      {/* 1. TOP SECTION: WALKTHROUGH DEMO + ARCHITECTURE OVERVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left: Interactive Multi-Media Showcase in 16:10 Browser Frame */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 flex flex-col justify-between space-y-4 shadow-xs">
          {/* Mock Browser Header with Window Controls & Media Type Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
              </div>
              <span className="text-[11px] text-slate-500 pl-2 font-mono hidden sm:inline">
                {project.slug || 'project'}.dev/demo
              </span>
            </div>

            {/* Media Type Switcher & Fullscreen Action */}
            <div className="flex items-center gap-2">
              {allVideos.length > 0 && allImages.length > 0 && (
                <div className="inline-flex rounded-lg p-0.5 bg-slate-100 border border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => {
                      const firstVideoIndex = mediaList.findIndex((m) => m.type === 'video');
                      if (firstVideoIndex !== -1) setActiveMediaIndex(firstVideoIndex);
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                      currentMedia?.type === 'video'
                        ? 'bg-white text-slate-900 font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Play size={11} className={currentMedia?.type === 'video' ? 'fill-slate-900' : ''} />
                    <span>Videos ({allVideos.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const firstImgIndex = mediaList.findIndex((m) => m.type === 'image');
                      if (firstImgIndex !== -1) setActiveMediaIndex(firstImgIndex);
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                      currentMedia?.type === 'image'
                        ? 'bg-white text-slate-900 font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ImageIcon size={11} />
                    <span>Screenshots ({allImages.length})</span>
                  </button>
                </div>
              )}

              {/* Status pill if only one media type exists */}
              {!(allVideos.length > 0 && allImages.length > 0) && (
                <span className="text-[11px] text-slate-600 font-mono px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">
                  {allVideos.length > 0
                    ? `Walkthrough (${allVideos.length})`
                    : allImages.length > 0
                      ? `Screenshots (${allImages.length})`
                      : 'Technical Asset'}
                </span>
              )}

              {/* Fullscreen / Inspect Lightbox Button */}
              {allImages.length > 0 && (
                <button
                  type="button"
                  onClick={() => openLightboxAtImage(currentMedia?.imageIndex ?? 0)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                  title="Inspect Fullscreen Image"
                  aria-label="Inspect Fullscreen Image"
                >
                  <Maximize2 size={13} />
                </button>
              )}
            </div>
          </div>

          {/* Media Viewport Stage with Prev/Next Overlay Arrows */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 shadow-inner group">
            {currentMedia?.type === 'video' ? (
              <VideoPlayer
                videoUrl={currentMedia.url}
                fallbackImageUrl={allImages[0] || project.coverImageUrl}
                title={currentMedia.title}
                onExpandImage={() => openLightboxAtImage(0)}
              />
            ) : currentMedia?.type === 'image' ? (
              <div
                onClick={() => openLightboxAtImage(currentMedia.imageIndex ?? 0)}
                className="relative w-full h-full cursor-pointer overflow-hidden group/img"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightboxAtImage(currentMedia.imageIndex ?? 0);
                  }
                }}
                aria-label={`Enlarge high-resolution screenshot for ${project.title}`}
              >
                <img
                  src={currentMedia.url}
                  alt={`Architecture and UI preview of ${project.title}`}
                  className="w-full h-full object-cover object-top group-hover/img:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-slate-950/20 group-hover/img:bg-slate-950/40 transition-colors flex items-center justify-center">
                  <div className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-white/20 text-slate-100 flex items-center gap-2 text-xs font-mono font-semibold shadow-xl group-hover/img:scale-105 group-hover/img:border-sky-400/50 group-hover/img:text-sky-300 transition-all opacity-0 group-hover/img:opacity-100">
                    <ZoomIn size={15} className="text-sky-400" />
                    <span>Click to Inspect Fullscreen</span>
                  </div>
                </div>

                {/* Badge on top-left of image */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/70 backdrop-blur-md border border-white/10 text-white text-[11px] font-mono flex items-center gap-1.5 pointer-events-none">
                  <ImageIcon size={12} className="text-sky-400" />
                  <span>
                    Screenshot {(currentMedia.imageIndex ?? 0) + 1} of {allImages.length}
                  </span>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-xs font-mono space-y-2 p-6 text-center">
                <Layers size={24} className="text-slate-400" />
                <span>Visual Architecture Asset Available on Request</span>
              </div>
            )}

            {/* Viewport Prev / Next Navigation Arrows */}
            {mediaList.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrevMedia();
                  }}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-slate-200 hover:text-white border border-white/20 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110"
                  title="Previous asset"
                  aria-label="Previous media asset"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNextMedia();
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-slate-200 hover:text-white border border-white/20 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110"
                  title="Next asset"
                  aria-label="Next media asset"
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}
          </div>

          {/* Interactive Thumbnail Carousel / Strip */}
          {mediaList.length > 1 && (
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 px-1">
                <span>
                  Showing Asset {safeMediaIndex + 1} of {mediaList.length}
                </span>
                <span className="hidden sm:inline">Click thumbnail to switch view</span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 px-0.5 scrollbar-thin">
                {mediaList.map((item, idx) => {
                  const isActive = idx === safeMediaIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveMediaIndex(idx)}
                      className={`relative shrink-0 w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden border text-left transition-all group/thumb ${
                        isActive
                          ? 'ring-2 ring-sky-500 border-sky-400 shadow-sm scale-102'
                          : 'border-slate-200 hover:border-slate-300 opacity-75 hover:opacity-100'
                      }`}
                      title={item.title}
                    >
                      {item.type === 'video' ? (
                        <div className="w-full h-full bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 flex flex-col items-center justify-center p-1 relative">
                          <div className="p-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                            <Play size={12} className="fill-amber-300" />
                          </div>
                          <span className="text-[9px] font-mono text-amber-200/90 mt-1 truncate max-w-full font-semibold">
                            {allVideos.length > 1 ? `Video ${item.videoIndex + 1}` : 'Video'}
                          </span>
                        </div>
                      ) : (
                        <div className="w-full h-full relative">
                          <img
                            src={item.url}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-slate-900/10 group-hover/thumb:bg-transparent transition-colors" />
                          <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-slate-950/70 text-slate-200 text-[8px] font-mono font-medium">
                            {allImages.length > 1 ? `#${item.imageIndex + 1}` : 'UI'}
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right: Architecture Overview Specification Card */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 flex flex-col justify-between space-y-6 shadow-xs">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Terminal size={18} className="text-sky-600" />
              <span>Project Specifications</span>
            </h2>

            {/* Metadata Rows */}
            <div className="space-y-3.5 text-xs sm:text-sm pt-2">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 flex items-center gap-2">
                  <User size={14} className="text-sky-600" /> Engineering Role:
                </span>
                <span className="font-semibold text-slate-800">
                  {project.role || 'Lead Developer'}
                </span>
              </div>

              {project.duration && (
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500 flex items-center gap-2">
                    <Calendar size={14} className="text-sky-600" /> Timeline:
                  </span>
                  <span className="font-semibold text-slate-800">{project.duration}</span>
                </div>
              )}

              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 flex items-center gap-2">
                  <ExternalLink size={14} className="text-sky-600" /> Live Demo:
                </span>
                {project.liveSiteUrl ? (
                  <a
                    href={project.liveSiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 hover:text-sky-700 font-semibold underline truncate max-w-[200px]"
                  >
                    {project.liveSiteUrl.replace('https://', '')}
                  </a>
                ) : (
                  <span className="text-slate-400 font-mono text-xs">Private deployment</span>
                )}
              </div>

              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 flex items-center gap-2">
                  <GithubIcon size={14} className="text-sky-600" /> Repository:
                </span>
                {project.githubRepoUrl ? (
                  <a
                    href={project.githubRepoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 hover:text-sky-700 font-semibold underline"
                  >
                    GitHub Source
                  </a>
                ) : (
                  <span className="text-slate-400 font-mono text-xs">Internal code</span>
                )}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
            {project.liveSiteUrl && (
              <a
                href={project.liveSiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs tracking-tight flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <span>Launch Live Site</span>
                <ExternalLink size={13} />
              </a>
            )}
            {project.githubRepoUrl && (
              <a
                href={project.githubRepoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-sky-300 text-slate-700 hover:text-slate-900 transition-colors"
                title="View GitHub Repository"
                aria-label="View GitHub Repository"
              >
                <GithubIcon size={16} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* 2. MIDDLE SECTION: ARCHITECTURAL FEATURES & CANONICAL TECH STACK */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Features & Capabilities (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6 shadow-xs">
          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight font-mono uppercase text-sky-600">
              Key Capabilities & Features
            </h2>
            <p className="text-xs text-slate-500">
              Architectural components engineered into this platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.features && project.features.length > 0 ? (
              project.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1.5"
                >
                  <div className="flex items-center gap-2.5">
                    {getFeatureIcon(feature.icon || feature.title)}
                    <h3 className="font-bold text-slate-900 text-sm">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-7">
                    {feature.description}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">Feature specifications available upon request.</p>
            )}
          </div>

          {/* Key Technical Challenges Solved (if available or fallback) */}
          {project.challenges && project.challenges.length > 0 && (
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <h3 className="text-sm font-bold text-sky-600 font-mono uppercase tracking-wider">
                Technical Challenges Solved
              </h3>
              <div className="space-y-3">
                {project.challenges.map((c, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-1">
                    <span className="font-bold text-xs text-slate-900 block">{c.title}</span>
                    <span className="text-xs text-slate-600 leading-relaxed block">{c.solution}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Canonical Tech Stack Badges (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 space-y-5 shadow-xs">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-sky-600 font-mono uppercase">
              Tech Stack Architecture
            </h3>
            <p className="text-xs text-slate-500">
              Core technologies and libraries.
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            {normalizedTechStack.map((tech, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <div className="shrink-0">{getSkillIcon(tech, 16)}</div>
                  <span>{tech}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 uppercase">Module</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. BOTTOM SECTION: CLIENT & PEER COMMENTS */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-6 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <MessageSquare size={18} className="text-sky-600" />
              <span>Client & Peer Engineering Feedback</span>
            </h2>
            <p className="text-xs text-slate-500">
              Public commentary from collaborating engineers and reviewers.
            </p>
          </div>
          <span className="text-xs font-mono text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200 font-medium">
            {displayComments.length} {displayComments.length === 1 ? 'Comment' : 'Comments'}
          </span>
        </div>

        {commentSuccessMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600" />
            <span>{commentSuccessMsg}</span>
          </div>
        )}

        {/* Comments List */}
        {displayComments.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500 font-mono">
            No public feedback yet. Be the first peer or reviewer to leave a note below.
          </div>
        ) : (
          <div className="space-y-4 divide-y divide-slate-100">
            {displayComments.map((comment) => (
              <div key={comment._id} className="pt-4 first:pt-0 flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-full bg-sky-50 border border-sky-200 flex items-center justify-center text-xs font-bold text-sky-700 shrink-0 font-mono">
                  {(comment.name || 'P').charAt(0).toUpperCase()}
                </div>

                <div className="space-y-1 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-slate-900 text-xs sm:text-sm">
                      {comment.name}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      · {comment.role || 'Developer Peer'}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {comment.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Comment Submission Form */}
        <form onSubmit={handleCommentSubmit} className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Your Name (e.g. Alex Rivera)"
              value={commentAuthor}
              onChange={(e) => setCommentAuthor(e.target.value)}
              className="sm:w-64 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
            />
            <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus-within:bg-white focus-within:border-sky-500">
              <input
                type="text"
                placeholder="Add engineering feedback or comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                required
                className="flex-1 bg-transparent text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isPostingComment || !commentText.trim()}
                className="px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm shrink-0"
              >
                <span>{isPostingComment ? 'Posting...' : 'Post'}</span>
                <Send size={12} />
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {lightboxIndex !== null && allImages[lightboxIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} High-Resolution Preview`}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-200"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="relative max-w-6xl w-full max-h-[92vh] flex flex-col bg-slate-900/95 border border-white/15 rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Header Bar */}
            <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-white/10 bg-slate-950/60 text-xs font-mono">
              <div className="flex items-center gap-2.5 truncate max-w-[80%]">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                <span className="font-bold text-slate-200 truncate">{project.title}</span>
                <span className="text-slate-400 font-normal">
                  · Screenshot {lightboxIndex + 1} of {allImages.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={allImages[lightboxIndex]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                  title="Open original image in new tab"
                >
                  <ExternalLink size={12} />
                  <span className="hidden sm:inline">Open Raw</span>
                </a>
                <button
                  type="button"
                  onClick={() => setLightboxIndex(null)}
                  className="p-1.5 rounded-lg bg-white/[0.06] hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition-colors"
                  title="Close (Esc)"
                  aria-label="Close Lightbox"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Lightbox Image Stage with Prev / Next Navigation */}
            <div className="relative p-3 sm:p-6 overflow-auto flex items-center justify-center bg-slate-950/50 min-h-[50vh] flex-1">
              {allImages.length > 1 && (
                <button
                  type="button"
                  onClick={handlePrevLightbox}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-slate-200 hover:text-white border border-white/20 backdrop-blur-md shadow-2xl hover:scale-110 transition-all"
                  title="Previous Image (Left Arrow)"
                  aria-label="Previous Image"
                >
                  <ChevronLeft size={20} />
                </button>
              )}

              <img
                src={allImages[lightboxIndex]}
                alt={`${project.title} screenshot ${lightboxIndex + 1}`}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-xl shadow-2xl border border-white/[0.08]"
              />

              {allImages.length > 1 && (
                <button
                  type="button"
                  onClick={handleNextLightbox}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-slate-200 hover:text-white border border-white/20 backdrop-blur-md shadow-2xl hover:scale-110 transition-all"
                  title="Next Image (Right Arrow)"
                  aria-label="Next Image"
                >
                  <ChevronRight size={20} />
                </button>
              )}
            </div>

            {/* Lightbox Footer & Thumbnail Strip */}
            <div className="px-5 sm:px-6 py-2.5 border-t border-white/10 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
              {allImages.length > 1 ? (
                <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setLightboxIndex(i)}
                      className={`shrink-0 w-10 h-8 rounded-lg overflow-hidden border transition-all ${
                        i === lightboxIndex
                          ? 'ring-2 ring-sky-400 border-sky-400 scale-105'
                          : 'border-white/15 opacity-60 hover:opacity-100'
                      }`}
                      title={`Go to screenshot ${i + 1}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              ) : (
                <span>{project.role || 'Full-Stack Developer'} · Architecture & UI Showcase</span>
              )}
              <span className="text-slate-500 shrink-0">
                Use ← → arrows to navigate · ESC to dismiss
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;

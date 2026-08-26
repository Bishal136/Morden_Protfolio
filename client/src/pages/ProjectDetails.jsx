import React, { useState } from 'react';
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
  Play,
} from 'lucide-react';
import { GithubIcon } from '../components/common/SocialIcons';
import { useGetProjectBySlugQuery } from '../features/projects/projectsApiSlice';
import {
  useGetCommentsByProjectQuery,
  useAddCommentMutation,
} from '../features/comments/commentsApiSlice';
import { getSkillIcon } from '../components/common/SkillCard';
import VideoPlayer from '../components/common/VideoPlayer';

// Fallback project details matching wireframe (Project Details page.jpeg)
const fallbackProjectDetails = {
  'mern-e-commerce-store': {
    title: 'MERN E-commerce Store',
    slug: 'mern-e-commerce-store',
    shortDescription:
      'MERN E-commerce Store is a comprehensive platform for product discovery, persistent cart management, and seamless order-online operations.',
    fullDescription:
      'MERN E-commerce Store is a brief enutions into product description with sampler for products and order-online e-commerce upirations.',
    coverImageUrl:
      'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=1200&q=80',
    demoVideoUrl: '',
    role: 'Lead Developer',
    duration: '3 Months',
    liveSiteUrl: 'https://shop-mern-demo.com',
    githubRepoUrl: 'https://github.com/example/mern-ecommerce',
    techStack: ['MongoDB', 'Express.js', 'React.js', 'Node.js'],
    features: [
      {
        icon: 'auth',
        title: 'Authentication',
        description: 'JWT-based secure user authentication and protected routes.',
      },
      {
        icon: 'pay',
        title: 'Payment Integration',
        description: 'Seamless integration with Stripe for secure payment processs management.',
      },
      {
        icon: 'admin',
        title: 'Admin Dashboard',
        description: 'Comprehensive dashboard for product and order.',
      },
      {
        icon: 'catalog',
        title: 'Product Catalog',
        description: 'Rich product display with filtering and search.',
      },
    ],
  },
  'task-manager-with-mysql': {
    title: 'Task Manager with MySQL',
    slug: 'task-manager-with-mysql',
    shortDescription:
      'A collaborative Kanban tool for teams, built on a robust relational database.',
    fullDescription:
      'A productive workspace built for engineering teams to manage sprints and track tasks with smooth drag-and-drop column transitions.',
    coverImageUrl:
      'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?auto=format&fit=crop&w=1200&q=80',
    demoVideoUrl: '',
    role: 'Full-Stack Developer',
    duration: '2 Months',
    liveSiteUrl: 'https://kanban-demo.example.com',
    githubRepoUrl: 'https://github.com/example/task-manager',
    techStack: ['React', 'MySQL', 'Node.js', 'Redis'],
    features: [
      {
        icon: 'layout',
        title: 'Kanban Boards',
        description: 'Interactive sprint columns with real-time status syncing.',
      },
      {
        icon: 'auth',
        title: 'Team Workspaces',
        description: 'Role-based team invitations and assignment permissions.',
      },
    ],
  },
};

const fallbackComments = [
  {
    _id: 'c1',
    name: 'Sarah Jenkins',
    role: 'Client',
    text: 'The checkout process is incredibly smooth! Great work on the payment integration.',
    createdAt: '2026-02-15T10:00:00Z',
    avatarColor: 'bg-emerald-500',
  },
  {
    _id: 'c2',
    name: 'Alex Petrova',
    role: 'Senior Developer Peer',
    text: 'I was impressed with how you structured the React state management. Very clean.',
    createdAt: '2026-02-18T14:30:00Z',
    avatarColor: 'bg-purple-500',
  },
  {
    _id: 'c3',
    name: 'Geregel Einey',
    role: 'Client',
    text: 'This product inaplices aitors for a oard design.',
    createdAt: '2026-02-20T09:15:00Z',
    avatarColor: 'bg-cyan-500',
  },
  {
    _id: 'c4',
    name: 'Julier Steven',
    role: 'Developer Peer',
    text: 'Thank you naking more bolth the hame and final t emdotions.',
    createdAt: '2026-02-22T16:45:00Z',
    avatarColor: 'bg-amber-500',
  },
];

const getFeatureIcon = (iconName) => {
  const lower = (iconName || '').toLowerCase();
  if (lower.includes('auth') || lower.includes('shield') || lower.includes('lock'))
    return <ShieldCheck size={20} className="text-cyan-400" />;
  if (lower.includes('pay') || lower.includes('credit') || lower.includes('stripe'))
    return <CreditCard size={20} className="text-cyan-400" />;
  if (lower.includes('admin') || lower.includes('dashboard') || lower.includes('chart'))
    return <Layout size={20} className="text-cyan-400" />;
  if (lower.includes('catalog') || lower.includes('product') || lower.includes('shopping'))
    return <ShoppingBag size={20} className="text-cyan-400" />;
  return <ShieldCheck size={20} className="text-cyan-400" />;
};

export const ProjectDetails = () => {
  const { slug } = useParams();
  const { data: serverProject, isLoading, isError } = useGetProjectBySlugQuery(slug);

  const project = isError
    ? (fallbackProjectDetails[slug] || fallbackProjectDetails['mern-e-commerce-store'])
    : serverProject;

  // Comments state
  const { data: serverComments, isError: isCommentsError } =
    useGetCommentsByProjectQuery(slug, {
      skip: !slug,
    });
  const [addComment, { isLoading: isPostingComment }] = useAddCommentMutation();

  const [localComments, setLocalComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentSuccessMsg, setCommentSuccessMsg] = useState('');

  const displayComments = [
    ...localComments,
    ...(isCommentsError ? fallbackComments : (serverComments || [])),
  ];

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      _id: Date.now().toString(),
      name: commentAuthor.trim() || 'Visitor Peer',
      role: 'Developer Peer',
      text: commentText.trim(),
      createdAt: new Date().toISOString(),
      avatarColor: 'bg-indigo-500',
    };

    setLocalComments([newComment, ...localComments]);
    setCommentText('');
    setCommentAuthor('');
    setCommentSuccessMsg('Comment posted!');
    setTimeout(() => setCommentSuccessMsg(''), 4000);

    try {
      await addComment({
        projectIdOrSlug: slug,
        name: newComment.name,
        role: newComment.role,
        text: newComment.text,
      }).unwrap();
    } catch {
      // Handled gracefully with local optimistic state
    }
  };

  if (isLoading && !project) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="h-6 w-32 bg-slate-800 rounded animate-pulse" />
        <div className="h-96 w-full bg-slate-800 rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-950/80 border border-blue-800/50 flex items-center justify-center text-blue-400 mx-auto font-mono text-2xl font-bold">
          404
        </div>
        <h1 className="text-2xl font-extrabold text-white">Project Not Found</h1>
        <p className="text-slate-400 text-sm">
          The project you're looking for doesn't exist or may have been removed.
        </p>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
        >
          <ArrowLeft size={16} />
          <span>Browse All Projects</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Back Link */}
      <div>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Projects</span>
        </Link>
      </div>

      {/* 1. TOP SECTION: WALKTHROUGH DEMO + OVERVIEW (Matching Project Details page.jpeg) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left: Walkthrough Player Box */}
        <div className="lg:col-span-6 bg-[#0c1220] rounded-3xl p-5 sm:p-6 border border-cyan-500/40 shadow-[0_0_25px_-5px_rgba(6,182,212,0.2)] flex flex-col justify-between">
          <div className="flex items-center gap-2 text-slate-300 font-mono text-xs mb-3">
            <span className="text-cyan-400 font-bold">&lt;/&gt;</span>
            <span className="font-semibold text-slate-200">Project Demo Walkthrough</span>
          </div>

          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
            <VideoPlayer
              videoUrl={project.demoVideoUrl}
              fallbackImageUrl={
                project.coverImageUrl ||
                'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=1200&q=80'
              }
              title={`${project.title} Demo`}
            />
          </div>
        </div>

        {/* Right: Project Overview Panel */}
        <div className="lg:col-span-6 bg-[#0c1220] rounded-3xl p-6 sm:p-8 border border-slate-800/90 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {project.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {project.fullDescription || project.shortDescription}
            </p>
          </div>

          {/* Key Metadata table/list matching mockup */}
          <div className="space-y-3 text-xs sm:text-sm border-t border-slate-800/80 pt-4">
            <div className="flex items-center gap-3">
              <span className="text-slate-400 flex items-center gap-2 w-32 shrink-0">
                <User size={15} className="text-cyan-400" /> Role:
              </span>
              <span className="font-semibold text-slate-200">
                {project.role || 'Lead Developer'}
              </span>
            </div>

            {project.duration && (
              <div className="flex items-center gap-3">
                <span className="text-slate-400 flex items-center gap-2 w-32 shrink-0">
                  <Calendar size={15} className="text-cyan-400" /> Duration:
                </span>
                <span className="font-semibold text-slate-200">{project.duration}</span>
              </div>
            )}

            <div className="flex items-center gap-3">
              <span className="text-slate-400 flex items-center gap-2 w-32 shrink-0">
                <ExternalLink size={15} className="text-cyan-400" /> Live Site:
              </span>
              {project.liveSiteUrl ? (
                <a
                  href={project.liveSiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 font-medium underline flex items-center gap-1 break-all"
                >
                  <span>{project.liveSiteUrl}</span>
                </a>
              ) : (
                <span className="text-slate-500">Demo link not public</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-slate-400 flex items-center gap-2 w-32 shrink-0">
                <GithubIcon size={15} className="text-cyan-400" /> GitHub Repo:
              </span>
              {project.githubRepoUrl ? (
                <a
                  href={project.githubRepoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 font-medium underline"
                >
                  [Repository Link]
                </a>
              ) : (
                <span className="text-slate-500">[Private Repository]</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. MIDDLE SECTION: FEATURES & TECHNICAL SPECIFICATIONS (Matching Project Details page.jpeg) */}
      <div className="bg-[#0c1220] rounded-3xl p-6 sm:p-8 border border-slate-800/90 space-y-6">
        <h2 className="text-lg sm:text-xl font-extrabold text-white uppercase tracking-wider font-mono">
          FEATURES & TECHNICAL SPECIFICATIONS
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: 4 Feature Boxes (2x2) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {project.features && project.features.length > 0 ? (
              project.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#11192b] border border-slate-800/80 space-y-1.5"
                >
                  <div className="flex items-center gap-2.5">
                    {getFeatureIcon(feature.icon || feature.title)}
                    <h3 className="font-bold text-slate-100 text-sm">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pl-7">
                    {feature.description}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500">No feature breakdown available.</p>
            )}
          </div>

          {/* Right: Tech Stack Box */}
          <div className="lg:col-span-4 bg-[#11192b] border border-slate-800/80 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-200">Tech Stack:</h3>

            <div className="grid grid-cols-2 gap-3">
              {project.techStack.map((tech, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-semibold text-slate-200"
                >
                  <div className="shrink-0">{getSkillIcon(tech, 18)}</div>
                  <span className="truncate">{tech}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM SECTION: CLIENT & PEER COMMENTS (Matching Project Details page.jpeg) */}
      <div className="bg-[#0c1220] rounded-3xl p-6 sm:p-8 border border-slate-800/90 space-y-6">
        <h2 className="text-lg sm:text-xl font-extrabold text-white uppercase tracking-wider font-mono">
          CLIENT & PEER COMMENTS
        </h2>

        {commentSuccessMsg && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs rounded-xl">
            {commentSuccessMsg}
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {displayComments.map((comment) => (
            <div key={comment._id} className="flex items-start gap-3.5">
              {/* User Avatar */}
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-cyan-300 shrink-0">
                {comment.name.charAt(0).toUpperCase()}
              </div>

              {/* Comment Content */}
              <div className="space-y-0.5">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-slate-200 text-xs sm:text-sm">
                    {comment.name}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    , {comment.role || 'Visitor'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {comment.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Comment Input Bar matching mockup */}
        <form onSubmit={handleCommentSubmit} className="pt-4 border-t border-slate-800/80">
          <div className="flex items-center gap-3 bg-[#11192b] border border-slate-800 rounded-2xl p-2 sm:p-2.5">
            <div className="w-8 h-8 rounded-full bg-purple-900/60 border border-purple-700/60 flex items-center justify-center text-xs font-bold text-purple-300 shrink-0">
              U
            </div>

            <input
              type="text"
              placeholder="Add a public comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1 bg-transparent text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none px-2"
              required
            />

            <button
              type="submit"
              disabled={isPostingComment || !commentText.trim()}
              className="px-5 py-2 rounded-xl bg-[#1d354a] hover:bg-blue-600 disabled:opacity-50 text-cyan-300 hover:text-white font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95"
            >
              POST
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectDetails;


import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FolderGit2,
  Cpu,
  User,
  MessageSquare,
  ArrowUpRight,
} from 'lucide-react';
import { selectIsAuthenticated } from '../../features/auth/authSlice';
import { useGetAllProjectsAdminQuery } from '../../features/projects/projectsApiSlice';
import { useGetAllSkillsAdminQuery } from '../../features/skills/skillsApiSlice';
import { useGetAllCommentsAdminQuery } from '../../features/comments/commentsApiSlice';
import { useGetProfileQuery } from '../../features/profile/profileApiSlice';
import { Skeleton } from '../../components/common/Skeleton';

export const AdminDashboard = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { data: projects, isLoading: isProjectsLoading } = useGetAllProjectsAdminQuery(undefined, {
    skip: !isAuthenticated,
  });
  const { data: skills, isLoading: isSkillsLoading } = useGetAllSkillsAdminQuery(undefined, {
    skip: !isAuthenticated,
  });
  const { data: comments, isLoading: isCommentsLoading } = useGetAllCommentsAdminQuery(undefined, {
    skip: !isAuthenticated,
  });
  const { data: profile } = useGetProfileQuery();

  const stats = [
    {
      title: 'Total Projects',
      value: projects ? projects.length : 0,
      icon: FolderGit2,
      link: '/admin/projects',
      color: 'text-blue-400',
      bg: 'bg-blue-950/60 border-blue-800/60',
    },
    {
      title: 'Active Skills',
      value: skills ? skills.length : 0,
      icon: Cpu,
      link: '/admin/skills',
      color: 'text-cyan-400',
      bg: 'bg-cyan-950/60 border-cyan-800/60',
    },
    {
      title: 'User Comments',
      value: comments ? comments.length : 0,
      icon: MessageSquare,
      link: '/admin/comments',
      color: 'text-purple-400',
      bg: 'bg-purple-950/60 border-purple-800/60',
    },
    {
      title: 'Profile Status',
      value: profile?.name ? 'Configured' : 'Incomplete',
      icon: User,
      link: '/admin/profile',
      color: 'text-emerald-400',
      bg: 'bg-emerald-950/60 border-emerald-800/60',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage your dynamic portfolio content, projects, skills, and comments in one place.
          </p>
        </div>

        <Link
          to="/"
          target="_blank"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors shadow-md shadow-blue-600/30"
        >
          <span>View Public Site</span>
          <ArrowUpRight size={14} />
        </Link>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Link
              key={idx}
              to={stat.link}
              className="bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all duration-200 group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {stat.title}
                </span>
                <div className={`p-2 rounded-xl border ${stat.bg} ${stat.color}`}>
                  <Icon size={18} />
                </div>
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-2xl font-extrabold text-slate-100 font-mono">
                  {isProjectsLoading || isSkillsLoading || isCommentsLoading ? (
                    <Skeleton className="h-8 w-12" />
                  ) : (
                    stat.value
                  )}
                </span>
                <span className="text-xs font-semibold text-blue-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                  Manage <ArrowUpRight size={12} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Action Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects List */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-200 flex items-center gap-2">
              <FolderGit2 size={18} className="text-blue-400" />
              <span>Showcased Projects</span>
            </h2>
            <Link
              to="/admin/projects"
              className="text-xs font-semibold text-blue-400 hover:underline"
            >
              View all
            </Link>
          </div>

          <div className="space-y-2.5">
            {projects && projects.length > 0 ? (
              projects.slice(0, 4).map((p) => (
                <div
                  key={p._id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-800 shrink-0">
                      {p.coverImageUrl ? (
                        <img
                          src={p.coverImageUrl}
                          alt={p.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                          <FolderGit2 size={16} />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-200 line-clamp-1">
                        {p.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {p.slug}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      p.isPublished
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}
                  >
                    {p.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">
                No projects found. Create your first project now.
              </p>
            )}
          </div>
        </div>

        {/* Recent Comments */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-200 flex items-center gap-2">
              <MessageSquare size={18} className="text-purple-400" />
              <span>Recent Public Comments</span>
            </h2>
            <Link
              to="/admin/comments"
              className="text-xs font-semibold text-purple-400 hover:underline"
            >
              Moderate
            </Link>
          </div>

          <div className="space-y-2.5">
            {comments && comments.length > 0 ? (
              comments.slice(0, 4).map((c) => (
                <div
                  key={c._id}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-300">
                      {c.name}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1 italic">
                    "{c.text}"
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">
                No comments submitted yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

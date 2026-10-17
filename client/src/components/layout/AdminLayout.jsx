import React from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  LayoutDashboard,
  FolderGit2,
  Cpu,
  User,
  MessageSquare,
  Mail,
  LogOut,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { selectCurrentUser, logout } from '../../features/auth/authSlice';
import { useLogoutUserMutation } from '../../features/auth/authApiSlice';
import { useGetAllMessagesAdminQuery } from '../../features/messages/messagesApiSlice';

export const AdminLayout = () => {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutUser] = useLogoutUserMutation();
  const { data: messagesData } = useGetAllMessagesAdminQuery(undefined, {
    skip: !user,
  });
  const unreadMessagesCount = messagesData?.unreadCount || 0;

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
    } catch {
      dispatch(logout());
    }
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
    { name: 'Manage Projects', path: '/admin/projects', icon: FolderGit2 },
    { name: 'Manage Skills', path: '/admin/skills', icon: Cpu },
    { name: 'Profile & About', path: '/admin/profile', icon: User },
    { name: 'Comments', path: '/admin/comments', icon: MessageSquare },
    {
      name: 'Messages',
      path: '/admin/messages',
      icon: Mail,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : null,
    },
  ];

  return (
    <div className="admin-theme dark [color-scheme:dark] min-h-screen bg-[#090A0F] text-[#F8FAFC] flex flex-col md:flex-row relative selection:bg-sky-500/30 selection:text-white">
      {/* Ambient Top Spotlight */}
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-60"
        style={{
          background:
            'radial-gradient(ellipse 70% 40% at 50% -10%, rgba(56, 189, 248, 0.10), transparent)',
        }}
      />

      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-950/70 border-r border-white/[0.08] backdrop-blur-xl flex flex-col justify-between shrink-0 relative z-10">
        <div>
          {/* Admin Header */}
          <div className="p-5 sm:p-6 border-b border-white/[0.08] flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-sky-950/60 border border-sky-400/30 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-all shadow-md shadow-sky-500/10">
                <ShieldAlert size={20} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="font-bold text-sm text-white tracking-tight">Admin Console</h2>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <p className="text-[11px] text-slate-400 font-mono">Bishal Portfolio · v2.0</p>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-3.5 space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
              Platform Modules
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-sky-500/15 text-sky-300 border border-sky-400/30 shadow-sm'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded-full bg-sky-500 text-slate-950 font-bold font-mono text-[10px]">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/[0.08] space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between w-full px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-sky-300 hover:bg-white/[0.05] border border-white/[0.08] transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={14} className="text-sky-400" />
              <span>Live Website</span>
            </span>
            <span className="text-[10px] font-mono bg-white/[0.06] text-slate-400 px-1.5 py-0.5 rounded">
              Public ↗
            </span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 border border-rose-900/30 transition-colors"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>

          {user && (
            <div className="pt-2 flex items-center gap-2 px-1 text-[11px] text-slate-400 font-mono truncate">
              <div className="w-5 h-5 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-[10px] text-sky-300 font-bold shrink-0">
                {(user.name || user.email || 'A').charAt(0).toUpperCase()}
              </div>
              <span className="truncate">{user.email}</span>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto max-h-screen p-4 sm:p-6 lg:p-8 relative z-10">
        <div className="max-w-6xl mx-auto space-y-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

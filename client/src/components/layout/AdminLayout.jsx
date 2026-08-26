import React from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  LayoutDashboard,
  FolderGit2,
  Cpu,
  User,
  MessageSquare,
  LogOut,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { selectCurrentUser, logout } from '../../features/auth/authSlice';
import { useLogoutUserMutation } from '../../features/auth/authApiSlice';

export const AdminLayout = () => {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutUser] = useLogoutUserMutation();

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
  ];

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-950/80 border-r border-slate-800/80 flex flex-col justify-between shrink-0">
        <div>
          {/* Admin Header */}
          <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-400">
                <ShieldAlert size={20} />
              </div>
              <div>
                <h2 className="font-bold text-sm text-slate-100">Admin Portal</h2>
                <p className="text-[11px] text-slate-400 font-mono">Bishal Portfolio</p>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800/80 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-blue-400 hover:bg-slate-900 border border-slate-800/60 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={14} />
              <span>Live Website</span>
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
              Tab
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl text-xs font-medium text-red-400 hover:bg-red-950/40 hover:text-red-300 border border-red-900/40 transition-colors"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>

          {user && (
            <div className="pt-2 text-[11px] text-slate-500 text-center font-mono truncate px-1">
              {user.email}
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto max-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

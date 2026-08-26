import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Menu,
  X,
  LayoutDashboard,
  LogOut,
} from 'lucide-react';
import { selectIsAuthenticated, logout } from '../../features/auth/authSlice';
import { useLogoutUserMutation } from '../../features/auth/authApiSlice';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutUser] = useLogoutUserMutation();

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
    } catch {
      dispatch(logout());
    }
    navigate('/');
  };

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'PROJECTS', path: '/projects' },
    { name: 'CONTACT', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#090D16]/80 border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Logo / Brand Name matching Wireframe */}
        <Link
          to="/"
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="flex items-center text-xl sm:text-2xl font-mono font-extrabold tracking-tight">
            <span className="text-cyan-400 group-hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] transition-all">&lt;</span>
            <span className="text-white bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text">BB</span>
            <span className="text-cyan-400 group-hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] transition-all">&gt;</span>
          </div>
          <div className="hidden sm:flex flex-col border-l border-slate-800 pl-3">
            <span className="font-bold text-sm tracking-wider text-slate-200 group-hover:text-blue-400 transition-colors">
              Bishal Biswas
            </span>
            <span className="text-[10px] tracking-widest text-slate-400 uppercase font-mono">
              Portfolio
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl text-sm font-semibold tracking-wider transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          {/* Admin shortcuts if authenticated */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2 ml-4 pl-4 border-l border-slate-800">
              <Link
                to="/admin"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-purple-950/60 text-purple-300 border border-purple-800/60 hover:bg-purple-900/70 transition-colors"
              >
                <LayoutDashboard size={14} />
                <span>Admin</span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-slate-800/80 transition-colors"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link
              to="/admin/login"
              className="ml-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors"
              title="Admin Login"
            >
              Admin
            </Link>
          )}
        </nav>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          {isAuthenticated && (
            <Link
              to="/admin"
              className="p-2 rounded-lg bg-purple-950/80 text-purple-300 border border-purple-800"
            >
              <LayoutDashboard size={18} />
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 border-b border-slate-800 px-4 pt-3 pb-6 space-y-2 backdrop-blur-xl animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-xl text-sm font-semibold tracking-wider transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-300 hover:bg-slate-800/80'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}

          {isAuthenticated ? (
            <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between">
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 text-sm font-medium text-purple-400"
              >
                <LayoutDashboard size={16} />
                <span>Admin Dashboard</span>
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-1.5 text-xs text-red-400 font-medium px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-900/60"
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-800">
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs text-slate-500 hover:text-slate-300 py-1"
              >
                Admin Login
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;

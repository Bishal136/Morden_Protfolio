import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Menu,
  X,
  FileText,
  LayoutDashboard,
  LogOut,
} from 'lucide-react';
import { selectIsAuthenticated, logout } from '../../features/auth/authSlice';
import { useLogoutUserMutation } from '../../features/auth/authApiSlice';
import { useGetProfileQuery } from '../../features/profile/profileApiSlice';
import siteConfig from '../../config/siteConfig';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutUser] = useLogoutUserMutation();
  const { data: profile } = useGetProfileQuery();

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
    } catch {
      dispatch(logout());
    }
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Contact', path: '/contact' },
  ];

  const resumeUrl = profile?.resumeUrl || siteConfig.resumeUrl;

  return (
    <header className="sticky top-4 z-50 w-full px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto transition-all duration-300">
      {/* Floating Glassmorphic Pill Navbar */}
      <div className="backdrop-blur-xl bg-white/85 border border-slate-200/90 rounded-2xl shadow-lg shadow-slate-200/50 px-4 sm:px-5 py-2.5 flex items-center justify-between">
        {/* Brand Identity: Bishal Biswas */}
        <Link
          to="/"
          className="flex items-center gap-3 group focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none rounded-xl"
          aria-label="Bishal Biswas Portfolio Home"
        >
          <div className="flex items-center font-mono font-bold text-sm tracking-tight text-slate-800 bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1.5 group-hover:border-sky-400 group-hover:text-sky-600 transition-colors">
            <span className="text-sky-500">&lt;</span>
            <span className="text-slate-800 font-semibold tracking-wider">BB</span>
            <span className="text-sky-500">/&gt;</span>
          </div>

          <div className="flex flex-col">
            <span className="font-semibold text-sm tracking-tight text-slate-900 group-hover:text-sky-600 transition-colors">
              Bishal Biswas
            </span>
            <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase">
              Full-Stack Developer
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/70 border border-slate-200/60 rounded-xl p-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) =>
                `px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none ${
                  isActive
                    ? 'bg-white text-sky-600 border border-slate-200 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Right Actions: Resume Button & Admin Quick Link if logged in */}
        <div className="hidden md:flex items-center gap-2">
          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
            >
              <FileText size={13} />
              <span>Resume</span>
            </a>
          )}

          {isAuthenticated && (
            <Link
              to="/admin"
              className="p-2 rounded-xl text-slate-600 hover:text-purple-600 hover:bg-slate-100 transition-colors border border-slate-200"
              title="Admin Dashboard"
            >
              <LayoutDashboard size={16} />
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <div className="md:hidden flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 backdrop-blur-xl bg-white/95 border border-slate-200 rounded-2xl p-4 shadow-xl space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-sky-50 text-sky-700 border border-sky-200'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          <div className="pt-2 border-t border-slate-200 flex flex-col gap-2">
            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-xs"
              >
                <FileText size={14} />
                <span>Download Resume</span>
              </a>
            )}

            {isAuthenticated && (
              <div className="pt-2 flex items-center justify-between">
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-1.5 text-xs text-purple-600 font-medium"
                >
                  <LayoutDashboard size={14} />
                  <span>Admin Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-1 text-xs text-red-600 font-medium px-2.5 py-1 rounded-lg bg-red-50 border border-red-200"
                >
                  <LogOut size={13} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

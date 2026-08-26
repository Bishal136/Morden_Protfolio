import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { selectIsAuthenticated } from '../../features/auth/authSlice';
import { useLoginMutation, useGoogleLoginMutation } from '../../features/auth/authApiSlice';

// Authentic Google Multicolored G Icon
const GoogleIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className="shrink-0">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [login, { isLoading: isEmailLoading }] = useLoginMutation();
  const [googleLogin, { isLoading: isGoogleLoading }] = useGoogleLoginMutation();

  const googleBtnContainerRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin';

  const isLoading = isEmailLoading || isGoogleLoading;

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Handle response from Google Identity Services
  const handleGoogleResponse = useCallback(
    async (response) => {
      setErrorMessage('');
      if (!response?.credential) {
        setErrorMessage('Failed to obtain Google authentication credential.');
        return;
      }

      try {
        await googleLogin({ credential: response.credential }).unwrap();
        navigate(from, { replace: true });
      } catch (err) {
        setErrorMessage(
          err?.data?.message ||
            'Google authentication failed. Ensure this account is authorized as an administrator.'
        );
      }
    },
    [googleLogin, from, navigate]
  );

  // Initialize Google Identity Services (GIS)
  useEffect(() => {
    const clientId =
      import.meta.env.VITE_GOOGLE_CLIENT_ID ||
      '618728729484-m4qpomhngmtbb95d6u9r4d3giv8i0al4.apps.googleusercontent.com';

    const setupGoogleAuth = () => {
      if (window.google?.accounts?.id && clientId) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          if (googleBtnContainerRef.current) {
            googleBtnContainerRef.current.innerHTML = '';
            window.google.accounts.id.renderButton(googleBtnContainerRef.current, {
              theme: 'filled_black',
              size: 'large',
              width: '100%',
              text: 'continue_with',
              shape: 'rectangular',
              logo_alignment: 'left',
            });
          }
        } catch (e) {
          console.warn('Google Identity initialization notice:', e);
        }
      }
    };

    if (window.google?.accounts?.id) {
      setupGoogleAuth();
    } else {
      const interval = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(interval);
          setupGoogleAuth();
        }
      }, 300);
      return () => clearInterval(interval);
    }
  }, [handleGoogleResponse]);

  const handleManualGoogleClick = () => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    } else {
      setErrorMessage('Google Identity is loading. Please click again in a moment.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      await login({ email, password }).unwrap();
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMessage(
        err?.data?.message || 'Login failed. Please verify your admin credentials.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#070A12] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900/80 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-950 border border-blue-800/60 flex items-center justify-center text-cyan-400 mx-auto shadow-lg shadow-blue-600/20">
            <ShieldCheck size={26} />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Admin Portal Authentication
          </h1>
          <p className="text-xs text-slate-400">
            Sign in or connect with Google to manage portfolio projects, skills, profile, and comments.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 bg-red-950/80 border border-red-800/80 text-red-300 text-xs font-medium rounded-xl flex items-center gap-2 animate-in fade-in">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 1. Google One-Click Login & Sign-Up */}
        <div className="space-y-2.5">
          <div
            ref={googleBtnContainerRef}
            className="w-full min-h-[44px] flex items-center justify-center overflow-hidden rounded-xl bg-slate-950 border border-slate-800"
          />

          {/* Backup Custom Google Button */}
          <button
            type="button"
            onClick={handleManualGoogleClick}
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 rounded-xl text-xs font-semibold text-slate-200 flex items-center justify-center gap-2.5 transition-all shadow-sm active:scale-[0.99] cursor-pointer disabled:opacity-50"
          >
            <GoogleIcon size={16} />
            <span>{isGoogleLoading ? 'Connecting to Google...' : 'Sign in with Google Account'}</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-800 w-full" />
          <span className="bg-slate-900 px-3 text-[11px] font-mono tracking-wider text-slate-500 uppercase shrink-0">
            Or sign in with email
          </span>
          <div className="border-t border-slate-800 w-full" />
        </div>

        {/* 2. Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="email"
                required
                placeholder="bishalbiswas2026@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/90 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed"
          >
            <span>{isEmailLoading ? 'Authenticating...' : 'Sign In with Password'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="pt-2 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft size={12} />
            <span>Return to public website</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;


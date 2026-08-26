import React from 'react';
import { Link } from 'react-router-dom';
import { Home as HomeIcon } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="text-center space-y-6 max-w-md bg-slate-900/60 border border-slate-800/80 p-8 sm:p-12 rounded-3xl shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-blue-950/80 border border-blue-800/50 flex items-center justify-center text-blue-400 mx-auto font-mono text-2xl font-bold">
          404
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Page Not Found
        </h1>
        <p className="text-slate-400 text-sm">
          The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
          >
            <HomeIcon size={16} />
            <span>Go to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

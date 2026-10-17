import React from 'react';
import { Link } from 'react-router-dom';
import { Home as HomeIcon } from 'lucide-react';
import useDocumentTitle from '../hooks/useDocumentTitle';

export const NotFound = () => {
  useDocumentTitle('404 Page Not Found');

  return (
    <div className="pt-28 md:pt-32 min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="text-center space-y-6 max-w-md bg-white border border-slate-200 p-8 sm:p-12 rounded-3xl shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 mx-auto font-mono text-xl font-bold">
          404
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          The requested engineering resource or page does not exist or has been relocated.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-500/20 transition-all hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:outline-none"
          >
            <HomeIcon size={15} />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

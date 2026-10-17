import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export const PublicLayout = () => {
  return (
    <div className="relative flex flex-col min-h-screen bg-[#FAFAFC] text-slate-900 selection:bg-sky-500 selection:text-white">
      {/* Ambient Lighting: Subtle radial top-center spotlight gradient */}
      <div
        className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[420px] -z-0 ambient-spotlight"
        aria-hidden="true"
      />
      
      {/* Global subtle engineering grid */}
      <div
        className="pointer-events-none fixed inset-0 opacity-100 engineering-grid -z-0"
        aria-hidden="true"
      />

      <Navbar />
      <main className="flex-1 w-full relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;

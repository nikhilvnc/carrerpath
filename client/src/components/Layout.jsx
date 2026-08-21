import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { DemoBanner } from './DemoBanner';

export const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <DemoBanner />
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {children}
      </main>
      <Footer />
    </div>
  );
};

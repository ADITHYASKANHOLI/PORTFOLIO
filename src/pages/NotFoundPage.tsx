import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Compass } from 'lucide-react';
import { Navbar } from '@/components/sections/Navbar';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#08090B] text-white flex flex-col justify-between">
      <Navbar />

      <main className="my-auto max-w-lg mx-auto px-6 py-24 text-center space-y-6">
        <div className="w-14 h-14 rounded-full border border-white/30 bg-[#12151A] flex items-center justify-center mx-auto text-white">
          <Compass className="w-7 h-7" />
        </div>

        <span className="font-mono text-xs text-white uppercase tracking-technical block font-medium">
          Error 404 // Undefined Route
        </span>

        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white">
          Coordinates Not Found
        </h1>

        <p className="font-sans text-[#9299A3] text-base leading-relaxed">
          The requested page does not exist in this technical journal. It may have been relocated or removed.
        </p>

        <div className="pt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-sm bg-white text-[#08090B] font-mono text-xs font-semibold tracking-technical uppercase hover:bg-[#D7DCE2] transition-all shadow-md hover:shadow-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Portfolio</span>
          </Link>
        </div>
      </main>

      <footer className="py-8 text-center font-mono text-xs text-[#9299A3]/50 border-t border-[#292D33]">
        Adithya S. Kanholi • Personal Archive
      </footer>
    </div>
  );
};


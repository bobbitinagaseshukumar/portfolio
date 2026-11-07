import React from 'react';
import { ArrowUp } from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon } from './Icons';
import { personalData } from '../../config/portfolioData';

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-10 border-t border-white/5 bg-[#07080d] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* Left: Branding */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <span className="text-base font-bold text-white tracking-tight">
            {personalData.name} <span className="text-cyan-400">Portfolio</span>
          </span>
          <p className="text-xs text-slate-500 mt-1">
            Engineered with React, Three.js, Supabase & Render.
          </p>
        </div>

        {/* Center: Socials */}
        <div className="flex items-center gap-3">
          <a
            href={personalData.socials.github}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors"
            aria-label="GitHub"
          >
            <GithubIcon className="w-4 h-4" />
          </a>
          <a
            href={personalData.socials.linkedin}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors"
            aria-label="LinkedIn"
          >
            <LinkedinIcon className="w-4 h-4" />
          </a>
          <a
            href={personalData.socials.twitter}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white transition-colors"
            aria-label="Twitter"
          >
            <TwitterIcon className="w-4 h-4" />
          </a>
        </div>

        {/* Right: Scroll to top */}
        <button
          onClick={scrollToTop}
          className="p-2.5 rounded-xl glass-card text-slate-300 hover:text-white border border-white/10 hover:border-indigo-500/50 transition-all flex items-center gap-2 text-xs font-mono"
          aria-label="Back to top"
        >
          <span>Back to Top</span>
          <ArrowUp className="w-4 h-4 text-cyan-400" />
        </button>
      </div>

      <div className="text-center text-[11px] text-slate-600 mt-8 pt-4 border-t border-white/5">
        © {new Date().getFullYear()} {personalData.name}. All rights reserved. Adaptive Multi-Screen Ratio System.
      </div>
    </footer>
  );
};

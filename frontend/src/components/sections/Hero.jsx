import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { GithubIcon, LinkedinIcon, TwitterIcon } from '../ui/Icons';
import { Hero3DCanvas } from '../3d/Hero3DCanvas';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { useScreenRatio } from '../../hooks/useScreenRatio';

export const Hero = () => {
  const { personal } = usePortfolioData();
  const { ratioLabel } = useScreenRatio();

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Left Column: Headline, Bio & CTAs */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left z-10"
        >
          {/* Status Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs sm:text-sm font-medium mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-emerald-400 font-semibold">Available for Opportunities</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Adaptive WebGL 3D</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            Hi, I'm <span className="text-gradient">{personal.name || 'Kumar'}</span>
            {personal.title && (
              <>
                <br />
                <span className="text-2xl sm:text-4xl md:text-5xl font-bold text-slate-300">
                  {personal.title}
                </span>
              </>
            )}
          </h1>

          {/* Subtitle / Bio */}
          {personal.headline && (
            <p className="text-base sm:text-lg text-slate-400 max-w-xl mb-8 leading-relaxed">
              {personal.headline}
            </p>
          )}

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-10 w-full sm:w-auto">
            <a
              href="#projects"
              className="glow-btn px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 text-white font-semibold flex items-center gap-2 group text-sm sm:text-base"
            >
              Explore Projects
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>

            <a
              href="#documents"
              className="px-6 py-3.5 rounded-xl glass-card text-slate-200 hover:text-white font-semibold flex items-center gap-2 text-sm sm:text-base border border-white/10 hover:border-indigo-400/40"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Credentials & Docs
            </a>
          </div>

          {/* Socials & Screen Ratio Mini Badge */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 border-t border-white/10 w-full">
            <div className="flex items-center gap-3">
              {personal.socials?.github && (
                <a
                  href={personal.socials.github}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all"
                  aria-label="GitHub"
                >
                  <GithubIcon className="w-4 h-4" />
                </a>
              )}
              {personal.socials?.linkedin && (
                <a
                  href={personal.socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all"
                  aria-label="LinkedIn"
                >
                  <LinkedinIcon className="w-4 h-4" />
                </a>
              )}
              {personal.socials?.twitter && (
                <a
                  href={personal.socials.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all"
                  aria-label="Twitter"
                >
                  <TwitterIcon className="w-4 h-4" />
                </a>
              )}
            </div>

            <div className="text-[11px] font-mono text-cyan-400/80 bg-cyan-950/40 px-2.5 py-1 rounded-md border border-cyan-800/40">
              Viewport: {ratioLabel}
            </div>
          </div>
        </motion.div>

        {/* Right Column: 3D Hologram Cyber Core */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="lg:col-span-5 relative w-full flex items-center justify-center order-first lg:order-last"
        >
          <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-indigo-500/20 to-cyan-500/20 blur-3xl -z-10" />
          <Hero3DCanvas />
        </motion.div>
      </div>
    </section>
  );
};

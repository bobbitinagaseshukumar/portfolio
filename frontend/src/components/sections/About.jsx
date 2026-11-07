import React from 'react';
import { motion } from 'framer-motion';
import { User, Cpu, Smartphone, ShieldCheck, Zap, Globe, Layers, GraduationCap } from 'lucide-react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { useScreenRatio } from '../../hooks/useScreenRatio';

export const About = () => {
  const { personal } = usePortfolioData();
  const { ratioLabel, width, height, isMobile, isTablet } = useScreenRatio();

  const corePillars = [
    {
      icon: <Cpu className="w-5 h-5 text-indigo-400" />,
      title: "Interactive 3D WebGL",
      description: "Crafting real-time WebGL graphics, custom GLSL shaders, and reactive 3D environments that maintain high framerates."
    },
    {
      icon: <Smartphone className="w-5 h-5 text-cyan-400" />,
      title: "Adaptive Screen Ratios",
      description: "Designed from the ground up to react dynamically whether viewed on a vertical smartphone (9:19.5), iPad (4:3), or desktop (16:9)."
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      title: "Full-Stack Architecture",
      description: "PostgreSQL on Supabase with Row Level Security, Node/Express APIs deployed on Render, and frontend on Vercel."
    },
    {
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      title: "Zero Fake Data & Live Sync",
      description: "Every credential, certificate, and educational degree is managed directly by the administrator."
    }
  ];

  return (
    <section id="about" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Interactive Diagnostics Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5"
          >
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-indigo-500/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{personal.name || 'Kumar'}</h3>
                  <p className="text-xs text-indigo-400 font-mono">
                    {personal.title || 'Full-Stack Developer'}
                  </p>
                </div>
              </div>

              {/* Dynamic Viewport Telemetry Box */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 font-mono text-xs space-y-2 mb-6">
                <div className="flex items-center justify-between text-slate-400 border-b border-white/5 pb-2">
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <Layers className="w-3.5 h-3.5" /> Live Screen Monitor:
                  </span>
                  <span className="text-emerald-400 font-semibold">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Device:</span>
                  <span className="text-slate-200">
                    {isMobile ? 'Mobile Smartphone' : isTablet ? 'Tablet Device' : 'Desktop / Laptop'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Aspect Ratio:</span>
                  <span className="text-cyan-300 font-bold">{ratioLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Resolution:</span>
                  <span className="text-slate-300">{width}px × {height}px</span>
                </div>
                {personal.college && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">College:</span>
                    <span className="text-indigo-400 font-semibold">{personal.college}</span>
                  </div>
                )}
              </div>

              {personal.about && (
                <div className="text-xs text-slate-400 leading-relaxed italic border-l-2 border-indigo-500/50 pl-3">
                  "{personal.about}"
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Column: Narrative & 4 Pillars */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7 flex flex-col"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono uppercase tracking-wider mb-3 w-fit">
              <Globe className="w-3.5 h-3.5" />
              About & Architecture
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
              Designing for Every Screen, <br className="hidden sm:inline" />
              <span className="text-gradient">Engineered for Performance</span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
              A high-performance portfolio engineered with real-time multi-device responsiveness and synchronized database content management.
              Every element, 3D camera angle, and layout calculates the exact viewport ratio to deliver a seamless experience across all displays.
            </p>

            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {corePillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className="glass-card p-5 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all"
                >
                  <div className="mb-3">{pillar.icon}</div>
                  <h4 className="text-base font-semibold text-white mb-1.5">{pillar.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{pillar.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

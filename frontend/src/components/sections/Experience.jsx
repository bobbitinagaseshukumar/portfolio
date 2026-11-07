import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, ChevronRight } from 'lucide-react';
import { experienceData } from '../../config/portfolioData';

export const Experience = () => {
  return (
    <section id="experience" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-3">
            <Briefcase className="w-3.5 h-3.5" />
            Milestones & Career
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Work <span className="text-gradient">Experience</span>
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative border-l border-indigo-500/30 ml-4 sm:ml-6 space-y-10">
          {experienceData.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="relative pl-6 sm:pl-8 group"
            >
              {/* Timeline Glowing Node */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#090a0f] border-2 border-indigo-500 group-hover:border-cyan-400 group-hover:scale-125 transition-all shadow-md shadow-indigo-500/50" />

              <div className="glass-card p-6 rounded-2xl border border-white/5 group-hover:border-indigo-500/30 transition-all">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {item.role}
                  </h3>
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 bg-cyan-950/40 px-2.5 py-1 rounded-full border border-cyan-800/40">
                    <Calendar className="w-3 h-3" />
                    {item.period}
                  </div>
                </div>

                <div className="text-sm font-medium text-indigo-400 mb-3">
                  {item.company}
                </div>

                <p className="text-sm text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

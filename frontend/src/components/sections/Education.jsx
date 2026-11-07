import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, School, Building2, Calendar, MapPin, Award } from 'lucide-react';
import { usePortfolioData } from '../../hooks/usePortfolioData';

export const Education = () => {
  const { education } = usePortfolioData();

  return (
    <section id="education" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono uppercase tracking-wider mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            Academic Journey
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Education & <span className="text-gradient">Qualifications</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-lg">
            Engineering degrees, academic institutions, and foundation milestones.
          </p>
        </div>

        {/* Education Timeline */}
        {education.length === 0 ? (
          <div className="p-12 text-center rounded-2xl glass-card border border-white/5 max-w-lg mx-auto">
            <GraduationCap className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-white">Education Details Updating Soon</h3>
            <p className="text-xs text-slate-400 mt-1">
              Verified school, intermediate, and college degrees will appear here once entered in the management portal.
            </p>
          </div>
        ) : (
          <div className="relative border-l border-indigo-500/30 ml-4 sm:ml-6 space-y-8">
            {education.map((item, idx) => (
              <motion.div
                key={item.id || idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative pl-6 sm:pl-8 group"
              >
                {/* Timeline Node */}
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#090a0f] border-2 border-indigo-500 group-hover:border-cyan-400 group-hover:scale-125 transition-all shadow-md shadow-indigo-500/50" />

                <div className="glass-card p-6 rounded-2xl border border-white/5 group-hover:border-indigo-500/30 transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {item.institutionName}
                      </h3>
                      {item.isCurrent && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Current
                        </span>
                      )}
                    </div>
                    {item.academicYear && (
                      <div className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 bg-cyan-950/40 px-2.5 py-1 rounded-full border border-cyan-800/40">
                        <Calendar className="w-3 h-3" />
                        {item.academicYear}
                      </div>
                    )}
                  </div>

                  <div className="text-sm font-semibold text-indigo-400 mb-1">
                    {item.degree} {item.branchOrField ? `• ${item.branchOrField}` : ''}
                  </div>

                  {item.scoreOrCgpa && (
                    <div className="text-xs font-mono text-slate-300 mb-2">
                      Grade: <span className="text-cyan-300 font-semibold">{item.scoreOrCgpa}</span>
                    </div>
                  )}

                  {item.location && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3 font-mono">
                      <MapPin className="w-3.5 h-3.5" />
                      {item.location}
                    </div>
                  )}

                  {item.description && (
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

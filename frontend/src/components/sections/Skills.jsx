import React from 'react';
import { motion } from 'framer-motion';
import { Wrench, CheckCircle, Sparkles } from 'lucide-react';
import { usePortfolioData } from '../../hooks/usePortfolioData';

export const Skills = () => {
  const { skills } = usePortfolioData();

  return (
    <section id="skills" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono uppercase tracking-wider mb-3">
            <Wrench className="w-3.5 h-3.5" />
            Capabilities & Stack
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Technical <span className="text-gradient">Proficiencies</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-xl">
            Programming languages, libraries, and tools.
          </p>
        </div>

        {/* Categories Grid or Professional Empty State */}
        {skills.length === 0 ? (
          <div className="p-16 text-center rounded-2xl glass-card border border-white/5 max-w-lg mx-auto">
            <Wrench className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-white">Skills are currently being updated.</h3>
            <p className="text-xs text-slate-400 mt-1">
              Add your verified programming languages and technical proficiencies in the Admin Portal.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((category, catIdx) => (
              <motion.div
                key={category.category || catIdx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: catIdx * 0.1 }}
                className="glass-card p-6 rounded-2xl border border-white/5 hover:border-indigo-500/40 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-base font-bold text-white mb-5 pb-3 border-b border-white/10 flex items-center justify-between">
                    <span>{category.category}</span>
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                  </h3>

                  <div className="space-y-4">
                    {category.skills?.map((skill, sIdx) => (
                      <div key={sIdx} className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-300 font-medium">{skill.name}</span>
                          <span className="text-cyan-400 font-mono font-semibold">{skill.level}%</span>
                        </div>
                        
                        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.1 + sIdx * 0.05 }}
                            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  Verified
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

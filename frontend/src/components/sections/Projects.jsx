import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, ExternalLink, Film, FolderUp, Sparkles, FolderGit2 } from 'lucide-react';
import { GithubIcon } from '../ui/Icons';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { VideoModal } from '../ui/VideoModal';

export const Projects = () => {
  const { projects } = usePortfolioData();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = ['All', '3D & Creative Web', 'Full Stack & Cloud', 'Mobile & Responsive'];

  const filteredProjects = activeFilter === 'All'
    ? projects
    : projects.filter((p) => p.category === activeFilter);

  return (
    <section id="projects" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-3">
            <Film className="w-3.5 h-3.5" />
            Showcase & Video Demos
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-2xl">
            Each project features dedicated video demonstrations and interactive 3D elements.
          </p>

          {/* Filter Pills */}
          {projects.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    activeFilter === cat
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/40'
                      : 'glass-card text-slate-400 hover:text-white border border-white/5 hover:border-white/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Responsive Projects Grid or Professional Empty State */}
        {filteredProjects.length === 0 ? (
          <div className="p-16 text-center rounded-2xl glass-card border border-white/5 max-w-lg mx-auto">
            <FolderGit2 className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-white">Projects are currently being updated.</h3>
            <p className="text-xs text-slate-400 mt-1">
              Add your real projects, video recordings, and GitHub repositories in the Admin Portal to publish them here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project.id || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-card rounded-2xl overflow-hidden flex flex-col group border border-white/10 hover:border-indigo-500/40"
              >
                {/* Thumbnail Container */}
                {project.thumbnail && (
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                    {project.category && (
                      <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10 text-[11px] font-medium text-cyan-300">
                        {project.category}
                      </div>
                    )}

                    {project.videoUrl && (
                      <button
                        onClick={() => setSelectedVideo(project)}
                        className="absolute inset-0 m-auto w-14 h-14 rounded-2xl bg-indigo-600/90 hover:bg-indigo-500 text-white flex items-center justify-center shadow-xl shadow-indigo-600/40 backdrop-blur-sm transition-all transform group-hover:scale-110 active:scale-95"
                        aria-label={`Watch video demo for ${project.title}`}
                      >
                        <Play className="w-6 h-6 fill-white ml-0.5" />
                      </button>
                    )}
                  </div>
                )}

                {/* Project Details */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {project.title}
                    </h3>
                    {project.isFeatured && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        Featured
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-slate-400 mb-5 leading-relaxed flex-1">
                    {project.shortDescription || project.description}
                  </p>

                  {/* Tags */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.technologies.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-xs px-2.5 py-1 rounded-lg bg-white/5 text-slate-300 border border-white/5 font-mono"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Card Actions */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                    {project.videoUrl ? (
                      <button
                        onClick={() => setSelectedVideo(project)}
                        className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        <Play className="w-3.5 h-3.5 fill-cyan-400" />
                        Watch Video Demo
                      </button>
                    ) : (
                      <span className="text-xs text-slate-500 font-mono">Documentation Ready</span>
                    )}

                    <div className="flex items-center gap-3">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                          title="GitHub Repository"
                        >
                          <GithubIcon className="w-4 h-4" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                          title="Live Site"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Video Modal Display */}
      {selectedVideo && (
        <VideoModal
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          videoSrc={selectedVideo.videoUrl || selectedVideo.video}
          title={selectedVideo.title}
          tags={selectedVideo.technologies || selectedVideo.tags}
        />
      )}
    </section>
  );
};

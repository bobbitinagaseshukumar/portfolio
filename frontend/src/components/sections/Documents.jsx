import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Eye, Download, ShieldCheck, ExternalLink, X, Film, Image, Lock } from 'lucide-react';
import { usePortfolioData } from '../../hooks/usePortfolioData';

export const Documents = () => {
  const { documents } = usePortfolioData();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [previewItem, setPreviewItem] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://portfolio-zsk2.onrender.com';

  const categories = [
    { id: 'all', label: 'All Documents' },
    { id: 'resume', label: 'Resume' },
    { id: 'degree', label: 'Degree & College' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'school', label: 'School' },
    { id: 'certifications', label: 'Certificates' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'projects', label: 'Projects' }
  ];

  const filteredDocs = (documents || []).filter((doc) => {
    if (selectedCategory === 'all') return true;
    return doc.category === selectedCategory;
  });

  return (
    <section id="documents" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified Credentials & Documents
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Credentials & <span className="text-gradient">Documents</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-400 max-w-xl">
            Official educational marksheets, technical certifications, and verified documents.
          </p>

          {/* Filter Pills */}
          {documents && documents.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'glass-card text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Documents Showcase */}
        {filteredDocs.length === 0 ? (
          <div className="p-12 text-center rounded-2xl glass-card border border-white/5 max-w-lg mx-auto">
            <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-white">Documents Updating Soon</h3>
            <p className="text-xs text-slate-400 mt-1">
              Verified certificates and documents will be displayed here once approved and published.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDocs.map((doc, idx) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="glass-card p-5 rounded-2xl border border-white/5 hover:border-indigo-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-white/5 text-cyan-300 border border-white/10">
                      {doc.category}
                    </span>
                    {doc.issueDate && (
                      <span className="text-[10px] text-slate-500 font-mono">
                        {doc.issueDate}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors mb-1.5 line-clamp-1">
                    {doc.title}
                  </h3>

                  {doc.description && (
                    <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                      {doc.description}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-3 text-xs">
                  {doc.allowPreview ? (
                    <a
                      href={`${backendUrl}${doc.previewUrl}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-medium"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Preview
                    </a>
                  ) : (
                    <span className="text-slate-600 text-[11px] flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Preview Restricted
                    </span>
                  )}

                  {doc.allowDownload ? (
                    <a
                      href={`${backendUrl}${doc.downloadUrl}`}
                      download
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                      title="Download Document"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <span className="text-slate-600 text-[11px]">Download Restricted</span>
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

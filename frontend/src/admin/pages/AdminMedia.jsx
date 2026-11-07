import React from 'react';
import { Image, UploadCloud, Film, FileText, CheckCircle2 } from 'lucide-react';

export const AdminMedia = () => {
  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Media & Videos Library</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage local video assets, project screenshots, certificates, and logos.
        </p>
      </div>

      {/* Upload Callout */}
      <div className="p-6 rounded-2xl bg-[#0f121d] border border-indigo-500/30 text-xs text-slate-300 space-y-3">
        <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
          <Film className="w-5 h-5" />
          <span>Local Video Directory Active</span>
        </div>
        <p className="text-slate-400 leading-relaxed">
          Your portfolio video folder is ready at: <code className="text-cyan-400 font-mono bg-black/40 px-2 py-0.5 rounded">frontend/public/videos/</code>.
          Any video dropped into that folder can be linked to your projects immediately in the Project Manager.
        </p>
        <div className="flex items-center gap-2 text-emerald-400 font-mono text-[11px]">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Supports .mp4, .webm, .mov with responsive aspect-ratio adaptation</span>
        </div>
      </div>
    </div>
  );
};

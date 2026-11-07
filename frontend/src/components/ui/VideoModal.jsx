import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, AlertCircle, Maximize2, Video, Sparkles } from 'lucide-react';

export const VideoModal = ({ isOpen, onClose, videoSrc, title, tags }) => {
  const [videoError, setVideoError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);

  if (!isOpen) return null;

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8">
        {/* Backdrop blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl max-h-[92vh] flex flex-col glass-card border border-indigo-500/30 rounded-2xl overflow-hidden shadow-2xl z-10"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/10 bg-slate-900/70">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-white truncate max-w-[200px] sm:max-w-md">
                  {title || 'Project Video Demo'}
                </h3>
                <p className="text-xs text-slate-400">
                  Source: <span className="text-indigo-300 font-mono">{videoSrc}</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Video Container (Responsive Aspect Ratio) */}
          <div className="relative w-full bg-black aspect-video flex items-center justify-center overflow-hidden">
            {!videoError ? (
              <video
                ref={videoRef}
                src={videoSrc}
                autoPlay
                playsInline
                controls
                className="w-full h-full object-contain"
                onError={() => setVideoError(true)}
              />
            ) : (
              /* User Upload Guidance Banner when video file is not yet placed in /public/videos */
              <div className="p-6 sm:p-10 text-center max-w-lg flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 animate-pulse">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-medium text-white mb-2">Video File Ready for Upload</h4>
                <p className="text-xs sm:text-sm text-slate-300 mb-4 leading-relaxed">
                  To display your custom video recording for <span className="text-indigo-400 font-medium">"{title}"</span>, simply copy your video file into:
                </p>
                <div className="w-full p-3 rounded-lg bg-slate-950 border border-indigo-500/20 text-xs font-mono text-cyan-400 break-all select-all mb-4">
                  frontend/public{videoSrc}
                </div>
                <p className="text-xs text-slate-400 italic">
                  Once you place the file, tell me: "I've uploaded the video", and we can fine-tune autoplay, ratios, or sound!
                </p>
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="px-4 sm:px-6 py-3 bg-slate-900/60 border-t border-white/5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              {tags?.map((tag, idx) => (
                <span key={idx} className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10">
                  {tag}
                </span>
              ))}
            </div>
            <div className="text-[11px] text-slate-500">
              Responsive Video Player • 1080p WebGL Integration
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

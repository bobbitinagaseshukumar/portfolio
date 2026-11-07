import React, { useState, useEffect } from 'react';
import { Menu, X, Smartphone, Monitor, Tablet, Code2, Send, Shield } from 'lucide-react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import { useScreenRatio } from '../../hooks/useScreenRatio';

export const Navbar = () => {
  const { personal } = usePortfolioData();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { ratioLabel, isMobile, isTablet, isDesktop } = useScreenRatio();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Education', href: '#education' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Documents', href: '#documents' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#090a0f]/80 backdrop-blur-md border-b border-white/10 py-3 shadow-lg shadow-black/40'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo with 3D glowing badge */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1.5px] shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#090a0f] rounded-[10px] flex items-center justify-center">
                <Code2 className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                {personal.displayName || personal.name || 'Kumar'}
              </span>
              <span className="text-[10px] text-slate-400 -mt-1 tracking-wider uppercase font-mono">
                Portfolio
              </span>
            </div>
          </a>

          {/* Real-time Screen Ratio Indicator Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-slate-300 shadow-inner">
            {isMobile && <Smartphone className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />}
            {isTablet && <Tablet className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />}
            {isDesktop && <Monitor className="w-3.5 h-3.5 text-purple-400 animate-pulse" />}
            <span className="text-slate-400">Viewport:</span>
            <span className="text-cyan-400 font-semibold">{ratioLabel}</span>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
            
            <a
              href="#contact"
              className="glow-btn px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white text-xs font-semibold flex items-center gap-2 hover:opacity-95"
            >
              <Send className="w-3.5 h-3.5" />
              Get in Touch
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href="#contact"
              className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-medium"
            >
              Contact
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-white/10 px-6 py-6 mt-3 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs text-slate-400 font-mono">
            <span>Viewport Screen Ratio:</span>
            <span className="text-cyan-400 font-semibold">{ratioLabel}</span>
          </div>

          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-slate-200 hover:text-indigo-400 py-1"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-2">
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full block text-center py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30"
            >
              Contact Me
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

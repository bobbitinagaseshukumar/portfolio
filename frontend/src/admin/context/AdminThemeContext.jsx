import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminThemeContext = createContext(null);

export const THEMES = {
  cyber: {
    id: 'cyber',
    name: 'Obsidian Cyber',
    accentColor: 'indigo',
    primary: '#6366f1',
    gradient: 'from-indigo-500 to-purple-600',
    cardBorder: 'hover:border-indigo-500/50',
    badge: 'border-indigo-500/30 text-indigo-400 bg-indigo-500/10',
    activeNav: 'bg-gradient-to-r from-indigo-600/30 to-purple-600/10 text-white border-l-2 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.25)]',
    orbColor: '#6366f1'
  },
  emerald: {
    id: 'emerald',
    name: 'Matrix Emerald',
    accentColor: 'emerald',
    primary: '#10b981',
    gradient: 'from-emerald-500 to-teal-600',
    cardBorder: 'hover:border-emerald-500/50',
    badge: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
    activeNav: 'bg-gradient-to-r from-emerald-600/30 to-teal-600/10 text-white border-l-2 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.25)]',
    orbColor: '#10b981'
  },
  violet: {
    id: 'violet',
    name: 'Cosmic Violet',
    accentColor: 'purple',
    primary: '#a855f7',
    gradient: 'from-purple-500 to-pink-600',
    cardBorder: 'hover:border-purple-500/50',
    badge: 'border-purple-500/30 text-purple-400 bg-purple-500/10',
    activeNav: 'bg-gradient-to-r from-purple-600/30 to-pink-600/10 text-white border-l-2 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.25)]',
    orbColor: '#a855f7'
  },
  cyan: {
    id: 'cyan',
    name: 'Neon Cyan',
    accentColor: 'cyan',
    primary: '#06b6d4',
    gradient: 'from-cyan-500 to-blue-600',
    cardBorder: 'hover:border-cyan-500/50',
    badge: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
    activeNav: 'bg-gradient-to-r from-cyan-600/30 to-blue-600/10 text-white border-l-2 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.25)]',
    orbColor: '#06b6d4'
  }
};

export const AdminThemeProvider = ({ children }) => {
  const [themeId, setThemeId] = useState(() => {
    return localStorage.getItem('admin_theme') || 'cyber';
  });

  const [threeDEnabled, setThreeDEnabled] = useState(() => {
    const saved = localStorage.getItem('admin_3d_enabled');
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    localStorage.setItem('admin_theme', themeId);
  }, [themeId]);

  useEffect(() => {
    localStorage.setItem('admin_3d_enabled', String(threeDEnabled));
  }, [threeDEnabled]);

  const currentTheme = THEMES[themeId] || THEMES.cyber;

  const toggle3D = () => setThreeDEnabled(prev => !prev);

  return (
    <AdminThemeContext.Provider value={{
      theme: currentTheme,
      themeId,
      setThemeId,
      themes: THEMES,
      threeDEnabled,
      toggle3D
    }}>
      {children}
    </AdminThemeContext.Provider>
  );
};

export const useAdminTheme = () => {
  const context = useContext(AdminThemeContext);
  if (!context) {
    return {
      theme: THEMES.cyber,
      themeId: 'cyber',
      setThemeId: () => {},
      themes: THEMES,
      threeDEnabled: true,
      toggle3D: () => {}
    };
  }
  return context;
};

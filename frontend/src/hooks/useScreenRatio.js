import { useState, useEffect } from 'react';

/**
 * Custom hook to calculate and react to exact viewport dimensions and aspect ratios.
 * Helps 3D scenes (Three.js/R3F) and CSS layouts seamlessly adapt between:
 * - Mobile Phones (9:16, 9:19.5, 9:20 vertical ratios)
 * - Tablets & Foldables (3:4, 4:3, 1:1 ratios)
 * - Laptops & Desktops (16:9, 16:10 standard ratios)
 * - Ultrawide Monitors (21:9, 32:9 ratios)
 */
export const useScreenRatio = () => {
  const getScreenInfo = () => {
    if (typeof window === 'undefined') {
      return {
        width: 1920,
        height: 1080,
        aspectRatio: 16 / 9,
        ratioLabel: '16:9',
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        isUltrawide: false,
        isPortrait: false,
        isLandscape: true,
        // Responsive 3D Camera settings
        cameraFov: 50,
        cameraDistance: 5.5,
        meshScale: 1.0
      };
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const ratio = width / height;

    const isMobile = width < 768;
    const isTablet = width >= 768 && width < 1024;
    const isDesktop = width >= 1024;
    const isUltrawide = ratio > 2.05;
    const isPortrait = ratio < 1.0;
    const isLandscape = !isPortrait;

    // Approximate closest standard ratio string for display
    let ratioLabel = `${ratio.toFixed(2)}:1`;
    if (ratio >= 2.05) ratioLabel = '21:9 (Ultrawide)';
    else if (ratio >= 1.7) ratioLabel = '16:9 (Widescreen)';
    else if (ratio >= 1.55) ratioLabel = '16:10 (Laptop)';
    else if (ratio >= 1.3) ratioLabel = '4:3 (Desktop/Tablet)';
    else if (ratio >= 0.95 && ratio <= 1.05) ratioLabel = '1:1 (Square)';
    else if (ratio >= 0.7) ratioLabel = '3:4 (Tablet Portrait)';
    else if (ratio >= 0.52) ratioLabel = '9:16 (Phone Portrait)';
    else ratioLabel = '9:19.5 (Tall Phone)';

    // Dynamic 3D Camera calculations:
    // When viewport gets narrower (mobile), we pull camera back or increase FOV
    // so 3D objects fit the screen without clipping.
    let cameraFov = 50;
    let cameraDistance = 5.5;
    let meshScale = 1.0;

    if (isMobile) {
      cameraFov = isPortrait ? 65 : 55;
      cameraDistance = isPortrait ? 6.8 : 5.8;
      meshScale = isPortrait ? 0.8 : 0.9;
    } else if (isTablet) {
      cameraFov = 55;
      cameraDistance = 6.0;
      meshScale = 0.95;
    } else if (isUltrawide) {
      cameraFov = 45;
      cameraDistance = 5.0;
      meshScale = 1.1;
    }

    return {
      width,
      height,
      aspectRatio: ratio,
      ratioLabel,
      isMobile,
      isTablet,
      isDesktop,
      isUltrawide,
      isPortrait,
      isLandscape,
      cameraFov,
      cameraDistance,
      meshScale
    };
  };

  const [screen, setScreen] = useState(getScreenInfo);

  useEffect(() => {
    let timeoutId = null;

    const handleResize = () => {
      // Debounce slightly to ensure smooth 60fps responsiveness during window dragging
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setScreen(getScreenInfo());
      }, 50);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return screen;
};

import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768;

function getIsMobile() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < MOBILE_BREAKPOINT || 'ontouchstart' in window;
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(getIsMobile);

  useEffect(() => {
    const handleResize = () => setIsMobile(getIsMobile());
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}

export const isMobileDevice = () => getIsMobile();

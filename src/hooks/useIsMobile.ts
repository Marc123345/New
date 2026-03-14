import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768;

function getIsMobile() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < MOBILE_BREAKPOINT || 'ontouchstart' in window;
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(getIsMobile);

  useEffect(() => {
    let timer = 0;
    const handleResize = () => {
      clearTimeout(timer);
      timer = window.setTimeout(() => setIsMobile(getIsMobile()), 150);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  return isMobile;
}

export const isMobileDevice = () => getIsMobile();

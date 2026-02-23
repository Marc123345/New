import { useEffect, useRef, useState } from 'react';

export function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const rafRef = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const updateProgress = () => {
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (documentHeight > 0) {
        setScrollProgress((window.scrollY / documentHeight) * 100);
      }
      ticking.current = false;
    };

    const handleScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        rafRef.current = requestAnimationFrame(updateProgress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-[var(--color-primary)]/10">
      <div
        className="h-full bg-[var(--color-secondary)]"
        style={{ width: `${scrollProgress}%`, willChange: 'width', transition: 'width 0.1s linear' }}
      />
    </div>
  );
}

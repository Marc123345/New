import { ReactNode, Suspense } from 'react';
import { useInView } from '../hooks/useInView';

interface LazySectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  threshold?: number;
  rootMargin?: string;
}

export function SectionLoader() {
  return (
    <div className="w-full h-96 flex items-center justify-center">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-[var(--color-primary)]/20 border-t-[var(--color-primary)] rounded-full animate-spin" />
        <div
          className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-[var(--color-secondary)]/40 rounded-full animate-spin"
          style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
        />
      </div>
    </div>
  );
}

export function LazySection({ 
  children, 
  fallback = <SectionLoader />,
  threshold = 0.1,
  rootMargin = '200px'
}: LazySectionProps) {
  const [ref, isInView] = useInView<HTMLDivElement>({ 
    threshold, 
    rootMargin,
    triggerOnce: true 
  });

  return (
    <div ref={ref} style={{ minHeight: '200px' }}>
      {isInView ? (
        <Suspense fallback={fallback}>
          {children}
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  );
}

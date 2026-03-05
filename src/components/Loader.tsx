import { useEffect } from 'react';

interface LoaderProps {
  onComplete: () => void;
}

export function Loader({ onComplete }: LoaderProps) {
  useEffect(() => {
    onComplete();
  }, [onComplete]);

  return null;
}

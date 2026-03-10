import { useRef, useEffect, useState } from 'react';
import UnicornScene from 'unicornstudio-react';

export function UnicornHero() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 1440, h: 900 });

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([entry]) => {
      const w = Math.round(entry.contentRect.width);
      const h = Math.round(entry.contentRect.height);
      if (w > 0 && h > 0) setDims({ w, h });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={{ width: '100%', height: '100%', overflow: 'hidden', display: 'block' }}
    >
      <UnicornScene
        projectId="rh6h5GYFeGfkd9WNb7Gx"
        width={`${dims.w}px`}
        height={`${dims.h}px`}
        scale={1}
        dpi={Math.min(window.devicePixelRatio, 2)}
        sdkUrl="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@2.1.3/dist/unicornStudio.umd.js"
        lazyLoad={false}
      />
    </div>
  );
}

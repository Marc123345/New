export function getButtonHoverHandlers(opts?: { guard?: () => boolean }) {
  return {
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      if (opts?.guard && !opts.guard()) return;
      e.currentTarget.style.boxShadow = 'var(--shadow-button-hover)';
      e.currentTarget.style.transform = 'translate(-2px, -2px)';
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      if (opts?.guard && !opts.guard()) return;
      e.currentTarget.style.boxShadow = 'var(--shadow-button)';
      e.currentTarget.style.transform = 'translate(0, 0)';
    },
  };
}

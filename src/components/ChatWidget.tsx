import { useState, useEffect, useRef } from "react";

const SHANNON_AVATAR = "https://ik.imagekit.io/qcvroy8xpd/1770306949175.jpeg?tr=f-auto,q-80";
const VIDEO_FOUNDER =
  "https://ik.imagekit.io/qcvroy8xpd/H2H%20SHANNON%20INTRODUCTION%20VIDEO%20FINAL%20V1.mp4";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Lock body scroll while the overlay is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Escape key closes the overlay
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Pause & reset video when closing
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (!open) {
      v.pause();
      v.currentTime = 0;
    }
  }, [open]);

  return (
    <>
      {/* ── Floating circular button + tooltip ── */}
      <div className="h2h-chat-wrap">
        <div
          className="h2h-chat-tooltip"
          role="status"
          aria-live="polite"
        >
          Meet our founder
          <span className="h2h-chat-tooltip__arrow" aria-hidden />
        </div>

        <button
          type="button"
          aria-label="Meet our founder — play video"
          onClick={() => setOpen(true)}
          className="h2h-chat-fab"
        >
          <span className="h2h-chat-fab__ring" aria-hidden />
          <span className="h2h-chat-fab__pulse" aria-hidden />
          <img
            src={SHANNON_AVATAR}
            alt=""
            className="h2h-chat-fab__img is-founder"
            style={{ objectFit: "cover" }}
          />
          <span className="h2h-chat-fab__dot" aria-hidden />
        </button>
      </div>

      {/* ── Overlay modal ── */}
      {open && (
        <div
          className="h2h-chat-overlay"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Meet the founder"
        >
          <div
            className="h2h-chat-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="h2h-chat-close"
            >
              ✕
            </button>

            {/* Single-tab header — clean label instead of tab row */}
            <div className="h2h-chat-header">
              <span className="h2h-chat-header__label">Meet the Founder</span>
            </div>

            {/* Video stage */}
            <div className="h2h-chat-stage">
              <video
                ref={videoRef}
                src={VIDEO_FOUNDER}
                controls
                autoPlay
                playsInline
                preload="auto"
                className="h2h-chat-video"
              />
            </div>
          </div>
        </div>
      )}

      <style>{`
        /* ── Wrapper so the tooltip can sit beside the FAB ── */
        .h2h-chat-wrap {
          position: fixed;
          right: clamp(16px, 2.5vw, 28px);
          bottom: clamp(16px, 2.5vw, 28px);
          z-index: 9998;
          display: flex;
          align-items: center;
          gap: 12px;
          pointer-events: none;
        }
        .h2h-chat-wrap > * { pointer-events: auto; }

        /* ── Tooltip bubble ── */
        .h2h-chat-tooltip {
          position: relative;
          background: #ffffff;
          color: var(--color-primary, #291e56);
          font-family: var(--font-stack-heading, system-ui, sans-serif);
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 0.02em;
          padding: 10px 16px;
          border-radius: 999px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.25), 0 0 0 1px rgba(164,108,252,0.25);
          white-space: nowrap;
          animation: h2hTipIn 0.5s cubic-bezier(0.22, 1, 0.36, 1);
          max-width: 180px;
        }
        .h2h-chat-tooltip__arrow {
          position: absolute;
          right: -6px;
          top: 50%;
          transform: translateY(-50%) rotate(45deg);
          width: 12px;
          height: 12px;
          background: #ffffff;
          box-shadow: 1px -1px 0 rgba(164,108,252,0.25);
        }
        @keyframes h2hTipIn {
          0%   { opacity: 0; transform: translateX(12px) scale(0.9); }
          60%  { opacity: 1; transform: translateX(-2px) scale(1.02); }
          100% { opacity: 1; transform: translateX(0)    scale(1); }
        }

        /* ── Floating button ── */
        .h2h-chat-fab {
          position: relative;
          width: clamp(64px, 8vw, 78px);
          height: clamp(64px, 8vw, 78px);
          border-radius: 50%;
          border: 3px solid #ffffff;
          padding: 0;
          background: var(--color-primary, #291e56);
          cursor: pointer;
          box-shadow: 0 10px 30px rgba(0,0,0,0.35), 0 0 0 4px rgba(164,108,252,0.25);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          overflow: visible;
          flex-shrink: 0;
        }
        .h2h-chat-fab:hover {
          transform: translateY(-3px) scale(1.04);
          box-shadow: 0 14px 36px rgba(0,0,0,0.4), 0 0 0 6px rgba(164,108,252,0.35);
        }
        .h2h-chat-fab:focus-visible {
          outline: 3px solid var(--color-secondary, #a46cfc);
          outline-offset: 4px;
        }
        .h2h-chat-fab__img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          display: block;
          pointer-events: none;
          animation: h2hImgSwap 0.55s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .h2h-chat-fab__img.is-about {
          padding: 14px;
          background: var(--color-primary, #291e56);
        }
        @keyframes h2hImgSwap {
          0%   { opacity: 0; transform: scale(0.85) rotate(-8deg); }
          100% { opacity: 1; transform: scale(1)    rotate(0); }
        }
        .h2h-chat-fab__ring {
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          border: 1.5px dashed rgba(164,108,252,0.55);
          animation: h2hChatSpin 14s linear infinite;
          pointer-events: none;
        }
        .h2h-chat-fab__pulse {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          box-shadow: 0 0 0 0 rgba(164,108,252,0.55);
          animation: h2hChatPulse 2.4s ease-out infinite;
          pointer-events: none;
        }
        .h2h-chat-fab__dot {
          position: absolute;
          right: 4px;
          bottom: 4px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #22c55e;
          border: 2px solid #ffffff;
          box-shadow: 0 0 0 0 rgba(34,197,94,0.6);
          animation: h2hChatDot 2s ease-out infinite;
        }
        @keyframes h2hChatSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes h2hChatPulse {
          0%   { box-shadow: 0 0 0 0   rgba(164,108,252,0.55); }
          70%  { box-shadow: 0 0 0 22px rgba(164,108,252,0); }
          100% { box-shadow: 0 0 0 0   rgba(164,108,252,0); }
        }
        @keyframes h2hChatDot {
          0%   { box-shadow: 0 0 0 0   rgba(34,197,94,0.6); }
          70%  { box-shadow: 0 0 0 10px rgba(34,197,94,0); }
          100% { box-shadow: 0 0 0 0   rgba(34,197,94,0); }
        }

        /* ── Overlay ── */
        /* Mobile gets a solid backdrop; desktop gets the blur. iOS Safari's
           backdrop-filter triggers a layer-recomposite on every fade-in frame
           which stutters the modal open. */
        .h2h-chat-overlay {
          position: fixed;
          inset: 0;
          background: rgba(6, 3, 18, 0.96);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(12px, 3vw, 32px);
          animation: h2hChatFade 0.25s ease-out;
        }
        @media (min-width: 769px) {
          .h2h-chat-overlay {
            background: rgba(6, 3, 18, 0.88);
            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);
          }
        }
        @keyframes h2hChatFade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .h2h-chat-modal {
          position: relative;
          width: 100%;
          max-width: 960px;
          background: #1a1040;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 16px;
          box-shadow: 0 24px 80px rgba(0,0,0,0.6), var(--shadow-geometric, 10px 10px 0 #a46cfc);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: h2hChatPop 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }
        @keyframes h2hChatPop {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
        .h2h-chat-close {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,0.25);
          background: rgba(255,255,255,0.08);
          color: #ffffff;
          font-size: 18px;
          line-height: 1;
          cursor: pointer;
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .h2h-chat-close:hover {
          background: rgba(255,255,255,0.18);
          transform: rotate(90deg);
        }

        /* ── Header label (single "Meet the Founder" title) ── */
        .h2h-chat-header {
          padding: clamp(18px, 2.5vw, 24px) clamp(16px, 2.5vw, 28px);
          padding-right: 64px; /* leave room for close button */
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .h2h-chat-header__label {
          display: inline-block;
          color: #ffffff;
          font-family: var(--font-stack-heading, system-ui, sans-serif);
          font-size: clamp(0.85rem, 1.3vw, 1rem);
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding-bottom: 6px;
          border-bottom: 3px solid var(--color-secondary, #a46cfc);
        }

        /* ── Video stage ── */
        .h2h-chat-stage {
          background: #000;
          aspect-ratio: 16 / 9;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .h2h-chat-video {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
        }

        /* ── Mobile tweaks ── */
        @media (max-width: 640px) {
          .h2h-chat-tooltip {
            font-size: 11px;
            padding: 8px 12px;
            max-width: 140px;
          }
          .h2h-chat-wrap {
            gap: 8px;
          }
          .h2h-chat-modal {
            max-width: 100%;
            border-radius: 14px;
          }
          .h2h-chat-header {
            padding: 14px 12px;
            padding-right: 52px;
          }
          .h2h-chat-header__label {
            font-size: 0.72rem;
            letter-spacing: 0.1em;
          }
          .h2h-chat-close {
            top: 8px;
            right: 8px;
            width: 34px;
            height: 34px;
            font-size: 16px;
          }
        }
      `}</style>
    </>
  );
}

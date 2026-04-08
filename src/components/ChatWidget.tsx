import { useState, useEffect, useRef } from "react";

const SHANNON_AVATAR = "https://ik.imagekit.io/qcvroy8xpd/1770306949175.jpeg?tr=f-auto,q-80";
const VIDEO_FOUNDER =
  "https://ik.imagekit.io/qcvroy8xpd/H2H%20SHANNON%20INTRODUCTION%20VIDEO%20FINAL%20V1.mp4";

type Overlay = null | "video" | "chat";

export function ChatWidget() {
  const [overlay, setOverlay] = useState<Overlay>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const agentRef = useRef<HTMLDivElement>(null);
  const agentLoaded = useRef(false);

  // Lock body scroll
  useEffect(() => {
    if (!overlay) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [overlay]);

  // Escape key
  useEffect(() => {
    if (!overlay) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOverlay(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [overlay]);

  // Pause video when closed
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (overlay !== "video") { v.pause(); v.currentTime = 0; }
  }, [overlay]);

  // Load agent on first open
  useEffect(() => {
    if (overlay !== "chat" || agentLoaded.current || !agentRef.current) return;
    const iframe = document.createElement("iframe");
    iframe.id = "JotFormIFrame-widget-agent";
    iframe.title = "Darius: Digital Marketing Consultant";
    iframe.src = "https://agent.jotform.com/019d6d549dcd7547a9afe8a31ffe982e36dc?embedMode=iframe&autofocus=0&background=1&shadow=1";
    iframe.style.cssText = "max-width:100%;height:688px;border:none;width:100%;";
    iframe.setAttribute("allowtransparency", "true");
    iframe.setAttribute("allow", "geolocation; microphone; camera; fullscreen");
    iframe.setAttribute("frameborder", "0");
    iframe.scrolling = "no";
    agentRef.current.appendChild(iframe);

    const handler = document.createElement("script");
    handler.src = "https://cdn.jotfor.ms/s/umd/33c1343dc9e/for-form-embed-handler.js";
    handler.onload = () => {
      (window as any).jotformEmbedHandler?.(
        "iframe[id='JotFormIFrame-widget-agent']",
        "https://www.jotform.com"
      );
    };
    document.body.appendChild(handler);
    agentLoaded.current = true;
    return () => { handler.remove(); };
  }, [overlay]);

  return (
    <>
      {/* ── Floating buttons ── */}
      <div className="h2h-chat-wrap">
        <div className="h2h-chat-tooltip" role="status" aria-live="polite">
          Meet our founder
          <span className="h2h-chat-tooltip__arrow" aria-hidden />
        </div>

        <div className="h2h-chat-stack">
          <button
            type="button"
            aria-label="Chat with Darius"
            onClick={() => setOverlay("chat")}
            className="h2h-chat-us"
          >
            Chat with Us
          </button>

          <button
            type="button"
            aria-label="Meet our founder — play video"
            onClick={() => setOverlay("video")}
            className="h2h-chat-fab"
          >
            <span className="h2h-chat-fab__ring" aria-hidden />
            <span className="h2h-chat-fab__pulse" aria-hidden />
            <img src={SHANNON_AVATAR} alt="" className="h2h-chat-fab__img" style={{ objectFit: "cover" }} />
            <span className="h2h-chat-fab__dot" aria-hidden />
          </button>
        </div>
      </div>

      {/* ── VIDEO OVERLAY ── */}
      {overlay === "video" && (
        <div className="h2h-overlay" onClick={() => setOverlay(null)} role="dialog" aria-modal="true" aria-label="Meet the founder">
          <div className="h2h-overlay__modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" aria-label="Close" onClick={() => setOverlay(null)} className="h2h-overlay__close">✕</button>
            <div className="h2h-overlay__header">
              <span className="h2h-overlay__label">Meet the Founder</span>
            </div>
            <div className="h2h-overlay__video-stage">
              <video ref={videoRef} src={VIDEO_FOUNDER} controls autoPlay playsInline preload="auto" className="h2h-overlay__video" />
            </div>
          </div>
        </div>
      )}

      {/* ── CHAT OVERLAY ── */}
      {overlay === "chat" && (
        <div className="h2h-overlay" onClick={() => setOverlay(null)} role="dialog" aria-modal="true" aria-label="Chat with Darius">
          <div className="h2h-overlay__chat" onClick={(e) => e.stopPropagation()}>
            <button type="button" aria-label="Close" onClick={() => setOverlay(null)} className="h2h-overlay__close">✕</button>
            <div className="h2h-overlay__header">
              <span className="h2h-overlay__label">Chat with Darius</span>
            </div>
            <div ref={agentRef} className="h2h-overlay__agent" />
          </div>
        </div>
      )}

      <style>{`
        /* ── FAB wrapper ── */
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
        .h2h-chat-stack {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .h2h-chat-us {
          background: var(--color-secondary, #a46cfc);
          color: #fff;
          font-family: var(--font-stack-heading, system-ui, sans-serif);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 10px 18px;
          border-radius: 999px;
          border: 2px solid rgba(255,255,255,0.25);
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(164,108,252,0.35);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          white-space: nowrap;
          animation: h2hTipIn 0.5s cubic-bezier(0.22,1,0.36,1);
        }
        .h2h-chat-us:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 24px rgba(164,108,252,0.5);
        }

        /* ── Tooltip ── */
        .h2h-chat-tooltip {
          position: relative;
          background: #fff;
          color: var(--color-primary, #291e56);
          font-family: var(--font-stack-heading, system-ui, sans-serif);
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 0.02em;
          padding: 10px 16px;
          border-radius: 999px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.25), 0 0 0 1px rgba(164,108,252,0.25);
          white-space: nowrap;
          animation: h2hTipIn 0.5s cubic-bezier(0.22,1,0.36,1);
          max-width: 180px;
        }
        .h2h-chat-tooltip__arrow {
          position: absolute;
          right: -6px;
          top: 50%;
          transform: translateY(-50%) rotate(45deg);
          width: 12px;
          height: 12px;
          background: #fff;
          box-shadow: 1px -1px 0 rgba(164,108,252,0.25);
        }
        @keyframes h2hTipIn {
          0%   { opacity:0; transform: translateX(12px) scale(0.9); }
          60%  { opacity:1; transform: translateX(-2px) scale(1.02); }
          100% { opacity:1; transform: translateX(0) scale(1); }
        }

        /* ── FAB button ── */
        .h2h-chat-fab {
          position: relative;
          width: clamp(64px,8vw,78px);
          height: clamp(64px,8vw,78px);
          border-radius: 50%;
          border: 3px solid #fff;
          padding: 0;
          background: var(--color-primary, #291e56);
          cursor: pointer;
          box-shadow: 0 10px 30px rgba(0,0,0,0.35), 0 0 0 4px rgba(164,108,252,0.25);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          overflow: visible;
          flex-shrink: 0;
        }
        .h2h-chat-fab:hover { transform: translateY(-3px) scale(1.04); box-shadow: 0 14px 36px rgba(0,0,0,0.4), 0 0 0 6px rgba(164,108,252,0.35); }
        .h2h-chat-fab__img { position: absolute; inset: 0; width: 100%; height: 100%; border-radius: 50%; display: block; pointer-events: none; }
        .h2h-chat-fab__ring { position: absolute; inset: -8px; border-radius: 50%; border: 1.5px dashed rgba(164,108,252,0.55); animation: spin 14s linear infinite; pointer-events: none; }
        .h2h-chat-fab__pulse { position: absolute; inset: 0; border-radius: 50%; box-shadow: 0 0 0 0 rgba(164,108,252,0.55); animation: pulse 2.4s ease-out infinite; pointer-events: none; }
        .h2h-chat-fab__dot { position: absolute; right: 4px; bottom: 4px; width: 14px; height: 14px; border-radius: 50%; background: #22c55e; border: 2px solid #fff; box-shadow: 0 0 0 0 rgba(34,197,94,0.6); animation: dot 2s ease-out infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(164,108,252,0.55); } 70% { box-shadow: 0 0 0 22px rgba(164,108,252,0); } 100% { box-shadow: 0 0 0 0 rgba(164,108,252,0); } }
        @keyframes dot { 0% { box-shadow: 0 0 0 0 rgba(34,197,94,0.6); } 70% { box-shadow: 0 0 0 10px rgba(34,197,94,0); } 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); } }

        /* ── Shared overlay backdrop ── */
        .h2h-overlay {
          position: fixed;
          inset: 0;
          background: rgba(6,3,18,0.96);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(12px,3vw,32px);
          animation: fadeIn 0.25s ease-out;
        }
        @media (min-width: 769px) {
          .h2h-overlay { background: rgba(6,3,18,0.88); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); }
        }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }

        .h2h-overlay__close {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,0.25);
          background: rgba(255,255,255,0.08);
          color: #fff;
          font-size: 18px;
          cursor: pointer;
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s, transform 0.2s;
        }
        .h2h-overlay__close:hover { background: rgba(255,255,255,0.18); transform: rotate(90deg); }

        .h2h-overlay__header {
          padding: clamp(16px,2.5vw,24px) clamp(16px,2.5vw,28px);
          padding-right: 64px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .h2h-overlay__label {
          display: inline-block;
          color: #fff;
          font-family: var(--font-stack-heading, system-ui, sans-serif);
          font-size: clamp(0.85rem,1.3vw,1rem);
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          padding-bottom: 6px;
          border-bottom: 3px solid var(--color-secondary, #a46cfc);
        }

        /* ── Video modal ── */
        .h2h-overlay__modal {
          position: relative;
          width: 100%;
          max-width: 960px;
          background: #1a1040;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 16px;
          box-shadow: 0 24px 80px rgba(0,0,0,0.6), var(--shadow-geometric, 10px 10px 0 #a46cfc);
          overflow: hidden;
          animation: popIn 0.35s cubic-bezier(0.22,1,0.36,1);
        }
        .h2h-overlay__video-stage {
          background: #000;
          aspect-ratio: 16 / 9;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .h2h-overlay__video { width: 100%; height: 100%; object-fit: contain; display: block; }

        /* ── Chat modal ── */
        .h2h-overlay__chat {
          position: relative;
          width: 100%;
          max-width: 700px;
          background: #1a1040;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 16px;
          box-shadow: 0 24px 80px rgba(0,0,0,0.6), var(--shadow-geometric, 10px 10px 0 #a46cfc);
          overflow: visible;
          animation: popIn 0.35s cubic-bezier(0.22,1,0.36,1);
        }
        .h2h-overlay__agent {
          overflow: visible;
        }

        @keyframes popIn {
          from { opacity:0; transform: translateY(16px) scale(0.97); }
          to { opacity:1; transform: translateY(0) scale(1); }
        }

        /* ── Mobile ── */
        @media (max-width: 640px) {
          .h2h-chat-tooltip { font-size: 11px; padding: 8px 12px; max-width: 140px; }
          .h2h-chat-wrap { gap: 8px; }
          .h2h-chat-us { font-size: 10px; padding: 8px 14px; }
          .h2h-overlay__modal { border-radius: 14px; }
          .h2h-overlay__chat { max-width: 100%; border-radius: 14px; }
          .h2h-overlay__header { padding: 14px 12px; padding-right: 52px; }
          .h2h-overlay__label { font-size: 0.72rem; letter-spacing: 0.1em; }
          .h2h-overlay__close { top: 8px; right: 8px; width: 36px; height: 36px; font-size: 16px; }
        }
      `}</style>
    </>
  );
}

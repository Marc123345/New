import { useState, useEffect, useRef } from "react";

const SHANNON_AVATAR = "https://ik.imagekit.io/qcvroy8xpd/1770306949175.jpeg?tr=f-auto,q-80";
const VIDEO_FOUNDER =
  "https://ik.imagekit.io/qcvroy8xpd/H2H%20SHANNON%20INTRODUCTION%20VIDEO%20FINAL%20V1.mp4";
const AGENT_ID = "019d6d549dcd7547a9afe8a31ffe982e36dc";

type Tab = "video" | "chat";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("video");
  const videoRef = useRef<HTMLVideoElement>(null);
  const agentRef = useRef<HTMLDivElement>(null);
  const agentLoaded = useRef(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (!open || tab !== "video") { v.pause(); v.currentTime = 0; }
  }, [open, tab]);

  useEffect(() => {
    if (!open || tab !== "chat" || agentLoaded.current || !agentRef.current) return;
    const iframe = document.createElement("iframe");
    iframe.id = `JotFormIFrame-${AGENT_ID}`;
    iframe.title = "Darius: Digital Marketing Consultant";
    iframe.setAttribute("allowtransparency", "true");
    iframe.setAttribute("allow", "geolocation; microphone; camera; fullscreen");
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("scrolling", "no");
    iframe.src = `https://agent.jotform.com/${AGENT_ID}?embedMode=iframe&autofocus=0&background=1&shadow=1`;
    iframe.style.cssText = "max-width:100%;height:688px;border:none;width:100%;";
    agentRef.current.appendChild(iframe);

    const handler = document.createElement("script");
    handler.src = "https://cdn.jotfor.ms/s/umd/33c1343dc9e/for-form-embed-handler.js";
    handler.onload = () => {
      (window as any).jotformEmbedHandler?.(
        `iframe[id='JotFormIFrame-${AGENT_ID}']`,
        "https://www.jotform.com"
      );
    };
    document.body.appendChild(handler);
    agentLoaded.current = true;
    return () => { handler.remove(); };
  }, [open, tab]);

  return (
    <>
      {/* ── Single FAB — Meet our founder ── */}
      <div className="h2h-fab-wrap">
        <div className="h2h-fab-tip">
          Meet our founder
          <span className="h2h-fab-tip__arrow" aria-hidden />
        </div>
        <button
          type="button"
          aria-label="Meet our founder"
          onClick={() => { setTab("video"); setOpen(true); }}
          className="h2h-fab"
        >
          <span className="h2h-fab__ring" aria-hidden />
          <span className="h2h-fab__pulse" aria-hidden />
          <img src={SHANNON_AVATAR} alt="" className="h2h-fab__img" style={{ objectFit: "cover" }} />
          <span className="h2h-fab__dot" aria-hidden />
        </button>
      </div>

      {/* ── Overlay with two tabs ── */}
      {open && (
        <div className="h2h-ov" onClick={() => setOpen(false)} role="dialog" aria-modal="true">
          <div className="h2h-ov__modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" aria-label="Close" onClick={() => setOpen(false)} className="h2h-ov__close">✕</button>

            {/* Tabs */}
            <div className="h2h-ov__tabs">
              <button
                type="button"
                className={`h2h-ov__tab ${tab === "video" ? "h2h-ov__tab--on" : ""}`}
                onClick={() => setTab("video")}
              >
                Meet the Founder
              </button>
              <button
                type="button"
                className={`h2h-ov__tab ${tab === "chat" ? "h2h-ov__tab--on" : ""}`}
                onClick={() => setTab("chat")}
              >
                Chat with Us
              </button>
            </div>

            {/* Video */}
            <div style={{ display: tab === "video" ? "block" : "none" }}>
              <div className="h2h-ov__video-wrap">
                <video
                  ref={videoRef}
                  src={VIDEO_FOUNDER}
                  controls
                  autoPlay={tab === "video"}
                  playsInline
                  preload="auto"
                  style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
                />
              </div>
            </div>

            {/* Agent */}
            <div ref={agentRef} style={{ display: tab === "chat" ? "block" : "none" }} />
          </div>
        </div>
      )}

      <style>{`
        .h2h-fab-wrap {
          position: fixed; right: clamp(16px,2.5vw,28px); bottom: clamp(16px,2.5vw,28px);
          z-index: 9998; display: flex; align-items: center; gap: 12px; pointer-events: none;
        }
        .h2h-fab-wrap > * { pointer-events: auto; }

        .h2h-fab-tip {
          position: relative; background: #fff;
          color: var(--color-primary,#291e56);
          font-family: var(--font-stack-heading,system-ui,sans-serif);
          font-weight: 700; font-size: 13px; letter-spacing: 0.02em;
          padding: 10px 16px; border-radius: 999px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.25), 0 0 0 1px rgba(164,108,252,0.25);
          white-space: nowrap; max-width: 180px;
          animation: tipIn 0.5s cubic-bezier(0.22,1,0.36,1);
        }
        .h2h-fab-tip__arrow {
          position: absolute; right: -6px; top: 50%;
          transform: translateY(-50%) rotate(45deg);
          width: 12px; height: 12px; background: #fff;
          box-shadow: 1px -1px 0 rgba(164,108,252,0.25);
        }
        @keyframes tipIn { 0%{opacity:0;transform:translateX(12px) scale(0.9)} 60%{opacity:1;transform:translateX(-2px) scale(1.02)} 100%{opacity:1;transform:translateX(0) scale(1)} }

        .h2h-fab {
          position: relative; width: clamp(64px,8vw,78px); height: clamp(64px,8vw,78px);
          border-radius: 50%; border: 3px solid #fff; padding: 0;
          background: var(--color-primary,#291e56); cursor: pointer;
          box-shadow: 0 10px 30px rgba(0,0,0,0.35), 0 0 0 4px rgba(164,108,252,0.25);
          transition: transform 0.25s, box-shadow 0.25s; overflow: visible; flex-shrink: 0;
        }
        .h2h-fab:hover { transform: translateY(-3px) scale(1.04); box-shadow: 0 14px 36px rgba(0,0,0,0.4), 0 0 0 6px rgba(164,108,252,0.35); }
        .h2h-fab__img { position: absolute; inset: 0; width: 100%; height: 100%; border-radius: 50%; display: block; pointer-events: none; }
        .h2h-fab__ring { position: absolute; inset: -8px; border-radius: 50%; border: 1.5px dashed rgba(164,108,252,0.55); animation: spin 14s linear infinite; pointer-events: none; }
        .h2h-fab__pulse { position: absolute; inset: 0; border-radius: 50%; box-shadow: 0 0 0 0 rgba(164,108,252,0.55); animation: pulse 2.4s ease-out infinite; pointer-events: none; }
        .h2h-fab__dot { position: absolute; right: 4px; bottom: 4px; width: 14px; height: 14px; border-radius: 50%; background: #22c55e; border: 2px solid #fff; animation: dot 2s ease-out infinite; }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes pulse { 0%{box-shadow:0 0 0 0 rgba(164,108,252,0.55)} 70%{box-shadow:0 0 0 22px rgba(164,108,252,0)} 100%{box-shadow:0 0 0 0 rgba(164,108,252,0)} }
        @keyframes dot { 0%{box-shadow:0 0 0 0 rgba(34,197,94,0.6)} 70%{box-shadow:0 0 0 10px rgba(34,197,94,0)} 100%{box-shadow:0 0 0 0 rgba(34,197,94,0)} }

        /* Overlay */
        .h2h-ov {
          position: fixed; inset: 0; background: rgba(6,3,18,0.96);
          z-index: 9999; display: flex; align-items: flex-start; justify-content: center;
          padding: clamp(12px,3vw,32px); padding-top: clamp(20px,4vw,48px);
          animation: fadeIn 0.25s ease-out; overflow-y: auto;
        }
        @media (min-width:769px) { .h2h-ov { background:rgba(6,3,18,0.88); backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px); } }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }

        .h2h-ov__modal {
          position: relative; width: 100%; max-width: 960px;
          background: #1a1040; border: 1px solid rgba(255,255,255,0.15);
          border-radius: 16px;
          box-shadow: 0 24px 80px rgba(0,0,0,0.6), var(--shadow-geometric, 10px 10px 0 #a46cfc);
          animation: popIn 0.35s cubic-bezier(0.22,1,0.36,1);
          overflow: visible;
        }
        @keyframes popIn { from{opacity:0;transform:translateY(16px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }

        .h2h-ov__close {
          position: absolute; top: 12px; right: 12px; width: 44px; height: 44px;
          border-radius: 50%; border: 1.5px solid rgba(255,255,255,0.25);
          background: rgba(255,255,255,0.08); color: #fff; font-size: 18px;
          cursor: pointer; z-index: 5; display: flex; align-items: center; justify-content: center;
          transition: background 0.2s, transform 0.2s;
        }
        .h2h-ov__close:hover { background: rgba(255,255,255,0.18); transform: rotate(90deg); }

        /* Tabs */
        .h2h-ov__tabs {
          display: flex; border-bottom: 1px solid rgba(255,255,255,0.1); padding-right: 56px;
        }
        .h2h-ov__tab {
          flex: 1; padding: clamp(14px,2.5vw,20px) clamp(12px,2vw,24px);
          background: none; border: none;
          color: rgba(255,255,255,0.35);
          font-family: var(--font-stack-heading,system-ui,sans-serif);
          font-size: clamp(0.7rem,1.3vw,0.85rem); font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          cursor: pointer; transition: color 0.2s;
          border-bottom: 3px solid transparent; margin-bottom: -1px;
        }
        .h2h-ov__tab:hover { color: rgba(255,255,255,0.7); }
        .h2h-ov__tab--on { color: #fff; border-bottom-color: var(--color-secondary,#a46cfc); }

        .h2h-ov__video-wrap { background: #000; aspect-ratio: 16/9; width: 100%; }

        @media (max-width:640px) {
          .h2h-fab-tip { font-size: 11px; padding: 8px 12px; max-width: 140px; }
          .h2h-fab-wrap { gap: 8px; }
          .h2h-ov__modal { border-radius: 14px; }
          .h2h-ov__tab { font-size: 0.65rem; letter-spacing: 0.08em; padding: 12px 8px; }
          .h2h-ov__close { top: 8px; right: 8px; width: 36px; height: 36px; font-size: 16px; }
        }
      `}</style>
    </>
  );
}

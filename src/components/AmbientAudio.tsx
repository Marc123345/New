import { useState, useRef, useCallback, useEffect } from 'react';

const FADE_DURATION = 1.5;
const MASTER_VOLUME = 0.18;

function createAmbientNodes(ctx: AudioContext, master: GainNode) {
  const nodes: { stop: () => void }[] = [];

  const pad = (freq: number, detune: number, vol: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    osc.type = 'sine';
    osc.frequency.value = freq;
    osc.detune.value = detune;
    filter.type = 'lowpass';
    filter.frequency.value = 800;
    filter.Q.value = 0.5;
    gain.gain.value = vol;
    osc.connect(filter).connect(gain).connect(master);
    osc.start();
    nodes.push({ stop: () => { osc.stop(); osc.disconnect(); gain.disconnect(); filter.disconnect(); } });
    return osc;
  };

  pad(55, 0, 0.25);
  pad(82.41, 5, 0.18);
  pad(110, -3, 0.15);
  pad(164.81, 8, 0.08);
  pad(220, -5, 0.05);

  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.type = 'sine';
  lfo.frequency.value = 0.08;
  lfoGain.gain.value = 0.03;
  lfo.connect(lfoGain).connect(master.gain);
  lfo.start();
  nodes.push({ stop: () => { lfo.stop(); lfo.disconnect(); lfoGain.disconnect(); } });

  const noiseLen = ctx.sampleRate * 2;
  const noiseBuffer = ctx.createBuffer(1, noiseLen, ctx.sampleRate);
  const noiseData = noiseBuffer.getChannelData(0);
  for (let i = 0; i < noiseLen; i++) noiseData[i] = (Math.random() * 2 - 1) * 0.015;
  const noiseSrc = ctx.createBufferSource();
  const noiseFilter = ctx.createBiquadFilter();
  const noiseGain = ctx.createGain();
  noiseSrc.buffer = noiseBuffer;
  noiseSrc.loop = true;
  noiseFilter.type = 'bandpass';
  noiseFilter.frequency.value = 400;
  noiseFilter.Q.value = 0.3;
  noiseGain.gain.value = 0.6;
  noiseSrc.connect(noiseFilter).connect(noiseGain).connect(master);
  noiseSrc.start();
  nodes.push({ stop: () => { noiseSrc.stop(); noiseSrc.disconnect(); noiseFilter.disconnect(); noiseGain.disconnect(); } });

  return nodes;
}

export function AmbientAudio() {
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const nodesRef = useRef<{ stop: () => void }[]>([]);
  const autoStartedRef = useRef(false);

  const startAudio = useCallback(() => {
    if (ctxRef.current) return;
    const ctx = new AudioContext();
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    master.gain.linearRampToValueAtTime(MASTER_VOLUME, ctx.currentTime + FADE_DURATION);
    ctxRef.current = ctx;
    masterRef.current = master;
    nodesRef.current = createAmbientNodes(ctx, master);
    setPlaying(true);
  }, []);

  const stopAudio = useCallback(() => {
    const master = masterRef.current;
    const ctx = ctxRef.current;
    if (master && ctx) {
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + FADE_DURATION);
      setTimeout(() => {
        nodesRef.current.forEach((n) => { try { n.stop(); } catch {} });
        nodesRef.current = [];
        ctx.close();
        ctxRef.current = null;
        masterRef.current = null;
      }, FADE_DURATION * 1000 + 100);
    }
    setPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (playing) stopAudio();
    else startAudio();
  }, [playing, startAudio, stopAudio]);

  useEffect(() => {
    const autoStart = () => {
      if (autoStartedRef.current) return;
      autoStartedRef.current = true;
      startAudio();
      window.removeEventListener('click', autoStart);
      window.removeEventListener('scroll', autoStart);
      window.removeEventListener('keydown', autoStart);
      window.removeEventListener('touchstart', autoStart);
    };
    window.addEventListener('click', autoStart, { once: false, passive: true });
    window.addEventListener('scroll', autoStart, { once: false, passive: true });
    window.addEventListener('keydown', autoStart, { once: false, passive: true });
    window.addEventListener('touchstart', autoStart, { once: false, passive: true });
    return () => {
      window.removeEventListener('click', autoStart);
      window.removeEventListener('scroll', autoStart);
      window.removeEventListener('keydown', autoStart);
      window.removeEventListener('touchstart', autoStart);
    };
  }, [startAudio]);

  useEffect(() => {
    return () => {
      nodesRef.current.forEach((n) => { try { n.stop(); } catch {} });
      ctxRef.current?.close();
    };
  }, []);

  return (
    <button
      onClick={toggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={playing ? 'Mute ambient sound' : 'Play ambient sound'}
      style={{
        position: 'fixed',
        bottom: 32,
        right: 32,
        zIndex: 90,
        width: 48,
        height: 48,
        borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.1)',
        background: hovered
          ? 'rgba(255,255,255,0.08)'
          : 'rgba(4,6,8,0.7)',
        backdropFilter: 'blur(12px)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        boxShadow: playing
          ? '0 0 20px rgba(164,108,252,0.15), 0 0 40px rgba(164,108,252,0.05)'
          : '0 4px 20px rgba(0,0,0,0.3)',
        transform: hovered ? 'scale(1.08)' : 'scale(1)',
      }}
    >
      {playing ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.8 }}>
          <rect x="3" y="8" width="3" height="8" rx="1" fill="rgba(255,255,255,0.85)">
            <animate attributeName="height" values="8;14;8" dur="1.2s" repeatCount="indefinite" />
            <animate attributeName="y" values="8;5;8" dur="1.2s" repeatCount="indefinite" />
          </rect>
          <rect x="8.5" y="5" width="3" height="14" rx="1" fill="rgba(255,255,255,0.85)">
            <animate attributeName="height" values="14;6;14" dur="1s" repeatCount="indefinite" />
            <animate attributeName="y" values="5;9;5" dur="1s" repeatCount="indefinite" />
          </rect>
          <rect x="14" y="7" width="3" height="10" rx="1" fill="rgba(255,255,255,0.85)">
            <animate attributeName="height" values="10;16;10" dur="1.4s" repeatCount="indefinite" />
            <animate attributeName="y" values="7;4;7" dur="1.4s" repeatCount="indefinite" />
          </rect>
          <rect x="19.5" y="9" width="3" height="6" rx="1" fill="rgba(255,255,255,0.85)">
            <animate attributeName="height" values="6;12;6" dur="0.9s" repeatCount="indefinite" />
            <animate attributeName="y" values="9;6;9" dur="0.9s" repeatCount="indefinite" />
          </rect>
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.5 }}>
          <rect x="3" y="10" width="3" height="4" rx="1" fill="rgba(255,255,255,0.6)" />
          <rect x="8.5" y="10" width="3" height="4" rx="1" fill="rgba(255,255,255,0.6)" />
          <rect x="14" y="10" width="3" height="4" rx="1" fill="rgba(255,255,255,0.6)" />
          <rect x="19.5" y="10" width="3" height="4" rx="1" fill="rgba(255,255,255,0.6)" />
        </svg>
      )}
    </button>
  );
}

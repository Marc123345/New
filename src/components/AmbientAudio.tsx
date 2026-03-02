import { useState, useRef, useCallback, useEffect } from 'react';

const FADE_DURATION = 2.5;
const MASTER_VOLUME = 0.22;

type StoppableNode = { stop: () => void };

function createCinematicNodes(ctx: AudioContext, master: GainNode) {
  const nodes: StoppableNode[] = [];
  const t = ctx.currentTime;

  const addNode = (node: StoppableNode) => { nodes.push(node); };

  const drone = (freq: number, vol: number, type: OscillatorType = 'sine') => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    osc.type = type;
    osc.frequency.value = freq;
    filter.type = 'lowpass';
    filter.frequency.value = 300;
    filter.Q.value = 0.7;
    gain.gain.value = vol;
    osc.connect(filter).connect(gain).connect(master);
    osc.start();
    addNode({ stop: () => { osc.stop(); osc.disconnect(); gain.disconnect(); filter.disconnect(); } });
    return { osc, gain, filter };
  };

  drone(32.7, 0.35);
  drone(65.41, 0.22);
  drone(49.0, 0.18, 'triangle');

  const fifth = drone(98.0, 0.0);
  fifth.gain.gain.setValueAtTime(0, t);
  fifth.gain.gain.linearRampToValueAtTime(0.12, t + 8);
  fifth.gain.gain.linearRampToValueAtTime(0, t + 16);
  fifth.gain.gain.linearRampToValueAtTime(0.12, t + 24);
  fifth.gain.gain.linearRampToValueAtTime(0, t + 32);

  const shimmer = (freq: number, vol: number, rate: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const tremOsc = ctx.createOscillator();
    const tremGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    filter.type = 'lowpass';
    filter.frequency.value = 1200;
    filter.Q.value = 1.5;
    gain.gain.value = vol;
    tremOsc.type = 'sine';
    tremOsc.frequency.value = rate;
    tremGain.gain.value = vol * 0.5;
    tremOsc.connect(tremGain).connect(gain.gain);
    tremOsc.start();
    osc.connect(filter).connect(gain).connect(master);
    osc.start();
    addNode({ stop: () => { osc.stop(); tremOsc.stop(); osc.disconnect(); tremOsc.disconnect(); gain.disconnect(); tremGain.disconnect(); filter.disconnect(); } });
  };

  shimmer(523.25, 0.025, 0.15);
  shimmer(659.25, 0.018, 0.12);
  shimmer(783.99, 0.012, 0.09);

  const breathLfo = ctx.createOscillator();
  const breathGain = ctx.createGain();
  breathLfo.type = 'sine';
  breathLfo.frequency.value = 0.04;
  breathGain.gain.value = 0.06;
  breathLfo.connect(breathGain).connect(master.gain);
  breathLfo.start();
  addNode({ stop: () => { breathLfo.stop(); breathLfo.disconnect(); breathGain.disconnect(); } });

  const reverbLen = ctx.sampleRate * 4;
  const reverbBuf = ctx.createBuffer(2, reverbLen, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = reverbBuf.getChannelData(ch);
    for (let i = 0; i < reverbLen; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / reverbLen, 2.5);
    }
  }
  const convolver = ctx.createConvolver();
  convolver.buffer = reverbBuf;
  const reverbSend = ctx.createGain();
  reverbSend.gain.value = 0.35;
  master.connect(reverbSend).connect(convolver).connect(ctx.destination);
  addNode({ stop: () => { reverbSend.disconnect(); convolver.disconnect(); } });

  const airLen = ctx.sampleRate * 3;
  const airBuf = ctx.createBuffer(2, airLen, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = airBuf.getChannelData(ch);
    for (let i = 0; i < airLen; i++) data[i] = (Math.random() * 2 - 1) * 0.008;
  }
  const airSrc = ctx.createBufferSource();
  const airFilter = ctx.createBiquadFilter();
  const airGain = ctx.createGain();
  airSrc.buffer = airBuf;
  airSrc.loop = true;
  airFilter.type = 'highpass';
  airFilter.frequency.value = 2000;
  airFilter.Q.value = 0.3;
  airGain.gain.value = 0.4;
  airSrc.connect(airFilter).connect(airGain).connect(master);
  airSrc.start();
  addNode({ stop: () => { airSrc.stop(); airSrc.disconnect(); airFilter.disconnect(); airGain.disconnect(); } });

  const subPulseLen = ctx.sampleRate * 6;
  const subPulseBuf = ctx.createBuffer(1, subPulseLen, ctx.sampleRate);
  const subData = subPulseBuf.getChannelData(0);
  for (let i = 0; i < subPulseLen; i++) {
    const phase = (i / subPulseLen) * Math.PI * 2;
    subData[i] = Math.sin(25 * Math.PI * 2 * i / ctx.sampleRate) * Math.sin(phase) * 0.15;
  }
  const subSrc = ctx.createBufferSource();
  const subGain = ctx.createGain();
  const subFilter = ctx.createBiquadFilter();
  subSrc.buffer = subPulseBuf;
  subSrc.loop = true;
  subFilter.type = 'lowpass';
  subFilter.frequency.value = 60;
  subFilter.Q.value = 0.5;
  subGain.gain.value = 0.5;
  subSrc.connect(subFilter).connect(subGain).connect(master);
  subSrc.start();
  addNode({ stop: () => { subSrc.stop(); subSrc.disconnect(); subFilter.disconnect(); subGain.disconnect(); } });

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
    nodesRef.current = createCinematicNodes(ctx, master);
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

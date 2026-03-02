import { useState } from 'react';
import { motion } from 'framer-motion';
import { PillarOverlay } from './island/PillarOverlay';
import { PortalScene } from './island/PortalScene';

export function EcosystemServices() {
  const [selectedService, setSelectedService] = useState<number | null>(null);

  return (
    <section
      id="ecosystem"
      className="relative w-full overflow-hidden bg-black"
      style={{ minHeight: '100vh' }}
    >
      {/* Background Video */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-35"
        >
          <source
            src="https://ik.imagekit.io/qcvroy8xpd/envato_video_gen_Feb_18_2026_13_51_22.mp4"
            type="video/mp4"
          />
        </video>
        {/* Richer gradient: darker at top for text legibility, heavy vignette at bottom */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.45) 35%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,0.97) 100%)'
        }} />
        {/* Side vignettes */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(90deg, rgba(0,0,0,0.6) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.6) 100%)'
        }} />
      </div>

      <div className="relative z-10 flex flex-col justify-center min-h-screen">

        {/* ── Header ── */}
        <div className="px-6 lg:px-20 pt-20 pb-12 sm:pb-16">
          <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-[1fr_auto] gap-8 lg:gap-20 items-end">

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75 }}
            >
              <div
                className="inline-flex items-center gap-2 mb-5 px-4 py-1.5"
                style={{
                  border: '2px solid var(--color-secondary)',
                  boxShadow: '3px 3px 0 var(--color-secondary)',
                }}
              >
                <span
                  className="block w-1.5 h-1.5 rounded-full"
                  style={{ background: 'var(--color-secondary)' }}
                />
                <span
                  className="text-[10px] font-bold tracking-[0.25em] uppercase"
                  style={{ color: 'var(--color-secondary)', fontFamily: 'var(--font-stack-heading)' }}
                >
                  The Framework
                </span>
              </div>

              <h2
                className="leading-[0.88] tracking-tight"
                style={{
                  fontFamily: 'var(--font-stack-heading)',
                  fontSize: 'clamp(2.8rem, 7vw, 6rem)',
                  color: 'transparent',
                  WebkitTextStroke: '2px rgba(255,255,255,0.9)',
                }}
              >
                Three Pillars.
                <br />
                <span style={{ WebkitTextStroke: '2px rgba(255,255,255,0.45)' }}>
                  One Ecosystem.
                </span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, delay: 0.15 }}
              className="max-w-xs pb-1"
            >
              <p
                className="text-base leading-relaxed"
                style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-stack-body)' }}
              >
                We don't see social media as a channel — we see it as a living ecosystem. One that,
                when structured strategically, turns visibility into trust, and trust into action.
              </p>
            </motion.div>

          </div>
        </div>

        {/* ── Portal Scene ── */}
        <motion.div
          className="px-6 lg:px-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, delay: 0.2 }}
        >
          <div
            className="max-w-7xl mx-auto w-full"
            style={{ borderTop: '1px solid rgba(164,108,252,0.18)' }}
          >
            <PortalScene onPillarSelect={setSelectedService} />
          </div>
        </motion.div>

        {/* ── Why It Works ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="px-6 lg:px-20 pb-20 mt-12 sm:mt-16"
        >
          <div
            className="max-w-7xl mx-auto w-full pt-10"
            style={{ borderTop: '1px solid rgba(164,108,252,0.18)' }}
          >
            <div className="grid sm:grid-cols-[auto_1fr] gap-6 sm:gap-12 items-start max-w-3xl">
              <div
                className="flex-shrink-0 px-4 py-2 w-max"
                style={{
                  border: '2px solid var(--color-secondary)',
                  boxShadow: '3px 3px 0 var(--color-secondary)',
                }}
              >
                <span
                  className="text-[9px] uppercase tracking-[0.3em] block"
                  style={{ color: 'var(--color-secondary)', fontFamily: 'var(--font-stack-heading)' }}
                >
                  Why the
                  <br />
                  3-Pillar System Works
                </span>
              </div>

              <p
                className="text-sm sm:text-base leading-relaxed pt-0.5"
                style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-stack-body)' }}
              >
                This living ecosystem is designed to strengthen brand presence, build executive
                visibility, empower employees to share the company narrative, and drive real
                business results. By activating all three pillars, you create a brand that speaks
                with one voice — powered by many humans.
              </p>
            </div>
          </div>
        </motion.div>

      </div>

      <PillarOverlay
        pillarIndex={selectedService}
        onClose={() => setSelectedService(null)}
        onNavigate={setSelectedService}
      />
    </section>
  );
}
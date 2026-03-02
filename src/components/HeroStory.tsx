import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { SpacePlanets3D } from './space/SpacePlanets3D';

const ERAS = [
  {
    range: [0, 0.33] as [number, number],
    label: 'The Digital Era',
    heading: 'THE DIGITAL ERA',
    subheading: 'c. 2010s',
    eyebrow: 'VIEW OF AFRICA AT NIGHT (Current)',
    body: 'Data networks connect fiber cable and satellite links. Current urban footprints illuminated by purple light.',
  },
  {
    range: [0.33, 0.66] as [number, number],
    label: 'The AI Era',
    heading: 'THE AI ERA',
    subheading: 'c. 2020s–Present',
    eyebrow: null,
    body: 'Artificial intelligence transforms industries and connectivity. Network nodes expanding across every border.',
  },
  {
    range: [0.66, 1] as [number, number],
    label: 'The H2H Difference',
    heading: 'THE H2H DIFFERENCE',
    subheading: 'Full Illumination',
    eyebrow: null,
    body: 'When Human Collaboration meets Digital & AI Foundations. A United, Illuminated Continent. Purple Represents Progress, Unity, and Connection.',
  },
];

function EraText({
  era,
  scrollYProgress,
  index,
}: {
  era: (typeof ERAS)[number];
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
  index: number;
}) {
  const [start, end] = era.range;
  const fadeInStart = index === 0 ? 0 : start - 0.06;
  const fadeInEnd = index === 0 ? 0.08 : start + 0.08;
  const fadeOutStart = index === ERAS.length - 1 ? 0.98 : end - 0.06;
  const fadeOutEnd = index === ERAS.length - 1 ? 1 : end + 0.06;

  const opacity = useTransform(
    scrollYProgress,
    [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd],
    [0, 1, 1, 0]
  );
  const y = useTransform(scrollYProgress, [fadeInStart, fadeInEnd], [32, 0]);

  return (
    <motion.div
      style={{ opacity, y, position: 'absolute', inset: 0, pointerEvents: 'none' }}
      className="flex flex-col justify-center px-6 md:px-12 lg:px-16"
    >
      <div className="max-w-sm">
        <span
          className="block mb-3 text-[0.55rem] font-bold uppercase tracking-[0.35em]"
          style={{ color: 'rgba(164,108,252,0.7)', fontFamily: 'var(--font-stack-heading)' }}
        >
          {`0${index + 1} / 03 — ${era.label}`}
        </span>

        {era.eyebrow && (
          <span
            className="block mb-4 text-[0.6rem] font-semibold uppercase tracking-[0.25em]"
            style={{ color: 'rgba(164,108,252,0.5)', fontFamily: 'var(--font-stack-heading)' }}
          >
            {era.eyebrow}
          </span>
        )}

        <h2
          className="uppercase mb-1"
          style={{
            fontFamily: 'var(--font-stack-heading)',
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            color: 'var(--color-text-dark)',
          }}
        >
          {era.heading}
        </h2>

        <p
          className="mb-5 uppercase"
          style={{
            fontFamily: 'var(--font-stack-heading)',
            fontSize: 'clamp(0.75rem, 1.2vw, 0.9rem)',
            letterSpacing: '0.2em',
            color: 'rgba(164,108,252,0.8)',
          }}
        >
          {era.subheading}
        </p>

        <div
          className="mb-6 h-px"
          style={{ background: 'linear-gradient(90deg, rgba(164,108,252,0.5) 0%, transparent 100%)' }}
        />

        <p
          style={{
            fontFamily: 'var(--font-stack-body)',
            fontSize: 'clamp(0.85rem, 1.3vw, 1rem)',
            lineHeight: 1.75,
            color: 'rgba(232,226,255,0.55)',
          }}
        >
          {era.body}
        </p>
      </div>
    </motion.div>
  );
}

function EraIndicator({
  index,
  scrollYProgress,
}: {
  index: number;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  const era = ERAS[index];
  const [start, end] = era.range;
  const center = (start + end) / 2;

  const opacity = useTransform(
    scrollYProgress,
    [Math.max(0, start - 0.05), start + 0.08, end - 0.08, Math.min(1, end + 0.05)],
    [0.3, 1, 1, 0.3]
  );
  const scale = useTransform(
    scrollYProgress,
    [Math.max(0, center - 0.15), center, Math.min(1, center + 0.15)],
    [0.7, 1.3, 0.7]
  );

  return (
    <motion.div style={{ opacity, scale }} className="flex flex-col items-center gap-1">
      <motion.div
        className="rounded-full"
        style={{
          width: 6,
          height: 6,
          background: 'rgba(164,108,252,0.9)',
          boxShadow: '0 0 6px rgba(164,108,252,0.5)',
        }}
      />
      <span
        className="text-[0.45rem] uppercase tracking-widest"
        style={{ color: 'rgba(164,108,252,0.6)', fontFamily: 'var(--font-stack-heading)' }}
      >
        {`0${index + 1}`}
      </span>
    </motion.div>
  );
}

export function HeroStory() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const glowOpacity = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], [0.08, 0.35, 0.65, 1]);
  const glowScale = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], [0.55, 0.75, 1.0, 1.3]);
  const outerGlowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.2, 0.5]);
  const globeScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const progressScaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={sectionRef} style={{ height: '300vh', position: 'relative' }}>
      <div
        className="sticky top-0 h-screen overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #06030f 0%, #0e0820 30%, #080318 70%, #030108 100%)',
        }}
      >
        <SpacePlanets3D preset="about" style={{ opacity: 0.4 }} />

        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse at 20% 30%, rgba(60,20,120,0.15) 0%, transparent 55%),
              radial-gradient(ellipse at 80% 70%, rgba(20,10,60,0.18) 0%, transparent 50%)
            `,
            zIndex: 1,
          }}
        />

        <div className="relative h-full w-full flex items-center" style={{ zIndex: 10 }}>
          <motion.div
            className="absolute left-0 top-0 bottom-0 w-px"
            style={{ background: 'rgba(164,108,252,0.15)', transformOrigin: 'top', zIndex: 20 }}
          />
          <motion.div
            className="absolute left-0 top-0 bottom-0 w-px"
            style={{
              background: 'rgba(164,108,252,0.7)',
              transformOrigin: 'top',
              scaleY: progressScaleY,
              zIndex: 21,
            }}
          />

          <div
            className="absolute right-0 md:right-auto md:left-1/2 top-1/2 -translate-y-1/2 md:-translate-x-[10%]"
            style={{ width: 'min(85vw, 700px)', aspectRatio: '1', zIndex: 5 }}
          >
            <motion.div className="relative w-full h-full" style={{ scale: globeScale }}>
              <img
                src="https://ik.imagekit.io/qcvroy8xpd/Planet.png"
                alt="Globe showing Africa"
                className="w-full h-full object-contain select-none"
                draggable={false}
                style={{ filter: 'brightness(0.75) contrast(1.1)' }}
              />

              <motion.div
                className="absolute pointer-events-none"
                style={{
                  top: '20%',
                  left: '30%',
                  width: '55%',
                  height: '60%',
                  background:
                    'radial-gradient(circle, rgba(164,108,252,0.85) 0%, rgba(120,60,220,0.4) 35%, transparent 70%)',
                  borderRadius: '50%',
                  opacity: glowOpacity,
                  scale: glowScale,
                  filter: 'blur(4px)',
                  mixBlendMode: 'screen',
                }}
              />

              <motion.div
                className="absolute pointer-events-none"
                style={{
                  top: '5%',
                  left: '15%',
                  width: '80%',
                  height: '85%',
                  background:
                    'radial-gradient(circle, rgba(164,108,252,0.2) 0%, transparent 65%)',
                  borderRadius: '50%',
                  opacity: outerGlowOpacity,
                  filter: 'blur(20px)',
                  mixBlendMode: 'screen',
                }}
              />
            </motion.div>
          </div>

          <div className="absolute inset-y-0 left-0 right-auto w-full md:w-1/2" style={{ zIndex: 15 }}>
            <div className="absolute top-8 left-6 md:left-12 lg:left-16">
              <div
                className="inline-flex items-center gap-2.5 px-4 py-1.5"
                style={{
                  border: '1px solid rgba(164,108,252,0.2)',
                  borderRadius: '100px',
                  background: 'rgba(164,108,252,0.06)',
                }}
              >
                <motion.span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: 'var(--color-secondary)',
                    display: 'inline-block',
                    boxShadow: '0 0 8px rgba(164,108,252,0.6)',
                  }}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
                <span
                  className="text-[0.5rem] font-bold uppercase tracking-[0.3em]"
                  style={{ fontFamily: 'var(--font-stack-heading)', color: 'rgba(232,226,255,0.6)' }}
                >
                  Our Story
                </span>
              </div>
            </div>

            <div className="relative h-full" style={{ paddingTop: '5rem' }}>
              {ERAS.map((era, i) => (
                <EraText key={i} era={era} scrollYProgress={scrollYProgress} index={i} />
              ))}
            </div>
          </div>

          <div className="absolute bottom-8 right-6 md:right-12" style={{ zIndex: 20 }}>
            <div className="flex items-center gap-4">
              {ERAS.map((_, i) => (
                <EraIndicator key={i} index={i} scrollYProgress={scrollYProgress} />
              ))}
            </div>
          </div>
        </div>

        <div
          className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
          style={{ background: 'linear-gradient(0deg, #06030f 0%, transparent 100%)', zIndex: 12 }}
        />
        <div
          className="absolute inset-x-0 top-0 h-16 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, #06030f 0%, transparent 100%)', zIndex: 12 }}
        />
      </div>
    </div>
  );
}

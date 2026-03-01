import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'motion/react';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1];

interface PhilosophyCard {
  label: string;
  headline: string;
  body: string;
  gradient: string;
  accentColor: string;
  delay: number;
}

const CARDS: PhilosophyCard[] = [
  {
    label: '01 — Polish',
    headline: 'Perfect, polished campaigns.',
    body: 'We take craft seriously. Every pixel, every word, every touchpoint built with intention and precision.',
    gradient: 'linear-gradient(135deg, rgba(20,20,20,1) 0%, rgba(30,20,40,1) 100%)',
    accentColor: 'rgba(180,180,180,0.6)',
    delay: 0,
  },
  {
    label: '02 — Humanity',
    headline: 'But people want more than that.',
    body: 'They want personality. They want to see and hear brands that speak like humans and offer something meaningful.',
    gradient: 'linear-gradient(135deg, rgba(40,20,60,1) 0%, rgba(80,40,120,1) 100%)',
    accentColor: 'rgba(164,108,252,0.8)',
    delay: 0.1,
  },
  {
    label: '03 — Social-First',
    headline: 'H2H is built to bridge the gap.',
    body: 'A social-first agency that helps brands grow by making their digital presence feel more human — thoughtful, strategic, and real.',
    gradient: 'linear-gradient(135deg, rgba(60,30,90,1) 0%, rgba(120,60,180,1) 100%)',
    accentColor: 'rgba(200,140,255,0.9)',
    delay: 0.2,
  },
];

function PhilosophyCard({ card, index }: { card: PhilosophyCard; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: false, margin: '-15%' });

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'center center'],
  });

  const borderRadius = useTransform(
    scrollYProgress,
    [0, 0.6, 1],
    ['0px', '24px', '48px']
  );

  const scaleX = useTransform(scrollYProgress, [0, 0.5], [0.92, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <motion.div
      ref={cardRef}
      style={{ borderRadius, scaleX, opacity }}
      className="relative overflow-hidden w-full"
    >
      <div
        className="relative w-full overflow-hidden"
        style={{
          background: card.gradient,
          minHeight: '340px',
        }}
      >
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 100%, ${card.accentColor.replace(')', ', 0.25)').replace('rgba', 'rgba')}, transparent 70%)`,
          }}
        />

        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 pointer-events-none"
          animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          initial={{ scaleX: 0, opacity: 0 }}
          transition={{ duration: 1.2, delay: card.delay + 0.3, ease: EASE_OUT_EXPO }}
          style={{ transformOrigin: 'left', background: card.accentColor }}
        />

        <div className="relative z-10 p-8 md:p-14 flex flex-col md:flex-row items-start gap-8 md:gap-16">
          <div className="md:w-1/3 flex-shrink-0">
            <motion.span
              className="block text-[0.6rem] font-bold uppercase tracking-[0.3em] mb-6"
              style={{ color: card.accentColor }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              initial={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.6, delay: card.delay }}
            >
              {card.label}
            </motion.span>

            <motion.div
              className="w-12 h-px mb-8"
              animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
              initial={{ scaleX: 0, opacity: 0 }}
              transition={{ duration: 0.8, delay: card.delay + 0.1, ease: EASE_OUT_EXPO }}
              style={{ transformOrigin: 'left', background: card.accentColor }}
            />
          </div>

          <div className="flex-1">
            <motion.h3
              className="text-[clamp(1.6rem,3.5vw,2.8rem)] font-extrabold text-white uppercase tracking-[-0.03em] leading-[1.1] mb-6"
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: card.delay + 0.1, ease: EASE_OUT_EXPO }}
            >
              {card.headline}
            </motion.h3>

            <motion.p
              className="text-base md:text-lg leading-relaxed"
              style={{ color: 'rgba(226,221,240,0.7)' }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
              initial={{ opacity: 0, y: 15 }}
              transition={{ duration: 0.8, delay: card.delay + 0.2, ease: EASE_OUT_EXPO }}
            >
              {card.body}
            </motion.p>
          </div>
        </div>

        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)
            `,
            backgroundSize: '3rem 3rem',
            maskImage: `radial-gradient(ellipse at ${index % 2 === 0 ? '0% 0%' : '100% 100%'}, black 0%, transparent 60%)`,
          }}
        />
      </div>
    </motion.div>
  );
}

export function PhilosophyAct() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 0.5], ['0%', '100%']);

  return (
    <div
      ref={sectionRef}
      className="relative w-full py-24 md:py-40 overflow-hidden"
      style={{ background: '#050505' }}
    >
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '4rem 4rem',
        }}
      />

      <div className="max-w-[1100px] mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 md:mb-28">
          <motion.h2
            className="text-[clamp(2rem,4.5vw,3.5rem)] font-extrabold text-white uppercase tracking-[-0.04em] leading-[1.05]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE_OUT_EXPO }}
          >
            Structure
            <br />
            <span
              className="text-transparent"
              style={{ WebkitTextStroke: '1.5px rgba(164,108,252,0.7)' }}
            >
              & Soul
            </span>
          </motion.h2>

          <motion.p
            className="max-w-xs text-sm md:text-base leading-relaxed"
            style={{ color: 'rgba(226,221,240,0.5)' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE_OUT_EXPO }}
          >
            The collision between perfection and personality — where campaigns meet character.
          </motion.p>
        </div>

        <div className="relative flex flex-col gap-5 md:gap-6">
          <div className="absolute left-8 top-0 bottom-0 w-px hidden md:block overflow-hidden">
            <motion.div
              className="w-full"
              style={{
                height: lineHeight,
                background: 'linear-gradient(to bottom, rgba(164,108,252,0.4), rgba(164,108,252,0.1))',
              }}
            />
          </div>

          {CARDS.map((card, i) => (
            <PhilosophyCard key={card.label} card={card} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

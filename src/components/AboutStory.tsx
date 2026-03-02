import { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  Variants,
  AnimatePresence,
} from 'motion/react';
import { SpacePlanets3D } from './space/SpacePlanets3D';

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const fadeUpItem: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE_OUT_EXPO },
  },
};

const scaleInItem: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, ease: EASE_OUT_EXPO },
  },
};

const CAPABILITIES = [
  { tag: 'Copy Writing', desc: 'In a digital landscape saturated with AI-generated content, authenticity matters more than ever. Search engines and social platforms are increasingly sophisticated at detecting generic, automated writing, and often limiting its reach and impact. Our professional copywriters craft content that feels human, nuanced, and strategically aligned with your brand voice. The result is compelling storytelling that builds trust, drives organic engagement across platforms.' },
  { tag: 'Agentic AI', desc: 'AI agents are transforming how businesses operate by moving beyond simple automation into intelligent, goal-driven execution. We design and deploy AI agents tailored to specific use cases, whether it\'s automated lead qualification and follow-ups, personalized customer support, content research and generation, sales outreach, internal workflow optimization, or real-time data analysis. These agents can operate across platforms, integrate with your existing tools, and continuously learn from interactions to improve performance. The result is a scalable, always-on digital workforce that increases efficiency, reduces manual workload, and unlocks new growth opportunities.' },
  { tag: 'SEO & AEO', desc: 'AI agents are transforming how businesses operate by moving beyond simple automation into intelligent, goal-driven execution. We design and deploy AI agents tailored to specific use cases, whether it\'s automated lead qualification and follow-ups, personalized customer support, content research and generation, sales outreach, internal workflow optimization, or real-time data analysis. These agents can operate across platforms, integrate with your existing tools, and continuously learn from interactions to improve performance. The result is a scalable, always-on digital workforce that increases efficiency, reduces manual workload, and unlocks new growth opportunities.' },
  { tag: 'Graphic Design', desc: 'In an era where AI can generate visuals in seconds, true design expertise is what sets brands apart. While automated tools produce volume, they rarely deliver strategic thinking, brand consistency, or emotional depth. Professional graphic design ensures your visuals are attractive and intentionally aligned with your positioning, audience psychology, and long-term brand equity. We translate your identity into cohesive, high-impact design systems and campaign assets that cut through the noise, build recognition, and communicate with clarity and purpose across every touchpoint.' },
  { tag: 'Video Creation & Editing', desc: 'Video is the most powerful storytelling medium in today\'s digital ecosystem. We conceptualize, produce, and edit high-impact videos tailored for social media, advertising, and brand storytelling. From short-form reels to polished brand videos and promotional content, we create visually compelling narratives that captivate audiences and drive measurable results.' },
  { tag: 'Social Media Management', desc: 'Effective social media requires strategy, consistency, and performance-driven execution. We manage your platforms end-to-end, developing content calendars, publishing optimized posts, engaging audiences, and analyzing results. Our approach ensures your brand remains relevant and aligned with clear business objectives.' },
  { tag: 'Personal Branding', desc: 'Leaders\' role have shifted from optional participants in social media, to brand assets. We build authentic, strategic personal brands that position executives and founders as industry authorities. Through tailored content, storytelling frameworks, and platform optimization, we transform profiles into influence engines that drive credibility, visibility, and opportunity.' },
  { tag: 'Community Management', desc: 'A strong community turns followers into advocates. We actively manage conversations, nurture relationships, and create meaningful engagement across your digital platforms. By fostering dialogue and responding with purpose, we help build loyal communities that strengthen brand trust and long-term growth.' },
  { tag: 'Google Ads', desc: 'Our Google Ads campaigns are designed to capture high-intent audiences at the exact moment they are searching for your solutions. Through data-backed optimization, continuous testing, and conversion-focused execution, we maximize ROI and drive measurable business outcomes.' },
  { tag: 'Social Ads', desc: 'Paid social is about reaching the right audience with the right message at the right time. We develop and manage strategic campaigns across leading platforms, combining compelling creative with advanced audience targeting and performance analytics. The result is scalable growth, stronger brand awareness, and consistent lead generation.' },
];

function GeometricFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="transition-all duration-300 hover:-translate-x-1 hover:-translate-y-1 overflow-hidden"
      style={{
        position: 'relative',
        border: '2px solid var(--color-surface-dark)',
        background: 'var(--color-background-light)',
        boxShadow: 'var(--shadow-geometric)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-geometric-hover)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-geometric)';
      }}
    >
      {children}
    </div>
  );
}

function SectionBadge({ label }: { label: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
      className="inline-block mb-10"
    >
      <div
        className="inline-flex items-center gap-2.5 px-4 py-1.5"
        style={{
          border: '1px solid rgba(164,108,252,0.15)',
          borderRadius: '100px',
          background: 'rgba(164,108,252,0.05)',
        }}
      >
        <motion.span
          style={{
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: 'var(--color-secondary)',
            display: 'inline-block',
            boxShadow: '0 0 8px rgba(164,108,252,0.5)',
          }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span
          className="text-[0.55rem] font-bold uppercase tracking-[0.3em]"
          style={{
            fontFamily: 'var(--font-stack-heading)',
            color: 'var(--color-surface-dark)',
          }}
        >
          {label}
        </span>
      </div>
    </motion.div>
  );
}

export function AboutStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCapability, setActiveCapability] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const contentParallax = useTransform(scrollYProgress, [0, 1], ['2%', '-2%']);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full overflow-hidden flex flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(160deg, #06030f 0%, #0e0820 30%, #080318 70%, #030108 100%)',
        padding: 'clamp(6rem, 12vw, 12rem) clamp(1.5rem, 5vw, 3rem)',
      }}
    >
      <SpacePlanets3D preset="about" style={{ opacity: 0.6 }} />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(60, 20, 120, 0.18) 0%, transparent 55%),
            radial-gradient(ellipse at 80% 70%, rgba(20, 10, 60, 0.2) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(10, 5, 30, 0.4) 0%, transparent 70%)
          `,
          zIndex: 1,
        }}
      />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(180deg, #06030f 0%, transparent 12%),
            linear-gradient(0deg, #06030f 0%, transparent 12%)
          `,
          zIndex: 2,
        }}
      />

      <motion.div
        className="relative w-full mx-auto flex flex-col items-center"
        style={{ y: contentParallax, maxWidth: '1300px', zIndex: 10 }}
      >
        <div className="flex flex-col items-center text-center mb-16 md:mb-24">
          <SectionBadge label="About Us" />

          <h2
            style={{
              fontSize: 'clamp(2.5rem, 6.5vw, 5.5rem)',
              fontFamily: 'var(--font-stack-heading)',
              color: 'var(--color-text-dark)',
              lineHeight: 1.05,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '-0.04em',
              textAlign: 'center',
              margin: 0,
            }}
          >
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, ease: EASE_OUT_EXPO }}
            >
              From Brand Voice
            </motion.span>
            <motion.span
              className="block mt-1"
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, delay: 0.12, ease: EASE_OUT_EXPO }}
            >
              <span style={{ color: 'transparent', WebkitTextStroke: '1.5px var(--color-surface-dark)' }}>
                To Human
              </span>{' '}
              Connection
            </motion.span>
          </h2>

          <motion.p
            className="mt-8 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, delay: 0.25, ease: EASE_OUT_EXPO }}
            style={{
              fontFamily: 'var(--font-stack-body)',
              fontSize: 'clamp(1rem, 1.4vw, 1.15rem)',
              lineHeight: 1.8,
              color: 'rgba(232,226,255,0.5)',
              textAlign: 'center',
            }}
          >
            At H2H we believe the most impactful brands are the ones that know how to connect, not just communicate.
          </motion.p>
        </div>

        <motion.div
          className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
        >
          <motion.div className="lg:col-span-5" variants={fadeUpItem}>
            <GeometricFrame>
              <div style={{ position: 'relative' }}>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full object-cover"
                  style={{ aspectRatio: '4 / 5', display: 'block' }}
                  src="https://ik.imagekit.io/qcvroy8xpd/Shannon_s_Space_Video_Creation.mp4"
                />
                <div
                  className="pointer-events-none"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `
                      linear-gradient(180deg, rgba(14,11,31,0.3) 0%, transparent 25%),
                      linear-gradient(180deg, transparent 70%, rgba(14,11,31,0.7) 100%)
                    `,
                  }}
                />
              </div>
            </GeometricFrame>
          </motion.div>

          <motion.div
            className="lg:col-span-7 flex flex-col justify-center"
            variants={fadeUpItem}
          >
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.15, ease: EASE_OUT_EXPO }}
            >
              <span
                className="inline-block mb-6"
                style={{
                  fontSize: '0.55rem',
                  fontWeight: 700,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: 'rgba(164,108,252,0.6)',
                  fontFamily: 'var(--font-stack-heading)',
                }}
              >
                Our Story
              </span>

              <p
                style={{
                  fontFamily: 'var(--font-stack-body)',
                  fontSize: 'clamp(1.05rem, 1.5vw, 1.15rem)',
                  lineHeight: 1.8,
                  color: 'rgba(232,226,255,0.55)',
                  marginBottom: '1.5rem',
                }}
              >
                Perfect, polished campaigns are something that we take very seriously. But people want more than that. They want personality. They want to see and hear brands that speak like humans and offer something meaningful.
              </p>

              <p
                style={{
                  fontFamily: 'var(--font-stack-body)',
                  fontSize: 'clamp(1.05rem, 1.5vw, 1.15rem)',
                  lineHeight: 1.8,
                  color: 'rgba(232,226,255,0.55)',
                  marginBottom: '2.5rem',
                }}
              >
                H2H is a social-first agency built to help brands grow by making their digital presence feel more human — thoughtful, strategic, and real.
              </p>

              <motion.div
                className="h-px mb-8"
                style={{ background: 'rgba(164,108,252,0.2)', transformOrigin: 'left' }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.5, ease: EASE_OUT_EXPO }}
              />

              <span
                className="inline-block mb-5"
                style={{
                  fontSize: '0.55rem',
                  fontWeight: 700,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: 'rgba(164,108,252,0.6)',
                  fontFamily: 'var(--font-stack-heading)',
                }}
              >
                Why H2H?
              </span>

              <p
                style={{
                  fontFamily: 'var(--font-stack-heading)',
                  fontSize: 'clamp(1.1rem, 1.6vw, 1.25rem)',
                  lineHeight: 1.6,
                  color: 'var(--color-text-dark)',
                  fontWeight: 700,
                  marginBottom: '1.25rem',
                }}
              >
                Because we embed ourselves in your world.
              </p>

              <p
                style={{
                  fontFamily: 'var(--font-stack-body)',
                  fontSize: 'clamp(1.05rem, 1.5vw, 1.15rem)',
                  lineHeight: 1.8,
                  color: 'rgba(232,226,255,0.55)',
                  marginBottom: '1.5rem',
                }}
              >
                When you work with H2H, you don't get an agency. You get a partner — a flexible, responsive extension of your team. Like a living, breathing part of your organization, we adapt to your rhythm, align with your goals, and help you scale with clarity and purpose.
              </p>

              <p
                style={{
                  fontFamily: 'var(--font-stack-body)',
                  fontSize: 'clamp(1.05rem, 1.5vw, 1.15rem)',
                  lineHeight: 1.8,
                  color: 'rgba(232,226,255,0.55)',
                  marginBottom: '2.5rem',
                }}
              >
                We're strategists, creatives, and storytellers who bring a mix of structure and soul. We combine insight with efficiency to help you build brand ecosystems that actually work — across every platform, every touchpoint, and every stage of growth.
              </p>

            </motion.div>
          </motion.div>
        </motion.div>

        <div className="w-full mt-16 md:mt-24">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
          >
            {CAPABILITIES.map((cap, i) => (
              <motion.div
                key={cap.tag}
                variants={scaleInItem}
                onHoverStart={() => setActiveCapability(i)}
                onHoverEnd={() => setActiveCapability(null)}
                className="relative px-4 py-4 cursor-default transition-all duration-300 hover:-translate-x-0.5 hover:-translate-y-0.5"
                style={{
                  border: '2px solid var(--color-surface-dark)',
                  background: activeCapability === i
                    ? 'rgba(164,108,252,0.08)'
                    : 'var(--color-background-light)',
                  boxShadow: activeCapability === i
                    ? 'var(--shadow-geometric-hover)'
                    : '6px 6px 0 var(--color-secondary)',
                  transition: 'background 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease',
                }}
              >
                <span
                  className="block text-[0.7rem] font-semibold uppercase tracking-[0.15em]"
                  style={{
                    fontFamily: 'var(--font-stack-heading)',
                    color: activeCapability === i ? 'var(--color-text-dark)' : 'rgba(232,226,255,0.5)',
                    transition: 'color 0.3s ease',
                  }}
                >
                  {cap.tag}
                </span>
                <AnimatePresence>
                  {activeCapability === i && (
                    <motion.span
                      className="block mt-1.5 text-[0.65rem]"
                      style={{
                        color: 'rgba(232,226,255,0.4)',
                        fontFamily: 'var(--font-stack-body)',
                        lineHeight: 1.4,
                      }}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      {cap.desc}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

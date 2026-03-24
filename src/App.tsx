import React, { Suspense, lazy, useState, useCallback } from "react";
import { motion } from "motion/react";
import { Loader } from "./components/Loader";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LazySection, SectionLoader } from "./components/LazySection";
import { ScrollProgress } from "./components/ScrollProgress";
import { Navigation } from "./components/Navigation";
import { HeroTitle } from "./components/HeroTitle";
import { ScrollReveal } from "./components/ScrollReveal";
import { HeroStory } from "./components/HeroStory";
import { Footer } from "./components/layout/Footer";
import { ContactForm } from "./components/ContactForm";
import { CursorTrail } from "./components/CursorTrail";
import { LusionConnectors } from "./components/LusionConnectors";

const AboutStory = lazy(() =>
  import("./components/AboutStory").then((m) => ({ default: m.AboutStory })),
);
const EcosystemServices = lazy(() =>
  import("./components/EcosystemServices").then((m) => ({ default: m.EcosystemServices })),
);
const ArcSlider = lazy(() =>
  import("./components/ArcSlider").then((m) => ({ default: m.ArcSlider })),
);
const Testimonials = lazy(() =>
  import("./components/Testimonials").then((m) => ({ default: m.Testimonials })),
);
const BlogSection = lazy(() =>
  import("./components/BlogSection").then((m) => ({ default: m.BlogSection })),
);


const SECTION_PADDING: React.CSSProperties = {
  paddingTop: 'var(--space-8x)',
  paddingBottom: 'var(--space-8x)',
};

interface SectionProps {
  id: string;
  className?: string;
  children: React.ReactNode;
  revealMode?: "blur" | "parallax" | "3d";
  delay?: number;
  noPadding?: boolean;
}

const Section = ({
  id,
  className = "",
  children,
  revealMode = "blur",
  delay = 0,
  noPadding = false,
}: SectionProps) => (
  <section
    id={id}
    className={className}
    style={noPadding ? undefined : SECTION_PADDING}
  >
    <LazySection>
      <ScrollReveal mode={revealMode} delay={delay}>
        {children}
      </ScrollReveal>
    </LazySection>
  </section>
);

function AppContent() {

  return (
    <main className="min-h-screen bg-[var(--color-background-light)] selection:bg-[var(--color-primary)] selection:text-white">
      <CursorTrail />
      <Navigation />
      <ScrollProgress />

      {/* ═══ HERO — Lusion-style: white page, headline above rounded canvas ═══ */}
      <section
        id="hero"
        style={{
          minHeight: '100vh',
          background: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: 'clamp(80px, 11vh, 120px)',   /* clears floating nav */
          paddingBottom: 'clamp(24px, 4vh, 40px)',
        }}
      >
        {/* ── HEADLINE above the canvas ── */}
        <div style={{ padding: '0 clamp(24px, 5vw, 64px)', marginBottom: 'clamp(16px, 3vh, 28px)' }}>
          <HeroTitle />
        </div>

        {/* ── ROUNDED CANVAS — fills the remaining viewport height ── */}
        <div
          style={{
            flex: 1,
            margin: '0 clamp(12px, 2.5vw, 32px)',
            borderRadius: 'clamp(16px, 2vw, 24px)',
            overflow: 'hidden',
            position: 'relative',
            minHeight: 'clamp(300px, 58vh, 700px)',
          }}
        >
          {/* Lusion connectors canvas */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
            <LusionConnectors />
          </div>


        </div>

        {/* ── SCROLL CUE ── */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 'clamp(12px, 2vh, 20px)' }}>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          >
            <svg width="14" height="22" viewBox="0 0 14 22" fill="none"
              style={{ color: 'rgba(0,0,0,0.22)' }}>
              <rect x="1" y="1" width="12" height="20" rx="6" stroke="currentColor" strokeWidth="1.5" />
              <rect x="6" y="5" width="2" height="4" rx="1" fill="currentColor" />
            </svg>
          </motion.div>
        </div>
      </section>

      <HeroStory />

      <div id="ecosystem" className="relative" style={{ zIndex: 2 }}>
        <EcosystemServices />
      </div>

      <div id="about" className="relative" style={{ zIndex: 2 }}>
        <Suspense fallback={<SectionLoader />}>
          <AboutStory />
        </Suspense>
      </div>

      <Section id="services" className="bg-[var(--color-background-light)]" noPadding={true}>
        <ArcSlider />
      </Section>

      <Section id="testimonials" className="bg-[var(--color-background-light)]">
        <Testimonials />
      </Section>

      <div id="blog">
        <LazySection>
          <Suspense fallback={<SectionLoader />}>
            <BlogSection />
          </Suspense>
        </LazySection>
      </div>

      <Section id="contact" className="bg-[var(--color-background-light)]" delay={0.2} noPadding={true}>
        <ContactForm />
      </Section>

      <Footer />
    </main>
  );
}

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const onComplete = useCallback(() => setLoaded(true), []);

  return (
    <ErrorBoundary>
      {!loaded && <Loader onComplete={onComplete} />}
      <AppContent />
    </ErrorBoundary>
  );
}

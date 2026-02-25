import React, { Suspense, lazy, useState, useCallback } from "react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Loader } from "./components/Loader";
import { LazySection, SectionLoader } from "./components/LazySection";
import { ScrollProgress } from "./components/ScrollProgress";
import { Navigation } from "./components/Navigation";
import { HeroTitle } from "./components/HeroTitle";
import { ScrollReveal } from "./components/ScrollReveal";
import { HeroStory } from "./components/HeroStory";
import { Footer } from "./components/layout/Footer";
import { ContactForm } from "./components/ContactForm";
import { CursorTrail } from "./components/CursorTrail";
import { HeroWebGL } from "./components/HeroWebGL";
import { HeroWebGLPanel } from "./components/HeroWebGLPanel";

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
    style={noPadding ? {} : {
      paddingTop: 'var(--space-8x)',
      paddingBottom: 'var(--space-8x)'
    }}
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

      {/* FULL SCREEN HERO SECTION */}
      <section
        id="hero"
        className="relative min-h-screen overflow-hidden flex items-center justify-center"
        style={{ background: '#000' }}
      >
        <HeroWebGL />

        {/* 3D Panel - Now Absolute & Full Screen */}
        <div className="absolute inset-0 z-10 w-full h-full">
          <HeroWebGLPanel />
        </div>

        {/* Title Overlay - pointer-events-none lets mouse interact with 3D behind it */}
        <div className="relative z-20 px-6 md:px-12 w-full pointer-events-none">
          <div className="max-w-7xl mx-auto">
            <HeroTitle>
              <ScrollReveal mode="blur" delay={0.2} className="w-full">
                {/* Empty container just for the title animation framework */}
                <div className="h-[20vh] sm:h-[30vh]"></div>
              </ScrollReveal>
            </HeroTitle>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 animate-bounce pointer-events-none" aria-hidden="true">
          <span
            className="text-xs tracking-[0.2em] uppercase"
            style={{ color: 'var(--color-secondary)', fontFamily: 'var(--font-stack-heading)' }}
          >
            Scroll to Explore
          </span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            style={{ color: 'var(--color-secondary)' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
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
  const handleLoaderComplete = useCallback(() => setLoaded(true), []);

  return (
    <ErrorBoundary>
      <Loader onComplete={handleLoaderComplete} />
      <div
        style={{
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.5s ease',
          pointerEvents: loaded ? 'all' : 'none',
        }}
      >
        <AppContent />
      </div>
    </ErrorBoundary>
  );
}
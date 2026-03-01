import React, { Suspense, lazy, useState, useCallback } from "react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { LazySection, SectionLoader } from "./components/LazySection";
import { ScrollProgress } from "./components/ScrollProgress";
import { Navigation } from "./components/Navigation";
import { ScrollReveal } from "./components/ScrollReveal";
import { Hero } from "./components/Hero";
import { StorySection } from "./components/StorySection";
import { Footer } from "./components/layout/Footer";
import { ContactForm } from "./components/ContactForm";
import { CursorTrail } from "./components/CursorTrail";
import { PageLoader } from "./components/PageLoader";

// Lazy Loaded Components
const AboutStory = lazy(() =>
  import("./components/AboutStory").then((m) => ({ default: m.AboutStory }))
);
const EcosystemServices = lazy(() =>
  import("./components/EcosystemServices").then((m) => ({ default: m.EcosystemServices }))
);
const ArcSlider = lazy(() =>
  import("./components/ArcSlider").then((m) => ({ default: m.ArcSlider }))
);
const Testimonials = lazy(() =>
  import("./components/Testimonials").then((m) => ({ default: m.Testimonials }))
);
const BlogSection = lazy(() =>
  import("./components/BlogSection").then((m) => ({ default: m.BlogSection }))
);

interface SectionProps {
  id: string;
  className?: string;
  children: React.ReactNode;
  revealMode?: "blur" | "parallax" | "3d";
  delay?: number;
  noPadding?: boolean;
}

// Added Suspense directly into the Section component to safely handle any lazy-loaded children
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
        <Suspense fallback={<SectionLoader />}>
          {children}
        </Suspense>
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

      <Hero />

      <StorySection />

      <div id="ecosystem" className="relative" style={{ zIndex: 2 }}>
        {/* FIX: Added Suspense wrapper for lazy-loaded EcosystemServices */}
        <Suspense fallback={<SectionLoader />}>
          <EcosystemServices />
        </Suspense>
      </div>

      <div id="about" className="relative" style={{ zIndex: 2 }}>
        <Suspense fallback={<SectionLoader />}>
          <AboutStory />
        </Suspense>
      </div>

      {/* ArcSlider is lazy-loaded, and Section now safely handles it with an internal Suspense */}
      <Section id="services" className="bg-[var(--color-background-light)]" noPadding={true}>
        <ArcSlider />
      </Section>

      {/* Testimonials is lazy-loaded, and Section now safely handles it */}
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

      {/* ContactForm is statically imported, so it renders normally inside Section */}
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
      {!loaded && <PageLoader onComplete={handleLoaderComplete} />}
      <AppContent />
    </ErrorBoundary>
  );
}
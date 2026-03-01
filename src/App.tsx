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
  style?: React.CSSProperties; // Added to support custom styles like zIndex
  children: React.ReactNode;
  revealMode?: "blur" | "parallax" | "3d";
  delay?: number;
  noPadding?: boolean;
}

// Section now handles all LazyLoading, ScrollReveal, and Suspense centrally
const Section = ({
  id,
  className = "",
  style = {},
  children,
  revealMode = "blur",
  delay = 0,
  noPadding = false,
}: SectionProps) => (
  <section
    id={id}
    className={className}
    style={{
      ...style,
      paddingTop: noPadding ? 0 : 'var(--space-8x)',
      paddingBottom: noPadding ? 0 : 'var(--space-8x)'
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

      {/* Replaced standard divs with the unified Section component */}
      <Section id="ecosystem" className="relative bg-[var(--color-background-light)]" style={{ zIndex: 2 }}>
        <EcosystemServices />
      </Section>

      <Section id="about" className="relative bg-[var(--color-background-light)]" style={{ zIndex: 2 }}>
        <AboutStory />
      </Section>

      <Section id="services" className="bg-[var(--color-background-light)]" noPadding={true}>
        <ArcSlider />
      </Section>

      <Section id="testimonials" className="bg-[var(--color-background-light)]">
        <Testimonials />
      </Section>

      <Section id="blog" className="bg-[var(--color-background-light)]">
        <BlogSection />
      </Section>

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
      {/* Keeping AppContent mounted while PageLoader runs helps prevent layout shifts */}
      {!loaded && <PageLoader onComplete={handleLoaderComplete} />}
      <AppContent />
    </ErrorBoundary>
  );
}
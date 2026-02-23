import { useState, useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  MotionValue
} from 'framer-motion';

interface Chapter {
  title: string;
  description: string;
  accent?: string;
  bg: string;
}

const chapters: Chapter[] = [
  {
    title: 'The Old Way',
    description:
      'Business used to be a game of power—big budgets, big brands, big voices. African SMEs were told to stay in their lane, focus on sales, and leave "brand" to the giants.',
    bg: '#0a0a0a',
  },
  {
    title: 'The Digital Era',
    description:
      'Then came the digital era, and everything changed. Creativity became a weapon. Culture became currency. Suddenly, the boldest storytellers—not the biggest spenders—started winning hearts, clicks, and market share.',
    bg: '#0d0315',
  },
  {
    title: 'The AI Era',
    description:
      "Now we've entered a new chapter: the AI era. Content is everywhere. Anyone can create it. But very few can connect.",
    accent: "That's the difference. And it's where H2H thrives.",
    bg: '#050505',
  },
  {
    title: 'The H2H Difference',
    description:
      "We help African brands evolve with the times, by bringing real, relatable, human energy back into content. We turn your leaders and teams into storytellers. We build ecosystems that amplify your voice. And we craft strategies that don't just look good—they resonate.",
    accent: 'Because today, connection is the ultimate competitive advantage.',
    bg: '#0d0315',
  },
];

// Helper component to isolate chapter animations for better performance
const ChapterSlide = ({ 
  chapter, 
  index, 
  total, 
  smoothProgress, 
  isActive 
}: { 
  chapter: Chapter; 
  index: number; 
  total: number; 
  smoothProgress: MotionValue<number>;
  isActive: boolean;
}) => {
  // Logic to determine when this specific slide is active in the scroll timeline
  // Each slide takes up 1/total of the scroll distance
  const start = index / total;
  const end = (index + 1) / total;
  
  // Calculate local progress (0 to 1) for this specific slide
  // We use useTransform to map the global scroll to this chapter's lifecycle
  const localProgress = useTransform(smoothProgress, [start, end], [0, 1]);
  
  // Opacity: Fade in when active, fade out when done
  // We use a small overlap to blend them smoothly
  const opacity = useTransform(
    smoothProgress, 
    [start, start + 0.05, end - 0.05, end], 
    [0, 1, 1, 0]
  );
  
  // Scale effect for the background
  const scale = useTransform(localProgress, [0, 1], [1, 1.05]);
  
  // Parallax effects for content
  // "Past" content moves up, "Future" content is down
  const yOffset = useTransform(
    smoothProgress,
    [start - 0.1, start, end, end + 0.1],
    ['80px', '0px', '0px', '-80px']
  );
  
  const contentOpacity = useTransform(
    smoothProgress,
    [start, start + 0.1, end - 0.2, end],
    [0, 1, 1, 0]
  );

  return (
    <motion.div
      className="absolute inset-0"
      style={{
        opacity,
        pointerEvents: isActive ? 'auto' : 'none',
        zIndex: isActive ? 10 : 0
      }}
    >
      <div className="relative w-full h-full">
        {/* Radial Gradient Overlay */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: useTransform(
              localProgress,
              (val) => `radial-gradient(ellipse at 70% 50%, rgba(124, 4, 252, ${0.1 + val * 0.06}) 0%, transparent 70%)`
            ),
            zIndex: 2,
          }}
        />

        {/* Text Content (Left Side) */}
        <div className="relative h-full flex items-center" style={{ paddingTop: '6rem', zIndex: 5 }}>
          <div className="container mx-auto px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
              <motion.div
                style={{
                  y: yOffset,
                  opacity: contentOpacity,
                }}
              >
                <div className="overflow-hidden mb-6">
                  <div
                    className="inline-block px-4 py-2"
                    style={{
                      border: '2px solid var(--color-secondary)',
                      boxShadow: '4px 4px 0 var(--color-secondary)',
                    }}
                  >
                    <span
                      className="text-xs uppercase tracking-[0.3em]"
                      style={{
                        color: 'var(--color-secondary)',
                        fontFamily: 'var(--font-stack-heading)',
                      }}
                    >
                      Step {String(index + 1).padStart(2, '0')} &mdash; Our Story
                    </span>
                  </div>
                </div>

                <div className="overflow-hidden">
                  <h2
                    style={{
                      fontFamily: 'var(--font-stack-heading)',
                      fontSize: 'clamp(2rem, 7vw, 5.5rem)',
                      fontWeight: 900,
                      lineHeight: 0.95,
                      color: 'transparent',
                      WebkitTextStroke: '2px #ffffff',
                      letterSpacing: '-0.03em',
                      maxWidth: '70%',
                    }}
                  >
                    {chapter.title}
                  </h2>
                </div>

                <div className="overflow-hidden mt-6">
                  <p
                    className="text-base sm:text-lg md:text-xl leading-relaxed"
                    style={{
                      color: 'rgba(255,255,255,0.85)',
                      fontFamily: 'var(--font-stack-body)',
                      maxWidth: '36rem',
                    }}
                  >
                    {chapter.description}
                  </p>
                </div>

                {chapter.accent && (
                  <div className="overflow-hidden mt-5">
                    <p
                      className="text-base sm:text-lg font-medium pl-4"
                      style={{
                        borderLeft: '3px solid var(--color-secondary)',
                        color: 'var(--color-secondary)',
                        fontFamily: 'var(--font-stack-body)',
                        maxWidth: '32rem',
                      }}
                    >
                      {chapter.accent}
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>

        {/* Progress Line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
        >
          <motion.div
            className="h-full"
            style={{
              background: `linear-gradient(90deg, var(--color-primary, #6366f1), var(--color-secondary, #a855f7))`,
              scaleX: localProgress,
              transformOrigin: 'left',
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export function HeroStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState(0);

  // 1. Set up Framer Motion scroll hook
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // 2. Add Physics (Spring) to the scroll value
  // This creates the "smooth", "heavy" feel.
  const smoothProgress = useSpring(scrollYProgress, {
    mass: 0.1,
    stiffness: 100,
    damping: 20,
    restDelta: 0.001
  });

  // 3. Update active section state ONLY when index changes (Optimized)
  useMotionValueEvent(smoothProgress, "change", (latest) => {
    const sectionIndex = Math.floor(latest * chapters.length);
    const newActive = Math.min(sectionIndex, chapters.length - 1);
    if (newActive !== activeSection) {
      setActiveSection(newActive);
    }
  });

  const handleNavClick = (index: number) => {
    if (!containerRef.current) return;
    const totalScrollableHeight = containerRef.current.offsetHeight - window.innerHeight;
    const containerTopAbsolute = containerRef.current.getBoundingClientRect().top + window.scrollY;
    
    // Target the specific section
    const targetScroll = containerTopAbsolute + ((index / chapters.length) * totalScrollableHeight) + 10; // +10 buffer

    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  };

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{ height: `${chapters.length * 100}vh`, background: '#000' }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0 }}
        >
          <source src="https://ik.imagekit.io/qcvroy8xpd/Space%20Together.mp4" type="video/mp4" />
        </video>
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(0,0,0,0.55)', zIndex: 1 }}
        />

        {/* Render Chapters */}
        {chapters.map((chapter, index) => (
          <ChapterSlide 
            key={index} 
            chapter={chapter} 
            index={index} 
            total={chapters.length} 
            smoothProgress={smoothProgress}
            isActive={activeSection === index}
          />
        ))}

        {/* Navigation Dots */}
        <div className="absolute right-4 sm:right-8 md:right-12 top-1/2 -translate-y-1/2 z-20 hidden sm:flex flex-col gap-3">
          {chapters.map((_, index) => (
            <button
              key={index}
              onClick={() => handleNavClick(index)}
              className="relative w-[6px] h-10 rounded-full overflow-hidden transition-all duration-300 hover:scale-x-150 cursor-pointer"
              style={{
                backgroundColor: 'rgba(255,255,255,0.1)',
              }}
              aria-label={`Go to section ${index + 1}`}
            >
              <div
                className="absolute bottom-0 left-0 right-0 rounded-full transition-all duration-500"
                style={{
                  height: activeSection === index ? '100%' : activeSection > index ? '100%' : '0%',
                  opacity: activeSection >= index ? 1 : 0.3,
                  background: 'var(--color-secondary)',
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
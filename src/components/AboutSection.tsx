import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const OCHRE = '#C8832A';
const HEADING_COLOR = '#c9b3ff';

const STEPS = [
  { num: '01', title: 'From Brand Voice\nto Human Connection', body: 'At H2H, we believe powerful brands are built on connection. It is not enough to be polished. You also need to be relevant, distinctive, and meaningful to the people you want to reach. Your brand needs a personality!', titlePadRight: '30%' },
  { num: '02', title: 'We Embed Ourselves\nin Your World', body: 'Working with H2H means gaining a partner that plugs into your team, understands your priorities, and helps drive the work forward. We adapt quickly, align closely, and support your growth with focus and purpose.', titlePadRight: '20%' },
  { num: '03', title: 'Building Brand Ecosystems\nThat Actually Work', body: 'Managing social media is easy. We do more than that! We build the full ecosystem around it, from content strategy and community management to paid amplification, creative production, and performance analytics. Every part works together. Every move has a purpose. And every touchpoint feels human.', titlePadRight: '25%' },
  { num: '04', title: 'Strong Communication\nDrives ROI', body: 'H2H Social works alongside your internal team as an extra engine behind the brand, helping you build stronger relationships, generate better leads, and tell your company\'s story with more clarity and impact. Great communication makes you visible. It makes you credible. And it makes you worth choosing.', titlePadRight: '25%' },
];

/* ── African city skylines — one per step, no Egypt, no nebulas ── */
const SKYLINES = [
  'https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=1200&q=80', // 01 Johannesburg
  'https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=1200&q=80', // 02 Nairobi
  'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1200&q=80', // 03 Cape Town
  'https://images.unsplash.com/photo-1618828665011-0abd973f7bb8?w=1200&q=80', // 04 Lagos
];

export function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const glowLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      // Scrubbed vertical side line
      if (glowLineRef.current) {
        gsap.to(glowLineRef.current, {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: section.querySelector('.about-steps-with-line'),
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
          },
        });
      }

      // Per-step class toggle + heading fill
      const allSteps = gsap.utils.toArray<HTMLElement>('.about-step');
      allSteps.forEach((step) => {
        ScrollTrigger.create({
          trigger: step,
          start: 'top 55%',
          once: true,
          onEnter: () => step.classList.add('is-visible'),
        });

        // Fade heading to full opacity as user scrolls through the step
        const h3 = step.querySelector('.about-step-h3');
        if (h3) {
          gsap.to(h3, {
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: step,
              start: 'top 55%',
              end: 'top 20%',
              scrub: true,
            },
          });
        }
      });

      // Background crossfade: change on every step
      allSteps.forEach((step, i) => {
        if (i === 0) return; // step 1 uses bg 1 by default
        ScrollTrigger.create({
          trigger: step,
          start: 'top 60%',
          onEnter: () => section.setAttribute('data-bg', String(i + 1)),
          onLeaveBack: () => section.setAttribute('data-bg', String(i)),
        });
      });

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} id="about" className="about-section" data-bg="1">
      {/* Fixed backgrounds — crossfade between 5 variants */}
      <div className="about-fixed-wrapper">
        {/* V1 — Johannesburg skyline (clean: skyline photo only, no overlays) */}
        <div className="about-bg-layer about-bg-layer--1">
          <img src={SKYLINES[0]} alt="" className="about-skyline" loading="lazy" decoding="async" />
        </div>

        {/* V2 — Nairobi skyline (clean: skyline photo only, no overlays) */}
        <div className="about-bg-layer about-bg-layer--2">
          <img src={SKYLINES[1]} alt="" className="about-skyline" loading="lazy" decoding="async" />
        </div>

        {/* V3 — Cape Town skyline (clean: skyline photo only, no overlays) */}
        <div className="about-bg-layer about-bg-layer--3">
          <img src={SKYLINES[2]} alt="" className="about-skyline" loading="lazy" decoding="async" />
        </div>

        {/* V4 — Lagos skyline (clean: skyline photo only, no overlays) */}
        <div className="about-bg-layer about-bg-layer--4">
          <img src={SKYLINES[3]} alt="" className="about-skyline" loading="lazy" decoding="async" />
        </div>
      </div>

      <div className="about-steps">
        <div className="about-steps-with-line">
          {/* Vertical side line */}
          <div className="about-side-line">
            <div className="about-glow-line">
              <div className="about-glow-line__base" />
              <div ref={glowLineRef} className="about-glow-line__glow" />
            </div>
          </div>

          {/* Rounded corner connecting side line to top */}
          <div className="about-heading">
            <div className="about-heading-corner">
              <div className="about-heading-corner__base" />
              <div className="about-heading-corner__glow" />
            </div>
          </div>

          {/* Steps */}
          {STEPS.map((step, stepIdx) => (
            <div
              key={step.num}
              className={`about-step${stepIdx % 2 === 1 ? ' about-step--stroke' : ''}${stepIdx === STEPS.length - 1 ? ' about-step--last' : ''}`}
            >
              {/* Heading row: index | title */}
              <div className="about-step-heading">
                <div className="about-step-index">
                  <div className="about-step-index-line">
                    <div className="about-glow-line about-glow-line--h">
                      <div className="about-glow-line__base" />
                      <div className="about-glow-line__glow about-glow-line__glow--h" />
                    </div>
                  </div>
                  <div className="about-step-index-num">
                    <p className="about-caption">{step.num}</p>
                  </div>
                </div>

                <div className="about-step-title" style={{ paddingRight: step.titlePadRight }}>
                  <h3 className="about-step-h3">
                    {step.title.split('\n').map((line, i) => (
                      <div key={i} className="about-ta-mask">
                        <div
                          className="about-ta-line"
                          style={{ '--delay': `${i * 0.15}s` } as React.CSSProperties}
                        >
                          {line}
                        </div>
                      </div>
                    ))}
                  </h3>
                </div>
              </div>

              {/* Body — grid col 2 only, word-by-word unblur */}
              <div className="about-step-container">
                <div className="about-step-content">
                  {step.body.split(' ').map((word, i) => (
                    <span
                      key={i}
                      className="about-ub-word"
                      style={{ '--delay': `${i * 0.005}s` } as React.CSSProperties}
                    >
                      {word}{' '}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom rounded corner on last step */}
              {stepIdx === STEPS.length - 1 && (
                <div className="about-step-bottom-corner">
                  <div className="about-heading-corner__base about-heading-corner__base--bottom" />
                  <div className="about-heading-corner__glow about-heading-corner__glow--bottom" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>


      <style>{`
        .about-section {
          position: relative;
          background: var(--color-background-light);
          font-size: 1vw;
          padding: 2em 1.25em 0;
        }

        /* ── Fixed blob backgrounds (clip-path keeps them inside section) ── */
        .about-fixed-wrapper {
          clip-path: inset(0);
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }
        .about-bg-layer {
          position: fixed;
          inset: 0;
          opacity: 0;
          transition: opacity 1.5s ease;
        }
        /* Crossfade driven by data-bg attribute — one per step */
        .about-section[data-bg="1"] .about-bg-layer--1 { opacity: 1; }
        .about-section[data-bg="2"] .about-bg-layer--2 { opacity: 1; }
        .about-section[data-bg="3"] .about-bg-layer--3 { opacity: 1; }
        .about-section[data-bg="4"] .about-bg-layer--4 { opacity: 1; }

        /* ── City skyline / nebula background images ── */
        .about-skyline {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.32;
          mix-blend-mode: screen;
          filter: saturate(0.6) hue-rotate(260deg) brightness(0.9);
          pointer-events: none;
          user-select: none;
        }
        /* Gradient overlay to tint skylines purple and match brand */
        .about-bg-layer::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg,
            rgba(14, 11, 31, 0.55) 0%,
            rgba(41, 30, 86, 0.35) 50%,
            rgba(14, 11, 31, 0.75) 100%);
          pointer-events: none;
        }

        /* ── Structure ── */
        .about-steps { position: relative; }
        .about-steps-with-line { position: relative; }

        /* ── Vertical side line ── */
        .about-side-line {
          position: absolute;
          top: 0; left: 0; bottom: 0;
          width: 2px;
          padding: 0.5em 0;
        }
        .about-glow-line { position: relative; width: 100%; height: 100%; }
        .about-glow-line__base {
          position: absolute; inset: 0;
          background: var(--color-secondary);
          opacity: 0.3;
        }
        .about-glow-line__glow {
          position: absolute; inset: 0;
          width: 3px; left: -0.5px;
          background: var(--color-secondary);
          opacity: 0.85;
          filter: blur(4px);
          transform-origin: top center;
          transform: scaleY(0);
        }

        /* Horizontal variant (step index) */
        .about-glow-line--h { width: 100%; height: 100%; }
        .about-glow-line__glow--h {
          width: 100%; height: 2px; left: 0;
          transform-origin: left center;
          transform: scaleX(0);
          transition: transform 0.4s ease;
        }

        /* ── Section heading — rounded corner top-left ── */
        .about-heading {
          position: relative;
          padding-bottom: 10em;
        }
        .about-heading-corner {
          position: relative;
          height: 0.5em;
        }
        .about-heading-corner__base {
          position: absolute; inset: 0;
          border-top: 2px solid var(--color-secondary);
          border-left: 2px solid var(--color-secondary);
          border-top-left-radius: 0.5em;
          opacity: 0.3;
        }
        .about-heading-corner__glow {
          position: absolute; inset: 0;
          border-top: 2px solid var(--color-secondary);
          border-left: 2px solid var(--color-secondary);
          border-top-left-radius: 0.5em;
          opacity: 0.75;
          filter: blur(4px);
        }
        .about-heading-corner__base--bottom {
          border-top: none;
          border-top-left-radius: 0;
          border-bottom: 2px solid var(--color-secondary);
          border-bottom-left-radius: 0.5em;
        }
        .about-heading-corner__glow--bottom {
          border-top: none;
          border-top-left-radius: 0;
          border-bottom: 2px solid var(--color-secondary);
          border-bottom-left-radius: 0.5em;
        }
        .about-caption {
          font-family: var(--font-stack-heading);
          font-size: 0.8125em;
          font-weight: 500;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          line-height: 1.1;
          color: var(--color-secondary);
          margin: 0;
        }

        /* ── Step ── */
        .about-step {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          position: relative;
        }
        .about-step--last { min-height: auto; }
        .about-step-bottom-corner {
          position: relative;
          height: 0.5em;
          margin-top: -0.5em;
        }

        /* ── Step heading grid ── */
        .about-step-heading {
          display: grid;
          grid-template-columns: 1fr 13fr;
          gap: 1.25em;
          align-items: start;
        }

        /* ── Step index ── */
        .about-step-index {
          display: flex;
          align-items: center;
          gap: 1em;
          padding-right: 25%;
          transform: translateY(-50%);
        }
        .about-step-index-line { flex: 1; height: 2px; }
        .about-step-index-num p {
          opacity: 0.5;
          transition: opacity 0.4s ease;
          margin: 0;
        }

        /* ── Step title ── */
        .about-step-h3 {
          font-family: var(--font-stack-heading);
          font-size: 6.875em;
          font-weight: 800;
          line-height: 0.88;
          text-transform: uppercase;
          letter-spacing: -0.03em;
          color: ${HEADING_COLOR};
          opacity: 0.45;
          position: relative;
          top: -0.4em;
          margin: 0;
          overflow-wrap: break-word;
          word-break: break-word;
          hyphens: auto;
        }

        /* Every second step heading is stroke */
        .about-step--stroke .about-step-h3 {
          color: transparent;
          -webkit-text-stroke: 1.5px ${HEADING_COLOR};
          text-stroke: 1.5px ${HEADING_COLOR};
        }

        /* ── Text-appear (heading line reveal) ── */
        .about-ta-mask {
          position: relative;
          display: block;
          overflow: clip;
          padding: 0.05em 0;
        }
        .about-ta-line {
          display: block;
          transform: translateY(105%);
          opacity: 0;
          filter: blur(6px);
          transition: transform 0.9s cubic-bezier(0.22, 1, 0.36, 1),
                      opacity 0.7s ease,
                      filter 0.8s ease;
          transition-delay: var(--delay, 0s);
        }

        /* ── Step body container ── */
        .about-step-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25em;
          flex: 1;
          padding-top: 6em;
          padding-bottom: 16em;
        }
        .about-step-content {
          grid-column: 2;
          font-family: var(--font-stack-body);
          font-size: 1.4em;
          font-weight: 500;
          letter-spacing: -0.01em;
          line-height: 1.15;
          color: var(--color-text-dark);
          opacity: 0.8;
          overflow: hidden;
          padding-right: 35%;
        }

        /* ── Word-by-word unblur ── */
        .about-ub-word {
          display: inline;
          opacity: 0;
          filter: blur(4px);
          transform: translateY(4px);
          transition: opacity 0.5s ease,
                      filter 0.5s ease,
                      transform 0.5s ease;
          transition-delay: var(--delay, 0s);
        }

        /* ═══ Triggered by .is-visible ═══ */
        .about-step.is-visible .about-glow-line__glow--h { transform: scaleX(1); }
        .about-step.is-visible .about-step-index-num p { opacity: 1; }
        .about-step.is-visible .about-ta-line { transform: translateY(0); opacity: 1; filter: blur(0); }
        .about-step.is-visible .about-ub-word { opacity: 1; filter: blur(0); transform: translateY(0); }


        /* ═══ Responsive ═══ */
        @media screen and (max-width: 991px) {
          .about-section { font-size: 2vw; }
          .about-step { min-height: 50vh; }
          .about-step--last { min-height: auto; }
          .about-heading { padding-bottom: 14.5em; }
          .about-step-heading { grid-template-columns: 1fr 11fr; }
          .about-step-index { padding-right: 0; }
          .about-step-container { padding-top: 4em; }
          .about-step-content { padding-right: 10%; }
          .about-step-title { padding-right: 10% !important; }
          .about-step-h3 { font-size: 4.375em; }
          .about-end-heading h3 { font-size: 3em; }
          .about-end-body p { font-size: 0.875em; }
        }

        @media screen and (max-width: 767px) {
          .about-section { font-size: 2.5vw; }
          .about-heading { padding-bottom: 10em; }
          .about-step-heading { grid-template-columns: 1fr 4fr; }
          .about-step-index { padding-right: 30%; }
          .about-step-index-num p { color: var(--color-secondary); opacity: 0.4; }
          .about-step-container {
            grid-template-columns: 1fr 4fr;
            padding-bottom: 8em;
            padding-top: 1.5em;
          }
          .about-step-content { font-size: 1em; line-height: 1.2; }
          /* Tighter padding so long titles have room to breathe */
          .about-step-title { padding-right: 0 !important; }
          .about-step-h3 { margin-left: -0.25em; font-size: 2.6em; line-height: 0.95; }
          .about-end-sticky { padding: 2em 1.25em; }

          /* Hide heavy bg layers on mobile — save memory + GPU */
          .about-fixed-wrapper { display: none; }

          /* Disable per-word stagger on mobile — show all text at once */
          .about-ub-word {
            opacity: 1 !important;
            filter: none !important;
            transform: none !important;
            transition: none !important;
          }
        }

        @media screen and (max-width: 479px) {
          .about-section { font-size: 4vw; }
          .about-step { min-height: 75vh; }
          .about-heading {
            padding-bottom: 7.5em;
            /* Clear the vertical side line so the top-left corner decoration
               sits flush with the line, not on top of body text below it */
            padding-left: 0;
          }
          /* Collapse the 1fr 4fr split into a single column so long titles
             get the full viewport width instead of being squeezed next to
             the index number */
          .about-step-heading {
            grid-template-columns: 1fr;
            gap: 0.5em;
          }
          .about-step-index {
            padding-right: 0;
            transform: none;
            /* Index keeps zero left padding so its horizontal tick line still
               touches the vertical side line — that's the intended timeline
               tick design */
          }
          .about-step-container {
            grid-template-columns: 1fr;
            padding-bottom: 6em;
          }
          /* Pad ONLY the title text and body text away from the vertical side
             line. ~1.5em gives ~22px clearance on a 375px phone so text never
             touches the line. The index row above remains flush so its tick
             still reads as part of the timeline. */
          .about-step-title {
            padding-right: 0 !important;
            padding-left: 1.5em;
          }
          .about-step-content {
            grid-column: 1;
            padding-right: 0;
            padding-left: 1.5em;
          }
          .about-step-h3 {
            font-size: 2em;
            line-height: 1;
            margin-left: 0;
            top: 0;
          }
          .about-end-heading h3 { font-size: 2em; }
          .about-end-tagline p { font-size: 1.5em; }
          .about-end-body p { font-size: 1em; }
        }

        /* ═══ Reduced motion ═══ */
        @media (prefers-reduced-motion: reduce) {
          .about-ta-line { transform: none !important; opacity: 1 !important; filter: none !important; transition: none !important; }
          .about-ub-word { opacity: 1 !important; filter: none !important; transform: none !important; transition: none !important; }
          .about-glow-line__glow--h { transform: scaleX(1) !important; transition: none !important; }
          .about-step-index-num p { opacity: 1 !important; }
          .about-bg-layer { opacity: 1 !important; transition: none !important; }
        }
      `}</style>
    </div>
  );
}

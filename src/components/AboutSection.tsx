import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const OCHRE = '#C8832A';
const HEADING_COLOR = '#c9b3ff';

const STEPS = [
  { num: '01', title: 'From Brand Voice\nto Human Connection', body: 'At H2H, we believe powerful brands are built on connection. It is not enough to be polished. You also need to be relevant, distinctive, and meaningful to the people you want to reach. Your brand needs a personality!', titlePadRight: '30%' },
  { num: '02', title: 'We Embed Ourselves\nin Your World', body: 'Working with H2H means gaining a partner that plugs into your team, understands your priorities, and helps drive the work forward. We adapt quickly, align closely, and support your growth with focus and purpose.', titlePadRight: '20%' },
  { num: '03', title: 'Strong Communication\nDrives ROI', body: 'H2H Social works alongside your internal team as an extra engine behind the brand, helping you build stronger relationships, generate better leads, and tell your company\'s story with more clarity and impact. Great communication makes you visible. It makes you credible. And it makes you worth choosing.', titlePadRight: '25%' },
  { num: '04', title: 'Building Brand Ecosystems\nThat Actually Work', body: 'Managing social media is easy. We do more than that! We build the full ecosystem around it, from content strategy and community management to paid amplification, creative production, and performance analytics. Every part works together. Every move has a purpose. And every touchpoint feels human.', titlePadRight: '25%' },
];

/* ── Blob background data (Figma African geography exports) ── */
interface Blob { x: number; y: number; w: number; h: number; rot?: number; g: string; opacity: number }

// Design base: 1440×900
const pct = (px: number, base: number) => `${(px / base) * 100}%`;
const blobStyle = (b: Blob): React.CSSProperties => ({
  position: 'absolute',
  left: pct(b.x, 1440),
  top: pct(b.y, 900),
  width: pct(b.w, 1440),
  height: pct(b.h, 900),
  borderRadius: '50%',
  background: b.g,
  transform: b.rot ? `rotate(${b.rot}deg)` : undefined,
  transformOrigin: '0 0',
  opacity: b.opacity,
});

/* ── V1 — Continent Silhouette (step 1, Figma image assets) ── */
const v1 = {
  ellipse:  'https://www.figma.com/api/mcp/asset/13b2e926-6146-42fa-bd80-b7a11e77c525',
  ellipse1: 'https://www.figma.com/api/mcp/asset/26354e42-1bb8-4155-990d-d5b86589eef0',
  vector:   'https://www.figma.com/api/mcp/asset/d58d7406-6db8-44f4-a9a5-8921e4f0776e',
  vector1:  'https://www.figma.com/api/mcp/asset/2e318e55-67cd-425b-9c30-c8b1f264ac56',
  ellipse2: 'https://www.figma.com/api/mcp/asset/25bb5fa1-b37e-44ad-a4a1-ced757964800',
  ellipse3: 'https://www.figma.com/api/mcp/asset/1d499dce-2ef6-4874-978e-e2203b21ef0b',
  ellipse4: 'https://www.figma.com/api/mcp/asset/d3b024a8-83fe-4c95-b278-56a2559fe4c0',
};

/* ── V2 — Nile River Path (step 2, Figma image assets) ── */
const v2 = {
  ellipse:    'https://www.figma.com/api/mcp/asset/08546c87-8dfa-4f09-8882-bb360314f1aa',
  ellipse1:   'https://www.figma.com/api/mcp/asset/a2ecb4cc-51ce-4621-b2aa-7dd8598a1073',
  ellipse2:   'https://www.figma.com/api/mcp/asset/0e711af9-3ecb-437a-97b3-309135537271',
  ellipse3:   'https://www.figma.com/api/mcp/asset/022e83e3-f9c0-49e0-bf11-dbc498fe0cdf',
  nileGlow:   'https://www.figma.com/api/mcp/asset/4e8e906e-19b8-4cd4-a8ba-d31a6bd4300f',
  nileMid:    'https://www.figma.com/api/mcp/asset/4942f4a3-3afe-4fe1-83ff-82b52c8c3438',
  nileBright: 'https://www.figma.com/api/mcp/asset/3e80c3f4-dfc9-437d-9b84-d3c769685c94',
  nileHair:   'https://www.figma.com/api/mcp/asset/d98c6b35-aae0-453f-8a41-c4a3c8cd4f12',
  delta1:     'https://www.figma.com/api/mcp/asset/68a7a46f-3137-4cc0-b304-4af0110da548',
  delta2:     'https://www.figma.com/api/mcp/asset/b149e625-d853-4104-843e-c5e3ee5f8924',
  delta3:     'https://www.figma.com/api/mcp/asset/2969cd62-1ebc-4dd4-9266-819f9863b52f',
  delta4:     'https://www.figma.com/api/mcp/asset/ff4b56a9-3d35-44b4-b71b-f0cae102656a',
  source:     'https://www.figma.com/api/mcp/asset/e3482ea6-3389-4eb2-b512-effb2f9eeafd',
  sourceGlow: 'https://www.figma.com/api/mcp/asset/dc301bf1-8f47-4e10-bb1b-53bbe3221935',
};

// V3 — Sahara Dune Arc (step 3)
const V3: Blob[] = [
  { x: -200, y: -300, w: 1800, h: 700, g: 'radial-gradient(100% 100% at 0% 0%, rgba(33,33,36,0.9), rgba(33,33,36,0.6) 60%, rgba(33,33,36,0))', opacity: 0.8 },
  { x: -300, y: 500, w: 2000, h: 700, g: 'radial-gradient(100% 100% at 0% 0%, rgba(56,54,59,0.6), rgba(56,54,59,0.4) 60%, rgba(56,54,59,0))', opacity: 0.9 },
  { x: -100, y: 480, w: 700, h: 450, rot: 5, g: 'radial-gradient(100% 100% at 0% 0%, #1a1535, rgba(87,84,92,0.26) 60%, rgba(87,84,92,0))', opacity: 0.7 },
  { x: 800, y: 460, w: 700, h: 450, rot: -5, g: 'radial-gradient(100% 100% at 0% 0%, #1a1535, rgba(87,84,92,0.26) 60%, rgba(87,84,92,0))', opacity: 0.7 },
  { x: 300, y: 520, w: 800, h: 380, g: 'radial-gradient(100% 100% at 0% 0%, #1a1535, rgba(56,54,59,0.32) 60%, rgba(56,54,59,0))', opacity: 0.65 },
  { x: 200, y: 80, w: 1000, h: 300, rot: -2, g: 'radial-gradient(100% 100% at 0% 0%, rgba(87,84,92,0.15), rgba(87,84,92,0.09) 60%, rgba(87,84,92,0))', opacity: 0.6 },
  { x: 642, y: 492, w: 158, h: 76, g: 'radial-gradient(100% 100% at 0% 0%, rgba(235,232,240,0.18), rgba(235,232,240,0.11) 60%, rgba(235,232,240,0))', opacity: 0.9 },
];

const BLOB_SETS_V3 = [V3]; // V3 is CSS gradients; V1,V2,V4,V5 are image-based

/* ── V4 — Great Rift Valley (step 4, Figma image assets) ── */
const v4 = {
  plate:  'https://www.figma.com/api/mcp/asset/6ce79fda-5815-4e40-9cc8-a4067c9f603f',
  rift:   ['https://www.figma.com/api/mcp/asset/7be415fd-58ed-43d0-a12d-379582ad42cb','https://www.figma.com/api/mcp/asset/00d5c801-0cf6-4c00-b729-102fb1b2524e','https://www.figma.com/api/mcp/asset/325617d5-d331-4e2d-8988-d4a99c736dfc','https://www.figma.com/api/mcp/asset/93d6c8cd-3c62-4b7a-82a7-ad920a4fe58a'],
  lake1:  'https://www.figma.com/api/mcp/asset/992a1a8c-62ab-4fdc-b0c1-fcec3f765da0',
  lake2:  'https://www.figma.com/api/mcp/asset/97ad7c81-d062-4baa-a8d7-2fd8908e9ed1',
  lake3:  'https://www.figma.com/api/mcp/asset/de1e3093-dfc7-4051-b3c7-305c70285438',
  escarp: 'https://www.figma.com/api/mcp/asset/594d3c1d-599c-4305-a3cb-b4cbc9ff8c60',
};

/* ── V5 — Congo Basin (step 5, Figma image assets) ── */
const v5 = {
  canopy:     'https://www.figma.com/api/mcp/asset/bafe8b60-ef41-4e29-a138-1726ddaadeb4',
  basin:      'https://www.figma.com/api/mcp/asset/2b61f93f-82a4-4883-bfe3-f4b3e343e49f',
  rim:        'https://www.figma.com/api/mcp/asset/d64b3f7b-8c9c-4907-b456-93f07fecaef7',
  rimLine:    'https://www.figma.com/api/mcp/asset/20e38843-f7ac-4444-b8f5-0d9e1b8b37f7',
  tribs: [
    ['https://www.figma.com/api/mcp/asset/4bcb091b-9a35-499c-b815-dfa6c3a4a79f',338,222,382,228],
    ['https://www.figma.com/api/mcp/asset/234e4b4c-6b47-489b-a0e4-f862b3d1272a',618,82,102,368],
    ['https://www.figma.com/api/mcp/asset/8282b450-3e1d-4e70-a811-bd04eaf70d2c',720,82,182,368],
    ['https://www.figma.com/api/mcp/asset/d09ffd14-ae57-469b-9110-49c6d9ffa2c6',720,242,402,208],
    ['https://www.figma.com/api/mcp/asset/cf7bf4bd-429d-4020-877f-0caf7d5e8a13',720,450,382,152],
    ['https://www.figma.com/api/mcp/asset/f6e6512d-dfa4-4541-8bde-1b619b7d5016',542,450,178,332],
    ['https://www.figma.com/api/mcp/asset/78f0ce15-4e58-4da0-a292-fbbb21f58278',278,450,442,172],
    ['https://www.figma.com/api/mcp/asset/8c1e5c81-2d2b-4b92-996d-d881600734e6',238,382,482,68],
  ] as [string,number,number,number,number][],
  tribBright1:'https://www.figma.com/api/mcp/asset/eef03c6f-6b72-4b6b-b319-71ee7fd957e1',
  tribBright2:'https://www.figma.com/api/mcp/asset/df74a4dc-1306-4c2d-9b27-117059592620',
  riverMain:  'https://www.figma.com/api/mcp/asset/4d54db44-0c8f-40a1-9b3e-db015b35f8c5',
  riverBright:'https://www.figma.com/api/mcp/asset/9ba88f6c-1dde-4f9b-9b19-876b4494b337',
  canopyBlobs: [
    ['https://www.figma.com/api/mcp/asset/26730ebb-c28f-4549-bfe8-19f5d2b7eb1f',320,240,80,-23,-15],
    ['https://www.figma.com/api/mcp/asset/f5f61059-aeb7-4768-bd25-2f6dcf90906c',360,260,846,40,12],
    ['https://www.figma.com/api/mcp/asset/d5b7c2b3-cf6e-43ff-9fc7-b9c506a4f86f',340,260,4,600,8],
    ['https://www.figma.com/api/mcp/asset/fee3f649-b7b1-4c7a-8d2d-fb4a72c1e4ec',320,240,1000,524,-10],
    ['https://www.figma.com/api/mcp/asset/c6b51e47-33c8-478b-bfac-97cdbfe61ead',200,300,-50,283,-5],
    ['https://www.figma.com/api/mcp/asset/a8d627e9-31c2-4ac6-9c33-97ea6365c7f1',220,300,1254,280,5],
  ] as [string,number,number,number,number,number][],
  haze: 'https://www.figma.com/api/mcp/asset/f2062bdd-7eb8-4bb2-8d89-895445c2ea11',
};

/* ── City skyline / nebula background images — one per step ── */
const SKYLINES = [
  'https://images.unsplash.com/photo-1577948000111-9c970dfe3743?w=1200&q=80', // Johannesburg skyline
  'https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=1200&q=80', // Nairobi skyline
  'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1200&q=80', // Purple nebula/stars
  'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1200&q=80', // Purple nebula/stars 2
];

// Helper for image positioning (1440×900 base)
const ip = (x: number, y: number, w: number, h: number, rot?: number): React.CSSProperties => ({
  position: 'absolute',
  left: pct(x, 1440), top: pct(y, 900),
  width: pct(w, 1440), height: pct(h, 900),
  transform: rot ? `rotate(${rot}deg)` : undefined,
  transformOrigin: '0 0',
});

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
        {/* V1 — Johannesburg skyline */}
        <div className="about-bg-layer about-bg-layer--1">
          <div style={ip(-397, -200, 900, 700, 8)}><img src={v1.ellipse} style={{ width: '100%', height: '100%' }} /></div>
          <div style={ip(700, 330, 800, 600, -5)}><img src={v1.ellipse1} style={{ width: '100%', height: '100%' }} /></div>
          <img src={v1.vector} style={ip(239, 24, 518, 738)} />
          <img src={v1.vector1} style={ip(189, 0, 627, 852)} />
          <img src={SKYLINES[0]} alt="" className="about-skyline" />
        </div>

        {/* V2 — Nairobi skyline */}
        <div className="about-bg-layer about-bg-layer--2">
          <img src={v2.ellipse} style={ip(-100, -200, 1000, 600)} />
          <img src={v2.ellipse1} style={ip(200, 500, 1000, 600)} />
          {[v2.nileGlow, v2.nileMid, v2.nileBright].map((src, i) => (
            <img key={i} src={src} style={ip(580, -20, 180, 940)} />
          ))}
          <img src={SKYLINES[1]} alt="" className="about-skyline" />
        </div>

        {/* V3 — Purple nebula */}
        <div className="about-bg-layer about-bg-layer--3">
          {BLOB_SETS_V3[0].map((b, i) => <div key={i} style={blobStyle(b)} />)}
          <img src={SKYLINES[2]} alt="" className="about-skyline" />
        </div>

        {/* V4 — Purple stars */}
        <div className="about-bg-layer about-bg-layer--4">
          <div style={ip(-453, -100, 1100, 1100, 8)}><img src={v4.plate} style={{ width: '100%', height: '100%' }} /></div>
          <div style={ip(447, -100, 1100, 1100, 8)}><img src={v4.plate} style={{ width: '100%', height: '100%' }} /></div>
          <img src={SKYLINES[3]} alt="" className="about-skyline" />
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
          top: 0; left: 0;
          width: 100vw;
          height: 100vh;
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
          opacity: 0.08;
          mix-blend-mode: luminosity;
          pointer-events: none;
          user-select: none;
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
          .about-step-title { padding-right: 15% !important; }
          .about-step-h3 { margin-left: -1em; }
          .about-end-sticky { padding: 2em 1.25em; }
        }

        @media screen and (max-width: 479px) {
          .about-section { font-size: 4vw; }
          .about-step { min-height: 75vh; }
          .about-heading { padding-bottom: 7.5em; }
          .about-step-h3 { font-size: 3em; }
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

import { useState, useCallback } from 'react';
import { Building2, Users, Megaphone, Globe, Target, FileText } from 'lucide-react';
import { CentralHub } from './CentralHub';
import { OrbitRing } from './OrbitRing';
import { PlanetNode } from './PlanetNode';
import { PillarOverlay } from '../island/PillarOverlay';

const INNER_RADIUS = 140;
const OUTER_RADIUS = 230;

const INNER_PLANETS = [
  { icon: <Building2 size={20} />, label: 'Company Pages', accent: '#a46cfc', startAngle: 0 },
  { icon: <Users size={20} />, label: 'Leadership Branding', accent: '#8b5cf6', startAngle: 120 },
  { icon: <Megaphone size={20} />, label: 'Advocacy Program', accent: '#c084fc', startAngle: 240 },
];

const OUTER_PLANETS = [
  { icon: <Globe size={20} />, label: 'Website Design + SEO', accent: '#60a5fa', startAngle: 60 },
  { icon: <Target size={20} />, label: 'Paid Campaigns', accent: '#34d399', startAngle: 180 },
  { icon: <FileText size={20} />, label: 'Content Writing', accent: '#fbbf24', startAngle: 300 },
];

export function HeroGalaxy() {
  const [hovering, setHovering] = useState(false);
  const [pillarIndex, setPillarIndex] = useState<number | null>(null);

  const handleInnerClick = useCallback((index: number) => {
    setPillarIndex(index);
  }, []);

  const handleOuterClick = useCallback((index: number) => {
    const serviceSection = document.getElementById('services');
    if (serviceSection) {
      serviceSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleClosePillar = useCallback(() => setPillarIndex(null), []);
  const handleNavigatePillar = useCallback((i: number) => setPillarIndex(i), []);

  return (
    <>
      <div
        className="relative hidden md:flex items-center justify-center"
        style={{ width: OUTER_RADIUS * 2 + 80, height: OUTER_RADIUS * 2 + 80 }}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        aria-hidden="true"
      >
        <OrbitRing
          radius={INNER_RADIUS}
          strokeColor="rgba(164,108,252,0.14)"
          dashArray="4 8"
          duration={90}
          paused={hovering}
        />
        <OrbitRing
          radius={OUTER_RADIUS}
          strokeColor="rgba(164,108,252,0.08)"
          dashArray="6 12"
          duration={120}
          reverse
          paused={hovering}
        />

        <CentralHub />

        {INNER_PLANETS.map((planet, i) => (
          <PlanetNode
            key={planet.label}
            icon={planet.icon}
            label={planet.label}
            accentColor={planet.accent}
            angle={planet.startAngle}
            radius={INNER_RADIUS}
            onClick={() => handleInnerClick(i)}
            orbitDuration={90}
            paused={hovering}
          />
        ))}

        {OUTER_PLANETS.map((planet, i) => (
          <PlanetNode
            key={planet.label}
            icon={planet.icon}
            label={planet.label}
            accentColor={planet.accent}
            angle={planet.startAngle}
            radius={OUTER_RADIUS}
            onClick={() => handleOuterClick(i)}
            orbitDuration={120}
            reverse
            paused={hovering}
          />
        ))}
      </div>

      <div className="flex md:hidden overflow-x-auto gap-3 pb-2 -mx-2 px-2" style={{ scrollbarWidth: 'none' }}>
        {[...INNER_PLANETS, ...OUTER_PLANETS].map((planet, i) => (
          <button
            key={planet.label}
            onClick={() => (i < 3 ? handleInnerClick(i) : handleOuterClick(i - 3))}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 transition-all duration-200 cursor-pointer"
            style={{
              background: 'rgba(41,30,86,0.2)',
              border: `1px solid ${planet.accent}35`,
              borderRadius: 6,
              color: 'rgba(255,255,255,0.8)',
              fontSize: 12,
              fontFamily: 'var(--font-stack-heading)',
              letterSpacing: '0.04em',
              minHeight: 44,
            }}
          >
            <span style={{ color: planet.accent }}>{planet.icon}</span>
            <span className="whitespace-nowrap">{planet.label}</span>
          </button>
        ))}
      </div>

      <PillarOverlay
        pillarIndex={pillarIndex}
        onClose={handleClosePillar}
        onNavigate={handleNavigatePillar}
      />
    </>
  );
}

import { useState, useCallback } from 'react';
import { Megaphone, Globe, Target, FileText } from 'lucide-react';
import { CentralHub } from './CentralHub';
import { OrbitRing } from './OrbitRing';
import { PlanetNode } from './PlanetNode';
import { PillarOverlay } from '../island/PillarOverlay';

const INNER_RADIUS = 140;
const OUTER_RADIUS = 230;

const INNER_PLANETS = [
  { icon: <Megaphone size={20} />, label: 'Advocacy Program', accent: '#c084fc', startAngle: 0 },
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

      <PillarOverlay
        pillarIndex={pillarIndex}
        onClose={handleClosePillar}
        onNavigate={handleNavigatePillar}
      />
    </>
  );
}

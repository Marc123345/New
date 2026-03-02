import { useState, useCallback } from 'react';
import { Megaphone, Globe, Target, FileText, User, Users, UserCircle, UserCheck, Heart, Smile } from 'lucide-react';
import { CentralHub } from './CentralHub';
import { OrbitRing } from './OrbitRing';
import { PlanetNode } from './PlanetNode';
import { PillarOverlay } from '../island/PillarOverlay';

const INNER_RADIUS = 140;
const OUTER_RADIUS = 230;
const PEOPLE_RADIUS = 320;

const INNER_PLANETS = [
  { icon: <Megaphone size={20} />, label: 'Advocacy Program', accent: '#c084fc', startAngle: 0 },
];

const OUTER_PLANETS = [
  { icon: <Globe size={20} />, label: 'Website Design + SEO', accent: '#60a5fa', startAngle: 60 },
  { icon: <Target size={20} />, label: 'Paid Campaigns', accent: '#34d399', startAngle: 180 },
  { icon: <FileText size={20} />, label: 'Content Writing', accent: '#fbbf24', startAngle: 300 },
];

const PEOPLE_NODES = [
  { icon: <User size={18} />, label: 'Real Connections', accent: '#f9a8d4', startAngle: 0 },
  { icon: <Users size={18} />, label: 'Community Building', accent: '#a5f3fc', startAngle: 51 },
  { icon: <UserCircle size={18} />, label: 'Personal Branding', accent: '#bbf7d0', startAngle: 103 },
  { icon: <Heart size={18} />, label: 'Brand Loyalty', accent: '#fda4af', startAngle: 154 },
  { icon: <UserCheck size={18} />, label: 'Trust & Authority', accent: '#fed7aa', startAngle: 205 },
  { icon: <Smile size={18} />, label: 'Human Experience', accent: '#ddd6fe', startAngle: 257 },
  { icon: <User size={18} />, label: 'Thought Leadership', accent: '#c4b5fd', startAngle: 308 },
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
        style={{ width: PEOPLE_RADIUS * 2 + 80, height: PEOPLE_RADIUS * 2 + 80 }}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        aria-hidden="true"
      >
        <OrbitRing
          radius={INNER_RADIUS}
          strokeColor="rgba(164,108,252,0.14)"
          dashPattern="4 8"
          rotationDuration={90}
          paused={hovering}
        />
        <OrbitRing
          radius={OUTER_RADIUS}
          strokeColor="rgba(164,108,252,0.08)"
          dashPattern="6 12"
          rotationDuration={120}
          reverse
          paused={hovering}
        />
        <OrbitRing
          radius={PEOPLE_RADIUS}
          strokeColor="rgba(249,168,212,0.1)"
          dashPattern="3 10"
          rotationDuration={160}
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

        {PEOPLE_NODES.map((node, i) => (
          <PlanetNode
            key={node.label}
            icon={node.icon}
            label={node.label}
            accentColor={node.accent}
            angle={node.startAngle}
            radius={PEOPLE_RADIUS}
            onClick={() => {}}
            orbitDuration={160}
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

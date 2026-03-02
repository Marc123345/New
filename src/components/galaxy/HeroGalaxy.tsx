import { useState, useCallback } from 'react';
import { SERVICES } from '../../constants/ecosystem';
import { CentralHub } from './CentralHub';
import { OrbitRing } from './OrbitRing';
import { PlanetNode } from './PlanetNode';
import { Starfield } from './Starfield';
import { PillarOverlay } from '../island/PillarOverlay';

const INNER_RADIUS = 180;
const OUTER_RADIUS = 290;

const PLANET_ACCENTS = [
  '#c084fc',
  '#a78bfa',
  '#8b5cf6',
  '#60a5fa',
  '#34d399',
  '#fbbf24',
];

const corePillars = SERVICES.filter(s => s.type === 'core');
const specializedServices = SERVICES.filter(s => s.type === 'specialized');

function getServiceGlobalIndex(service: typeof SERVICES[number]) {
  return SERVICES.indexOf(service);
}

export function HeroGalaxy() {
  const [hovering, setHovering] = useState(false);
  const [pillarIndex, setPillarIndex] = useState<number | null>(null);
  const [, setHoveredPlanet] = useState<number | null>(null);

  const handlePlanetHover = useCallback((index: number | null) => {
    setHoveredPlanet(index);
    setHovering(index !== null);
  }, []);

  const handleInnerClick = useCallback((localIndex: number) => {
    const globalIndex = getServiceGlobalIndex(corePillars[localIndex]);
    setPillarIndex(globalIndex);
  }, []);

  const handleOuterClick = useCallback((_localIndex: number) => {
    const serviceSection = document.getElementById('services');
    if (serviceSection) {
      serviceSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleClosePillar = useCallback(() => setPillarIndex(null), []);
  const handleNavigatePillar = useCallback((i: number) => setPillarIndex(i), []);

  const innerAngles = corePillars.map((_, i) => (i / corePillars.length) * 360 - 90);
  const outerAngles = specializedServices.map((_, i) => (i / specializedServices.length) * 360 - 90);

  return (
    <>
      <div
        className="relative hidden md:flex items-center justify-center"
        style={{ width: OUTER_RADIUS * 2 + 80, height: OUTER_RADIUS * 2 + 80 }}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => { setHovering(false); setHoveredPlanet(null); }}
      >
        <Starfield />

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

        <CentralHub />

        {corePillars.map((service, i) => (
          <PlanetNode
            key={service.title}
            icon={service.icon}
            label={service.title}
            accentColor={PLANET_ACCENTS[i]}
            angle={innerAngles[i]}
            radius={INNER_RADIUS}
            onClick={() => handleInnerClick(i)}
            orbitDuration={90}
            paused={hovering}
            onHoverChange={(isHovered) => handlePlanetHover(isHovered ? i : null)}
          />
        ))}

        {specializedServices.map((service, i) => (
          <PlanetNode
            key={service.title}
            icon={service.icon}
            label={service.title}
            accentColor={PLANET_ACCENTS[3 + i]}
            angle={outerAngles[i]}
            radius={OUTER_RADIUS}
            onClick={() => handleOuterClick(i)}
            orbitDuration={120}
            reverse
            paused={hovering}
            onHoverChange={(isHovered) => handlePlanetHover(isHovered ? 3 + i : null)}
          />
        ))}
      </div>

      <div className="flex md:hidden flex-wrap justify-center gap-4 px-4">
        {SERVICES.map((service, i) => (
          <button
            key={service.title}
            onClick={() => {
              if (service.type === 'core') {
                setPillarIndex(i);
              } else {
                const serviceSection = document.getElementById('services');
                serviceSection?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="flex flex-col items-center gap-2 p-4 rounded-xl transition-transform duration-200 active:scale-95"
            style={{
              width: 100,
              background: `radial-gradient(circle at 35% 35%, ${PLANET_ACCENTS[i]}20, ${PLANET_ACCENTS[i]}08)`,
              border: `1px solid ${PLANET_ACCENTS[i]}30`,
            }}
          >
            <div
              className="flex items-center justify-center rounded-full"
              style={{
                width: 44,
                height: 44,
                background: `radial-gradient(circle at 35% 35%, ${PLANET_ACCENTS[i]}40, ${PLANET_ACCENTS[i]}18)`,
                border: `1px solid ${PLANET_ACCENTS[i]}50`,
                color: '#fff',
              }}
            >
              <span className="flex items-center justify-center" style={{ width: 20, height: 20 }}>
                {service.icon}
              </span>
            </div>
            <span
              className="text-[10px] text-center leading-tight tracking-wide uppercase"
              style={{
                color: 'rgba(255,255,255,0.7)',
                fontFamily: 'var(--font-stack-heading)',
              }}
            >
              {service.title}
            </span>
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

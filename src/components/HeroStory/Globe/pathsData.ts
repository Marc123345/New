import { worldPopulationData } from './worldPopulation';

const cityMap = new Map(worldPopulationData.map((c) => [c.city!, c]));
const c = (name: string) => {
  const city = cityMap.get(name)!;
  return [city.lat, city.lng] as [number, number];
};

interface PathDef {
  points: [number, number][];
  color: string[];
}

const GLOW_CYAN = ['rgba(56,189,248,0.0)', 'rgba(56,189,248,0.8)', 'rgba(56,189,248,0.8)', 'rgba(56,189,248,0.0)'];
const GLOW_TEAL = ['rgba(45,212,191,0.0)', 'rgba(45,212,191,0.7)', 'rgba(45,212,191,0.7)', 'rgba(45,212,191,0.0)'];
const GLOW_AMBER = ['rgba(251,191,36,0.0)', 'rgba(251,191,36,0.7)', 'rgba(251,191,36,0.7)', 'rgba(251,191,36,0.0)'];
const GLOW_ROSE = ['rgba(251,113,133,0.0)', 'rgba(251,113,133,0.6)', 'rgba(251,113,133,0.6)', 'rgba(251,113,133,0.0)'];
const GLOW_VIOLET = ['rgba(192,132,252,0.0)', 'rgba(192,132,252,0.7)', 'rgba(192,132,252,0.7)', 'rgba(192,132,252,0.0)'];

const northAmericaRoutes: PathDef[] = [
  { points: [c('Seattle'), c('San Francisco'), c('Los Angeles'), c('Phoenix'), c('Houston'), c('Miami')], color: GLOW_CYAN },
  { points: [c('Vancouver'), c('Seattle'), c('Denver'), c('Chicago'), c('Toronto'), c('Ottawa')], color: GLOW_TEAL },
  { points: [c('Los Angeles'), c('Denver'), c('Chicago'), c('New York'), c('Boston')], color: GLOW_CYAN },
  { points: [c('Houston'), c('Atlanta'), c('New York')], color: GLOW_TEAL },
  { points: [c('Miami'), c('Atlanta'), c('Chicago')], color: GLOW_VIOLET },
  { points: [c('Mexico City'), c('Houston'), c('Atlanta')], color: GLOW_AMBER },
];

const southAmericaRoutes: PathDef[] = [
  { points: [c('São Paulo'), c('Rio de Janeiro')], color: GLOW_AMBER },
  { points: [c('Buenos Aires'), c('São Paulo')], color: GLOW_ROSE },
  { points: [c('Buenos Aires'), c('Rio de Janeiro')], color: GLOW_AMBER },
];

const europeRoutes: PathDef[] = [
  { points: [c('London'), c('Paris'), c('Berlin'), c('Moscow')], color: GLOW_CYAN },
  { points: [c('Madrid'), c('Paris'), c('Rome'), c('Istanbul')], color: GLOW_TEAL },
  { points: [c('Stockholm'), c('Berlin'), c('Rome')], color: GLOW_VIOLET },
  { points: [c('London'), c('Madrid')], color: GLOW_ROSE },
  { points: [c('Istanbul'), c('Moscow')], color: GLOW_AMBER },
  { points: [c('Beirut'), c('Istanbul'), c('Ankara')], color: GLOW_CYAN },
];

const africaMiddleEastRoutes: PathDef[] = [
  { points: [c('Cairo'), c('Lagos')], color: GLOW_AMBER },
  { points: [c('Cairo'), c('Nairobi'), c('Johannesburg')], color: GLOW_TEAL },
  { points: [c('Lagos'), c('Nairobi')], color: GLOW_ROSE },
  { points: [c('Dubai'), c('Cairo')], color: GLOW_CYAN },
  { points: [c('Dubai'), c('Karachi'), c('Mumbai')], color: GLOW_VIOLET },
];

const asiaRoutes: PathDef[] = [
  { points: [c('Tokyo'), c('Osaka'), c('Seoul'), c('Beijing'), c('Shanghai')], color: GLOW_CYAN },
  { points: [c('Mumbai'), c('Delhi'), c('Kolkata'), c('Dhaka')], color: GLOW_TEAL },
  { points: [c('Delhi'), c('Lahore'), c('Karachi')], color: GLOW_AMBER },
  { points: [c('Bangalore'), c('Chennai'), c('Hyderabad'), c('Mumbai')], color: GLOW_ROSE },
  { points: [c('Bangkok'), c('Ho Chi Minh City'), c('Hanoi'), c('Hong Kong'), c('Shanghai')], color: GLOW_CYAN },
  { points: [c('Singapore'), c('Kuala Lumpur'), c('Bangkok')], color: GLOW_VIOLET },
  { points: [c('Jakarta'), c('Singapore'), c('Manila')], color: GLOW_TEAL },
  { points: [c('Hong Kong'), c('Manila'), c('Tokyo')], color: GLOW_AMBER },
  { points: [c('Seoul'), c('Busan')], color: GLOW_ROSE },
  { points: [c('Jaipur'), c('Delhi')], color: GLOW_VIOLET },
];

const oceaniaRoutes: PathDef[] = [
  { points: [c('Sydney'), c('Melbourne')], color: GLOW_CYAN },
  { points: [c('Sydney'), c('Jakarta')], color: GLOW_TEAL },
];

const ALL_ROUTES = [
  ...northAmericaRoutes,
  ...southAmericaRoutes,
  ...europeRoutes,
  ...africaMiddleEastRoutes,
  ...asiaRoutes,
  ...oceaniaRoutes,
];

const MOBILE_ROUTES = [
  ...northAmericaRoutes.slice(0, 3),
  ...southAmericaRoutes.slice(0, 1),
  ...europeRoutes.slice(0, 3),
  ...africaMiddleEastRoutes.slice(0, 2),
  ...asiaRoutes.slice(0, 4),
  ...oceaniaRoutes.slice(0, 1),
];

function toPathObj(def: PathDef) {
  return {
    points: def.points,
    color: def.color,
  };
}

export const LAND_PATHS = ALL_ROUTES.map(toPathObj);
export const LAND_PATHS_MOBILE = MOBILE_ROUTES.map(toPathObj);

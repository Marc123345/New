export interface AfricaContact {
  id: string;
  name: string;
  company: string;
  country: string;
  countryCode: string;
  city?: string;
  role: string;
  avatar?: string;
}

export interface CountryDot {
  code: string;
  name: string;
  cx: number;
  cy: number;
}

export const AFRICA_CONTACTS: AfricaContact[] = [
  {
    id: "c1",
    name: "Amara Okafor",
    company: "TechVentures Nigeria",
    country: "Nigeria",
    countryCode: "NG",
    city: "Lagos",
    role: "CEO",
    avatar: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?w=200&h=200&fit=crop",
  },
  {
    id: "c2",
    name: "Kwame Mensah",
    company: "GhanaFintech",
    country: "Ghana",
    countryCode: "GH",
    city: "Accra",
    role: "Founder",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
  },
  {
    id: "c3",
    name: "Zainab Hassan",
    company: "EduTech Kenya",
    country: "Kenya",
    countryCode: "KE",
    city: "Nairobi",
    role: "Director",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop",
  },
  {
    id: "c4",
    name: "Thabo Nkosi",
    company: "SA Digital Solutions",
    country: "South Africa",
    countryCode: "ZA",
    city: "Johannesburg",
    role: "Managing Director",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
  },
  {
    id: "c5",
    name: "Fatima Diallo",
    company: "Senegal Commerce",
    country: "Senegal",
    countryCode: "SN",
    city: "Dakar",
    role: "Co-Founder",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop",
  },
  {
    id: "c6",
    name: "Mohamed El-Amin",
    company: "CairoTech Solutions",
    country: "Egypt",
    countryCode: "EG",
    city: "Cairo",
    role: "CTO",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
  },
  {
    id: "c7",
    name: "Grace Mwangi",
    company: "TanzConnect",
    country: "Tanzania",
    countryCode: "TZ",
    city: "Dar es Salaam",
    role: "Head of Operations",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
  },
  {
    id: "c8",
    name: "Ousmane Mbaye",
    company: "MoroccoDigital",
    country: "Morocco",
    countryCode: "MA",
    city: "Casablanca",
    role: "VP Engineering",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
  },
];

export const COUNTRY_DOTS: CountryDot[] = [
  { code: "MA", name: "Morocco", cx: 170, cy: 82 },
  { code: "EG", name: "Egypt", cx: 285, cy: 100 },
  { code: "SN", name: "Senegal", cx: 120, cy: 165 },
  { code: "NG", name: "Nigeria", cx: 195, cy: 192 },
  { code: "GH", name: "Ghana", cx: 175, cy: 192 },
  { code: "KE", name: "Kenya", cx: 310, cy: 220 },
  { code: "TZ", name: "Tanzania", cx: 300, cy: 248 },
  { code: "ZA", name: "South Africa", cx: 255, cy: 345 },
];

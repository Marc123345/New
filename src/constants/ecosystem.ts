import { Building2, Users, Megaphone } from 'lucide-react';
import React from 'react';

export const SERVICES = [
  {
    type: 'core',
    subtitle: "Pillar 01",
    title: "Company Pages",
    description: "Your company's social presence is your digital storefront, but most brands leave it looking empty or generic. We turn your pages into platforms for thought leadership, brand storytelling, and meaningful engagement.",
    whatWeDo: [
      "Brand awareness campaigns",
      "Product promotion",
      "Employer branding",
      "Community engagement",
      "Video content",
    ],
    closingNote: null,
    deliverables: ["Brand Awareness Campaigns", "Product & Event Promotion", "Employer Branding Content", "Community Engagement", "Video Content"],
    icon: React.createElement(Building2, { size: 28 }),
    image: "https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg?auto=compress&cs=tinysrgb&w=1200",
    stats: [
      { label: "Avg. Engagement Lift", value: "3.2x" },
      { label: "Brand Impressions", value: "+180%" },
      { label: "Follower Growth", value: "+45%" },
    ],
  },
  {
    type: 'core',
    subtitle: "Pillar 02",
    title: "Leadership Branding",
    description: "People want to hear from other people. We help your executives step into the spotlight with purpose, clarity, and authenticity — positioning them as respected voices in your industry.",
    whatWeDo: [
      "Tailored content creation",
      "Strategic alignment",
      "Industry thought leadership",
      "Ghost-writing",
    ],
    closingNote: "By helping leaders build presence, we position your company as the home of the voices shaping the industry.",
    deliverables: ["Tailored Content Creation", "Alignment with Business Strategy", "Industry Thought Leadership", "Content & Ghost-writing"],
    icon: React.createElement(Users, { size: 28 }),
    image: "https://images.pexels.com/photos/2381069/pexels-photo-2381069.jpeg?auto=compress&cs=tinysrgb&w=1200",
    stats: [
      { label: "Profile Views", value: "+240%" },
      { label: "Connection Growth", value: "5x" },
      { label: "Content Reach", value: "+320%" },
    ],
  },
  {
    type: 'core',
    subtitle: "Pillar 03",
    title: "Advocacy Program",
    description: "The most trusted voices in your company aren't always in the C-suite — they're on your teams. Our Advocacy Program turns employees into empowered storytellers.",
    whatWeDo: [
      "Monthly workshops",
      "Shareable content kits",
      "Scalable infrastructure",
      "Culture-first programming",
    ],
    closingNote: "We create internal champions who amplify your message and expand your reach through real human connection.",
    deliverables: ["Monthly Workshops & Training", "Shareable Content Kits & Templates", "Scalable Infrastructure", "Culture-first Programming"],
    icon: React.createElement(Megaphone, { size: 28 }),
    image: "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1200",
    stats: [
      { label: "Employee Reach", value: "10x" },
      { label: "Organic Amplification", value: "+560%" },
      { label: "Team Participation", value: "78%" },
    ],
  },
];

export const PILLARS = SERVICES.filter(s => s.type === 'core');
export const SECONDARY_SERVICES: typeof SERVICES = [];

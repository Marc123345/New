import { Building2, Users, Megaphone, Globe, Target, FileText } from 'lucide-react';
import React from 'react';

export const SERVICES = [
  {
    type: 'core',
    subtitle: "Pillar 01",
    title: "Company Pages",
    description: "Your company's social presence is your digital storefront, but most brands leave it looking empty or generic. We turn your pages into platforms for thought leadership, brand storytelling, and meaningful engagement. We help your brand show up consistently and confidently — with a voice that feels human, even when it's speaking at scale.",
    whatWeDo: [
      "Brand awareness campaigns",
      "Product and event promotion",
      "Employer branding content",
      "Community engagement",
      "Video content",
      "Always-on posting that builds credibility",
      "Long-form content creation and website enrichment",
    ],
    closingNote: null,
    deliverables: ["Brand Awareness Campaigns", "Product & Event Promotion", "Employer Branding Content", "Community Engagement", "Video Content", "Always-on Posting", "Long-form Content & Website Enrichment"],
    icon: React.createElement(Building2, { size: 32 }),
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
      "Tailored content creation that reflects each leader's personality and POV",
      "Alignment between personal narratives and business strategy",
      "Positioning as industry thought leaders — not just internal champions",
      "Content and ghost-writing that drives conversations",
    ],
    closingNote: "By helping leaders build presence, trust, and lasting influence, we position your company as the home of the voices that are shaping the industry. A sales tactic that most companies have not yet tapped into.",
    deliverables: ["Tailored Content Creation", "Alignment with Business Strategy", "Industry Thought Leadership", "Content & Ghost-writing"],
    icon: React.createElement(Users, { size: 32 }),
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
    description: "The most trusted voices in your company aren't always in the C-suite — they're on your teams. Our Advocacy Program turns employees into empowered storytellers and brand ambassadors.",
    whatWeDo: [
      "Monthly workshops and hands-on training",
      "Shareable content kits and templates",
      "Scalable infrastructure that grows with your team",
      "Culture-first programming that boosts morale and visibility",
    ],
    closingNote: "We create internal champions who amplify your message and expand your reach — all through real human connection. The H2H advocacy program empowers your company message to be told in diverse, authentic voices.",
    deliverables: ["Monthly Workshops & Training", "Shareable Content Kits & Templates", "Scalable Infrastructure", "Culture-first Programming"],
    icon: React.createElement(Megaphone, { size: 32 }),
    stats: [
      { label: "Employee Reach", value: "10x" },
      { label: "Organic Amplification", value: "+560%" },
      { label: "Team Participation", value: "78%" },
    ],
  },
  {
    type: 'specialized',
    subtitle: "Specialized Service 01",
    title: "Website Design + SEO",
    description: "Your website is often your company's virtual home. We make sure it's the right one. We design and build high-converting, beautiful websites that align with your brand voice and serve as a true hub for your digital presence. And yes, they're built with SEO in mind from day one.",
    whatWeDo: [
      "Strategic Design & Copywriting",
      "Responsive Build (Mobile-first)",
      "SEO Fundamentals",
      "Blog & Content Hub Setup",
    ],
    closingNote: null,
    deliverables: ["Strategic Design & Copywriting", "Responsive Build (Mobile-first)", "SEO Fundamentals", "Blog & Content Hub Setup"],
    icon: React.createElement(Globe, { size: 32 }),
    image: "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800",
    stats: [
      { label: "Avg. Load Time", value: "<2s" },
      { label: "SEO Score", value: "95+" },
      { label: "Mobile Performance", value: "100%" },
    ],
  },
  {
    type: 'specialized',
    subtitle: "Specialized Service 02",
    title: "Paid Campaigns",
    description: "Great content deserves an audience. We create and manage paid campaigns that amplify your message and drive real business outcomes. From awareness to lead gen, we craft media strategies that meet your goals.",
    whatWeDo: [
      "Paid Strategy & Audience Targeting",
      "Ad Copy & Creative Production",
      "Optimization & A/B Testing",
      "Transparent Reporting",
    ],
    closingNote: null,
    deliverables: ["Paid Strategy & Audience Targeting", "Ad Copy & Creative Production", "Optimization & A/B Testing", "Transparent Reporting"],
    icon: React.createElement(Target, { size: 32 }),
    image: "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800",
    stats: [
      { label: "Avg. ROAS", value: "4.2x" },
      { label: "CTR Improvement", value: "+65%" },
      { label: "Cost per Lead", value: "-45%" },
    ],
  },
  {
    type: 'specialized',
    subtitle: "Specialized Service 03",
    title: "Content Writing",
    description: "When it comes to storytelling, words matter! Our team crafts clear, engaging, and on-brand content for every channel. Whether it's for social media, blog posts, email campaigns, or your website — we bring your voice to life in a way that connects.",
    whatWeDo: [
      "Social Captions & Campaigns",
      "Long-form Blog & Thought Leadership",
      "Executive Ghost-writing",
      "Email & Web Copy",
    ],
    closingNote: null,
    deliverables: ["Social Captions & Campaigns", "Long-form Blog & Thought Leadership", "Executive Ghost-writing", "Email & Web Copy"],
    icon: React.createElement(FileText, { size: 32 }),
    image: "https://images.pexels.com/photos/3059745/pexels-photo-3059745.jpeg?auto=compress&cs=tinysrgb&w=800",
    stats: [
      { label: "Content Pieces", value: "50+/mo" },
      { label: "Engagement Rate", value: "+120%" },
      { label: "Brand Voice Score", value: "98%" },
    ],
  },
];

export const PILLARS = SERVICES.filter(s => s.type === 'core');
export const SECONDARY_SERVICES = SERVICES.filter(s => s.type === 'specialized');

export interface Project {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  cover_image_path: string | null;
  gallery: string[];
  category: string;
  technologies: string[];
  github_url: string | null;
  demo_url: string | null;
  external_url: string | null;
  project_date: string | null;
  featured: boolean;
  display_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface HeroContent {
  title_line_1: string;
  title_line_2: string;
  subheading: string;
  cta_work: string;
  cta_contact: string;
  status_badge: string;
}

export interface PortraitContent {
  heading: string;
  caption: string;
  image_url: string;
  note: string;
}

export interface AboutContent {
  headline: string;
  paragraphs: string[];
  philosophy: string;
}

export interface FoleStage {
  step: string;
  title: string;
  desc: string;
}

export interface FoleContent {
  title: string;
  tagline: string;
  narrative_stages: FoleStage[];
}

export interface HardwarePanel {
  id: string;
  title: string;
  category: string;
  short_description: string;
  detailed_description?: string;
  technologies?: string[];
  image: string;
  gallery_images?: string[];
  external_url?: string;
  display_order: number;
  published: boolean;
}

export interface HardwareFocusArea {
  name: string;
  detail: string;
}

export interface HardwareContent {
  headline: string;
  subheading: string;
  panels?: HardwarePanel[];
  focus_areas?: HardwareFocusArea[];
}

export interface TeachingCard {
  id: string;
  title: string;
  category?: string;
  short_description: string;
  detailed_description?: string;
  image: string;
  gallery_images?: string[];
  learning_outcomes?: string[];
  resource_url?: string;
  display_order: number;
  published: boolean;
  tag?: string;
}

export interface TeachingPillar {
  title: string;
  detail: string;
}

export interface TeachingContent {
  headline: string;
  description: string;
  cards?: TeachingCard[];
  pillars?: TeachingPillar[];
}

export interface ContactContent {
  headline: string;
  subheading: string;
  email: string;
  note: string;
}

export interface FooterContent {
  tagline: string;
  credit: string;
  colophon: string;
}

export interface SiteContentMap {
  hero: HeroContent;
  portrait: PortraitContent;
  about: AboutContent;
  fole: FoleContent;
  hardware: HardwareContent;
  teaching: TeachingContent;
  contact: ContactContent;
  footer: FooterContent;
}

export type SectionKey = keyof SiteContentMap;

export interface Skill {
  id: string;
  name: string;
  category: string;
  display_order: number;
  created_at?: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  display_order: number;
  enabled: boolean;
  created_at?: string;
}

export interface AdminUser {
  id: string;
  user_id: string;
  created_at: string;
}


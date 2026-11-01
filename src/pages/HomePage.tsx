import React, { useEffect, useState } from 'react';
import { useSmoothScroll } from '@/animations/useSmoothScroll';
import { fetchAllSiteContent, fetchProjects, fetchSkills, fetchSocialLinks } from '@/lib/data/api';
import { SiteContentMap, Project, Skill, SocialLink } from '@/types';
import { INITIAL_SITE_CONTENT, INITIAL_PROJECTS, INITIAL_SKILLS, INITIAL_SOCIALS } from '@/lib/data/initialData';

import { Navbar } from '@/components/sections/Navbar';
import { HeroSection } from '@/components/sections/HeroSection';
import { PortraitReveal } from '@/animations/PortraitReveal';
import { AboutSection } from '@/components/sections/AboutSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { PinnedFoleStory } from '@/animations/PinnedFoleStory';
import { HorizontalProjectGallery } from '@/animations/HorizontalProjectGallery';
import { HardwareSection } from '@/components/sections/HardwareSection';
import { TeachingSection } from '@/components/sections/TeachingSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { FooterSection } from '@/components/sections/FooterSection';
import { BackToTop } from '@/animations/BackToTop';

export const HomePage: React.FC = () => {
  // Activate Lenis smooth scrolling for public portfolio
  useSmoothScroll(true);

  const [siteContent, setSiteContent] = useState<SiteContentMap>(INITIAL_SITE_CONTENT);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [skills, setSkills] = useState<Skill[]>(INITIAL_SKILLS);
  const [socials, setSocials] = useState<SocialLink[]>(INITIAL_SOCIALS);
  const [, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        const [contentData, projectsData, skillsData, socialsData] = await Promise.all([
          fetchAllSiteContent(),
          fetchProjects(false), // Published only
          fetchSkills(),
          fetchSocialLinks(true),
        ]);

        if (mounted) {
          if (contentData) setSiteContent(contentData);
          if (projectsData) setProjects(projectsData);
          if (skillsData) setSkills(skillsData);
          if (socialsData) setSocials(socialsData);
        }
      } catch (err) {
        console.warn('Error loading portfolio data:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#08090B] text-white flex flex-col selection:bg-white selection:text-[#08090B]">
      <Navbar />

      <main className="flex-1">
        {/* A. Main Hero */}
        <HeroSection content={siteContent.hero} />

        {/* B. Personal Portrait Sub-Hero */}
        <PortraitReveal content={siteContent.portrait} />

        {/* C. About Me (Warm Paper Editorial Section) */}
        <AboutSection content={siteContent.about} />

        {/* D. Skills and Technologies */}
        <SkillsSection skills={skills} />

        {/* E. FOLE — Free Open Learning & Education (Pinned Story) */}
        <PinnedFoleStory content={siteContent.fole} />

        {/* F. Projects Gallery (Horizontal Scroll) */}
        <HorizontalProjectGallery projects={projects} />

        {/* G. Hardware and Engineering */}
        <HardwareSection content={siteContent.hardware} />

        {/* H. Teaching and Community (Warm Paper Editorial Section) */}
        <TeachingSection content={siteContent.teaching} />

        {/* I. Contact Section */}
        <ContactSection content={siteContent.contact} socials={socials} />
      </main>

      {/* J. Footer */}
      <FooterSection content={siteContent.footer} socials={socials} />

      <BackToTop />
    </div>
  );
};

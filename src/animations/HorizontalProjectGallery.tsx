import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { gsap, prefersReducedMotion } from './gsapSetup';
import { Project } from '@/types';
import { ArrowUpRight, Github, ExternalLink, Filter, FolderGit2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { LiquidActionButton, LiquidActionLink } from '@/components/ui';
import TechText from '@/components/TechText';

interface HorizontalProjectGalleryProps {
  projects: Project[];
}

export const HorizontalProjectGallery: React.FC<HorizontalProjectGalleryProps> = ({ projects }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, [projects]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'All') return projects;
    return projects.filter((p) => p.category === selectedCategory);
  }, [projects, selectedCategory]);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const isDesktop = window.innerWidth >= 1024;
    const track = trackRef.current;
    const container = containerRef.current;
    if (!isDesktop || !track || !container || filteredProjects.length <= 1) return;

    const ctx = gsap.context(() => {
      const scrollWidth = track.scrollWidth;
      const clientWidth = track.clientWidth;
      const xDistance = scrollWidth - clientWidth + 120;

      if (xDistance > 0) {
        gsap.to(track, {
          x: -xDistance,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: () => `+=${xDistance * 1.2}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }
    }, container);

    return () => ctx.revert();
  }, [filteredProjects]);

  return (
    <section
      ref={containerRef}
      id="projects"
      className="relative bg-[#08090B] text-white border-t border-[#292D33] overflow-hidden"
    >
      <div className="w-full min-h-screen flex flex-col justify-between py-16 md:py-24 px-6 md:px-12 lg:px-16">
        
        {/* Top Header & Filtering */}
        <div className="max-w-7xl w-full mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#292D33]">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-[#D7DCE2] uppercase tracking-technical mb-2 font-medium">
              <FolderGit2 className="w-3.5 h-3.5 text-white" />
              <span>Project Archive</span>
            </div>
            <h2 className="relative w-full max-w-2xl">
              <span className="sr-only">Selected Engineering Builds</span>
              <div className="w-full h-14 sm:h-20">
                <TechText
                  text="Selected Engineering Builds"
                  fontSize={52}
                  fontWeight={700}
                  fontFamily='"Space Grotesk", sans-serif'
                  color="#FFFFFF"
                  accentColor="#D7DCE2"
                  align="left"
                  reach={130}
                  labels={false}
                  clickKick={true}
                  className="w-full h-full"
                />
              </div>
            </h2>
            <p className="font-sans text-[#9299A3] text-base mt-2 max-w-xl">
              Physical microcontrollers, firmware, and backend software developed to solve real challenges.
            </p>
          </div>

          {/* Category Filter Pills */}
          {categories.length > 1 && (
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-[#9299A3] mr-1" />
              {categories.map((cat) => (
                <LiquidActionButton
                  key={cat}
                  size="sm"
                  variant={selectedCategory === cat ? 'glass' : 'clear'}
                  intensity={selectedCategory === cat ? 5 : 3}
                  thickness={1}
                  onClick={() => setSelectedCategory(cat)}
                  className={`font-mono text-xs uppercase tracking-technical ${
                    selectedCategory === cat
                      ? 'text-white font-semibold'
                      : 'text-[#9299A3] hover:text-white'
                  }`}
                >
                  {cat}
                </LiquidActionButton>
              ))}
            </div>
          )}
        </div>

        {/* Gallery Content */}
        {filteredProjects.length === 0 ? (
          <div className="my-auto py-24 text-center max-w-md mx-auto">
            <p className="font-mono text-sm text-white uppercase tracking-technical mb-2">
              Archive Inactive
            </p>
            <p className="font-display text-2xl font-bold text-white mb-2">
              No Projects Found
            </p>
            <p className="font-sans text-sm text-[#9299A3]">
              No projects have been published in this category yet.
            </p>
          </div>
        ) : (
          /* Horizontal Gallery Track */
          <div className="w-full my-auto py-8">
            <div
              ref={trackRef}
              className="flex gap-8 items-stretch overflow-x-auto lg:overflow-visible pb-6 lg:pb-0 scrollbar-none"
            >
              {filteredProjects.map((project, index) => {
                const isWide = index % 3 === 0;

                return (
                  <div
                    key={project.id}
                    className={`shrink-0 flex flex-col justify-between rounded-sm border border-[#292D33] bg-[#12151A] p-6 md:p-8 transition-all duration-300 hover:border-[#D7DCE2] group relative ${
                      isWide
                        ? 'w-[85vw] sm:w-[480px] lg:w-[560px]'
                        : 'w-[85vw] sm:w-[380px] lg:w-[440px]'
                    }`}
                  >
                    {/* Top Meta info */}
                    <div>
                      <div className="flex items-center justify-between font-mono text-xs text-[#9299A3] mb-4">
                        <span className="text-[#D7DCE2]">0{index + 1} // {project.category}</span>
                        {project.project_date && <span>{formatDate(project.project_date)}</span>}
                      </div>

                      {/* Featured Badge */}
                      {project.featured && (
                        <div className="inline-block px-2.5 py-0.5 mb-3 bg-white/10 border border-white/30 text-white font-mono text-[10px] rounded uppercase tracking-technical">
                          Featured Build
                        </div>
                      )}

                      {/* Title */}
                      <Link to={`/project/${project.slug}`}>
                        <h3 className="font-display text-2xl sm:text-3xl font-bold text-white group-hover:text-[#D7DCE2] transition-colors flex items-start justify-between gap-2">
                          <span>{project.title}</span>
                          <ArrowUpRight className="w-6 h-6 shrink-0 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all text-white" />
                        </h3>
                      </Link>

                      {/* Short Description */}
                      <p className="font-sans text-[#9299A3] text-sm sm:text-base leading-relaxed mt-3 line-clamp-3">
                        {project.short_description}
                      </p>
                    </div>

                    {/* Bottom Technologies & Links */}
                    <div className="pt-6 mt-6 border-t border-[#292D33] space-y-4">
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {project.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-0.5 rounded bg-[#171B22] border border-[#292D33]/60 text-[#D7DCE2] font-mono text-[11px]"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        <LiquidActionLink
                          to={`/project/${project.slug}`}
                          size="sm"
                          variant="clear"
                          intensity={4}
                          thickness={1}
                          className="font-mono text-xs text-white hover:text-[#D7DCE2] font-medium"
                        >
                          <span className="flex items-center gap-1.5">
                            <span>Explore Project</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </span>
                        </LiquidActionLink>

                        <div className="flex items-center gap-2">
                          {project.github_url && (
                            <LiquidActionLink
                              href={project.github_url}
                              target="_blank"
                              rel="noreferrer"
                              size="sm"
                              variant="clear"
                              intensity={4}
                              thickness={1}
                              icon={<Github className="w-3.5 h-3.5 text-[#D7DCE2]" />}
                              aria-label={`GitHub repo for ${project.title}`}
                            />
                          )}
                          {project.demo_url && (
                            <LiquidActionLink
                              href={project.demo_url}
                              target="_blank"
                              rel="noreferrer"
                              size="sm"
                              variant="clear"
                              intensity={4}
                              thickness={1}
                              icon={<ExternalLink className="w-3.5 h-3.5 text-white" />}
                              aria-label={`Live demo for ${project.title}`}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom hint for horizontal scroll */}
        <div className="hidden lg:flex items-center justify-between font-mono text-xs text-[#9299A3] pt-4 border-t border-[#292D33]">
          <span>CURATED ENGINEERING JOURNAL</span>
          <span className="text-white">Scroll down to slide horizontally →</span>
        </div>

      </div>
    </section>
  );
};

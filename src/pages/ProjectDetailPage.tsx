import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProjectBySlug } from '@/lib/data/api';
import { Project } from '@/types';
import { Navbar } from '@/components/sections/Navbar';
import { FooterSection } from '@/components/sections/FooterSection';
import { INITIAL_SITE_CONTENT, INITIAL_SOCIALS } from '@/lib/data/initialData';
import { formatDate } from '@/lib/utils';
import { LiquidActionLink } from '@/components/ui';
import {
  ArrowLeft,
  Github,
  ExternalLink,
  Calendar,
  Cpu,
  FolderGit2
} from 'lucide-react';

export const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    async function loadProject() {
      if (!slug) return;
      setIsLoading(true);
      try {
        const data = await fetchProjectBySlug(slug);
        setProject(data);
      } catch (err) {
        console.warn('Failed to load project:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadProject();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#08090B] text-white flex items-center justify-center font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span>QUERYING ARCHIVE BY SLUG...</span>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#08090B] text-white flex flex-col justify-between">
        <Navbar />
        <div className="max-w-xl mx-auto my-auto px-6 py-24 text-center space-y-6">
          <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center mx-auto text-white">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white">
            Project Record Not Found
          </h1>
          <p className="font-sans text-[#9299A3] text-sm leading-relaxed">
            The requested project identifier does not match any published entry in the engineering archive.
          </p>
          <Link
            to="/#projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-sm bg-white text-[#08090B] font-mono text-xs tracking-technical uppercase hover:bg-[#D7DCE2] transition-all font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Project Gallery</span>
          </Link>
        </div>
        <FooterSection content={INITIAL_SITE_CONTENT.footer} socials={INITIAL_SOCIALS} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08090B] text-white flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 px-6 md:px-12 lg:px-20 max-w-5xl mx-auto w-full">
        {/* Navigation Breadcrumb */}
        <div className="mb-10">
          <LiquidActionLink
            to="/#projects"
            variant="clear"
            size="sm"
            intensity={4}
            thickness={1}
            icon={<ArrowLeft className="w-3.5 h-3.5" />}
            className="font-mono text-xs text-[#D7DCE2] hover:text-white uppercase tracking-technical"
          >
            Back to Projects Archive
          </LiquidActionLink>
        </div>

        {/* Project Header */}
        <header className="space-y-6 pb-12 border-b border-[#292D33]">
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#9299A3]">
            <span className="px-2.5 py-1 rounded bg-[#12151A] border border-[#292D33] text-[#D7DCE2]">
              {project.category}
            </span>
            {project.project_date && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-white" />
                <span>{formatDate(project.project_date)}</span>
              </span>
            )}
            {project.featured && (
              <span className="text-white uppercase tracking-technical">
                • Featured Entry
              </span>
            )}
          </div>

          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            {project.title}
          </h1>

          <p className="font-sans text-lg sm:text-xl text-[#9299A3] font-light leading-relaxed max-w-3xl">
            {project.short_description}
          </p>

          {/* Action Links with Liquid Glass */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            {project.demo_url && (
              <LiquidActionLink
                href={project.demo_url}
                target="_blank"
                rel="noreferrer"
                variant="glass"
                size="lg"
                intensity={5}
                thickness={2}
                shimmer
                icon={<ExternalLink className="w-4 h-4" />}
                className="font-mono text-xs font-semibold uppercase tracking-technical text-white shadow-2xl"
              >
                Live Demonstration
              </LiquidActionLink>
            )}
            {project.github_url && (
              <LiquidActionLink
                href={project.github_url}
                target="_blank"
                rel="noreferrer"
                variant="clear"
                size="lg"
                intensity={4}
                thickness={1}
                icon={<Github className="w-4 h-4 text-[#D7DCE2]" />}
                className="font-mono text-xs uppercase tracking-technical text-[#D7DCE2] hover:text-white"
              >
                Source Repository
              </LiquidActionLink>
            )}
            {project.external_url && (
              <LiquidActionLink
                href={project.external_url}
                target="_blank"
                rel="noreferrer"
                variant="clear"
                size="lg"
                intensity={4}
                thickness={1}
                icon={<ExternalLink className="w-4 h-4 text-[#D7DCE2]" />}
                className="font-mono text-xs uppercase tracking-technical text-[#D7DCE2] hover:text-white"
              >
                Technical Documentation
              </LiquidActionLink>
            )}
          </div>
        </header>

        {/* Project Cover / Technical Blueprint Visual */}
        <section className="my-12">
          {project.cover_image_path ? (
            <div className="aspect-[16/9] w-full rounded-sm overflow-hidden border border-[#292D33] bg-[#12151A] shadow-2xl">
              <img
                src={project.cover_image_path}
                alt={project.title}
                className="w-full h-full object-cover object-center"
              />
            </div>
          ) : (
            <div className="aspect-[21/9] w-full rounded-sm border border-[#292D33] bg-[#12151A] flex flex-col items-center justify-center p-8 relative overflow-hidden">
              <div className="font-mono text-xs text-[#D7DCE2] uppercase tracking-technical mb-2 font-medium">
                PROJECT SCHEMATIC & FIRMWARE ARCHIVE
              </div>
              <div className="flex items-center gap-3 font-mono text-xs text-[#9299A3]">
                <Cpu className="w-4 h-4 text-white" />
                <span>SLUG: {project.slug}</span>
                <span>•</span>
                <span>STATUS: DOCUMENTED</span>
              </div>
            </div>
          )}
        </section>

        {/* Detailed Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-6">
          {/* Main Description Column (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-4">
              <span className="font-mono text-xs uppercase tracking-technical text-[#D7DCE2] block font-medium">
                Technical Architecture & Implementation
              </span>
              <div className="prose prose-invert max-w-none font-sans text-base sm:text-lg text-white/90 leading-editorial space-y-4">
                {project.full_description.split('\n\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Gallery Images if present */}
            {project.gallery && project.gallery.length > 0 && (
              <div className="pt-8 border-t border-[#292D33] space-y-4">
                <span className="font-mono text-xs uppercase tracking-technical text-[#D7DCE2] block font-medium">
                  Project Gallery & Visuals
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.gallery.map((imgUrl, i) => (
                    <div
                      key={i}
                      className="aspect-video rounded-sm overflow-hidden border border-[#292D33] bg-[#12151A]"
                    >
                      <img
                        src={imgUrl}
                        alt={`${project.title} gallery ${i + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Technical Specifications Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-sm bg-[#12151A] border border-[#292D33] space-y-6">
              <div>
                <span className="font-mono text-xs text-[#D7DCE2] uppercase tracking-technical block mb-3 font-medium">
                  Technologies Applied
                </span>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded bg-[#171B22] border border-[#292D33]/60 font-mono text-xs text-[#D7DCE2]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#292D33] space-y-3 font-mono text-xs text-[#9299A3]">
                <div>
                  <span className="text-white block font-semibold">ENGINEERING DISCIPLINE</span>
                  <span>{project.category}</span>
                </div>
                <div>
                  <span className="text-white block font-semibold">INSTITUTION</span>
                  <span>College of Engineering Vadakara</span>
                </div>
                <div>
                  <span className="text-white block font-semibold">CONTRIBUTOR</span>
                  <span>Adithya S. Kanholi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FooterSection content={INITIAL_SITE_CONTENT.footer} socials={INITIAL_SOCIALS} />
    </div>
  );
};

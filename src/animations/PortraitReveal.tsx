import React, { useEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from './gsapSetup';
import { PortraitContent } from '@/types';
import { Camera, Sparkles } from 'lucide-react';
import MeshLettering from '@/components/ui/mesh-lettering';

interface PortraitRevealProps {
  content: PortraitContent;
}

export const PortraitReveal: React.FC<PortraitRevealProps> = ({ content }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);
  const textColRef = useRef<HTMLDivElement>(null);

  // Fallback to bundled portrait photograph if content.image_url is unset or empty
  const defaultPortrait = '/portrait.jpg';
  const rawUrl = content?.image_url?.trim();
  const initialUrl = rawUrl ? rawUrl : defaultPortrait;

  const [imageSrc, setImageSrc] = useState<string>(initialUrl);
  const [imageFailed, setImageFailed] = useState<boolean>(false);

  useEffect(() => {
    const nextUrl = content?.image_url?.trim() ? content.image_url.trim() : defaultPortrait;
    setImageSrc(nextUrl);
    setImageFailed(false);
  }, [content?.image_url]);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // Subtle editorial scale & parallax scrub on scroll
      gsap.fromTo(
        imageInnerRef.current,
        { scale: 1.08, y: -16 },
        {
          scale: 1,
          y: 16,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        }
      );

      // Smooth entrance reveal for the portrait frame container
      gsap.fromTo(
        imageWrapperRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );

      // Text reveal
      gsap.fromTo(
        textColRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [content]);

  return (
    <section
      ref={sectionRef}
      id="portrait"
      className="relative w-full py-24 md:py-36 bg-[#08090B] text-white border-t border-[#292D33] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Portrait Composition Column (7 cols) */}
          <div className="lg:col-span-7">
            <div className="relative w-full max-w-lg mx-auto lg:mx-0">
              {/* Editorial Frame with architectural crosshairs */}
              <div
                ref={imageWrapperRef}
                className="relative aspect-[3/4] sm:aspect-[4/5] lg:aspect-[3/4] w-full overflow-hidden rounded-sm border border-[#292D33] bg-[#12151A] shadow-2xl"
              >
                <div
                  ref={imageInnerRef}
                  className="w-full h-full relative"
                >
                  {!imageFailed ? (
                    <img
                      src={imageSrc}
                      alt="Adithya S. Kanholi - Personal Archive Portrait"
                      width={576}
                      height={1024}
                      loading="eager"
                      decoding="async"
                      onError={() => {
                        if (imageSrc !== defaultPortrait) {
                          setImageSrc(defaultPortrait);
                        } else {
                          setImageFailed(true);
                        }
                      }}
                      className="w-full h-full object-cover object-[center_35%] filter contrast-[1.03] brightness-[0.98] hover:contrast-100 hover:brightness-100 transition-all duration-700"
                    />
                  ) : (
                    /* Deliberate Editorial Fallback */
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#12151A] text-[#9299A3] relative">
                      <div className="absolute inset-x-8 top-8 flex justify-between font-mono text-[10px] text-[#9299A3]/50">
                        <span>PLATE NO. 01 — PERSONAL ARCHIVE</span>
                        <span>11.6053° N, 75.5908° E</span>
                      </div>

                      <div className="w-20 h-20 rounded-full border border-white/30 flex items-center justify-center mb-6 bg-[#08090B]">
                        <Camera className="w-8 h-8 text-white" />
                      </div>

                      <p className="font-display text-xl md:text-2xl font-semibold text-white text-center mb-2">
                        Adithya S. Kanholi
                      </p>
                      <p className="font-mono text-xs uppercase tracking-technical text-[#D7DCE2] mb-4">
                        Visual Archive
                      </p>
                      <p className="font-sans text-xs text-[#9299A3] max-w-xs text-center leading-relaxed">
                        College of Engineering Vadakara • Electrical & Electronics
                      </p>

                      <div className="absolute inset-x-8 bottom-8 flex justify-between font-mono text-[10px] text-[#9299A3]/50">
                        <span>CEV • EEE</span>
                        <span>ASPECT RATIO 3:4</span>
                      </div>
                    </div>
                  )}

                  {/* Subtle vignette overlay on image */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#08090B]/60 via-transparent to-black/10" />
                </div>

                {/* Minimal architectural corner registration brackets */}
                <div className="pointer-events-none absolute top-3 left-3 w-4 h-4 border-t border-l border-white/60" />
                <div className="pointer-events-none absolute top-3 right-3 w-4 h-4 border-t border-r border-white/60" />
                <div className="pointer-events-none absolute bottom-3 left-3 w-4 h-4 border-b border-l border-white/60" />
                <div className="pointer-events-none absolute bottom-3 right-3 w-4 h-4 border-b border-r border-white/60" />
              </div>

              {/* Archival metadata caption strip below frame */}
              <div className="mt-3.5 px-1 flex items-center justify-between font-mono text-[11px] tracking-wider text-[#9299A3]/70 uppercase">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/90 inline-block animate-pulse" />
                  <span>Archival Plate 01 — Field Record</span>
                </span>
                <span className="text-[#9299A3]/50 hidden sm:inline">11.6053° N, 75.5908° E</span>
              </div>
            </div>
          </div>

          {/* Editorial Text Column (5 cols) */}
          <div ref={textColRef} className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#12151A] border border-[#292D33] font-mono text-xs text-[#D7DCE2]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personal Archive</span>
            </div>

            <h2 className="relative w-full max-w-xl">
              <span className="sr-only">Hey, I am Adithya</span>
              <div className="w-full h-36 sm:h-44 lg:h-48 relative -ml-1">
                <MeshLettering
                  text="Hey, I am Adithya"
                  fontFamily='"Space Grotesk", sans-serif'
                  fontWeight={800}
                  fontSize={76}
                  lineHeight={1.05}
                  letterSpacing={-0.02}
                  align="left"
                  colors={['#C87A54', '#F5F2EB']}
                  sheen={1.2}
                  gloss={0.65}
                  iridescence={0.45}
                  wind={0.75}
                  windAngle={12}
                  turbulence={0.35}
                  flow={0.9}
                  softness={0.65}
                  drag={0.5}
                  hold={0.5}
                  lightAngle={-35}
                  interactive={true}
                  gustStrength={1.2}
                  gustRadius={1.3}
                  clickGust={true}
                  intro={true}
                  introDuration={1.8}
                  className="w-full h-full min-h-[140px] sm:min-h-[160px]"
                />
              </div>
            </h2>

            <p className="font-sans text-xl md:text-2xl text-[#D7DCE2] font-light leading-relaxed">
              {content?.caption || "An engineering student, developer, and lifelong learner."}
            </p>

            <div className="w-12 h-0.5 bg-white/40 my-4" />

            <p className="font-sans text-base text-[#9299A3] leading-relaxed">
              {content?.note || "B.Tech in Electrical and Electronics Engineering at College of Engineering Vadakara (CEV). Focused on where software systems meet tangible hardware."}
            </p>

            <div className="pt-4 flex items-center gap-6 font-mono text-xs text-[#9299A3]">
              <div>
                <span className="text-white block font-semibold text-sm">College</span>
                <span>CE Vadakara</span>
              </div>
              <div className="w-px h-8 bg-[#292D33]" />
              <div>
                <span className="text-white block font-semibold text-sm">Discipline</span>
                <span>Electrical & Electronics</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

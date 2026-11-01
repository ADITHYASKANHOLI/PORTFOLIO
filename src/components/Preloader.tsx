import React, { useState, useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface PreloaderProps {
  /** Whether the preloader is active */
  loading?: boolean;
  /** Visual variant of the preloader animation */
  variant?: 'stairs' | 'percentage' | 'circle' | 'slide' | 'curtain';
  /** Position type of the preloader container */
  position?: 'fixed' | 'absolute';
  /** Duration of the loading animation in milliseconds */
  duration?: number;
  /** Loading text to display (for stairs and circle variants) */
  loadingText?: string;
  /** Z-index for the preloader */
  zIndex?: number;
  /** Background color (overrides default) */
  bgColor?: string;
  /** CSS classes for the loading text */
  textClassName?: string;
  /** Position of percentage counter (percentage variant only) */
  percentagePosition?: 'center' | 'bottom-left' | 'top-left';
  /** Show percentage sign (percentage variant only) */
  showPercentageSign?: boolean;
  /** CSS classes for percentage text (percentage variant only) */
  percentageTextClassName?: string;
  /** Show progress bar (percentage variant only) */
  showProgressBar?: boolean;
  /** Progress bar position (percentage variant only) */
  progressBarPosition?: 'top' | 'bottom';
  /** Number of stairs (stairs variant only) */
  stairCount?: number;
  /** Direction stairs reveal from (stairs variant only) */
  stairsRevealFrom?: 'left' | 'right' | 'center';
  /** Direction stairs move when revealing (stairs variant only) */
  stairsRevealDirection?: 'up' | 'down';
  /** Callback function when loading completes */
  onComplete?: () => void;
  /** Callback function when loading starts */
  onLoadingStart?: () => void;
  /** Callback function when exit animation completes */
  onLoadingComplete?: () => void;
  /** Respect prefers-reduced-motion system setting */
  respectReducedMotion?: boolean;
  /** Fallback behavior when reduced motion is preferred (fade or instant) */
  reducedMotionFallback?: 'fade' | 'none';
  /** ARIA label for screen readers */
  ariaLabel?: string;
  /** ARIA live region politeness level */
  ariaLive?: 'polite' | 'assertive' | 'off';
  /** Progress threshold (0-100) when loading text starts fading out */
  textFadeThreshold?: number;
  /** Backdrop blur amount in pixels */
  backdropBlur?: number;
  /** Custom content render function that receives current progress (0-100) */
  customContent?: (progress: number) => React.ReactNode;
  /** Additional CSS classes for styling */
  className?: string;
  /** Content to show after loading completes */
  children?: React.ReactNode;
}

/**
 * React Bits Preloader Component (Tailwind CSS variant)
 * Supports 5 animation styles: 'stairs', 'percentage', 'circle', 'slide', 'curtain'.
 * Designed for initial page load transitions with zero layout shift.
 */
export const Preloader: React.FC<PreloaderProps> = ({
  loading = false,
  variant = 'stairs',
  position = 'fixed',
  duration = 1800,
  loadingText = 'Adithya S. Kanholi',
  zIndex = 9999,
  bgColor = '#08090B',
  textClassName = '',
  percentagePosition = 'center',
  showPercentageSign = true,
  percentageTextClassName = '',
  showProgressBar = true,
  progressBarPosition = 'bottom',
  stairCount = 8,
  stairsRevealFrom = 'left',
  stairsRevealDirection = 'up',
  onComplete,
  onLoadingStart,
  onLoadingComplete,
  respectReducedMotion = true,
  reducedMotionFallback = 'fade',
  ariaLabel = 'Loading portfolio experience',
  ariaLive = 'polite',
  textFadeThreshold = 85,
  backdropBlur = 0,
  customContent,
  className = '',
  children,
}) => {
  const [progress, setProgress] = useState(0);
  const [prefersReduced, setPrefersReduced] = useState(false);
  const instanceId = useId();

  // Check system prefers-reduced-motion
  useEffect(() => {
    if (respectReducedMotion && typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReduced(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }
  }, [respectReducedMotion]);

  // Loading progress & callbacks
  useEffect(() => {
    if (loading) {
      onLoadingStart?.();
      const startTime = performance.now();
      const interval = 16; // ~60fps updates

      const timer = setInterval(() => {
        const elapsed = performance.now() - startTime;
        const currentProgress = Math.min(100, (elapsed / duration) * 100);
        setProgress(currentProgress);

        if (currentProgress >= 100) {
          clearInterval(timer);
          onComplete?.();
        }
      }, interval);

      return () => clearInterval(timer);
    } else {
      setProgress(100);
    }
  }, [loading, duration, onComplete, onLoadingStart]);

  // Calculate stair delay based on reveal direction
  const getStairDelay = (index: number, total: number) => {
    const stepDuration = 0.045;
    if (stairsRevealFrom === 'right') {
      return (total - 1 - index) * stepDuration;
    }
    if (stairsRevealFrom === 'center') {
      const center = (total - 1) / 2;
      return Math.abs(index - center) * stepDuration;
    }
    return index * stepDuration; // 'left' default
  };

  const isReducedActive = respectReducedMotion && prefersReduced;

  // Split loading text into words for staggered typographic reveal
  const words = loadingText.split(' ');

  return (
    <>
      <AnimatePresence onExitComplete={onLoadingComplete}>
        {loading && (
          <motion.div
            key={`preloader-${instanceId}`}
            role="status"
            aria-label={ariaLabel}
            aria-live={ariaLive}
            initial={isReducedActive && reducedMotionFallback === 'fade' ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            exit={
              isReducedActive
                ? reducedMotionFallback === 'none'
                  ? { opacity: 0, transition: { duration: 0 } }
                  : { opacity: 0, transition: { duration: 0.3 } }
                : variant === 'percentage'
                ? { opacity: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }
                : undefined
            }
            style={{
              zIndex,
              backdropFilter: backdropBlur > 0 ? `blur(${backdropBlur}px)` : undefined,
              WebkitBackdropFilter: backdropBlur > 0 ? `blur(${backdropBlur}px)` : undefined,
            }}
            className={`${position} inset-0 overflow-hidden pointer-events-auto select-none ${className}`}
          >
            {/* Custom Content Render Hook */}
            {customContent ? (
              <div className="absolute inset-0 z-20 flex items-center justify-center">
                {customContent(progress)}
              </div>
            ) : null}

            {/* 1. STAIRS VARIANT */}
            {variant === 'stairs' && !isReducedActive && (
              <>
                <div className="absolute inset-0 flex h-full w-full pointer-events-none">
                  {Array.from({ length: stairCount }).map((_, index) => {
                    const delay = getStairDelay(index, stairCount);
                    const exitY = stairsRevealDirection === 'down' ? '100%' : '-100%';

                    return (
                      <motion.div
                        key={`stair-${index}`}
                        className="flex-1 h-full"
                        style={{ backgroundColor: bgColor }}
                        initial={{ y: '0%' }}
                        exit={{
                          y: exitY,
                          transition: {
                            duration: 0.65,
                            ease: [0.76, 0, 0.24, 1],
                            delay,
                          },
                        }}
                      />
                    );
                  })}
                </div>

                {/* Typographic Center Loading Text */}
                <motion.div
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none px-6"
                  initial={{ opacity: 1 }}
                  animate={{
                    opacity: progress >= textFadeThreshold ? 0 : 1,
                    scale: progress >= textFadeThreshold ? 0.96 : 1,
                    filter: progress >= textFadeThreshold ? 'blur(8px)' : 'blur(0px)',
                  }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                >
                  <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-center">
                    {words.map((word, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.45,
                          delay: 0.1 + i * 0.08,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className={`font-display text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white ${textClassName}`}
                      >
                        {word}
                      </motion.span>
                    ))}
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="mt-4 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-[#9299A3]"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D7DCE2] animate-pulse" />
                    <span>INITIALIZING SYSTEMS</span>
                  </motion.div>
                </motion.div>
              </>
            )}

            {/* 2. PERCENTAGE VARIANT */}
            {variant === 'percentage' && !isReducedActive && (
              <div
                className="absolute inset-0 flex flex-col justify-between"
                style={{ backgroundColor: bgColor }}
              >
                {/* Top Progress Bar */}
                {showProgressBar && progressBarPosition === 'top' && (
                  <div className="w-full h-1 bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full bg-white"
                      style={{ width: `${progress}%` }}
                      transition={{ ease: 'linear' }}
                    />
                  </div>
                )}

                {/* Positioned Percentage Display */}
                <div
                  className={`w-full h-full flex ${
                    percentagePosition === 'bottom-left'
                      ? 'items-end justify-start p-8 md:p-14'
                      : percentagePosition === 'top-left'
                      ? 'items-start justify-start p-8 md:p-14'
                      : 'items-center justify-center p-6'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <span
                      className={`font-mono text-5xl sm:text-7xl md:text-8xl font-bold tracking-tighter text-white tabular-nums ${percentageTextClassName}`}
                    >
                      {Math.round(progress)}
                      {showPercentageSign && (
                        <span className="text-2xl sm:text-4xl text-[#9299A3] ml-1">%</span>
                      )}
                    </span>
                    {loadingText && (
                      <span className="mt-3 font-mono text-xs uppercase tracking-widest text-[#9299A3]">
                        {loadingText}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Progress Bar */}
                {showProgressBar && progressBarPosition === 'bottom' && (
                  <div className="w-full h-1 bg-white/10 overflow-hidden">
                    <motion.div
                      className="h-full bg-white"
                      style={{ width: `${progress}%` }}
                      transition={{ ease: 'linear' }}
                    />
                  </div>
                )}
              </div>
            )}

            {/* 3. CURTAIN VARIANT */}
            {variant === 'curtain' && !isReducedActive && (
              <div className="absolute inset-0 flex flex-col pointer-events-none">
                <motion.div
                  className="w-full flex-1"
                  style={{ backgroundColor: bgColor }}
                  initial={{ y: '0%' }}
                  exit={{
                    y: '-100%',
                    transition: { duration: 0.65, ease: [0.76, 0, 0.24, 1] },
                  }}
                />
                <motion.div
                  className="w-full flex-1"
                  style={{ backgroundColor: bgColor }}
                  initial={{ y: '0%' }}
                  exit={{
                    y: '100%',
                    transition: { duration: 0.65, ease: [0.76, 0, 0.24, 1] },
                  }}
                />

                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  exit={{ opacity: 0, transition: { duration: 0.3 } }}
                >
                  <span className="font-display text-2xl md:text-3xl font-bold text-white tracking-tight">
                    {loadingText}
                  </span>
                </motion.div>
              </div>
            )}

            {/* 4. SLIDE VARIANT */}
            {variant === 'slide' && !isReducedActive && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                style={{ backgroundColor: bgColor }}
                initial={{ y: '0%' }}
                exit={{
                  y: '-100%',
                  transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] },
                }}
              >
                <span className="font-display text-2xl md:text-3xl font-bold text-white tracking-tight">
                  {loadingText}
                </span>
              </motion.div>
            )}

            {/* 5. CIRCLE VARIANT */}
            {variant === 'circle' && !isReducedActive && (
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={{ backgroundColor: bgColor }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.45 } }}
              >
                <div className="relative w-24 h-24 mb-6">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="transparent"
                      className="text-white/10"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="transparent"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * progress) / 100}
                      className="text-white"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-mono text-xs font-semibold text-white">
                    {Math.round(progress)}%
                  </div>
                </div>
                <span className="font-display text-lg font-medium text-white tracking-tight">
                  {loadingText}
                </span>
              </motion.div>
            )}

            {/* REDUCED MOTION FALLBACK */}
            {isReducedActive && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={{ backgroundColor: bgColor }}
              >
                <span className="font-display text-2xl font-bold text-white tracking-tight">
                  {loadingText}
                </span>
                <span className="mt-2 font-mono text-xs text-[#9299A3]">
                  {Math.round(progress)}%
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Render children underneath */}
      {children}
    </>
  );
};


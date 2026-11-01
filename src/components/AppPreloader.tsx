import React, { useState, useEffect } from 'react';
import { Preloader } from './Preloader';

// In-memory session tracking: resets on full page reload, persists across client-side route navigation
let hasInitialPageLoaded = false;

interface AppPreloaderProps {
  children: React.ReactNode;
}

export const AppPreloader: React.FC<AppPreloaderProps> = ({ children }) => {
  // If already loaded in this page lifecycle, don't show preloader again
  const [isLoading, setIsLoading] = useState<boolean>(() => !hasInitialPageLoaded);

  useEffect(() => {
    if (hasInitialPageLoaded) {
      return;
    }

    let isMounted = true;
    const startTime = performance.now();

    // Check true asset & layout readiness
    const checkReadiness = async () => {
      // 1. Wait for document.readyState === 'complete'
      if (document.readyState !== 'complete') {
        await new Promise((resolve) => {
          window.addEventListener('load', resolve, { once: true });
        });
      }

      // 2. Wait for document.fonts.ready to prevent layout shift & FOUT
      if (document.fonts && document.fonts.ready) {
        try {
          await document.fonts.ready;
        } catch {
          // Ignore font loading errors if any
        }
      }

      // 3. Double requestAnimationFrame to ensure the browser has painted the initial DOM underneath
      await new Promise((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(resolve);
        });
      });

      // 4. Ensure a smooth, polished minimum interaction duration (1000ms)
      // so the animation is perceptible, without any artificial long stall
      const elapsed = performance.now() - startTime;
      const minDuration = 1000;
      if (elapsed < minDuration) {
        await new Promise((resolve) => setTimeout(resolve, minDuration - elapsed));
      }

      if (isMounted) {
        setIsLoading(false);
      }
    };

    checkReadiness();

    // Safety fallback timeout: never block the user for more than 2.5s even if an asset hangs
    const safetyTimeout = setTimeout(() => {
      if (isMounted) {
        setIsLoading(false);
      }
    }, 2500);

    return () => {
      isMounted = false;
      clearTimeout(safetyTimeout);
    };
  }, []);

  const handleLoadingComplete = () => {
    hasInitialPageLoaded = true;
  };

  return (
    <>
      <Preloader
        loading={isLoading}
        variant="stairs"
        position="fixed"
        duration={1200}
        loadingText="Adithya S. Kanholi"
        stairCount={8}
        stairsRevealFrom="left"
        stairsRevealDirection="up"
        bgColor="#08090B"
        zIndex={99999}
        onLoadingComplete={handleLoadingComplete}
      />
      {children}
    </>
  );
};


"use client";

import React, { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Respect reduced motion preference
    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 0.85,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.1,
    });

    lenisRef.current = lenis;

    // Connect Lenis scroll events to GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(500, 33);

    // Expose lenis instance globally for modal locking
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    const settleTimer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(settleTimer);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return <>{children}</>;
}

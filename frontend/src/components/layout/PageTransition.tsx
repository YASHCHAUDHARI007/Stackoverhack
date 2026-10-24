"use client";

import React, { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isFirstRender = useRef(true);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip on initial load to keep first paint instantaneous
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const resetScroll = () => {
      const lenis = (window as unknown as { __lenis?: { scrollTo: (target: number, options: { immediate: boolean }) => void } }).__lenis;
      if (lenis) lenis.scrollTo(0, { immediate: true });
      else window.scrollTo(0, 0);
    };

    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !overlayRef.current
    ) {
      resetScroll();
      return;
    }

    const sheet = overlayRef.current;
    gsap.registerPlugin(ScrollTrigger);

    const timeline = gsap.timeline({
      onComplete: () => {
        ScrollTrigger.refresh();
      },
    });

    timeline
      .set(sheet, {
        display: "flex",
        pointerEvents: "auto",
        clipPath: "inset(0 0 100% 0)",
      })
      .to(sheet, {
        clipPath: "inset(0 0 0% 0)",
        duration: 0.32,
        ease: "power3.inOut",
      })
      .add(resetScroll)
      .to(sheet, {
        clipPath: "inset(100% 0 0 0)",
        duration: 0.38,
        ease: "power3.inOut",
        delay: 0.05,
      })
      .set(sheet, {
        display: "none",
        pointerEvents: "none",
      });

    return () => {
      timeline.kill();
      gsap.set(sheet, { display: "none", pointerEvents: "none" });
    };
  }, [pathname]);

  return (
    <>
      {/* Restrained Cyber Shutter Wipe */}
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="fixed inset-0 z-[100] hidden items-center justify-center bg-[#050811]/95 backdrop-blur-xl border-y border-cyan-400/30"
      >
        <div className="flex flex-col items-center space-y-3 font-mono">
          <div className="relative w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.4)]">
            <svg
              className="w-5 h-5 text-cyan-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M4 4l6 16 4-10 6 10" />
            </svg>
          </div>
          <span className="text-[11px] tracking-widest text-cyan-300 uppercase">
            SYNCHRONIZING TELEMETRY
          </span>
        </div>
      </div>
      {children}
    </>
  );
}

"use client";

import React from "react";

export function BackgroundAtmosphere() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* 1. Monochromatic Deep Charcoal Base (#0B0C0D) */}
      <div className="absolute inset-0 bg-[#0B0C0D]" />

      {/* 2. Natural Background SVG Artwork from /public/background.svg */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-90 pointer-events-none"
        style={{
          backgroundImage: "url('/background.svg')",
          backgroundPosition: "center top",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
        }}
      />

      {/* 3. Restrained Neutral Charcoal Gradient Overlay for High UI Readability */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(11, 12, 13, 0.42) 0%, rgba(11, 12, 13, 0.65) 50%, rgba(11, 12, 13, 0.88) 85%, #0B0C0D 100%)",
        }}
      />

      {/* 4. Soft Top Vignette for Floating Navigation Contrast */}
      <div
        className="absolute top-0 left-0 right-0 h-40 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(11, 12, 13, 0.55) 0%, transparent 100%)",
        }}
      />
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BackgroundAtmosphere } from "@/components/layout/BackgroundAtmosphere";
import { FloatingNavbar } from "@/components/layout/FloatingNavbar";
import { NavigationRail } from "@/components/layout/NavigationRail";
import { TelemetryRail } from "@/components/layout/TelemetryRail";
import { NewInvestigationModal } from "@/components/investigation/NewInvestigationModal";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { PageTransition } from "@/components/layout/PageTransition";

interface AppShellProps {
  children: React.ReactNode;
  selectedRepo?: string;
  onRepoChange?: (repo: string) => void;
}

export function AppShell({
  children,
  selectedRepo = "ALL",
  onRepoChange,
}: AppShellProps) {
  const [isNewInvOpen, setIsNewInvOpen] = useState(false);

  return (
    <SmoothScroll>
      <PageTransition>
        <div className="relative min-h-screen flex flex-col bg-[#0B0C0D] text-[#F0EEE8] selection:bg-[#222424] selection:text-[#F0EEE8]">
          {/* Accessible Skip Link (WCAG 2.4.1) */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#F0EEE8] focus:text-[#0B0C0D] focus:rounded-md focus:outline-none focus:ring-2 focus:ring-[#F0EEE8] font-mono text-xs shadow-lg"
          >
            Skip to main content
          </a>

          {/* 1. Neutral Background Atmosphere */}
          <BackgroundAtmosphere />

          {/* 2. Floating Smoked-Glass Navigation Navbar */}
          <FloatingNavbar
            onNewInvestigation={() => setIsNewInvOpen(true)}
            selectedRepo={selectedRepo}
            onRepoChange={onRepoChange}
          />

          {/* 3. Left Slim Vertical Navigation Rail */}
          <NavigationRail
            onNewInvestigation={() => setIsNewInvOpen(true)}
          />

          {/* 4. Right Telemetry Dock */}
          <TelemetryRail />

          {/* 5. Main Application Content Stream */}
          <div className="relative z-10 flex-1 flex flex-col min-w-0 w-full pt-26 sm:pt-28 pb-16">
            <main
              id="main-content"
              tabIndex={-1}
              className="flex-1 w-full max-w-7xl mx-auto px-5 sm:px-8 md:pl-24 md:pr-16 lg:pr-20 focus:outline-none"
            >
              {children}
            </main>

            {/* 6. Refined Minimalist Engineering Footer */}
            <footer className="mt-20 border-t border-[rgba(226,226,218,0.13)] bg-[#0B0C0D]/90 backdrop-blur-md py-6 px-5 sm:px-8 md:pl-24 md:pr-16 lg:pr-20">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A8AAA5]">
                <div className="flex items-center space-x-3">
                  <img
                    src="/logo.svg"
                    alt="WOBBLE"
                    className="h-6 w-auto object-contain"
                  />
                  <span className="text-[#777A76]">—</span>
                  <span className="text-[#A8AAA5]">
                    Test reliability &amp; empirical verification platform
                  </span>
                </div>

                <div className="flex items-center space-x-4 text-xs font-mono">
                  <span className="text-[#777A76]">
                    Adapter: <span className="text-[#F0EEE8]">Mock (Local)</span>
                  </span>
                  <span className="text-[#777A76]">|</span>
                  <Link
                    href="/settings"
                    className="text-[#A8AAA5] hover:text-[#F0EEE8] transition-colors"
                  >
                    Engine settings
                  </Link>
                  <Link
                    href="/tests"
                    className="text-[#A8AAA5] hover:text-[#F0EEE8] transition-colors"
                  >
                    Test directory
                  </Link>
                </div>
              </div>
            </footer>
          </div>

          {/* 7. New Investigation Modal */}
          <NewInvestigationModal
            isOpen={isNewInvOpen}
            onClose={() => setIsNewInvOpen(false)}
          />
        </div>
      </PageTransition>
    </SmoothScroll>
  );
}

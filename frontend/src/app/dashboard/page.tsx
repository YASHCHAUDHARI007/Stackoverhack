"use client";

import React, { useState, useEffect, useRef } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { OperationalOverview } from "@/components/dashboard/OperationalOverview";
import { TriageWorklist } from "@/components/dashboard/TriageWorklist";
import { FlakinessTrendChart } from "@/components/dashboard/FlakinessTrendChart";
import { SeverityDistributionChart } from "@/components/dashboard/SeverityDistributionChart";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { api, DashboardMetrics } from "@/services/api";
import { Investigation, Repository, TelemetryEvent } from "@/types";
import gsap from "gsap";

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [investigations, setInvestigations] = useState<Investigation[]>([]);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [telemetry, setTelemetry] = useState<TelemetryEvent[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const dashboardRoot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const [m, invs, repos, telem] = await Promise.all([
        api.getDashboardMetrics(),
        api.getInvestigations({ repository: selectedRepo }),
        api.getRepositories(),
        api.getTelemetryStream(),
      ]);
      setMetrics(m);
      setInvestigations(invs);
      setRepositories(repos);
      setTelemetry(telem);
      setIsLoading(false);
    }
    loadData();
  }, [selectedRepo]);

  // GSAP entrance reveal for dashboard content
  useEffect(() => {
    if (
      !dashboardRoot.current ||
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".wobble-stagger-card",
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          stagger: 0.06,
          ease: "power2.out",
        }
      );
    }, dashboardRoot);

    return () => ctx.revert();
  }, [isLoading]);

  return (
    <AppShell
      selectedRepo={selectedRepo}
      onRepoChange={(repo) => setSelectedRepo(repo)}
    >
      <div ref={dashboardRoot} className="space-y-7">
        {/* ============================================================ */}
        {/* HEADER: TYPOGRAPHY HIERARCHY & REPOSITORY CONTEXT            */}
        {/* ============================================================ */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-4 border-b border-[rgba(226,226,218,0.13)] gap-4">
          <div>
            <div className="flex items-center space-x-2 text-[#777A76] font-mono text-xs mb-1.5">
              <span className="w-2 h-2 rounded-full bg-[#7EB49A]" />
              <span className="tracking-wider uppercase font-medium text-[11px]">
                Empirical verification platform
              </span>
              <span>/</span>
              <span className="text-[#A8AAA5] font-sans">Overview</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-semibold text-[#F0EEE8] tracking-tight leading-tight">
              Test reliability
            </h1>
            <p className="text-sm text-[#A8AAA5] mt-1.5 max-w-2xl leading-relaxed">
              Automated reproduction seeds, delta-debugging test-order reduction, and synthetic race-condition stress verification.
            </p>
          </div>

          {/* Quick Engine Status Indicator */}
          <div className="flex items-center space-x-3 text-xs font-mono">
            <div className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-[#17191A] border border-[rgba(226,226,218,0.13)] text-[#A8AAA5]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7EB49A]" />
              <span>CI health: <strong className="text-[#F0EEE8] font-medium">98.4%</strong></span>
            </div>
            <div className="hidden sm:flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-[#17191A] border border-[rgba(226,226,218,0.13)] text-[#A8AAA5]">
              <span>Telemetry: <strong className="text-[#7EB49A] font-medium">Active</strong></span>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 1. OPERATIONAL OVERVIEW TELEMETRY STRIP                       */}
        {/* ============================================================ */}
        <div className="wobble-stagger-card">
          <OperationalOverview
            metrics={metrics}
            selectedRepo={selectedRepo}
            onRepoChange={setSelectedRepo}
            repositories={repositories}
          />
        </div>

        {/* ============================================================ */}
        {/* 2. ASYMMETRICAL WORKSPACE: WORKLIST & ANALYTICAL STACK        */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          {/* PRIMARY INVESTIGATION WORKLIST (7 cols / 58% on Large Screens) */}
          <div className="lg:col-span-7 space-y-7">
            <div className="wobble-stagger-card">
              <TriageWorklist investigations={investigations} />
            </div>

            <div className="wobble-stagger-card">
              <ActivityFeed events={telemetry} />
            </div>
          </div>

          {/* SUPPORTING ANALYSIS STACK (5 cols / 42% on Large Screens) */}
          <div className="lg:col-span-5 space-y-7">
            <div className="wobble-stagger-card">
              <FlakinessTrendChart data={metrics?.trendData} />
            </div>

            <div className="wobble-stagger-card">
              <SeverityDistributionChart data={metrics?.severityDistribution} />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

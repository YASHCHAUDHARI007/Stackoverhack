"use client";

import React from "react";
import {
  ShieldAlert,
  CheckCircle2,
  RefreshCw,
  Activity,
  GitBranch,
  TrendingDown,
} from "lucide-react";
import { DashboardMetrics } from "@/services/api";

interface OperationalOverviewProps {
  metrics: DashboardMetrics | null;
  selectedRepo: string;
  onRepoChange: (repo: string) => void;
  repositories: Array<{ id: string; name: string; healthScore: number }>;
}

export function OperationalOverview({
  metrics,
  selectedRepo,
  onRepoChange,
  repositories,
}: OperationalOverviewProps) {
  const flakyCount = metrics?.flakyCount ?? 38;
  const verifiedCount = metrics?.verifiedFixes ?? 29;
  const inProgress = metrics?.investigationsInProgress ?? 4;
  const totalScanned = metrics?.totalScanned ?? 14820;

  return (
    <div className="surface-solid rounded-2xl p-5 sm:p-6">
      {/* Header bar with Scope and Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[rgba(226,226,218,0.13)] gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-medium text-[#F0EEE8] tracking-tight">
            Operational health
          </h2>
          <p className="text-xs sm:text-[13px] text-[#A8AAA5] mt-0.5">
            Real-time telemetry across distributed test execution suites
          </p>
        </div>

        {/* Scope Selector */}
        <div className="flex items-center space-x-2 font-mono text-xs">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#222424] border border-[rgba(226,226,218,0.13)] text-[#F0EEE8]">
            <GitBranch className="w-3.5 h-3.5 text-[#C5C7C1]" />
            <span className="text-[#A8AAA5] text-[11px]">Scope:</span>
            <select
              aria-label="Repository filter scope"
              value={selectedRepo}
              onChange={(e) => onRepoChange(e.target.value)}
              className="bg-transparent text-[#F0EEE8] font-medium focus:outline-none cursor-pointer text-xs"
            >
              <option value="ALL" className="bg-[#17191A]">
                All repositories ({repositories.length || 5})
              </option>
              {repositories.map((repo) => (
                <option key={repo.id} value={repo.name} className="bg-[#17191A]">
                  {repo.name} ({repo.healthScore}%)
                </option>
              ))}
            </select>
          </div>

          <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#222424] border border-[rgba(126,180,154,0.3)] text-[#7EB49A] text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7EB49A]" />
            <span>98.4% passing</span>
          </div>
        </div>
      </div>

      {/* Asymmetric Telemetry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
        {/* 1. Active Flakes & Instability */}
        <div className="rounded-xl bg-[#222424] border border-[rgba(226,226,218,0.13)] p-4 flex flex-col justify-between transition-colors hover:border-[rgba(226,226,218,0.22)]">
          <div className="flex items-center justify-between text-xs text-[#A8AAA5]">
            <span className="flex items-center space-x-1.5 font-medium">
              <ShieldAlert className="w-3.5 h-3.5 text-[#E47777]" />
              <span>Flaky tests</span>
            </span>
            <span className="text-[#E47777] font-mono text-[11px] font-medium px-1.5 py-0.5 rounded bg-[rgba(228,119,119,0.12)] border border-[rgba(228,119,119,0.28)]">
              Critical
            </span>
          </div>

          <div className="my-3">
            <div className="text-2xl font-semibold font-mono tracking-tight text-[#F0EEE8] flex items-baseline gap-2">
              <span>{flakyCount}</span>
              <span className="text-xs font-normal text-[#A8AAA5]">
                / {totalScanned.toLocaleString()} scanned
              </span>
            </div>
            {/* Severity bar */}
            <div className="w-full h-1.5 rounded-full bg-[#17191A] overflow-hidden flex mt-2.5">
              <div
                className="h-full bg-[#E47777]"
                style={{ width: "32%" }}
                title="12 High severity"
              />
              <div
                className="h-full bg-[#D8AD70]"
                style={{ width: "50%" }}
                title="19 Moderate"
              />
              <div
                className="h-full bg-[#A8AAA5]"
                style={{ width: "18%" }}
                title="7 Low"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#A8AAA5] pt-2 border-t border-[rgba(226,226,218,0.10)] font-mono">
            <span className="flex items-center space-x-1 text-[#7EB49A]">
              <TrendingDown className="w-3 h-3" />
              <span>-4 this week</span>
            </span>
            <span>Peak 24.5%</span>
          </div>
        </div>

        {/* 2. Verified Fixes */}
        <div className="rounded-xl bg-[#222424] border border-[rgba(226,226,218,0.13)] p-4 flex flex-col justify-between transition-colors hover:border-[rgba(226,226,218,0.22)]">
          <div className="flex items-center justify-between text-xs text-[#A8AAA5]">
            <span className="flex items-center space-x-1.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#7EB49A]" />
              <span>Verified fixes</span>
            </span>
            <span className="text-[#7EB49A] font-mono text-[11px] font-medium px-1.5 py-0.5 rounded bg-[rgba(126,180,154,0.12)] border border-[rgba(126,180,154,0.28)]">
              100/100 Pass
            </span>
          </div>

          <div className="my-3">
            <div className="text-2xl font-semibold font-mono tracking-tight text-[#F0EEE8] flex items-baseline gap-2">
              <span>{verifiedCount}</span>
              <span className="text-xs font-normal text-[#7EB49A]">
                (76.3% resolved)
              </span>
            </div>
            {/* Progress meter */}
            <div className="w-full h-1.5 rounded-full bg-[#17191A] overflow-hidden mt-2.5">
              <div
                className="h-full bg-[#7EB49A]"
                style={{ width: "76%" }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#A8AAA5] pt-2 border-t border-[rgba(226,226,218,0.10)] font-mono">
            <span>Mean MTTF: 14.2d</span>
            <span className="text-[#7EB49A]">99.8% confidence</span>
          </div>
        </div>

        {/* 3. In-Flight Investigation Pipeline */}
        <div className="rounded-xl bg-[#222424] border border-[rgba(226,226,218,0.13)] p-4 flex flex-col justify-between transition-colors hover:border-[rgba(226,226,218,0.22)]">
          <div className="flex items-center justify-between text-xs text-[#A8AAA5]">
            <span className="flex items-center space-x-1.5 font-medium">
              <RefreshCw className="w-3.5 h-3.5 text-[#C5C7C1]" />
              <span>In investigation</span>
            </span>
            <span className="text-[#A8AAA5] font-mono text-[11px] font-medium px-1.5 py-0.5 rounded bg-[rgba(168,170,165,0.10)] border border-[rgba(168,170,165,0.20)]">
              Active
            </span>
          </div>

          <div className="my-3">
            <div className="text-2xl font-semibold font-mono tracking-tight text-[#F0EEE8] flex items-baseline gap-2">
              <span>{inProgress}</span>
              <span className="text-xs font-normal text-[#A8AAA5]">
                active traces
              </span>
            </div>
            <div className="text-[11px] text-[#A8AAA5] font-mono mt-1 flex items-center space-x-2">
              <span>2 delta-debug</span>
              <span>•</span>
              <span>1 patch synth</span>
              <span>•</span>
              <span>1 repro</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#A8AAA5] pt-2 border-t border-[rgba(226,226,218,0.10)] font-mono">
            <span>Mean MTTR: 18m</span>
            <span className="text-[#C5C7C1]">Seed isolated</span>
          </div>
        </div>

        {/* 4. Total Test Suite Execution */}
        <div className="rounded-xl bg-[#222424] border border-[rgba(226,226,218,0.13)] p-4 flex flex-col justify-between transition-colors hover:border-[rgba(226,226,218,0.22)]">
          <div className="flex items-center justify-between text-xs text-[#A8AAA5]">
            <span className="flex items-center space-x-1.5 font-medium">
              <Activity className="w-3.5 h-3.5 text-[#C5C7C1]" />
              <span>Suite coverage</span>
            </span>
            <span className="text-[#A8AAA5] font-mono text-[11px]">
              Local mock
            </span>
          </div>

          <div className="my-3">
            <div className="text-2xl font-semibold font-mono tracking-tight text-[#F0EEE8] flex items-baseline gap-2">
              <span>14.8k</span>
              <span className="text-xs font-normal text-[#A8AAA5]">
                test runs
              </span>
            </div>
            <div className="text-[11px] text-[#A8AAA5] font-mono mt-1">
              Deterministic pass: <span className="text-[#7EB49A] font-medium">99.74%</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#A8AAA5] pt-2 border-t border-[rgba(226,226,218,0.10)] font-mono">
            <span>Runner latency: &lt;14ms</span>
            <span className="text-[#7EB49A]">Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
}

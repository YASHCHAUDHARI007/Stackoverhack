"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  GitBranch,
  Search,
  TrendingUp,
  CheckCircle2,
  Cpu,
  RefreshCw,
  Copy,
  Check,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Investigation } from "@/types";
import { cn } from "@/lib/utils";

interface TriageWorklistProps {
  investigations: Investigation[];
}

type FilterTab = "ALL" | "WORSENING" | "UNREPRODUCED" | "ACTIVE" | "VERIFIED";

export function TriageWorklist({ investigations }: TriageWorklistProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedSeed, setCopiedSeed] = useState<string | null>(null);

  const handleCopySeed = (e: React.MouseEvent, seed: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(seed);
    setCopiedSeed(seed);
    setTimeout(() => setCopiedSeed(null), 2000);
  };

  const filtered = investigations.filter((inv) => {
    const matchesSearch =
      inv.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.testFile.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.repository.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === "WORSENING") return inv.failureRate >= 14;
    if (activeTab === "UNREPRODUCED") return inv.status === "INVESTIGATING" || inv.stage === "DETECT";
    if (activeTab === "ACTIVE") return inv.status !== "VERIFIED";
    if (activeTab === "VERIFIED") return inv.status === "VERIFIED";
    return true;
  });

  return (
    <div className="surface-solid rounded-2xl overflow-hidden shadow-2xl">
      {/* Header and Filter Bar */}
      <div className="p-5 sm:p-6 border-b border-[rgba(226,226,218,0.13)] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono font-medium text-[#777A76] tracking-wider uppercase">
                Triage queue
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#222424] text-[#A8AAA5] border border-[rgba(226,226,218,0.13)]">
                {filtered.length} active
              </span>
            </div>
            <h2 className="text-lg font-semibold text-[#F0EEE8] tracking-tight mt-1">
              Flaky test worklist
            </h2>
            <p className="text-xs text-[#A8AAA5] mt-0.5 max-w-xl leading-relaxed">
              Prioritized non-deterministic failures needing automated seed isolation, delta reduction, or empirical verification.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              href="/investigations"
              className="px-3.5 py-1.5 rounded-xl bg-[#222424] hover:bg-[#2c2f2f] text-[#F0EEE8] border border-[rgba(226,226,218,0.13)] hover:border-[rgba(235,235,228,0.25)] text-xs font-mono transition-all flex items-center space-x-1.5 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C5C7C1]"
            >
              <span>Full investigation inventory</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#A8AAA5]" />
            </Link>
          </div>
        </div>

        {/* Tab Filters & Quick Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 font-mono text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("ALL")}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer font-medium select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C5C7C1]",
                activeTab === "ALL"
                  ? "bg-[#222424] text-[#F0EEE8] border border-[rgba(235,235,228,0.22)] shadow-sm"
                  : "text-[#A8AAA5] hover:text-[#F0EEE8] hover:bg-[#222424]/40 border border-transparent"
              )}
            >
              All tests ({investigations.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("WORSENING")}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer flex items-center space-x-1.5 font-medium select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-[#E47777]",
                activeTab === "WORSENING"
                  ? "bg-[rgba(228,119,119,0.12)] text-[#E47777] border border-[rgba(228,119,119,0.3)] shadow-sm"
                  : "text-[#A8AAA5] hover:text-[#F0EEE8] hover:bg-[#222424]/40 border border-transparent"
              )}
            >
              <TrendingUp className="w-3.5 h-3.5 text-[#E47777]" />
              <span>Getting worse ({investigations.filter((i) => i.failureRate >= 14).length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("ACTIVE")}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer flex items-center space-x-1.5 font-medium select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C5C7C1]",
                activeTab === "ACTIVE"
                  ? "bg-[#222424] text-[#F0EEE8] border border-[rgba(235,235,228,0.22)] shadow-sm"
                  : "text-[#A8AAA5] hover:text-[#F0EEE8] hover:bg-[#222424]/40 border border-transparent"
              )}
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#A8AAA5]" />
              <span>Diagnosing ({investigations.filter((i) => i.status !== "VERIFIED").length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("VERIFIED")}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer flex items-center space-x-1.5 font-medium select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-[#7EB49A]",
                activeTab === "VERIFIED"
                  ? "bg-[rgba(126,180,154,0.12)] text-[#7EB49A] border border-[rgba(126,180,154,0.3)] shadow-sm"
                  : "text-[#A8AAA5] hover:text-[#F0EEE8] hover:bg-[#222424]/40 border border-transparent"
              )}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#7EB49A]" />
              <span>Verified clean ({investigations.filter((i) => i.status === "VERIFIED").length})</span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-[#777A76] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              aria-label="Filter tests by name, file, or ID"
              placeholder="Filter by test, file, ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0B0C0D] border border-[rgba(226,226,218,0.13)] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#F0EEE8] placeholder-[#777A76] focus:outline-none focus:border-[#C5C7C1] font-mono transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Worklist Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-[rgba(226,226,218,0.13)] bg-[#0B0C0D]/50 text-[#777A76] text-[11px] font-medium tracking-wide">
              <th className="py-3 px-5">Test &amp; repository scope</th>
              <th className="py-3 px-4 text-center">Failure rate</th>
              <th className="py-3 px-4">Suspected root cause</th>
              <th className="py-3 px-4 text-center">Repro state</th>
              <th className="py-3 px-5 text-right">Workspace action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(226,226,218,0.08)]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-[#777A76] font-mono text-xs">
                  No investigations match the selected filter criteria.
                </td>
              </tr>
            ) : (
              filtered.map((inv) => (
                <tr
                  key={inv.id}
                  className="hover:bg-[#222424]/40 transition-colors group cursor-pointer"
                >
                  {/* Test & ID & Path */}
                  <td className="py-3.5 px-5">
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-2">
                        <span className="text-[#F0EEE8] font-bold tracking-tight">
                          {inv.id}
                        </span>
                        <Link
                          href={`/investigations/${inv.id}`}
                          className="font-sans font-medium text-[#F0EEE8] group-hover:text-[#C5C7C1] transition-colors truncate max-w-sm sm:max-w-md"
                        >
                          {inv.testName}
                        </Link>
                      </div>
                      <div className="flex items-center space-x-2 text-[11px] text-[#A8AAA5] mt-1 font-mono">
                        <span className="truncate max-w-xs">{inv.testFile}</span>
                        <span className="text-[#777A76]">•</span>
                        <div className="flex items-center space-x-1 text-[#A8AAA5]">
                          <GitBranch className="w-3 h-3 text-[#777A76]" />
                          <span>{inv.repository}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Failure Rate Badge & Trend */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex flex-col items-center">
                      <div className="flex items-center space-x-1.5">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-md text-xs font-semibold border",
                            inv.failureRate >= 15
                              ? "bg-[rgba(228,119,119,0.12)] text-[#E47777] border-[rgba(228,119,119,0.25)]"
                              : inv.failureRate >= 8
                              ? "bg-[rgba(216,173,112,0.12)] text-[#D8AD70] border-[rgba(216,173,112,0.25)]"
                              : "bg-[rgba(126,180,154,0.12)] text-[#7EB49A] border-[rgba(126,180,154,0.25)]"
                          )}
                        >
                          {inv.failureRate.toFixed(1)}% flaky
                        </span>
                        {inv.failureRate >= 15 && (
                          <span
                            title="Test failure frequency is worsening in CI"
                            className="text-[#E47777] font-bold"
                          >
                            ↑
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#777A76] mt-1">
                        {inv.failedExecutions}/{inv.totalExecutions} failed runs
                      </span>
                    </div>
                  </td>

                  {/* Root Category */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-[#F0EEE8] font-sans font-medium">
                        {inv.hypothesis ? inv.hypothesis.category : "Automated diagnosis pending"}
                      </span>
                      {inv.hypothesis && (
                        <div className="text-[10px] text-[#A8AAA5] font-mono mt-0.5 flex items-center space-x-1.5">
                          <Cpu className="w-3 h-3 text-[#777A76]" />
                          <span>{inv.hypothesis.confidence}% confidence</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Reproduction Status */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex flex-col items-center">
                      <StatusBadge status={inv.status} size="sm" />
                      {inv.minimization?.reproductionSeed && (
                        <button
                          type="button"
                          onClick={(e) =>
                            handleCopySeed(e, inv.minimization?.reproductionSeed || "")
                          }
                          title="Click to copy reproduction seed"
                          className="text-[10px] text-[#777A76] font-mono mt-1 hover:text-[#F0EEE8] flex items-center space-x-1 cursor-pointer transition-colors"
                        >
                          <span>Seed: {inv.minimization.reproductionSeed.slice(0, 8)}...</span>
                          {copiedSeed === inv.minimization.reproductionSeed ? (
                            <Check className="w-2.5 h-2.5 text-[#7EB49A]" />
                          ) : (
                            <Copy className="w-2.5 h-2.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-5 text-right">
                    <Link
                      href={`/investigations/${inv.id}`}
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#222424] hover:bg-[#2c2f2f] text-[#F0EEE8] border border-[rgba(226,226,218,0.13)] hover:border-[rgba(235,235,228,0.25)] text-xs font-mono font-medium transition-all shadow-sm focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C5C7C1]"
                    >
                      <span>Investigate</span>
                      <ArrowRight className="w-3 h-3 text-[#A8AAA5] group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

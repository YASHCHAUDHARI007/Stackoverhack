"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  Search,
  ArrowRight,
  Play,
  FileCode,
} from "lucide-react";
import { api } from "@/services/api";
import { FlakyTestSummary, Repository } from "@/types";
import { formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function FlakyTestsPage() {
  const [tests, setTests] = useState<FlakyTestSummary[]>([]);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRepo, setSelectedRepo] = useState("ALL");
  const [minRate, setMinRate] = useState<number>(0);
  const [sortBy, setSortBy] = useState<"flakinessRate" | "executionCount" | "failureCount">("flakinessRate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const [t, repos] = await Promise.all([
        api.getFlakyTests(),
        api.getRepositories(),
      ]);
      setTests(t);
      setRepositories(repos);
      setIsLoading(false);
    }
    loadData();
  }, []);

  const filteredTests = useMemo(() => {
    let result = [...tests];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.file.toLowerCase().includes(q) ||
          t.repository.toLowerCase().includes(q) ||
          t.suspectedCause.toLowerCase().includes(q)
      );
    }

    if (selectedRepo !== "ALL") {
      result = result.filter((t) => t.repository === selectedRepo);
    }

    if (minRate > 0) {
      result = result.filter((t) => t.flakinessRate >= minRate);
    }

    result.sort((a, b) => {
      const fieldA = a[sortBy];
      const fieldB = b[sortBy];
      return sortOrder === "asc" ? fieldA - fieldB : fieldB - fieldA;
    });

    return result;
  }, [tests, searchQuery, selectedRepo, minRate, sortBy, sortOrder]);

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[rgba(226,226,218,0.13)] gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-[#F0EEE8] tracking-tight">
              Flaky test registry
            </h1>
            <p className="text-xs sm:text-sm text-[#A8AAA5] mt-1">
              Empirical registry of non-deterministic tests with 95% binomial confidence intervals
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="px-3.5 py-1.5 rounded-xl bg-[#17191A] border border-[rgba(226,226,218,0.13)] text-[#A8AAA5]">
              Active signatures: <strong className="text-[#F0EEE8] font-medium">{filteredTests.length}</strong>
            </span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="surface-solid rounded-2xl p-4 sm:p-5 space-y-3 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="relative md:col-span-2">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#777A76]" />
              <input
                type="text"
                aria-label="Filter by test identifier, file path, or suspected cause"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by test identifier, file path, or suspected cause..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0B0C0D] border border-[rgba(226,226,218,0.13)] text-xs font-mono text-[#F0EEE8] placeholder-[#777A76] focus:outline-none focus:border-[#C5C7C1]"
              />
            </div>

            <div>
              <select
                aria-label="Filter by repository"
                value={selectedRepo}
                onChange={(e) => setSelectedRepo(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0B0C0D] border border-[rgba(226,226,218,0.13)] text-xs font-mono text-[#F0EEE8] focus:outline-none focus:border-[#C5C7C1] cursor-pointer"
              >
                <option value="ALL">All repositories</option>
                {repositories.map((repo) => (
                  <option key={repo.id} value={repo.name} className="bg-[#17191A]">
                    {repo.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <select
                aria-label="Filter by minimum flakiness rate"
                value={minRate}
                onChange={(e) => setMinRate(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#0B0C0D] border border-[rgba(226,226,218,0.13)] text-xs font-mono text-[#F0EEE8] focus:outline-none focus:border-[#C5C7C1] cursor-pointer"
              >
                <option value={0} className="bg-[#17191A]">Any flakiness rate</option>
                <option value={10} className="bg-[#17191A]">Min 10% flakiness</option>
                <option value={15} className="bg-[#17191A]">Min 15% flakiness (high)</option>
                <option value={20} className="bg-[#17191A]">Min 20% flakiness (critical)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Inventory Cards */}
        <div className="space-y-3.5">
          {filteredTests.map((t) => (
            <div
              key={t.id}
              className="surface-solid rounded-2xl p-5 hover:border-[rgba(235,235,228,0.25)] transition-all duration-200 shadow-xl"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-[#F0EEE8] px-2.5 py-0.5 rounded-full bg-[#222424] border border-[rgba(226,226,218,0.13)]">
                      {t.id}
                    </span>
                    <StatusBadge status={t.investigationStatus} size="sm" />
                    <span className="text-xs font-mono text-[#777A76]">
                      Last failure: {formatRelativeTime(t.lastObservedFailure)}
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-[#F0EEE8] hover:text-[#C5C7C1] transition-colors font-mono">
                    {t.name}
                  </h3>

                  <div className="flex items-center space-x-2 text-xs font-mono text-[#A8AAA5]">
                    <FileCode className="w-3.5 h-3.5 text-[#777A76] shrink-0" />
                    <span className="text-[#F0EEE8]">{t.file}</span>
                    <span className="text-[#777A76]">•</span>
                    <span>{t.repository}</span>
                    <span className="text-[#777A76]">•</span>
                    <span>{t.branch}</span>
                  </div>

                  {/* Suspected Cause */}
                  <div className="pt-1 text-xs text-[#A8AAA5] flex items-start space-x-1.5 font-sans">
                    <span className="font-semibold text-[#D8AD70] text-xs">Identified cause:</span>
                    <span>{t.suspectedCause}</span>
                  </div>
                </div>

                {/* Quantitative Measurement & CI Interval */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 lg:gap-6 border-t lg:border-t-0 lg:border-l border-[rgba(226,226,218,0.13)] pt-3.5 lg:pt-0 lg:pl-6 shrink-0 font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-[#777A76] uppercase block tracking-wider font-medium">
                      Flakiness rate
                    </span>
                    <div className="text-base font-semibold text-[#D8AD70] mt-0.5">
                      {t.flakinessRate.toFixed(1)}%
                    </div>
                    <span className="text-[10px] text-[#777A76] block">
                      95% CI: [{t.confidenceInterval[0]}% - {t.confidenceInterval[1]}%]
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#777A76] uppercase block tracking-wider font-medium">
                      Observed runs
                    </span>
                    <div className="text-sm font-semibold text-[#F0EEE8] mt-0.5">
                      {t.executionCount}
                    </div>
                    <span className="text-[10px] text-[#E47777] block">
                      {t.failureCount} failures
                    </span>
                  </div>

                  {/* Action CTA */}
                  <div className="shrink-0">
                    {t.activeInvestigationId ? (
                      <Link
                        href={`/investigations/${t.activeInvestigationId}`}
                        className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#222424] hover:bg-[#2c2f2f] text-[#F0EEE8] border border-[rgba(226,226,218,0.13)] hover:border-[rgba(235,235,228,0.25)] transition-all font-mono text-xs font-medium"
                      >
                        <span>Workspace</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#A8AAA5]" />
                      </Link>
                    ) : (
                      <Link
                        href="/investigations"
                        className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#222424] hover:bg-[#2c2f2f] text-[#F0EEE8] border border-[rgba(226,226,218,0.13)] hover:border-[rgba(235,235,228,0.25)] transition-all font-mono text-xs"
                      >
                        <span>Investigate</span>
                        <Play className="w-3 h-3 fill-current text-[#A8AAA5]" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

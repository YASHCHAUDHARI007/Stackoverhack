"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  Search,
  ArrowUpDown,
  ArrowRight,
  GitBranch,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { api } from "@/services/api";
import { Investigation, FlakinessSeverity, Repository } from "@/types";
import { cn } from "@/lib/utils";

export default function InvestigationsPage() {
  const [investigations, setInvestigations] = useState<Investigation[]>([]);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRepo, setSelectedRepo] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedSeverity, setSelectedSeverity] = useState<FlakinessSeverity | "ALL">("ALL");
  const [sortBy, setSortBy] = useState<"startedAt" | "failureRate" | "totalExecutions">("startedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const [invs, repos] = await Promise.all([
        api.getInvestigations(),
        api.getRepositories(),
      ]);
      setInvestigations(invs);
      setRepositories(repos);
      setIsLoading(false);
    }
    loadData();
  }, []);

  // Filter & Sort
  const filteredInvestigations = useMemo(() => {
    let result = [...investigations];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (i) =>
          i.id.toLowerCase().includes(q) ||
          i.testName.toLowerCase().includes(q) ||
          i.testFile.toLowerCase().includes(q) ||
          i.repository.toLowerCase().includes(q) ||
          i.branch.toLowerCase().includes(q)
      );
    }

    if (selectedRepo !== "ALL") {
      result = result.filter((i) => i.repository === selectedRepo);
    }

    if (selectedStatus !== "ALL") {
      result = result.filter((i) => i.status === selectedStatus);
    }

    if (selectedSeverity !== "ALL") {
      result = result.filter((i) => i.severity === selectedSeverity);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "failureRate") {
        return sortOrder === "asc"
          ? a.failureRate - b.failureRate
          : b.failureRate - a.failureRate;
      }
      if (sortBy === "totalExecutions") {
        return sortOrder === "asc"
          ? a.totalExecutions - b.totalExecutions
          : b.totalExecutions - a.totalExecutions;
      }
      return sortOrder === "asc"
        ? new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime()
        : new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime();
    });

    return result;
  }, [
    investigations,
    searchQuery,
    selectedRepo,
    selectedStatus,
    selectedSeverity,
    sortBy,
    sortOrder,
  ]);

  const totalPages = Math.ceil(filteredInvestigations.length / pageSize) || 1;
  const paginatedList = filteredInvestigations.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const toggleSort = (field: "startedAt" | "failureRate" | "totalExecutions") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[rgba(226,226,218,0.13)] gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-[#F0EEE8] tracking-tight">
              Test investigations
            </h1>
            <p className="text-xs sm:text-sm text-[#A8AAA5] mt-1">
              Diagnostic workspace sessions, delta-debugging reduction logs, and empirical stress passes
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="px-3.5 py-1.5 rounded-xl bg-[#17191A] border border-[rgba(226,226,218,0.13)] text-[#A8AAA5]">
              Total records: <strong className="text-[#F0EEE8] font-medium">{filteredInvestigations.length}</strong>
            </span>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="surface-solid rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative md:col-span-2">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#777A76]" />
              <input
                type="text"
                aria-label="Search investigations by test name, file path, repository, or ID"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by test, file, repository, or ID..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0B0C0D] border border-[rgba(226,226,218,0.13)] text-xs font-mono text-[#F0EEE8] placeholder-[#777A76] focus:outline-none focus:border-[#C5C7C1]"
              />
            </div>

            {/* Repository Filter */}
            <div>
              <select
                aria-label="Filter investigations by repository"
                value={selectedRepo}
                onChange={(e) => {
                  setSelectedRepo(e.target.value);
                  setCurrentPage(1);
                }}
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

            {/* Status Filter */}
            <div>
              <select
                aria-label="Filter investigations by diagnostic status"
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 rounded-xl bg-[#0B0C0D] border border-[rgba(226,226,218,0.13)] text-xs font-mono text-[#F0EEE8] focus:outline-none focus:border-[#C5C7C1] cursor-pointer"
              >
                <option value="ALL" className="bg-[#17191A]">All statuses</option>
                <option value="INVESTIGATING" className="bg-[#17191A]">Investigating</option>
                <option value="REPRODUCED" className="bg-[#17191A]">Reproduced</option>
                <option value="MINIMIZED" className="bg-[#17191A]">Minimized</option>
                <option value="DIAGNOSED" className="bg-[#17191A]">Diagnosed</option>
                <option value="VERIFIED" className="bg-[#17191A]">Verified</option>
                <option value="FAILED" className="bg-[#17191A]">Failed</option>
                <option value="INCONCLUSIVE" className="bg-[#17191A]">Inconclusive</option>
              </select>
            </div>
          </div>

          {/* Quick Filter Chips */}
          <div role="group" aria-label="Investigation status quick filters" className="flex flex-wrap items-center gap-2 pt-3 border-t border-[rgba(226,226,218,0.13)] text-xs font-mono">
            <span className="text-[#777A76] text-[11px] mr-1">Filter:</span>
            <button
              type="button"
              aria-pressed={selectedStatus === "ALL" && selectedRepo === "ALL" && !searchQuery}
              onClick={() => {
                setSelectedStatus("ALL");
                setSelectedRepo("ALL");
                setSearchQuery("");
                setCurrentPage(1);
              }}
              className={cn(
                "px-3 py-1 rounded-xl border text-xs transition-colors cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C5C7C1]",
                selectedStatus === "ALL" && selectedRepo === "ALL" && !searchQuery
                  ? "bg-[#222424] border-[rgba(235,235,228,0.22)] text-[#F0EEE8] font-medium"
                  : "bg-[#0B0C0D] border-[rgba(226,226,218,0.13)] text-[#A8AAA5] hover:text-[#F0EEE8]"
              )}
            >
              All
            </button>
            <button
              type="button"
              aria-pressed={selectedStatus === "VERIFIED"}
              onClick={() => {
                setSelectedStatus("VERIFIED");
                setCurrentPage(1);
              }}
              className={cn(
                "px-3 py-1 rounded-xl border text-xs transition-colors cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#7EB49A]",
                selectedStatus === "VERIFIED"
                  ? "bg-[rgba(126,180,154,0.12)] border-[rgba(126,180,154,0.3)] text-[#7EB49A] font-medium"
                  : "bg-[#0B0C0D] border-[rgba(226,226,218,0.13)] text-[#A8AAA5] hover:text-[#F0EEE8]"
              )}
            >
              Verified fixes
            </button>
            <button
              type="button"
              aria-pressed={selectedStatus === "REPRODUCED"}
              onClick={() => {
                setSelectedStatus("REPRODUCED");
                setCurrentPage(1);
              }}
              className={cn(
                "px-3 py-1 rounded-xl border text-xs transition-colors cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#D8AD70]",
                selectedStatus === "REPRODUCED"
                  ? "bg-[rgba(216,173,112,0.12)] border-[rgba(216,173,112,0.3)] text-[#D8AD70] font-medium"
                  : "bg-[#0B0C0D] border-[rgba(226,226,218,0.13)] text-[#A8AAA5] hover:text-[#F0EEE8]"
              )}
            >
              In reproduction
            </button>
            <button
              type="button"
              aria-pressed={selectedStatus === "DIAGNOSED"}
              onClick={() => {
                setSelectedStatus("DIAGNOSED");
                setCurrentPage(1);
              }}
              className={cn(
                "px-3 py-1 rounded-xl border text-xs transition-colors cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C5C7C1]",
                selectedStatus === "DIAGNOSED"
                  ? "bg-[#222424] border-[rgba(235,235,228,0.22)] text-[#F0EEE8] font-medium"
                  : "bg-[#0B0C0D] border-[rgba(226,226,218,0.13)] text-[#A8AAA5] hover:text-[#F0EEE8]"
              )}
            >
              Diagnosed
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="surface-solid rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table aria-label="Investigations directory table" className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-[rgba(226,226,218,0.13)] bg-[#0B0C0D]/50 text-[#777A76] text-[11px] font-medium tracking-wide">
                  <th scope="col" className="py-3 px-5">Investigation / test</th>
                  <th scope="col" className="py-3 px-4">Repository</th>
                  <th
                    scope="col"
                    className="py-3 px-4 text-center cursor-pointer hover:text-[#F0EEE8]"
                    onClick={() => toggleSort("failureRate")}
                  >
                    <button
                      type="button"
                      aria-label="Sort by failure rate"
                      className="flex items-center justify-center space-x-1 w-full focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C5C7C1] rounded cursor-pointer"
                    >
                      <span>Failure rate</span>
                      <ArrowUpDown className="w-3 h-3 text-[#777A76]" />
                    </button>
                  </th>
                  <th
                    scope="col"
                    className="py-3 px-4 text-center cursor-pointer hover:text-[#F0EEE8]"
                    onClick={() => toggleSort("totalExecutions")}
                  >
                    <button
                      type="button"
                      aria-label="Sort by total executions"
                      className="flex items-center justify-center space-x-1 w-full focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C5C7C1] rounded cursor-pointer"
                    >
                      <span>Executions</span>
                      <ArrowUpDown className="w-3 h-3 text-[#777A76]" />
                    </button>
                  </th>
                  <th scope="col" className="py-3 px-4 text-center">Stage</th>
                  <th scope="col" className="py-3 px-4 text-center">Status</th>
                  <th scope="col" className="py-3 px-5 text-right">Workspace</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(226,226,218,0.08)]">
                {paginatedList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#777A76] font-mono">
                      No investigations matching selected filter criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedList.map((inv) => (
                    <tr
                      key={inv.id}
                      className="hover:bg-[#222424]/40 transition-colors group cursor-pointer"
                    >
                      {/* Test & ID */}
                      <td className="py-3.5 px-5">
                        <div className="flex flex-col">
                          <div className="flex items-center space-x-2">
                            <span className="text-[#F0EEE8] font-semibold">
                              {inv.id}
                            </span>
                            <span className="text-[#F0EEE8] font-sans font-medium group-hover:text-[#C5C7C1] truncate max-w-sm">
                              {inv.testName}
                            </span>
                          </div>
                          <span className="text-[#777A76] text-[11px] truncate max-w-md mt-0.5 font-mono">
                            {inv.testFile}
                          </span>
                        </div>
                      </td>

                      {/* Repository */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-1.5 text-[#F0EEE8] text-xs">
                          <GitBranch className="w-3 h-3 text-[#777A76] shrink-0" />
                          <span>{inv.repository}</span>
                        </div>
                        <span className="text-[10px] text-[#777A76]">
                          {inv.branch}
                        </span>
                      </td>

                      {/* Flakiness Rate */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={cn(
                            "inline-block px-2 py-0.5 rounded-md font-semibold text-xs border",
                            inv.failureRate > 15
                              ? "bg-[rgba(228,119,119,0.12)] text-[#E47777] border-[rgba(228,119,119,0.25)]"
                              : inv.failureRate > 8
                              ? "bg-[rgba(216,173,112,0.12)] text-[#D8AD70] border-[rgba(216,173,112,0.25)]"
                              : "bg-[rgba(126,180,154,0.12)] text-[#7EB49A] border-[rgba(126,180,154,0.25)]"
                          )}
                        >
                          {inv.failureRate.toFixed(1)}%
                        </span>
                      </td>

                      {/* Total Executions */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="text-[#F0EEE8]">{inv.totalExecutions} runs</span>
                        <div className="text-[10px] text-[#777A76]">
                          ({inv.failedExecutions} failed)
                        </div>
                      </td>

                      {/* Stage */}
                      <td className="py-3.5 px-4 text-center">
                        <StatusBadge status={inv.stage} size="sm" />
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <StatusBadge status={inv.status} size="sm" />
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-5 text-right">
                        <Link
                          href={`/investigations/${inv.id}`}
                          aria-label={`Open investigation ${inv.id} for ${inv.testName}`}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-[#222424] text-[#F0EEE8] hover:bg-[#2c2f2f] transition-all border border-[rgba(226,226,218,0.13)] hover:border-[rgba(235,235,228,0.25)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C5C7C1]"
                        >
                          <span>Open</span>
                          <ArrowRight className="w-3 h-3 text-[#A8AAA5] group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-[rgba(226,226,218,0.13)] bg-[#0B0C0D]/50 text-xs font-mono text-[#A8AAA5]">
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  aria-label="Previous page"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded-lg border border-[rgba(226,226,218,0.13)] hover:bg-[#222424] text-[#A8AAA5] hover:text-[#F0EEE8] disabled:opacity-30 transition-colors cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C5C7C1]"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="Next page"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1.5 rounded-lg border border-[rgba(226,226,218,0.13)] hover:bg-[#222424] text-[#A8AAA5] hover:text-[#F0EEE8] disabled:opacity-30 transition-colors cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C5C7C1]"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

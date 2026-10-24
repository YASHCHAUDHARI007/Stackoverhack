"use client";

import React, { useState } from "react";
import {
  Menu,
  Plus,
  Search,
  Calendar,
  GitBranch,
} from "lucide-react";

interface TopBarProps {
  onToggleMobileSidebar: () => void;
  onNewInvestigation?: () => void;
  selectedRepo?: string;
  onRepoChange?: (repo: string) => void;
}

export function TopBar({
  onToggleMobileSidebar,
  onNewInvestigation,
  selectedRepo = "ALL",
  onRepoChange,
}: TopBarProps) {
  const [timeRange, setTimeRange] = useState("7d");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-30 h-14 bg-[#17191A]/85 backdrop-blur-md border-b border-[rgba(226,226,218,0.13)]">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Project Context */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-[#A8AAA5] hover:text-[#F0EEE8] hover:bg-[#222424] border border-[rgba(226,226,218,0.13)] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C5C7C1]"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Project & Scope Selector */}
          <div className="hidden sm:flex items-center space-x-2 bg-[#0B0C0D] px-3 py-1.5 rounded-xl border border-[rgba(226,226,218,0.13)] text-xs font-mono">
            <GitBranch className="w-3.5 h-3.5 text-[#777A76]" />
            <span className="text-[#777A76] text-[11px]">Scope:</span>
            <select
              aria-label="Target repository scope"
              value={selectedRepo}
              onChange={(e) => onRepoChange?.(e.target.value)}
              className="bg-transparent text-[#F0EEE8] font-medium focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C5C7C1] cursor-pointer text-xs"
            >
              <option value="ALL" className="bg-[#17191A]">
                All Repositories (5 Active)
              </option>
              <option value="mono-repo/api-core" className="bg-[#17191A]">
                mono-repo/api-core (98%)
              </option>
              <option value="billing-engine" className="bg-[#17191A]">
                billing-engine (96%)
              </option>
              <option value="auth-vault" className="bg-[#17191A]">
                auth-vault (92%)
              </option>
              <option value="data-pipeline" className="bg-[#17191A]">
                data-pipeline (94%)
              </option>
              <option value="checkout-svc" className="bg-[#17191A]">
                checkout-svc (97%)
              </option>
            </select>
          </div>

          {/* Time Range Selector */}
          <div className="hidden md:flex items-center space-x-1.5 bg-[#0B0C0D] px-3 py-1.5 rounded-xl border border-[rgba(226,226,218,0.13)] text-xs font-mono text-[#F0EEE8]">
            <Calendar className="w-3.5 h-3.5 text-[#777A76]" />
            <select
              aria-label="Time range filter"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-transparent font-medium focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C5C7C1] cursor-pointer text-xs"
            >
              <option value="24h" className="bg-[#17191A]">
                Last 24 Hours
              </option>
              <option value="7d" className="bg-[#17191A]">
                Last 7 Days
              </option>
              <option value="30d" className="bg-[#17191A]">
                Last 30 Days
              </option>
            </select>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#777A76]" />
            <input
              type="text"
              aria-label="Search tests, seeds, and error hashes"
              placeholder="Search tests, seeds, error hashes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0B0C0D] border border-[rgba(226,226,218,0.13)] focus:border-[#C5C7C1] pl-9 pr-12 py-1.5 rounded-xl text-xs text-[#F0EEE8] placeholder-[#777A76] focus:outline-none font-mono transition-colors"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 pointer-events-none" aria-hidden="true">
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-[#777A76] bg-[#222424] rounded border border-[rgba(226,226,218,0.13)]">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right: Operational Status & Action Button */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[rgba(126,180,154,0.12)] border border-[rgba(126,180,154,0.3)] text-xs font-mono text-[#7EB49A]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7EB49A]" />
            <span>CI: Operational</span>
          </div>

          {onNewInvestigation && (
            <button
              type="button"
              onClick={onNewInvestigation}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-[#F0EEE8] hover:bg-[#FFFFFF] text-[#0B0C0D] text-xs font-medium font-mono transition-all cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>New investigation</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

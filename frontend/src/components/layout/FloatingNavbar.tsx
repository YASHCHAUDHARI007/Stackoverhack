"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Plus,
  Menu,
  X,
  GitBranch,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingNavbarProps {
  onNewInvestigation?: () => void;
  selectedRepo?: string;
  onRepoChange?: (repo: string) => void;
}

const NAV_ITEMS = [
  {
    name: "Triage",
    href: "/dashboard",
    badge: null,
  },
  {
    name: "Investigations",
    href: "/investigations",
    badge: "Active 4",
  },
  {
    name: "Catalog",
    href: "/tests",
    badge: null,
  },
  {
    name: "Settings",
    href: "/settings",
    badge: null,
  },
];

export function FloatingNavbar({
  onNewInvestigation,
  selectedRepo = "ALL",
  onRepoChange,
}: FloatingNavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="fixed top-4 left-0 right-0 z-50 pointer-events-none px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* ============================================================ */}
        {/* 1. TOP LEFT: MINIMALIST WOBBLE WORDMARK                      */}
        {/* ============================================================ */}
        <div className="pointer-events-auto flex items-center">
          <Link
            href="/dashboard"
            className="group flex items-center space-x-2.5 px-3 py-1.5 rounded-2xl glass-surface hover:border-[rgba(235,235,228,0.28)] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F0EEE8]"
            aria-label="WOBBLE Home"
          >
            <img
              src="/logo.svg"
              alt="WOBBLE"
              className="h-8 w-auto object-contain"
            />
            <span className="text-[11px] font-mono px-1.5 py-0.5 rounded-full bg-[#222424] text-[#A8AAA5] border border-[rgba(226,226,218,0.13)]">
              v3.4
            </span>
          </Link>
        </div>

        {/* ============================================================ */}
        {/* 2. CENTER: SMOKED-GLASS FLOATING NAVIGATION                  */}
        {/* ============================================================ */}
        <nav
          aria-label="Primary Navigation"
          className="pointer-events-auto hidden md:flex items-center relative"
        >
          <div className="relative flex items-center h-11 px-5 glass-surface-nav chamfer-nav-pill">
            {/* Subtle Architectural Corner Ticks */}
            <span
              className="text-[#777A76] font-mono text-[10px] select-none pointer-events-none mr-2"
              aria-hidden="true"
            >
              [
            </span>

            {/* Navigation Tabs */}
            <div className="flex items-center space-x-1 sm:space-x-2 text-xs">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname?.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group relative flex items-center px-3 py-1.5 rounded-lg text-xs font-medium transition-all select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-[#F0EEE8]",
                      isActive
                        ? "text-[#F0EEE8] bg-[#222424] border border-[rgba(235,235,228,0.18)] shadow-sm"
                        : "text-[#A8AAA5] hover:text-[#F0EEE8] hover:bg-[#1E2021] border border-transparent"
                    )}
                  >
                    <span>{item.name}</span>

                    {/* Restrained Amber Pill Badge */}
                    {item.badge && (
                      <span className="ml-1.5 px-1.5 py-0.2 rounded text-[10px] font-mono font-medium bg-[rgba(216,173,112,0.14)] text-[#D8AD70] border border-[rgba(216,173,112,0.28)]">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            <span
              className="text-[#777A76] font-mono text-[10px] select-none pointer-events-none ml-2"
              aria-hidden="true"
            >
              ]
            </span>
          </div>
        </nav>

        {/* ============================================================ */}
        {/* 3. TOP RIGHT: SCOPE, USER PROFILE & ACTION CTA               */}
        {/* ============================================================ */}
        <div className="pointer-events-auto flex items-center space-x-2.5">
          {/* Subtle Repository Scope Selector */}
          <div className="hidden lg:flex items-center space-x-2 glass-surface px-3 py-1.5 rounded-xl text-xs font-mono">
            <GitBranch className="w-3.5 h-3.5 text-[#C5C7C1]" />
            <select
              aria-label="Repository Scope"
              value={selectedRepo}
              onChange={(e) => onRepoChange?.(e.target.value)}
              className="bg-transparent text-[#F0EEE8] font-medium focus:outline-none cursor-pointer text-xs"
            >
              <option value="ALL" className="bg-[#17191A]">
                All Repositories (5 Active)
              </option>
              <option value="mono-repo/api-core" className="bg-[#17191A]">
                mono-repo/api-core
              </option>
              <option value="billing-engine" className="bg-[#17191A]">
                billing-engine
              </option>
              <option value="auth-vault" className="bg-[#17191A]">
                auth-vault
              </option>
              <option value="data-pipeline" className="bg-[#17191A]">
                data-pipeline
              </option>
            </select>
          </div>

          {/* User Profile Pill */}
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl glass-surface">
            <div className="w-5 h-5 rounded bg-[#222424] border border-[rgba(226,226,218,0.18)] flex items-center justify-center text-[10px] font-bold text-[#F0EEE8]">
              AM
            </div>
            <span className="text-xs font-medium text-[#F0EEE8] hidden sm:inline">
              Alex Mercer
            </span>
            <span
              className="w-1.5 h-1.5 rounded-full bg-[#7EB49A] ml-0.5"
              title="CI Engine connected"
            />
          </div>

          {/* New Investigation CTA in Warm Ivory Contrast */}
          {onNewInvestigation && (
            <button
              type="button"
              onClick={onNewInvestigation}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#F0EEE8] hover:bg-[#FFFFFF] text-[#0B0C0D] text-xs font-medium transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F0EEE8] shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.4]" />
              <span className="hidden sm:inline">New investigation</span>
              <span className="sm:hidden">New</span>
            </button>
          )}

          {/* Mobile Menu Button (44x44px touch target) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl glass-surface text-[#F0EEE8] hover:bg-[#222424] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F0EEE8]"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. RESPONSIVE MOBILE DRAWER                                   */}
      {/* ============================================================ */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto md:hidden mt-3 max-w-7xl mx-auto p-4 rounded-2xl glass-surface-nav space-y-2">
          <div className="text-[11px] text-[#777A76] uppercase tracking-wider px-2 py-1 border-b border-[rgba(226,226,218,0.13)]">
            Navigation
          </div>
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-colors",
                  isActive
                    ? "text-[#F0EEE8] bg-[#222424] border border-[rgba(235,235,228,0.18)]"
                    : "text-[#A8AAA5] hover:text-[#F0EEE8] hover:bg-[#1E2021]"
                )}
              >
                <span>{item.name}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[rgba(216,173,112,0.14)] text-[#D8AD70] border border-[rgba(216,173,112,0.28)]">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-2 border-t border-[rgba(226,226,218,0.13)] flex items-center justify-between px-2 text-xs text-[#A8AAA5]">
            <span className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7EB49A]" />
              <span>CI Health: 98.4%</span>
            </span>
            <span className="font-mono text-[11px] text-[#C5C7C1]">Local Adapter</span>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Search,
  Layers,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationRailProps {
  className?: string;
  onNewInvestigation?: () => void;
}

const RAIL_ITEMS = [
  {
    name: "Triage",
    href: "/dashboard",
    icon: Activity,
    tooltip: "Test reliability & triage queue",
    badge: "38",
  },
  {
    name: "Traces",
    href: "/investigations",
    icon: Search,
    tooltip: "Investigation traces & root cause diagnosis",
    badge: "4",
  },
  {
    name: "Catalog",
    href: "/tests",
    icon: Layers,
    tooltip: "Test suite directory & empirical history",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
    tooltip: "Engine adapter & verifier configuration",
  },
];

export function NavigationRail({ className }: NavigationRailProps) {
  const pathname = usePathname();

  return (
    <aside
      aria-label="Navigation Rail"
      className={cn(
        "fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center py-3.5 px-2 rounded-2xl glass-surface",
        className
      )}
    >
      {/* Top Header Mark */}
      <div className="mb-2 flex flex-col items-center">
        <Link
          href="/dashboard"
          className="w-7 h-7 rounded-lg bg-[#222424] border border-[rgba(226,226,218,0.18)] flex items-center justify-center overflow-hidden hover:border-[rgba(235,235,228,0.3)] transition-all cursor-pointer"
          title="WOBBLE Home"
        >
          <img
            src="/logo.svg"
            alt="WOBBLE"
            className="w-14 h-7 max-w-none object-cover object-left"
          />
        </Link>
      </div>

      <div className="w-5 h-[1px] bg-[rgba(226,226,218,0.13)] my-2" />

      {/* Vertical Navigation Items */}
      <nav className="flex flex-col items-center space-y-2">
        {RAIL_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname?.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.tooltip}
              aria-label={item.name}
              className={cn(
                "group relative flex flex-col items-center justify-center w-11 h-13 rounded-xl transition-all duration-150 cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#F0EEE8]",
                isActive
                  ? "bg-[#222424] text-[#F0EEE8] border border-[rgba(235,235,228,0.22)] shadow-sm"
                  : "text-[#A8AAA5] hover:text-[#F0EEE8] hover:bg-[#1E2021] border border-transparent"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 transition-transform duration-150",
                  isActive ? "text-[#F0EEE8]" : "text-[#A8AAA5] group-hover:text-[#F0EEE8]"
                )}
              />

              <span
                className={cn(
                  "text-[10px] tracking-tight mt-1 font-medium select-none",
                  isActive ? "text-[#F0EEE8]" : "text-[#777A76] group-hover:text-[#A8AAA5]"
                )}
              >
                {item.name}
              </span>

              {item.badge && (
                <span
                  className={cn(
                    "absolute -top-1 -right-1 text-[9px] font-mono px-1 rounded-full border",
                    isActive
                      ? "bg-[#2E3131] text-[#F0EEE8] border-[rgba(235,235,228,0.28)]"
                      : "bg-[#1E2021] text-[#A8AAA5] border-[rgba(226,226,218,0.15)]"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="w-5 h-[1px] bg-[rgba(226,226,218,0.13)] my-2" />

      {/* Bottom Status / Verifier Pip */}
      <div className="mt-0.5 flex flex-col items-center">
        <Link
          href="/settings"
          title="Empirical Verifier: Connected"
          className="w-7 h-7 rounded-lg bg-[#222424] border border-[rgba(126,180,154,0.35)] flex items-center justify-center text-[#7EB49A] hover:border-[#7EB49A] transition-colors"
          aria-label="Empirical Verifier Status"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
        </Link>
      </div>
    </aside>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Search,
  Layers,
  Settings,
  GitBranch,
  ShieldCheck,
  X,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNewInvestigation?: () => void;
  selectedRepo?: string;
  onRepoChange?: (repo: string) => void;
}

const NAV_ITEMS = [
  {
    name: "Triage",
    href: "/dashboard",
    icon: Activity,
    badge: "38 flakes",
    badgeType: "warning",
  },
  {
    name: "Investigations",
    href: "/investigations",
    icon: Search,
    badge: "4 active",
    badgeType: "neutral",
  },
  {
    name: "Catalog",
    href: "/tests",
    icon: Layers,
    badge: "8 tests",
    badgeType: "neutral",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar Element */}
      <aside
        aria-label="Application sidebar"
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#17191A] border-r border-[rgba(226,226,218,0.13)] flex flex-col justify-between transition-transform duration-250 ease-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Top Header / Branding */}
        <div>
          <div className="h-16 px-5 flex items-center justify-between border-b border-[rgba(226,226,218,0.13)] bg-[#17191A]">
            <Link
              href="/dashboard"
              onClick={onClose}
              className="flex items-center space-x-2 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C5C7C1] rounded"
            >
              <img
                src="/logo.svg"
                alt="WOBBLE"
                className="h-8 w-auto object-contain"
              />
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-[#222424] text-[#A8AAA5] border border-[rgba(226,226,218,0.13)]">
                v3.4
              </span>
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-[#A8AAA5] hover:text-[#F0EEE8] hover:bg-[#222424] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C5C7C1]"
              aria-label="Close navigation sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1" aria-label="Main navigation links">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard" || pathname === "/"
                  : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C5C7C1]",
                    isActive
                      ? "text-[#F0EEE8] bg-[#222424] border border-[rgba(235,235,228,0.16)] shadow-sm"
                      : "text-[#A8AAA5] hover:text-[#F0EEE8] hover:bg-[#222424]/40 border border-transparent"
                  )}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon
                      className={cn(
                        "w-4 h-4 transition-colors",
                        isActive
                          ? "text-[#F0EEE8]"
                          : "text-[#777A76] group-hover:text-[#F0EEE8]"
                      )}
                    />
                    <span>{item.name}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={cn(
                        "text-[10px] font-mono px-2 py-0.5 rounded-full border",
                        item.badgeType === "warning" &&
                          "bg-[rgba(216,173,112,0.12)] text-[#D8AD70] border-[rgba(216,173,112,0.25)]",
                        item.badgeType === "neutral" &&
                          "bg-[#222424] text-[#A8AAA5] border-[rgba(226,226,218,0.13)]"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer / User Profile */}
        <div className="p-4 border-t border-[rgba(226,226,218,0.13)]">
          <div className="flex items-center space-x-2.5 px-2 py-1.5 rounded-xl hover:bg-[#222424]/40 transition-colors">
            <div className="w-7 h-7 rounded-full bg-[#222424] border border-[rgba(235,235,228,0.16)] flex items-center justify-center text-[#F0EEE8] text-xs font-semibold">
              YC
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-[#F0EEE8] truncate">
                Yash Chaudhari
              </div>
              <div className="text-[10px] text-[#777A76] font-mono truncate">
                Platform Lead
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

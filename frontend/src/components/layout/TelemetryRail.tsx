"use client";

import React from "react";
import Link from "next/link";
import {
  Activity,
  Terminal,
  HelpCircle,
  Radio,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TelemetryRailProps {
  className?: string;
}

export function TelemetryRail({ className }: TelemetryRailProps) {
  return (
    <aside
      aria-label="CI Telemetry & Diagnostics Dock"
      className={cn(
        "fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center py-3.5 px-2 rounded-2xl glass-surface",
        className
      )}
    >
      {/* Live CI Stream Signal Indicator */}
      <div
        className="group relative flex flex-col items-center p-1.5 rounded-xl bg-[#222424] border border-[rgba(126,180,154,0.35)] text-[#7EB49A] mb-2 cursor-default"
        title="CI Stream: 98.4% Health Score"
      >
        <Radio className="w-4 h-4 text-[#7EB49A]" />
        <span className="text-[9px] font-mono mt-1 font-semibold text-[#7EB49A]">
          98%
        </span>
      </div>

      <div className="w-5 h-[1px] bg-[rgba(226,226,218,0.13)] my-2" />

      {/* Quick Diagnostics Utilities */}
      <div className="flex flex-col items-center space-y-2 text-xs">
        {/* Terminal / CLI Settings */}
        <Link
          href="/settings"
          title="CLI Engine Configuration"
          aria-label="Engine Settings"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-[#A8AAA5] hover:text-[#F0EEE8] hover:bg-[#222424] transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-[#F0EEE8]"
        >
          <Terminal className="w-4 h-4" />
        </Link>

        {/* Global Filter / Tuning */}
        <Link
          href="/dashboard"
          title="Triage Overview"
          aria-label="Triage Overview"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-[#A8AAA5] hover:text-[#F0EEE8] hover:bg-[#222424] transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-[#F0EEE8]"
        >
          <Activity className="w-4 h-4" />
        </Link>

        {/* Quick Search Shortcut Badge */}
        <div
          title="Keyboard Shortcut: ⌘K to Search"
          className="w-8 h-7 rounded-lg bg-[#222424] border border-[rgba(226,226,218,0.13)] flex items-center justify-center text-[10px] text-[#A8AAA5] font-mono select-none"
        >
          ⌘K
        </div>

        {/* GitHub Source Link */}
        <a
          href="https://github.com/YASHCHAUDHARI007/Stackoverhack"
          target="_blank"
          rel="noopener noreferrer"
          title="Stackoverhack GitHub Repository"
          aria-label="View on GitHub"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-[#A8AAA5] hover:text-[#F0EEE8] hover:bg-[#222424] transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-[#F0EEE8]"
        >
          <svg
            className="w-4 h-4 fill-current"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            />
          </svg>
        </a>

        {/* Documentation / Help */}
        <Link
          href="/settings"
          title="Documentation & Settings"
          aria-label="Documentation"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-[#A8AAA5] hover:text-[#F0EEE8] hover:bg-[#222424] transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-[#F0EEE8]"
        >
          <HelpCircle className="w-4 h-4" />
        </Link>
      </div>

      <div className="w-5 h-[1px] bg-[rgba(226,226,218,0.13)] my-2" />

      {/* Engine Status Text */}
      <div className="text-[9px] font-mono uppercase text-[#777A76] tracking-wider text-center">
        Live
      </div>
    </aside>
  );
}

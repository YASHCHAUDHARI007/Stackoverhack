"use client";

import React from "react";
import Link from "next/link";
import { Zap, ShieldCheck, Minimize2, Cpu, RefreshCw, ArrowUpRight } from "lucide-react";
import { TelemetryEvent } from "@/types";
import { formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ActivityFeedProps {
  events: TelemetryEvent[];
  className?: string;
}

export function ActivityFeed({ events, className }: ActivityFeedProps) {
  return (
    <div
      className={cn(
        "surface-solid rounded-2xl p-5 sm:p-6 shadow-2xl overflow-hidden",
        className
      )}
    >
      <div className="flex items-center justify-between pb-3.5 border-b border-[rgba(226,226,218,0.13)] mb-4">
        <div>
          <div className="text-[11px] font-mono text-[#777A76] tracking-wider uppercase font-medium">
            Telemetry stream
          </div>
          <h3 className="text-base font-semibold text-[#F0EEE8] tracking-tight mt-0.5">
            Recent diagnostic activity
          </h3>
          <p className="text-xs text-[#A8AAA5] mt-0.5">
            Automated reproductions, delta-debug reductions, and empirical verifications
          </p>
        </div>
        <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#222424] text-[#A8AAA5] border border-[rgba(226,226,218,0.13)] flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7EB49A]" />
          <span>Active</span>
        </span>
      </div>

      <div className="space-y-3 font-mono text-xs">
        {events.slice(0, 4).map((ev) => {
          let icon = <Zap className="w-3.5 h-3.5 text-[#777A76]" />;
          let tagColor = "bg-[#222424] text-[#A8AAA5] border-[rgba(226,226,218,0.13)]";

          if (ev.type === "VERIFICATION") {
            icon = <ShieldCheck className="w-3.5 h-3.5 text-[#7EB49A]" />;
            tagColor = "bg-[rgba(126,180,154,0.12)] text-[#7EB49A] border-[rgba(126,180,154,0.25)]";
          } else if (ev.type === "MINIMIZATION") {
            icon = <Minimize2 className="w-3.5 h-3.5 text-[#A8AAA5]" />;
            tagColor = "bg-[#222424] text-[#A8AAA5] border-[rgba(226,226,218,0.13)]";
          } else if (ev.type === "DIAGNOSIS") {
            icon = <Cpu className="w-3.5 h-3.5 text-[#F0EEE8]" />;
            tagColor = "bg-[#222424] text-[#F0EEE8] border-[rgba(235,235,228,0.16)]";
          } else if (ev.type === "REPRODUCTION") {
            icon = <RefreshCw className="w-3.5 h-3.5 text-[#D8AD70]" />;
            tagColor = "bg-[rgba(216,173,112,0.12)] text-[#D8AD70] border-[rgba(216,173,112,0.25)]";
          }

          return (
            <div
              key={ev.id}
              className="p-3.5 rounded-xl bg-[#17191A] border border-[rgba(226,226,218,0.13)] flex items-start space-x-3.5 hover:bg-[#222424]/50 transition-all group"
            >
              <div className="p-2 rounded-lg bg-[#222424] border border-[rgba(226,226,218,0.13)] shrink-0 mt-0.5">
                {icon}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {ev.investigationId ? (
                      <Link
                        href={`/investigations/${ev.investigationId}`}
                        className="text-[#F0EEE8] hover:text-[#C5C7C1] font-bold flex items-center space-x-1"
                      >
                        <span>{ev.investigationId}</span>
                        <ArrowUpRight className="w-3 h-3 text-[#777A76] group-hover:text-[#F0EEE8] transition-colors" />
                      </Link>
                    ) : (
                      <span className="text-[#A8AAA5] font-bold">{ev.type}</span>
                    )}

                    {ev.tag && (
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-medium border font-mono",
                          tagColor
                        )}
                      >
                        {ev.tag}
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] text-[#777A76]">
                    {formatRelativeTime(ev.timestamp)}
                  </span>
                </div>

                <p className="text-[#A8AAA5] text-xs font-sans leading-normal">
                  {ev.message}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import React from "react";
import {
  ShieldCheck,
  CheckCircle2,
  FileCode,
} from "lucide-react";
import { RootCauseHypothesis } from "@/types";
import { cn } from "@/lib/utils";

interface RootCauseCardProps {
  hypothesis: RootCauseHypothesis;
  className?: string;
}

export function RootCauseCard({ hypothesis, className }: RootCauseCardProps) {
  return (
    <div className={cn("surface-solid rounded-2xl p-5 sm:p-6 shadow-2xl", className)}>
      {/* Header with Distinction Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-[rgba(226,226,218,0.13)] gap-3">
        <div>
          <h3 className="text-base font-semibold text-[#F0EEE8] tracking-tight">
            Root-cause diagnostic analysis
          </h3>
          <p className="text-xs text-[#A8AAA5] mt-0.5">
            Automated empirical failure hypothesis and proof points
          </p>
        </div>

        {/* AI Hypothesis vs Confirmed Empirical Finding Pill */}
        <div className="flex items-center space-x-2">
          {hypothesis.isConfirmed ? (
            <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[rgba(126,180,154,0.12)] border border-[rgba(126,180,154,0.3)] text-[#7EB49A] text-xs font-mono font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#7EB49A]" />
              <span>Confirmed finding</span>
            </span>
          ) : (
            <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#222424] border border-[rgba(226,226,218,0.13)] text-[#A8AAA5] text-xs font-mono">
              <span>Hypothesis (unverified)</span>
            </span>
          )}
        </div>
      </div>

      {/* Suspected Cause Title & Confidence Gauge */}
      <div className="my-4 p-4 rounded-xl bg-[#17191A] border border-[rgba(226,226,218,0.13)] space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#777A76] font-medium">
              Primary identified mechanism
            </span>
            <h4 className="text-base font-semibold text-[#F0EEE8] mt-0.5">
              {hypothesis.title}
            </h4>
          </div>

          <div className="flex items-center space-x-3 bg-[#222424] px-3.5 py-1.5 rounded-xl border border-[rgba(226,226,218,0.13)] shrink-0 font-mono">
            <div>
              <div className="text-[10px] text-[#777A76] uppercase">Confidence</div>
              <div className="text-sm font-semibold text-[#F0EEE8]">
                {hypothesis.confidence}%
              </div>
            </div>
            <div className="w-14 bg-[#0B0C0D] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#F0EEE8] h-full rounded-full"
                style={{ width: `${hypothesis.confidence}%` }}
              />
            </div>
          </div>
        </div>

        <p className="text-xs text-[#A8AAA5] font-sans leading-relaxed">
          {hypothesis.description}
        </p>
      </div>

      {/* Supporting Evidence Points */}
      <div className="space-y-3">
        <h5 className="text-[11px] font-mono uppercase tracking-wider text-[#777A76] font-medium">
          Supporting empirical evidence ({hypothesis.evidencePoints.length})
        </h5>
        <div className="space-y-2.5">
          {hypothesis.evidencePoints.map((ev) => (
            <div
              key={ev.id}
              className="p-3.5 rounded-xl bg-[#17191A] border border-[rgba(226,226,218,0.13)] space-y-2 font-mono text-xs"
            >
              <div className="flex items-center justify-between text-[#F0EEE8]">
                <span className="font-semibold text-xs text-[#F0EEE8]">{ev.label}</span>
                {ev.file && (
                  <span className="text-[#777A76] text-[11px]">
                    {ev.file}{ev.line ? `:${ev.line}` : ""}
                  </span>
                )}
              </div>
              <p className="text-[#A8AAA5] text-xs font-sans leading-normal">
                {ev.detail}
              </p>

              {ev.snippet && (
                <div className="mt-2.5 p-3 rounded-xl bg-[#0B0C0D] border border-[rgba(226,226,218,0.13)] text-[11px] font-mono text-[#F0EEE8] overflow-x-auto leading-relaxed">
                  <pre
                    data-lenis-prevent
                    className="text-xs text-[#F0EEE8]"
                  >
                    {ev.snippet}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Fix */}
      <div className="mt-4 p-4 rounded-xl bg-[rgba(126,180,154,0.08)] border border-[rgba(126,180,154,0.25)]">
        <div className="flex items-center space-x-1.5 text-[#7EB49A] text-xs font-mono font-medium mb-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#7EB49A]" />
          <span>Recommended remediation</span>
        </div>
        <p className="text-xs text-[#F0EEE8] leading-relaxed font-sans">
          {hypothesis.recommendedFix}
        </p>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { ExecutionRun } from "@/types";
import {
  AlertTriangle,
  Terminal,
  Hash,
  Copy,
  Check,
} from "lucide-react";
import { cn, formatDuration, formatTimestamp } from "@/lib/utils";

interface ExecutionTimelineProps {
  runs: ExecutionRun[];
  className?: string;
}

export function ExecutionTimeline({ runs, className }: ExecutionTimelineProps) {
  const [filter, setFilter] = useState<"ALL" | "FAILURES" | "PASSES">("ALL");
  const [copiedSeed, setCopiedSeed] = useState(false);
  const [selectedRun, setSelectedRun] = useState<ExecutionRun | null>(
    runs.find((r) => r.status === "FAILED" || r.status === "TIMEOUT") || runs[0] || null
  );

  const filteredRuns = runs.filter((r) => {
    if (filter === "FAILURES") return r.status === "FAILED" || r.status === "TIMEOUT";
    if (filter === "PASSES") return r.status === "PASSED";
    return true;
  });

  const passCount = runs.filter((r) => r.status === "PASSED").length;
  const failCount = runs.filter((r) => r.status === "FAILED").length;
  const timeoutCount = runs.filter((r) => r.status === "TIMEOUT").length;
  const flakinessRate = ((failCount + timeoutCount) / (runs.length || 1)) * 100;

  const handleCopySeed = (seed: string) => {
    navigator.clipboard.writeText(seed);
    setCopiedSeed(true);
    setTimeout(() => setCopiedSeed(false), 2000);
  };

  return (
    <div className={cn("surface-solid rounded-2xl p-5 sm:p-6 shadow-2xl", className)}>
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-[rgba(226,226,218,0.13)] gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-semibold text-[#F0EEE8] tracking-tight">
              Execution attempt matrix
            </h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#222424] text-[#A8AAA5] border border-[rgba(226,226,218,0.13)]">
              {runs.length} iterations
            </span>
          </div>
          <p className="text-xs text-[#A8AAA5] mt-0.5">
            Interleaved execution outcomes across randomized seeds and worker threads
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 font-mono text-xs">
          <button
            type="button"
            onClick={() => setFilter("ALL")}
            className={cn(
              "px-3 py-1 rounded-xl transition-all cursor-pointer",
              filter === "ALL"
                ? "bg-[#222424] text-[#F0EEE8] border border-[rgba(235,235,228,0.22)] font-medium"
                : "text-[#A8AAA5] hover:text-[#F0EEE8] border border-transparent"
            )}
          >
            All ({runs.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("FAILURES")}
            className={cn(
              "px-3 py-1 rounded-xl transition-all cursor-pointer",
              filter === "FAILURES"
                ? "bg-[rgba(228,119,119,0.12)] text-[#E47777] border border-[rgba(228,119,119,0.3)] font-medium"
                : "text-[#A8AAA5] hover:text-[#F0EEE8] border border-transparent"
            )}
          >
            Failures ({failCount + timeoutCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter("PASSES")}
            className={cn(
              "px-3 py-1 rounded-xl transition-all cursor-pointer",
              filter === "PASSES"
                ? "bg-[rgba(126,180,154,0.12)] text-[#7EB49A] border border-[rgba(126,180,154,0.3)] font-medium"
                : "text-[#A8AAA5] hover:text-[#F0EEE8] border border-transparent"
            )}
          >
            Passes ({passCount})
          </button>
        </div>
      </div>

      {/* Stats Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 py-3.5 px-4 rounded-xl bg-[#17191A] border border-[rgba(226,226,218,0.13)] font-mono text-xs">
        <div>
          <span className="text-[#777A76] text-[10px] uppercase font-medium">Empirical flakiness</span>
          <div className="text-sm font-semibold text-[#E47777] mt-0.5">
            {flakinessRate.toFixed(1)}%
          </div>
        </div>
        <div>
          <span className="text-[#777A76] text-[10px] uppercase font-medium">Clean passes</span>
          <div className="text-sm font-semibold text-[#7EB49A] mt-0.5">
            {passCount} / {runs.length}
          </div>
        </div>
        <div>
          <span className="text-[#777A76] text-[10px] uppercase font-medium">Panics &amp; races</span>
          <div className="text-sm font-semibold text-[#E47777] mt-0.5">
            {failCount} runs
          </div>
        </div>
        <div>
          <span className="text-[#777A76] text-[10px] uppercase font-medium">Timeouts</span>
          <div className="text-sm font-semibold text-[#D8AD70] mt-0.5">
            {timeoutCount} runs
          </div>
        </div>
      </div>

      {/* 50-Run Interactive Matrix Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono text-[#777A76]">
          <span>Click any run node to inspect seed conditions and panic trace:</span>
          <div className="flex items-center space-x-3 text-[10px]">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-[#7EB49A]" />
              <span>Pass</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-[#E47777]" />
              <span>Fail</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-[#D8AD70]" />
              <span>Timeout</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-10 sm:grid-cols-25 gap-1.5 p-3 rounded-xl bg-[#17191A] border border-[rgba(226,226,218,0.10)]">
          {filteredRuns.map((r) => {
            const isSelected = selectedRun?.id === r.id;
            const isPass = r.status === "PASSED";
            const isTimeout = r.status === "TIMEOUT";

            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedRun(r)}
                aria-label={`Run #${r.runIndex}: ${r.status}, Seed ${r.seed}, Duration ${r.durationMs} milliseconds`}
                aria-pressed={isSelected}
                title={`Run #${r.runIndex} (${r.status}) - Seed: ${r.seed} - ${r.durationMs}ms`}
                className={cn(
                  "relative aspect-square rounded-lg flex items-center justify-center font-mono text-[10px] font-medium transition-all cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C5C7C1]",
                  isPass &&
                    "bg-[rgba(126,180,154,0.12)] text-[#7EB49A] hover:bg-[rgba(126,180,154,0.22)] border border-[rgba(126,180,154,0.25)]",
                  !isPass &&
                    !isTimeout &&
                    "bg-[rgba(228,119,119,0.12)] text-[#E47777] hover:bg-[rgba(228,119,119,0.22)] border border-[rgba(228,119,119,0.25)]",
                  isTimeout &&
                    "bg-[rgba(216,173,112,0.12)] text-[#D8AD70] hover:bg-[rgba(216,173,112,0.22)] border border-[rgba(216,173,112,0.25)]",
                  isSelected &&
                    "ring-2 ring-[#F0EEE8] border-[#F0EEE8] font-bold z-10 scale-105 shadow-md"
                )}
              >
                {r.runIndex}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Run Deep Inspector Drawer */}
      {selectedRun && (
        <div className="mt-4 p-4 rounded-xl bg-[#17191A] border border-[rgba(226,226,218,0.13)] shadow-inner">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[rgba(226,226,218,0.10)] gap-2">
            <div className="flex items-center space-x-2">
              <span
                className={cn(
                  "px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium uppercase",
                  selectedRun.status === "PASSED"
                    ? "bg-[rgba(126,180,154,0.15)] text-[#7EB49A] border border-[rgba(126,180,154,0.3)]"
                    : selectedRun.status === "TIMEOUT"
                    ? "bg-[rgba(216,173,112,0.15)] text-[#D8AD70] border border-[rgba(216,173,112,0.3)]"
                    : "bg-[rgba(228,119,119,0.15)] text-[#E47777] border border-[rgba(228,119,119,0.3)]"
                )}
              >
                Run #{selectedRun.runIndex} &mdash; {selectedRun.status}
              </span>
              <span className="text-xs font-mono text-[#A8AAA5]">
                Duration: {formatDuration(selectedRun.durationMs)}
              </span>
            </div>

            <span className="text-[11px] font-mono text-[#777A76]">
              {formatTimestamp(selectedRun.timestamp)}
            </span>
          </div>

          {/* Telemetry metadata grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-[#222424] border border-[rgba(226,226,218,0.13)] flex items-center justify-between">
              <div>
                <span className="text-[#777A76] text-[10px] block">Random seed</span>
                <span className="text-[#F0EEE8] font-semibold text-xs">
                  {selectedRun.seed}
                </span>
              </div>
              <button
                onClick={() => handleCopySeed(selectedRun.seed)}
                className="p-1 rounded hover:bg-[#17191A] text-[#777A76] hover:text-[#F0EEE8] transition-colors cursor-pointer"
                title="Copy reproduction seed"
              >
                {copiedSeed ? <Check className="w-3.5 h-3.5 text-[#7EB49A]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="p-3 rounded-xl bg-[#222424] border border-[rgba(226,226,218,0.13)]">
              <span className="text-[#777A76] text-[10px] block">Worker thread</span>
              <span className="text-[#F0EEE8] font-medium">{selectedRun.workerId}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#222424] border border-[rgba(226,226,218,0.13)]">
              <span className="text-[#777A76] text-[10px] block">Execution order</span>
              <span className="text-[#F0EEE8] font-medium">Seq #{selectedRun.orderIndex}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#222424] border border-[rgba(226,226,218,0.13)]">
              <span className="text-[#777A76] text-[10px] block">CPU jitter / mem</span>
              <span className="text-[#F0EEE8] font-medium">
                {Math.round(selectedRun.cpuThrottle * 100)}% throttle / {selectedRun.memoryMb}MB
              </span>
            </div>
          </div>

          {/* Captured stdout/stderr snippet */}
          {selectedRun.stderrSnippet && (
            <div className="mt-3">
              <div className="text-[10px] font-mono uppercase text-[#E47777] mb-1.5 flex items-center space-x-1.5 font-medium">
                <AlertTriangle className="w-3.5 h-3.5 text-[#E47777]" />
                <span>Panic / TSAN data race trace</span>
              </div>
              <pre
                data-lenis-prevent
                className="p-3 rounded-xl bg-[rgba(228,119,119,0.06)] border border-[rgba(228,119,119,0.2)] font-mono text-[11px] text-[#E47777] overflow-x-auto leading-relaxed max-h-48"
              >
                {selectedRun.stderrSnippet}
              </pre>
            </div>
          )}

          {selectedRun.stdoutSnippet && (
            <div className="mt-3">
              <div className="text-[10px] font-mono uppercase text-[#777A76] mb-1.5 flex items-center space-x-1.5 font-medium">
                <Terminal className="w-3.5 h-3.5 text-[#777A76]" />
                <span>Standard output</span>
              </div>
              <pre
                data-lenis-prevent
                className="p-3 rounded-xl bg-[#0B0C0D] border border-[rgba(226,226,218,0.13)] font-mono text-[11px] text-[#F0EEE8] overflow-x-auto leading-relaxed max-h-36"
              >
                {selectedRun.stdoutSnippet}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

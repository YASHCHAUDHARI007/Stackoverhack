import React from "react";
import { Minimize2, Trash2, Hash } from "lucide-react";
import { MinimizationResult } from "@/types";
import { cn } from "@/lib/utils";

interface MinimizationDiffProps {
  minimization: MinimizationResult;
  className?: string;
}

export function MinimizationDiff({
  minimization,
  className,
}: MinimizationDiffProps) {
  return (
    <div className={cn("surface-solid rounded-2xl p-5 sm:p-6 shadow-2xl", className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-[rgba(226,226,218,0.13)] gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Minimize2 className="w-4 h-4 text-[#A8AAA5]" />
            <h3 className="text-base font-semibold text-[#F0EEE8] tracking-tight">
              Delta-debugging failure minimization
            </h3>
          </div>
          <p className="text-xs text-[#A8AAA5] mt-0.5">
            Automated binary reduction isolating minimal sequence triggering non-determinism
          </p>
        </div>

        {/* Reduction Percentage Pill */}
        <div className="flex items-center space-x-2 font-mono">
          <span className="px-3 py-1 rounded-full bg-[rgba(126,180,154,0.12)] border border-[rgba(126,180,154,0.3)] text-[#7EB49A] text-xs font-semibold">
            -{minimization.reductionPercentage.toFixed(1)}% complexity reduced
          </span>
        </div>
      </div>

      {/* Metric Counters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 p-3.5 rounded-xl bg-[#17191A] border border-[rgba(226,226,218,0.13)] font-mono text-xs">
        <div>
          <span className="text-[#777A76] text-[10px] uppercase tracking-wider font-medium">Original harness</span>
          <div className="text-sm font-semibold text-[#F0EEE8] mt-0.5">
            {minimization.originalStepsCount} fixture steps
          </div>
        </div>
        <div>
          <span className="text-[#777A76] text-[10px] uppercase tracking-wider font-medium">Minimal reproducer</span>
          <div className="text-sm font-semibold text-[#D8AD70] mt-0.5">
            {minimization.minimizedStepsCount} critical steps
          </div>
        </div>
        <div>
          <span className="text-[#777A76] text-[10px] uppercase tracking-wider font-medium">Reproduction seed</span>
          <div className="text-sm font-semibold text-[#F0EEE8] mt-0.5 flex items-center space-x-1">
            <Hash className="w-3.5 h-3.5 text-[#777A76]" />
            <span className="text-[#F0EEE8]">{minimization.reproductionSeed}</span>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 my-4">
        {/* Original Sequence */}
        <div className="p-4 rounded-xl bg-[#17191A] border border-[rgba(226,226,218,0.13)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[rgba(226,226,218,0.13)] mb-3">
              <span className="text-xs font-mono text-[#A8AAA5] font-medium">
                Original test fixture ({minimization.originalSequence.length} steps)
              </span>
              <span className="text-[11px] font-mono text-[#777A76]">Full suite</span>
            </div>
            <ul
              data-lenis-prevent
              className="space-y-1.5 font-mono text-xs text-[#A8AAA5] max-h-56 overflow-y-auto pr-1"
            >
              {minimization.originalSequence.map((step, idx) => (
                <li
                  key={idx}
                  className="py-1 px-2.5 rounded-lg bg-[#222424] border border-[rgba(226,226,218,0.10)] text-[11px] leading-relaxed truncate text-[#A8AAA5]"
                >
                  {step}
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-3 text-[11px] font-mono text-[#777A76] pt-2 border-t border-[rgba(226,226,218,0.10)]">
            16 steps proven non-causal by delta-debugging algorithm.
          </p>
        </div>

        {/* Minimized Sequence */}
        <div className="p-4 rounded-xl bg-[#17191A] border border-[rgba(216,173,112,0.3)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-[rgba(216,173,112,0.2)] mb-3">
              <span className="text-xs font-mono text-[#D8AD70] font-semibold">
                Isolated minimal reproductive sequence
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[rgba(216,173,112,0.12)] text-[#D8AD70] border border-[rgba(216,173,112,0.3)]">
                100% repro
              </span>
            </div>
            <ul className="space-y-1.5 font-mono text-xs text-[#F0EEE8]">
              {minimization.minimizedSequence.map((step, idx) => (
                <li
                  key={idx}
                  className="py-2 px-3 rounded-lg bg-[#222424] border border-[rgba(216,173,112,0.3)] text-xs font-medium leading-relaxed flex items-start space-x-2"
                >
                  <span className="text-[#D8AD70] font-bold shrink-0">&gt;</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-3 p-3 rounded-lg bg-[#222424] border border-[rgba(226,226,218,0.13)] text-[11px] font-mono text-[#A8AAA5]">
            <span className="text-[#D8AD70] font-medium block mb-0.5">
              Deterministic reproduction guarantee:
            </span>
            Running this 2-step sequence with seed{" "}
            <code className="text-[#F0EEE8] bg-[#0B0C0D] border border-[rgba(226,226,218,0.13)] px-1.5 py-0.5 rounded">
              {minimization.reproductionSeed}
            </code>{" "}
            triggers the panic in &lt;12ms without spinning up external containers.
          </div>
        </div>
      </div>

      {/* Eliminated Steps Breakdown */}
      {minimization.eliminatedSteps.length > 0 && (
        <div className="mt-4 pt-3.5 border-t border-[rgba(226,226,218,0.13)] space-y-2">
          <span className="text-xs font-mono text-[#777A76] block font-medium">
            Pruned redundant fixtures ({minimization.eliminatedSteps.length})
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
            {minimization.eliminatedSteps.map((elim, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-[#17191A] border border-[rgba(226,226,218,0.10)] flex items-start space-x-2"
              >
                <Trash2 className="w-3.5 h-3.5 text-[#777A76] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#F0EEE8] font-medium block">
                    {elim.step}
                  </span>
                  <span className="text-[#777A76] text-[10px]">
                    Reason: {elim.reason}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Play,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Flame,
} from "lucide-react";
import { VerificationResult } from "@/types";
import { cn } from "@/lib/utils";

interface FixVerificationCardProps {
  investigationId: string;
  verification: VerificationResult;
  onRunVerification: (runsCount: number) => Promise<void>;
  className?: string;
}

export function FixVerificationCard({
  investigationId,
  verification,
  onRunVerification,
  className,
}: FixVerificationCardProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [selectedBatchSize, setSelectedBatchSize] = useState(20);

  const progressPercent = Math.min(
    100,
    Math.round((verification.totalRuns / (verification.targetThreshold || 50)) * 100)
  );

  const handleTrigger = async () => {
    try {
      setIsRunning(true);
      await onRunVerification(selectedBatchSize);
      setIsRunning(false);
    } catch {
      setIsRunning(false);
    }
  };

  return (
    <div className={cn("surface-solid rounded-2xl p-5 sm:p-6 shadow-2xl", className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-[rgba(226,226,218,0.13)] gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-[#7EB49A]" />
            <h3 className="text-base font-semibold text-[#F0EEE8] tracking-tight">
              Fix empirical verification suite
            </h3>
          </div>
          <p className="text-xs text-[#A8AAA5] mt-0.5">
            Statistical stress validation under scheduler jitter and clock skew perturbations
          </p>
        </div>

        {/* Verification Status Pill */}
        <div className="flex items-center space-x-2">
          {verification.isVerified ? (
            <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[rgba(126,180,154,0.12)] border border-[rgba(126,180,154,0.3)] text-[#7EB49A] text-xs font-mono font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#7EB49A]" />
              <span>Fix verified (100% clean)</span>
            </span>
          ) : (
            <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[rgba(216,173,112,0.12)] border border-[rgba(216,173,112,0.3)] text-[#D8AD70] text-xs font-mono">
              <AlertTriangle className="w-3.5 h-3.5 text-[#D8AD70]" />
              <span>Unverified ({verification.totalRuns}/{verification.targetThreshold} runs)</span>
            </span>
          )}
        </div>
      </div>

      {/* Progress towards verification threshold */}
      <div className="my-4 p-4 rounded-xl bg-[#17191A] border border-[rgba(226,226,218,0.13)] space-y-2.5 font-mono">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#777A76] uppercase tracking-wider text-[11px] font-medium">
            Target verification iterations
          </span>
          <span className="text-[#F0EEE8] font-medium">
            {verification.passedRuns} / {verification.targetThreshold} clean runs
          </span>
        </div>

        <div
          role="progressbar"
          aria-valuenow={verification.passedRuns}
          aria-valuemin={0}
          aria-valuemax={verification.targetThreshold}
          aria-label="Target verification iterations progress"
          className="h-2 w-full rounded-full bg-[#0B0C0D] overflow-hidden border border-[rgba(226,226,218,0.13)]"
        >
          <div
            className={cn(
              "h-full rounded-full transition-all duration-300",
              verification.isVerified ? "bg-[#7EB49A]" : "bg-[#D8AD70]"
            )}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#777A76]">
          <span>0 runs</span>
          <span className="text-[#A8AAA5]">{progressPercent}% confidence threshold (p &lt; 0.001)</span>
          <span>{verification.targetThreshold} runs</span>
        </div>
      </div>

      {/* Perturbation Parameters Under Test */}
      <div className="space-y-2 mb-4">
        <div className="text-[11px] font-mono text-[#777A76] uppercase tracking-wider flex items-center space-x-1.5 font-medium">
          <Flame className="w-3.5 h-3.5 text-[#D8AD70]" />
          <span>Active stress perturbations</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
          <div className="p-3 rounded-xl bg-[#17191A] border border-[rgba(226,226,218,0.10)]">
            <span className="text-[#777A76] text-[10px] block">Thread jitter</span>
            <span className={verification.perturbationParams.threadJitter ? "text-[#7EB49A] font-medium" : "text-[#777A76]"}>
              {verification.perturbationParams.threadJitter ? "Active (±25ms)" : "Off"}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#17191A] border border-[rgba(226,226,218,0.10)]">
            <span className="text-[#777A76] text-[10px] block">Clock drift</span>
            <span className="text-[#F0EEE8] font-medium">
              &plusmn;{verification.perturbationParams.clockSkewMs}ms
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#17191A] border border-[rgba(226,226,218,0.10)]">
            <span className="text-[#777A76] text-[10px] block">CPU quota</span>
            <span className="text-[#F0EEE8] font-medium">
              {verification.perturbationParams.cpuThrottlePercent}% quota
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#17191A] border border-[rgba(226,226,218,0.10)]">
            <span className="text-[#777A76] text-[10px] block">Memory spikes</span>
            <span className="text-[#F0EEE8] font-medium">
              {verification.perturbationParams.memoryPressureMb}MB spike
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Trigger Button Strip */}
      <div className="pt-3.5 border-t border-[rgba(226,226,218,0.13)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div role="group" aria-label="Batch size" className="flex items-center space-x-2 text-xs font-mono text-[#A8AAA5]">
          <span>Batch:</span>
          {[10, 20, 50].map((count) => (
            <button
              key={count}
              type="button"
              aria-pressed={selectedBatchSize === count}
              onClick={() => setSelectedBatchSize(count)}
              className={cn(
                "px-2.5 py-1 rounded-lg border text-xs cursor-pointer transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C5C7C1]",
                selectedBatchSize === count
                  ? "bg-[#222424] border-[rgba(235,235,228,0.22)] text-[#F0EEE8] font-medium"
                  : "bg-[#17191A] border-[rgba(226,226,218,0.13)] text-[#A8AAA5] hover:text-[#F0EEE8]"
              )}
            >
              +{count}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleTrigger}
          disabled={isRunning}
          className="flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-[#F0EEE8] hover:bg-[#FFFFFF] text-[#0B0C0D] text-xs font-medium font-mono transition-all cursor-pointer disabled:opacity-50 shadow-sm"
        >
          {isRunning ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Simulating perturbation batch...</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3 fill-current" />
              <span>Run +{selectedBatchSize} verification runs</span>
            </>
          )}
        </button>
      </div>

      {/* Verification Log */}
      {verification.verificationLog.length > 0 && (
        <div
          data-lenis-prevent
          className="mt-4 p-3.5 rounded-xl bg-[#0B0C0D] border border-[rgba(226,226,218,0.10)] font-mono text-[11px] text-[#A8AAA5] max-h-32 overflow-y-auto space-y-1"
        >
          {verification.verificationLog.map((log, idx) => (
            <div
              key={idx}
              className={cn(
                "leading-relaxed",
                log.includes("SUCCESS") || log.includes("VERIFIED")
                  ? "text-[#7EB49A] font-medium"
                  : "text-[#A8AAA5]"
              )}
            >
              {log}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

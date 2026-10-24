import React from "react";
import { Check, Loader2, X } from "lucide-react";
import { InvestigationStage, InvestigationStatus } from "@/types";
import { cn } from "@/lib/utils";

interface InvestigationPipelineProps {
  currentStage: InvestigationStage;
  status: InvestigationStatus;
  className?: string;
}

const STAGES: {
  key: InvestigationStage;
  title: string;
  desc: string;
}[] = [
  { key: "DETECT", title: "Detect", desc: "Signature isolation" },
  { key: "REPRODUCE", title: "Reproduce", desc: "Seed fuzzing" },
  { key: "MINIMIZE", title: "Minimize", desc: "Delta debugging" },
  { key: "DIAGNOSE", title: "Diagnose", desc: "Root cause" },
  { key: "VERIFY", title: "Verify", desc: "Perturbation suite" },
];

export function InvestigationPipeline({
  currentStage,
  status,
  className,
}: InvestigationPipelineProps) {
  const stageOrder: InvestigationStage[] = [
    "DETECT",
    "REPRODUCE",
    "MINIMIZE",
    "DIAGNOSE",
    "VERIFY",
  ];
  const currentIndex = stageOrder.indexOf(currentStage);

  return (
    <div
      className={cn(
        "surface-solid rounded-2xl p-5 sm:p-6 shadow-2xl",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(226,226,218,0.13)]">
        <div>
          <h3 className="text-base font-semibold text-[#F0EEE8] tracking-tight">
            Diagnostic workflow lifecycle
          </h3>
          <p className="text-xs text-[#A8AAA5] mt-0.5">
            Five-stage automated progression from initial CI failure to verified clean fix
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="text-[#777A76]">State:</span>
          <span
            className={cn(
              "font-medium",
              status === "VERIFIED"
                ? "text-[#7EB49A]"
                : status === "FAILED"
                ? "text-[#E47777]"
                : "text-[#F0EEE8]"
            )}
          >
            {status}
          </span>
        </div>
      </div>

      {/* 5-Stage Stepper Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 relative">
        {STAGES.map((s, idx) => {
          const isCompleted = idx < currentIndex || status === "VERIFIED";
          const isActive = idx === currentIndex && status !== "VERIFIED" && status !== "FAILED";
          const isFailed = idx === currentIndex && status === "FAILED";
          const isPending = idx > currentIndex && status !== "VERIFIED";

          return (
            <div
              key={s.key}
              className={cn(
                "flex flex-col items-center p-3.5 rounded-xl border text-center transition-all",
                isCompleted && "bg-[rgba(126,180,154,0.08)] border-[rgba(126,180,154,0.25)] text-[#7EB49A]",
                isActive && "bg-[#222424] border-[rgba(235,235,228,0.25)] text-[#F0EEE8] shadow-sm",
                isFailed && "bg-[rgba(228,119,119,0.08)] border-[rgba(228,119,119,0.25)] text-[#E47777]",
                isPending && "bg-[#17191A] border-[rgba(226,226,218,0.10)] text-[#777A76]"
              )}
            >
              <div
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-semibold mb-2",
                  isCompleted && "bg-[#7EB49A] text-[#0B0C0D]",
                  isActive && "bg-[#F0EEE8] text-[#0B0C0D]",
                  isFailed && "bg-[#E47777] text-[#0B0C0D]",
                  isPending && "bg-[#222424] text-[#777A76] border border-[rgba(226,226,218,0.13)]"
                )}
              >
                {isCompleted ? (
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                ) : isActive ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin stroke-[2.5]" />
                ) : isFailed ? (
                  <X className="w-3.5 h-3.5 stroke-[3]" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>

              <span className="text-xs font-medium tracking-normal font-sans">
                {s.title}
              </span>
              <span className="text-[11px] text-[#A8AAA5] mt-0.5 font-mono">
                {s.desc}
              </span>

              <span
                className={cn(
                  "mt-2 text-[10px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider font-medium",
                  isCompleted && "text-[#7EB49A] bg-[rgba(126,180,154,0.15)]",
                  isActive && "text-[#F0EEE8] bg-[#222424]",
                  isFailed && "text-[#E47777] bg-[rgba(228,119,119,0.15)]",
                  isPending && "text-[#777A76] bg-[#17191A]"
                )}
              >
                {isCompleted
                  ? "Completed"
                  : isActive
                  ? "Running"
                  : isFailed
                  ? "Halted"
                  : "Queued"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

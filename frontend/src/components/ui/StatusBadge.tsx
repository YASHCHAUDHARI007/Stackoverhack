import React from "react";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  HelpCircle,
  RefreshCw,
  GitCommit,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { InvestigationStatus, InvestigationStage, TestRunStatus } from "@/types";

interface StatusBadgeProps {
  status: InvestigationStatus | InvestigationStage | TestRunStatus | string;
  size?: "sm" | "md" | "lg";
  className?: string;
  showIcon?: boolean;
}

export function StatusBadge({
  status,
  size = "md",
  className,
  showIcon = true,
}: StatusBadgeProps) {
  const norm = String(status).toUpperCase();

  let label = norm;
  let style = {
    color: "#A8AAA5",
    backgroundColor: "rgba(168, 170, 165, 0.10)",
    borderColor: "rgba(168, 170, 165, 0.22)",
  };
  let icon = <Clock className="w-3 h-3 text-[#A8AAA5]" />;

  switch (norm) {
    case "VERIFIED":
      label = "Verified";
      style = {
        color: "#7EB49A",
        backgroundColor: "rgba(126, 180, 154, 0.12)",
        borderColor: "rgba(126, 180, 154, 0.28)",
      };
      icon = <CheckCircle2 className="w-3 h-3 text-[#7EB49A]" />;
      break;

    case "PASSED":
      label = "Passed";
      style = {
        color: "#7EB49A",
        backgroundColor: "rgba(126, 180, 154, 0.12)",
        borderColor: "rgba(126, 180, 154, 0.28)",
      };
      icon = <CheckCircle2 className="w-3 h-3 text-[#7EB49A]" />;
      break;

    case "DIAGNOSED":
      label = "Diagnosed";
      style = {
        color: "#C5C7C1",
        backgroundColor: "rgba(197, 199, 193, 0.10)",
        borderColor: "rgba(197, 199, 193, 0.22)",
      };
      icon = <Cpu className="w-3 h-3 text-[#C5C7C1]" />;
      break;

    case "MINIMIZED":
      label = "Minimized";
      style = {
        color: "#A8AAA5",
        backgroundColor: "rgba(168, 170, 165, 0.10)",
        borderColor: "rgba(168, 170, 165, 0.22)",
      };
      icon = <GitCommit className="w-3 h-3 text-[#A8AAA5]" />;
      break;

    case "REPRODUCED":
      label = "Reproduced";
      style = {
        color: "#D8AD70",
        backgroundColor: "rgba(216, 173, 112, 0.12)",
        borderColor: "rgba(216, 173, 112, 0.28)",
      };
      icon = <RefreshCw className="w-3 h-3 text-[#D8AD70]" />;
      break;

    case "INVESTIGATING":
      label = "Investigating";
      style = {
        color: "#C5C7C1",
        backgroundColor: "rgba(197, 199, 193, 0.10)",
        borderColor: "rgba(197, 199, 193, 0.22)",
      };
      icon = <RefreshCw className="w-3 h-3 text-[#C5C7C1] animate-spin" />;
      break;

    case "FAILED":
      label = "Failed";
      style = {
        color: "#E47777",
        backgroundColor: "rgba(228, 119, 119, 0.12)",
        borderColor: "rgba(228, 119, 119, 0.28)",
      };
      icon = <XCircle className="w-3 h-3 text-[#E47777]" />;
      break;

    case "TIMEOUT":
      label = "Timeout";
      style = {
        color: "#D8AD70",
        backgroundColor: "rgba(216, 173, 112, 0.12)",
        borderColor: "rgba(216, 173, 112, 0.28)",
      };
      icon = <AlertTriangle className="w-3 h-3 text-[#D8AD70]" />;
      break;

    case "INCONCLUSIVE":
      label = "Inconclusive";
      style = {
        color: "#777A76",
        backgroundColor: "rgba(119, 122, 118, 0.12)",
        borderColor: "rgba(119, 122, 118, 0.22)",
      };
      icon = <HelpCircle className="w-3 h-3 text-[#777A76]" />;
      break;

    case "DETECT":
      label = "Detected";
      style = {
        color: "#A8AAA5",
        backgroundColor: "rgba(168, 170, 165, 0.10)",
        borderColor: "rgba(168, 170, 165, 0.22)",
      };
      icon = <Clock className="w-3 h-3 text-[#A8AAA5]" />;
      break;

    case "REPRODUCE":
      label = "Reproducing";
      style = {
        color: "#D8AD70",
        backgroundColor: "rgba(216, 173, 112, 0.12)",
        borderColor: "rgba(216, 173, 112, 0.28)",
      };
      icon = <RefreshCw className="w-3 h-3 text-[#D8AD70]" />;
      break;

    case "MINIMIZE":
      label = "Minimizing";
      style = {
        color: "#A8AAA5",
        backgroundColor: "rgba(168, 170, 165, 0.10)",
        borderColor: "rgba(168, 170, 165, 0.22)",
      };
      icon = <GitCommit className="w-3 h-3 text-[#A8AAA5]" />;
      break;

    case "DIAGNOSE":
      label = "Diagnosing";
      style = {
        color: "#C5C7C1",
        backgroundColor: "rgba(197, 199, 193, 0.10)",
        borderColor: "rgba(197, 199, 193, 0.22)",
      };
      icon = <Cpu className="w-3 h-3 text-[#C5C7C1]" />;
      break;

    case "VERIFY":
      label = "Verifying";
      style = {
        color: "#7EB49A",
        backgroundColor: "rgba(126, 180, 154, 0.12)",
        borderColor: "rgba(126, 180, 154, 0.28)",
      };
      icon = <CheckCircle2 className="w-3 h-3 text-[#7EB49A]" />;
      break;

    default:
      label = norm.charAt(0) + norm.slice(1).toLowerCase();
      break;
  }

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[11px] gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
    lg: "px-3 py-1.5 text-xs gap-2 font-medium",
  };

  return (
    <span
      style={style}
      className={cn(
        "inline-flex items-center rounded-md font-mono border transition-colors select-none",
        sizeClasses[size],
        className
      )}
    >
      {showIcon && icon}
      <span>{label}</span>
    </span>
  );
}

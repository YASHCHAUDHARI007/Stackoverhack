import React from "react";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  delta?: {
    value: string;
    isPositive?: boolean;
    isNeutral?: boolean;
    label?: string;
  };
  icon?: LucideIcon;
  subtext?: string;
  className?: string;
}

export function MetricCard({
  title,
  value,
  delta,
  icon: Icon,
  subtext,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-[#17191A] border border-[rgba(226,226,218,0.13)] p-5 flex flex-col justify-between transition-colors hover:border-[rgba(226,226,218,0.24)] group",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-[#A8AAA5] tracking-tight">
          {title}
        </span>
        {Icon && (
          <div className="p-1.5 rounded-lg text-[#C5C7C1] bg-[#222424] border border-[rgba(226,226,218,0.13)]">
            <Icon className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-3">
        <div className="text-2xl font-semibold text-[#F0EEE8] tracking-tight font-mono">
          {value}
        </div>

        {delta && (
          <div className="flex items-center space-x-1 font-mono text-xs">
            {delta.isNeutral ? (
              <Minus className="w-3 h-3 text-[#A8AAA5]" />
            ) : delta.isPositive ? (
              <TrendingUp className="w-3 h-3 text-[#7EB49A]" />
            ) : (
              <TrendingDown className="w-3 h-3 text-[#E47777]" />
            )}
            <span
              className={cn(
                "font-medium",
                delta.isNeutral
                  ? "text-[#A8AAA5]"
                  : delta.isPositive
                  ? "text-[#7EB49A]"
                  : "text-[#E47777]"
              )}
            >
              {delta.value}
            </span>
          </div>
        )}
      </div>

      {(delta?.label || subtext) && (
        <div className="mt-3 pt-2.5 border-t border-[rgba(226,226,218,0.10)] text-[12px] text-[#777A76] truncate">
          {delta?.label || subtext}
        </div>
      )}
    </div>
  );
}

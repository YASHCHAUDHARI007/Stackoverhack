import React from "react";
import { cn } from "@/lib/utils";

export interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: "solid" | "glass" | "elevated";
  hasCorners?: boolean;
  glow?: string;
}

export function GlassPanel({
  children,
  className,
  variant = "solid",
  hasCorners,
  glow,
  ...props
}: GlassPanelProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl transition-all duration-150",
        variant === "glass" && "glass-surface",
        variant === "solid" && "surface-solid",
        variant === "elevated" && "surface-elevated",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = "lg",
  className,
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity animate-in fade-in duration-150"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Surface */}
      <div
        data-lenis-prevent
        className={cn(
          "relative w-full z-10 p-6 sm:p-7 rounded-2xl bg-[#17191A] border border-[rgba(235,235,228,0.16)] shadow-[0_24px_70px_rgba(0,0,0,0.85)] animate-in zoom-in-98 duration-150",
          maxWidthClasses[maxWidth],
          className
        )}
      >
        <div className="flex items-start justify-between pb-3.5 border-b border-[rgba(226,226,218,0.13)]">
          <div>
            <h2
              id="modal-title"
              className="text-lg font-semibold text-[#F0EEE8] tracking-tight"
            >
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-xs text-[#A8AAA5]">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#A8AAA5] hover:text-[#F0EEE8] hover:bg-[#222424] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C5C7C1]"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

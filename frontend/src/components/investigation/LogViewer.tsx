"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Copy,
  Check,
  AlertCircle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { LogEntry } from "@/types";
import { cn } from "@/lib/utils";

interface LogViewerProps {
  logs: LogEntry[];
  stackTrace?: string;
  className?: string;
}

export function LogViewer({ logs, stackTrace, className }: LogViewerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>("ALL");
  const [copied, setCopied] = useState(false);
  const [showStackTrace, setShowStackTrace] = useState(true);

  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      if (levelFilter !== "ALL" && l.level !== levelFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          l.message.toLowerCase().includes(q) ||
          (l.source && l.source.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [logs, levelFilter, searchQuery]);

  const handleCopyLogs = async () => {
    const text = logs
      .map((l) => `[${l.timestamp}] [${l.level}] ${l.source ? `(${l.source}) ` : ""}${l.message}`)
      .join("\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("flex flex-col rounded-2xl overflow-hidden bg-[#0B0C0D] border border-[rgba(226,226,218,0.13)] shadow-2xl", className)}>
      {/* Search & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-[#17191A] border-b border-[rgba(226,226,218,0.13)] gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#777A76]" />
          <input
            type="text"
            aria-label="Filter logs by message or package"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search log messages or source packages..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#0B0C0D] border border-[rgba(226,226,218,0.13)] text-xs font-mono text-[#F0EEE8] placeholder-[#777A76] focus:outline-none focus:border-[#C5C7C1]"
          />
        </div>

        {/* Level Filters & Copy Button */}
        <div className="flex items-center space-x-2">
          <div role="tablist" aria-label="Log level filter" className="flex items-center bg-[#0B0C0D] p-1 rounded-xl border border-[rgba(226,226,218,0.13)] text-[11px] font-mono">
            {["ALL", "ERROR", "WARN", "INFO", "DEBUG"].map((lvl) => (
              <button
                key={lvl}
                role="tab"
                aria-selected={levelFilter === lvl}
                type="button"
                onClick={() => setLevelFilter(lvl)}
                className={cn(
                  "px-2.5 py-1 rounded-lg transition-colors cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C5C7C1]",
                  levelFilter === lvl
                    ? "bg-[#222424] text-[#F0EEE8] font-medium border border-[rgba(235,235,228,0.16)]"
                    : "text-[#A8AAA5] hover:text-[#F0EEE8]"
                )}
              >
                {lvl}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleCopyLogs}
            aria-label="Copy logs to clipboard"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#222424] hover:bg-[#2c2f2f] text-[#F0EEE8] text-xs font-mono border border-[rgba(226,226,218,0.13)] transition-colors cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C5C7C1]"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-[#7EB49A]" />
                <span className="text-[#7EB49A]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-[#A8AAA5]" />
                <span>Copy logs</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Expandable Stack Trace Section */}
      {stackTrace && (
        <div className="border-b border-[rgba(228,119,119,0.2)] bg-[rgba(228,119,119,0.06)]">
          <button
            type="button"
            aria-expanded={showStackTrace}
            aria-controls="stack-trace-panel"
            onClick={() => setShowStackTrace(!showStackTrace)}
            className="w-full flex items-center justify-between px-4 py-2.5 text-left font-mono text-xs text-[#E47777] hover:bg-[rgba(228,119,119,0.1)] transition-colors cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#E47777]"
          >
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-3.5 h-3.5 text-[#E47777] shrink-0" />
              <span className="font-semibold">Captured panic &amp; goroutine stack trace</span>
            </div>
            {showStackTrace ? (
              <ChevronDown className="w-3.5 h-3.5 text-[#777A76]" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-[#777A76]" />
            )}
          </button>

          {showStackTrace && (
            <div
              id="stack-trace-panel"
              data-lenis-prevent
              className="p-3.5 bg-[#0B0C0D] font-mono text-xs text-[#E47777] overflow-x-auto border-t border-[rgba(228,119,119,0.2)] max-h-56 leading-relaxed"
            >
              <pre>{stackTrace}</pre>
            </div>
          )}
        </div>
      )}

      {/* Terminal Log Console */}
      <div
        data-lenis-prevent
        className="p-3 font-mono text-xs overflow-x-auto max-h-96 min-h-64 space-y-0.5"
      >
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 text-[#777A76] font-mono text-xs">
            No matching log entries found for current query.
          </div>
        ) : (
          filteredLogs.map((log, index) => {
            const isError = log.level === "ERROR";
            const isWarn = log.level === "WARN";
            const isInfo = log.level === "INFO";
            const isDebug = log.level === "DEBUG";

            return (
              <div
                key={index}
                className={cn(
                  "flex items-start space-x-2 py-1 px-2 rounded-lg hover:bg-[#222424]/40 transition-colors",
                  isError && "bg-[rgba(228,119,119,0.08)] text-[#E47777]",
                  isWarn && "bg-[rgba(216,173,112,0.08)] text-[#D8AD70]",
                  isInfo && "text-[#F0EEE8]",
                  isDebug && "text-[#777A76]"
                )}
              >
                {/* Line number */}
                <span className="text-[#777A76] select-none text-[10px] w-6 text-right shrink-0">
                  {index + 1}
                </span>

                {/* Timestamp */}
                <span className="text-[#777A76] select-none text-[11px] shrink-0 hidden sm:inline">
                  {log.timestamp.split("T")[1]?.replace("Z", "") || log.timestamp}
                </span>

                {/* Level Tag */}
                <span
                  className={cn(
                    "text-[9px] font-semibold px-1.5 py-0.2 rounded-md shrink-0 select-none uppercase font-mono",
                    isError && "bg-[rgba(228,119,119,0.15)] text-[#E47777] border border-[rgba(228,119,119,0.3)]",
                    isWarn && "bg-[rgba(216,173,112,0.15)] text-[#D8AD70] border border-[rgba(216,173,112,0.3)]",
                    isInfo && "bg-[#222424] text-[#A8AAA5] border border-[rgba(226,226,218,0.13)]",
                    isDebug && "bg-[#17191A] text-[#777A76] border border-[rgba(226,226,218,0.08)]"
                  )}
                >
                  {log.level}
                </span>

                {/* Source module */}
                {log.source && (
                  <span className="text-[#777A76] text-[11px] shrink-0 hidden md:inline">
                    [{log.source}]
                  </span>
                )}

                {/* Log Message */}
                <span className="text-xs break-all leading-relaxed flex-1">
                  {log.message}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

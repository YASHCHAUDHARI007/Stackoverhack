"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, FileCode, GitBranch, RefreshCw } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Investigation } from "@/types";
import { formatRelativeTime } from "@/lib/utils";

interface RecentInvestigationsTableProps {
  investigations: Investigation[];
}

export function RecentInvestigationsTable({
  investigations,
}: RecentInvestigationsTableProps) {
  return (
    <GlassPanel hasCorners className="p-5 sm:p-6 overflow-hidden">
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
        <div>
          <h3 className="text-sm font-mono tracking-wider text-slate-300 uppercase">
            Active &amp; Recent Investigations
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Diagnostic workspace instances across target repositories
          </p>
        </div>

        <Link
          href="/investigations"
          className="flex items-center space-x-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors group cursor-pointer"
        >
          <span>View All Explorer</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Responsive Data Table */}
      <div className="overflow-x-auto -mx-5 sm:mx-0">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="border-b border-white/5 text-slate-400 uppercase text-[10px] tracking-wider">
              <th className="pb-3 px-4 font-medium">Investigation / Test</th>
              <th className="pb-3 px-3 font-medium">Repository</th>
              <th className="pb-3 px-3 font-medium text-center">Flakiness Rate</th>
              <th className="pb-3 px-3 font-medium text-center">Executions</th>
              <th className="pb-3 px-3 font-medium text-center">Status</th>
              <th className="pb-3 px-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {investigations.slice(0, 5).map((inv) => (
              <tr
                key={inv.id}
                className="hover:bg-white/[0.03] transition-colors group cursor-pointer"
              >
                {/* Test & ID */}
                <td className="py-3 px-4">
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2">
                      <span className="text-cyan-300 font-bold group-hover:text-cyan-200">
                        {inv.id}
                      </span>
                      <span className="text-slate-200 font-sans font-semibold group-hover:text-white truncate max-w-xs">
                        {inv.testName}
                      </span>
                    </div>
                    <span className="text-slate-400 text-[11px] truncate max-w-sm mt-0.5">
                      {inv.testFile}
                    </span>
                  </div>
                </td>

                {/* Repository */}
                <td className="py-3 px-3">
                  <div className="flex items-center space-x-1.5 text-slate-300 text-xs">
                    <GitBranch className="w-3 h-3 text-slate-500" />
                    <span>{inv.repository}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {inv.branch} @ {inv.commitHash}
                  </span>
                </td>

                {/* Flakiness Rate */}
                <td className="py-3 px-3 text-center">
                  <span
                    className={`inline-block px-2 py-0.5 rounded font-bold ${
                      inv.failureRate > 20
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        : inv.failureRate > 10
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    }`}
                  >
                    {inv.failureRate.toFixed(1)}%
                  </span>
                </td>

                {/* Executions */}
                <td className="py-3 px-3 text-center text-slate-300">
                  <span>{inv.totalExecutions} runs</span>
                  <div className="text-[10px] text-slate-400">
                    ({inv.failedExecutions} failed)
                  </div>
                </td>

                {/* Status Badge */}
                <td className="py-3 px-3 text-center">
                  <StatusBadge status={inv.status} size="sm" />
                </td>

                {/* Action Link */}
                <td className="py-3 px-4 text-right">
                  <Link
                    href={`/investigations/${inv.id}`}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors border border-white/10 group-hover:border-cyan-400/40"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassPanel>
  );
}

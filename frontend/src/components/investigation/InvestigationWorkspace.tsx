"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { InvestigationPipeline } from "@/components/investigation/InvestigationPipeline";
import { ExecutionTimeline } from "@/components/investigation/ExecutionTimeline";
import { RootCauseCard } from "@/components/investigation/RootCauseCard";
import { MinimizationDiff } from "@/components/investigation/MinimizationDiff";
import { FixVerificationCard } from "@/components/investigation/FixVerificationCard";
import { LogViewer } from "@/components/investigation/LogViewer";
import {
  ArrowLeft,
  GitBranch,
  GitCommit,
  User,
  Clock,
  Download,
  StopCircle,
  FileCode,
  Loader2,
} from "lucide-react";
import { api } from "@/services/api";
import { Investigation } from "@/types";
import { formatDuration } from "@/lib/utils";

interface InvestigationWorkspaceProps {
  id: string;
}

export function InvestigationWorkspace({ id }: InvestigationWorkspaceProps) {
  const [investigation, setInvestigation] = useState<Investigation | null>(null);
  const [activeTab, setActiveTab] = useState<
    "ANALYSIS" | "TIMELINE" | "MINIMIZE" | "VERIFY" | "LOGS"
  >("ANALYSIS");
  const [isLoading, setIsLoading] = useState(true);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInvestigation() {
      setIsLoading(true);
      const data = await api.getInvestigationById(id);
      setInvestigation(data);
      setIsLoading(false);
    }
    fetchInvestigation();
  }, [id]);

  const handleRunVerification = async (runsCount: number) => {
    if (!investigation) return;
    const updated = await api.runFixVerification(investigation.id, runsCount);
    setInvestigation(updated);
    setActionFeedback(`Executed +${runsCount} verification runs. Pass rate: 100%.`);
    setTimeout(() => setActionFeedback(null), 4000);
  };

  const handleCancelInvestigation = async () => {
    if (!investigation) return;
    const updated = await api.cancelInvestigation(investigation.id);
    setInvestigation(updated);
    setActionFeedback("Investigation marked as halted.");
    setTimeout(() => setActionFeedback(null), 4000);
  };

  const handleExportReport = () => {
    if (!investigation) return;
    const report = {
      investigationId: investigation.id,
      testName: investigation.testName,
      file: investigation.testFile,
      status: investigation.status,
      failureRate: `${investigation.failureRate}%`,
      rootCause: investigation.hypothesis.title,
      confidence: `${investigation.hypothesis.confidence}%`,
      reproductionSeed: investigation.minimization.reproductionSeed,
      verificationStatus: investigation.verification.isVerified ? "VERIFIED" : "UNVERIFIED",
    };
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${investigation.id}-diagnostic-report.json`;
    a.click();
    setActionFeedback("Exported diagnostic report JSON.");
    setTimeout(() => setActionFeedback(null), 3000);
  };

  if (isLoading) {
    return (
      <AppShell>
        <div className="py-24 text-center space-y-3 font-mono">
          <Loader2 className="w-6 h-6 animate-spin text-[#777A76] mx-auto" />
          <p className="text-xs text-[#A8AAA5]">Loading diagnostic workspace for {id}...</p>
        </div>
      </AppShell>
    );
  }

  if (!investigation) {
    return (
      <AppShell>
        <div className="py-24 text-center space-y-4">
          <h2 className="text-xl font-semibold text-[#F0EEE8]">Investigation not found</h2>
          <p className="text-[#A8AAA5] font-mono text-xs">
            Identifier {id} does not match any active test records.
          </p>
          <Link
            href="/investigations"
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#222424] text-[#F0EEE8] border border-[rgba(226,226,218,0.13)] font-mono text-xs cursor-pointer hover:border-[rgba(235,235,228,0.25)] transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to explorer</span>
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Navigation Breadcrumb & Toast */}
        <div className="flex items-center justify-between">
          <Link
            href="/investigations"
            className="flex items-center space-x-1.5 text-xs font-mono text-[#A8AAA5] hover:text-[#F0EEE8] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to investigation explorer</span>
          </Link>

          {/* Action Feedback Toast */}
          {actionFeedback && (
            <div className="px-3.5 py-1.5 rounded-xl bg-[#222424] border border-[rgba(235,235,228,0.2)] text-[#F0EEE8] text-xs font-mono animate-in fade-in shadow-lg">
              {actionFeedback}
            </div>
          )}
        </div>

        {/* Investigation Master Identity Header */}
        <div className="surface-solid rounded-2xl p-5 sm:p-6 shadow-2xl">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-semibold text-[#F0EEE8] px-2.5 py-0.5 rounded-full bg-[#222424] border border-[rgba(226,226,218,0.13)]">
                  {investigation.id}
                </span>
                <StatusBadge status={investigation.status} size="sm" />
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#222424] text-[#A8AAA5] border border-[rgba(226,226,218,0.13)]">
                  Priority: {investigation.severity}
                </span>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[rgba(228,119,119,0.12)] text-[#E47777] border border-[rgba(228,119,119,0.25)] font-semibold">
                  {investigation.failureRate}% flakiness rate
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-semibold text-[#F0EEE8] tracking-tight break-all font-mono">
                {investigation.testName}
              </h1>

              <div className="flex items-center space-x-1.5 text-xs font-mono text-[#A8AAA5]">
                <FileCode className="w-3.5 h-3.5 text-[#777A76] shrink-0" />
                <span className="text-[#F0EEE8] select-all">{investigation.testFile}</span>
              </div>

              {/* Technical Context Strip */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 pt-1 text-xs font-mono text-[#A8AAA5]">
                <div className="flex items-center space-x-1.5">
                  <GitBranch className="w-3.5 h-3.5 text-[#777A76]" />
                  <span>{investigation.repository}</span>
                  <span className="text-[#777A76]">/</span>
                  <span className="text-[#F0EEE8]">{investigation.branch}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <GitCommit className="w-3.5 h-3.5 text-[#777A76]" />
                  <span>Commit: {investigation.commitHash}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="w-3.5 h-3.5 text-[#777A76]" />
                  <span>Author: {investigation.author}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-[#777A76]" />
                  <span>Duration: {formatDuration(investigation.durationMs)}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleExportReport}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#222424] hover:bg-[#2c2f2f] border border-[rgba(226,226,218,0.13)] hover:border-[rgba(235,235,228,0.25)] text-xs font-mono text-[#F0EEE8] transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#A8AAA5]" />
                <span>Export report JSON</span>
              </button>

              {investigation.status !== "VERIFIED" && (
                <button
                  type="button"
                  onClick={handleCancelInvestigation}
                  className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[rgba(228,119,119,0.12)] hover:bg-[rgba(228,119,119,0.22)] border border-[rgba(228,119,119,0.25)] text-xs font-mono text-[#E47777] transition-colors cursor-pointer"
                >
                  <StopCircle className="w-3.5 h-3.5 text-[#E47777]" />
                  <span>Halt session</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 5-Stage Visual Workflow Pipeline */}
        <InvestigationPipeline
          currentStage={investigation.stage}
          status={investigation.status}
        />

        {/* Workspace Section Navigation Tabs */}
        <div className="flex items-center space-x-1.5 border-b border-[rgba(226,226,218,0.13)] overflow-x-auto pb-1 text-xs font-mono">
          {[
            { key: "ANALYSIS", label: "Diagnostic analysis" },
            {
              key: "TIMELINE",
              label: `Execution matrix (${investigation.runs.length} runs)`,
            },
            {
              key: "MINIMIZE",
              label: `Failure minimization (-${investigation.minimization.reductionPercentage.toFixed(0)}%)`,
            },
            {
              key: "VERIFY",
              label: `Empirical verification (${investigation.verification.totalRuns}/${investigation.verification.targetThreshold})`,
            },
            {
              key: "LOGS",
              label: `Telemetry logs (${investigation.evidenceLogs.length})`,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer font-medium ${
                activeTab === tab.key
                  ? "bg-[#222424] text-[#F0EEE8] border border-[rgba(235,235,228,0.22)] shadow-sm"
                  : "text-[#A8AAA5] hover:text-[#F0EEE8] hover:bg-[#222424]/40"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Workspace Tab Contents */}
        <div className="space-y-6">
          {activeTab === "ANALYSIS" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 space-y-6">
                <RootCauseCard hypothesis={investigation.hypothesis} />
                <MinimizationDiff minimization={investigation.minimization} />
              </div>
              <div className="lg:col-span-5 space-y-6">
                <FixVerificationCard
                  investigationId={investigation.id}
                  verification={investigation.verification}
                  onRunVerification={handleRunVerification}
                />
              </div>
            </div>
          )}

          {activeTab === "TIMELINE" && (
            <ExecutionTimeline runs={investigation.runs} />
          )}

          {activeTab === "MINIMIZE" && (
            <MinimizationDiff minimization={investigation.minimization} />
          )}

          {activeTab === "VERIFY" && (
            <FixVerificationCard
              investigationId={investigation.id}
              verification={investigation.verification}
              onRunVerification={handleRunVerification}
            />
          )}

          {activeTab === "LOGS" && (
            <LogViewer
              logs={investigation.evidenceLogs}
              stackTrace={investigation.rawStackTrace}
            />
          )}
        </div>
      </div>
    </AppShell>
  );
}

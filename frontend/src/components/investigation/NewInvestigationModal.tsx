"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Play, Loader2, Sparkles, AlertCircle, ShieldAlert } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { api } from "@/services/api";
import { MOCK_REPOSITORIES } from "@/mock/data";

interface NewInvestigationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (id: string) => void;
}

export function NewInvestigationModal({
  isOpen,
  onClose,
  onCreated,
}: NewInvestigationModalProps) {
  const router = useRouter();
  const [testName, setTestName] = useState("");
  const [testFile, setTestFile] = useState("");
  const [repository, setRepository] = useState(MOCK_REPOSITORIES[0]?.name || "mono-repo/api-core");
  const [branch, setBranch] = useState("main");
  const [iterations, setIterations] = useState(30);
  const [priority, setPriority] = useState<"HIGH" | "MEDIUM" | "LOW">("HIGH");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!testName.trim()) {
      setError("Test identifier or function name is required.");
      return;
    }
    if (!testFile.trim()) {
      setError("Source file path is required (e.g. pkg/auth/session_test.go).");
      return;
    }

    try {
      setIsSubmitting(true);
      const newInv = await api.createInvestigation({
        testName: testName.trim(),
        testFile: testFile.trim(),
        repository,
        branch: branch.trim() || "main",
        iterations: Number(iterations) || 20,
        priority,
      });

      setIsSubmitting(false);
      onClose();

      // Reset form
      setTestName("");
      setTestFile("");

      if (onCreated) {
        onCreated(newInv.id);
      } else {
        router.push(`/investigations/${newInv.id}`);
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setError(err?.message || "Failed to initialize investigation");
    }
  };

  const handleQuickFill = () => {
    setTestName("TestKafkaPartitionRebalanceSkew");
    setTestFile("streaming/partition_test.go");
    setRepository("data-pipeline");
    setBranch("production");
    setIterations(50);
    setPriority("HIGH");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Launch flaky test investigation"
      description="Initialize automated test repetition, delta-minimization, and root-cause analysis"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-[rgba(228,119,119,0.08)] border border-[rgba(228,119,119,0.25)] flex items-center space-x-2 text-[#E47777] text-xs font-mono">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#E47777]" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleQuickFill}
            className="text-[11px] font-mono text-[#A8AAA5] hover:text-[#F0EEE8] flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C5C7C1]" />
            <span>Fill with sample flaky test</span>
          </button>
        </div>

        {/* Test Identifier */}
        <div>
          <label htmlFor="inv-test-name" className="block text-xs font-mono text-[#A8AAA5] uppercase tracking-wider mb-1 font-medium">
            Test identifier *
          </label>
          <input
            id="inv-test-name"
            type="text"
            required
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
            placeholder="e.g. TestAsyncConnectionPoolDrainUnderLoad"
            className="w-full px-3.5 py-2 rounded-xl bg-[#0B0C0D] border border-[rgba(226,226,218,0.13)] text-[#F0EEE8] placeholder-[#777A76] text-xs font-mono focus:outline-none focus:border-[#C5C7C1]"
          />
        </div>

        {/* File Path */}
        <div>
          <label htmlFor="inv-test-file" className="block text-xs font-mono text-[#A8AAA5] uppercase tracking-wider mb-1 font-medium">
            Test file path *
          </label>
          <input
            id="inv-test-file"
            type="text"
            required
            value={testFile}
            onChange={(e) => setTestFile(e.target.value)}
            placeholder="e.g. services/gateway/pool_test.go"
            className="w-full px-3.5 py-2 rounded-xl bg-[#0B0C0D] border border-[rgba(226,226,218,0.13)] text-[#F0EEE8] placeholder-[#777A76] text-xs font-mono focus:outline-none focus:border-[#C5C7C1]"
          />
        </div>

        {/* Repository & Branch */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label htmlFor="inv-target-repo" className="block text-xs font-mono text-[#A8AAA5] uppercase tracking-wider mb-1 font-medium">
              Target repository
            </label>
            <select
              id="inv-target-repo"
              value={repository}
              onChange={(e) => setRepository(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#0B0C0D] border border-[rgba(226,226,218,0.13)] text-[#F0EEE8] text-xs font-mono focus:outline-none focus:border-[#C5C7C1] cursor-pointer"
            >
              {MOCK_REPOSITORIES.map((repo) => (
                <option key={repo.id} value={repo.name} className="bg-[#17191A]">
                  {repo.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="inv-target-branch" className="block text-xs font-mono text-[#A8AAA5] uppercase tracking-wider mb-1 font-medium">
              Target git branch
            </label>
            <input
              id="inv-target-branch"
              type="text"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              placeholder="main"
              className="w-full px-3.5 py-2 rounded-xl bg-[#0B0C0D] border border-[rgba(226,226,218,0.13)] text-[#F0EEE8] text-xs font-mono focus:outline-none focus:border-[#C5C7C1]"
            />
          </div>
        </div>

        {/* Iterations & Priority */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label htmlFor="inv-iterations" className="block text-xs font-mono text-[#A8AAA5] uppercase tracking-wider mb-1 font-medium">
              Reproduction iterations ({iterations} runs)
            </label>
            <input
              id="inv-iterations"
              type="range"
              min="10"
              max="100"
              step="10"
              value={iterations}
              onChange={(e) => setIterations(Number(e.target.value))}
              className="w-full accent-[#F0EEE8] cursor-pointer mt-1"
            />
            <div className="flex justify-between text-[11px] font-mono text-[#777A76] mt-1">
              <span>10 runs</span>
              <span>50 runs</span>
              <span>100 runs</span>
            </div>
          </div>

          <div>
            <span className="block text-xs font-mono text-[#A8AAA5] uppercase tracking-wider mb-1 font-medium">
              Priority
            </span>
            <div role="group" aria-label="Investigation Priority" className="grid grid-cols-3 gap-2 mt-1">
              {(["HIGH", "MEDIUM", "LOW"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  aria-pressed={priority === p}
                  onClick={() => setPriority(p)}
                  className={`py-1.5 text-xs font-mono rounded-xl border transition-colors cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C5C7C1] ${
                    priority === p
                      ? p === "HIGH"
                        ? "bg-[rgba(228,119,119,0.15)] border-[rgba(228,119,119,0.35)] text-[#E47777] font-semibold"
                        : p === "MEDIUM"
                        ? "bg-[rgba(216,173,112,0.15)] border-[rgba(216,173,112,0.35)] text-[#D8AD70] font-semibold"
                        : "bg-[#222424] border-[rgba(235,235,228,0.25)] text-[#F0EEE8] font-semibold"
                      : "bg-[#17191A] border-[rgba(226,226,218,0.13)] text-[#777A76] hover:text-[#F0EEE8]"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notice */}
        <div className="p-3 rounded-xl bg-[#0B0C0D] border border-[rgba(226,226,218,0.10)] text-[11px] font-mono text-[#777A76] flex items-start space-x-2">
          <ShieldAlert className="w-3.5 h-3.5 text-[#A8AAA5] shrink-0 mt-0.5" />
          <span>
            Telemetry note: The investigation pipeline will execute in Simulated Mock Adapter mode with synthetic thread interleaving and fuzz seeds.
          </span>
        </div>

        {/* Modal Actions */}
        <div className="pt-3.5 border-t border-[rgba(226,226,218,0.13)] flex items-center justify-end space-x-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-3.5 py-1.5 rounded-xl text-xs font-mono text-[#A8AAA5] hover:text-[#F0EEE8] transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#F0EEE8] hover:bg-[#FFFFFF] text-[#0B0C0D] text-xs font-medium font-mono transition-all cursor-pointer disabled:opacity-50 shadow-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Initializing pipeline...</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" />
                <span>Start investigation</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import {
  Server,
  Flame,
  Check,
  Save,
  Radio,
  RefreshCw,
  Cpu,
  Shield,
  Palette,
} from "lucide-react";
import { api } from "@/services/api";
import { PlatformSettings } from "@/types";

export default function SettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // API test state
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [apiTestResult, setApiTestResult] = useState<{
    success: boolean;
    latencyMs: number;
    message: string;
  } | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      setIsLoading(true);
      const data = await api.getSettings();
      setSettings(data);
      setIsLoading(false);
    }
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setIsSaving(true);
    await api.updateSettings(settings);
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handlePingBackend = async () => {
    setIsTestingApi(true);
    const res = await api.testBackendConnection(settings?.apiConnection.baseUrl);
    setApiTestResult(res);
    setIsTestingApi(false);
  };

  if (isLoading || !settings) {
    return (
      <AppShell>
        <div className="py-24 text-center space-y-3 font-mono">
          <RefreshCw className="w-5 h-5 animate-spin text-[#777A76] mx-auto" />
          <p className="text-xs text-[#A8AAA5]">Loading platform preferences...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <form onSubmit={handleSave} className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[rgba(226,226,218,0.13)] gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-[#F0EEE8] tracking-tight">
              Engine &amp; platform configuration
            </h1>
            <p className="text-xs sm:text-sm text-[#A8AAA5] mt-1">
              Test execution parameters, chaos perturbation defaults, and Django REST backend integration
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {saveSuccess && (
              <span className="flex items-center space-x-1 text-xs font-mono text-[#7EB49A] animate-in fade-in">
                <Check className="w-3.5 h-3.5" />
                <span>Preferences saved</span>
              </span>
            )}
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#F0EEE8] hover:bg-[#FFFFFF] text-[#0B0C0D] font-mono text-xs font-medium transition-all cursor-pointer disabled:opacity-50 shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? "Saving..." : "Save preferences"}</span>
            </button>
          </div>
        </div>

        {/* 1. API & Backend Adapter Status */}
        <div className="surface-solid rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-[rgba(226,226,218,0.13)]">
            <div className="flex items-center space-x-2.5">
              <Server className="w-4 h-4 text-[#A8AAA5]" />
              <div>
                <h3 className="text-xs font-semibold text-[#F0EEE8] uppercase tracking-wider font-mono">
                  Backend architecture &amp; API contract
                </h3>
                <p className="text-xs text-[#A8AAA5]">
                  Django REST Framework adapter and live endpoint configuration
                </p>
              </div>
            </div>

            <span className="px-3 py-0.5 rounded-full bg-[#222424] text-[#A8AAA5] text-[11px] font-mono border border-[rgba(226,226,218,0.13)]">
              Active: Mock adapter
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs font-mono">
            <div>
              <label htmlFor="drf-base-url" className="block text-[#A8AAA5] uppercase tracking-wider mb-1 text-[11px] font-medium">
                DRF endpoint base URL
              </label>
              <input
                id="drf-base-url"
                type="text"
                value={settings.apiConnection.baseUrl}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    apiConnection: {
                      ...settings.apiConnection,
                      baseUrl: e.target.value,
                    },
                  })
                }
                placeholder="http://localhost:8000/api/v1"
                className="w-full px-3.5 py-2 rounded-xl bg-[#0B0C0D] border border-[rgba(226,226,218,0.13)] text-[#F0EEE8] placeholder-[#777A76] text-xs focus:outline-none focus:border-[#C5C7C1]"
              />
              <span className="text-[10px] text-[#777A76] mt-1 block">
                Configured via NEXT_PUBLIC_API_URL or overridden locally.
              </span>
            </div>

            <div className="flex flex-col justify-end">
              <button
                type="button"
                onClick={handlePingBackend}
                disabled={isTestingApi}
                className="flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-[#222424] hover:bg-[#2c2f2f] text-[#F0EEE8] border border-[rgba(226,226,218,0.13)] hover:border-[rgba(235,235,228,0.25)] transition-all cursor-pointer text-xs focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C5C7C1]"
              >
                <Radio className="w-3.5 h-3.5 text-[#A8AAA5]" />
                <span>
                  {isTestingApi ? "Testing connection..." : "Test backend connection"}
                </span>
              </button>
            </div>
          </div>

          {apiTestResult && (
            <div
              className={`p-3 rounded-xl border text-xs font-mono flex items-start space-x-2 ${
                apiTestResult.success
                  ? "bg-[rgba(126,180,154,0.08)] border-[rgba(126,180,154,0.25)] text-[#7EB49A]"
                  : "bg-[#0B0C0D] border-[rgba(226,226,218,0.13)] text-[#F0EEE8]"
              }`}
            >
              <Shield className="w-4 h-4 shrink-0 mt-0.5 text-[#7EB49A]" />
              <div>
                <span className="font-semibold block">
                  Latency: {apiTestResult.latencyMs}ms
                </span>
                <span>{apiTestResult.message}</span>
              </div>
            </div>
          )}

          {/* DRF Contract Specs Drawer */}
          <div className="mt-3 p-3.5 rounded-xl bg-[#0B0C0D] border border-[rgba(226,226,218,0.10)] space-y-1.5 text-xs font-mono">
            <span className="text-[#777A76] uppercase tracking-wider block text-[10px] font-semibold">
              Django REST Framework contract specification
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[#A8AAA5] text-[11px]">
              <div>&bull; <code className="text-[#F0EEE8]">GET /api/v1/dashboard/metrics/</code></div>
              <div>&bull; <code className="text-[#F0EEE8]">GET /api/v1/investigations/</code></div>
              <div>&bull; <code className="text-[#F0EEE8]">POST /api/v1/investigations/</code></div>
              <div>&bull; <code className="text-[#F0EEE8]">GET /api/v1/investigations/:id/</code></div>
              <div>&bull; <code className="text-[#F0EEE8]">POST /api/v1/investigations/:id/verify/</code></div>
              <div>&bull; <code className="text-[#F0EEE8]">GET /api/v1/tests/</code></div>
            </div>
          </div>
        </div>

        {/* 2. Test Execution & Reproduction Preferences */}
        <div className="surface-solid rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-[rgba(226,226,218,0.13)]">
            <Cpu className="w-4 h-4 text-[#A8AAA5]" />
            <div>
              <h3 className="text-xs font-semibold text-[#F0EEE8] uppercase tracking-wider font-mono">
                Execution &amp; seed fuzzing preferences
              </h3>
              <p className="text-xs text-[#A8AAA5]">
                Concurrency limits and pseudo-random seed generator algorithms
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div>
              <label htmlFor="max-repro-iterations" className="block text-[#A8AAA5] uppercase tracking-wider mb-1 text-[11px] font-medium">
                Max reproduction iterations ({settings.testExecution.maxReproductionIterations} runs)
              </label>
              <input
                id="max-repro-iterations"
                type="range"
                min="20"
                max="100"
                step="10"
                value={settings.testExecution.maxReproductionIterations}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    testExecution: {
                      ...settings.testExecution,
                      maxReproductionIterations: Number(e.target.value),
                    },
                  })
                }
                className="w-full accent-[#F0EEE8] cursor-pointer mt-1"
              />
            </div>

            <div>
              <label htmlFor="parallel-workers" className="block text-[#A8AAA5] uppercase tracking-wider mb-1 text-[11px] font-medium">
                Parallel workers ({settings.testExecution.parallelWorkers} workers)
              </label>
              <input
                id="parallel-workers"
                type="range"
                min="2"
                max="16"
                step="2"
                value={settings.testExecution.parallelWorkers}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    testExecution: {
                      ...settings.testExecution,
                      parallelWorkers: Number(e.target.value),
                    },
                  })
                }
                className="w-full accent-[#F0EEE8] cursor-pointer mt-1"
              />
            </div>

            <div>
              <label htmlFor="prng-engine" className="block text-[#A8AAA5] uppercase tracking-wider mb-1 text-[11px] font-medium">
                PRNG seed engine
              </label>
              <select
                id="prng-engine"
                value={settings.testExecution.seedGenerator}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    testExecution: {
                      ...settings.testExecution,
                      seedGenerator: e.target.value as any,
                    },
                  })
                }
                className="w-full px-3 py-2 rounded-xl bg-[#0B0C0D] border border-[rgba(226,226,218,0.13)] text-[#F0EEE8] focus:outline-none focus:border-[#C5C7C1] cursor-pointer"
              >
                <option value="PCG64" className="bg-[#17191A]">PCG64 (Permuted Congruential - Recommended)</option>
                <option value="MERSENNE_TWISTER" className="bg-[#17191A]">Mersenne Twister (MT19937)</option>
                <option value="XOROSHIRO" className="bg-[#17191A]">Xoroshiro128++</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3. Chaos & Perturbation Settings */}
        <div className="surface-solid rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-[rgba(226,226,218,0.13)]">
            <Flame className="w-4 h-4 text-[#D8AD70]" />
            <div>
              <h3 className="text-xs font-semibold text-[#F0EEE8] uppercase tracking-wider font-mono">
                Chaos &amp; scheduler perturbation defaults
              </h3>
              <p className="text-xs text-[#A8AAA5]">
                Thread interleaving delays, clock skew, and artificial resource contention
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs font-mono">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B0C0D] border border-[rgba(226,226,218,0.10)]">
              <label htmlFor="chaos-thread-jitter" className="cursor-pointer">
                <span className="text-[#F0EEE8] font-medium block">Thread jitter</span>
                <span className="text-[#777A76] text-[10px]">Random context switch delays</span>
              </label>
              <input
                id="chaos-thread-jitter"
                type="checkbox"
                checked={settings.perturbation.enableThreadJitter}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    perturbation: {
                      ...settings.perturbation,
                      enableThreadJitter: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 accent-[#F0EEE8] cursor-pointer"
              />
            </div>

            <div>
              <label htmlFor="chaos-clock-skew" className="block text-[#A8AAA5] uppercase tracking-wider mb-1 text-[11px] font-medium">
                Max clock skew (&plusmn;{settings.perturbation.maxClockSkewMs}ms)
              </label>
              <input
                id="chaos-clock-skew"
                type="range"
                min="10"
                max="100"
                step="5"
                value={settings.perturbation.maxClockSkewMs}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    perturbation: {
                      ...settings.perturbation,
                      maxClockSkewMs: Number(e.target.value),
                    },
                  })
                }
                className="w-full accent-[#F0EEE8] cursor-pointer mt-1"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B0C0D] border border-[rgba(226,226,218,0.10)]">
              <label htmlFor="chaos-memory-pressure" className="cursor-pointer">
                <span className="text-[#F0EEE8] font-medium block">Memory pressure</span>
                <span className="text-[#777A76] text-[10px]">Simulate heap spikes</span>
              </label>
              <input
                id="chaos-memory-pressure"
                type="checkbox"
                checked={settings.perturbation.memoryPressureSimulation}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    perturbation: {
                      ...settings.perturbation,
                      memoryPressureSimulation: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 accent-[#F0EEE8] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 4. Interface & Motion Controls */}
        <div className="surface-solid rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
          <div className="flex items-center space-x-2.5 pb-3 border-b border-[rgba(226,226,218,0.13)]">
            <Palette className="w-4 h-4 text-[#A8AAA5]" />
            <div>
              <h3 className="text-xs font-semibold text-[#F0EEE8] uppercase tracking-wider font-mono">
                Interface &amp; motion controls
              </h3>
              <p className="text-xs text-[#A8AAA5]">
                Control subtle animations and reduced-motion preferences
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs font-mono">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B0C0D] border border-[rgba(226,226,218,0.10)]">
              <label htmlFor="theme-reduced-motion" className="cursor-pointer">
                <span className="text-[#F0EEE8] font-medium block">Reduced motion mode</span>
                <span className="text-[#777A76] text-[10px]">Disable all page transitions &amp; animations</span>
              </label>
              <input
                id="theme-reduced-motion"
                type="checkbox"
                checked={settings.theme.reducedMotion}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    theme: {
                      ...settings.theme,
                      reducedMotion: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 accent-[#F0EEE8] cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B0C0D] border border-[rgba(226,226,218,0.10)]">
              <label htmlFor="theme-particles" className="cursor-pointer">
                <span className="text-[#F0EEE8] font-medium block">Atmospheric background depth</span>
                <span className="text-[#777A76] text-[10px]">Subtle vignette depth behind floating navigation</span>
              </label>
              <input
                id="theme-particles"
                type="checkbox"
                checked={settings.theme.particlesEnabled}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    theme: {
                      ...settings.theme,
                      particlesEnabled: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 accent-[#F0EEE8] cursor-pointer"
              />
            </div>
          </div>
        </div>
      </form>
    </AppShell>
  );
}

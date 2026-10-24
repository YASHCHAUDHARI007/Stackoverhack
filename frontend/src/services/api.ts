import {
  Investigation,
  FlakyTestSummary,
  Repository,
  TelemetryEvent,
  PlatformSettings,
  InvestigationStatus,
  FlakinessSeverity,
  InvestigationStage,
} from "@/types";
import {
  MOCK_INVESTIGATIONS,
  MOCK_FLAKY_TESTS,
  MOCK_REPOSITORIES,
  MOCK_TELEMETRY,
  DEFAULT_PLATFORM_SETTINGS,
  MOCK_TREND_DATA,
  MOCK_SEVERITY_DISTRIBUTION,
} from "@/mock/data";

export interface InvestigationFilterParams {
  query?: string;
  status?: string;
  repository?: string;
  severity?: FlakinessSeverity | "ALL";
  stage?: InvestigationStage | "ALL";
  sortBy?: "startedAt" | "failureRate" | "totalExecutions";
  sortOrder?: "asc" | "desc";
}

export interface FlakyTestFilterParams {
  query?: string;
  repository?: string;
  minFlakiness?: number;
  status?: string;
  severity?: FlakinessSeverity | "ALL";
}

export interface CreateInvestigationPayload {
  testName: string;
  testFile: string;
  repository: string;
  branch: string;
  iterations: number;
  priority: "HIGH" | "MEDIUM" | "LOW";
}

export interface DashboardMetrics {
  totalScanned: number;
  flakyCount: number;
  investigationsInProgress: number;
  verifiedFixes: number;
  healthScore: number;
  overallFlakinessRate: number;
  trendData: typeof MOCK_TREND_DATA;
  severityDistribution: typeof MOCK_SEVERITY_DISTRIBUTION;
}

// In-memory mutable state for responsive simulated actions in frontend session
let investigationsStore: Investigation[] = [...MOCK_INVESTIGATIONS];
let flakyTestsStore: FlakyTestSummary[] = [...MOCK_FLAKY_TESTS];
let telemetryStore: TelemetryEvent[] = [...MOCK_TELEMETRY];
let settingsStore: PlatformSettings = { ...DEFAULT_PLATFORM_SETTINGS };

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
const IS_PRODUCTION = process.env.NODE_ENV === "production";
const DEFAULT_TO_MOCK = !API_BASE_URL;

class WobbleApiService {
  private baseUrl: string;
  private isMock: boolean;

  constructor() {
    this.baseUrl = API_BASE_URL;
    this.isMock = DEFAULT_TO_MOCK;
  }

  public isMockMode(): boolean {
    return this.isMock;
  }

  public setMockMode(mock: boolean) {
    this.isMock = mock;
  }

  public setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  // Dashboard Overview Metrics
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    if (!this.isMock && this.baseUrl) {
      try {
        const res = await fetch(`${this.baseUrl}/dashboard/metrics/`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn("Live API unavailable, falling back to mock adapter", e);
      }
    }

    // Simulated network latency
    await new Promise((r) => setTimeout(r, 120));

    const inProgress = investigationsStore.filter(
      (i) => i.status === "INVESTIGATING" || i.status === "REPRODUCED" || i.status === "MINIMIZED" || i.status === "DIAGNOSED"
    ).length;
    const verified = investigationsStore.filter((i) => i.status === "VERIFIED").length;

    return {
      totalScanned: 14820,
      flakyCount: flakyTestsStore.length + 30,
      investigationsInProgress: inProgress,
      verifiedFixes: verified,
      healthScore: 98.4,
      overallFlakinessRate: 1.6,
      trendData: MOCK_TREND_DATA,
      severityDistribution: MOCK_SEVERITY_DISTRIBUTION,
    };
  }

  // Repositories
  async getRepositories(): Promise<Repository[]> {
    if (!this.isMock && this.baseUrl) {
      try {
        const res = await fetch(`${this.baseUrl}/repositories/`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn("Live API unavailable, falling back to mock adapter", e);
      }
    }
    await new Promise((r) => setTimeout(r, 80));
    return [...MOCK_REPOSITORIES];
  }

  // Investigations List
  async getInvestigations(filters?: InvestigationFilterParams): Promise<Investigation[]> {
    if (!this.isMock && this.baseUrl) {
      try {
        const params = new URLSearchParams();
        if (filters?.query) params.set("search", filters.query);
        if (filters?.repository) params.set("repo", filters.repository);
        if (filters?.status) params.set("status", filters.status);
        const res = await fetch(`${this.baseUrl}/investigations/?${params.toString()}`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn("Live API unavailable, falling back to mock adapter", e);
      }
    }

    await new Promise((r) => setTimeout(r, 100));
    let list = [...investigationsStore];

    if (filters?.query) {
      const q = filters.query.toLowerCase();
      list = list.filter(
        (i) =>
          i.id.toLowerCase().includes(q) ||
          i.testName.toLowerCase().includes(q) ||
          i.testFile.toLowerCase().includes(q) ||
          i.repository.toLowerCase().includes(q) ||
          i.branch.toLowerCase().includes(q)
      );
    }

    if (filters?.repository && filters.repository !== "ALL") {
      list = list.filter((i) => i.repository === filters.repository);
    }

    if (filters?.status && filters.status !== "ALL") {
      list = list.filter((i) => i.status === filters.status);
    }

    if (filters?.severity && filters.severity !== "ALL") {
      list = list.filter((i) => i.severity === filters.severity);
    }

    if (filters?.stage && filters.stage !== "ALL") {
      list = list.filter((i) => i.stage === filters.stage);
    }

    // Sort
    if (filters?.sortBy === "failureRate") {
      list.sort((a, b) =>
        filters.sortOrder === "asc"
          ? a.failureRate - b.failureRate
          : b.failureRate - a.failureRate
      );
    } else if (filters?.sortBy === "totalExecutions") {
      list.sort((a, b) =>
        filters.sortOrder === "asc"
          ? a.totalExecutions - b.totalExecutions
          : b.totalExecutions - a.totalExecutions
      );
    } else {
      // Default: startedAt desc
      list.sort(
        (a, b) =>
          new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
      );
    }

    return list;
  }

  // Single Investigation Detail
  async getInvestigationById(id: string): Promise<Investigation | null> {
    if (!this.isMock && this.baseUrl) {
      try {
        const res = await fetch(`${this.baseUrl}/investigations/${id}/`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn("Live API unavailable, falling back to mock adapter", e);
      }
    }

    await new Promise((r) => setTimeout(r, 120));
    const found = investigationsStore.find(
      (i) => i.id.toUpperCase() === id.toUpperCase()
    );
    return found ? { ...found } : null;
  }

  // Create New Investigation (interactive simulation)
  async createInvestigation(
    payload: CreateInvestigationPayload
  ): Promise<Investigation> {
    if (!this.isMock && this.baseUrl) {
      try {
        const res = await fetch(`${this.baseUrl}/investigations/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn("Live API unavailable, falling back to mock adapter", e);
      }
    }

    await new Promise((r) => setTimeout(r, 250));
    const nextNum = investigationsStore.length + 8050;
    const newId = `INV-${nextNum}`;

    const newInv: Investigation = {
      id: newId,
      testId: `TEST-${Math.floor(1000 + Math.random() * 9000)}`,
      testName: payload.testName,
      testFile: payload.testFile,
      repository: payload.repository,
      branch: payload.branch,
      commitHash: Math.random().toString(16).substring(2, 10),
      author: "current.engineer@wobble.local",
      status: "INVESTIGATING",
      stage: "DETECT",
      failureRate: 15.0,
      totalExecutions: payload.iterations || 20,
      failedExecutions: 3,
      startedAt: new Date().toISOString(),
      durationMs: 45000,
      severity: payload.priority || "HIGH",
      runs: Array.from({ length: payload.iterations || 20 }, (_, i) => ({
        id: `run-${i + 1}`,
        runIndex: i + 1,
        status: i % 7 === 0 ? "FAILED" : "PASSED",
        durationMs: Math.floor(190 + Math.random() * 150),
        seed: `0x${Math.floor(Math.random() * 0xffffffff).toString(16).toUpperCase()}`,
        workerId: `worker-${(i % 4) + 1}`,
        orderIndex: i + 10,
        cpuThrottle: 1.0,
        memoryMb: 140,
        timestamp: new Date().toISOString(),
        stdoutSnippet: `[INFO] Initializing test harness for ${payload.testName}`,
      })),
      hypothesis: {
        title: "Suspected Thread Interleaving in Setup Fixture",
        category: "RACE_CONDITION",
        confidence: 78,
        isConfirmed: false,
        description: `Automated analyzer flagged potential asynchronous race condition during ${payload.testName} execution.`,
        evidencePoints: [
          {
            id: `ev-new-1`,
            label: "Heuristic Failure Signature",
            file: payload.testFile,
            detail: "Intermittent non-deterministic assertion failure isolated during repeated runs.",
          },
        ],
        recommendedFix: "Isolate mutable shared state and wrap in mutex or pytest worker fixture.",
        categoryDistribution: [
          { category: "Race Condition", percentage: 65, color: "#10f596" },
          { category: "Timing Jitter", percentage: 25, color: "#a855f7" },
          { category: "Shared State", percentage: 10, color: "#00e5ff" },
        ],
      },
      minimization: {
        originalStepsCount: 10,
        minimizedStepsCount: 3,
        reductionPercentage: 70.0,
        reproductionSeed: "0x89AB12CD",
        originalSequence: [
          "1. Initialize environment",
          "2. Seed database records",
          "3. Run concurrent batch",
          "4. Verify state",
        ],
        minimizedSequence: [
          "1. Seed single record",
          "2. Run minimal race with seed 0x89AB12CD",
        ],
        eliminatedSteps: [],
      },
      verification: {
        isVerified: false,
        totalRuns: 0,
        passedRuns: 0,
        failedRuns: 0,
        targetThreshold: 50,
        perturbationParams: {
          threadJitter: true,
          clockSkewMs: 30,
          cpuThrottlePercent: 50,
          memoryPressureMb: 128,
        },
        verificationLog: [
          `[INIT] Investigation launched for ${payload.testName}`,
        ],
      },
      evidenceLogs: [
        {
          timestamp: new Date().toISOString(),
          level: "INFO",
          message: `Investigation ${newId} initiated for ${payload.testName}`,
          source: "wobble-core",
        },
      ],
      rawStackTrace: `${payload.testFile}:42: AssertionError: Expected condition not satisfied in concurrent run`,
    };

    investigationsStore.unshift(newInv);

    // Add telemetry event
    telemetryStore.unshift({
      id: `te-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: "DETECTION",
      message: `New investigation ${newId} queued for ${payload.testName}`,
      investigationId: newId,
      testName: payload.testName,
      tag: "NEW",
    });

    return newInv;
  }

  // Run Fix Verification Simulation
  async runFixVerification(id: string, additionalRuns: number = 20): Promise<Investigation> {
    if (!this.isMock && this.baseUrl) {
      try {
        const res = await fetch(`${this.baseUrl}/investigations/${id}/verify/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ runs: additionalRuns }),
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn("Live API unavailable, falling back to mock adapter", e);
      }
    }

    await new Promise((r) => setTimeout(r, 400));
    const idx = investigationsStore.findIndex((i) => i.id === id);
    if (idx === -1) throw new Error("Investigation not found");

    const inv = investigationsStore[idx];
    const prevRuns = inv.verification.totalRuns;
    const newTotal = prevRuns + additionalRuns;
    const isNowVerified = newTotal >= inv.verification.targetThreshold;

    inv.verification = {
      ...inv.verification,
      totalRuns: newTotal,
      passedRuns: newTotal, // Simulated clean patch runs
      failedRuns: 0,
      isVerified: isNowVerified,
      verifiedAt: isNowVerified ? new Date().toISOString() : undefined,
      verificationLog: [
        ...inv.verification.verificationLog,
        `[VERIFY-BATCH] Executed ${additionalRuns} additional perturbation runs. Passed: ${additionalRuns}/0. Total clean: ${newTotal}/${inv.verification.targetThreshold}.`,
        ...(isNowVerified
          ? [`[SUCCESS] Target threshold reached (${newTotal}/${inv.verification.targetThreshold}). Fix verified under thread jitter and clock skew.`]
          : []),
      ],
    };

    if (isNowVerified) {
      inv.status = "VERIFIED";
      inv.stage = "VERIFY";
    }

    // Telemetry event
    telemetryStore.unshift({
      id: `te-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: "VERIFICATION",
      message: `${inv.id}: Verification batch completed. ${newTotal}/${inv.verification.targetThreshold} runs clean.`,
      investigationId: inv.id,
      testName: inv.testName,
      tag: isNowVerified ? "VERIFIED" : "VERIFYING",
    });

    return { ...inv };
  }

  // Cancel Investigation
  async cancelInvestigation(id: string): Promise<Investigation> {
    await new Promise((r) => setTimeout(r, 200));
    const idx = investigationsStore.findIndex((i) => i.id === id);
    if (idx === -1) throw new Error("Investigation not found");

    investigationsStore[idx].status = "INCONCLUSIVE";
    return { ...investigationsStore[idx] };
  }

  // Flaky Test Inventory
  async getFlakyTests(filters?: FlakyTestFilterParams): Promise<FlakyTestSummary[]> {
    if (!this.isMock && this.baseUrl) {
      try {
        const res = await fetch(`${this.baseUrl}/tests/`);
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn("Live API unavailable, falling back to mock adapter", e);
      }
    }

    await new Promise((r) => setTimeout(r, 100));
    let list = [...flakyTestsStore];

    if (filters?.query) {
      const q = filters.query.toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.file.toLowerCase().includes(q) ||
          t.repository.toLowerCase().includes(q) ||
          t.suspectedCause.toLowerCase().includes(q)
      );
    }

    if (filters?.repository && filters.repository !== "ALL") {
      list = list.filter((t) => t.repository === filters.repository);
    }

    if (filters?.severity && filters.severity !== "ALL") {
      list = list.filter((t) => t.severity === filters.severity);
    }

    if (filters?.minFlakiness) {
      list = list.filter((t) => t.flakinessRate >= (filters.minFlakiness || 0));
    }

    return list;
  }

  // Live Telemetry Stream
  async getTelemetryStream(): Promise<TelemetryEvent[]> {
    await new Promise((r) => setTimeout(r, 80));
    return [...telemetryStore];
  }

  // Platform Settings
  async getSettings(): Promise<PlatformSettings> {
    await new Promise((r) => setTimeout(r, 80));
    return { ...settingsStore };
  }

  async updateSettings(settings: Partial<PlatformSettings>): Promise<PlatformSettings> {
    await new Promise((r) => setTimeout(r, 150));
    settingsStore = {
      ...settingsStore,
      ...settings,
      repositoryConfig: {
        ...settingsStore.repositoryConfig,
        ...(settings.repositoryConfig || {}),
      },
      testExecution: {
        ...settingsStore.testExecution,
        ...(settings.testExecution || {}),
      },
      perturbation: {
        ...settingsStore.perturbation,
        ...(settings.perturbation || {}),
      },
      notifications: {
        ...settingsStore.notifications,
        ...(settings.notifications || {}),
      },
      theme: {
        ...settingsStore.theme,
        ...(settings.theme || {}),
      },
      apiConnection: {
        ...settingsStore.apiConnection,
        ...(settings.apiConnection || {}),
      },
    };
    return { ...settingsStore };
  }

  // Test Connection to Backend
  async testBackendConnection(customUrl?: string): Promise<{ success: boolean; latencyMs: number; message: string }> {
    const url = customUrl || this.baseUrl || "http://localhost:8000/api/v1";
    const start = performance.now();
    try {
      const res = await fetch(`${url}/health/`, { method: "GET", signal: AbortSignal.timeout(3000) });
      const latency = Math.round(performance.now() - start);
      if (res.ok) {
        return { success: true, latencyMs: latency, message: `Connected to Django REST Framework backend at ${url}` };
      }
      return { success: false, latencyMs: latency, message: `Server responded with HTTP ${res.status}` };
    } catch {
      const latency = Math.round(performance.now() - start);
      return {
        success: false,
        latencyMs: latency,
        message: `Could not connect to ${url}. Mock Adapter remains active and operational.`,
      };
    }
  }
}

export const api = new WobbleApiService();

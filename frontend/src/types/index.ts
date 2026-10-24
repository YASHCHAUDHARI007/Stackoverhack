export type InvestigationStage =
  | "DETECT"
  | "REPRODUCE"
  | "MINIMIZE"
  | "DIAGNOSE"
  | "VERIFY";

export type InvestigationStatus =
  | "INVESTIGATING"
  | "REPRODUCED"
  | "MINIMIZED"
  | "DIAGNOSED"
  | "VERIFIED"
  | "FAILED"
  | "INCONCLUSIVE";

export type TestRunStatus = "PASSED" | "FAILED" | "TIMEOUT" | "ERROR";

export type FlakinessSeverity = "HIGH" | "MEDIUM" | "LOW";

export interface ExecutionRun {
  id: string;
  runIndex: number;
  status: TestRunStatus;
  durationMs: number;
  seed: string;
  workerId: string;
  orderIndex: number;
  cpuThrottle: number; // e.g., 1.0 (no throttle) or 0.5
  memoryMb: number;
  timestamp: string;
  stdoutSnippet?: string;
  stderrSnippet?: string;
}

export interface RootCauseHypothesis {
  title: string;
  category:
    | "RACE_CONDITION"
    | "SHARED_MUTABLE_STATE"
    | "TIMING_DEPENDENCY"
    | "ORDER_DEPENDENT"
    | "RESOURCE_CONTENTION";
  confidence: number; // 0 - 100
  isConfirmed: boolean; // Confirmed empirically vs AI-generated hypothesis
  description: string;
  evidencePoints: {
    id: string;
    label: string;
    file?: string;
    line?: number;
    detail: string;
    snippet?: string;
  }[];
  recommendedFix: string;
  categoryDistribution: {
    category: string;
    percentage: number;
    color: string;
  }[];
}

export interface MinimizationResult {
  originalStepsCount: number;
  minimizedStepsCount: number;
  reductionPercentage: number;
  reproductionSeed: string;
  originalSequence: string[];
  minimizedSequence: string[];
  eliminatedSteps: {
    step: string;
    reason: string;
  }[];
}

export interface VerificationResult {
  isVerified: boolean;
  totalRuns: number;
  passedRuns: number;
  failedRuns: number;
  targetThreshold: number; // e.g. 50
  perturbationParams: {
    threadJitter: boolean;
    clockSkewMs: number;
    cpuThrottlePercent: number;
    memoryPressureMb: number;
  };
  verifiedAt?: string;
  verificationLog: string[];
}

export interface LogEntry {
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR" | "DEBUG";
  message: string;
  source?: string;
}

export interface Investigation {
  id: string; // e.g. "INV-8042"
  testId: string;
  testName: string;
  testFile: string;
  repository: string;
  branch: string;
  commitHash: string;
  author: string;
  status: InvestigationStatus;
  stage: InvestigationStage;
  failureRate: number; // 0 - 100%
  totalExecutions: number;
  failedExecutions: number;
  startedAt: string;
  durationMs: number;
  severity: FlakinessSeverity;
  runs: ExecutionRun[];
  hypothesis: RootCauseHypothesis;
  minimization: MinimizationResult;
  verification: VerificationResult;
  evidenceLogs: LogEntry[];
  rawStackTrace: string;
}

export interface FlakyTestSummary {
  id: string;
  name: string;
  file: string;
  repository: string;
  branch: string;
  executionCount: number;
  failureCount: number;
  flakinessRate: number;
  confidenceInterval: [number, number]; // [low, high]
  suspectedCause: string;
  lastObservedFailure: string;
  investigationStatus: InvestigationStatus;
  activeInvestigationId?: string;
  severity: FlakinessSeverity;
}

export interface Repository {
  id: string;
  name: string;
  defaultBranch: string;
  scannedTestsCount: number;
  flakyTestsCount: number;
  healthScore: number;
}

export interface TelemetryEvent {
  id: string;
  timestamp: string;
  type:
    | "DETECTION"
    | "REPRODUCTION"
    | "MINIMIZATION"
    | "DIAGNOSIS"
    | "VERIFICATION"
    | "SYSTEM";
  message: string;
  investigationId?: string;
  testName?: string;
  tag?: string;
}

export interface PlatformSettings {
  repositoryConfig: {
    connectedRepos: string[];
    autoScanOnPR: boolean;
    quarantineFlakyTests: boolean;
  };
  testExecution: {
    maxReproductionIterations: number;
    parallelWorkers: number;
    seedGenerator: "PCG64" | "MERSENNE_TWISTER" | "XOROSHIRO";
    sandboxMode: "CONTAINER" | "MICROVM" | "HOST_ISOLATED";
  };
  perturbation: {
    enableThreadJitter: boolean;
    maxClockSkewMs: number;
    memoryPressureSimulation: boolean;
  };
  notifications: {
    slackWebhookUrl: string;
    emailAlerts: boolean;
    pagerDutyKey: string;
    notifyOnNewFlake: boolean;
    notifyOnVerifiedFix: boolean;
  };
  theme: {
    atmosphericEffects: boolean;
    particlesEnabled: boolean;
    density: "COMPACT" | "BALANCED" | "COMFORTABLE";
    reducedMotion: boolean;
  };
  apiConnection: {
    baseUrl: string;
    isMockMode: boolean;
    lastPingLatencyMs?: number;
    status: "CONNECTED" | "DISCONNECTED" | "MOCK";
  };
}

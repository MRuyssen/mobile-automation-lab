export interface FailureInfo {
  type: "selector" | "timing" | "gesture" | "environment" | "vendor" | "assertion";
  message: string;
}

export interface ToolVersions {
  appium: string | null;
  uiautomator2: string | null;
  xcuitest: string | null;
  webdriverio: string | null;
  playwright: string | null;
  maestro: string | null;
}

export interface Artifacts {
  video: string | null;
  screenshot: string | null;
  sessionUrl: string | null;
}

export interface RunRecord {
  runId: string;
  flowId: string;
  case: string;
  tool: "appium" | "maestro";
  platform: "android" | "ios";
  target: "local" | "browserstack" | "testmu";
  device: string;
  osVersion: string;
  status: "passed" | "failed" | "blocked";
  cold: boolean;
  durationMs: number;
  sessionCreateMs: number | null;
  queueMs: number | null;
  failure: FailureInfo | null;
  toolVersions: ToolVersions;
  appVersion: string;
  artifacts: Artifacts;
  notes: string;
}

export function generateRunId(
  flowId: string,
  caseName: string,
  tool: string,
  platform: string,
  target: string,
  seq: number,
): string {
  const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19) + "Z";
  const seqStr = String(seq).padStart(2, "0");
  return `${ts}_${flowId}_${caseName}_${tool}_${platform}_${target}_${seqStr}`;
}

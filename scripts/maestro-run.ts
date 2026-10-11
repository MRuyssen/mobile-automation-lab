import { execSync } from "node:child_process";
import { readFileSync, mkdirSync, readdirSync } from "node:fs";
import path from "node:path";
import type { RunRecord, FailureInfo } from "@mal/core";
import { generateRunId, writeRunRecord, APP_VERSION } from "@mal/core";

const platform = process.argv[2];
if (platform !== "android" && platform !== "ios") {
  console.error("Usage: tsx scripts/maestro-run.ts <android|ios>");
  process.exit(1);
}

const ROOT = path.resolve(import.meta.dirname, "..");
const FLOWS_DIR = path.join(ROOT, "maestro", "flows");
const JUNIT_DIR = path.join(ROOT, "test-results", "maestro-junit");

mkdirSync(JUNIT_DIR, { recursive: true });

// Run all flows in the flows/ directory
const flowFiles = readdirSync(FLOWS_DIR).filter((f) => f.endsWith(".yaml"));

let seq = 0;
for (const flowFile of flowFiles) {
  const flowPath = path.join(FLOWS_DIR, flowFile);
  const flowId = flowFile.replace(/\.yaml$/, "").replace(/-.*/, "").toUpperCase();

  console.log(`\nRunning ${flowFile} on ${platform}...`);
  const start = Date.now();

  let passed = true;
  let failureMessage = "";

  try {
    execSync(
      `maestro test "${flowPath}" --format junit --output "${JUNIT_DIR}"`,
      { stdio: "inherit", timeout: 180_000 },
    );
  } catch (err) {
    passed = false;
    failureMessage = err instanceof Error ? err.message : String(err);
  }

  const durationMs = Date.now() - start;

  // Try to parse JUnit XML for more detail
  const junitFiles = readdirSync(JUNIT_DIR).filter((f) => f.endsWith(".xml"));
  if (junitFiles.length > 0 && !passed) {
    const latestJunit = junitFiles[junitFiles.length - 1];
    if (latestJunit) {
      try {
        const xml = readFileSync(path.join(JUNIT_DIR, latestJunit), "utf-8");
        const failMatch = xml.match(/<failure[^>]*message="([^"]*?)"/);
        if (failMatch?.[1]) {
          failureMessage = failMatch[1];
        }
      } catch {
        // Ignore parse errors
      }
    }
  }

  seq++;
  let failure: FailureInfo | null = null;
  if (!passed) {
    failure = { type: "assertion", message: failureMessage.slice(0, 500) };
  }

  const record: RunRecord = {
    runId: generateRunId(flowId, "all", "maestro", platform, "local", seq),
    flowId,
    case: "all",
    tool: "maestro",
    platform,
    target: "local",
    device: platform === "android" ? "emulator" : "simulator",
    osVersion: "",
    status: passed ? "passed" : "failed",
    cold: seq === 1,
    durationMs,
    sessionCreateMs: null,
    queueMs: null,
    failure,
    toolVersions: {
      appium: null,
      uiautomator2: null,
      xcuitest: null,
      webdriverio: null,
      playwright: null,
      maestro: "2.10.0",
    },
    appVersion: APP_VERSION,
    artifacts: { video: null, screenshot: null, sessionUrl: null },
    notes: "",
  };

  const filePath = writeRunRecord(record);
  console.log(`Run record: ${filePath}`);
}

console.log(`\nDone. ${seq} flow(s) executed.`);

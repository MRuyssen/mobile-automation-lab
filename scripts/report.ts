import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import path from "node:path";
import type { RunRecord } from "@mal/core";

const ROOT = path.resolve(import.meta.dirname, "..");
const RUNS_DIR = path.join(ROOT, "results", "runs");
const REPORT_PATH = path.join(ROOT, "results", "REPORT.md");

function loadRecords(): RunRecord[] {
  if (!existsSync(RUNS_DIR)) return [];
  return readdirSync(RUNS_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(readFileSync(path.join(RUNS_DIR, f), "utf-8")) as RunRecord);
}

function groupBy(records: RunRecord[]): Map<string, RunRecord[]> {
  const map = new Map<string, RunRecord[]>();
  for (const r of records) {
    const key = `${r.flowId}|${r.case}|${r.tool}|${r.platform}|${r.target}`;
    const arr = map.get(key) ?? [];
    arr.push(r);
    map.set(key, arr);
  }
  return map;
}

function passRate(records: RunRecord[]): string {
  const passed = records.filter((r) => r.status === "passed").length;
  return `${passed}/${records.length} (${Math.round((passed / records.length) * 100)}%)`;
}

function avgDuration(records: RunRecord[]): string {
  const durations = records.map((r) => r.durationMs);
  const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
  return `${Math.round(avg)}ms`;
}

function avgSessionCreate(records: RunRecord[]): string {
  const vals = records.map((r) => r.sessionCreateMs).filter((v): v is number => v !== null);
  if (vals.length === 0) return "N/A";
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  return `${Math.round(avg)}ms`;
}

function generateReport(records: RunRecord[]): string {
  const lines: string[] = [];
  const now = new Date().toISOString().split("T")[0];

  lines.push("# Comparison Report");
  lines.push("");
  lines.push(`Generated: ${now} | Records: ${records.length}`);
  lines.push("");

  // Summary table
  lines.push("## 1. Summary");
  lines.push("");
  lines.push("*Recommendation pending — data collection in progress.*");
  lines.push("");

  // Local results
  const localRecords = records.filter((r) => r.target === "local");
  if (localRecords.length > 0) {
    lines.push("## 3. Local Results");
    lines.push("");
    lines.push("| Flow | Case | Tool | Platform | Pass Rate | Avg Duration | Avg Session Create |");
    lines.push("|---|---|---|---|---|---|---|");

    const groups = groupBy(localRecords);
    for (const [key, recs] of groups) {
      const parts = key.split("|");
      lines.push(
        `| ${parts[0]} | ${parts[1]} | ${parts[2]} | ${parts[3]} | ${passRate(recs)} | ${avgDuration(recs)} | ${avgSessionCreate(recs)} |`,
      );
    }
    lines.push("");
  }

  // Failures
  const failures = records.filter((r) => r.failure);
  if (failures.length > 0) {
    lines.push("## Failures");
    lines.push("");
    for (const r of failures) {
      lines.push(`- **${r.runId}**: ${r.failure?.type} — ${r.failure?.message}`);
    }
    lines.push("");
  }

  // Cloud results placeholder
  lines.push("## 6. Cloud Results");
  lines.push("");
  lines.push("*No cloud runs yet (S3).*");
  lines.push("");

  lines.push("## 8. Threats to Validity");
  lines.push("");
  lines.push("- Both tools authored by Claude Code; authoring time is indicative only.");
  lines.push("- Local emulator performance may differ from cloud real devices.");
  lines.push("");

  return lines.join("\n");
}

function main(): void {
  const records = loadRecords();
  console.log(`Loaded ${records.length} run records.`);

  mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  const report = generateReport(records);
  writeFileSync(REPORT_PATH, report + "\n");
  console.log(`Report written to ${REPORT_PATH}`);
}

main();

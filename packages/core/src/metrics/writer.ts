import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { RunRecord } from "./record.js";

const RUNS_DIR = path.resolve(process.cwd(), "results", "runs");

export function writeRunRecord(record: RunRecord): string {
  mkdirSync(RUNS_DIR, { recursive: true });
  const filePath = path.join(RUNS_DIR, `${record.runId}.json`);
  writeFileSync(filePath, JSON.stringify(record, null, 2) + "\n");
  return filePath;
}

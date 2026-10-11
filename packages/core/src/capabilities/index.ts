import type { Platform, Target } from "../targets.js";
import { localCapabilities } from "./local.js";

export function buildCapabilities(
  platform: Platform,
  target: Target,
): Record<string, unknown> {
  switch (target) {
    case "local":
      return localCapabilities(platform);
    case "browserstack":
    case "testmu":
      throw new Error(`${target} capabilities not implemented yet (S3)`);
  }
}

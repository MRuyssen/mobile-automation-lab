import { test as base, expect } from "@playwright/test";
import { remote } from "webdriverio";
import type { Platform, Target, RunRecord, FailureInfo } from "@mal/core";
import {
  buildCapabilities,
  resetApp,
  generateRunId,
  writeRunRecord,
  APP_VERSION,
} from "@mal/core";
import type { TestDataProvider } from "@mal/test-data";
import { StaticProvider } from "@mal/test-data";
import { NavigationScreen } from "../screens/Navigation.screen.js";
import { LoginScreen } from "../screens/Login.screen.js";

export interface Screens {
  navigation: NavigationScreen;
  login: LoginScreen;
}

type WorkerFixtures = {
  platform: Platform;
  target: Target;
  device: string;
  driver: WebdriverIO.Browser;
  sessionCreateMs: number;
};

type TestFixtures = {
  data: TestDataProvider;
  screens: Screens;
};

let seq = 0;

export const test = base.extend<TestFixtures, WorkerFixtures>({
  platform: ["android" as Platform, { option: true, scope: "worker" }],
  target: ["local" as Target, { option: true, scope: "worker" }],
  device: ["emulator", { option: true, scope: "worker" }],

  driver: [async ({ platform, target }, use) => {
    const opts = buildCapabilities(platform, target);
    const start = Date.now();
    const driver = await remote(opts as unknown as Parameters<typeof remote>[0]);
    const elapsed = Date.now() - start;
    (driver as unknown as Record<string, unknown>).__sessionCreateMs = elapsed;

    await use(driver);

    try {
      await driver.deleteSession();
    } catch {
      // Session may already be closed
    }
  }, { scope: "worker", timeout: 300_000 }],

  sessionCreateMs: [async ({ driver }, use) => {
    const ms = (driver as unknown as Record<string, unknown>).__sessionCreateMs;
    await use(typeof ms === "number" ? ms : 0);
  }, { scope: "worker" }],

  data: async ({}, use) => {
    await use(StaticProvider);
  },

  screens: async ({ driver, platform }, use) => {
    await use({
      navigation: new NavigationScreen(driver, platform),
      login: new LoginScreen(driver, platform),
    });
  },
});

// Auto-fixture: reset app before each test
test.beforeEach(async ({ driver, platform }) => {
  await resetApp(driver, platform);
});

// Auto-fixture: evidence + metrics after each test
test.afterEach(async ({ driver, platform, target, device, sessionCreateMs }, testInfo) => {
  // Evidence: on failure attach screenshot and page source
  if (testInfo.status !== testInfo.expectedStatus) {
    try {
      const screenshot = await driver.takeScreenshot();
      await testInfo.attach("screenshot", {
        body: Buffer.from(screenshot, "base64"),
        contentType: "image/png",
      });
    } catch {
      // Driver may be gone
    }
    try {
      const source = await driver.getPageSource();
      await testInfo.attach("page-source", {
        body: source,
        contentType: "application/xml",
      });
    } catch {
      // Driver may be gone
    }
  }

  // Metrics: write run record
  const titleMatch = testInfo.title.match(/^(F\d+)\s+case\s+(\w+)/);
  const flowId = titleMatch?.[1] ?? "F?";
  const caseName = titleMatch?.[2] ?? "?";

  seq++;
  const runId = generateRunId(flowId, caseName, "appium", platform, target, seq);

  let failure: FailureInfo | null = null;
  if (testInfo.status === "failed") {
    const msg = testInfo.errors.map((e) => e.message).join("; ");
    failure = { type: "assertion", message: msg.slice(0, 500) };
  }

  const record: RunRecord = {
    runId,
    flowId,
    case: caseName,
    tool: "appium",
    platform,
    target,
    device,
    osVersion: "",
    status: testInfo.status === "passed" ? "passed" : "failed",
    cold: seq === 1,
    durationMs: testInfo.duration,
    sessionCreateMs,
    queueMs: null,
    failure,
    toolVersions: {
      appium: "3.8.0",
      uiautomator2: "8.7.0",
      xcuitest: null,
      webdriverio: "9.32.0",
      playwright: "1.63.0",
      maestro: null,
    },
    appVersion: APP_VERSION,
    artifacts: { video: null, screenshot: null, sessionUrl: null },
    notes: "",
  };

  const filePath = writeRunRecord(record);
  console.log(`Run record: ${filePath}`);
});

export { expect };

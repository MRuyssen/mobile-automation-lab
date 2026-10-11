import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "specs",
  timeout: 120_000,
  retries: 0,
  workers: 1,
  reporter: [["list"], ["json", { outputFile: "test-results/results.json" }]],
  projects: [
    {
      name: "android-local",
      use: {
        platform: "android",
        target: "local",
        device: "emulator",
      } as Record<string, string>,
    },
    {
      name: "ios-local",
      use: {
        platform: "ios",
        target: "local",
        device: "simulator",
      } as Record<string, string>,
    },
  ],
});

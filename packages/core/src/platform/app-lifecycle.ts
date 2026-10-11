import type { Platform } from "../targets.js";
import { APP_IDS } from "../app-ids.js";

/** Terminate the app process. */
export async function terminateApp(
  driver: WebdriverIO.Browser,
  platform: Platform,
): Promise<void> {
  const bundleId = APP_IDS[platform];
  await driver.execute("mobile: terminateApp", { bundleId });
}

/** Activate (bring to foreground) the app. */
export async function activateApp(
  driver: WebdriverIO.Browser,
  platform: Platform,
): Promise<void> {
  const bundleId = APP_IDS[platform];
  await driver.execute("mobile: activateApp", { bundleId });
}

/** Reset the app by terminating and re-activating. */
export async function resetApp(
  driver: WebdriverIO.Browser,
  platform: Platform,
): Promise<void> {
  await terminateApp(driver, platform);
  await activateApp(driver, platform);
}

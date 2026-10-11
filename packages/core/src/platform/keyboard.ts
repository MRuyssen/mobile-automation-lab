import type { Platform } from "../targets.js";

/** Hide the on-screen keyboard if visible. */
export async function hideKeyboard(
  driver: WebdriverIO.Browser,
  platform: Platform,
): Promise<void> {
  if (platform === "android") {
    try {
      await driver.hideKeyboard();
    } catch {
      // Keyboard may not be visible — ignore
    }
    return;
  }

  // iOS: hide by tapping "Done" / "Return" or pressing the keyboard button
  try {
    await driver.hideKeyboard();
  } catch {
    // Fallback: tap outside input area
    try {
      const screen = await driver.$("~Login-screen");
      await screen.click();
    } catch {
      // ignore
    }
  }
}

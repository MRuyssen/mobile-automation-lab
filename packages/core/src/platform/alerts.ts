import type { Platform } from "../targets.js";

/**
 * Get alert text. On iOS, uses the built-in alert commands.
 * On Android, alerts are ordinary views — read from `android:id/message`.
 */
export async function getAlertText(
  driver: WebdriverIO.Browser,
  platform: Platform,
): Promise<{ title: string; message: string }> {
  if (platform === "ios") {
    const text = await driver.getAlertText();
    // iOS alert text format: "Title\nMessage"
    const parts = text.split("\n");
    return {
      title: parts[0] ?? "",
      message: parts.slice(1).join("\n"),
    };
  }

  // Android: alerts are views with resource ids
  const title = await driver.$("android:id/alertTitle").getText();
  const message = await driver.$("android:id/message").getText();
  return { title, message };
}

/** Accept (tap OK/positive button) the current alert. */
export async function acceptAlert(
  driver: WebdriverIO.Browser,
  platform: Platform,
): Promise<void> {
  if (platform === "ios") {
    await driver.acceptAlert();
    return;
  }
  // Android: tap the positive button
  await driver.$("android:id/button1").click();
}

/** Dismiss (tap Cancel/negative button) the current alert. */
export async function dismissAlert(
  driver: WebdriverIO.Browser,
  platform: Platform,
): Promise<void> {
  if (platform === "ios") {
    await driver.dismissAlert();
    return;
  }
  await driver.$("android:id/button2").click();
}

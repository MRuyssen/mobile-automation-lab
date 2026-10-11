import type { Platform } from "@mal/core";
import { el } from "@mal/core";

export class NavigationScreen {
  constructor(
    private driver: WebdriverIO.Browser,
    readonly platform: Platform,
  ) {}

  /** Tap a bottom tab by its accessibility label. */
  async tapTab(tabName: string): Promise<void> {
    const tab = el(this.driver, tabName);
    await tab.waitForDisplayed({ timeout: 10_000 });
    await tab.click();
  }

  /** Wait for a screen to be visible by its accessibility id. */
  async waitForScreen(screenId: string, timeout = 10_000): Promise<void> {
    const screen = el(this.driver, screenId);
    await screen.waitForDisplayed({ timeout });
  }
}

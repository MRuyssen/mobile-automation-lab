import type { ChainablePromiseElement } from "webdriverio";
import type { Platform } from "../targets.js";

/** Accessibility id selector — works on both platforms via `~id`. */
export function el(driver: WebdriverIO.Browser, id: string): ChainablePromiseElement {
  return driver.$(`~${id}`);
}

/** Text-based selector — platform-specific strategy. */
export function byText(
  driver: WebdriverIO.Browser,
  text: string,
  platform: Platform,
): ChainablePromiseElement {
  if (platform === "android") {
    return driver.$(`android=new UiSelector().text("${text}")`);
  }
  return driver.$(`-ios predicate string:label == "${text}"`);
}

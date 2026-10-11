import path from "node:path";
import type { Platform } from "../targets.js";
import { env } from "../config.js";
import { MAIN_ACTIVITY } from "../app-ids.js";

export function localCapabilities(platform: Platform): Record<string, unknown> {
  const port = parseInt(env("APPIUM_PORT", "4723"), 10);

  if (platform === "android") {
    const apkPath = path.resolve(
      process.cwd(),
      "apps",
      "android.wdio.native.app.v2.2.0.apk",
    );
    return {
      hostname: "127.0.0.1",
      port,
      capabilities: {
        platformName: "Android",
        "appium:automationName": "UiAutomator2",
        "appium:app": apkPath,
        "appium:avd": env("ANDROID_AVD", "Medium_Phone_API_37.0"),
        "appium:appActivity": MAIN_ACTIVITY,
        "appium:newCommandTimeout": 240,
        "appium:autoGrantPermissions": true,
      },
    };
  }

  // iOS
  const appPath = path.resolve(process.cwd(), "apps", "wdiodemoapp.app");
  return {
    hostname: "127.0.0.1",
    port,
    capabilities: {
      platformName: "iOS",
      "appium:automationName": "XCUITest",
      "appium:app": appPath,
      "appium:deviceName": env("IOS_SIM_DEVICE", "iPhone 16"),
      "appium:platformVersion": env("IOS_VERSION", "18.0"),
      "appium:newCommandTimeout": 240,
      "appium:autoAcceptAlerts": false,
    },
  };
}

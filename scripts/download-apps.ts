import { createWriteStream, existsSync, mkdirSync } from "node:fs";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import { execSync } from "node:child_process";
import path from "node:path";

const VERSION = "2.2.0";
const BASE_URL = `https://github.com/webdriverio/native-demo-app/releases/download/v${VERSION}`;
const APPS_DIR = path.resolve(import.meta.dirname, "..", "apps");

const FILES = {
  apk: {
    url: `${BASE_URL}/android.wdio.native.app.v${VERSION}.apk`,
    filename: `android.wdio.native.app.v${VERSION}.apk`,
  },
  iosZip: {
    url: `${BASE_URL}/ios.simulator.wdio.native.app.v${VERSION}.zip`,
    filename: `ios.simulator.wdio.native.app.v${VERSION}.zip`,
  },
};

async function download(url: string, dest: string): Promise<void> {
  console.log(`Downloading ${url}`);
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok || !res.body) {
    throw new Error(`Failed to download ${url}: ${res.status} ${res.statusText}`);
  }
  const body = Readable.fromWeb(res.body as import("node:stream/web").ReadableStream);
  await pipeline(body, createWriteStream(dest));
  console.log(`  → ${dest}`);
}

async function main(): Promise<void> {
  mkdirSync(APPS_DIR, { recursive: true });

  const apkPath = path.join(APPS_DIR, FILES.apk.filename);
  if (existsSync(apkPath)) {
    console.log(`APK already exists: ${apkPath}`);
  } else {
    await download(FILES.apk.url, apkPath);
  }

  const zipPath = path.join(APPS_DIR, FILES.iosZip.filename);
  if (existsSync(zipPath)) {
    console.log(`iOS zip already exists: ${zipPath}`);
  } else {
    await download(FILES.iosZip.url, zipPath);
  }

  const appDir = path.join(APPS_DIR, "wdiodemoapp.app");
  if (existsSync(appDir)) {
    console.log(`iOS app already extracted: ${appDir}`);
  } else if (existsSync(zipPath)) {
    console.log("Extracting iOS simulator build...");
    try {
      if (process.platform === "win32") {
        execSync(
          `powershell.exe -NoProfile -Command "Expand-Archive -LiteralPath '${zipPath}' -DestinationPath '${APPS_DIR}' -Force"`,
          { stdio: "inherit" },
        );
      } else {
        execSync(`unzip -o "${zipPath}" -d "${APPS_DIR}"`, { stdio: "inherit" });
      }
      console.log(`  → ${appDir}`);
    } catch {
      console.warn("Could not extract iOS zip (may need manual extraction)");
    }
  }

  console.log("Done.");
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});

export type Platform = "android" | "ios";
export type Target = "local" | "browserstack" | "testmu";

export interface TargetConfig {
  platform: Platform;
  target: Target;
  device: string;
}

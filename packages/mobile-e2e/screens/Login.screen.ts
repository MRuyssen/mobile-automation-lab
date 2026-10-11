import type { Platform } from "@mal/core";
import type { User } from "@mal/test-data";
import { el, byText, hideKeyboard } from "@mal/core";

export class LoginScreen {
  constructor(
    private driver: WebdriverIO.Browser,
    private platform: Platform,
  ) {}

  /** Tap the Login tab within the Login screen. */
  async tapLoginTab(): Promise<void> {
    const tab = el(this.driver, "button-login-container");
    await tab.waitForDisplayed({ timeout: 10_000 });
    await tab.click();
  }

  /** Tap the Sign Up tab within the Login screen. */
  async tapSignUpTab(): Promise<void> {
    const tab = el(this.driver, "button-sign-up-container");
    await tab.waitForDisplayed({ timeout: 10_000 });
    await tab.click();
  }

  /** Type email into the email field. */
  async typeEmail(email: string): Promise<void> {
    const field = el(this.driver, "input-email");
    await field.waitForDisplayed({ timeout: 10_000 });
    await field.clearValue();
    await field.setValue(email);
  }

  /** Type password into the password field. */
  async typePassword(password: string): Promise<void> {
    const field = el(this.driver, "input-password");
    await field.waitForDisplayed({ timeout: 10_000 });
    await field.clearValue();
    await field.setValue(password);
  }

  /** Type repeat password (sign-up only). */
  async typeRepeatPassword(password: string): Promise<void> {
    const field = el(this.driver, "input-repeat-password");
    await field.waitForDisplayed({ timeout: 10_000 });
    await field.clearValue();
    await field.setValue(password);
  }

  /** Hide the keyboard. */
  async dismissKeyboard(): Promise<void> {
    await hideKeyboard(this.driver, this.platform);
  }

  /** Tap the LOGIN button. */
  async tapLogin(): Promise<void> {
    const btn = el(this.driver, "button-LOGIN");
    await btn.waitForDisplayed({ timeout: 10_000 });
    await btn.click();
  }

  /** Tap the SIGN UP button. */
  async tapSignUp(): Promise<void> {
    const btn = el(this.driver, "button-SIGN UP");
    await btn.waitForDisplayed({ timeout: 10_000 });
    await btn.click();
  }

  /** Perform a full login flow with the given user credentials. */
  async login(user: User): Promise<void> {
    await this.tapLoginTab();
    await this.typeEmail(user.email);
    await this.typePassword(user.password);
    await this.dismissKeyboard();
    await this.tapLogin();
  }

  /** Perform a full sign-up flow. */
  async signUp(user: User): Promise<void> {
    await this.tapSignUpTab();
    await this.typeEmail(user.email);
    await this.typePassword(user.password);
    await this.typeRepeatPassword(user.password);
    await this.dismissKeyboard();
    await this.tapSignUp();
  }

  /** Check if an error text is displayed. */
  async isErrorVisible(errorText: string): Promise<boolean> {
    try {
      const error = byText(this.driver, errorText, this.platform);
      return await error.isDisplayed();
    } catch {
      return false;
    }
  }
}

import { test, expect } from "../fixtures/index.js";
import { getAlertText, acceptAlert } from "@mal/core";

test.describe("F1 Login", () => {
  test.beforeEach(async ({ screens }) => {
    await screens.navigation.tapTab("Login");
    await screens.navigation.waitForScreen("Login-screen");
  });

  test("F1 case a: valid login", async ({ screens, data, driver, platform }) => {
    const user = await data.users.valid();
    const texts = await data.texts();

    await screens.login.login(user);

    // Wait for the success alert
    await expect.poll(
      async () => {
        try {
          const alert = await getAlertText(driver, platform);
          return alert.title;
        } catch {
          return null;
        }
      },
      { timeout: 15_000, message: "Waiting for login success alert" },
    ).toBe(texts.alerts.loginSuccess.title);

    const alert = await getAlertText(driver, platform);
    expect(alert.message).toBe(texts.alerts.loginSuccess.message);

    await acceptAlert(driver, platform);
  });

  test("F1 case b: validation errors", async ({ screens, data, driver, platform }) => {
    const invalidEmail = await data.users.invalidEmail();
    const shortPwd = await data.users.shortPassword();
    const texts = await data.texts();

    await screens.login.tapLoginTab();
    await screens.login.typeEmail(invalidEmail.email);
    await screens.login.typePassword(shortPwd.password);
    await screens.login.dismissKeyboard();
    await screens.login.tapLogin();

    // Both error texts should be visible
    await expect.poll(
      () => screens.login.isErrorVisible(texts.errors.invalidEmail),
      { timeout: 5_000 },
    ).toBe(true);

    await expect.poll(
      () => screens.login.isErrorVisible(texts.errors.shortPassword),
      { timeout: 5_000 },
    ).toBe(true);

    // No alert should appear (documented 2s wait exception)
    await new Promise((r) => setTimeout(r, 2_000));
    let alertAppeared = false;
    try {
      await getAlertText(driver, platform);
      alertAppeared = true;
    } catch {
      // Expected: no alert
    }
    expect(alertAppeared).toBe(false);
  });

  test("F1 case c: sign-up", async ({ screens, data, driver, platform }, testInfo) => {
    const user = await data.users.uniqueSignUp(testInfo.testId);
    const texts = await data.texts();

    await screens.login.signUp(user);

    // Wait for the sign-up success alert
    await expect.poll(
      async () => {
        try {
          const alert = await getAlertText(driver, platform);
          return alert.title;
        } catch {
          return null;
        }
      },
      { timeout: 15_000, message: "Waiting for sign-up success alert" },
    ).toBe(texts.alerts.signUpSuccess.title);

    const alert = await getAlertText(driver, platform);
    expect(alert.message).toBe(texts.alerts.signUpSuccess.message);

    await acceptAlert(driver, platform);
  });
});

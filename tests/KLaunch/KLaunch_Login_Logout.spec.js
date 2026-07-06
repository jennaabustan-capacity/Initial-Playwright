import { test, expect } from '@playwright/test';

test('KLaunch login, module navigation, and logout', async ({ page }) => {
  test.setTimeout(120_000);
  const stepDelayMs = 2000;
  const testEmail = process.env.TEST_EMAIL;
  const testPassword = process.env.TEST_PASSWORD;
  if (!testEmail) {
    throw new Error('Missing TEST_EMAIL. Set it in your .env file.');
  }
  if (!testPassword) {
    throw new Error('Missing TEST_PASSWORD. Set it in your .env file. If the value starts with #, wrap it in quotes.');
  }

  await test.step('Login to KLaunch', async () => {
    await page.goto('https://test.klaunch.io/#/auth/login');
    await page.getByRole('textbox', { name: 'Email Address' }).fill(testEmail);
    await page.getByRole('textbox', { name: 'Password' }).fill(testPassword);
    await page.getByRole('button', { name: 'Sign In' }).click();
    await expect(page.getByRole('button', { name: 'CHATBOTS' })).toBeVisible();
  });

  await test.step('Open launch cards from dashboard', async () => {
    const firstPopup = page.waitForEvent('popup');
    await page.getByText('keyboard_arrow_right').first().click();
    const page1 = await firstPopup;
    await page1.close();
    await page.waitForTimeout(stepDelayMs);

    const secondPopup = page.waitForEvent('popup');
    await page.getByText('keyboard_arrow_right').nth(1).click();
    const page2 = await secondPopup;
    await page2.close();
    await page.waitForTimeout(stepDelayMs);

    const thirdPopup = page.waitForEvent('popup');
    await page.getByText('keyboard_arrow_right').nth(2).click();
    const page3 = await thirdPopup;
    await page3.close();
    await page.waitForTimeout(stepDelayMs);

    const insightsPopup = page.waitForEvent('popup');
    await page.getByRole('button', { name: 'View Insights' }).click();
    const page4 = await insightsPopup;
    await page4.close();
    await page.waitForTimeout(stepDelayMs);
  });

  await test.step('Click each module so it appears in report', async () => {
    const modules = ['CHATBOTS', 'CHATS', 'AUTOMATION', 'USERS', 'ANALYTICS', 'SETTINGS'];
    for (const moduleName of modules) {
      await page.getByRole('button', { name: moduleName }).click();
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(stepDelayMs);
    }
  });

  await test.step('Logout and verify sign-in screen', async () => {
    await page.getByRole('button').filter({ hasText: /^$/ }).nth(2).click();
    const logoutMenuItem = page.getByRole('menuitem', { name: 'Logout' });
    await expect(logoutMenuItem).toBeVisible();
    await page.waitForTimeout(300);
    await logoutMenuItem.click();
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
  });
});
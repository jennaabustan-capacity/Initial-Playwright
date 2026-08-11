import { test, expect } from '@playwright/test';

test('KLaunch Dashboard', async ({ page }) => {
  test.setTimeout(90000);

  const testEmail = process.env.TEST_EMAIL;
  const testPassword = process.env.TEST_PASSWORD;

  if (!testEmail) {
    throw new Error('Missing TEST_EMAIL in .env');
  }

  if (!testPassword) {
    throw new Error('Missing TEST_PASSWORD in .env');
  }

  // Go to login page
  await page.goto('https://test.klaunch.io/#/auth/login');

  // Fill credentials
  await page.getByRole('textbox', { name: 'Email Address' }).fill(testEmail);
  await page.getByRole('textbox', { name: 'Password' }).fill(testPassword);

  // Login
  await page.getByRole('button', { name: 'Sign In' }).click();

  // Wait until navigation completes
  await page.waitForLoadState('networkidle');

  // Print current URL (helps with debugging)
  console.log('Current URL:', page.url());

  // Verify login was successful
  await expect(page).toHaveURL(/dashboard/);

  // Wait until View Insights is visible
  await expect(
    page.getByRole('button', { name: 'View Insights' })
  ).toBeVisible({ timeout: 30000 });

  // Click View Insights
  await page.getByRole('button', { name: 'View Insights' }).click();

  // Wait for page to finish loading
  await page.waitForLoadState('networkidle');

  console.log('After clicking View Insights:', page.url());
});
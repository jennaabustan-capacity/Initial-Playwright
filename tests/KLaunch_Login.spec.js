import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  const testEmail = process.env.TEST_EMAIL;
  const testPassword = process.env.TEST_PASSWORD;
  if (!testEmail) {
    throw new Error('Missing TEST_EMAIL. Set it in your .env file.');
  }
  if (!testPassword) {
    throw new Error('Missing TEST_PASSWORD. Set it in your .env file. If the value starts with #, wrap it in quotes.');
  }

  await page.goto('https://test.klaunch.io/#/auth/login');
  await page.getByText('Email Address').click();
  await page.getByRole('textbox', { name: 'Email Address' }).fill(testEmail);
  await page.getByText('Password', { exact: true }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill(testPassword);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.goto('https://test.klaunch.io/#/dashboard/welcome');
});
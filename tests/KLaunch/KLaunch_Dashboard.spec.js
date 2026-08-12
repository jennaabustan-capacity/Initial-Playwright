import { test, expect } from '@playwright/test';

test('KLaunch Dashboard', async ({ page }) => {
  test.setTimeout(120000);

  const testEmail = process.env.TEST_EMAIL;
  const testPassword = process.env.TEST_PASSWORD;

  if (!testEmail) {
    throw new Error('Missing TEST_EMAIL in .env');
  }

  if (!testPassword) {
    throw new Error('Missing TEST_PASSWORD in .env');
  }

  // =========================
  // LOGIN
  // =========================
  await page.goto('https://test.klaunch.io/#/auth/login');

  await page.getByRole('textbox', { name: 'Email Address' }).fill(testEmail);

  await page.getByRole('textbox', { name: 'Password' }).fill(testPassword);

  await page.getByRole('textbox', { name: 'Password' }).press('Enter');

  await page.waitForTimeout(5000);

  console.log('After login:', page.url());

  // =========================
  // HOME
  // =========================
  await page.goto('https://test.klaunch.io/#/dashboard/welcome');

  await page.waitForTimeout(3000);

  console.log('Home:', page.url());

  await expect(
    page.getByRole('button', { name: 'View Insights' })
  ).toBeVisible({ timeout: 30000 });


  // =========================================================
  // VIEW INSIGHTS
  // Opens a new tab
  // =========================================================
  let newPagePromise = page.waitForEvent('popup');

  await page.getByRole('button', { name: 'View Insights' }).click();

  let newPage = await newPagePromise;

  await newPage.waitForLoadState('domcontentloaded');

  await newPage.waitForTimeout(3000);

  console.log('View Insights:', newPage.url());

  await newPage.close();

  console.log('View Insights tab closed.');


  // =========================
  // BACK TO HOME
  // =========================
  await page.goto('https://test.klaunch.io/#/dashboard/welcome');

  await page.waitForTimeout(2000);


  // =========================================================
  // LOAD A TEMPLATE BOT
  // Opens Template Bot modal
  // Navigates to Chatbots page
  // =========================================================
  await page.getByRole('button', { name: 'Load a Template Bot' }).click();

  await page.waitForTimeout(3000);

  console.log('Template Bot / Chatbots:', page.url());

  // Close Template Bot modal
  await page.keyboard.press('Escape');

  await page.waitForTimeout(1000);


  // =========================
  // HOME
  // =========================
  await page.goto('https://test.klaunch.io/#/dashboard/welcome');

  await page.waitForTimeout(2000);


  // =========================================================
  // INTEGRATE WITH APPS
  // Goes to Settings > Integrations
  // =========================================================
  await page.getByText('Integrate with Apps', { exact: true }).click();

  await page.waitForTimeout(3000);

  await expect(page).toHaveURL(
    /\/dashboard\/settings\/integrations/
  );

  console.log('Integrate with Apps:', page.url());


  // =========================
  // HOME
  // =========================
  await page.goto('https://test.klaunch.io/#/dashboard/welcome');

  await page.waitForTimeout(2000);


  // =========================================================
  // DEPLOY YOUR BOT
  // Opens a new tab
  // =========================================================
  newPagePromise = page.waitForEvent('popup');

  await page.getByText('Deploy Your Bot', { exact: true }).click();

  newPage = await newPagePromise;

  await newPage.waitForLoadState('domcontentloaded');

  await newPage.waitForTimeout(3000);

  console.log('Deploy Your Bot:', newPage.url());

  await newPage.close();

  console.log('Deploy Your Bot tab closed.');


  // =========================
  // HOME
  // =========================
  await page.goto('https://test.klaunch.io/#/dashboard/welcome');

  await page.waitForTimeout(2000);


  // =========================================================
  // INVITE COLLEAGUES
  // Opens modal
  // =========================================================
  await page.getByText('Invite Colleagues', { exact: true }).click();

  await page.waitForTimeout(1500);

  console.log('Invite Colleagues modal opened.');

  // Close modal
  await page.keyboard.press('Escape');

  await page.waitForTimeout(1000);


  // =========================================================
  // TEST YOUR BOT
  // Opens modal
  // =========================================================
  await page.getByText('Test Your Bot', { exact: true }).click();

  await page.waitForTimeout(1500);

  console.log('Test Your Bot modal opened.');

  // Click OK to close modal
  await page.getByRole('button', { name: 'OK' }).click();

  await page.waitForTimeout(1000);


  // =========================================================
  // ENTERPRISE FEATURES
  // Opens a new tab
  // =========================================================
  newPagePromise = page.waitForEvent('popup');

  await page.getByText('Enterprise Features', { exact: true }).click();

  newPage = await newPagePromise;

  await newPage.waitForLoadState('domcontentloaded');

  await newPage.waitForTimeout(3000);

  console.log('Enterprise Features:', newPage.url());

  await newPage.close();

  console.log('Enterprise Features tab closed.');


  // =========================
  // HOME
  // =========================
  await page.goto('https://test.klaunch.io/#/dashboard/welcome');

  await page.waitForTimeout(2000);


  // =========================================================
  // VIEW TECH UPDATES
  // Opens a new tab
  // =========================================================
  newPagePromise = page.waitForEvent('popup');

  await page.getByText('View Tech Updates', { exact: true }).click();

  newPage = await newPagePromise;

  await newPage.waitForLoadState('domcontentloaded');

  await newPage.waitForTimeout(3000);

  console.log('View Tech Updates:', newPage.url());

  await newPage.close();

  console.log('View Tech Updates tab closed.');


  // =========================
  // HOME
  // =========================
  await page.goto('https://test.klaunch.io/#/dashboard/welcome');

  await page.waitForTimeout(2000);


  // =========================================================
  // TRAININGS
  // Opens a new tab
  // =========================================================
  newPagePromise = page.waitForEvent('popup');

  await page.getByText('Trainings', { exact: true }).click();

  newPage = await newPagePromise;

  await newPage.waitForLoadState('domcontentloaded');

  await newPage.waitForTimeout(3000);

  console.log('Trainings:', newPage.url());

  await newPage.close();

  console.log('Trainings tab closed.');


  // =========================
  // HOME
  // =========================
  await page.goto('https://test.klaunch.io/#/dashboard/welcome');

  await page.waitForTimeout(2000);


  // =========================================================
  // LATEST AI INSIGHTS
  // Opens a new tab
  // =========================================================
  newPagePromise = page.waitForEvent('popup');

  await page.getByText('Latest AI Insights', { exact: true }).click();

  newPage = await newPagePromise;

  await newPage.waitForLoadState('domcontentloaded');

  await newPage.waitForTimeout(3000);

  console.log('Latest AI Insights:', newPage.url());

  await newPage.close();

  console.log('Latest AI Insights tab closed.');


  // =========================
  // HOME
  // =========================
  await page.goto('https://test.klaunch.io/#/dashboard/welcome');

  await page.waitForTimeout(2000);


  // =========================================================
  // VIEW CAMPAIGNS
  // Goes to Automation Overview
  // =========================================================
  await page.getByText('View Campaigns', { exact: true }).click();

  await page.waitForTimeout(3000);

  await expect(page).toHaveURL(
    /\/dashboard\/automation\/overview/
  );

  console.log('View Campaigns:', page.url());


  // =========================
  // HOME
  // =========================
  await page.goto('https://test.klaunch.io/#/dashboard/welcome');

  await page.waitForTimeout(2000);


  // =========================================================
  // VIEW ANALYTICS
  // Goes to Analytics Overview
  // =========================================================
  await page.getByText('View Analytics', { exact: true }).click();

  await page.waitForTimeout(3000);

  await expect(page).toHaveURL(
    /\/dashboard\/analytics/
  );

  console.log('View Analytics:', page.url());


  // =========================
  // HOME
  // =========================
  await page.goto('https://test.klaunch.io/#/dashboard/welcome');

  await page.waitForTimeout(2000);


  // =========================================================
  // CONTACT SUPPORT
  // Opens a new tab
  // =========================================================
  newPagePromise = page.waitForEvent('popup');

  await page.getByText('Contact Support', { exact: true }).click();

  newPage = await newPagePromise;

  await newPage.waitForLoadState('domcontentloaded');

  await newPage.waitForTimeout(3000);

  console.log('Contact Support:', newPage.url());

  await newPage.close();

  console.log('Contact Support tab closed.');


  // =========================
  // HOME
  // =========================
  await page.goto('https://test.klaunch.io/#/dashboard/welcome');

  await page.waitForTimeout(2000);


  // =========================
  // LOGOUT
  // =========================
  await page.getByRole('button').filter({ hasText: /^$/ }).nth(2).click();

  await page.getByRole('menuitem', { name: 'Logout' }).click();

  console.log('Logged out successfully.');
});
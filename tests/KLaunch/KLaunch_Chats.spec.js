import { test, expect } from '@playwright/test';

test('KLaunch Chats Module', async ({ page }) => {

  test.setTimeout(300000);

  // Fail fast on a bad locator instead of waiting for the full test timeout
  page.setDefaultTimeout(20000);
  page.setDefaultNavigationTimeout(30000);

  // =====================================================
  // LOGIN CREDENTIALS
  // =====================================================

  const testEmail = process.env.TEST_EMAIL;
  const testPassword = process.env.TEST_PASSWORD;

  if (!testEmail) {
    throw new Error('Missing TEST_EMAIL in .env');
  }

  if (!testPassword) {
    throw new Error('Missing TEST_PASSWORD in .env');
  }

  // =====================================================
  // HELPER FUNCTIONS
  // =====================================================

  async function searchChat(searchText) {
    const searchBox = page.getByRole('textbox', { name: 'Search' });

    await searchBox.fill(searchText);
    await searchBox.press('Enter');

    await page.waitForTimeout(1000);
  }

  async function openFilters() {
    await page.getByText('filter_list', { exact: true }).click();

    await page.waitForTimeout(500);
  }

  async function resetFilters() {
    await openFilters();

    const resetButton = page.getByRole('button', { name: 'Reset' });

    if (await resetButton.isVisible()) {
      await resetButton.click();

      // Wait for the filter reset and chat list refresh
      await page.waitForTimeout(1500);
    }
  }

  // Click an optional element without hanging the test if it is missing
  async function clickIfVisible(locator, label, timeout = 3000) {
    try {
      await locator.waitFor({ state: 'visible', timeout });
      await locator.click();
      console.log(`Clicked: ${label}`);
      return true;
    } catch {
      console.log(`Skipped (not visible): ${label}`);
      return false;
    }
  }

  // =====================================================
  // OPEN CHAT HELPER
  // =====================================================

  async function openChat(chatText) {

    console.log(`Looking for chat: ${chatText}`);

    // STEP 1: Wait for the chat list to refresh
    await page.waitForTimeout(1500);

    // STEP 2: Try to find the chat directly
    let chat = page.getByText(chatText, { exact: false }).first();

    if (await chat.count() > 0) {
      try {
        await chat.scrollIntoViewIfNeeded();
        await expect(chat).toBeVisible({ timeout: 10000 });
        await chat.click();

        console.log(`Opened chat: ${chatText}`);
        return true;
      } catch (error) {
        console.log('Chat was found but could not be opened directly.');
      }
    }

    // STEP 3: Search for the chat
    console.log(`Chat not visible. Searching for: ${chatText}`);

    const searchBox = page.getByRole('textbox', { name: 'Search' });

    // Clear previous search
    await searchBox.fill('');
    await searchBox.press('Enter');
    await page.waitForTimeout(1000);

    // Use the chat ID only
    const chatId = chatText.split(':')[0];
    console.log(`Searching for chat ID: ${chatId}`);

    await searchBox.fill(chatId);
    await searchBox.press('Enter');
    await page.waitForTimeout(1500);

    // STEP 4: Find the chat after searching
    chat = page.getByText(chatText, { exact: false }).first();

    if (await chat.count() === 0) {
      console.log(`Chat "${chatText}" was not found after searching.`);
      return false;
    }

    try {
      await chat.scrollIntoViewIfNeeded();
      await expect(chat).toBeVisible({ timeout: 10000 });
      await chat.click();

      console.log(`Opened chat after search: ${chatText}`);

      // Clear search after opening
      await searchBox.fill('');
      await searchBox.press('Enter');
      await page.waitForTimeout(1000);

      return true;
    } catch (error) {
      console.log(`Chat "${chatText}" was found but could not be opened.`);
      return false;
    }
  }

  // =====================================================
  // BOT FILTER HELPER
  // =====================================================

  async function selectBotFilter(botName) {

    console.log(`Selecting bot filter: ${botName}`);

    // Open Advanced Filtering Options
    const advancedFilteringOptions = page
      .getByText('Advanced Filtering Options', { exact: false })
      .first();

    await expect(advancedFilteringOptions).toBeVisible();
    await advancedFilteringOptions.click();

    await page.waitForTimeout(700);

    // Locate Bot selector
    const botSelect = page
      .locator('mat-select')
      .filter({ hasText: 'Bot' })
      .first();

    let selectedBotSelect = botSelect;

    if (!(await botSelect.isVisible())) {
      selectedBotSelect = page.locator('mat-select:visible').first();
    }

    await expect(selectedBotSelect).toBeVisible();

    // Open Bot dropdown
    await selectedBotSelect.click();
    await page.waitForTimeout(500);

    // Select Bot
    const botOption = page.getByRole('option', {
      name: botName,
      exact: true
    });

    await expect(botOption).toBeVisible({ timeout: 10000 });
    await botOption.click();

    console.log(`Bot selected: ${botName}`);
  }

  // =====================================================
  // LOGIN
  // =====================================================

  console.log('=== LOGIN ===');

  await page.goto('https://test.klaunch.io/#/auth/login');

  await expect(
    page.getByRole('textbox', { name: 'Email Address' })
  ).toBeVisible();

  await page
    .getByRole('textbox', { name: 'Email Address' })
    .fill(testEmail);

  await page
    .getByRole('textbox', { name: 'Password' })
    .fill(testPassword);

  await page.getByRole('button', { name: 'Sign In' }).click();

  await expect(page).toHaveURL(/dashboard/);

  console.log('Login successful.');

  // =====================================================
  // OPEN CHATS
  // =====================================================

  console.log('=== OPEN CHATS ===');

  await page.getByRole('button', { name: 'CHATS' }).click();

  await expect(
    page.getByRole('textbox', { name: 'Search' })
  ).toBeVisible();

  // =====================================================
  // CHAT TYPE
  // =====================================================

  console.log('=== CHAT TYPE ===');

  await page
    .getByRole('combobox', { name: 'Active Chats' })
    .locator('svg')
    .click();

  await page.getByRole('option', { name: 'Archived Chats' }).click();

  await page
    .getByRole('combobox', { name: 'Archived Chats' })
    .locator('svg')
    .click();

  await page.getByRole('option', { name: 'All Chats' }).click();

  await page.waitForTimeout(1000);

  // =====================================================
  // SEARCH TESTS
  // =====================================================

  console.log('=== SEARCH TESTS ===');

  const searchTerms = ['bajen', 'zack', 'rachel', 'tristyn'];

  for (const searchTerm of searchTerms) {

    console.log(`Searching for: ${searchTerm}`);

    await searchChat(searchTerm);

    await expect(
      page.getByRole('textbox', { name: 'Search' })
    ).toHaveValue(searchTerm);
  }

  // Clear search
  await searchChat('');

  // =====================================================
  // BOT FILTER
  // =====================================================

  console.log('=== BOT FILTER ===');

  await openFilters();

  await selectBotFilter('2068BOT');

  await page.getByRole('button', { name: 'Filter' }).click();

  console.log('Bot filter applied.');

  await page.waitForTimeout(1000);

  // Reset Bot Filter
  await resetFilters();

  console.log('Bot filter reset.');

  // =====================================================
  // USER FILTER
  // =====================================================

  console.log('=== USER FILTER ===');

  await openFilters();

  await page.getByRole('textbox', { name: 'First Name' }).fill('jen');

  await page.getByRole('textbox', { name: 'Last Name' }).fill('abustan');

  await page.getByRole('button', { name: 'Filter' }).click();

  console.log('User filter applied.');

  await page.waitForTimeout(1000);

  // Reset User Filter
  await resetFilters();

  console.log('User filter reset.');

  // Close filter panel if still open
  const cancelFilterButton = page.getByRole('button', { name: 'Cancel' });

  if (await cancelFilterButton.isVisible()) {
    await cancelFilterButton.click();
    await page.waitForTimeout(500);
  }

  // =====================================================
  // OPEN CHAT
  // =====================================================

  console.log('=== OPEN CHAT ===');

  const chatOpened = await openChat('4339: AIValidationMaxRetry,');

  if (!chatOpened) {
    throw new Error(
      'Unable to find chat 4339: AIValidationMaxRetry, after resetting filters and searching.'
    );
  }

  // =====================================================
  // NOTES
  // =====================================================

  console.log('=== NOTES ===');

  // Make sure the chat panel has finished loading
  await page.waitForLoadState('networkidle').catch(() => {});

  // Open the Notes tab (Material icon text "note")
  const noteTab = page.getByText('note', { exact: true }).first();
  await expect(noteTab, 'Notes tab/icon not found').toBeVisible({ timeout: 15000 });
  await noteTab.click();

  // Optional UI toggles. These won't hang the test if they aren't there.
  await clickIfVisible(page.getByText('superadmin', { exact: true }).first(), 'superadmin');
  await clickIfVisible(page.getByText('Private', { exact: true }).first(), 'Private');
  await clickIfVisible(page.getByText('Public', { exact: true }).first(), 'Public');

  // Add a note
  const noteBox = page.getByRole('textbox', { name: 'Add Note' });
  await expect(noteBox, 'Add Note textbox not found').toBeVisible({ timeout: 15000 });
  await noteBox.fill('test');

  // exact: true so it doesn't also match "Add Note" or other buttons containing "Add"
  await page.getByRole('button', { name: 'Add', exact: true }).click();
  console.log('Test note added.');

  // Delete the test note
  const noteDeleteButton = page
    .getByRole('button')
    .filter({ hasText: 'delete_forever' })
    .last();

  if (await clickIfVisible(noteDeleteButton, 'delete note')) {
    console.log('Test note deleted.');
  }

  // =====================================================
  // ALERT
  // =====================================================

  console.log('=== ALERT ===');

  const alertSwitch = page.getByRole('switch', { name: 'Alert' });

  await expect(alertSwitch).toBeVisible();

  await alertSwitch.click();
  console.log('Alert enabled.');

  await alertSwitch.click();
  console.log('Alert disabled.');

  // =====================================================
  // FLAGS
  // =====================================================

  console.log('=== FLAGS ===');

  await page.getByText('flag', { exact: true }).click();

  const flagSelect = page.locator('mat-select').last();

  await flagSelect.click();

  await page
    .getByRole('option', { name: '#15thofEachMonth_schedule_trigger' })
    .click();

  await page.getByRole('button', { name: 'Add', exact: true }).click();

  console.log('Test flag added.');

  // Delete test flag
  const flagDeleteButton = page
    .getByText('delete_forever', { exact: true })
    .last();

  if (await flagDeleteButton.isVisible()) {
    await flagDeleteButton.click();
    console.log('Test flag deleted.');
  }

  // =====================================================
  // CALENDAR
  // =====================================================

  console.log('=== CALENDAR ===');

  await page.getByText('calendar_today', { exact: true }).click();

  const infoIcon = page.getByText('info', { exact: true }).first();

  if (await infoIcon.isVisible()) {
    await infoIcon.click();
  }

  // =====================================================
  // ARCHIVE CHAT
  // =====================================================

  console.log('=== ARCHIVE CHAT ===');

  const archiveButton = page.getByRole('button', {
    name: 'Archive',
    exact: true
  });

  if (await archiveButton.isVisible()) {
    await archiveButton.click();
    console.log('Chat archived.');
    await page.waitForTimeout(1000);
  }

  // =====================================================
  // UNARCHIVE CHAT
  // =====================================================

  console.log('=== UNARCHIVE CHAT ===');

  const allChatsDropdown = page.getByRole('combobox', { name: 'All Chats' });

  if (await allChatsDropdown.isVisible()) {

    await allChatsDropdown.locator('svg').click();

    const archivedOption = page
      .getByText('Archived Chats', { exact: true })
      .last();

    if (await archivedOption.isVisible()) {
      await archivedOption.click();
    }
  }

  const unarchiveButton = page.getByRole('button', { name: 'Unarchive' });

  if (await unarchiveButton.isVisible()) {
    await unarchiveButton.click();
    console.log('Chat unarchived.');
    await page.waitForTimeout(1000);
  }

  // Return to All Chats
  const archivedChatsDropdown = page.getByRole('combobox', {
    name: 'Archived Chats'
  });

  if (await archivedChatsDropdown.isVisible()) {

    await archivedChatsDropdown.locator('svg').click();

    await page.getByRole('option', { name: 'All Chats' }).click();
  }

  // =====================================================
  // EVENT LOG
  // =====================================================

  console.log('=== EVENT LOG ===');

  await page.locator('.combo-dropdown-btn').first().click();

  await page.getByRole('button', { name: 'Event Log' }).click();

  const okButton = page.getByRole('button', { name: 'Ok' });

  if (await okButton.isVisible()) {
    await okButton.click();
  }

  // =====================================================
  // DOWNLOAD CHAT HISTORY
  // =====================================================

  console.log('=== DOWNLOAD CHAT HISTORY ===');

  // Cancel Download
  await page.locator('.combo-dropdown-btn').first().click();

  await page
    .getByRole('button', { name: 'Download Chat History' })
    .click();

  await page.getByRole('button', { name: 'Cancel' }).click();

  console.log('Download cancelled successfully.');

  // Re-open the dialog (the cancel above closed it)
  await page.locator('.combo-dropdown-btn').first().click();

  await page
    .getByRole('button', { name: 'Download Chat History' })
    .click();

  // The dialog's main button defaults to CSV. Just click it and move on
  // (TXT and JSON are skipped on purpose).
  await page
    .getByRole('button', { name: /Download CSV/i })
    .first()
    .click();

  console.log('Download CSV button clicked.');

  await page.waitForTimeout(1500);

  // If the dialog is still open after the click, close it so the next steps aren't blocked
  const downloadDialogTitle = page.getByText('Download this user', {
    exact: false
  });

  if (await downloadDialogTitle.isVisible()) {
    await page.getByRole('button', { name: 'Cancel' }).click();
    await page.waitForTimeout(500);
  }

  // =====================================================
  // SWITCH CHAT
  // =====================================================

  console.log('=== SWITCH CHAT ===');

  const chat4338 = page
    .getByText('4338: AIValidationMaxRetry,', { exact: false })
    .first();

  if (await chat4338.isVisible()) {
    await chat4338.click();
    console.log('Opened chat 4338.');
  }

  const chat4339Again = page
    .getByText('4339: AIValidationMaxRetry,', { exact: false })
    .first();

  if (await chat4339Again.isVisible()) {
    await chat4339Again.click();
    console.log('Opened chat 4339.');
  }

  // =====================================================
  // STAR / UNSTAR CHAT
  // =====================================================

  console.log('=== STAR / UNSTAR CHAT ===');

  // exact: true so "star" does not also match "star_border"
  const starButton = page.getByRole('button', {
    name: 'star_border',
    exact: true
  });

  if (await starButton.isVisible()) {
    await starButton.click();
    console.log('Chat starred.');
  }

  const unstarButton = page.getByRole('button', {
    name: 'star',
    exact: true
  });

  if (await unstarButton.isVisible()) {
    await unstarButton.click();
    console.log('Chat unstarred.');
  }

  // =====================================================
  // SHARE CHAT
  // =====================================================

  console.log('=== SHARE CHAT ===');

  await page.getByRole('button', { name: 'Share' }).click();

  // Cancel share
  const cancelShareButton = page.getByRole('button', { name: 'cancel' });

  if (await cancelShareButton.isVisible()) {
    await cancelShareButton.click();
    console.log('Share cancelled successfully.');
  }

  // Open Share again
  await page.getByRole('button', { name: 'Share' }).click();

  await expect(
    page.getByText('Share chat with an agent', { exact: false })
  ).toBeVisible();

  // =====================================================
  // SELECT AGENT
  // =====================================================

  console.log('=== SELECT AGENT ===');

  const agentDropdown = page.getByRole('combobox', { name: 'Agent' });

  await agentDropdown.locator('svg').click();

  await page
    .getByText('Bajen KLaunchAgent, jenna.', { exact: false })
    .click();

  await page.getByRole('button', { name: 'Send' }).click();

  console.log('Chat shared successfully.');

  // =====================================================
  // LOGOUT
  // =====================================================

  console.log('=== LOGOUT ===');

  const menuButton = page
    .getByRole('button')
    .filter({ hasText: /^$/ })
    .nth(2);

  await menuButton.click();

  await page.getByRole('menuitem', { name: 'Logout' }).click();

  await expect(
    page.getByRole('button', { name: 'Sign In' })
  ).toBeVisible();

  console.log('Logout successful.');

  // =====================================================
  // TEST COMPLETED
  // =====================================================

  console.log('=== TEST COMPLETED ===');

});
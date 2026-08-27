import { test, expect } from '@playwright/test';

test('KLaunch Chats Module', async ({ page }) => {
  // Temporary increase while stabilizing the full dashboard flow
  test.setTimeout(300000);

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

  console.log('=== LOGIN ===');

  await page.goto('https://test.klaunch.io/#/auth/login');

  await page.getByRole('textbox', {
    name: 'Email Address'
  }).fill(testEmail);

  await page.getByRole('textbox', {
    name: 'Password'
  }).fill(testPassword);

  await page.getByRole('button', {
    name: 'Sign In'
  }).click();

  await expect(
    page.getByRole('button', {
      name: 'CHATS'
    })
  ).toBeVisible({
    timeout: 30000
  });

  console.log('Login successful.');
  console.log('URL:', page.url());

  // =========================
  // OPEN CHATS
  // =========================

  console.log('=== OPEN CHATS ===');

  await page.getByRole('button', {
    name: 'CHATS'
  }).click();

  await expect(
    page.getByText('3972: FullAddressTest, Grand')
  ).toBeVisible({
    timeout: 30000
  });

  console.log('Chats module opened.');

  // =========================
  // CHAT STATUS FILTERS
  // =========================

  console.log('=== CHAT STATUS FILTERS ===');

  await page.getByRole('button', {
    name: /Other Chats/
  }).click();

  await page.getByRole('button', {
    name: /Other Claimed Chats/
  }).click();

  await page.getByRole('button', {
    name: /My Chats/
  }).click();

  await page.getByRole('button', {
    name: /Waiting For Agent/
  }).click();

  console.log('Chat status filters completed.');

  // =========================
  // OPEN FULL ADDRESS CHAT
  // =========================

  console.log('=== OPEN FULL ADDRESS CHAT ===');

  await page.getByText(
    '3972: FullAddressTest, Grand'
  ).click();

  console.log('FullAddressTest chat opened.');

  // =========================
  // EVENT LOG
  // =========================

  console.log('=== EVENT LOG ===');

  await page.locator('.combo-dropdown-btn').click();

  await expect(
    page.getByRole('button', {
      name: 'Event Log'
    })
  ).toBeVisible({
    timeout: 10000
  });

  await page.getByRole('button', {
    name: 'Event Log'
  }).click();

  await expect(
    page.getByRole('button', {
      name: 'Ok'
    })
  ).toBeVisible({
    timeout: 10000
  });

  await page.getByRole('button', {
    name: 'Ok'
  }).click();

  console.log('Event Log completed.');

  // =========================
  // DOWNLOAD CHAT HISTORY
  // =========================

  console.log('=== DOWNLOAD CHAT HISTORY ===');

  await page.locator('.combo-dropdown-btn').click();

  await expect(
    page.getByRole('button', {
      name: 'Download Chat History'
    })
  ).toBeVisible({
    timeout: 10000
  });

  await page.getByRole('button', {
    name: 'Download Chat History'
  }).click();

  // Start Date
  console.log('Selecting Start Date...');

  await page.locator('mat-form-field')
    .filter({
      hasText: 'Start Date'
    })
    .getByLabel('Open calendar')
    .click();

  await expect(
    page.getByRole('button', {
      name: 'August 14,'
    })
  ).toBeVisible({
    timeout: 10000
  });

  await page.getByRole('button', {
    name: 'August 14,'
  }).click();

  // CSV
  console.log('Downloading CSV...');

  const csvDownloadPromise = page.waitForEvent('download');

  await page.getByRole('button', {
    name: 'Download CSV'
  }).click();

  const csvDownload = await csvDownloadPromise;

  console.log(
    'CSV downloaded:',
    csvDownload.suggestedFilename()
  );

  // JSON
  console.log('Downloading JSON...');

  const jsonDownloadPromise = page.waitForEvent('download');

  await page.getByRole('button', {
    name: 'Download JSON'
  }).click();

  const jsonDownload = await jsonDownloadPromise;

  console.log(
    'JSON downloaded:',
    jsonDownload.suggestedFilename()
  );

  await page.getByRole('button', {
    name: 'Cancel'
  }).click();

  console.log('Download Chat History completed.');

  // =========================
  // NOTES
  // =========================

  console.log('=== NOTES ===');

  await page.locator('.combo-dropdown-btn').click();

  await page.getByText('note', {
    exact: true
  }).click();

  await expect(
    page.getByRole('textbox', {
      name: 'Add Note'
    })
  ).toBeVisible({
    timeout: 10000
  });

  await page.getByRole('radio', {
    name: 'superadmin'
  }).check();

  await page.getByRole('radio', {
    name: 'Public'
  }).check();

  await page.getByRole('textbox', {
    name: 'Add Note'
  }).fill('test');

  const alertSwitch = page.getByRole('switch', {
    name: 'Alert'
  });

  await alertSwitch.click();
  await alertSwitch.click();

  await page.getByRole('button', {
    name: 'Add'
  }).click();

  console.log('Note added.');

  // Delete note
  await page.getByRole('button')
    .filter({
      hasText: 'delete_forever'
    })
    .click();

  console.log('Note deleted.');

  // =========================
  // FLAGS
  // =========================

  console.log('=== FLAGS ===');

  await page.getByText('flag', {
    exact: true
  }).click();

  await page.getByRole('combobox', {
    name: /Choose Flag/i
  }).click();

  await expect(
    page.getByRole('option', {
      name: '#alexh'
    })
  ).toBeVisible({
    timeout: 10000
  });

  await page.getByRole('option', {
    name: '#alexh'
  }).click();

  await page.getByRole('button', {
    name: 'Add'
  }).click();

  console.log('Flag added.');

  await page.getByText('delete_forever').click();

  console.log('Flag deleted.');

  // =========================
  // CALENDAR
  // =========================

  console.log('=== CALENDAR ===');

  await page.getByText('calendar_today').click();

  console.log('Calendar opened.');

  // =========================
  // ACTIVE → ARCHIVED
  // =========================

  console.log('=== ACTIVE → ARCHIVED ===');

  await page.getByRole('combobox', {
    name: 'Active Chats'
  }).locator('svg').click();

  await expect(
    page.getByText('Archived Chats')
  ).toBeVisible({
    timeout: 10000
  });

  await page.getByText('Archived Chats').click();

  await expect(
    page.getByText('3701: 2068BOT, Santa Lucia,')
  ).toBeVisible({
    timeout: 30000
  });

  await page.getByText(
    '3701: 2068BOT, Santa Lucia,'
  ).click();

  console.log('Archived chat opened.');

  // =========================
  // ARCHIVED → ALL CHATS
  // =========================

  console.log('=== ARCHIVED → ALL CHATS ===');

  await page.getByRole('combobox', {
    name: 'Archived Chats'
  }).locator('svg').click();

  await expect(
    page.getByRole('option', {
      name: 'All Chats'
    })
  ).toBeVisible({
    timeout: 10000
  });

  await page.getByRole('option', {
    name: 'All Chats'
  }).click();

  await expect(
    page.getByText('3972: FullAddressTest, Grand')
  ).toBeVisible({
    timeout: 30000
  });

  await page.getByText(
    '3972: FullAddressTest, Grand'
  ).click();

  console.log('All Chats opened.');

  // =========================
  // SEARCH
  // =========================

  console.log('=== SEARCH: ZACK ===');

  const searchBox = page.getByRole('textbox', {
    name: 'Search'
  });

  await expect(searchBox).toBeVisible({
    timeout: 10000
  });

  console.log('Search box visible.');

  // Enter search term
  await searchBox.fill('zack');

  console.log('Entered "zack".');

  // IMPORTANT:
  // Do NOT press Enter.
  // KLaunch appears to process the search from the entered value.
  await expect(
    page.getByText('Zack Jones', {
      exact: true
    })
  ).toBeVisible({
    timeout: 15000
  });

  console.log('Zack Jones result is visible.');

  await page.getByText('Zack Jones', {
    exact: true
  }).click();

  console.log('Zack Jones selected.');

  // Clear search
  await searchBox.fill('');

  await expect(
    page.getByText('3972: FullAddressTest, Grand')
  ).toBeVisible({
    timeout: 15000
  });

  console.log('Search cleared successfully.');

  // =========================
  // FILTER - BOT
  // =========================

  console.log('=== FILTER: BOT ===');

  await page.getByText('filter_list').click();

  const filterSelect = page.getByRole('combobox').last();

  await expect(
    filterSelect
  ).toBeVisible({
    timeout: 10000
  });

  await filterSelect.click();

  await expect(
    page.getByRole('option', {
      name: '2068BOT'
    })
  ).toBeVisible({
    timeout: 10000
  });

  await page.getByRole('option', {
    name: '2068BOT'
  }).click();

  await page.getByRole('button', {
    name: 'Filter'
  }).click();

  await expect(
    page.getByText('3701: 2068BOT, Santa Lucia,')
  ).toBeVisible({
    timeout: 15000
  });

  console.log('Bot filter passed.');

  // Reset
  await page.getByText('filter_list').click();

  await page.getByRole('button', {
    name: 'Reset'
  }).click();

  // =========================
  // FILTER - FLAG
  // =========================

  console.log('=== FILTER: FLAG ===');

  await page.getByText('filter_list').click();

  await page.getByRole('combobox').last().click();

  await page.getByRole('option', {
    name: '#alexh'
  }).click();

  await page.getByRole('button', {
    name: 'Filter'
  }).click();

  await expect(
    page.locator('.user-item').first()
  ).toBeVisible({
    timeout: 15000
  });

  console.log('Flag filter passed.');

  await page.getByText('filter_list').click();

  await page.getByRole('button', {
    name: 'Reset'
  }).click();

  // =========================
  // FILTER - FIRST NAME
  // =========================

  console.log('=== FILTER: FIRST NAME ===');

  await page.getByText('filter_list').click();

  await page.getByRole('textbox', {
    name: 'First Name'
  }).fill('jen');

  await page.getByRole('button', {
    name: 'Filter'
  }).click();

  await expect(
    page.getByText('Jennadela Abustan', {
      exact: true
    })
  ).toBeVisible({
    timeout: 15000
  });

  await page.getByText('Jennadela Abustan', {
    exact: true
  }).click();

  console.log('First Name filter passed.');

  await page.getByText('filter_list').click();

  await page.getByRole('button', {
    name: 'Reset'
  }).click();

  // =========================
  // FILTER - LAST NAME
  // =========================

  console.log('=== FILTER: LAST NAME ===');

  await page.getByText('filter_list').click();

  await page.getByRole('textbox', {
    name: 'Last Name'
  }).fill('abustan');

  await page.getByRole('button', {
    name: 'Filter'
  }).click();

  await expect(
    page.getByText('Jenna Abustan', {
      exact: true
    })
  ).toBeVisible({
    timeout: 15000
  });

  console.log('Last Name filter passed.');

  await page.getByText('filter_list').click();

  await page.getByRole('button', {
    name: 'Reset'
  }).click();

  // =========================
  // FILTER - NO CHAT
  // =========================

  console.log('=== FILTER: NO CHAT ===');

  await page.getByText('filter_list').click();

  await page.getByRole('combobox').last().click();

  await page.getByRole('option', {
    name: 'Show only users with no chat'
  }).click();

  await page.getByRole('button', {
    name: 'Filter'
  }).click();

  console.log('No-chat filter applied.');

  await page.getByText('filter_list').click();

  await page.getByRole('button', {
    name: 'Reset'
  }).click();

  // =========================
  // FILTER - ALL USERS
  // =========================

  console.log('=== FILTER: ALL USERS ===');

  await page.getByText('filter_list').click();

  await page.getByRole('combobox').last().click();

  await page.getByRole('option', {
    name: 'Show all users'
  }).click();

  await page.getByRole('button', {
    name: 'Filter'
  }).click();

  console.log('All users filter applied.');

  await page.getByText('filter_list').click();

  await page.getByRole('button', {
    name: 'Reset'
  }).click();

  // =========================
  // SELECT BOT
  // =========================

  console.log('=== SELECT BOT ===');

  await page.getByText('filter_list').click();

  await page.getByText('Select Bot', {
    exact: true
  }).click();

  await expect(
    page.getByText('AgentTestBot', {
      exact: true
    })
  ).toBeVisible({
    timeout: 10000
  });

  await page.getByText('AgentTestBot', {
    exact: true
  }).click();

  await page.getByRole('button', {
    name: 'Cancel'
  }).click();

  console.log('Bot selection completed.');

  // =========================
  // KEYWORD FILTER
  // =========================

  console.log('=== FILTER: KEYWORD ===');

  await page.getByText('filter_list').click();

  const keywordBox = page.getByRole('textbox', {
    name: 'Key Word'
  });

  await keywordBox.fill('jen');

  await page.getByRole('button', {
    name: 'Filter'
  }).click();

  console.log('Keyword filter applied.');

  await page.getByText('filter_list').click();

  await page.getByRole('button', {
    name: 'Reset'
  }).click();

  // =========================
  // SEARCH WITHIN
  // =========================

  console.log('=== SEARCH WITHIN ===');

  await page.getByText('filter_list').click();

  await page.getByText(
    'Search Within: Messages Name'
  ).click();

  await page.locator('input[name="Name"]').check();

  await keywordBox.fill('jen');

  await page.locator('input[name="Messages"]').check();

  await page.getByRole('button', {
    name: 'Filter'
  }).click();

  await expect(
    page.getByText('3742: GenAINew', {
      exact: true
    })
  ).toBeVisible({
    timeout: 15000
  });

  console.log('Messages/Name filter passed.');

  // =========================
  // NAME ONLY
  // =========================

  console.log('=== SEARCH WITHIN: NAME ONLY ===');

  await page.getByText('filter_list').click();

  await page.locator('input[name="Messages"]').uncheck();

  await page.locator('input[name="Name"]').check();

  await page.getByRole('button', {
    name: 'Filter'
  }).click();

  // =========================
  // FLAG
  // =========================

  console.log('=== SEARCH WITHIN: FLAG ===');

  await page.getByText('filter_list').click();

  await page.locator('input[name="Flag"]').check();

  await page.locator('input[name="Name"]').uncheck();

  await page.getByRole('button', {
    name: 'Filter'
  }).click();

  // =========================
  // NOTES
  // =========================

  console.log('=== SEARCH WITHIN: NOTES ===');

  await page.getByText('filter_list').click();

  await page.locator('input[name="Flag"]').uncheck();

  await page.locator('input[name="Notes"]').check();

  await page.getByRole('button', {
    name: 'Filter'
  }).click();

  // =========================
  // LOCATION
  // =========================

  console.log('=== SEARCH WITHIN: LOCATION ===');

  await page.getByText('filter_list').click();

  await page.locator('input[name="Notes"]').uncheck();

  await page.locator('input[name="Location"]').check();

  await page.getByRole('button', {
    name: 'Filter'
  }).click();

  // =========================
  // LIVE CHAT
  // =========================

  console.log('=== SEARCH WITHIN: LIVE CHAT ===');

  await page.getByText('filter_list').click();

  await page.locator('input[name="Location"]').uncheck();

  await keywordBox.fill('');

  await page.locator('input[name="liveChat"]').check();

  await keywordBox.fill('jen');

  await page.getByRole('button', {
    name: 'Filter'
  }).click();

  console.log('Live Chat filter applied.');

  // =========================
  // FINAL RESET
  // =========================

  await page.getByText('filter_list').click();

  await page.getByRole('button', {
    name: 'Reset'
  }).click();

  console.log('All filters reset.');

  // =========================
  // LOGOUT
  // =========================

  console.log('=== LOGOUT ===');

  const emptyButton = page.getByRole('button')
    .filter({
      hasText: /^$/
    })
    .nth(2);

  await emptyButton.click();

  await expect(
    page.getByRole('menuitem', {
      name: 'Logout'
    })
  ).toBeVisible({
    timeout: 10000
  });

  await page.getByRole('menuitem', {
    name: 'Logout'
  }).click();

  await expect(
    page.getByRole('textbox', {
      name: 'Email Address'
    })
  ).toBeVisible({
    timeout: 30000
  });

  console.log('Logged out successfully.');
  console.log('================================');
  console.log('KLaunch Chats Dashboard PASSED');
  console.log('================================');
});
import { test, expect } from '@playwright/test';

test('KLaunch Users Module', async ({ page }) => {

  test.setTimeout(300000);

  // =====================================================
  // TEST LOGIN
  // =====================================================

  const testEmail = process.env.TEST_EMAIL;
  const testPassword = process.env.TEST_PASSWORD;

  if (!testEmail) {
    throw new Error('Missing TEST_EMAIL in .env');
  }

  if (!testPassword) {
    throw new Error('Missing TEST_PASSWORD in .env');
  }

  const USERS_URL =
    'https://test.klaunch.io/#/dashboard/users?pageSize=10&selectedFilter=allChats&amount=100';


  // =====================================================
  // HELPER: WAIT FOR USERS PAGE
  // =====================================================

  async function waitForUsersPage() {

    await expect(
      page.getByRole('textbox', {
        name: 'Search Users'
      })
    ).toBeVisible({
      timeout: 60000
    });

    console.log('Users page loaded.');
  }


  // =====================================================
  // HELPER: OPEN USERS PAGE
  // =====================================================

  async function openUsersPage(filter) {

    await page.goto(
      `https://test.klaunch.io/#/dashboard/users?pageSize=10&selectedFilter=${filter}&amount=100`
    );

    await waitForUsersPage();
  }


  // =====================================================
  // HELPER: CLOSE OPEN DROPDOWN
  // =====================================================

  async function closeDropdown() {

    const dropdown = page.locator(
      '.cdk-overlay-container .mat-mdc-select-panel:visible'
    );

    if (await dropdown.count() > 0) {

      console.log('Closing dropdown...');

      await page.keyboard.press('Escape');

      await page.waitForTimeout(300);

      // Sometimes Angular Material needs another Escape
      if (await dropdown.count() > 0) {

        console.log(
          'Dropdown is still open. Pressing Escape again.'
        );

        await page.keyboard.press('Escape');

        await page.waitForTimeout(300);
      }
    }
  }


  // =====================================================
  // HELPER: NORMAL DROPDOWN
  // =====================================================

  async function selectDropdown(select, optionName) {

    await closeDropdown();

    await expect(select).toBeVisible({
      timeout: 15000
    });

    await select.scrollIntoViewIfNeeded();

    console.log(
      `Opening dropdown for: ${optionName}`
    );

    // Use the actual Angular Material trigger
    await select
      .locator('.mat-mdc-select-trigger')
      .click();

    await page.waitForTimeout(300);

    const option = page.getByRole('option', {
      name: optionName,
      exact: true
    });

    await expect(option).toBeVisible({
      timeout: 15000
    });

    await option.scrollIntoViewIfNeeded();

    console.log(
      `Selecting option: ${optionName}`
    );

    await option.click();

    await page.waitForTimeout(300);

    await closeDropdown();
  }


  // =====================================================
  // HELPER: FLAGS DROPDOWN
  // =====================================================

  async function selectFlag(flagName) {

    await closeDropdown();

    const flags = page.getByRole('combobox', {
      name: 'Flags'
    });

    await expect(flags).toBeVisible({
      timeout: 15000
    });

    console.log(
      `Opening Flags dropdown for: ${flagName}`
    );

    await flags.scrollIntoViewIfNeeded();

    await flags.click();

    await page.waitForTimeout(300);

    const option = page.getByRole('option', {
      name: flagName,
      exact: true
    });

    await expect(option).toBeVisible({
      timeout: 15000
    });

    console.log(
      `Scrolling to flag: ${flagName}`
    );

    await option.scrollIntoViewIfNeeded();

    console.log(
      `Selecting flag: ${flagName}`
    );

    await option.click();

    await page.waitForTimeout(300);

    // Flags is a multi-select.
    // It can remain open after selecting.
    console.log(
      'Closing Flags dropdown...'
    );

    await page.keyboard.press('Escape');

    await page.waitForTimeout(500);

    // Check again
    const stillOpen = page.locator(
      '.cdk-overlay-container .mat-mdc-select-panel:visible'
    );

    if (await stillOpen.count() > 0) {

      console.log(
        'Flags dropdown is still open. Pressing Escape again.'
      );

      await page.keyboard.press('Escape');

      await page.waitForTimeout(500);
    }

    console.log(
      `Flag ${flagName} completed.`
    );
  }


  // =====================================================
  // HELPER: ADVANCED FILTER
  //
  // FIELD → OPERATOR → VALUE
  // =====================================================

  async function advancedFilter(field, value) {

    console.log(
      `=== ADVANCED FILTER: ${field} ===`
    );

    // -------------------------------------------------
    // OPEN ADVANCED FILTERS
    // -------------------------------------------------

    await closeDropdown();

    await page.getByRole('button', {
      name: 'Advanced Filters'
    }).click();

    await page.waitForTimeout(500);


    // -------------------------------------------------
    // FIELD
    // -------------------------------------------------

    console.log(
      `Selecting Field: ${field}`
    );

    /*
     * Advanced Filters creates the newest mat-select
     * at the bottom.
     *
     * We use the last visible mat-select.
     */

    let selects = page.locator(
      'mat-select:visible'
    );

    const fieldSelect = selects.last();

    await expect(fieldSelect).toBeVisible({
      timeout: 15000
    });

    await fieldSelect.scrollIntoViewIfNeeded();

    /*
     * IMPORTANT:
     *
     * Click the Angular Material trigger.
     *
     * Do NOT click the SVG arrow.
     * Do NOT use #mat-select-4.
     */

    await fieldSelect
      .locator('.mat-mdc-select-trigger')
      .click();

    await page.waitForTimeout(500);

    console.log(
      `Looking for Field option: ${field}`
    );

    const fieldOption = page.getByRole('option', {
      name: field,
      exact: true
    });

    await expect(fieldOption).toBeVisible({
      timeout: 15000
    });

    console.log(
      `Scrolling to Field option: ${field}`
    );

    await fieldOption.scrollIntoViewIfNeeded();

    console.log(
      `Selecting Field: ${field}`
    );

    await fieldOption.click();

    await page.waitForTimeout(500);


    // -------------------------------------------------
    // OPERATOR
    // -------------------------------------------------

    console.log(
      'Selecting Operator: EQUALS'
    );

    await closeDropdown();

    selects = page.locator(
      'mat-select:visible'
    );

    /*
     * After selecting Field,
     * the Operator becomes the newest/last select.
     */

    const operatorSelect = selects.last();

    await expect(operatorSelect).toBeVisible({
      timeout: 15000
    });

    await operatorSelect.scrollIntoViewIfNeeded();

    /*
     * Use the Angular Material trigger.
     */

    await operatorSelect
      .locator('.mat-mdc-select-trigger')
      .click();

    await page.waitForTimeout(500);

    const equalsOption = page.getByRole('option', {
      name: 'EQUALS',
      exact: true
    });

    await expect(equalsOption).toBeVisible({
      timeout: 15000
    });

    await equalsOption.scrollIntoViewIfNeeded();

    await equalsOption.click();

    await page.waitForTimeout(500);


    // -------------------------------------------------
    // VALUE
    // -------------------------------------------------

    console.log(
      `Entering Value: ${value}`
    );


    // -------------------------------------------------
    // FLAG VALUE
    // -------------------------------------------------

    if (field === 'flag') {

      await closeDropdown();

      selects = page.locator(
        'mat-select:visible'
      );

      const valueSelect = selects.last();

      await expect(valueSelect).toBeVisible({
        timeout: 15000
      });

      await valueSelect.scrollIntoViewIfNeeded();

      /*
       * Flag Value is another dropdown.
       */

      await valueSelect
        .locator('.mat-mdc-select-trigger')
        .click();

      await page.waitForTimeout(500);

      const flagOption = page.getByRole('option', {
        name: value,
        exact: true
      });

      await expect(flagOption).toBeVisible({
        timeout: 15000
      });

      console.log(
        `Scrolling to Value: ${value}`
      );

      await flagOption.scrollIntoViewIfNeeded();

      console.log(
        `Selecting Value: ${value}`
      );

      await flagOption.click();

      await page.waitForTimeout(500);

      await closeDropdown();

    }

    // -------------------------------------------------
    // TEXT VALUE
    // -------------------------------------------------

    else {

      const valueInput = page.locator(
        'input.mat-mdc-input-element:visible'
      ).last();

      await expect(valueInput).toBeVisible({
        timeout: 15000
      });

      await valueInput.scrollIntoViewIfNeeded();

      await valueInput.fill(value);

      console.log(
        `Value entered: ${value}`
      );
    }


    // -------------------------------------------------
    // APPLY FILTER
    // -------------------------------------------------

    await closeDropdown();

    await page.getByRole('button', {
      name: 'Filter'
    }).click();

    await page.waitForTimeout(500);

    console.log(
      `Filter applied: ${field}`
    );
  }


  // =====================================================
  // HELPER: RESET ADVANCED FILTER
  // =====================================================

  async function resetFilter() {

    await page.getByRole('button', {
      name: 'Advanced Filters'
    }).click();

    await page.waitForTimeout(300);

    const resetButton = page.getByRole('button', {
      name: 'Reset'
    });

    await expect(resetButton).toBeVisible({
      timeout: 15000
    });

    await resetButton.click();

    await page.waitForTimeout(500);

    await closeDropdown();

    console.log(
      'Advanced filter reset.'
    );
  }


  // =====================================================
  // LOGIN
  // =====================================================

  console.log('=== LOGIN ===');

  await page.goto(
    'https://test.klaunch.io/#/auth/login'
  );

  await page.getByRole('textbox', {
    name: 'Email Address'
  }).fill(testEmail);

  await page.getByRole('textbox', {
    name: 'Password'
  }).fill(testPassword);

  await page.getByRole('button', {
    name: 'Sign In'
  }).click();

  await page.waitForURL(/dashboard/, {
    timeout: 60000
  });

  console.log('Login successful.');
  console.log(`URL: ${page.url()}`);


  // =====================================================
  // USERS MODULE
  // =====================================================

  console.log('=== USERS MODULE ===');

  await page.getByRole('button', {
    name: 'USERS'
  }).click();

  await waitForUsersPage();


  // =====================================================
  // ARCHIVED CHATS
  // =====================================================

  console.log('=== ARCHIVED CHATS ===');

  await openUsersPage('archivedChats');

  const archivedUser = page.getByText('3701', {
    exact: true
  });

  if (
    await archivedUser.isVisible().catch(() => false)
  ) {

    await archivedUser.click();

    const cancelButton = page.getByRole('button', {
      name: 'Cancel'
    });

    if (
      await cancelButton.isVisible().catch(() => false)
    ) {

      await cancelButton.click();
    }
  }


  // =====================================================
  // ALL CHATS
  // =====================================================

  console.log('=== ALL CHATS ===');

  await openUsersPage('allChats');


  // =====================================================
  // SEARCH USERS
  // =====================================================

  console.log('=== SEARCH USERS ===');

  const searchBox = page.getByRole('textbox', {
    name: 'Search Users'
  });

  for (const search of [
    'bajen',
    'rachel',
    'zack'
  ]) {

    await searchBox.fill(search);
    await searchBox.press('Enter');

    console.log(
      `Search: ${search}`
    );
  }

  await searchBox.fill('');
  await searchBox.press('Enter');

  console.log(
    'Search: cleared'
  );


  // =====================================================
  // FLAGS
  // =====================================================

  console.log('=== FLAGS ===');

  // Select
  await selectFlag('#alexh');

  // Remove
  await selectFlag('#alexh');

  console.log(
    'Flag #alexh selected and removed successfully.'
  );


  // =====================================================
  // ADVANCED FILTER - EMAIL
  // =====================================================

  await advancedFilter(
    'email',
    'test6@capacity.com'
  );

  await resetFilter();


  // =====================================================
  // ADVANCED FILTER - FIRST NAME
  // =====================================================

  await advancedFilter(
    'fname',
    'Zack'
  );

  await resetFilter();


  // =====================================================
  // ADVANCED FILTER - LAST NAME
  // =====================================================

  await advancedFilter(
    'lname',
    'Jones'
  );

  await resetFilter();


  // =====================================================
  // ADVANCED FILTER - FLAG
  // =====================================================

  await advancedFilter(
    'flag',
    '#alexh'
  );

  await resetFilter();


  // =====================================================
  // ADVANCED FILTER - FULL NAME
  // =====================================================

  await advancedFilter(
    'fullname',
    'Zack Jones'
  );

  await resetFilter();


  // =====================================================
  // ATTRIBUTE HYPERLINK
  // =====================================================

  console.log('=== ATTRIBUTE HYPERLINK ===');

  const hyperlink = page.getByRole('textbox', {
    name: 'Attribute Hyperlink'
  });

  if (
    await hyperlink.isVisible().catch(() => false)
  ) {

    await hyperlink.fill(
      'https://testzip.com'
    );

    await page.getByRole('button', {
      name: 'Add Hyperlink'
    }).click();

    console.log(
      'Attribute hyperlink added.'
    );
  }


  // =====================================================
  // PAGINATION
  // =====================================================

  console.log('=== PAGINATION ===');

  const paginator = page.locator(
    '.mat-mdc-paginator'
  ).first();

  const pageSize = paginator.locator(
    'mat-select'
  ).first();

  if (await pageSize.count() > 0) {

    await selectDropdown(
      pageSize,
      '10'
    );

    await selectDropdown(
      pageSize,
      '25'
    );

    await selectDropdown(
      pageSize,
      '50'
    );

    console.log(
      'Page sizes tested.'
    );
  }


  // =====================================================
  // DELETE FOREVER
  // =====================================================

  console.log('=== DELETE FOREVER ===');

  const deleteForever = page.getByRole(
    'button',
    {
      name: 'delete_forever'
    }
  );

  if (
    await deleteForever.isVisible().catch(() => false)
  ) {

    await deleteForever.click();

    await page.getByRole('button', {
      name: 'Yes'
    }).click();

    console.log(
      'Delete Forever confirmed.'
    );
  }


  // =====================================================
  // PAGE SIZE - 5
  // =====================================================

  console.log('=== PAGE SIZE: 5 ===');

  const lastPaginator = page.locator(
    '.mat-mdc-paginator'
  ).last();

  const lastPageSize = lastPaginator.locator(
    'mat-select'
  ).first();

  if (await lastPageSize.count() > 0) {

    await selectDropdown(
      lastPageSize,
      '5'
    );

    console.log(
      'Page size changed to 5.'
    );
  }


  // =====================================================
  // NEXT PAGE
  // =====================================================

  console.log('=== NEXT PAGE ===');

  const nextPage = page.getByLabel(
    'Next page'
  );

  for (let i = 0; i < 2; i++) {

    if (
      await nextPage.isEnabled().catch(() => false)
    ) {

      await nextPage.click();

      console.log(
        `Moved to next page: ${i + 1}`
      );

    } else {

      console.log(
        'Next page button is disabled.'
      );

      break;
    }
  }


  // =====================================================
  // SELECT USER / DELETE / CANCEL
  // =====================================================

  console.log('=== USER SELECTION ===');

  const cheeseRow = page.getByRole(
    'row',
    {
      name: 'cheese'
    }
  );

  if (
    await cheeseRow.isVisible().catch(() => false)
  ) {

    const checkbox = cheeseRow.getByRole(
      'checkbox'
    ).first();

    await checkbox.check();
    await checkbox.uncheck();
    await checkbox.check();

    await page.getByRole('button', {
      name: 'Delete'
    }).click();

    await page.getByRole('button', {
      name: 'No'
    }).click();

    await checkbox.uncheck();

    console.log(
      'Delete confirmation cancelled.'
    );
  }


  // =====================================================
  // CSV DOWNLOAD
  // =====================================================

  console.log('=== CSV DOWNLOAD ===');

  const downloadLink = page.getByRole(
    'link',
    {
      name: 'here'
    }
  );

  if (
    await downloadLink.isVisible().catch(() => false)
  ) {

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      downloadLink.click()
    ]);

    console.log(
      `Downloaded: ${download.suggestedFilename()}`
    );
  }


  // =====================================================
  // FORMATTING HELP
  // =====================================================

  console.log('=== FORMATTING HELP ===');

  const formattingHelp = page.getByText(
    'Formatting help',
    {
      exact: true
    }
  );

  if (
    await formattingHelp.isVisible().catch(() => false)
  ) {

    await formattingHelp.click();

    console.log(
      'Formatting help opened.'
    );
  }


  // =====================================================
  // SCHEDULING
  // =====================================================

  console.log('=== SCHEDULING ===');

  const scheduling = page.getByRole(
    'link',
    {
      name: 'scheduling'
    }
  );

  if (
    await scheduling.isVisible().catch(() => false)
  ) {

    const [schedulingPage] = await Promise.all([
      page.waitForEvent('popup'),
      scheduling.click()
    ]);

    await schedulingPage.waitForLoadState(
      'domcontentloaded'
    );

    console.log(
      `Scheduling URL: ${schedulingPage.url()}`
    );

    await schedulingPage.close();

    console.log(
      'Scheduling tab closed.'
    );
  }


  // =====================================================
  // ADD USERS
  // =====================================================

  console.log('=== ADD USERS ===');

  await page.getByRole('button', {
    name: 'Add User(s)'
  }).click();

  await page.getByRole('textbox', {
    name: 'First Name'
  }).fill('test');

  await page.getByRole('textbox', {
    name: 'Last name'
  }).fill('user');

  await page.getByRole('textbox', {
    name: 'Phone'
  }).fill('+8746302');

  await page.getByRole('textbox', {
    name: 'Email'
  }).fill('test7@test.com');


  // =====================================================
  // CAMPAIGN
  // =====================================================

  console.log('=== CAMPAIGN ===');

  const campaignSelect = page.locator(
    'mat-select:visible'
  ).last();

  if (
    await campaignSelect.count() > 0
  ) {

    await selectDropdown(
      campaignSelect,
      'campaign_08042026'
    );
  }


  // =====================================================
  // ADD USER FLAGS
  // =====================================================

  console.log('=== ADD USER FLAGS ===');

  const flagsInput = page.getByRole(
    'textbox',
    {
      name: 'Flags'
    }
  );

  if (
    await flagsInput.isVisible().catch(() => false)
  ) {

    await flagsInput.fill('alex');
    await flagsInput.fill('purple');
  }


  // =====================================================
  // SAVE USER
  // =====================================================

  await page.getByRole('button', {
    name: 'Save Users'
  }).click();

  const okayButton = page.getByRole(
    'button',
    {
      name: 'Okay'
    }
  );

  if (
    await okayButton.isVisible().catch(() => false)
  ) {

    await okayButton.click();
  }


  // =====================================================
  // SECOND USER
  // =====================================================

  console.log('=== SECOND USER ===');

  const firstName = page.getByRole(
    'textbox',
    {
      name: 'First Name'
    }
  );

  if (
    await firstName.isVisible().catch(() => false)
  ) {

    await firstName.fill('jen');

    await page.getByRole('textbox', {
      name: 'Last name'
    }).fill('test2');

    await page.getByRole('textbox', {
      name: 'Phone'
    }).fill('+75638495');

    await page.getByRole('textbox', {
      name: 'Email'
    }).fill('test7@capacity.com');
  }


  // =====================================================
  // CSV UPLOAD
  // =====================================================

  console.log('=== CSV UPLOAD ===');

  await page.goto(USERS_URL);

  await waitForUsersPage();

  await page.locator(
    '#csvInput'
  ).setInputFiles(
    'bajne.csv'
  );

  console.log(
    'CSV upload completed.'
  );


  // =====================================================
  // LOGOUT
  // =====================================================

  console.log('=== LOGOUT ===');

  const menuButton = page.getByRole('button')
    .filter({
      hasText: /^$/
    })
    .nth(2);

  await expect(menuButton).toBeVisible({
    timeout: 30000
  });

  await menuButton.click();

  const logout = page.getByRole(
    'menuitem',
    {
      name: 'Logout'
    }
  );

  await expect(logout).toBeVisible({
    timeout: 10000
  });

  await logout.click();

  await expect(
    page.getByRole('textbox', {
      name: 'Email Address'
    })
  ).toBeVisible({
    timeout: 30000
  });

  console.log(
    'Logout successful.'
  );

});
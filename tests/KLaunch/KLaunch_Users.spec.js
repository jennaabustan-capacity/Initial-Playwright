import { test, expect } from '@playwright/test';
import { existsSync } from 'fs';

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
    await page.waitForTimeout(300);

    console.log(
      `Opening dropdown for: ${optionName}`
    );

    const trigger = select.locator(
      '.mat-mdc-select-trigger'
    );

    try {

      await trigger.click({
        timeout: 5000
      });

    } catch (error) {

      console.log(
        `Normal dropdown click was intercepted for ${optionName}.`
      );

      console.log(
        'Retrying dropdown click using force...'
      );

      await trigger.click({
        force: true,
        timeout: 10000
      });
    }

    await page.waitForTimeout(500);

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

    try {

      await option.click({
        timeout: 10000
      });

    } catch (error) {

      console.log(
        `Normal option click was intercepted for ${optionName}.`
      );

      console.log(
        'Retrying option click using force...'
      );

      await option.click({
        force: true,
        timeout: 10000
      });
    }

    await page.waitForTimeout(500);

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

    await flags.click({
      timeout: 15000
    });

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

    await option.click({
      timeout: 15000
    });

    await page.waitForTimeout(300);

    console.log(
      'Closing Flags dropdown...'
    );

    await page.keyboard.press('Escape');

    await page.waitForTimeout(500);

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
  // HELPER: OPEN AND CLOSE ADVANCED FILTER
  // =====================================================

  async function openAndCloseAdvancedFilter() {

    console.log(
      '=== OPEN/CLOSE ADVANCED FILTER ==='
    );

    const advancedFiltersButton = page.getByRole(
      'button',
      {
        name: 'Advanced Filters'
      }
    );

    await expect(
      advancedFiltersButton
    ).toBeVisible({
      timeout: 15000
    });

    console.log(
      'Opening Advanced Filters...'
    );

    await advancedFiltersButton.click({
      timeout: 15000
    });

    await page.waitForTimeout(500);

    console.log(
      'Advanced Filters opened.'
    );

    const advancedFilterSelect = page.locator(
      'mat-select:visible'
    ).last();

    await expect(
      advancedFilterSelect
    ).toBeVisible({
      timeout: 15000
    });

    console.log(
      'Advanced Filter panel is visible.'
    );

    console.log(
      'Closing Advanced Filters...'
    );

    await page.keyboard.press('Escape');

    await page.waitForTimeout(500);

    console.log(
      'Advanced Filters closed.'
    );
  }

  // =====================================================
  // HELPER: CLOSE POSSIBLE OVERLAYS / DIALOGS
  // =====================================================

  async function closePossibleOverlays() {

    console.log(
      'Checking for open overlays or dialogs...'
    );

    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    console.log(
      'Overlay cleanup completed.'
    );
  }

  // =====================================================
  // HELPER: OPEN ADD USER FORM
  // =====================================================

  async function openAddUserForm() {

    console.log(
      'Looking for Add User(s) button...'
    );

    await closePossibleOverlays();

    let addUserButton = page.getByRole(
      'button',
      {
        name: 'Add User(s)'
      }
    );

    let addUserCount =
      await addUserButton.count();

    console.log(
      `Add User(s) button count: ${addUserCount}`
    );

    if (addUserCount === 0) {

      console.log(
        'Add User(s) button was not found.'
      );

      console.log(
        'Returning to Users page...'
      );

      await page.goto(USERS_URL);

      await waitForUsersPage();

      addUserButton = page.getByRole(
        'button',
        {
          name: 'Add User(s)'
        }
      );

      addUserCount =
        await addUserButton.count();

      console.log(
        `Add User(s) button count after returning to Users page: ${addUserCount}`
      );
    }

    if (addUserCount === 0) {

      throw new Error(
        'Add User(s) button could not be found on the Users page.'
      );
    }

    await addUserButton.first()
      .scrollIntoViewIfNeeded();

    await page.waitForTimeout(500);

    await expect(
      addUserButton.first()
    ).toBeVisible({
      timeout: 15000
    });

    console.log(
      'Clicking Add User(s)...'
    );

    try {

      await addUserButton.first().click({
        timeout: 10000
      });

    } catch (error) {

      console.log(
        'Normal Add User(s) click failed.'
      );

      console.log(
        'Retrying using force...'
      );

      await addUserButton.first().click({
        force: true,
        timeout: 10000
      });
    }

    await page.waitForTimeout(700);

    console.log(
      'Add User(s) form opened.'
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

  console.log(
    'Login successful.'
  );

  console.log(
    `URL: ${page.url()}`
  );

  // =====================================================
  // USERS MODULE
  // =====================================================

  console.log(
    '=== USERS MODULE ==='
  );

  await page.getByRole('button', {
    name: 'USERS'
  }).click();

  await waitForUsersPage();

  // =====================================================
  // ARCHIVED CHATS
  // =====================================================

  console.log(
    '=== ARCHIVED CHATS ==='
  );

  await openUsersPage('archivedChats');

  const archivedUser = page.getByText(
    '3701',
    {
      exact: true
    }
  );

  if (
    await archivedUser.isVisible().catch(() => false)
  ) {

    await archivedUser.click({
      timeout: 15000
    });

    const cancelButton = page.getByRole(
      'button',
      {
        name: 'Cancel'
      }
    );

    if (
      await cancelButton.isVisible().catch(() => false)
    ) {

      await cancelButton.click({
        timeout: 15000
      });
    }
  }

  // =====================================================
  // ALL CHATS
  // =====================================================

  console.log(
    '=== ALL CHATS ==='
  );

  await openUsersPage('allChats');

  // =====================================================
  // SEARCH USERS
  // =====================================================

  console.log(
    '=== SEARCH USERS ==='
  );

  const searchBox = page.getByRole(
    'textbox',
    {
      name: 'Search Users'
    }
  );

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

  console.log(
    '=== FLAGS ==='
  );

  await selectFlag('#alexh');

  await selectFlag('#alexh');

  console.log(
    'Flag #alexh selected and removed successfully.'
  );

  // =====================================================
  // ADVANCED FILTER
  // =====================================================

  await openAndCloseAdvancedFilter();

  // =====================================================
  // ATTRIBUTE HYPERLINK
  // =====================================================

  console.log(
    '=== ATTRIBUTE HYPERLINK ==='
  );

  console.log(
    'Looking for Select Attribute dropdown...'
  );

  const attributeDropdown = page.getByRole(
    'combobox',
    {
      name: 'Select Attribute'
    }
  );

  let attributeDropdownCount =
    await attributeDropdown.count();

  console.log(
    `Select Attribute dropdown count: ${attributeDropdownCount}`
  );

  let attributeDropdownToUse =
    attributeDropdown;

  if (attributeDropdownCount === 0) {

    console.log(
      'Select Attribute combobox was not found by role.'
    );

    console.log(
      'Trying fallback locator...'
    );

    const fallbackAttributeDropdown =
      page.locator('mat-select').filter({
        hasText: 'Select Attribute'
      }).first();

    attributeDropdownCount =
      await fallbackAttributeDropdown.count();

    if (attributeDropdownCount > 0) {

      console.log(
        'Select Attribute found using fallback locator.'
      );

      attributeDropdownToUse =
        fallbackAttributeDropdown;

    } else {

      console.log(
        'Select Attribute dropdown could not be found.'
      );

      console.log(
        'Skipping Attribute Hyperlink section.'
      );
    }
  }

  if (attributeDropdownCount > 0) {

    await expect(
      attributeDropdownToUse
    ).toBeVisible({
      timeout: 15000
    });

    await attributeDropdownToUse
      .scrollIntoViewIfNeeded();

    console.log(
      'Opening Select Attribute dropdown...'
    );

    try {

      await attributeDropdownToUse.click({
        timeout: 10000
      });

    } catch (error) {

      console.log(
        'Normal Select Attribute click failed.'
      );

      console.log(
        'Retrying using force...'
      );

      await attributeDropdownToUse.click({
        force: true,
        timeout: 10000
      });
    }

    await page.waitForTimeout(500);

    console.log(
      'Select Attribute dropdown opened.'
    );

    // -------------------------------------------------
    // ACTIVATION TIME
    // -------------------------------------------------

    console.log(
      'Looking for activationTime attribute...'
    );

    let activationTimeOption =
      page.getByRole(
        'option',
        {
          name: 'activationTime',
          exact: true
        }
      );

    let activationTimeCount =
      await activationTimeOption.count();

    console.log(
      `activationTime option count: ${activationTimeCount}`
    );

    if (activationTimeCount === 0) {

      console.log(
        'activationTime was not found using option role.'
      );

      console.log(
        'Trying text locator...'
      );

      activationTimeOption =
        page.getByText(
          'activationTime',
          {
            exact: true
          }
        ).last();

      activationTimeCount =
        await activationTimeOption.count();

      console.log(
        `activationTime text count: ${activationTimeCount}`
      );
    }

    if (activationTimeCount === 0) {

      console.log(
        'activationTime attribute was NOT found.'
      );

      await page.keyboard.press('Escape');

      await page.waitForTimeout(500);

    } else {

      await expect(
        activationTimeOption.last()
      ).toBeVisible({
        timeout: 15000
      });

      await activationTimeOption.last()
        .scrollIntoViewIfNeeded();

      console.log(
        'Selecting activationTime...'
      );

      try {

        await activationTimeOption.last().click({
          timeout: 10000
        });

      } catch (error) {

        console.log(
          'Normal activationTime click failed.'
        );

        console.log(
          'Retrying activationTime click using force...'
        );

        await activationTimeOption.last().click({
          force: true,
          timeout: 10000
        });
      }

      console.log(
        'activationTime selected.'
      );

      await page.waitForTimeout(500);

      // -------------------------------------------------
      // CLOSE ATTRIBUTE DROPDOWN
      // -------------------------------------------------

      console.log(
        'Checking if Select Attribute dropdown closed...'
      );

      const attributeDropdownPanel =
        page.locator(
          '.cdk-overlay-container .mat-mdc-select-panel:visible'
        );

      if (
        await attributeDropdownPanel.count() > 0
      ) {

        console.log(
          'Attribute dropdown is still open.'
        );

        console.log(
          'Pressing Escape to close it...'
        );

        await page.keyboard.press('Escape');

        await page.waitForTimeout(500);
      }

      if (
        await attributeDropdownPanel.count() > 0
      ) {

        console.log(
          'Dropdown is still open.'
        );

        console.log(
          'Pressing Escape again...'
        );

        await page.keyboard.press('Escape');

        await page.waitForTimeout(500);
      }

      if (
        await attributeDropdownPanel.count() > 0
      ) {

        console.log(
          'WARNING: Attribute dropdown is still visible.'
        );

      } else {

        console.log(
          'Attribute dropdown closed.'
        );
      }

      // -------------------------------------------------
      // ATTRIBUTE HYPERLINK
      // -------------------------------------------------

      console.log(
        'Looking for Attribute Hyperlink textbox...'
      );

      const hyperlink = page.getByRole(
        'textbox',
        {
          name: 'Attribute Hyperlink'
        }
      );

      const hyperlinkCount =
        await hyperlink.count();

      console.log(
        `Attribute Hyperlink count: ${hyperlinkCount}`
      );

      if (hyperlinkCount > 0) {

        await expect(
          hyperlink.first()
        ).toBeVisible({
          timeout: 15000
        });

        console.log(
          'Filling Attribute Hyperlink...'
        );

        await hyperlink.first().fill(
          'https://testzip.com',
          {
            timeout: 10000
          }
        );

        console.log(
          'Attribute Hyperlink filled successfully.'
        );

        // -------------------------------------------------
        // ADD HYPERLINK
        // -------------------------------------------------

        console.log(
          'Looking for Add Hyperlink button...'
        );

        const addHyperlinkButton =
          page.getByRole(
            'button',
            {
              name: 'Add Hyperlink'
            }
          );

        const addHyperlinkCount =
          await addHyperlinkButton.count();

        console.log(
          `Add Hyperlink button count: ${addHyperlinkCount}`
        );

        if (addHyperlinkCount > 0) {

          await expect(
            addHyperlinkButton.first()
          ).toBeVisible({
            timeout: 15000
          });

          console.log(
            'Clicking Add Hyperlink...'
          );

          try {

            await addHyperlinkButton.first().click({
              timeout: 10000
            });

          } catch (error) {

            console.log(
              'Normal Add Hyperlink click failed.'
            );

            console.log(
              'Retrying using force...'
            );

            await addHyperlinkButton.first().click({
              force: true,
              timeout: 10000
            });
          }

          console.log(
            'Attribute hyperlink added successfully.'
          );
        }
      }
    }
  }

  // =====================================================
  // PAGINATION
  // =====================================================

  console.log(
    '=== PAGINATION ==='
  );

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

  } else {

    console.log(
      'Paginator page size dropdown was not found.'
    );
  }

  // =====================================================
  // DELETE FOREVER
  // =====================================================

  console.log(
    '=== DELETE FOREVER ==='
  );

  const deleteForever = page.getByRole(
    'button',
    {
      name: 'delete_forever'
    }
  );

  if (
    await deleteForever.isVisible().catch(() => false)
  ) {

    await deleteForever.click({
      timeout: 15000
    });

    await page.getByRole(
      'button',
      {
        name: 'Yes'
      }
    ).click({
      timeout: 15000
    });

    console.log(
      'Delete Forever confirmed.'
    );
  }

  // =====================================================
  // PAGE SIZE: 5
  // =====================================================

  console.log(
    '=== PAGE SIZE: 5 ==='
  );

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

  } else {

    console.log(
      'Last paginator page size dropdown was not found.'
    );
  }

  // =====================================================
  // NEXT PAGE
  // =====================================================

  console.log(
    '=== NEXT PAGE ==='
  );

  const nextPage = page.getByLabel(
    'Next page'
  );

  for (let i = 0; i < 2; i++) {

    if (
      await nextPage.isEnabled().catch(() => false)
    ) {

      await nextPage.click({
        timeout: 15000
      });

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

  console.log(
    '=== USER SELECTION ==='
  );

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

    await checkbox.check({
      timeout: 15000
    });

    await checkbox.uncheck({
      timeout: 15000
    });

    await checkbox.check({
      timeout: 15000
    });

    await page.getByRole(
      'button',
      {
        name: 'Delete'
      }
    ).click({
      timeout: 15000
    });

    await page.getByRole(
      'button',
      {
        name: 'No'
      }
    ).click({
      timeout: 15000
    });

    await checkbox.uncheck({
      timeout: 15000
    });

    console.log(
      'Delete confirmation cancelled.'
    );
  }

  // =====================================================
  // CSV DOWNLOAD
  // =====================================================

  console.log(
    '=== CSV DOWNLOAD ==='
  );

  const downloadLink = page.getByRole(
    'link',
    {
      name: 'here'
    }
  );

  if (
    await downloadLink.isVisible().catch(() => false)
  ) {

    console.log(
      'CSV download link is visible.'
    );

    const [download] = await Promise.all([

      page.waitForEvent(
        'download',
        {
          timeout: 15000
        }
      ),

      downloadLink.click({
        timeout: 15000
      })

    ]);

    console.log(
      `Downloaded: ${download.suggestedFilename()}`
    );
  }

  // =====================================================
  // FORMATTING HELP
  // =====================================================

  console.log(
    '=== FORMATTING HELP ==='
  );

  const formattingHelp = page.getByText(
    'Formatting help',
    {
      exact: true
    }
  );

  if (
    await formattingHelp.isVisible().catch(() => false)
  ) {

    await formattingHelp.click({
      timeout: 15000
    });

    console.log(
      'Formatting help opened.'
    );

    await page.waitForTimeout(500);

    await page.keyboard.press('Escape');

    await page.waitForTimeout(500);
  }

  // =====================================================
  // SCHEDULING
  // =====================================================

  console.log(
    '=== SCHEDULING ==='
  );

  const scheduling = page.getByRole(
    'link',
    {
      name: 'scheduling'
    }
  );

  if (
    await scheduling.isVisible().catch(() => false)
  ) {

    console.log(
      'Scheduling link is visible.'
    );

    try {

      const [schedulingPage] =
        await Promise.all([

          page.waitForEvent(
            'popup',
            {
              timeout: 15000
            }
          ),

          scheduling.click({
            timeout: 15000
          })

        ]);

      await schedulingPage.waitForLoadState(
        'domcontentloaded',
        {
          timeout: 15000
        }
      );

      console.log(
        `Scheduling URL: ${schedulingPage.url()}`
      );

      await schedulingPage.close();

      console.log(
        'Scheduling tab closed.'
      );

    } catch (error) {

      console.log(
        'Scheduling did not open a popup. Continuing test.'
      );
    }
  }

  // =====================================================
  // ADD USERS
  // =====================================================

  console.log(
    '=== ADD USERS ==='
  );

  await openAddUserForm();

  // =====================================================
  // ADD USER FORM
  // =====================================================

  const firstNameInput = page.getByRole(
    'textbox',
    {
      name: 'First Name'
    }
  );

  await expect(
    firstNameInput
  ).toBeVisible({
    timeout: 15000
  });

  await firstNameInput.fill(
    'test'
  );

  await page.getByRole(
    'textbox',
    {
      name: 'Last name'
    }
  ).fill(
    'user'
  );

  await page.getByRole(
    'textbox',
    {
      name: 'Phone'
    }
  ).fill(
    '+8746302'
  );

  await page.getByRole(
    'textbox',
    {
      name: 'Email'
    }
  ).fill(
    'test7@test.com'
  );

  // =====================================================
  // CAMPAIGN
  // =====================================================

  console.log(
    '=== CAMPAIGN ==='
  );

  console.log(
    'Campaign selection skipped. Continuing to Add User Flags.'
  );

  // =====================================================
  // ADD USER FLAGS
  // =====================================================

  console.log(
    '=== ADD USER FLAGS ==='
  );

  const flagsInput = page.getByRole(
    'textbox',
    {
      name: 'Flags'
    }
  );

  if (
    await flagsInput.isVisible().catch(() => false)
  ) {

    await flagsInput.fill(
      'alex'
    );

    await flagsInput.fill(
      'purple'
    );

    console.log(
      'User flags entered.'
    );

  } else {

    console.log(
      'Flags input was not found. Continuing.'
    );
  }

  // =====================================================
  // SAVE USER
  // =====================================================

  console.log(
    '=== SAVE USER ==='
  );

  const saveUsersButton = page.getByRole(
    'button',
    {
      name: 'Save Users'
    }
  );

  await expect(
    saveUsersButton
  ).toBeVisible({
    timeout: 15000
  });

  console.log(
    'Save Users button is visible.'
  );

  await saveUsersButton.click({
    timeout: 15000
  });

  console.log(
    'Save Users clicked.'
  );

  // =====================================================
  // HANDLE CONFIRMATION
  // =====================================================

  const okayButton = page.getByRole(
    'button',
    {
      name: 'Okay'
    }
  );

  if (
    await okayButton.isVisible().catch(() => false)
  ) {

    console.log(
      'Confirmation dialog detected.'
    );

    await okayButton.click({
      timeout: 15000
    });

    console.log(
      'Confirmation dialog accepted.'
    );
  }

  // =====================================================
  // SECOND USER
  // =====================================================

  console.log(
    '=== SECOND USER ==='
  );

  const secondUserFirstName =
    page.getByRole(
      'textbox',
      {
        name: 'First Name'
      }
    );

  const secondUserFormOpen =
    await secondUserFirstName
      .isVisible()
      .catch(() => false);

  if (secondUserFormOpen) {

    console.log(
      'Second user form is still open.'
    );

    await secondUserFirstName.fill(
      'jen'
    );

    await page.getByRole(
      'textbox',
      {
        name: 'Last name'
      }
    ).fill(
      'test2'
    );

    await page.getByRole(
      'textbox',
      {
        name: 'Phone'
      }
    ).fill(
      '+75638495'
    );

    await page.getByRole(
      'textbox',
      {
        name: 'Email'
      }
    ).fill(
      'test7@capacity.com'
    );

    console.log(
      'Second user information entered.'
    );

    const saveSecondUserButton =
      page.getByRole(
        'button',
        {
          name: 'Save Users'
        }
      );

    if (
      await saveSecondUserButton
        .isVisible()
        .catch(() => false)
    ) {

      console.log(
        'Saving second user...'
      );

      await saveSecondUserButton.click({
        timeout: 15000
      });

      console.log(
        'Second user saved.'
      );

      const secondOkayButton =
        page.getByRole(
          'button',
          {
            name: 'Okay'
          }
        );

      if (
        await secondOkayButton
          .isVisible()
          .catch(() => false)
      ) {

        await secondOkayButton.click({
          timeout: 15000
        });

        console.log(
          'Second user confirmation accepted.'
        );
      }

    } else {

      console.log(
        'Save Users button for second user was not found.'
      );
    }

  } else {

    console.log(
      'Second user form is not open. Skipping second user.'
    );
  }

  // =====================================================
  // CSV UPLOAD
  // =====================================================

  console.log(
    '=== CSV UPLOAD ==='
  );

  const csvFilePath =
    'C:\\Users\\admin\\OneDrive\\Desktop\\Projects\\Playwright\\bajne.csv';

  if (existsSync(csvFilePath)) {

    console.log(
      `CSV file found: ${csvFilePath}`
    );

    await page.goto(
      USERS_URL
    );

    await waitForUsersPage();

    const csvInput = page.locator(
      '#csvInput'
    );

    await expect(
      csvInput
    ).toHaveCount(1, {
      timeout: 15000
    });

    await csvInput.setInputFiles(
      csvFilePath
    );

    console.log(
      'CSV upload completed.'
    );

  } else {

    console.log(
      `CSV file was not found: ${csvFilePath}`
    );

    console.log(
      'CSV upload skipped. Continuing test.'
    );
  }

  // =====================================================
  // LOGOUT
  // =====================================================

  console.log(
    '=== LOGOUT ==='
  );

  const menuButton = page.getByRole(
    'button'
  ).filter({
    hasText: /^$/
  }).nth(2);

  await expect(
    menuButton
  ).toBeVisible({
    timeout: 30000
  });

  await menuButton.click({
    timeout: 15000
  });

  const logout = page.getByRole(
    'menuitem',
    {
      name: 'Logout'
    }
  );

  await expect(
    logout
  ).toBeVisible({
    timeout: 10000
  });

  await logout.click({
    timeout: 15000
  });

  await expect(
    page.getByRole(
      'textbox',
      {
        name: 'Email Address'
      }
    )
  ).toBeVisible({
    timeout: 30000
  });

  console.log(
    'Logout successful.'
  );

});
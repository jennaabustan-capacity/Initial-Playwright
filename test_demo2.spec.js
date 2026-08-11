const {test,expect} = require('@playwright/test')

test('test demo2', async ({page}) => {
    await page.goto('https://google.com');
    await expect(page).toHaveTitle('Google');
});
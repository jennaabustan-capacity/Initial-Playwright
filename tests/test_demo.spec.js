const {test, expect} = require('@playwright/test')

test('test demo', async ({page}) => {
    await page.goto('https://test.klaunch.io/#/auth/login');
    console.log(await page.title());
});
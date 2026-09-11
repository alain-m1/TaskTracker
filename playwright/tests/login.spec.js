const { test, expect } = require('@playwright/test');
const { VALID_USERNAME, VALID_PASSWORD } = require('./helpers');

test.describe('login', () => {
  test('valid login shows the task list', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('username-input').fill(VALID_USERNAME);
    await page.getByTestId('password-input').fill(VALID_PASSWORD);
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('task-list')).toBeVisible();
  });

  test('invalid login shows an error message', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('username-input').fill('wrong-user');
    await page.getByTestId('password-input').fill('wrong-password');
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('login-error')).toBeVisible();
    await expect(page.getByTestId('login-error')).toHaveText(/invalid/i);
  });
});

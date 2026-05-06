import { test, expect } from '@playwright/test'

/**
 * TASK 01 — Login
 *
 * Test the login flow at /login.
 * Credentials: user@example.com / password12345
 */

const VALID_EMAIL = 'user@example.com'
const VALID_PASSWORD = 'password12345'

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('logs in with valid credentials', async ({ page }) => {
    await expect(
        page.locator('header')
            .getByRole('button', { name: /log out|sign out/i })
    ).not.toBeVisible();

    await page.getByLabel('Email Address').fill(VALID_EMAIL)
    await page.getByLabel('Password').fill(VALID_PASSWORD)
    await page.click('[type="submit"]')

    await expect(page).toHaveURL('/profile')
    await expect(
        page.locator('header')
            .getByRole('button', { name: /log out|sign out/i })
    ).toBeVisible();
  })




})

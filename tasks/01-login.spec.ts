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

    test('logs in with valid credentials and verifies if the user is actually logged in.', async ({ page }) => {
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

    test('shows an error for invalid email and password', async ({ page }) => {
        await page.fill('#email', 'wrong@example.com')
        await page.fill('#password', 'wrongpassword')
        await page.click('[type="submit"]')

        await expect(page).toHaveURL(/\/login$/)
        await expect(page.getByText(/login failed/i)).toBeVisible() 
    })

    test('shows an error if logs in with invalid email format', async ({ page }) => {
        await page.fill('#email', 'wrong')
        await page.fill('#password', 'wrongpassword')
        await page.click('[type="submit"]')

        await expect(page).toHaveURL(/\/login$/)
        await expect(page.getByText(/login failed/i)).toBeVisible() 
    })

    test('shows an error if password is missing', async ({ page }) => {
        await page.fill('#email', 'wrong@exampl')
        await page.click('[type="submit"]')

        await expect(page).toHaveURL(/\/login$/)
        await expect(page.getByText(/Password is required/i)).toBeVisible() 
    })

    test('shows an error if email is missing', async ({ page }) => {
        await page.fill('#password', 'VALID_PASSWORD')
        await page.click('[type="submit"]')

        await expect(page).toHaveURL(/\/login$/)
        await expect(page.getByText(/Email is required/i)).toBeVisible() 
    })


})

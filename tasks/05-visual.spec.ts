import { test, expect } from '@playwright/test'

/**
 * TASK 05 — Visual regression
 *
 * Write a visual test for the locker details page at /challenges/visual.
 */

test.describe("TASK 05 — Visual regression", () => {
  test('locker card', async ({ page }) => {

    await page.goto('/challenges/visual')

    const lockerCard = page.locator('[data-testid="locker-card"]')
    await expect(lockerCard).toHaveScreenshot('locker-card.png', {
      mask: [page.locator('[data-testid="compartment-availability"]')] 
    })
  })
});
import { test, expect } from '@playwright/test'

/**
 * TASK 04 — Async wait
 *
 * Write a stable test for the parcel tracking flow at /challenges/async.
 * The test must pass consistently across multiple runs.
 */

test('parcel tracking works correctly', async ({ page, request}) => {

  const createResponse = await request.post(`http://localhost:3000/api/parcels`, {
    headers: { Authorization: `Bearer test-token-inpost-2026` },
    data: {
      recipientName: "Jan Kowalski",
      recipientEmail: "jan@example.com",
      size: "A",
      deliveryType: "LOCKER",
      lockerCode: "KRK001",
    },
  });
  expect(createResponse.status()).toBe(201);
  const parcel = await createResponse.json();


  const readyResponse = page.waitForResponse(
    (response) =>
      response.url().includes('/api/parcel-ready') && response.status() === 200,
  )

  await page.goto('/challenges/async')
  await readyResponse
  await expect(page.locator('[data-testid="system-ready"]')).toHaveText('System ready')

  await page.getByLabel('Parcel number').fill(parcel.id)

  const submitResponse = page.waitForResponse(
    (response) =>
      response.url().includes('/api/parcel-submit') && response.request().method() === 'POST',
  )
  await page.getByRole('button', { name: /track parcel/i }).click()
  expect((await submitResponse).status()).toBe(200)

  await expect(page.getByText('PARCEL FOUND')).toBeVisible()
})

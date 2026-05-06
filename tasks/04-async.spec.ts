import { test, expect } from '@playwright/test'

/**
 * TASK 04 — Async wait
 *
 * Write a stable test for the parcel tracking flow at /challenges/async.
 * The test must pass consistently across multiple runs.
 */

const AUTH_HEADER = { Authorization: 'Bearer test-token-inpost-2026' }
test.describe("TASK 04 — Async wait", () => {
  let parcelId: string 

  test.beforeEach(async ({ request }) => {
    const create = await request.post('/api/parcels', {
      headers:AUTH_HEADER,
        data: {
          recipientName: "Jan Kowalski",
          recipientEmail: "jan@example.com",
          size: "A",
          deliveryType: "LOCKER",
          lockerCode: "KRK001",
        },
    })
    expect(create.status()).toBe(201)

    const parcel = await create.json()
    parcelId = parcel.id
  })

  test.afterEach(async ({ request }) => {

    const deleteResponse = await request.delete(`/api/parcels/${parcelId}`, {
        headers:AUTH_HEADER,
      });
    expect(deleteResponse.status()).toBe(204);
  })

  test('parcel tracking works correctly', async ({ page, request}) => {

    const readyResponse = page.waitForResponse(
      (response) =>
        response.url().includes('/api/parcel-ready') && response.status() === 200,
    )

    await page.goto('/challenges/async')
    await readyResponse
    await expect(page.locator('[data-testid="system-ready"]')).toHaveText('System ready')

    await page.getByLabel('Parcel number').fill(parcelId)

    const submitResponse = page.waitForResponse(
      (response) =>
        response.url().includes('/api/parcel-submit') && response.request().method() === 'POST',
    )
    await page.getByRole('button', { name: /track parcel/i }).click()
    expect((await submitResponse).status()).toBe(200)

    await expect(page.getByText('PARCEL FOUND')).toBeVisible()
  })
})

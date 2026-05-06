import { test, expect } from '@playwright/test'

/**
 * TASK 06 — API testing
 *
 * Documentation: http://localhost:3000/challenges/api-testing
 * Auth token: test-token-inpost-2026
 */
const AUTH_HEADER = { Authorization: 'Bearer test-token-inpost-2026' }
const PARCEL_DATA = {
            recipientName: "Jan Kowalski",
            recipientEmail: "jan@example.com",
            size: "A",
            deliveryType: "LOCKER",
            lockerCode: "KRK001",
          }
const BASE_URL = "http://localhost:3000/api/parcels";


// ---------------------------------------------------------------------------
// Version A — Recruitment
// Test the POST /api/parcels endpoint.
// ---------------------------------------------------------------------------
test.describe('POST /api/parcels', () => {
    let parcelId: string 
  
    test.afterEach(async ({ request }) => {
      await request.delete(`${BASE_URL}/${parcelId}`, {
          headers:AUTH_HEADER,
      });
    })

    
  test('creates a parcel with valid payload and auth token', async ({ request }) => {
    const response = await request.post('/api/parcels', {
      headers: AUTH_HEADER,
      data: PARCEL_DATA,
    })

    expect(response.status()).toBe(201)
    const parcel = await response.json()
    parcelId = parcel.id

    expect(parcel).toMatchObject({
      ...PARCEL_DATA,
      status: 'CREATED',
    })
  })

  test('rejects creating a parcel without auth token', async ({ request }) => {
    const response = await request.post('/api/parcels', {
      data: PARCEL_DATA,
    })
    expect(response.status()).toBe(401)
  })

  test('missing or invalid field', async ({ request }) => {
    const response = await request.post('/api/parcels', {
      headers: AUTH_HEADER,
      data: {
        recipientName: "Jan Kowalski",
        size: "A",
        deliveryType: "LOCKER",
        lockerCode: "KRK001",
      },
    })
    expect(response.status()).toBe(400)
  })

})

// ---------------------------------------------------------------------------
// Version B — Internship
// Test the full update flow: create a parcel and update it with PATCH
// ---------------------------------------------------------------------------


test.describe('PATCH /api/parcels - Full Lifecycle', () => {
});

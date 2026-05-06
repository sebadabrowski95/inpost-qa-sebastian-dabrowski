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
    let parcelId: string 
  
    test.beforeEach(async ({ request }) => {
      const create = await request.post(`${BASE_URL}`, {
        headers:AUTH_HEADER,
        data: PARCEL_DATA,
      })  
      const parcel = await create.json()
      parcelId = parcel.id
    })

    test.afterEach(async ({ request }) => {
      await request.delete(`${BASE_URL}/${parcelId}`, {
          headers:AUTH_HEADER,
      });
    })


    test.describe('Positive scenarios for PATCH /api/parcels/:id/status', () => {
      test('should update status from CREATED to IN_TRANSIT to IN_LOCKER to DELIVERED', async ({ request }) => {
        let response = await request.patch(`${BASE_URL}/${parcelId}/status`, {
          headers: AUTH_HEADER,
          data: { status: 'IN_TRANSIT' },
        });

        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.status).toBe('IN_TRANSIT');
        expect(body).toHaveProperty('updatedAt');

        response = await request.patch(`${BASE_URL}/${parcelId}/status`, {
          headers: AUTH_HEADER,
          data: { status: 'IN_LOCKER' },
        });
        expect(response.status()).toBe(200);

        response = await request.patch(`${BASE_URL}/${parcelId}/status`, {
          headers: AUTH_HEADER,
          data: { status: 'DELIVERED' },
        });
        expect(response.status()).toBe(200);
      });
    })
     

    

    test.describe('Negative scenarios for PATCH /api/parcels/:id/status', () => {

      test('should return 400 when status value is misspelled (e.g. IN_TRANSI)', async ({ request }) => {
        const response = await request.patch(`${BASE_URL}/${parcelId}/status`, {
          headers: AUTH_HEADER,
          data: { status: 'IN_TRANSI' },
        });
        expect(response.status()).toBe(400);
      });

      test('should return 401 when no auth header is provided', async ({ request }) => {
        const response = await request.patch(`${BASE_URL}/${parcelId}/status`, {
          data: { status: 'IN_TRANSIT' },
        });
        expect(response.status()).toBe(401);
      });

      test('should return 404 when parcel ID is invalid', async ({ request }) => {
        const response = await request.patch(`${BASE_URL}/wrongID/status`, {
          headers: AUTH_HEADER,
          data: { status: 'IN_TRANSIT' },
        });
        expect(response.status()).toBe(404);
      });

      test('should return 409 when trying to update a parcel in final state (DELIVERED)', async ({ request }) => {
        await request.patch(`${BASE_URL}/${parcelId}/status`, {
          headers: AUTH_HEADER,
          data: { status: 'IN_TRANSIT' },
        });
        await request.patch(`${BASE_URL}/${parcelId}/status`, {
          headers: AUTH_HEADER,
          data: { status: 'DELIVERED' },
        });
        const response = await request.patch(`${BASE_URL}/${parcelId}/status`, {
          headers: AUTH_HEADER,
          data: { status: 'IN_TRANSIT' },
        });
        expect(response.status()).toBe(409);
      });

      test('should return 409 when trying to update a parcel in final state (FAILED)', async ({ request }) => {
        await request.patch(`${BASE_URL}/${parcelId}/status`, {
          headers: AUTH_HEADER,
          data: { status: 'IN_TRANSIT' },
        });
        await request.patch(`${BASE_URL}/${parcelId}/status`, {
          headers: AUTH_HEADER,
          data: { status: 'FAILED' },
        });
        const response = await request.patch(`${BASE_URL}/${parcelId}/status`, {
          headers: AUTH_HEADER,
          data: { status: 'IN_TRANSIT' },
        });
        expect(response.status()).toBe(409);
      });
    })

});

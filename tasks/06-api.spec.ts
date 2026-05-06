import { test, expect } from '@playwright/test'

/**
 * TASK 06 — API testing
 *
 * Documentation: http://localhost:3000/challenges/api-testing
 * Auth token: test-token-inpost-2026
 */

// ---------------------------------------------------------------------------
// Version A — Recruitment
// Test the POST /api/parcels endpoint.
// ---------------------------------------------------------------------------

test.describe('POST /api/parcels', () => {
  // TODO
})

// ---------------------------------------------------------------------------
// Version B — Internship
// Test the full update flow: create a parcel and update it with PATCH
// ---------------------------------------------------------------------------



test.describe('PATCH /api/parcels - Full Lifecycle', () => {
  const AUTH_HEADER = { Authorization: 'Bearer test-token-inpost-2026' };
  const API_PATH = '/api/parcels';

  test('should create a parcel and then update its notes and phoneNumber', async ({ request }) => {
    
    const createResponse = await request.post(API_PATH, {
      headers: AUTH_HEADER,
      data: {
        recipientName: "Intern Candidate",
        recipientEmail: "intern@example.com",
        size: "A",
        deliveryType: "COURIER"
      }
    });
    
    expect(createResponse.status()).toBe(201);
    const parcel = await createResponse.json();
    const parcelId = parcel.id;

    const updatedData = {
      notes: "Please leave with the neighbor",
      phoneNumber: "+48 123 456 789"
    };

    const updateResponse = await request.patch(`${API_PATH}/${parcelId}`, {
      headers: AUTH_HEADER,
      data: updatedData
    });

   
    expect(updateResponse.status()).toBe(200);
    const body = await updateResponse.json();
    
    expect(body.notes).toBe(updatedData.notes);
    expect(body.phoneNumber).toBe(updatedData.phoneNumber);
    expect(body.id).toBe(parcelId); 
  });
});

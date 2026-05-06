import { test, expect } from "@playwright/test";

/**
 * TASK 02 — Refactor
 *
 * The test below works but is written poorly. Refactor it.
 */

// better if token is hidden in env variable, but for simplicity we keep it here, 
// and reduce repetition "{ Authorization: `Bearer ${TOKEN}` }" to one constant
const AUTH_HEADER = { Authorization: `Bearer test-token-inpost-2026` };
const BASE_URL = "http://localhost:3000/api/parcels";

test.describe("Parcel API Lifecycle", () => {

  test("should complete full parcel lifecycle: create, update, ship, and delete", async ({ request }) => {
    // 1. Create a parcel
    const createResponse  = await request.post(`${BASE_URL}`, {
      headers:AUTH_HEADER,
      data: {
        recipientName: "Jan Kowalski",
        recipientEmail: "jan@example.com",
        size: "A",
        deliveryType: "LOCKER",
        lockerCode: "KRK001",
      },
    });
    expect(createResponse .status()).toBe(201);
    const parcel = await createResponse .json();

    // 2. Update the parcel's notes
    const updateResponse = await request.patch(`${BASE_URL}/${parcel.id}`, {
      headers:AUTH_HEADER,
      data: { notes: "Leave at the door" },
    });
    expect(updateResponse.status()).toBe(200);

    // 3. Change the parcel's status to "IN_TRANSIT"
    const statusResponse  = await request.patch(
      `${BASE_URL}/${parcel.id}/status`,
      {
        headers:AUTH_HEADER,
        data: { status: "IN_TRANSIT" },
      },
    );
    expect(statusResponse.status()).toBe(200);

    //4. Delete the parcel
    const deleteResponse  = await request.delete(`${BASE_URL}/${parcel.id}`, {
      headers:AUTH_HEADER,
    });
    expect(deleteResponse.status()).toBe(204);
  });
  
});

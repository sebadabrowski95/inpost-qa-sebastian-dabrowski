import { test, expect } from "@playwright/test";

/**
 * TASK 02 — Refactor
 *
 * The test below works but is written poorly. Refactor it.
 */

const TOKEN = "test-token-inpost-2026";
const BASE = "http://localhost:3000";

test("parcel lifecycle", async ({ request }) => {
  const create = await request.post(`${BASE}/api/parcels`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
    data: {
      recipientName: "Jan Kowalski",
      recipientEmail: "jan@example.com",
      size: "A",
      deliveryType: "LOCKER",
      lockerCode: "KRK001",
    },
  });
  expect(create.status()).toBe(201);
  const parcel = await create.json();

  const update = await request.patch(`${BASE}/api/parcels/${parcel.id}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
    data: { notes: "Leave at the door" },
  });
  expect(update.status()).toBe(200);

  const transit = await request.patch(
    `${BASE}/api/parcels/${parcel.id}/status`,
    {
      headers: { Authorization: `Bearer ${TOKEN}` },
      data: { status: "IN_TRANSIT" },
    },
  );
  expect(transit.status()).toBe(200);

  const del = await request.delete(`${BASE}/api/parcels/${parcel.id}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  expect(del.status()).toBe(204);
});

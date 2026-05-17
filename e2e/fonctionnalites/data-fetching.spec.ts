import { expect, test } from "../support/test";

test.describe("Data fetching routes", () => {
  test("Agent-only routes are forbidden", async ({ request }) => {
    await request.get("/");
    const response = await request.get(
      "/api/download/espace-agent/documents/552032534",
      {
        failOnStatusCode: false,
      }
    );

    expect(response.status()).toBe(403);
  });

  test("Public api routes are fine", async ({ request }) => {
    const response = await request.get("/api/feature-flags");

    expect(response.status()).toBe(200);
  });
});

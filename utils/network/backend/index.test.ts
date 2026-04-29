import { httpBackClient } from ".";

describe("httpBackClient", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns undefined for empty JSON responses", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue(
      new Response(null, {
        headers: { "content-type": "application/json" },
        status: 204,
      })
    );

    await expect(
      httpBackClient<void>({
        method: "DELETE",
        url: "https://example.test/users/1",
      })
    ).resolves.toBeUndefined();
  });

  it("parses JSON responses with a body", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        headers: { "content-type": "application/vnd.api+json" },
        status: 200,
      })
    );

    await expect(
      httpBackClient<{ ok: boolean }>({
        url: "https://example.test/users/1",
      })
    ).resolves.toEqual({ ok: true });
  });
});

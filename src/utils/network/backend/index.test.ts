import { vi } from "vitest";
import { httpBackClient } from ".";

const getConsole = () => Reflect.get(globalThis, "console") as Console;

describe("httpBackClient", () => {
  beforeEach(() => {
    vi.spyOn(getConsole(), "error").mockImplementation(() => undefined);
    vi.spyOn(getConsole(), "info").mockImplementation(() => undefined);
    vi.spyOn(getConsole(), "log").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns undefined for empty JSON responses", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
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
    vi.spyOn(global, "fetch").mockResolvedValue(
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

  it("returns text for non-JSON responses", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response("created", {
        headers: { "content-type": "text/plain" },
        status: 201,
      })
    );

    await expect(
      httpBackClient<string>({
        method: "POST",
        url: "https://example.test/users",
      })
    ).resolves.toBe("created");
  });

  it("returns blobs when responseType is blob", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response("file", {
        headers: { "content-type": "application/octet-stream" },
        status: 200,
      })
    );

    const blob = await httpBackClient<Blob>({
      responseType: "blob",
      url: "https://example.test/file",
    });

    expect(await blob.text()).toBe("file");
  });

  it("returns array buffers when responseType is arraybuffer", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response("buffer", {
        status: 200,
      })
    );

    const buffer = await httpBackClient<ArrayBuffer>({
      responseType: "arraybuffer",
      url: "https://example.test/file",
    });

    expect(new TextDecoder().decode(buffer)).toBe("buffer");
  });

  it("returns node streams when responseType is stream", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response("streamed", {
        status: 200,
      })
    );

    const stream = await httpBackClient<NodeJS.ReadableStream>({
      responseType: "stream",
      url: "https://example.test/file",
    });

    let data = "";
    for await (const chunk of stream) {
      data += chunk.toString();
    }

    expect(data).toBe("streamed");
  });

  it("serializes params, JSON bodies, and default headers", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        headers: { "content-type": "application/json" },
        status: 200,
      })
    );

    await httpBackClient({
      data: { name: "Ada" },
      method: "POST",
      params: { page: "1", q: "agent public" },
      url: "https://example.test/users",
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      "https://example.test/users?page=1&q=agent+public",
      expect.objectContaining({
        body: JSON.stringify({ name: "Ada" }),
        headers: expect.any(Headers),
        method: "POST",
      })
    );
    const requestInit = fetchSpy.mock.calls[0]?.[1];
    expect(requestInit?.headers).toBeInstanceOf(Headers);
    expect((requestInit?.headers as Headers).get("content-type")).toBe(
      "application/json"
    );
    expect((requestInit?.headers as Headers).get("user-agent")).toBe(
      "annuaire-entreprises-site"
    );
  });

  it("serializes form-urlencoded bodies when requested", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue(
      new Response("ok", {
        status: 200,
      })
    );

    await httpBackClient({
      data: { role: ["admin", "viewer"], user: "1" },
      headers: { "content-type": "application/x-www-form-urlencoded" },
      method: "POST",
      url: "https://example.test/users",
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      "https://example.test/users",
      expect.objectContaining({
        body: "role=admin&role=viewer&user=1",
        method: "POST",
      })
    );
  });

  it.each([
    {
      expectedMessage: "Request failed with status code 400",
      expectedName: "HttpBadRequestError",
      expectedStatus: 400,
      status: 400,
      statusText: "Bad request body",
    },
    {
      expectedMessage: "Unauthorized",
      expectedName: "HttpUnauthorizedError",
      expectedStatus: 401,
      status: 401,
      statusText: "Invalid token",
    },
    {
      expectedMessage: "Forbidden",
      expectedName: "HttpForbiddenError",
      expectedStatus: 403,
      status: 403,
      statusText: "Access denied",
    },
    {
      expectedMessage: "Missing",
      expectedName: "HttpNotFound",
      expectedStatus: 404,
      status: 404,
      statusText: "Missing",
    },
    {
      expectedMessage: "Conflict",
      expectedName: "HttpConflict",
      expectedStatus: 409,
      status: 409,
      statusText: "Version mismatch",
    },
    {
      expectedMessage: "Request failed with status code 422",
      expectedName: "HttpUnprocessableEntity",
      expectedStatus: 422,
      status: 422,
      statusText: "Validation failed",
    },
    {
      expectedMessage: "Locked by another request",
      expectedName: "HttpLocked",
      expectedStatus: 423,
      status: 423,
      statusText: "Locked by another request",
    },
    {
      expectedMessage: "Slow down",
      expectedName: "HttpTooManyRequests",
      expectedStatus: 429,
      status: 429,
      statusText: "Slow down",
    },
    {
      expectedMessage: "Agent limit reached",
      expectedName: "AgentOverRateLimit",
      expectedStatus: 432,
      status: 432,
      statusText: "Agent limit reached",
    },
    {
      expectedMessage: "Timeout",
      expectedName: "HttpTimeoutError",
      expectedStatus: 408,
      status: 408,
      statusText: "Request timeout",
    },
    {
      expectedMessage: "Timeout",
      expectedName: "HttpTimeoutError",
      expectedStatus: 408,
      status: 504,
      statusText: "Gateway timeout",
    },
  ])("throws $expectedName for HTTP $status responses", async ({
    expectedMessage,
    expectedName,
    expectedStatus,
    status,
    statusText,
  }) => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(null, {
        status,
        statusText,
      })
    );

    await expect(
      httpBackClient({
        url: "https://example.test/failure",
      })
    ).rejects.toMatchObject({
      message: expectedMessage,
      name: expectedName,
      status: expectedStatus,
    });
  });

  it("throws HttpServerError for unmapped HTTP failures", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response(null, {
        status: 500,
        statusText: "Internal Server Error",
      })
    );

    await expect(
      httpBackClient({
        url: "https://example.test/failure",
      })
    ).rejects.toMatchObject({
      message:
        "Unknown server error while querying https://example.test/failure. Internal Server Error Request failed with status code 500",
      name: "HttpServerError",
      status: 500,
    });
  });

  it("throws HttpConnectionReset when fetch fails with ECONNRESET", async () => {
    vi.spyOn(global, "fetch").mockRejectedValue(new Error("read ECONNRESET"));

    await expect(
      httpBackClient({
        url: "https://example.test/failure",
      })
    ).rejects.toMatchObject({
      message:
        "ECONNRESET  while querying https://example.test/failure.  Error: read ECONNRESET",
      name: "HttpConnectionReset",
      status: 500,
    });
  });

  it("throws HttpServerError when JSON parsing fails", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(
      new Response("{", {
        headers: { "content-type": "application/json" },
        status: 200,
      })
    );

    await expect(
      httpBackClient({
        url: "https://example.test/malformed-json",
      })
    ).rejects.toMatchObject({
      name: "HttpServerError",
      status: 500,
    });
  });
});

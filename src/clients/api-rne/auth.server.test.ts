import { vi } from "vitest";
import {
  HttpForbiddenError,
  HttpNotFound,
  HttpServerError,
  HttpTooManyRequests,
  HttpUnauthorizedError,
} from "#/clients/exceptions";
import routes from "#/clients/routes";
import httpClient, { httpGet } from "#/utils/network";
import { RNEClient } from "./auth.server";

vi.mock(import("#/utils/network"), () => ({
  default: vi.fn(),
  httpGet: vi.fn(),
}));

const RESOURCE_URL = "https://api.rne.test/resource";
const MAIN_CREDENTIALS = {
  username: "main-login",
  password: "main-password",
};
const FALLBACK_CREDENTIALS = {
  username: "fallback-login",
  password: "fallback-password",
};
const MAIN_RESULT = { account: "main" };
const FALLBACK_RESULT = { account: "fallback" };
const mockHttpClient = vi.mocked(httpClient);
const mockHttpGet = vi.mocked(httpGet);

const expectLoginToUse = (
  callNumber: number,
  credentials: typeof MAIN_CREDENTIALS
) => {
  expect(mockHttpClient.mock.calls[callNumber - 1]?.[0]).toEqual(
    expect.objectContaining({
      method: "POST",
      url: routes.inpi.api.rne.login,
      data: credentials,
      headers: { "Content-Type": "application/json" },
    })
  );
};

const expectLastRequestToUse = (token: string) => {
  expect(mockHttpGet).toHaveBeenLastCalledWith(
    RESOURCE_URL,
    expect.objectContaining({
      headers: expect.objectContaining({ Authorization: `Bearer ${token}` }),
    })
  );
};

const deferredToken = () => {
  let resolveToken: (response: { token: string }) => void = () => undefined;
  let rejectToken: (error: Error) => void = () => undefined;
  const promise = new Promise<{ token: string }>((resolve, reject) => {
    resolveToken = resolve;
    rejectToken = reject;
  });
  return { promise, resolveToken, rejectToken };
};

describe("RNEClient", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv("RNE_ESPACE_AGENT_LOGIN", MAIN_CREDENTIALS.username);
    vi.stubEnv("RNE_ESPACE_AGENT_PASSWORD", MAIN_CREDENTIALS.password);
    vi.stubEnv(
      "RNE_ESPACE_AGENT_FALLBACK_LOGIN",
      FALLBACK_CREDENTIALS.username
    );
    vi.stubEnv(
      "RNE_ESPACE_AGENT_FALLBACK_PASSWORD",
      FALLBACK_CREDENTIALS.password
    );
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-08-05T10:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
  });

  it("uses the main credentials and reuses its token", async () => {
    mockHttpClient.mockResolvedValue({ token: "main-token" });
    mockHttpGet.mockResolvedValue(MAIN_RESULT);
    const client = new RNEClient();

    await expect(client.get(RESOURCE_URL)).resolves.toEqual(MAIN_RESULT);
    await expect(client.get(RESOURCE_URL)).resolves.toEqual(MAIN_RESULT);

    expect(mockHttpClient).toHaveBeenCalledTimes(1);
    expectLoginToUse(1, MAIN_CREDENTIALS);
    expectLastRequestToUse("main-token");
  });

  it("preserves request options and headers through fallback", async () => {
    const signal = new AbortController().signal;
    const options = {
      headers: { "x-request-id": "request-id" },
      responseType: "arraybuffer" as const,
      params: { siren: "123456789" },
      timeout: 3000,
      signal,
    };
    mockHttpClient
      .mockResolvedValueOnce({ token: "main-token" })
      .mockResolvedValueOnce({ token: "fallback-token" });
    mockHttpGet
      .mockRejectedValueOnce(new HttpTooManyRequests("quota_exceeded"))
      .mockResolvedValueOnce(FALLBACK_RESULT);
    const client = new RNEClient();

    await expect(client.get(RESOURCE_URL, options)).resolves.toEqual(
      FALLBACK_RESULT
    );

    expect(mockHttpGet).toHaveBeenNthCalledWith(1, RESOURCE_URL, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: "Bearer main-token",
      },
    });
    expect(mockHttpGet).toHaveBeenNthCalledWith(2, RESOURCE_URL, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: "Bearer fallback-token",
      },
    });
    expect(options.headers).toEqual({ "x-request-id": "request-id" });
  });

  it("switches directly to fallback on quota and holds that account", async () => {
    mockHttpClient
      .mockResolvedValueOnce({ token: "main-token" })
      .mockResolvedValueOnce({ token: "fallback-token" });
    mockHttpGet
      .mockRejectedValueOnce(new HttpTooManyRequests("quota_exceeded"))
      .mockResolvedValue(FALLBACK_RESULT);
    const client = new RNEClient();

    await expect(client.get(RESOURCE_URL)).resolves.toEqual(FALLBACK_RESULT);
    await expect(client.get(RESOURCE_URL)).resolves.toEqual(FALLBACK_RESULT);

    expect(mockHttpClient).toHaveBeenCalledTimes(2);
    expectLoginToUse(1, MAIN_CREDENTIALS);
    expectLoginToUse(2, FALLBACK_CREDENTIALS);
    expectLastRequestToUse("fallback-token");
  });

  it("switches to fallback when the first main login fails", async () => {
    mockHttpClient
      .mockRejectedValueOnce(new Error("account blocked"))
      .mockResolvedValueOnce({ token: "fallback-token" });
    mockHttpGet.mockResolvedValue(FALLBACK_RESULT);
    const client = new RNEClient();

    await expect(client.get(RESOURCE_URL)).resolves.toEqual(FALLBACK_RESULT);
    await expect(client.get(RESOURCE_URL)).resolves.toEqual(FALLBACK_RESULT);

    expect(mockHttpClient).toHaveBeenCalledTimes(2);
    expectLoginToUse(1, MAIN_CREDENTIALS);
    expectLoginToUse(2, FALLBACK_CREDENTIALS);
    expectLastRequestToUse("fallback-token");
  });

  it("refreshes an expired main token and retries the same account", async () => {
    mockHttpClient
      .mockResolvedValueOnce({ token: "main-token" })
      .mockResolvedValueOnce({ token: "refreshed-main-token" });
    mockHttpGet
      .mockRejectedValueOnce(new HttpUnauthorizedError("token expired"))
      .mockResolvedValue(MAIN_RESULT);
    const client = new RNEClient();

    await expect(client.get(RESOURCE_URL)).resolves.toEqual(MAIN_RESULT);
    await expect(client.get(RESOURCE_URL)).resolves.toEqual(MAIN_RESULT);

    expect(mockHttpClient).toHaveBeenCalledTimes(2);
    expectLoginToUse(1, MAIN_CREDENTIALS);
    expectLoginToUse(2, MAIN_CREDENTIALS);
    expectLastRequestToUse("refreshed-main-token");
  });

  it("switches to fallback when a 401-triggered main refresh fails", async () => {
    mockHttpClient
      .mockResolvedValueOnce({ token: "main-token" })
      .mockRejectedValueOnce(new Error("main account blocked"))
      .mockResolvedValueOnce({ token: "fallback-token" });
    mockHttpGet
      .mockRejectedValueOnce(new HttpUnauthorizedError("token expired"))
      .mockResolvedValue(FALLBACK_RESULT);
    const client = new RNEClient();

    await expect(client.get(RESOURCE_URL)).resolves.toEqual(FALLBACK_RESULT);
    await expect(client.get(RESOURCE_URL)).resolves.toEqual(FALLBACK_RESULT);

    expect(mockHttpClient).toHaveBeenCalledTimes(3);
    expectLoginToUse(1, MAIN_CREDENTIALS);
    expectLoginToUse(2, MAIN_CREDENTIALS);
    expectLoginToUse(3, FALLBACK_CREDENTIALS);
    expectLastRequestToUse("fallback-token");
  });

  it.each([
    {
      scenario: "summer",
      now: "2026-08-05T10:00:00.000Z",
      cutoff: "2026-08-05T22:05:00.000Z",
    },
    {
      scenario: "winter",
      now: "2026-02-05T10:00:00.000Z",
      cutoff: "2026-02-05T23:05:00.000Z",
    },
    {
      scenario: "the day before summer time begins",
      now: "2026-03-28T11:00:00.000Z",
      cutoff: "2026-03-28T23:05:00.000Z",
    },
    {
      scenario: "the day summer time begins",
      now: "2026-03-29T10:00:00.000Z",
      cutoff: "2026-03-29T22:05:00.000Z",
    },
    {
      scenario: "the day before winter time begins",
      now: "2026-10-24T10:00:00.000Z",
      cutoff: "2026-10-24T22:05:00.000Z",
    },
    {
      scenario: "the day winter time begins",
      now: "2026-10-25T11:00:00.000Z",
      cutoff: "2026-10-25T23:05:00.000Z",
    },
    {
      scenario: "month rollover",
      now: "2026-08-31T10:00:00.000Z",
      cutoff: "2026-08-31T22:05:00.000Z",
    },
    {
      scenario: "year rollover",
      now: "2026-12-31T11:00:00.000Z",
      cutoff: "2026-12-31T23:05:00.000Z",
    },
    {
      scenario: "failover at 00:01 Paris time",
      now: "2026-08-05T22:01:00.000Z",
      cutoff: "2026-08-06T22:05:00.000Z",
    },
  ])("returns to main at exactly next-day 00:05 Paris time: $scenario", async ({
    now,
    cutoff,
  }) => {
    vi.setSystemTime(new Date(now));
    mockHttpClient
      .mockRejectedValueOnce(new Error("main account blocked"))
      .mockResolvedValueOnce({ token: "fallback-token" })
      .mockResolvedValueOnce({ token: "recovered-main-token" });
    mockHttpGet
      .mockResolvedValueOnce(FALLBACK_RESULT)
      .mockResolvedValueOnce(FALLBACK_RESULT)
      .mockResolvedValueOnce(MAIN_RESULT);
    const client = new RNEClient();

    await expect(client.get(RESOURCE_URL)).resolves.toEqual(FALLBACK_RESULT);
    vi.setSystemTime(new Date(new Date(cutoff).getTime() - 1));
    await expect(client.get(RESOURCE_URL)).resolves.toEqual(FALLBACK_RESULT);
    expect(mockHttpClient).toHaveBeenCalledTimes(2);
    expectLastRequestToUse("fallback-token");

    vi.setSystemTime(new Date(cutoff));
    await expect(client.get(RESOURCE_URL)).resolves.toEqual(MAIN_RESULT);
    expect(mockHttpClient).toHaveBeenCalledTimes(3);
    expectLoginToUse(3, MAIN_CREDENTIALS);
    expectLastRequestToUse("recovered-main-token");
  });

  it("returns to the main account early when fallback exhausts its quota", async () => {
    mockHttpClient
      .mockResolvedValueOnce({ token: "main-token" })
      .mockResolvedValueOnce({ token: "fallback-token" });
    mockHttpGet
      .mockRejectedValueOnce(new HttpTooManyRequests("main quota_exceeded"))
      .mockResolvedValueOnce(FALLBACK_RESULT)
      .mockRejectedValueOnce(new HttpTooManyRequests("fallback quota_exceeded"))
      .mockResolvedValue(MAIN_RESULT);
    const client = new RNEClient();

    await expect(client.get(RESOURCE_URL)).resolves.toEqual(FALLBACK_RESULT);
    await expect(client.get(RESOURCE_URL)).resolves.toEqual(MAIN_RESULT);
    await expect(client.get(RESOURCE_URL)).resolves.toEqual(MAIN_RESULT);

    expect(mockHttpClient).toHaveBeenCalledTimes(2);
    expectLastRequestToUse("main-token");
  });

  it("returns to main early when fallback cannot refresh its token", async () => {
    mockHttpClient
      .mockResolvedValueOnce({ token: "main-token" })
      .mockResolvedValueOnce({ token: "fallback-token" })
      .mockRejectedValueOnce(new Error("fallback account blocked"));
    mockHttpGet
      .mockRejectedValueOnce(new HttpTooManyRequests("main quota_exceeded"))
      .mockResolvedValueOnce(FALLBACK_RESULT)
      .mockRejectedValueOnce(
        new HttpUnauthorizedError("fallback token expired")
      )
      .mockResolvedValue(MAIN_RESULT);
    const client = new RNEClient();

    await expect(client.get(RESOURCE_URL)).resolves.toEqual(FALLBACK_RESULT);
    await expect(client.get(RESOURCE_URL)).resolves.toEqual(MAIN_RESULT);
    await expect(client.get(RESOURCE_URL)).resolves.toEqual(MAIN_RESULT);

    expect(mockHttpClient).toHaveBeenCalledTimes(3);
    expectLoginToUse(3, FALLBACK_CREDENTIALS);
    expectLastRequestToUse("main-token");
  });

  it("refreshes a fallback token without losing the fallback hold", async () => {
    mockHttpClient
      .mockResolvedValueOnce({ token: "main-token" })
      .mockResolvedValueOnce({ token: "fallback-token" })
      .mockResolvedValueOnce({ token: "refreshed-fallback-token" });
    mockHttpGet
      .mockRejectedValueOnce(new HttpTooManyRequests("main quota_exceeded"))
      .mockResolvedValueOnce(FALLBACK_RESULT)
      .mockRejectedValueOnce(
        new HttpUnauthorizedError("fallback token expired")
      )
      .mockResolvedValue(FALLBACK_RESULT);
    const client = new RNEClient();

    await expect(client.get(RESOURCE_URL)).resolves.toEqual(FALLBACK_RESULT);
    await expect(client.get(RESOURCE_URL)).resolves.toEqual(FALLBACK_RESULT);
    await expect(client.get(RESOURCE_URL)).resolves.toEqual(FALLBACK_RESULT);

    expect(mockHttpClient).toHaveBeenCalledTimes(3);
    expectLoginToUse(3, FALLBACK_CREDENTIALS);
    expectLastRequestToUse("refreshed-fallback-token");
  });

  it("keeps each account's cached token when switching in both directions", async () => {
    mockHttpClient
      .mockResolvedValueOnce({ token: "main-token" })
      .mockResolvedValueOnce({ token: "fallback-token" });
    mockHttpGet
      .mockRejectedValueOnce(new HttpTooManyRequests("main quota_exceeded"))
      .mockResolvedValueOnce(FALLBACK_RESULT)
      .mockRejectedValueOnce(new HttpTooManyRequests("fallback quota_exceeded"))
      .mockResolvedValueOnce(MAIN_RESULT)
      .mockRejectedValueOnce(new HttpTooManyRequests("main quota_exceeded"))
      .mockResolvedValueOnce(FALLBACK_RESULT);
    const client = new RNEClient();

    await expect(client.get(RESOURCE_URL)).resolves.toEqual(FALLBACK_RESULT);
    await expect(client.get(RESOURCE_URL)).resolves.toEqual(MAIN_RESULT);
    await expect(client.get(RESOURCE_URL)).resolves.toEqual(FALLBACK_RESULT);

    expect(mockHttpClient).toHaveBeenCalledTimes(2);
    expectLastRequestToUse("fallback-token");
  });

  it("stops after both accounts exhaust their quota and starts the next request on main", async () => {
    const fallbackError = new HttpTooManyRequests("fallback quota_exceeded");
    mockHttpClient
      .mockResolvedValueOnce({ token: "main-token" })
      .mockResolvedValueOnce({ token: "fallback-token" });
    mockHttpGet
      .mockRejectedValueOnce(new HttpTooManyRequests("main quota_exceeded"))
      .mockRejectedValueOnce(fallbackError)
      .mockResolvedValueOnce(MAIN_RESULT);
    const client = new RNEClient();

    await expect(client.get(RESOURCE_URL)).rejects.toBe(fallbackError);
    expect(mockHttpGet).toHaveBeenCalledTimes(2);

    await expect(client.get(RESOURCE_URL)).resolves.toEqual(MAIN_RESULT);
    expect(mockHttpClient).toHaveBeenCalledTimes(2);
    expectLastRequestToUse("main-token");
  });

  it("stops after both logins fail and retries main on the next request", async () => {
    const fallbackError = new Error("fallback account blocked");
    mockHttpClient
      .mockRejectedValueOnce(new Error("main account blocked"))
      .mockRejectedValueOnce(fallbackError)
      .mockResolvedValueOnce({ token: "recovered-main-token" });
    mockHttpGet.mockResolvedValue(MAIN_RESULT);
    const client = new RNEClient();

    await expect(client.get(RESOURCE_URL)).rejects.toBe(fallbackError);
    expect(mockHttpClient).toHaveBeenCalledTimes(2);
    expect(mockHttpGet).not.toHaveBeenCalled();

    await expect(client.get(RESOURCE_URL)).resolves.toEqual(MAIN_RESULT);
    expectLoginToUse(3, MAIN_CREDENTIALS);
    expectLastRequestToUse("recovered-main-token");
  });

  it("propagates a second 401 after a successful refresh without retrying indefinitely", async () => {
    const error = new HttpUnauthorizedError("refreshed token rejected");
    mockHttpClient
      .mockResolvedValueOnce({ token: "main-token" })
      .mockResolvedValueOnce({ token: "refreshed-main-token" });
    mockHttpGet
      .mockRejectedValueOnce(new HttpUnauthorizedError("token expired"))
      .mockRejectedValueOnce(error);
    const client = new RNEClient();

    await expect(client.get(RESOURCE_URL)).rejects.toBe(error);

    expect(mockHttpClient).toHaveBeenCalledTimes(2);
    expect(mockHttpGet).toHaveBeenCalledTimes(2);
    expectLoginToUse(2, MAIN_CREDENTIALS);
  });

  it.each([
    new HttpForbiddenError("resource forbidden"),
    new HttpNotFound("resource missing"),
    new HttpServerError("resource unavailable"),
  ])("propagates a resource error with status $status unchanged", async (error) => {
    mockHttpClient.mockResolvedValue({ token: "main-token" });
    mockHttpGet.mockRejectedValueOnce(error).mockResolvedValueOnce(MAIN_RESULT);
    const client = new RNEClient();

    await expect(client.get(RESOURCE_URL)).rejects.toBe(error);
    await expect(client.get(RESOURCE_URL)).resolves.toEqual(MAIN_RESULT);

    expect(mockHttpClient).toHaveBeenCalledTimes(1);
    expectLastRequestToUse("main-token");
  });

  it("shares the first login between concurrent requests", async () => {
    const token = deferredToken();
    mockHttpClient.mockReturnValueOnce(token.promise);
    mockHttpGet.mockResolvedValue(MAIN_RESULT);
    const client = new RNEClient();

    const first = client.get(RESOURCE_URL);
    const second = client.get(RESOURCE_URL);
    expect(mockHttpClient).toHaveBeenCalledTimes(1);
    token.resolveToken({ token: "shared-main-token" });

    await expect(Promise.all([first, second])).resolves.toEqual([
      MAIN_RESULT,
      MAIN_RESULT,
    ]);
    expect(mockHttpGet).toHaveBeenCalledTimes(2);
    expectLastRequestToUse("shared-main-token");
  });

  it("shares a 401-triggered refresh between concurrent requests", async () => {
    const token = deferredToken();
    mockHttpClient
      .mockResolvedValueOnce({ token: "main-token" })
      .mockReturnValueOnce(token.promise);
    mockHttpGet
      .mockResolvedValueOnce(MAIN_RESULT)
      .mockRejectedValueOnce(new HttpUnauthorizedError("token expired"))
      .mockRejectedValueOnce(new HttpUnauthorizedError("token expired"))
      .mockResolvedValue(MAIN_RESULT);
    const client = new RNEClient();
    await client.get(RESOURCE_URL);

    const first = client.get(RESOURCE_URL);
    const second = client.get(RESOURCE_URL);
    await vi.waitFor(() => expect(mockHttpClient).toHaveBeenCalledTimes(2));
    token.resolveToken({ token: "shared-refreshed-main-token" });

    await expect(Promise.all([first, second])).resolves.toEqual([
      MAIN_RESULT,
      MAIN_RESULT,
    ]);
    expect(mockHttpClient).toHaveBeenCalledTimes(2);
    expectLastRequestToUse("shared-refreshed-main-token");
  });

  it("shares fallback login after concurrent main login failures", async () => {
    const mainToken = deferredToken();
    const fallbackToken = deferredToken();
    mockHttpClient
      .mockReturnValueOnce(mainToken.promise)
      .mockReturnValueOnce(fallbackToken.promise);
    mockHttpGet.mockResolvedValue(FALLBACK_RESULT);
    const client = new RNEClient();

    const first = client.get(RESOURCE_URL);
    const second = client.get(RESOURCE_URL);
    mainToken.rejectToken(new Error("main account blocked"));
    await vi.waitFor(() => expect(mockHttpClient).toHaveBeenCalledTimes(2));
    fallbackToken.resolveToken({ token: "shared-fallback-token" });

    await expect(Promise.all([first, second])).resolves.toEqual([
      FALLBACK_RESULT,
      FALLBACK_RESULT,
    ]);
    expect(mockHttpClient).toHaveBeenCalledTimes(2);
    expectLoginToUse(2, FALLBACK_CREDENTIALS);
    expectLastRequestToUse("shared-fallback-token");
  });

  it("shares fallback login after concurrent main refresh failures", async () => {
    const mainToken = deferredToken();
    const fallbackToken = deferredToken();
    mockHttpClient
      .mockResolvedValueOnce({ token: "main-token" })
      .mockReturnValueOnce(mainToken.promise)
      .mockReturnValueOnce(fallbackToken.promise);
    mockHttpGet
      .mockResolvedValueOnce(MAIN_RESULT)
      .mockRejectedValueOnce(new HttpUnauthorizedError("token expired"))
      .mockRejectedValueOnce(new HttpUnauthorizedError("token expired"))
      .mockResolvedValue(FALLBACK_RESULT);
    const client = new RNEClient();
    await client.get(RESOURCE_URL);

    const first = client.get(RESOURCE_URL);
    const second = client.get(RESOURCE_URL);
    await vi.waitFor(() => expect(mockHttpClient).toHaveBeenCalledTimes(2));
    mainToken.rejectToken(new Error("main account blocked"));
    await vi.waitFor(() => expect(mockHttpClient).toHaveBeenCalledTimes(3));
    fallbackToken.resolveToken({ token: "shared-fallback-token" });

    await expect(Promise.all([first, second])).resolves.toEqual([
      FALLBACK_RESULT,
      FALLBACK_RESULT,
    ]);
    expect(mockHttpClient).toHaveBeenCalledTimes(3);
    expectLoginToUse(2, MAIN_CREDENTIALS);
    expectLoginToUse(3, FALLBACK_CREDENTIALS);
    expectLastRequestToUse("shared-fallback-token");
  });
});

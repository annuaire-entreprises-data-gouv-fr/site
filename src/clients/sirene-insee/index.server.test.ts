import { vi } from "vitest";
import httpClient, { httpGet, httpPost } from "#/utils/network";
import { HttpInseeClient } from "./index.server";

vi.mock(import("#/utils/network"), () => ({
  default: vi.fn(),
  httpGet: vi.fn(),
  httpPost: vi.fn(),
}));

vi.mock(import("#/utils/sentry"), () => ({
  default: vi.fn(),
  logInfoInSentry: vi.fn(),
}));

const TOKEN_URL = "https://api.insee.test/token";
const RESOURCE_URL = "https://api.insee.test/resource";
const NOW = new Date("2026-08-05T10:00:00.000Z");

const MAIN_CREDENTIALS = {
  client_id: "main-client-id",
  client_secret: "main-client-secret",
  username: "main-username",
  password: "main-password",
};

const FALLBACK_CREDENTIALS = {
  client_id: "fallback-client-id",
  client_secret: "fallback-client-secret",
  username: "fallback-username",
  password: "fallback-password",
};

const MAIN_RESULT = { account: "main" };
const FALLBACK_RESULT = { account: "fallback" };

const mockHttpClient = vi.mocked(httpClient);
const mockHttpGet = vi.mocked(httpGet);
const mockHttpPost = vi.mocked(httpPost);

const createAccessToken = (accessToken: string, expiresIn = 7200) => ({
  access_token: accessToken,
  expires_in: expiresIn,
  scope: "default",
  token_type: "Bearer",
});

const createClient = (withFallback = true) => {
  const fallbackClient = withFallback
    ? new HttpInseeClient("fallback", TOKEN_URL, FALLBACK_CREDENTIALS)
    : undefined;

  return new HttpInseeClient(
    "main",
    TOKEN_URL,
    MAIN_CREDENTIALS,
    fallbackClient
  );
};

const expectTokenRequestToUse = (
  callNumber: number,
  credentials: typeof MAIN_CREDENTIALS
) => {
  const call = mockHttpClient.mock.calls[callNumber - 1];
  if (!call) {
    throw new Error(`Missing token request number ${callNumber}`);
  }

  const [config] = call;
  expect(config).toEqual(
    expect.objectContaining({
      method: "POST",
      url: TOKEN_URL,
    })
  );
  expect(Object.fromEntries(new URLSearchParams(String(config.data)))).toEqual({
    ...credentials,
    grant_type: "password",
    validity_period: "604800",
  });
};

describe("HttpInseeClient", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("uses the primary account when it is available", async () => {
    mockHttpClient.mockResolvedValue(createAccessToken("main-token"));
    mockHttpGet.mockResolvedValue(MAIN_RESULT);
    const client = createClient();

    await expect(
      client.get<typeof MAIN_RESULT>(RESOURCE_URL, {
        headers: { "x-request-id": "request-id" },
      })
    ).resolves.toEqual(MAIN_RESULT);

    expectTokenRequestToUse(1, MAIN_CREDENTIALS);
    expect(mockHttpGet).toHaveBeenCalledWith(
      RESOURCE_URL,
      expect.objectContaining({
        headers: {
          Authorization: "Bearer main-token",
          "x-request-id": "request-id",
        },
      })
    );
  });

  it("works without a fallback client", async () => {
    mockHttpClient.mockResolvedValue(createAccessToken("main-token"));
    mockHttpGet.mockResolvedValue(MAIN_RESULT);
    const client = createClient(false);

    await expect(
      client.get<typeof MAIN_RESULT>(RESOURCE_URL, {})
    ).resolves.toEqual(MAIN_RESULT);

    expect(mockHttpClient).toHaveBeenCalledTimes(1);
    expectTokenRequestToUse(1, MAIN_CREDENTIALS);
  });

  it("rejects when the primary account is unavailable and no fallback exists", async () => {
    mockHttpClient.mockRejectedValue(new Error("token request failed"));
    const client = createClient(false);

    await expect(client.get(RESOURCE_URL, {})).rejects.toMatchObject({
      message: "[main] ACCOUNT_UNAVAILABLE",
      status: 401,
    });

    expect(mockHttpGet).not.toHaveBeenCalled();
  });

  it("uses the fallback account when explicitly requested", async () => {
    mockHttpClient.mockResolvedValue(createAccessToken("fallback-token"));
    mockHttpGet.mockResolvedValue(FALLBACK_RESULT);
    const client = createClient();

    await expect(
      client.get<typeof FALLBACK_RESULT>(RESOURCE_URL, {}, true)
    ).resolves.toEqual(FALLBACK_RESULT);

    expect(mockHttpClient).toHaveBeenCalledTimes(1);
    expectTokenRequestToUse(1, FALLBACK_CREDENTIALS);
    expect(mockHttpGet).toHaveBeenCalledWith(
      RESOURCE_URL,
      expect.objectContaining({
        headers: { Authorization: "Bearer fallback-token" },
      })
    );
  });

  it("automatically uses fallback for one hour after a primary token failure", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    mockHttpClient
      .mockRejectedValueOnce(new Error("primary token request failed"))
      .mockResolvedValueOnce(createAccessToken("fallback-token"))
      .mockResolvedValueOnce(createAccessToken("recovered-main-token"));
    mockHttpGet
      .mockResolvedValueOnce(FALLBACK_RESULT)
      .mockResolvedValueOnce(FALLBACK_RESULT)
      .mockResolvedValueOnce(MAIN_RESULT);
    const client = createClient();

    await expect(
      client.get<typeof FALLBACK_RESULT>(RESOURCE_URL, {})
    ).resolves.toEqual(FALLBACK_RESULT);
    await expect(
      client.get<typeof FALLBACK_RESULT>(RESOURCE_URL, {})
    ).resolves.toEqual(FALLBACK_RESULT);

    expect(mockHttpClient).toHaveBeenCalledTimes(2);
    expectTokenRequestToUse(1, MAIN_CREDENTIALS);
    expectTokenRequestToUse(2, FALLBACK_CREDENTIALS);

    vi.setSystemTime(new Date(NOW.getTime() + 60 * 60 * 1000 + 1));

    await expect(
      client.get<typeof MAIN_RESULT>(RESOURCE_URL, {})
    ).resolves.toEqual(MAIN_RESULT);

    expect(mockHttpClient).toHaveBeenCalledTimes(3);
    expectTokenRequestToUse(3, MAIN_CREDENTIALS);
    expect(mockHttpGet).toHaveBeenLastCalledWith(
      RESOURCE_URL,
      expect.objectContaining({
        headers: { Authorization: "Bearer recovered-main-token" },
      })
    );
  });

  it("supports explicit fallback for POST requests", async () => {
    mockHttpClient.mockResolvedValue(createAccessToken("fallback-token"));
    mockHttpPost.mockResolvedValue(FALLBACK_RESULT);
    const client = createClient();

    await expect(
      client.post<typeof FALLBACK_RESULT>(
        RESOURCE_URL,
        { data: { siren: "123456789" } },
        true
      )
    ).resolves.toEqual(FALLBACK_RESULT);

    expectTokenRequestToUse(1, FALLBACK_CREDENTIALS);
    expect(mockHttpPost).toHaveBeenCalledWith(
      RESOURCE_URL,
      expect.objectContaining({
        data: { siren: "123456789" },
        headers: { Authorization: "Bearer fallback-token" },
      })
    );
  });

  it("shares one token refresh between concurrent requests", async () => {
    let resolveToken: (token: ReturnType<typeof createAccessToken>) => void =
      () => undefined;
    mockHttpClient.mockReturnValue(
      new Promise((resolve) => {
        resolveToken = resolve;
      })
    );
    mockHttpGet.mockResolvedValue(MAIN_RESULT);
    const client = createClient(false);

    const firstRequest = client.get<typeof MAIN_RESULT>(RESOURCE_URL, {});
    const secondRequest = client.get<typeof MAIN_RESULT>(RESOURCE_URL, {});

    expect(mockHttpClient).toHaveBeenCalledTimes(1);
    resolveToken(createAccessToken("shared-token"));

    await expect(Promise.all([firstRequest, secondRequest])).resolves.toEqual([
      MAIN_RESULT,
      MAIN_RESULT,
    ]);
    expect(mockHttpGet).toHaveBeenCalledTimes(2);
  });
});

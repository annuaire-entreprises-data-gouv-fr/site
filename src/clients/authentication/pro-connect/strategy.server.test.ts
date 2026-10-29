import { refreshTokenGrant } from "openid-client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getCurrentSession } from "#/utils/session/index.server";
import { proConnectGetOrRefreshAccessToken } from "./strategy.server";

vi.mock("@tanstack/react-start", () => ({
  createServerOnlyFn: (fn: unknown) => fn,
}));
vi.mock("@tanstack/react-start/server", () => ({ getRequestUrl: vi.fn() }));
vi.mock("openid-client", () => ({
  authorizationCodeGrant: vi.fn(),
  buildAuthorizationUrl: vi.fn(),
  buildEndSessionUrl: vi.fn(),
  fetchUserInfo: vi.fn(),
  randomNonce: vi.fn(),
  randomState: vi.fn(),
  refreshTokenGrant: vi.fn(),
}));
vi.mock("../openid-client-v6.server", () => ({
  discoverClient: vi.fn().mockResolvedValue({}),
  getAccessTokenExpiresAt: () => 1_000_000,
  getAuthorizationCallbackUrl: vi.fn(),
}));
vi.mock("#/utils/session/index.server", () => ({
  getCurrentSession: vi.fn(),
  setProConnectTokenSet: vi.fn(),
  setStateAndNonce: vi.fn(),
}));

const expiredTokenSet = {
  idToken: "id-token",
  accessToken: "expired-access-token",
  accessTokenExpiresAt: Date.now() - 1000,
  refreshToken: "refresh-token",
};

// minimal iron-session manager: update() is what saves the cookie
const mockSession = (proConnectTokenSet = expiredTokenSet) => {
  const session = {
    data: { proConnectTokenSet },
    update: vi.fn(async (update: object) => {
      Object.assign(session.data, update);
      return session;
    }),
  };
  vi.mocked(getCurrentSession).mockResolvedValue(session as never);
  return session;
};

beforeEach(() => {
  vi.clearAllMocks();
  process.env.AGENTCONNECT_CLIENT_ID = "client-id";
  process.env.AGENTCONNECT_CLIENT_SECRET = "client-secret";
  process.env.AGENTCONNECT_URL_DISCOVER = "https://proconnect.test";
  process.env.AGENTCONNECT_REDIRECT_URI = "https://site.test/callback";
  process.env.AGENTCONNECT_POST_LOGOUT_REDIRECT_URI = "https://site.test";
  vi.mocked(refreshTokenGrant).mockResolvedValue({
    id_token: "new-id-token",
    access_token: "new-access-token",
    refresh_token: "new-refresh-token",
  } as never);
});

describe("proConnectGetOrRefreshAccessToken", () => {
  it("returns a valid access token without refreshing it", async () => {
    const session = mockSession({
      ...expiredTokenSet,
      accessToken: "valid-access-token",
      accessTokenExpiresAt: Date.now() + 60_000,
    });

    await expect(proConnectGetOrRefreshAccessToken()).resolves.toBe(
      "valid-access-token"
    );
    expect(refreshTokenGrant).not.toHaveBeenCalled();
    expect(session.update).not.toHaveBeenCalled();
  });

  it("saves the refreshed token so that the next call does not refresh it again", async () => {
    const session = mockSession();

    await expect(proConnectGetOrRefreshAccessToken()).resolves.toBe(
      "new-access-token"
    );
    expect(session.update).toHaveBeenCalledWith({
      proConnectTokenSet: {
        idToken: "new-id-token",
        accessToken: "new-access-token",
        accessTokenExpiresAt: 1_000_000,
        refreshToken: "new-refresh-token",
      },
    });

    vi.spyOn(Date, "now").mockReturnValue(0);
    await expect(proConnectGetOrRefreshAccessToken()).resolves.toBe(
      "new-access-token"
    );
    expect(refreshTokenGrant).toHaveBeenCalledTimes(1);
    vi.restoreAllMocks();
  });

  it("shares one refresh between parallel calls", async () => {
    mockSession();

    await expect(
      Promise.all([
        proConnectGetOrRefreshAccessToken(),
        proConnectGetOrRefreshAccessToken(),
      ])
    ).resolves.toEqual(["new-access-token", "new-access-token"]);
    expect(refreshTokenGrant).toHaveBeenCalledTimes(1);
    expect(refreshTokenGrant).toHaveBeenCalledWith({}, "refresh-token");
  });
});

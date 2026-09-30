import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, renderHook, waitFor } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { IAgentInfo } from "#/models/authentication/agent";
import { IDataFetchingState } from "#/models/data-fetching";
import { UseCase } from "#/models/use-cases";
import { useFondationsRestreintes } from "./fondations-restreintes";

const { execute, auth } = vi.hoisted(() => ({
  execute: vi.fn(),
  auth: { user: null as IAgentInfo | null },
}));
vi.mock("@tanstack/react-start", () => ({ useServerFn: () => execute }));
vi.mock("#/contexts/auth.context", () => ({ useAuth: () => auth }));
vi.mock("#/server-functions/agent/data-fetching", () => ({
  getAgentFondationsRestreintesFn: { url: "/test/fondations-restreintes" },
}));

const user: IAgentInfo = {
  scopes: ["agent"],
  email: "agent@example.fr",
  domain: "example.fr",
  familyName: "Agent",
  firstName: "Test",
  fullName: "Test Agent",
  groupsScopes: {},
  idpId: "test",
  isSuperAgent: false,
  proConnectSub: "agent-1",
  siret: "13002526500013",
  userType: "agent",
};
const data = { dirigeants: [], documents: [], filiation: [] };
let client: QueryClient;
function wrapper({ children }: PropsWithChildren) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
const idRnf = "075-FRUP-00194-01";

beforeEach(() => {
  client = new QueryClient();
  auth.user = user;
  execute.mockReset();
  execute.mockResolvedValue(data);
});
afterEach(() => {
  cleanup();
  client.clear();
  vi.restoreAllMocks();
});

describe("RNF in-memory query cache", () => {
  it("reuses a completed response when another section mounts, including after navigation", async () => {
    const first = renderHook(
      () => useFondationsRestreintes(idRnf, UseCase.marches),
      { wrapper }
    );
    await waitFor(() => expect(first.result.current).toEqual(data));
    const second = renderHook(
      () => useFondationsRestreintes(idRnf, UseCase.marches),
      { wrapper }
    );
    expect(second.result.current).toEqual(data);
    first.unmount();
    second.unmount();
    const nextPage = renderHook(
      () => useFondationsRestreintes(idRnf, UseCase.marches),
      { wrapper }
    );
    expect(nextPage.result.current).toEqual(data);
    expect(execute).toHaveBeenCalledTimes(1);
  });

  it("deduplicates simultaneous section requests", async () => {
    let resolveRequest: (value: typeof data) => void = () => undefined;
    execute.mockReturnValue(
      new Promise<typeof data>((resolve) => {
        resolveRequest = resolve;
      })
    );
    const first = renderHook(
      () => useFondationsRestreintes(idRnf, UseCase.autre),
      { wrapper }
    );
    const second = renderHook(
      () => useFondationsRestreintes(idRnf, UseCase.autre),
      { wrapper }
    );
    expect(execute).toHaveBeenCalledTimes(1);
    resolveRequest(data);
    await waitFor(() => expect(first.result.current).toEqual(data));
    await waitFor(() => expect(second.result.current).toEqual(data));
  });

  it("separates foundations, use cases and authenticated agents", async () => {
    const first = renderHook(
      () => useFondationsRestreintes(idRnf, UseCase.marches),
      { wrapper }
    );
    await waitFor(() => expect(first.result.current).toEqual(data));
    first.unmount();
    const otherCase = renderHook(
      () => useFondationsRestreintes(idRnf, UseCase.autre),
      { wrapper }
    );
    await waitFor(() => expect(otherCase.result.current).toEqual(data));
    otherCase.unmount();
    const otherFoundation = renderHook(
      () => useFondationsRestreintes("075-FE-00001-01", UseCase.marches),
      { wrapper }
    );
    await waitFor(() => expect(otherFoundation.result.current).toEqual(data));
    otherFoundation.unmount();
    auth.user = {
      ...user,
      proConnectSub: "agent-2",
      email: "other@example.fr",
    };
    const otherAgent = renderHook(
      () => useFondationsRestreintes(idRnf, UseCase.marches),
      { wrapper }
    );
    await waitFor(() => expect(otherAgent.result.current).toEqual(data));
    expect(execute).toHaveBeenCalledTimes(4);
    otherAgent.unmount();
    auth.user = null;
    const visitor = renderHook(
      () => useFondationsRestreintes(idRnf, UseCase.marches),
      { wrapper }
    );
    expect(visitor.result.current).toBe(IDataFetchingState.UNAUTHORIZED);
    expect(execute).toHaveBeenCalledTimes(4);
  });

  it("refreshes data when a section mounts after the freshness window", async () => {
    const first = renderHook(
      () => useFondationsRestreintes(idRnf, UseCase.marches),
      { wrapper }
    );
    await waitFor(() => expect(first.result.current).toEqual(data));
    first.unmount();
    vi.spyOn(Date, "now").mockReturnValue(Date.now() + 5 * 60 * 1000 + 1);
    renderHook(() => useFondationsRestreintes(idRnf, UseCase.marches), {
      wrapper,
    });
    await waitFor(() => expect(execute).toHaveBeenCalledTimes(2));
  });
});

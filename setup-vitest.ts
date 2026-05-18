import "dotenv/config";
import fs from "node:fs";
import type { SharedOptions } from "msw";
import type { ExpectStatic } from "vitest";
import { afterAll, afterEach, beforeAll, expect, vi } from "vitest";

vi.mock("@tanstack/react-start/server", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@tanstack/react-start/server")>();
  const requestHeaders = new Headers({
    "user-agent": "vitest",
    "x-request-id": "vitest-request-id",
  });

  return {
    ...actual,
    deleteCookie: vi.fn(),
    getRequestHeader: (name: string) => requestHeaders.get(name),
    getRequestHeaders: () => requestHeaders,
    getRequestUrl: () => new URL("http://localhost.test"),
    setCookie: vi.fn(),
    useSession: () => ({
      clear: vi.fn(),
      data: {},
      update: vi.fn(),
    }),
  };
});

declare module "vitest" {
  interface Assertion {
    toMatchFile(filePath: string): void;
  }
}

const toSnapshotString = (received: unknown) =>
  typeof received === "string" ? received : JSON.stringify(received, null, 2);

expect.extend({
  toMatchFile(received: unknown, filePath: string) {
    const actual = toSnapshotString(received);

    if (!fs.existsSync(filePath)) {
      return {
        message: () => `Expected snapshot file to exist: ${filePath}`,
        pass: false,
      };
    }

    const expected = fs.readFileSync(filePath, "utf8");
    const pass = expected === actual;

    return {
      message: () =>
        pass
          ? `Expected snapshot file not to match: ${filePath}`
          : `Expected received value to match snapshot file: ${filePath}\n\nExpected length: ${expected.length}\nReceived length: ${actual.length}`,
      pass,
    };
  },
} satisfies Parameters<ExpectStatic["extend"]>[0]);

if (process.env.MOCK_API_RECHERCHE_ENTREPRISE !== "false") {
  let rechercheEntrepriseMockServer:
    | {
        close: () => void;
        listen: (options?: Partial<SharedOptions> | undefined) => unknown;
        resetHandlers: () => void;
      }
    | undefined;

  beforeAll(async () => {
    ({ rechercheEntrepriseMockServer } = await import(
      "./unit-tests/recherche-entreprise/server"
    ));
    rechercheEntrepriseMockServer.listen({ onUnhandledRequest: "bypass" });
  });

  afterEach(() => {
    rechercheEntrepriseMockServer?.resetHandlers();
  });

  afterAll(() => {
    rechercheEntrepriseMockServer?.close();
  });
}

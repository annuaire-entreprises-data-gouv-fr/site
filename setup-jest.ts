import "dotenv/config";
import { toMatchFile } from "jest-file-snapshot";
import type { SharedOptions } from "msw";

expect.extend({ toMatchFile });

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

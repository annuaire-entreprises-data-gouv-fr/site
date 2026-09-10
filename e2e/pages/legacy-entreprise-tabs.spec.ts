import { expect, test } from "../support/test";

const legacyTabPaths = [
  "annonces",
  "dirigeants",
  "divers",
  "documents",
  "donnees-financieres",
  "effectifs",
  "etablissements-scolaires",
  "labels-certificats",
] as const;

test.describe("Legacy entreprise tab URLs", () => {
  for (const tabPath of legacyTabPaths) {
    test(`redirects /${tabPath}/$slug permanently`, async ({ request }) => {
      const response = await request.get(`/${tabPath}/552032534?page=2`, {
        maxRedirects: 0,
      });

      expect(response.status()).toBe(308);
      const location = new URL(response.headers().location);
      expect(`${location.pathname}${location.search}`).toBe(
        `/entreprise/552032534/${tabPath}?page=2`
      );
    });
  }
});

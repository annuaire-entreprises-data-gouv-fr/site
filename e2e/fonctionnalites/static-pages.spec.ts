import { expect, goto, test } from "../support/test";

const pages = [
  "/",
  "/rechercher?terme=Kikou",
  "/a-propos/comment-ca-marche",
  "/faq",
  "/accessibilite",
  "/a-propos/donnees-extrait-kbis",
  "/vie-privee",
];

for (const pagePath of pages) {
  test.describe(`Page ${pagePath}`, () => {
    test("successfully loads", async ({ request }) => {
      const response = await request.get(pagePath);
      expect(response.ok()).toBeTruthy();
    });

    test("FAQ button works", async ({ page }) => {
      await goto(page, pagePath);
      await page.locator('[data-test-id="question-faq"]').click();
      await expect(page).toHaveURL(/\/faq/);
    });

    test("Logo button works", async ({ page }) => {
      await goto(page, pagePath);
      await page.locator(".fr-header__logo > a").click();
      await expect(page).toHaveURL(/\//);
    });
  });
}

test.describe("Footer navigation", () => {
  test("check all internal links in footer", async ({
    page,
    request,
    baseURL,
  }) => {
    await goto(page, "/");

    const origin = new URL(baseURL ?? "http://localhost:3000").origin;
    const hrefs = await page
      .locator(".fr-footer a")
      .evaluateAll((links) =>
        links.map((link) => (link as HTMLAnchorElement).href)
      );

    for (const href of hrefs) {
      if (
        href.startsWith(origin) &&
        !href.includes("departements/index.html")
      ) {
        const response = await request.get(href);
        expect(response.ok()).toBeTruthy();
      }
    }
  });
});

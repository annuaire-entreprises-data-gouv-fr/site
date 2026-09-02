import { expect, goto, test } from "../support/test";

const slug = "la-poste-356000000";

const currentPageButton = (page: Parameters<typeof goto>[0]) =>
  page.locator('.fr-pagination__link[aria-current="page"]');

const pageUrl = (pageNumber: number) =>
  new RegExp(`[?&]etablissments-page=${pageNumber}(?:&|#|$)`);

test.describe("Pagination for single etablissement company", () => {
  test("Load page even with query params", async ({ request }) => {
    const response = await request.get("/entreprise/880878145");
    expect(response.status()).toBe(200);
  });

  test("Has no pagination", async ({ page }) => {
    await goto(page, "/entreprise/880878145");
    await expect(page.locator(".fr-pagination")).toHaveCount(0);
  });
});

test.describe("Pagination for multiple etablissement company", () => {
  test("Has several pages", async ({ page }) => {
    await goto(page, `/entreprise/${slug}`);
    await expect(page.locator(".fr-pagination")).toHaveCount(1);
  });

  test("Loads the requested page", async ({ page }) => {
    await goto(page, `/entreprise/${slug}?etablissments-page=1`);
    await expect(currentPageButton(page)).toHaveText("1");
    await expect(
      page.locator("#etablissements tbody > tr > td:first-of-type").first()
    ).toBeVisible();

    await goto(page, `/entreprise/${slug}?etablissments-page=6`);
    await expect(currentPageButton(page)).toHaveText("6");
    await expect(
      page.locator("#etablissements tbody > tr > td:first-of-type").first()
    ).toBeVisible();
  });

  test("Should select the page 6 button on page 6", async ({ page }) => {
    await goto(page, `/entreprise/${slug}?etablissments-page=6`);
    await expect(
      page.locator('.fr-pagination__link[title="Page 6"]')
    ).toHaveAttribute("aria-current", "page");
  });

  test("Can click on page 3", async ({ page }) => {
    await goto(page, `/entreprise/${slug}`);
    await page.locator('.fr-pagination__link[title="Page 3"]').click();
    await expect(page).toHaveURL(pageUrl(3));
    await expect(currentPageButton(page)).toHaveText("3");
  });

  test("Can click on previous", async ({ page }) => {
    await goto(page, `/entreprise/${slug}?etablissments-page=6`);
    await page.locator(".fr-pagination__link--prev").click();
    await expect(page).toHaveURL(pageUrl(5));
    await expect(currentPageButton(page)).toHaveText("5");
  });

  test("Can click on next", async ({ page }) => {
    await goto(page, `/entreprise/${slug}?etablissments-page=6`);
    await page.locator(".fr-pagination__link--next").click();
    await expect(page).toHaveURL(pageUrl(7));
    await expect(currentPageButton(page)).toHaveText("7");
  });

  test("Can click on first", async ({ page }) => {
    await goto(page, `/entreprise/${slug}?etablissments-page=6`);
    await page.locator(".fr-pagination__link--first").click();
    await expect(currentPageButton(page)).toHaveText("1");
    await expect(page).not.toHaveURL(/etablissments-page/);
  });
});

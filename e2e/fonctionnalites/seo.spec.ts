import { expect, goto, test } from "../support/test";

test.describe("SEO Index or noindex", () => {
  const isStaging =
    process.env.PLAYWRIGHT_BASE_URL?.startsWith("https://staging") ?? false;

  if (isStaging) {
    test("cannot index home page", async ({ page }) => {
      await goto(page, "/");
      await expect(
        page.locator('meta[name="robots"][content*="noindex"]')
      ).toHaveCount(1);
      await expect(
        page.locator('meta[name="robots"][content*="follow"]')
      ).toHaveCount(1);
    });

    test("cannot index entreprise page", async ({ page }) => {
      await goto(page, "/entreprise/356000000");
      await expect(
        page.locator('meta[name="robots"][content*="noindex"]')
      ).toHaveCount(1);
      await expect(
        page.locator('meta[name="robots"][content*="follow"]')
      ).toHaveCount(1);
    });
  }

  test("can index home page", async ({ page }) => {
    await goto(page, "/");
    await expect(
      page.locator('meta[name="robots"][content*="noindex"]')
    ).toHaveCount(0);
    await expect(
      page.locator('meta[name="robots"][content*="index"]')
    ).toHaveCount(1);
    await expect(
      page.locator('meta[name="robots"][content*="follow"]')
    ).toHaveCount(1);
  });

  test("can index entreprise page", async ({ page }) => {
    await goto(page, "/entreprise/356000000");
    await expect(
      page.locator('meta[name="robots"][content*="noindex"]')
    ).toHaveCount(0);
    await expect(
      page.locator('meta[name="robots"][content*="index"]')
    ).toHaveCount(1);
    await expect(
      page.locator('meta[name="robots"][content*="follow"]')
    ).toHaveCount(1);
  });

  test("cannot index closed entreprise page", async ({ page }) => {
    await goto(page, "/entreprise/839517323");
    await expect(
      page.locator('meta[name="robots"][content*="noindex"]')
    ).toHaveCount(1);
    await expect(
      page.locator('meta[name="robots"][content*="follow"]')
    ).toHaveCount(1);
  });

  test("cannot index auto entreprise page", async ({ page }) => {
    await goto(page, "/entreprise/883010316");
    await expect(
      page.locator('meta[name="robots"][content*="noindex"]')
    ).toHaveCount(1);
    await expect(
      page.locator('meta[name="robots"][content*="follow"]')
    ).toHaveCount(1);
  });

  test("can index protected siren entreprise page", async ({ page }) => {
    await goto(page, "/entreprise/908595879");
    await expect(
      page.locator('meta[name="robots"][content*="noindex"]')
    ).toHaveCount(0);
    await expect(
      page.locator('meta[name="robots"][content*="follow"]')
    ).toHaveCount(1);
  });
});

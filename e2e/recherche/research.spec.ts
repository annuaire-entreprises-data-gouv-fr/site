import { expect, goto, test } from "../support/test";

const searchInput = ".fr-search-bar > input";
const searchButton = ".fr-search-bar > button";

test.describe("Home page’s search bar", () => {
  test("Allow an empty search term", async ({ page }) => {
    await goto(page, "/");

    await page.locator(searchButton).click();

    await expect(page).toHaveURL(/\/rechercher/);
    await expect(
      page
        .getByText("Grâce aux filtres de recherche, retrouvez n’importe")
        .first()
    ).toBeVisible();
  });

  test('allows to research "Ganymede"', async ({ page }) => {
    await goto(page, "/");

    await page.locator(searchInput).fill("Ganymede");
    await expect(page.locator(searchInput)).toHaveValue("Ganymede");
    await page.locator(searchButton).click();

    await expect(page).toHaveURL(/\/rechercher\?terme=Ganymede/);
    await expect(page.getByText("GANYMEDE").first()).toBeVisible();
  });
});

test.describe("Header’s search bar", () => {
  test("Tutorial on empty search term", async ({ page }) => {
    await goto(page, "/rechercher");
    await expect(
      page.getByText("Grâce aux filtres de recherche,").first()
    ).toBeVisible();

    await goto(page, "/rechercher?terme=Kikou");
    await page.locator(searchInput).clear();
    await page.locator(searchButton).click();

    await expect(page).not.toHaveURL(/terme/);
    await expect(
      page.getByText("Grâce aux filtres de recherche,").first()
    ).toBeVisible();
  });

  test("Not enough params", async ({ page }) => {
    await goto(page, "/rechercher?terme=df");

    await expect(
      page
        .getByText("Votre requête ne contient pas assez de paramètres")
        .first()
    ).toBeVisible();
  });

  test('allows to research "Ganymede"', async ({ page }) => {
    await goto(page, "/rechercher?terme=Ganymede");

    await page.locator(searchInput).clear();
    await page.locator(searchInput).fill("Ganymede");
    await expect(page.locator(searchInput)).toHaveValue("Ganymede");
    await page.locator(searchButton).click();

    await expect(page).toHaveURL(/\/rechercher\?terme=Ganymede/);
  });
});

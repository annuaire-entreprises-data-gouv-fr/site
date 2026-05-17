import routes from "#/clients/routes";
import { expect, goto, mockRoute, test } from "../support/test";

const path = "/rechercher";

test.describe("Search page", () => {
  test("Open advanced search page", async ({ page }) => {
    await mockRoute(page, `${routes.geo.communes}*`, {
      fixture: "geo-communes.json",
    });
    await mockRoute(page, `${routes.geo.departements}*`, []);
    await mockRoute(page, `${routes.geo.regions}*`, []);
    await mockRoute(page, `${routes.geo.epcis}*`, []);

    await goto(page, "/");
    await page.getByText("recherche avancée").click();
    await page.getByRole("button", { name: /Zone géographique/ }).click();
    await page.locator("#geo-search-input").fill("Nice");
    await page.getByText("Nice (06000)").click();
    await page.getByRole("button", { name: "Appliquer" }).first().click();

    await expect(page).toHaveURL(/cp_dep=06000/);
  });
});

test.describe("Dirigeants and Elus search", () => {
  test("Search a dirigeant with main search bar", async ({ page }) => {
    await goto(page, "/rechercher?terme=xavier+jouppe");

    await expect(page.getByText("GANYMEDE").first()).toBeVisible();
    await expect(page.getByText("Xavier JOUPPE").first()).toBeVisible();
  });
});

test.describe(`Advanced search on page ${path}`, () => {
  test("Shows filters", async ({ page }) => {
    await goto(page, `${path}?terme=Ganymede`);

    await page.getByRole("button", { name: /Zone géographique/ }).click();
    await expect(page.locator("#geo-search-input")).toBeVisible();
    await page.getByRole("button", { name: /Zone géographique/ }).click();
    await expect(page.locator("#geo-search-input")).not.toBeVisible();

    await page.getByRole("button", { name: /Dirigeant/ }).click();
    await expect(
      page.getByText(
        "Rechercher toutes les structures liées à une personne (dirigeant(e), ou élu(e))"
      )
    ).toBeVisible();

    await page
      .getByRole("button", { name: /Situation administrative/ })
      .click();
    await expect(page.getByText("Domaine d‘activité")).toBeVisible();
    await expect(page.getByText("Etat administratif")).toBeVisible();
  });

  test("Filters propagate on pagination", async ({ page }) => {
    await goto(page, `${path}?terme=la+poste&cp_dep=&sap=A`);

    await expect(page.locator(".fr-pagination")).toBeVisible();
    await page.locator('.fr-pagination__link[title="Page 3"]').click();
    await expect(page).toHaveURL(/sap=A/);
  });

  test("Structure filters", async ({ page }) => {
    await goto(page, `${path}?terme=`);

    await page.getByRole("button", { name: /Structure/ }).click();
    await expect(
      page.getByText("Qualités, labels et certificats")
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Collectivité territoriale" })
      .click();
    await page.getByRole("button", { name: /RGE -/ }).click();
    await page.getByRole("button", { name: "Appliquer" }).first().click();
  });

  test("Finances filters", async ({ page }) => {
    await goto(page, `${path}?terme=ganymede&ca_min=100&res_max=100000`);

    await expect(
      page.getByRole("button", { name: "Filtre financier" })
    ).toBeVisible();
    await expect(page).toHaveURL(/ca_min=100/);
    await expect(page).toHaveURL(/res_max=100000/);
  });
});

test.describe("Minimum search conditions", () => {
  test("No results if term < 3 and no filters", async ({ page }) => {
    await goto(page, "/rechercher?terme=ga");
    await expect(
      page.getByText("ne contient pas assez de paramètres")
    ).toHaveCount(1);
  });

  test("Results if term >= 3 and no filters", async ({ page }) => {
    await goto(page, "/rechercher?terme=aga");
    await expect(
      page.getByText("ne contient pas assez de paramètres")
    ).toHaveCount(0);
  });

  test("Results if term < 3 and filters", async ({ page }) => {
    await goto(page, "/rechercher?terme=ag&cp_dep=35000&cp_dep_type=cp");
    await expect(
      page.getByText("ne contient pas assez de paramètres")
    ).toHaveCount(0);
  });
});

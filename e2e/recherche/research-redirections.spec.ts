import { expect, goto, test } from "../support/test";

const searchInput = ".fr-search-bar > input";
const searchButton = ".fr-search-bar > button";

async function search(page: import("@playwright/test").Page, value: string) {
  await goto(page, "/");
  await page.locator(searchInput).fill(value);
  await expect(page.locator(searchInput)).toHaveValue(value);
  await page.locator(searchButton).click();
}

test.describe("Siren / Siret redirections", () => {
  test("Formatted siren/siret redirection", async ({ page }) => {
    await search(page, "552032534");
    await expect(page).toHaveURL(
      /\/entreprise\/danone-552032534\?redirected=1/
    );
  });

  test("Unformatted siren redirection", async ({ page }) => {
    await search(page, "552 032 534");
    await expect(page).toHaveURL(
      /\/entreprise\/danone-552032534\?redirected=1/
    );
  });

  test("Not found redirection", async ({ page }) => {
    await search(page, "123 456 789 00003");
    await expect(page).toHaveURL(/\/erreur\/introuvable\/12345678900003/);
  });

  test("Unformatted siret redirection", async ({ page }) => {
    await search(page, "487 444 697 00428");
    await expect(page).toHaveURL(/\/etablissement\/48744469700428/);
  });

  test("Entreprise/etablissement page redirection", async ({ page }) => {
    await goto(page, "/entreprise/48744469700428");
    await expect(page).toHaveURL(/\/etablissement\/48744469700428/);

    await goto(page, "/etablissement/487444697");
    await expect(page).toHaveURL(
      /\/entreprise\/essor-energies-solarsud-487444697/
    );
  });

  test("Allow search request with 9 or plus digits", async ({ page }) => {
    await goto(
      page,
      "/rechercher?terme=&cp_dep_label=&cp_dep_type=&cp_dep=&fn=&n=&dmin=&dmax=&type=&label=&ca_min=100000000&etat=&sap=&naf=&nature_juridique=&tranche_effectif_salarie=&categorie_entreprise="
    );

    await expect(page).toHaveURL(/\/rechercher\?ca_min=100000000/);
  });
});

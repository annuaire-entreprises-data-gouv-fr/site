import { expect, goto, login, test } from "../support/test";

test.describe("Fiche résumé DANONE", () => {
  test("Should display basic infos", async ({ page }) => {
    await goto(page, "/entreprise/danone-552032534");

    await expect(
      page.getByText(
        "Sa forme juridique est SA à conseil d'administration (s.a.i.)."
      )
    ).toBeVisible();
    await expect(
      page.getByText("Informations légales de DANONE").first()
    ).toBeVisible();
    await expect(
      page.getByText(
        "Son siège social est domicilié au 59-61 RUE LA FAYETTE 75009 PARIS."
      )
    ).toBeVisible();
    await expect(
      page.getByText("N° TVA Intracommunautaire").first()
    ).toBeVisible();
    await expect(page.getByText("FR27 552 032 534").first()).toBeVisible();
    await expect(page.getByText("N° EORI").first()).toBeVisible();
    await expect(page.getByText("FR123 456 789 0").first()).toBeVisible();
    await expect(page.getByText("Effectif salarié").first()).toBeVisible();
    await expect(
      page.getByText("1 000 à 1 999 salariés, en 2023").first()
    ).toBeVisible();
  });

  test("[LOGGED] Should display basic infos", async ({ page, context }) => {
    await login(page, context);
    await goto(page, "/entreprise/danone-552032534");

    await expect(page.getByText("Effectif salarié").first()).toBeVisible();
    await expect(
      page.getByText("1 000 à 1 999 salariés, en 2023").first()
    ).toBeVisible();
    await expect(
      page.getByText("Résumé pour les agents publics").first()
    ).toBeVisible();
    await expect(page.getByText("Documents juridiques").first()).toBeVisible();
    await expect(
      page.getByText("Consulter les Actes et les Statuts constitutifs")
    ).toBeVisible();
  });
});

test.describe("Entreprises non-diffusibles", () => {
  test("Should be non diffusible", async ({ page }) => {
    await goto(page, "/entreprise/300025764");
    await expect(page.getByText("ne sont pas publiquement")).toHaveCount(1);
  });

  test("Should be diffusible", async ({ page }) => {
    await goto(page, "/entreprise/880878145");
    await expect(page.getByText("ne sont pas publiquement")).toHaveCount(0);
  });
});

test.describe("TVA number special cases", () => {
  test("TVA Non-assujettie", async ({ page }) => {
    await goto(page, "/entreprise/883010316");
    await expect(page.getByText("Pas de n° TVA valide").first()).toBeVisible();

    await goto(page, "/entreprise/423208180");
    await expect(page.getByText("Pas de n° TVA valide").first()).toBeVisible();
  });
});

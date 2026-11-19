import routes from "#/clients/routes";
import { expect, goto, login, mockRoute, test } from "../support/test";

test.describe("Données financières", () => {
  test("Should display Données financières section", async ({ page }) => {
    await goto(page, "/entreprise/487444697");
    await expect(page.getByText("Données financières").first()).toBeVisible();
  });

  test("Should hide bilans when partially confidential", async ({ page }) => {
    await mockRoute(page, `${routes.donneesFinancieres.ods.search}*`, {
      fixture: "donnees-financieres-confidential.json",
    });
    await mockRoute(page, `${routes.donneesFinancieres.ods.metadata}*`, {
      fixture: "ods-metadata.json",
    });

    await goto(page, "/entreprise/487444697/donnees-financieres");
    await expect(
      page.getByText(
        "Les bilans de cette structure sont accompagnés d’une déclaration de confidentialité."
      )
    ).toBeVisible();
  });

  for (const { siren, diffusion } of [
    { siren: "552032534", diffusion: "a diffusible company" },
    { siren: "908595879", diffusion: "a legacy protected company" },
    { siren: "990000010", diffusion: "a newly protected company" },
  ]) {
    test(`Public financial indicators are visible for ${diffusion}`, async ({
      page,
    }) => {
      await mockRoute(page, `${routes.donneesFinancieres.ods.search}*`, {
        fixture: "donnees-financieres.json",
      });
      await mockRoute(page, `${routes.donneesFinancieres.ods.metadata}*`, {
        fixture: "ods-metadata.json",
      });

      await goto(page, `/entreprise/${siren}/donnees-financieres`);
      await expect(page.getByText("Date de clôture").first()).toBeVisible();
      await expect(page.getByText("31/12/2019").first()).toBeVisible();
      await expect(page.getByText("Résultat net").first()).toBeVisible();
      await expect(page.getByText("2 Mds €").first()).toBeVisible();
      await expect(page.getByText("MEF").first()).toBeVisible();
      await expect(page.getByText("INPI").first()).toBeVisible();
    });
  }

  test("Partial diffusion keeps financial indicators private", async ({
    page,
  }) => {
    await goto(page, "/entreprise/990000044/donnees-financieres");
    await expect(
      page.getByRole("heading", {
        name: "Indicateurs financiers (données privées)",
      })
    ).toBeVisible();
    await expect(page.locator("#indicateurs-financiers")).toHaveCount(0);
  });

  test("Should display dépôts de compte section (JOAFE)", async ({ page }) => {
    await goto(page, "/entreprise/338365059/donnees-financieres");
    await expect(
      page.getByText(
        /Cette structure possède [\d]+ comptes publiés au Journal Officiel des Associations/
      )
    ).toBeVisible();
    await expect(page.getByText("338365059_31122022").first()).toBeVisible();
  });
});

test.describe("Bilans financiers (authenticated)", () => {
  test.beforeEach(async ({ page, context }) => {
    await login(page, context);
  });

  test('Should display "Détail des subventions"', async ({ page }) => {
    await goto(page, "/entreprise/338365059/donnees-financieres");
    await expect(page.getByText("Subventions reçues").first()).toBeVisible();
    await expect(page.getByText("État").first()).toBeVisible();
    await expect(page.getByText("Refusé").first()).toBeVisible();
  });
});

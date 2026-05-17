import { expect, goto, login, test } from "../support/test";

test.describe("Dirigeants ESSOR ENERGIES (SOLARSUD)", () => {
  test("Should display dirigeants from INPI", async ({ page }) => {
    await goto(page, "/dirigeants/487444697");

    await expect(
      page.getByText(
        "Cette entreprise possède 2 dirigeants enregistrés au Registre National des Entreprises (RNE) tenu par l’INPI."
      )
    ).toBeVisible();
    await expect(
      page.getByText("David, Jean-Claude POUYANNE, né(e) en octobre 1965")
    ).toBeVisible();
  });

  test("[LOGGED] Should display comparison between INPI and IG", async ({
    page,
    context,
  }) => {
    await login(page, context);
    await goto(page, "/dirigeants/487444697");

    await expect(
      page.getByText(
        "Ces informations proviennent du RNE et sont issues d‘une comparaison entre les données issues de l’INPI et celles d’Infogreffe"
      )
    ).toBeVisible();
    await expect(
      page
        .getByText(
          "BCRH & ASSOCIES - SOCIETE A RESPONSABILITE LIMITEE A ASSOCIE UNIQUE"
        )
        .first()
    ).toBeVisible();
    await expect(
      page.getByText("David, Jean-Claude POUYANNE").first()
    ).toBeVisible();
  });
});

test.describe("Dirigeants non-diffusible ", () => {
  test("Should not display dirigeants", async ({ page }) => {
    await goto(page, "/dirigeants/908595879");

    await expect(
      page.getByRole("heading", { name: "SEVERNAYA", level: 1 })
    ).toBeVisible();
    await expect(
      page.getByRole("status").first().getByText("protégé")
    ).toBeVisible();
    await expect(
      page.getByText("Dirigeant(s) (données privées)").first()
    ).toBeVisible();
  });

  test("[LOGGED] Should display dirigeants", async ({ page, context }) => {
    await login(page, context);
    await goto(page, "/dirigeants/908595879");

    await expect(page.getByText("Dirigeant(s)").first()).toBeVisible();
    await expect(
      page.getByText(
        "Cette entreprise possède 2 dirigeants enregistrés au Registre National des Entreprises (RNE) tenu par l’INPI."
      )
    ).toBeVisible();
  });
});

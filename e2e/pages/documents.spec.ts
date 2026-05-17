import { expect, goto, login, test } from "../support/test";

test.describe("Documents ESSOR ENERGIES (SOLARSUD)", () => {
  test("Bouton agent connect sur les données protégées", async ({ page }) => {
    await goto(page, "/documents/487444697");
    await expect(
      page.getByText("Réservé aux agents publics").first()
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /ProConnect/ }).first()
    ).toBeVisible();
  });

  test("[LOGGED] Should display documents", async ({ page, context }) => {
    await login(page, context);
    await goto(page, "/documents/487444697");

    await expect(
      page.getByText("Attestations de conformité sociale").first()
    ).toBeVisible();
    await expect(
      page.getByText("Attestation de conformité fiscale").first()
    ).toBeVisible();
    await expect(
      page.locator('label[for="conformite-sociale-use-case-0"]')
    ).toBeVisible();
    page.locator('label[for="conformite-sociale-use-case-0"]').click();
    await expect(
      page.getByText("URSSAF : conforme", { exact: true }).first()
    ).toBeVisible();
    await expect(
      page.getByText("MSA : conforme", { exact: true }).first()
    ).toBeVisible();
    await expect(
      page.locator('label[for="conformite-fiscale-use-case-2"]')
    ).toBeVisible();
    page.locator('label[for="conformite-fiscale-use-case-2"]').click();
    await expect(
      page.getByText("DGFiP : conforme", { exact: true }).first()
    ).toBeVisible();

    await expect(
      page.getByText(
        "Justificatifs et certificats relatifs aux entreprises de travaux publics"
      )
    ).toBeVisible();
    await expect(page.getByText("Travaux publics").first()).toBeVisible();
    const travauxPublicsUseCase = page.locator(
      'label[for="travaux-publics-use-case-0"]'
    );
    await expect(travauxPublicsUseCase).toBeVisible();
    travauxPublicsUseCase.click();
    await expect(
      page.getByText("FNTP : document disponible", { exact: true }).first()
    ).toBeVisible();
    await expect(
      page.getByText("CNETP : document disponible", { exact: true }).first()
    ).toBeVisible();
    await expect(
      page.getByText("CIBTP : document disponible", { exact: true }).first()
    ).toBeVisible();
    await expect(
      page.getByText("ProBTP : document disponible", { exact: true }).first()
    ).toBeVisible();
  });

  test("[LOGGED] Should not display conformite documents but travaux publics documents", async ({
    page,
    context,
  }) => {
    await login(page, context, "travaux_publics@yopmail.com");
    await goto(page, "/documents/487444697");

    await expect(
      page.getByText("Attestations de conformité sociale")
    ).toHaveCount(0);
    await expect(
      page.getByText("Attestation de conformité fiscale")
    ).toHaveCount(0);
    await expect(
      page.getByText(
        "Justificatifs et certificats relatifs aux entreprises de travaux publics"
      )
    ).toBeVisible();
    await expect(page.getByText("Travaux publics").first()).toBeVisible();
  });

  test("[LOGGED] Should display conformite sociale documents but not fiscale and travaux publics documents", async ({
    page,
    context,
  }) => {
    await login(page, context, "conformite_sociale@yopmail.com");
    await goto(page, "/documents/487444697");

    await expect(
      page.getByText("Attestations de conformité sociale").first()
    ).toBeVisible();
    await expect(
      page.getByText("Attestation de conformité fiscale")
    ).toHaveCount(0);
    await expect(
      page.getByText(
        "Justificatifs et certificats relatifs aux entreprises de travaux publics"
      )
    ).toHaveCount(0);
    await expect(page.getByText("Travaux publics")).toHaveCount(0);
  });

  test("[LOGGED] Should display conformite fiscale documents but not sociale and travaux publics documents", async ({
    page,
    context,
  }) => {
    await login(page, context, "conformite_fiscale@yopmail.com");
    await goto(page, "/documents/487444697");

    await expect(
      page.getByText("Attestations de conformité sociale")
    ).toHaveCount(0);
    await expect(
      page.getByText("Attestation de conformité fiscale").first()
    ).toBeVisible();
    await expect(
      page.getByText(
        "Justificatifs et certificats relatifs aux entreprises de travaux publics"
      )
    ).toHaveCount(0);
    await expect(page.getByText("Travaux publics")).toHaveCount(0);
  });
});

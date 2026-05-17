import { expect, goto, test } from "../support/test";

test.describe("Administration", () => {
  test("Should display administration", async ({ page }) => {
    await goto(page, "/entreprise/130025265");
    await expect(page.getByText("Administration").first()).toBeVisible();
    await expect(page.getByText("Type organisme").first()).toBeVisible();
    await expect(
      page.getByText("Administration centrale (ou Ministère)").first()
    ).toBeVisible();
    await expect(
      page.getByText("fiche de l’Annuaire du service public").first()
    ).toBeVisible();
  });

  test("Should display dirigeant information", async ({ page }) => {
    await goto(page, "/dirigeants/130025265");
    await expect(
      page.getByText("responsable(s) enregistré(s) auprès de la DILA").first()
    ).toBeVisible();

    const table = page.locator("#responsables-service-public table");
    await expect(
      table.getByRole("columnheader", { name: "Role" })
    ).toBeVisible();
    await expect(
      table.getByRole("columnheader", { name: "Nom", exact: true })
    ).toBeVisible();
    await expect(
      table.getByRole("columnheader", { name: "Nomination" })
    ).toBeVisible();
    await expect
      .poll(() => table.locator("tr").count())
      .toBeGreaterThanOrEqual(5);
  });
});

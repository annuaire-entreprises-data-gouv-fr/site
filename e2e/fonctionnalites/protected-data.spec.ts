import { expect, goto, test } from "../support/test";

test.describe("Protected data are hidden for non-logged users", () => {
  test("Should not display OPQIBI bloc", async ({ page }) => {
    await goto(page, "/labels-certificats/487444697");
    await expect(
      page.locator("h2").filter({ hasText: "Certificat OPQIBI" })
    ).toHaveCount(0);
  });

  test("Should not display QUALIBAT bloc", async ({ page }) => {
    await goto(page, "/labels-certificats/843701079");
    await expect(
      page.locator("h2").filter({ hasText: "Certificat Qualibat" })
    ).toHaveCount(0);
  });

  test("Should not display QUALIFELEC bloc", async ({ page }) => {
    await goto(page, "/labels-certificats/843701079");
    await expect(
      page.locator("h2").filter({ hasText: "Certificats Qualifelec" })
    ).toHaveCount(0);
  });

  test("Should not display immatriculation EORI", async ({ page }) => {
    await goto(page, "/entreprise/356000000");
    await expect(page.getByText("Immatriculation EORI")).toHaveCount(0);
  });

  test("Should not display protected document", async ({ page }) => {
    await goto(page, "/entreprise/356000000");
    await expect(
      page.locator("h2").filter({ hasText: "Conformité" })
    ).toHaveCount(0);
    await expect(
      page.locator("h2").filter({ hasText: "Actes et statuts" })
    ).toHaveCount(0);
    await expect(
      page
        .locator("h2")
        .filter({ hasText: "Carte professionnelle travaux publics" })
    ).toHaveCount(0);
  });

  test("Should not display bilans", async ({ page }) => {
    await goto(page, "/donnees-financieres/487444697");
    await expect(
      page.getByText(
        /Cette entreprise possède [\d]+ bilan\(s\) déposé\(s\) au RNE/
      )
    ).toHaveCount(0);
  });
});

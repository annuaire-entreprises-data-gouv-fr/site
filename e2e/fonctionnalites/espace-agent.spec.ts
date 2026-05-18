import { expect, goto, test } from "../support/test";

test.describe("Espace agent", () => {
  test("Page d'accueil", async ({ context, page }) => {
    await context.clearCookies();
    await goto(page, "/");

    await page
      .getByRole("link", {
        name: "Accéder à la page de connexion de l'espace agent public",
      })
      .click();
    await expect(
      page.getByRole("button", { name: /ProConnect/ }).first()
    ).toBeVisible();
  });

  test("Bouton agent connect sur les données protégées", async ({ page }) => {
    await goto(page, "/documents/487444697");
    await expect(
      page.getByText("Réservé aux agents publics").first()
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /ProConnect/ }).first()
    ).toBeVisible();
  });
});

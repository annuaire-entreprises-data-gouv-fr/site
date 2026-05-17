import { expect, goto, test } from "../support/test";

test.describe("Immatriculation RNE", () => {
  test("Should display immatriculation", async ({ page }) => {
    await goto(page, "/entreprise/552032534");
    await expect(page.getByText("Immatriculée au RNE").first()).toBeVisible();
    await expect(page.getByText("01/03/1955").first()).toBeVisible();
  });

  test("Should display immatriculation even for non diffusible", async ({
    page,
  }) => {
    await goto(page, "/entreprise/300025764");
    await expect(page.getByText("Immatriculée au RNE").first()).toBeVisible();
    await expect(
      page.getByText("Gestion de biens, Libérale non réglementée").first()
    ).toBeVisible();
  });

  test("Should display immatriculation even for closed structure", async ({
    page,
  }) => {
    await goto(page, "/entreprise/880878145");
    await expect(page.getByText("Radiée au RNE").first()).toBeVisible();
    await expect(page.getByText("14/11/2022").first()).toBeVisible();
  });

  test("Should display warning when not found in RNE", async ({ page }) => {
    await goto(page, "/entreprise/784410607");
    await expect(
      page.getByText("Non trouvée dans le RNE").first()
    ).toBeVisible();
  });
});

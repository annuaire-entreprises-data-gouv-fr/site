import { expect, goto, test } from "../support/test";

test.describe("Dirigeants and élus pages", () => {
  test("Dirigeant page loads", async ({ page }) => {
    await goto(page, "/dirigeants/843701079");
    await expect(page.getByText("Details").first()).toBeVisible();
    await expect(
      page.getByText("Lionel, Andre BERTRAND").first()
    ).toBeVisible();
  });

  test("Elus page loads", async ({ page }) => {
    await goto(page, "/dirigeants/217500016");
    await expect(page.getByText("Emmanuel GRÉGOIRE").first()).toBeVisible();
  });
});

test.describe("Labels and certificates", () => {
  test("RGE", async ({ page }) => {
    await goto(page, "/entreprise/843701079");
    await expect(page.getByText("Labels et certificats").first()).toBeVisible();
    await expect(
      page.getByText("RGE - Reconnu Garant de l’Environnement").first()
    ).toBeVisible();
  });

  test("ESS et Spectacle vivant", async ({ page }) => {
    await goto(page, "/entreprise/800329849");
    await expect(
      page.getByText("Qualités, labels et certificats").first()
    ).toBeVisible();
    await expect(
      page.getByText("ESS - Économie Sociale et Solidaire").first()
    ).toBeVisible();
    await expect(
      page.getByText("Entrepreneur de spectacles vivants").first()
    ).toBeVisible();
  });

  test("No certificates", async ({ page }) => {
    await goto(page, "/entreprise/880878145");
    await expect(page.getByText("Labels et certificats")).toHaveCount(0);
  });
});

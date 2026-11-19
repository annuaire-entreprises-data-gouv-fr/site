import { expect, goto, test } from "../support/test";

test.describe("Etat administratif", () => {
  test("Partial diffusion keeps the administrative status visible", async ({
    page,
  }) => {
    await goto(page, "/entreprise/300025764");
    await expect(
      page.getByRole("status").filter({ hasText: "en activité" }).first()
    ).toBeVisible();
  });

  test("Diffusible", async ({ page }) => {
    await goto(page, "/entreprise/356000000");
    await expect(
      page.getByRole("status").filter({ hasText: "en activité" }).first()
    ).toBeVisible();
  });

  test("En sommeil", async ({ page }) => {
    await goto(page, "/entreprise/351556394");
    await expect(
      page.getByRole("status").filter({ hasText: "en sommeil" }).first()
    ).toBeVisible();
  });

  test("Cessée", async ({ page }) => {
    await goto(page, "/entreprise/839517323");
    await expect(
      page.getByRole("status").filter({ hasText: "cessée" }).first()
    ).toBeVisible();
  });
});

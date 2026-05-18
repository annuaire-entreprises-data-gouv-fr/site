import { expect, goto, test } from "../support/test";

test.describe("FAQ contextual links", () => {
  test("Adresse link", async ({ page }) => {
    await goto(page, "/etablissement/88087814500015");
    await page.getByText("Adresse").first().click();
    await expect(page).toHaveURL(/\/faq\/modifier-adresse/);
  });

  test("Source de données", async ({ page }) => {
    await goto(page, "/entreprise/880878145");
    await page.getByText("Sources : INSEE").first().click();
    await expect(page).toHaveURL(/\/administration\/insee_vies/);
    await expect(
      page.getByText(
        "Comment rendre mon entreprise individuelle diffusible ou non-diffusible ?"
      )
    ).toHaveCount(1);
  });
});

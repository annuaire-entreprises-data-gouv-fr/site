import { expect, goto, login, test } from "../support/test";

test.describe("Rate limiting bilans financiers (authenticated)", () => {
  test.beforeEach(async ({ page, context }) => {
    await login(page, context, "with-too-many-requests@yopmail.com");
  });

  test('Should display "Détail des subventions"', async ({ page }) => {
    await goto(page, "/entreprise/338365059/donnees-financieres");
    await expect(
      page.getByText("Plafond de consultation atteint").first()
    ).toBeVisible();
  });
});

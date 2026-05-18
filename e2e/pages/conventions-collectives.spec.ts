import { expect, goto, test } from "../support/test";

test.describe("Conventions collectives", () => {
  test("Should work for valid companies", async ({ page }) => {
    await goto(page, "/divers/356000000");
    await expect(
      page
        .getByText("Convention d'entreprise La Poste - France Télécom")
        .first()
    ).toBeVisible();
  });

  // Need an example
  // test('Should display Inconnues ou supprimées', async ({ page }) => {
  //   await goto(page, '/divers/592052302');
  //   await expect(page.getByText('Inconnues ou supprimées').first()).toBeVisible();
  //   await expect(page.getByText('et remplacée par :').first()).toBeVisible();
  // });
});

import { expect, goto, test } from "../support/test";

test.describe("Élus VILLE DE PARIS", () => {
  test("Should display élus", async ({ page }) => {
    await goto(page, "/dirigeants/217500016");

    await expect(page.getByText("Élus").first()).toBeVisible();
    await expect(
      page.getByText(
        "Cette collectivité possède 163 élus enregistrés au Répertoire National des Élus :"
      )
    ).toBeVisible();
    await expect(page.getByText("Emmanuel GRÉGOIRE").first()).toBeVisible();
  });
});

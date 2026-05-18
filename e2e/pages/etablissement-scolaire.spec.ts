import { expect, goto, test } from "../support/test";

test.describe("Établissement scolaire", () => {
  test("Should display service public and Établissement scolaire section", async ({
    page,
  }) => {
    await goto(page, "/entreprise/198100125");
    await expect(page.getByText("Administration").first()).toBeVisible();
    await expect(
      page.getByText("Établissements scolaires").first()
    ).toBeVisible();
  });
  test("Should display info from annuaire de l'éducation nationale", async ({
    page,
  }) => {
    await goto(page, "/etablissements-scolaires/198100125");
    await expect(
      page.getByText("Annuaire de l’Education Nationale").first()
    ).toBeVisible();
    await expect(page.getByText("N° UAI").first()).toBeVisible();
    await expect(page.getByText("0810012Y").first()).toBeVisible(); // UAI
  });
});

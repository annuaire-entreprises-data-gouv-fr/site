import type { Page } from "@playwright/test";
import { expect, goto, lastCellByRowText, test } from "../support/test";

async function expectAssociationRow(page: Page, label: string, value: RegExp) {
  await expect(
    lastCellByRowText(page, "#association-section", label).getByRole("button", {
      name: value,
    })
  ).toBeVisible();
}

test.describe("Association", () => {
  test("Should display association data from private api", async ({ page }) => {
    await goto(page, "/entreprise/400485504");

    await expect(
      page.getByRole("heading", { name: "L'ENFANT BLEU", level: 1 })
    ).toBeVisible();
    await expect(page.locator("#association-section")).toBeVisible();

    await expectAssociationRow(page, "N°RNA", /W751 092 330/);
    await expectAssociationRow(
      page,
      "Nom",
      /ASSOCIATION L'ENFANT BLEU ENFANCE MALTRAITEE/
    );
    await expectAssociationRow(page, "Regime", /loi1901/);
    await expectAssociationRow(
      page,
      "Adresse du siège",
      /18 RUE HOCHE, 92130 ISSY-LES-MOULINEAUX/
    );
  });

  test("Should fallback and display association data from public api when private api is not available", async ({
    page,
  }) => {
    await goto(page, "/entreprise/400461356");

    await expect(
      page.getByRole("heading", { name: "LES RESTAURANTS DU COEUR", level: 1 })
    ).toBeVisible();
    await expect(page.locator("#association-section")).toBeVisible();

    await expectAssociationRow(page, "N°RNA", /W491 004 193/);
    await expectAssociationRow(
      page,
      "Nom",
      /LES RESTAURANTS DU COEUR DE MAINE ET LOIRE/
    );
    await expectAssociationRow(page, "Regime", /loi1901/);
    await expectAssociationRow(
      page,
      "Adresse du siège",
      /10 SQUARE DUMONT D'URVILLE, 49000 ANGERS/
    );
  });
});

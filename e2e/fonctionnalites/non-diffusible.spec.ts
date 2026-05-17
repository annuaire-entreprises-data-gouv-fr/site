import type { Page } from "@playwright/test";
import {
  expect,
  firstCellByText,
  goto,
  lastCellByRowText,
  test,
} from "../support/test";

const hiddenInfo = /▪︎ ▪︎ ▪︎ information non-diffusible ▪︎ ▪︎ ▪︎/;
const parisInfo = /▪︎ ▪︎ ▪︎ PARIS ▪︎ ▪︎ ▪︎/;

async function expectLastCellButton(
  page: Page,
  section: string,
  label: string,
  name: RegExp
) {
  await expect(
    lastCellByRowText(page, section, label).getByRole("button", { name })
  ).toBeVisible();
}

test.describe("Non-diffusible", () => {
  test("Non diffusible EI should have no name and address", async ({
    page,
  }) => {
    await goto(page, "/entreprise/300025764");

    await expect(page.getByText("ne sont pas publiquement")).toHaveCount(1);
    await expect(
      page.getByRole("heading", { name: hiddenInfo, level: 1 })
    ).toBeVisible();

    await expectLastCellButton(
      page,
      "#entreprise",
      "Adresse postale",
      hiddenInfo
    );
    await expectLastCellButton(
      page,
      "#etablissement",
      "Enseigne de l’établissement",
      hiddenInfo
    );
    await expectLastCellButton(page, "#etablissement", "Adresse", hiddenInfo);

    const detailCell = firstCellByText(
      page,
      "#etablissements",
      "Détails (nom, enseigne, adresse)"
    );
    await expect(
      detailCell.getByRole("link", { name: hiddenInfo })
    ).toBeVisible();
  });

  test("Non diffusible Personne morale should have name but hidden address", async ({
    page,
  }) => {
    await goto(page, "/entreprise/908595879");

    await expect(page.getByText("ne sont pas publiquement")).toHaveCount(1);
    await expect(
      page.getByRole("heading", { name: "SEVERNAYA", level: 1 })
    ).toBeVisible();

    await expectLastCellButton(
      page,
      "#entreprise",
      "Adresse postale",
      parisInfo
    );
    await expectLastCellButton(page, "#etablissement", "Adresse", parisInfo);

    const detailCell = firstCellByText(
      page,
      "#etablissements",
      "Détails (nom, enseigne, adresse)"
    );
    await expect(detailCell.getByText("▪︎ ▪︎ ▪︎ PARIS ▪︎ ▪︎ ▪︎")).toBeVisible();
  });

  test("Should be diffusible and display details", async ({ page }) => {
    await goto(page, "/entreprise/880878145");

    await expect(page.getByText("ne sont pas publiquement")).toHaveCount(0);
    await expect(
      page.getByRole("heading", { name: "GANYMEDE", level: 1 })
    ).toBeVisible();

    await expectLastCellButton(
      page,
      "#entreprise",
      "Adresse postale",
      /128 RUE LA BOETIE 75008 PARIS 8/
    );
    await expectLastCellButton(
      page,
      "#etablissement",
      "Adresse",
      /128 RUE LA BOETIE 75008 PARIS 8/
    );

    const detailCell = firstCellByText(
      page,
      "#etablissements",
      "Détails (nom, enseigne, adresse)"
    );
    await expect(
      detailCell.getByText("128 RUE LA BOETIE 75008 PARIS 8")
    ).toBeVisible();
  });

  test("No dirigeant in non diffusible", async ({ page }) => {
    await goto(page, "/dirigeants/908595879");
    await expect(page.getByText("Dirigeant(s) (données privées)")).toHaveCount(
      1
    );
  });

  test("No dirigeant in protected personne morale", async ({ page }) => {
    await goto(page, "/dirigeants/908595879");
    await expect(page.getByText("Dirigeant(s) (données privées)")).toHaveCount(
      1
    );
  });
});

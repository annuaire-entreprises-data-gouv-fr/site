import type { Page } from "@playwright/test";
import {
  expect,
  firstCellByText,
  goto,
  lastCellByRowText,
  login,
  test,
} from "../support/test";

const hiddenInfo = /▪︎ ▪︎ ▪︎ information non-diffusée ▪︎ ▪︎ ▪︎/;
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

test.describe("Diffusion", () => {
  test("Partial diffusion hides an individual entrepreneur’s name and address", async ({
    page,
  }) => {
    await goto(page, "/entreprise/300025764");

    await expect(
      page.getByText("diffusion partielle", { exact: true }).first()
    ).toBeVisible();
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

  test("Legacy protection keeps the company name and only the commune", async ({
    page,
  }) => {
    await goto(page, "/entreprise/908595879");

    await expect(
      page.getByText("protégé", { exact: true }).first()
    ).toBeVisible();
    await expect(page.locator("main")).not.toContainText(
      "10 RUE DE PENTHIEVRE"
    );
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

  for (const { siren, name } of [
    { siren: "990000010", name: "SOCIETE TEMOIN" },
    { siren: "990000036", name: "EI RECENTE" },
  ]) {
    test(`New protection keeps the name and full address of ${name}`, async ({
      page,
    }) => {
      await goto(page, `/entreprise/${siren}`);
      await expect(page.getByRole("heading", { level: 1 })).toContainText(name);
      await expect(
        page.getByText("protégé", { exact: true }).first()
      ).toBeVisible();
      await expect(
        lastCellByRowText(page, "#entreprise", "Adresse postale")
      ).toContainText("12 RUE DES ESSAIS 69003 LYON");
    });
  }

  test("Legacy protection hides an individual entrepreneur’s name, street and commune", async ({
    page,
  }) => {
    await goto(page, "/entreprise/990000028");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "information protégée"
    );
    await expect(
      lastCellByRowText(page, "#entreprise", "Adresse postale")
    ).toContainText("information protégée");
    await expect(page.locator("main")).not.toContainText(
      /EI HISTORIQUE|RUE DES ESSAIS|LYON|ENSEIGNE TEMOIN/
    );
  });

  test("Partial diffusion keeps the company name and only the commune", async ({
    page,
  }) => {
    await goto(page, "/entreprise/990000044");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "SOCIETE PARTIELLE"
    );
    await expect(
      lastCellByRowText(page, "#entreprise", "Adresse postale")
    ).toContainText("LYON");
    await expect(page.locator("main")).not.toContainText("12 RUE DES ESSAIS");
  });

  test("Agents can see a legacy entrepreneur’s identity and address", async ({
    page,
    context,
  }) => {
    await login(page, context);
    await goto(page, "/entreprise/990000028");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "EI HISTORIQUE"
    );
    await expect(
      lastCellByRowText(page, "#entreprise", "Adresse postale")
    ).toContainText("12 RUE DES ESSAIS 69003 LYON");
  });

  test("The legacy RNE extract and Insee notice are withheld from visitors", async ({
    page,
  }) => {
    await goto(page, "/entreprise/908595879");
    await expect(
      lastCellByRowText(page, "#etablissement", "Justificatif(s) d’existence")
    ).toContainText("document protégé");
    await expect(
      page.locator(
        'a[href*="identification/pdf/90859587900010"], a[href*="justificatif-immatriculation-pdf/908595879"]'
      )
    ).toHaveCount(0);
  });

  test("Agents can download the legacy company’s RNE extract and Insee notice", async ({
    page,
    context,
  }) => {
    await login(page, context);
    await goto(page, "/entreprise/908595879");
    await expect(
      page.getByRole("link", { name: "Extrait RNE", exact: true }).first()
    ).toHaveAttribute("href", "/justificatif-immatriculation-pdf/908595879");
    await expect(
      page.getByRole("link", { name: "Avis de situation", exact: true }).first()
    ).toHaveAttribute("href", /identification\/pdf\/90859587900010$/);
  });

  test("Visitors can download the Insee notice of a newly protected company", async ({
    page,
  }) => {
    await goto(page, "/entreprise/990000010");
    const justificatifs = lastCellByRowText(
      page,
      "#etablissement",
      "Justificatif(s) d’existence"
    );
    await expect(justificatifs).toContainText("Avis de situation Insee");
    await expect(
      justificatifs.getByRole("link", { name: /télécharger/i })
    ).toHaveAttribute("href", /identification\/pdf\/99000001000019$/);
  });

  test("The documents tab offers the new notice and withholds the legacy notice", async ({
    page,
  }) => {
    await goto(page, "/entreprise/990000010/documents");
    const section = page.locator("#justificatifs-insee");
    const notice = /identification\/pdf\/99000001000019$/;
    await expect(
      section.getByRole("link", {
        name: /avis de situation Sirene du siège social/i,
      })
    ).toHaveAttribute("href", notice);
    await expect(
      section.getByRole("link", { name: "Télécharger", exact: true })
    ).toHaveAttribute("href", notice);

    const partialBranch = section
      .getByRole("row")
      .filter({ hasText: "990 000 010 00027" });
    await expect(partialBranch).toContainText("document non-diffusé");
    await expect(
      partialBranch.locator('a[href*="identification/pdf/"]')
    ).toHaveCount(0);

    await goto(page, "/entreprise/908595879/documents");
    await expect(section).toBeVisible();
    await expect(section.locator('a[href*="identification/pdf/"]')).toHaveCount(
      0
    );
  });

  for (const { protection, siret, address } of [
    {
      protection: "legacy",
      siret: "90859587900010",
      address: "▪︎ ▪︎ ▪︎ PARIS ▪︎ ▪︎ ▪︎",
    },
    {
      protection: "new",
      siret: "99000001000019",
      address: "12 RUE DES ESSAIS 69003 LYON",
    },
  ]) {
    test(`The establishment page applies ${protection} protection`, async ({
      page,
    }) => {
      await goto(page, `/etablissement/${siret}`);
      await expect(
        lastCellByRowText(page, "#etablissement", "Adresse")
      ).toContainText(address);
      const download = page.locator(
        `#etablissement a[href$="/identification/pdf/${siret}"]`
      );
      if (protection === "new") {
        await expect(download).toBeVisible();
      } else {
        await expect(download).toHaveCount(0);
      }
    });
  }

  test("Search omits protected individual entrepreneurs and applies the address rule to companies", async ({
    page,
  }) => {
    await goto(page, "/rechercher?terme=diffusion-temoin");
    const results = page.locator(".results-list");
    const legacy = results.locator('[data-siren="908595879"]');
    await expect(legacy).toContainText("PARIS");
    await expect(legacy).not.toContainText("RUE DE PENTHIEVRE");
    const branch = results.locator('a[href="/etablissement/99000006900023"]');
    await expect(branch).toContainText("PARIS");
    await expect(branch).not.toContainText("RUE PRIVEE");
    const partial = results.locator('[data-siren="990000044"]');
    await expect(partial).toContainText("LYON");
    await expect(partial).not.toContainText("RUE DES ESSAIS");
    await expect(results.locator('[data-siren="990000010"]')).toContainText(
      "12 RUE DES ESSAIS 69003 LYON"
    );
    await expect(results).not.toContainText(/EI HISTORIQUE|EI RECENTE/);
    await expect(results.locator("[data-siren]")).toHaveCount(4);
  });

  test("A diffusible company can have a partially diffusible secondary establishment", async ({
    page,
  }) => {
    await goto(page, "/entreprise/990000069");
    await expect(
      lastCellByRowText(page, "#entreprise", "Adresse postale")
    ).toContainText("12 RUE DES ESSAIS 69003 LYON");
    const branch = page
      .locator("#etablissements")
      .getByRole("row")
      .filter({ hasText: "990 000 069 00023" });
    await expect(branch).toContainText("▪︎ ▪︎ ▪︎ PARIS ▪︎ ▪︎ ▪︎");
    await expect(branch).not.toContainText("35 RUE PRIVEE");
  });

  for (const agent of [false, true]) {
    test(`Strict non-diffusion withholds company details for ${agent ? "an agent" : "a visitor"}`, async ({
      page,
      context,
    }) => {
      if (agent) {
        await login(page, context);
      }
      await goto(page, "/entreprise/990000051");
      await expect(
        page.getByRole("heading", {
          name: "Qu’est-ce qu’une entreprise non-diffusée ?",
        })
      ).toBeVisible();
      await expect(
        page.getByText("non diffusée", { exact: true }).first()
      ).toBeVisible();
      await expect(
        page.getByText(
          agent ? "même avec votre compte" : "aucune information la concernant"
        )
      ).toBeVisible();
      await expect(page.locator("#entreprise")).toHaveCount(0);
    });
  }
});

import routes from "#/clients/routes";
import { expect, goto, mockRoute, test } from "../support/test";

test.describe("Annonces et observations", () => {
  test.beforeEach(async ({ page }) => {
    await mockRoute(page, `${routes.bodacc.ods.search}*`, {
      fixture: "bodacc.json",
    });
    await mockRoute(page, `${routes.bodacc.ods.metadata}*`, {
      fixture: "ods-metadata.json",
    });
  });

  test("Should display Annonces BODACC section", async ({ page }) => {
    await goto(page, "/entreprise/880878145/annonces");
    await expect(page.getByText("Annonces BODACC").first()).toBeVisible();
  });

  for (const { siren, diffusion } of [
    { siren: "880878145", diffusion: "a diffusible company" },
    { siren: "908595879", diffusion: "a legacy protected company" },
    { siren: "990000010", diffusion: "a newly protected company" },
  ]) {
    test(`BODACC publications are visible for ${diffusion}`, async ({
      page,
    }) => {
      await goto(page, `/entreprise/${siren}/annonces`);
      await expect(page.getByText("Publication").first()).toBeVisible();
      await expect(page.getByText("23/11/2022").first()).toBeVisible();
      await expect(
        page.getByText("Dépôts des comptes 2021").first()
      ).toBeVisible();
      await expect(page.getByText("n°446").first()).toBeVisible();
      await expect(page.getByText("Radiations").first()).toBeVisible();
      await expect(
        page.getByText("Annonce n°446, BODACC B n°20220227").first()
      ).toBeVisible();
    });
  }

  test("Partial diffusion keeps BODACC notices private", async ({ page }) => {
    await goto(page, "/entreprise/990000044/annonces");
    await expect(
      page.getByRole("heading", { name: "Annonces (données privées)" })
    ).toBeVisible();
    await expect(page.locator("#annonces-bodacc")).toHaveCount(0);
  });

  test("Should display JOAFE section for association", async ({ page }) => {
    await mockRoute(page, `${routes.journalOfficielAssociations.ods.search}*`, {
      fixture: "journal-officiel-associations.json",
    });
    await mockRoute(
      page,
      `${routes.journalOfficielAssociations.ods.metadata}*`,
      {
        fixture: "ods-metadata.json",
      }
    );

    await goto(page, "/entreprise/338365059/annonces");
    await expect(
      page.getByText(
        /Cette structure possède [\d] annonces publiées au Journal Officiel des Associations/
      )
    ).toBeVisible();
  });
});

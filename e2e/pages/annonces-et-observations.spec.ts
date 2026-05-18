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
    await goto(page, "/annonces/880878145");
    await expect(page.getByText("Annonces BODACC").first()).toBeVisible();
  });

  test("Should display publication", async ({ page }) => {
    await goto(page, "/annonces/880878145");
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

    await goto(page, "/annonces/338365059");
    await expect(
      page.getByText(
        /Cette structure possède [\d] annonces publiées au Journal Officiel des Associations/
      )
    ).toBeVisible();
  });
});

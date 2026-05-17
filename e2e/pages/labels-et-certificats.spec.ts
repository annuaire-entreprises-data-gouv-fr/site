import { expect, goto, test } from "../support/test";

test.describe("Label et certificats", () => {
  test.describe("QUALIBAT-RGE", () => {
    test("Should display QUALIBAT-RGE", async ({ page }) => {
      await goto(page, "/labels-certificats/843701079");
      await expect(page.getByText("QUALIBAT-RGE").first()).toBeVisible();
      await expect(
        page.getByText("Domaine(s) certifié(s)").first()
      ).toBeVisible();
      await expect(
        page.getByText(
          "Isolation par l'intérieur des murs ou rampants de toitures ou plafonds"
        )
      ).toBeVisible();
      await expect(
        page.getByText(/\d{2} \d{2} \d{2} \d{2} \d{2}/).first()
      ).toBeVisible();
    });
  });

  test.describe("ESS & Spectacles vivants", () => {
    test("Should display ESS and spectacles vivants", async ({ page }) => {
      await goto(page, "/labels-certificats/800329849");
      await expect(
        page.getByText("ESS - Économie Sociale et Solidaire").first()
      ).toBeVisible();
      await expect(
        page.getByText(
          "Cette structure apparait dans la liste des entreprises de l’Economie Sociale et Solidaire"
        )
      ).toBeVisible();
      await expect(
        page.getByText("Entrepreneur de spectacles vivants").first()
      ).toBeVisible();
      await expect(page.getByText("Numéro de récépissé").first()).toBeVisible();
      await expect(
        page.getByText("PLATESV-R-2021-006658").first()
      ).toBeVisible();
    });
  });

  test.describe("Professionnel du Bio", () => {
    test("Should display Professionnel du Bio", async ({ page }) => {
      await goto(page, "/labels-certificats/302474648");
      await expect(
        page.getByText("Professionnel du Bio").first()
      ).toBeVisible();
      await expect(
        page.getByText("Détail établissement").first()
      ).toBeVisible();
      await expect(
        page.getByText("SAS NATURALIA SAINT OUEN PERI").first()
      ).toBeVisible();
    });
  });

  test.describe("Entreprise Sociale Inclusive", () => {
    test("Should display Entreprise Sociale Inclusive", async ({ page }) => {
      await goto(page, "/labels-certificats/533744991");
      await expect(
        page.getByText("Entreprise Sociale Inclusive").first()
      ).toBeVisible();
      await expect(page.getByText("Type de structure").first()).toBeVisible();
      await expect(
        page.getByText("Entreprise d'insertion (EI)").first()
      ).toBeVisible();
    });
  });

  test.describe("Egapro", () => {
    test("Should display Égalité professionnelle - Egapro", async ({
      page,
    }) => {
      await goto(page, "/labels-certificats/356000000");
      await expect(
        page.getByText("Égalité professionnelle - Egapro").first()
      ).toBeVisible();
      await expect(
        page.getByText("Femmes parmi les cadres dirigeants").first()
      ).toBeVisible();
      await expect(page.getByText("25").first()).toBeVisible();
    });
  });

  test.describe("Qualiopi", () => {
    test("Should display Qualiopi", async ({ page }) => {
      await goto(page, "/labels-certificats/356000000");
      await expect(
        page.getByText("Organisme de formation").first()
      ).toBeVisible();
      await expect(page.getByText("certifiée Qualiopi").first()).toBeVisible();
      await expect(
        page.getByText("Numéro Déclaration Activité").first()
      ).toBeVisible();
      await expect(page.getByText("11755565775").first()).toBeVisible();
    });
  });
});

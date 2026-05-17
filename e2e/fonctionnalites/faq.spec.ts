import { cy, test } from "../support/test";

test.describe("FAQ contextual links", () => {
  test("Adresse link", () => {
    cy.visit("/etablissement/88087814500015");
    cy.contains("Adresse").click();
    cy.url().should("include", "/faq/modifier-adresse");
  });
  test("Source de données", () => {
    cy.visit("/entreprise/880878145");
    cy.contains("Sources : INSEE").click();
    cy.url().should("include", "/administration/insee_vies");
    cy.contains(
      "Comment rendre mon entreprise individuelle diffusible ou non-diffusible ?"
    ).should("have.length", 1);
  });
});

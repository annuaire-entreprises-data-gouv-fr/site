import routes from "#/clients/routes";
import { cy, test } from "../support/test";

test.describe("Données financières", () => {
  test("Should display Données financières section", () => {
    cy.visit("/entreprise/487444697");
    cy.contains("Données financières");
  });

  test("Should hide bilans when partially confidential", () => {
    cy.intercept("GET", `${routes.donneesFinancieres.ods.search}*`, {
      fixture: "../fixtures/donnees-financieres-confidential.json",
    });
    cy.intercept("GET", `${routes.donneesFinancieres.ods.metadata}*`, {
      fixture: "../fixtures/ods-metadata.json",
    });
    cy.visit("/donnees-financieres/487444697");
    cy.contains(
      "Les bilans de cette structure sont accompagnés d’une déclaration de confidentialité."
    );
  });

  test("Should display indicateurs financiers", () => {
    cy.intercept("GET", `${routes.donneesFinancieres.ods.search}*`, {
      fixture: "../fixtures/donnees-financieres.json",
    });
    cy.intercept("GET", `${routes.donneesFinancieres.ods.metadata}*`, {
      fixture: "../fixtures/ods-metadata.json",
    });
    cy.visit("/donnees-financieres/552032534");
    cy.contains("Date de clôture");
    cy.contains("31/12/2019");

    cy.contains("Résultat net");
    cy.contains("2 Mds €");

    cy.contains("MEF, INPI");
  });

  test("Should display dépôts de compte section (JOAFE)", () => {
    cy.visit("/donnees-financieres/338365059");
    cy.contains(
      /Cette structure possède [\d]+ comptes publiés au Journal Officiel des Associations/
    );
    // Displays compte number
    cy.contains("338365059_31122022");
  });
});

test.describe("Bilans financiers (authenticated)", () => {
  test.beforeEach(() => {
    cy.login();
  });
  test('Should display "Détail des subventions"', () => {
    cy.visit("/donnees-financieres/338365059");
    cy.contains("Subventions reçues").should("be.visible");
    cy.contains("État").should("be.visible");
    cy.contains("Refusé").should("be.visible");
  });
});

import { cy, test } from "../support/test";

test.describe("Rate limiting bilans financiers (authenticated)", () => {
  test.beforeEach(() => {
    cy.login("with-too-many-requests@yopmail.com");
  });
  test('Should display "Détail des subventions"', () => {
    cy.visit("/donnees-financieres/338365059");
    cy.contains("Plafond de consultation atteint").should("be.visible");
  });
});

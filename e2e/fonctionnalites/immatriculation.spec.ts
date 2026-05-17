import { cy, test } from "../support/test";

test.describe("Immatriculation RNE", () => {
  test("Should display immatriculation", () => {
    cy.visit("/entreprise/552032534");
    cy.contains("Immatriculée au RNE");
    cy.contains("01/03/1955");
  });

  test("Should display immatriculation even for non diffusible", () => {
    cy.visit("/entreprise/300025764");
    cy.contains("Immatriculée au RNE");
    cy.contains("Gestion de biens, Libérale non réglementée");
  });

  test("Should display immatriculation even for closed structure", () => {
    cy.visit("/entreprise/880878145");
    cy.contains("Radiée au RNE");
    cy.contains("14/11/2022");
  });

  test("Should display warning when not found in RNE", () => {
    cy.visit("/entreprise/784410607");
    cy.contains("Non trouvée dans le RNE");
  });
});

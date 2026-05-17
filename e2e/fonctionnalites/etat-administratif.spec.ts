import { cy, test } from "../support/test";

test.describe("Etat administratif", () => {
  test("Non diffusible", () => {
    cy.visit("/entreprise/300025764");
    cy.contains("information non-diffusible");
  });

  test("Diffusible", () => {
    cy.visit("/entreprise/356000000");
    cy.contains("en activité").should("have.length", 1);
  });

  test("En sommeil", () => {
    cy.visit("/entreprise/351556394");
    cy.contains("en sommeil").should("have.length", 1);
  });

  test("Cessée", () => {
    cy.visit("/entreprise/839517323");
    cy.contains("cessée").should("have.length", 1);
  });
});

import { cy, test } from "../support/test";

test.describe("Home page’s search bar", () => {
  test("Allow an empty search term", () => {
    cy.visit("/");

    cy.get(".fr-search-bar > button").click();
    cy.url().should("include", "/rechercher");
    cy.contains("Grâce aux filtres de recherche, retrouvez n’importe");
  });

  test('allows to research "Ganymede"', () => {
    cy.visit("/");

    cy.get(".fr-search-bar > input")
      .type("Ganymede")
      .should("have.value", "Ganymede");

    cy.get(".fr-search-bar > button").click();

    // Should be on a new URL which includes '/commands/actions'
    cy.url().should("include", "/rechercher?terme=Ganymede");
    cy.contains("GANYMEDE");
  });
});

test.describe("Header’s search bar", () => {
  test("Tutorial on empty search term", () => {
    cy.visit("/rechercher");
    cy.contains("Grâce aux filtres de recherche,");

    cy.visit("/rechercher?terme=Kikou");

    cy.get(".fr-search-bar > input").clear();

    cy.get(".fr-search-bar > button").click();

    cy.url().should("not.include", "terme");
    cy.contains("Grâce aux filtres de recherche,");
  });

  test("Not enough params", () => {
    cy.visit("/rechercher?terme=df");
    cy.contains("Votre requête ne contient pas assez de paramètres");
  });

  test('allows to research "Ganymede"', () => {
    cy.visit("/rechercher?terme=Ganymede");

    cy.get(".fr-search-bar > input")
      .clear()
      .type("Ganymede")
      .should("have.value", "Ganymede");

    cy.get(".fr-search-bar > button").click();

    // Should be on a new URL which includes '/commands/actions'
    cy.url().should("include", "/rechercher?terme=Ganymede");
  });
});

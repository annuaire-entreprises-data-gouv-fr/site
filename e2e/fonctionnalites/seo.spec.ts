import { cy, test } from "../support/test";

test.describe("SEO Index or noindex", () => {
  const isStaging =
    process.env.PLAYWRIGHT_BASE_URL?.startsWith("https://staging") ?? false;

  // staging is disindexed
  if (isStaging) {
    test("cannot index home page", () => {
      cy.visit("/");
      cy.get('meta[name="robots"][content*="noindex"]').should(
        "have.length",
        1
      );
      cy.get('meta[name="robots"][content*="follow"]').should("have.length", 1);
    });

    test("cannot index entreprise page", () => {
      cy.visit("/entreprise/356000000");
      cy.get('meta[name="robots"][content*="noindex"]').should(
        "have.length",
        1
      );
      cy.get('meta[name="robots"][content*="follow"]').should("have.length", 1);
    });
    return;
  }

  test("can index home page", () => {
    cy.visit("/");
    cy.get('meta[name="robots"][content*="noindex"]').should("have.length", 0);
    cy.get('meta[name="robots"][content*="index"]').should("have.length", 1);
    cy.get('meta[name="robots"][content*="follow"]').should("have.length", 1);
  });

  test("can index entreprise page", () => {
    cy.visit("/entreprise/356000000");
    cy.get('meta[name="robots"][content*="noindex"]').should("have.length", 0);
    cy.get('meta[name="robots"][content*="index"]').should("have.length", 1);
    cy.get('meta[name="robots"][content*="follow"]').should("have.length", 1);
  });

  test("cannot index closed entreprise page", () => {
    cy.visit("/entreprise/839517323");
    cy.get('meta[name="robots"][content*="noindex"]').should("have.length", 1);
    cy.get('meta[name="robots"][content*="follow"]').should("have.length", 1);
  });

  test("cannot index auto entreprise page", () => {
    cy.visit("/entreprise/883010316");
    cy.get('meta[name="robots"][content*="noindex"]').should("have.length", 1);
    cy.get('meta[name="robots"][content*="follow"]').should("have.length", 1);
  });

  test("can index protected siren entreprise page", () => {
    cy.visit("/entreprise/908595879");
    cy.get('meta[name="robots"][content*="noindex"]').should("have.length", 0);
    cy.get('meta[name="robots"][content*="follow"]').should("have.length", 1);
  });
});

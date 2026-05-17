import { cy, expect, test } from "../support/test";

const slug = "la-poste-direction-generale-de-la-poste-356000000";

test.describe("Pagination for single etablissement company", () => {
  test("Load page even with query params", () => {
    cy.request("/entreprise/880878145").then((resp) => {
      expect(resp.status).to.eq(200);
    });
  });

  test("Has no pagination", () => {
    cy.visit("/entreprise/880878145");
    cy.get(".fr-pagination").should("not.exist");
  });
});

test.describe("Pagination for multiple etablissement company", () => {
  test("Has several pages", () => {
    cy.visit(`/entreprise/${slug}`);
    cy.get(".fr-pagination").should("exist");
  });

  test("Has different companies on different pages", () => {
    cy.visit(`/entreprise/${slug}?page=1`);
    let siren1 = "";
    cy.get("#etablissements tbody > tr > td:first-of-type")
      .first()
      .then(async (locator) => {
        siren1 = (await locator.textContent()) ?? "";
      });

    cy.visit(`/entreprise/${slug}?page=6`);
    cy.get("#etablissements tbody > tr > td:first-of-type")
      .first()
      .then(async (locator) => {
        expect(await locator.textContent()).not.toBe(siren1);
      });
  });

  test("Should color n°6 link on page 6", () => {
    cy.visit(`/entreprise/${slug}?page=6`);
    cy.get('.fr-pagination__link[aria-current="page"]').should(
      "have.attr",
      "href",
      "?terme=&page=6#etablissements"
    );
  });

  test("Can click on page 3", () => {
    cy.visit(`/entreprise/${slug}`);
    cy.get('.fr-pagination__link[title="Page 3"]').click();
    cy.url().should("include", "page=3");
  });

  test("Can click on previous", () => {
    cy.visit(`/entreprise/${slug}?page=6`);
    cy.get(".fr-pagination__link--prev").click();
    cy.url().should("include", "page=5");
  });

  test("Can click on next", () => {
    cy.visit(`/entreprise/${slug}?page=6`);
    cy.get(".fr-pagination__link--next").click();
    cy.url().should("include", "page=7");
  });

  // no test on last as max number of pages might evolve
  test("Can click on first", () => {
    cy.visit(`/entreprise/${slug}?page=6`);
    cy.get(".fr-pagination__link--first").click();
    cy.get('.fr-pagination__link[aria-current="page"]').should(
      "have.attr",
      "href",
      "?terme=&page=1#etablissements"
    );
    cy.url().should("not.include", "page");
  });
});

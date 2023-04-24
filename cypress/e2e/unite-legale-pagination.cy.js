import { sirenSiege } from '../../mocks/handlers/search/result-la-poste';

const SIREN = sirenSiege;

describe(`Pagination for single etablissement company`, () => {
  it('Load page even with query params', () => {
    cy.request(`/entreprise/880878145`).then((resp) => {
      expect(resp.status).to.eq(200);
    });
  });

  it('Has no pagination', () => {
    cy.visit(`/entreprise/880878145`);
    cy.get('.fr-pagination').should('not.exist');
  });
});

describe(`Pagination for multiple etablissement company`, () => {
  it('Has several pages', () => {
    cy.visit(`/entreprise/${SIREN}`);
    cy.get('.fr-pagination').should('exist');
  });

  it('Has different companies on different pages', () => {
    cy.visit(`/entreprise/${SIREN}?page=1`);
    const siren1 = cy.get('#etablissements tbody > tr > td:first-of-type');

    cy.visit(`/entreprise/${SIREN}?page=6`);
    const siren2 = cy.get('#etablissements tbody > tr > td:first-of-type');

    cy.expect(siren1).to.not.equal(siren2);
  });

  it('Should color n°6 link on page 6', () => {
    cy.visit(`/entreprise/${SIREN}?page=6`);
    cy.get('.fr-pagination__link[aria-current="page"]').should(
      'have.attr',
      'href',
      '?terme=&page=6#etablissements'
    );
  });

  it('Can click on page 3', () => {
    cy.visit(`/entreprise/${SIREN}`);
    cy.get('.fr-pagination__link[title="Page 3"]').click();
    cy.url().should('include', 'page=3');
  });

  it('Can click on previous', () => {
    cy.visit(`/entreprise/${SIREN}?page=6`);
    cy.get('.fr-pagination__link--prev').click();
    cy.url().should('include', 'page=5');
  });

  it('Can click on next', () => {
    cy.visit(`/entreprise/${SIREN}?page=6`);
    cy.get('.fr-pagination__link--next').click();
    cy.url().should('include', 'page=7');
  });

  // no test on last as max number of pages might evolve
  it('Can click on first', () => {
    cy.visit(`/entreprise/${SIREN}?page=6`);
    cy.get('.fr-pagination__link--first').click();
    cy.url().should('include', 'page=1');
  });
});

const SIREN = 356000000;

describe(`Pagination for single etablissement company`, () => {
  it('Load page even with query params', () => {
    cy.request(`/entreprise/880878145?page=10`).then((resp) => {
      expect(resp.status).to.eq(200);
    });
  });

  it('Has no pagination', () => {
    cy.visit(`/entreprise/880878145?page=10`);
    cy.get('.fr-pagination').should('not.exist');
  });
});

describe(`Pagination for multiple etablissement company`, () => {
  it('Has several pages', () => {
    cy.visit(`/entreprise/356000000`);
    cy.get('.fr-pagination').should('exist');
  });

  it('Has different companies on different pages', () => {
    cy.visit(`/entreprise/356000000?page=1`);
    const siren1 = cy.get('#etablissements tbody > tr > td:first-of-type');

    cy.visit(`/entreprise/356000000?page=6`);
    const siren2 = cy.get('#etablissements tbody > tr > td:first-of-type');

    cy.expect(siren1).to.not.equal(siren2);
  });

  it('Should color n°6 link on page 6', () => {
    cy.visit(`/entreprise/356000000?page=6`);
    cy.get('.fr-pagination__link[aria-current="page"]').should(
      'have.attr',
      'href',
      '?terme=&page=6#etablissements'
    );
  });

  it('Can click on page 3', () => {
    cy.visit(`/entreprise/356000000`);
    cy.get('.fr-pagination__link[title="Page 3"]').click();
    cy.url().should('include', 'page=3');
  });

  it('Can click on previous', () => {
    cy.visit(`/entreprise/356000000?page=6`);
    cy.get('.fr-pagination__link--prev').click();
    cy.url().should('include', 'page=5');
  });

  it('Can click on next', () => {
    cy.visit(`/entreprise/356000000?page=6`);
    cy.get('.fr-pagination__link--next').click();
    cy.url().should('include', 'page=7');
  });

  // no test on last as max number of pages might evolve
  it('Can click on first', () => {
    cy.visit(`/entreprise/356000000?page=6`);
    cy.get('.fr-pagination__link--first').click();
    cy.url().should('include', 'page=1');
  });
});

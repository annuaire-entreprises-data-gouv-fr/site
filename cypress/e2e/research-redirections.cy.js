describe('Siren / Siret redirections', () => {
  it('Formatted siren/siret redirection', () => {
    cy.visit('/');

    cy.get('.fr-search-bar > input')
      .type('123456789')
      .should('have.value', '123456789');

    cy.get('.fr-search-bar > button').click();

    cy.url().should('include', '/entreprise/123456789');
  });

  it('Unformatted siren redirection', () => {
    cy.visit('/');

    cy.get('.fr-search-bar > input')
      .type('123 456 789')
      .should('have.value', '123 456 789');

    cy.get('.fr-search-bar > button').click();

    cy.url().should('include', '/entreprise/123456789');
  });

  it('Unformatted siret redirection', () => {
    cy.visit('/');

    cy.get('.fr-search-bar > input')
      .type('123 456 789 0 0003')
      .should('have.value', '123 456 789 0 0003');

    cy.get('.fr-search-bar > button').click();

    cy.url().should('include', '/etablissement/12345678900003');
  });

  it('Entreprise/etablissement page redirection', () => {
    cy.visit('/entreprise/48744469700428');
    cy.url().should('include', '/etablissement/48744469700428');

    cy.visit('/etablissement/487444697');
    cy.url().should('include', '/entreprise/487444697');
  });
});

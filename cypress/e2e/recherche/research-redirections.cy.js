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

  it('Not found redirection', () => {
    cy.visit('/');

    cy.get('.fr-search-bar > input')
      .type('123 456 789 00003')
      .should('have.value', '123 456 789 00003');

    cy.get('.fr-search-bar > button').click();

    cy.url().should('include', '/erreur/introuvable/12345678900003');
  });

  it('Unformatted siret redirection', () => {
    cy.visit('/');

    cy.get('.fr-search-bar > input')
      .type('487 444 697 00428')
      .should('have.value', '487 444 697 00428');

    cy.get('.fr-search-bar > button').click();

    cy.url().should('include', '/etablissement/48744469700428');
  });

  it('Entreprise/etablissement page redirection', () => {
    cy.visit('/entreprise/48744469700428');
    cy.url().should('include', '/etablissement/48744469700428');

    cy.visit('/etablissement/487444697');
    cy.url().should('include', '/entreprise/487444697');
  });

  it('Allow search request with 9 or plus digits', () => {
    cy.visit(
      '/rechercher?terme=&cp_dep_label=&cp_dep_type=&cp_dep=&fn=&n=&dmin=&dmax=&type=&label=&ca_min=100000000&etat=&sap=&naf=&nature_juridique=&tranche_effectif_salarie=&categorie_entreprise='
    );
    cy.url().should('include', '/rechercher?terme=');
  });
});

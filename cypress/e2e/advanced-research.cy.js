const path = '/rechercher';

describe('Home page', () => {
  it('Open advanced filters', () => {
    cy.visit('/');

    cy.contains('Dirigeant').should('not.be.visible');
    cy.contains('Afficher les filtres').click();
    cy.contains('Dirigeant').should('be.visible');
    cy.contains('Cacher les filtres de recherche').should('be.visible');

    cy.contains('Zone géographique').click({ force: true });
    cy.get('#search-localisation-input').type(35000);
    cy.contains('Appliquer').click();

    cy.url().should('include', '/rechercher?terme=&cp_dep=35000');
  });
});

describe('Dirigeants and Elus search', () => {
  it('Search an élu with dirigeants filters', () => {
    cy.visit('/rechercher?terme=&fn=anne&n=hidalgo');

    cy.contains('36 RUE DES PIPISRELLES').should('be.visible');
    cy.contains('METROPOLE DU GRAND PARIS (MGP)').should('be.visible');
  });

  it('Search a dirigeant with main search bar', () => {
    cy.visit('/rechercher?terme=xavier+jouppe');
    cy.contains('SCI DE LASLAUDIE').should('be.visible');
    cy.contains('Bernard JOUPPE').should('be.visible');
  });
});

describe('Advanced search on page ' + path, () => {
  it('Shows filters', () => {
    cy.visit(path + '?terme=Ganymede');

    cy.contains('Zone géographique').click({ force: true });
    cy.contains('Code postal').should('be.visible');
    cy.contains('Zone géographique').click({ force: true });
    cy.contains('Code postal').should('not.be.visible');

    cy.contains('Dirigeant').click({ force: true });
    cy.contains(
      'Rechercher toutes les structures liées à une personne (dirigeant(e), ou élu(e))'
    ).should('be.visible');

    cy.contains('Situation administrative').click({ force: true });
    cy.contains('Domaine d’activité').should('be.visible');
  });

  it('Geo filter works', () => {
    cy.visit(path + '?terme=Ganymede');

    cy.contains('Zone géographique').click({ force: true });
    cy.get('#search-localisation-input').type(35000);
    cy.contains('Appliquer').click();

    cy.url().should('include', '/rechercher?terme=Ganymede&cp_dep=35000');
  });

  it('shows filters', () => {
    cy.visit(path + '?terme=Ganymede');

    cy.contains('Zone géographique').click({ force: true });
    cy.contains('Code postal').should('be.visible');
    cy.contains('Zone géographique').click({ force: true });
    cy.contains('Code postal').should('not.be.visible');

    cy.contains('Dirigeant').click({ force: true });
    cy.contains(
      'Rechercher toutes les structures liées à une personne (dirigeant(e), ou élu(e))'
    ).should('be.visible');

    cy.contains('Situation administrative').click({ force: true });
    cy.contains('Domaine d’activité').should('be.visible');
  });

  it('filters works', () => {
    cy.visit(path + '?terme=Ganymede&cp_dep=75008&sap=J');
    cy.get('.results-list').should('have.length', 1);

    cy.visit(path + '?terme=Ganymede&cp_dep=35000&sap=J');
    cy.get('.results-list').should('have.length', 0);
  });

  it('Filters propagate on pagination', () => {
    cy.visit(path + '?terme=la+poste&cp_dep=&sap=A');
    cy.get('.fr-pagination').should('exist');
    cy.get('.fr-pagination__link[title="Page 3"]').click();
    cy.url().should('include', 'sap=A');
  });
});

describe('Minimum search conditions', () => {
  it('No results if term < 3 and no filters', () => {
    cy.visit('/rechercher?terme=ga');
    cy.contains('ne contient pas assez de paramètres').should('have.length', 1);
  });

  it('Results if term >= 3 and no filters', () => {
    cy.visit('/rechercher?terme=aga');
    cy.contains('ne contient pas assez de paramètres').should('have.length', 0);
  });

  it('Results if term < 3 and filters', () => {
    cy.visit('/rechercher?terme=ag&cp_dep=35000');
    cy.contains('ne contient pas assez de paramètres').should('have.length', 0);
  });
});

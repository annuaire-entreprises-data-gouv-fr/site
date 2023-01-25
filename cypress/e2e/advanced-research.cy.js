const path = '/rechercher';

describe('Home page', () => {
  it('Open advanced search page', () => {
    cy.visit('/');
    cy.contains('recherche avancée').click();
    cy.contains('Zone géographique').click();
    cy.get(`input[name="cp_dep_label"]`).type('Nice');
    cy.contains('Nice (06000)').click();
    cy.contains('Appliquer').click();
    cy.location().should((loc) => {
      expect(loc.search).includes(`cp_dep=06000`);
    });
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

    cy.contains('Zone géographique').click();
    cy.contains('Code postal').should('be.visible');
    cy.contains('Zone géographique').click();
    cy.contains('Code postal').should('not.be.visible');

    cy.contains('Dirigeant').click();
    cy.contains(
      'Rechercher toutes les structures liées à une personne (dirigeant(e), ou élu(e))'
    ).should('be.visible');

    cy.contains('Situation administrative').click();
    cy.contains('Domaine d’activité').should('be.visible');
    cy.contains('Etat administratif').should('be.visible');
  });

  it('filters works', () => {
    cy.visit(path + '?terme=Ganymede&cp_dep=75008&sap=J');
    cy.get('.results-list').should('have.length', 1);

    cy.visit(path + '?terme=Ganymede&cp_dep=35000&sap=J');
    cy.get('.results-list').should('have.length', 0);
  });

  it('Etat administratif filters', () => {
    cy.visit(path + '?terme=ganymede&cp_dep=&fn=&n=jouppe&etat=C');
    cy.get('.results-list').should('have.length', 1);

    cy.visit(path + '?terme=ganymede&cp_dep=&fn=&n=jouppe&etat=A');
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

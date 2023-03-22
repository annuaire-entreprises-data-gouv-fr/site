const { communesMock } = require('../mocks/geo');
const {
  dirigentFilterMock,
  mainSearchMock,
  searchOneResultMock,
  searchNoResultMock,
  searchResultsMock,
} = require('../mocks/search');

const path = '/rechercher';

// Request URL to mock
const url = 'https://recherche-entreprises.api.gouv.fr/search';

describe('Search page', () => {
  it('Open advanced search page', () => {
    cy.task('msw:set:handlers', [
      {
        url: 'https://geo.api.gouv.fr/departements',
        payload: [],
      },
      {
        url: 'https://geo.api.gouv.fr/communes',
        payload: communesMock,
      },
      {
        url,
        payload: searchOneResultMock,
      },
    ]);
    cy.visit('/');
    cy.contains('recherche avancée').click();
    cy.contains('Zone géographique').click();
    cy.get('#geo-search-input').type('Nice');
    cy.contains('Nice (06000)').click();
    cy.contains('Appliquer').click();
    cy.location().should((loc) => {
      expect(loc.search).includes(`cp_dep=06000`);
    });
  });
});

describe('Dirigeants and Elus search', () => {
  it('Search an élu with dirigeants filters', () => {
    cy.task('msw:set:handlers', [
      {
        url,
        payload: dirigentFilterMock,
      },
    ]);
    cy.visit('/rechercher?terme=&fn=anne&n=hidalgo');
    cy.contains('36 RUE DES PIPISRELLES').should('be.visible');
    cy.contains('METROPOLE DU GRAND PARIS (MGP)').should('be.visible');
  });

  it('Search a dirigeant with main search bar', () => {
    cy.task('msw:set:handlers', [
      {
        url,
        payload: mainSearchMock,
      },
    ]);
    cy.visit('/rechercher?terme=anne+hidalgo');
    cy.contains('36 RUE DES PIPISRELLES').should('be.visible');
    cy.contains('METROPOLE DU GRAND PARIS (MGP)').should('not.exist');
  });
});

describe('Advanced search on page ' + path, () => {
  it('Shows filters', () => {
    cy.task('msw:set:handlers', [
      {
        url,
        payload: mainSearchMock,
      },
    ]);
    cy.visit(path + '?terme=anne+hidalgo');
    cy.contains('Zone géographique').click();
    cy.contains('Ville ou département').should('be.visible');
    cy.contains('Zone géographique').click();
    cy.contains('Ville ou département').should('not.be.visible');

    cy.contains('Dirigeant').click();
    cy.contains(
      'Rechercher toutes les structures liées à une personne (dirigeant(e), ou élu(e))'
    ).should('be.visible');
    cy.contains('Situation administrative').click();
    cy.contains('Domaine d’activité').should('be.visible');
    cy.contains('Etat administratif').should('be.visible');
  });

  it('filters works', () => {
    cy.task('msw:set:handlers', [
      {
        url,
        payload: searchOneResultMock,
      },
    ]);
    cy.visit(path + '?terme=Ganymede&cp_dep=75008&cp_dep_type=cp&sap=J');
    cy.get('.results-list').should('have.length', 1);
    cy.task('msw:set:handlers', [
      {
        url,
        payload: searchNoResultMock,
      },
    ]);
    cy.visit(path + '?terme=Ganymede&cp_dep=35000&cp_dep_type=cp&sap=J');
    cy.get('.results-list').should('have.length', 0);
    cy.task('msw:set:handlers', [
      {
        url,
        payload: searchNoResultMock,
      },
    ]);
    cy.visit(
      path +
        '?terme=Ganymede&cp_dep=35000&cp_dep_label=Rennes+(35000)&cp_dep_type=cp&sap=J'
    );
    cy.contains('Rennes (35000)').should('be.visible');
  });

  it('Etat administratif filters', () => {
    cy.task('msw:set:handlers', [
      {
        url,
        payload: searchOneResultMock,
      },
    ]);
    cy.visit(path + '?terme=ganymede&cp_dep=&fn=&n=jouppe&etat=C');
    cy.get('.results-list').should('have.length', 1);
    cy.task('msw:set:handlers', [
      {
        url,
        payload: searchNoResultMock,
      },
    ]);
    cy.visit(path + '?terme=ganymede&cp_dep=&fn=&n=jouppe&etat=A');
    cy.get('.results-list').should('have.length', 0);
  });

  it('Filters propagate on pagination', () => {
    cy.task('msw:set:handlers', [
      {
        url,
        payload: searchResultsMock,
        persist: true,
      },
    ]);
    cy.visit(path + '?terme=la+poste&cp_dep=&sap=A');
    cy.get('.fr-pagination').should('exist');
    cy.get('.fr-pagination__link[title="Page 3"]').click();
    cy.url().should('include', 'sap=A');
  });

  it('Structure filters', () => {
    cy.visit(path + '?terme=');
    cy.task('msw:set:handlers', [
      {
        url,
        payload: {
          ...searchOneResultMock,
          results: [
            {
              ...searchOneResultMock.results[0],
              nom_complet: 'LE MURETAIN AGGLO',
            },
          ],
        },
      },
    ]);
    cy.contains('Structure').click();
    cy.contains('Labels et certificats').should('be.visible');
    cy.contains('Collectivité').click();
    cy.contains('RGE - ').click();
    cy.contains('Appliquer').click({ force: true });
    cy.contains('LE MURETAIN AGGLO').should('be.visible');
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
    cy.visit('/rechercher?terme=ag&cp_dep=35000&cp_dep_type=cp');
    cy.contains('ne contient pas assez de paramètres').should('have.length', 0);
  });
});

describe('Home page’s search bar', () => {
  it('needs a search term', () => {
    cy.visit('/');

    cy.get('.fr-search-bar > button').click();
    cy.get('input:invalid').should('have.length', 1);
  });

  it('allows to research "Ganymede"', () => {
    cy.visit('/');

    cy.get('.fr-search-bar > input')
      .type('Ganymede')
      .should('have.value', 'Ganymede');

    cy.get('.fr-search-bar > button').click();

    // Should be on a new URL which includes '/commands/actions'
    cy.url().should('include', '/rechercher?terme=Ganymede');
  });
});

describe('Header’s search bar', () => {
  it('needs a search term', () => {
    cy.visit('/rechercher?terme=Kikou');

    cy.get('.fr-search-bar > input').clear().should('have.value', '');

    cy.get('.fr-search-bar > button').click();
    cy.get('input:invalid').should('have.length', 1);
  });

  it('allows to research "Ganymede"', () => {
    cy.visit('/rechercher?terme=Ganymede');

    cy.get('.fr-search-bar > input')
      .clear()
      .type('Ganymede')
      .should('have.value', 'Ganymede');

    cy.get('.fr-search-bar > button').click();

    // Should be on a new URL which includes '/commands/actions'
    cy.url().should('include', '/rechercher?terme=Ganymede');
  });
});

describe('Search results', () => {
  it('shows results for "Ganymede"', () => {
    cy.visit('/rechercher?terme=Ganymede');

    cy.get('.results-list').should('have.length', 1);
  });

  it('shows no results for "Rififi the mighty rifter"', () => {
    cy.visit('/rechercher?terme=Rififi+the+mighty+rifter');

    cy.contains('Aucune entité n’a été trouvée').should('have.length', 1);
  });
});

describe('Redirect to siret or siren', () => {
  it('redirects siren', () => {
    cy.visit('/rechercher?terme=880878145');
    cy.url().should('include', '/entreprise/880878145');
  });
  it('redirects siret', () => {
    cy.visit('/rechercher?terme=88087814500015');
    cy.url().should('include', '/entreprise/88087814500015');
  });
});

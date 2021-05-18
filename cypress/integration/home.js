describe('Home page', () => {
  it('successfully loads', () => {
    cy.visit('/');
  });

  it('displays FAQ button', () => {
    cy.visit('/');
    cy.get('.question-bottom-right > a').click();

    // Should be on a new URL which includes '/commands/actions'
    cy.url().should('include', '/faq');
  });

  it('displays "À propos" button', () => {
    cy.visit('/');

    cy.contains('À propos').click();

    // Should be on a new URL which includes '/commands/actions'
    cy.url().should('include', '/comment-ca-marche');
  });
});

describe('Home page search', () => {
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

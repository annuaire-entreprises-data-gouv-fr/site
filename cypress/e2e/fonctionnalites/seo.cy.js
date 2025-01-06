describe('SEO Index or noindex', () => {
  const isStaging = Cypress.config('baseUrl').indexOf('https://staging') === 0;

  // staging is disindexed
  if (isStaging) {
    it('cannot index home page', () => {
      cy.visit('/');
      cy.get('meta[name="robots"][content*="noindex"]').should(
        'have.length',
        1
      );
      cy.get('meta[name="robots"][content*="follow"]').should('have.length', 1);
    });

    it('cannot index entreprise page', () => {
      cy.visit(`/entreprise/356000000`);
      cy.get('meta[name="robots"][content*="noindex"]').should(
        'have.length',
        1
      );
      cy.get('meta[name="robots"][content*="follow"]').should('have.length', 1);
    });
    return;
  }

  it('can index home page', () => {
    cy.visit('/');
    cy.get('meta[name="robots"][content*="noindex"]').should('have.length', 0);
    cy.get('meta[name="robots"][content*="index"]').should('have.length', 1);
    cy.get('meta[name="robots"][content*="follow"]').should('have.length', 1);
  });

  it('can index entreprise page', () => {
    cy.visit(`/entreprise/356000000`);
    cy.get('meta[name="robots"][content*="noindex"]').should('have.length', 0);
    cy.get('meta[name="robots"][content*="index"]').should('have.length', 1);
    cy.get('meta[name="robots"][content*="follow"]').should('have.length', 1);
  });

  it('cannot index closed entreprise page', () => {
    cy.visit(`/entreprise/839517323`);
    cy.get('meta[name="robots"][content*="noindex"]').should('have.length', 1);
    cy.get('meta[name="robots"][content*="follow"]').should('have.length', 1);
  });

  it('cannot index auto entreprise page', () => {
    cy.visit(`/entreprise/883010316`);
    cy.get('meta[name="robots"][content*="noindex"]').should('have.length', 1);
    cy.get('meta[name="robots"][content*="follow"]').should('have.length', 1);
  });

  it('cannot index protected siren entreprise page', () => {
    cy.visit(`/entreprise/908595879`);
    cy.get('meta[name="robots"][content*="noindex"]').should('have.length', 1);
    cy.get('meta[name="robots"][content*="follow"]').should('have.length', 1);
  });
});

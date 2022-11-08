describe('SEO Index or noindex', () => {
  it('can index home page', () => {
    cy.visit('/');
    cy.get('meta[name="robots"][content*="noindex"]').should('have.length', 0);
    cy.get('meta[name="robots"][content*="index"]').should('have.length', 1);
    cy.get('meta[name="robots"][content*="follow"]').should('have.length', 1);
  });

  it('can index entreprise page', () => {
    cy.visit('/entreprise/880878145');
    cy.get('meta[name="robots"][content*="noindex"]').should('have.length', 0);
    cy.get('meta[name="robots"][content*="index"]').should('have.length', 1);
    cy.get('meta[name="robots"][content*="follow"]').should('have.length', 1);
  });

  it('cannot index justificatif page', () => {
    cy.visit('/justificatif/880878145');
    cy.get('meta[name="robots"][content*="noindex"]').should('have.length', 1);
    cy.get('meta[name="robots"][content*="follow"]').should('have.length', 1);
  });

  it('cannot index closed entreprise page', () => {
    cy.visit('/entreprise/829299171');
    cy.get('meta[name="robots"][content*="noindex"]').should('have.length', 1);
    cy.get('meta[name="robots"][content*="follow"]').should('have.length', 1);
  });

  it('cannot index auto entreprise page', () => {
    cy.visit('/entreprise/883010316');
    cy.get('meta[name="robots"][content*="noindex"]').should('have.length', 1);
    cy.get('meta[name="robots"][content*="follow"]').should('have.length', 1);
  });

  it('cannot index protected siren entreprise page', () => {
    cy.visit('/entreprise/907839872');
    cy.get('meta[name="robots"][content*="noindex"]').should('have.length', 1);
    cy.get('meta[name="robots"][content*="follow"]').should('have.length', 1);
  });
});

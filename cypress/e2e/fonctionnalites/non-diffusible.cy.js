describe('Non-diffusible', () => {
  it('Should be non diffusible', () => {
    cy.visit(`/entreprise/300025764`);
    cy.contains('ne sont pas publiquement').should('have.length', 1);
  });

  it('Should be diffusible', () => {
    cy.visit(`/entreprise/880878145`);
    cy.contains('ne sont pas publiquement').should('have.length', 0);
  });

  it('No dirigeant in partial diffusible (protected)', () => {
    cy.visit(`/dirigeants/908595879`);
    cy.contains('Données privées').should('have.length', 1);
  });
});

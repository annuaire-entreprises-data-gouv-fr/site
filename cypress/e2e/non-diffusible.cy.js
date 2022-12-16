describe('Non-diffusible', () => {
  // pass failing test as Insee is very instable in CI
  xit('Should be non diffusible"', () => {
    cy.visit('/entreprise/300025764');
    cy.contains('ne sont pas publiques').should('have.length', 1);
  });

  it('Should be diffusible', () => {
    cy.visit('/entreprise/880878145');
    cy.contains('ne sont pas publiques').should('have.length', 0);
  });
});

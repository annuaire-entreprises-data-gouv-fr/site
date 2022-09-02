describe('TVA validation', () => {
  it('880878145 is valid', () => {
    cy.visit('/entreprise/880878145');
    cy.contains('FR09880878145').should('have.length', 1);
  });
});

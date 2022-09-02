describe('TVA validation', () => {
  it('880878145 is valid', () => {
    cy.visit('/entreprise/880878145');
    cy.contains('FR09 880 878 145').should('have.length', 1);
  });
});

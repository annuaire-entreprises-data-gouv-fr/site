describe('TVA validation', () => {
  it.skip('552032534 is valid', () => {
    cy.visit('/entreprise/552032534');
    cy.contains('FR27 552 032 534').should('have.length', 1);
  });
});

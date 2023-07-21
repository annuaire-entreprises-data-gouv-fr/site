describe('TVA validation', () => {
  it(`should display the TVA number`, () => {
    cy.visit(`/entreprise/528163777`);
    cy.contains('FR29 528 163 777').should('have.length', 1);
  });
});

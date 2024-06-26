describe('Etat administratif', () => {
  it('Non diffusible', () => {
    cy.visit(`/entreprise/300025764`);
    cy.contains('information non-diffusible');
  });

  it('Diffusible', () => {
    cy.visit(`/entreprise/356000000`);
    cy.contains('en activité').should('have.length', 1);
  });

  it('En sommeil', () => {
    cy.visit(`/entreprise/351556394`);
    cy.contains('en sommeil').should('have.length', 1);
  });

  it('Cessée', () => {
    cy.visit(`/entreprise/839517323`);
    cy.contains('cessée').should('have.length', 1);
  });
});

describe('Etat administratif', () => {
  // pass failing test as Insee is very instable in CI
  xit('Non diffusible"', () => {
    cy.visit('/entreprise/300242492');
    cy.contains('état inconnu (non-diffusible)').should('have.length', 1);
  });

  it('Diffusible', () => {
    cy.visit('/entreprise/552032534');
    cy.contains('en activité').should('have.length', 1);
  });

  it('En sommeil', () => {
    cy.visit('/entreprise/351556394');
    cy.contains('en sommeil').should('have.length', 1);
  });

  it('Cessée', () => {
    cy.visit('/entreprise/839517323');
    cy.contains('cessée').should('have.length', 1);
  });
});

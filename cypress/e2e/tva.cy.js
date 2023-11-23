describe('TVA validation', () => {
  it(`should display the TVA number`, () => {
    cy.visit(`/entreprise/528163777`);
    cy.contains('FR29 528 163 777').should('have.length', 1);
  });
});
it('TVA Non-assujettie', () => {
  cy.visit(`/entreprise/883010316`).then(() => {
    cy.contains('Non-assujetti à la TVA');
  });
  cy.visit(`/entreprise/423208180`).then(() => {
    cy.contains('Non-assujetti à la TVA');
  });
});
it('TVA link', () => {
  cy.visit(`/entreprise/383657467`).then(() => {
    cy.contains('Que signifie “inconnu ou non-assujettie à la TVA” ?').click({
      force: true,
    });
    cy.url().should('include', '/definitions/tva-intracommunautaire');
  });
  cy.visit(`/entreprise/217500016`).then(() => {
    cy.contains(
      'Elle possède un numéro de TVA Intracommunautaire pour chacune de ces activités.'
    );
  });
});

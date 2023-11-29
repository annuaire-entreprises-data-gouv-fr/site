describe('TVA validation', () => {
  it(`should display the TVA number`, () => {
    cy.visit(`/entreprise/842019051`);
    cy.contains('FR43 842 019 051').should('have.length', 1);
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
      cy.contains('FR72217500016').should('have.length', 1);
    });
  });
});

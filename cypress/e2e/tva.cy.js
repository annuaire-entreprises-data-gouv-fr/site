describe('TVA validation', () => {
  it(`should display the TVA number`, () => {
    cy.visit(`/entreprise/842019051`);
    cy.contains('FR43 842 019 051').should('have.length', 1);
  });
});
it('TVA Non-assujettie', () => {
  //  invalid number and no activity
  cy.visit(`/entreprise/198100125`).then(() => {
    cy.contains('Non-assujetti à la TVA');
  });
  // closed company
  cy.visit(`/entreprise/839517323`).then(() => {
    cy.contains('Non-assujetti à la TVA');
  });
});
it('TVA link', () => {
  cy.visit(`/entreprise/300025764`).then(() => {
    cy.contains('Que signifie “inconnu ou non-assujettie à la TVA” ?').click({
      force: true,
    });
    cy.url().should('include', '/definitions/tva-intracommunautaire');
  });
  cy.visit(`/entreprise/552032534`).then(() => {
    cy.contains('FR27 552 032 534').should('have.length', 1);
  });
});

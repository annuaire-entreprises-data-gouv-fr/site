describe('Rate limiting bilans financiers (authenticated)', () => {
  beforeEach(() => {
    cy.login('with-too-many-requests@yopmail.com');
  });
  it('Should display "Détail des subventions"', () => {
    cy.visit('/donnees-financieres/338365059');
    cy.contains('Détail des subventions').should('be.visible');
    cy.contains('Trop de requêtes').should('be.visible');
  });
});

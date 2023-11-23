describe(`FAQ contextual links`, () => {
  it('Adresse link', () => {
    cy.visit(`/etablissement/88087814500015`).then((resp) => {
      cy.contains('Comment modifier une adresse ?').click({ force: true });
      cy.url().should('include', '/faq/modifier-adresse');
    });
  });
  it('Source de données', () => {
    cy.visit(`/entreprise/880878145`).then((resp) => {
      cy.contains('Sources : Insee').click();
      cy.url().should('include', '/administration/insee_vies');
      cy.contains(
        'Comment rendre mon entreprise individuelle diffusible ou non-diffusible ?'
      ).should('have.length', 1);
    });
  });
});

describe(`FAQ contextual links`, () => {
  it('Adresse link', () => {
    cy.visit(`/etablissement/88087814500015`);
    const link = cy.contains('Adresse').focus();
    cy.contains('Comment modifier une adresse ?');
    link.click();
    cy.url().should('include', '/faq/modifier-adresse');
  });
  it('Source de données', () => {
    cy.visit(`/entreprise/880878145`);
    cy.contains('Sources : Insee').click();
    cy.url().should('include', '/administration/insee_vies');
    cy.contains(
      'Comment rendre mon entreprise individuelle diffusible ou non-diffusible ?'
    ).should('have.length', 1);
  });
});

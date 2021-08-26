const siret = ['414847962'];

siret.forEach((siren) => {
  describe('Non-diffusible', () => {
    it('Should be non diffusible"', () => {
      cy.visit('/entreprise/' + siren);
      cy.contains('ne sont pas publiques').should('have.length', 1);
    });
  });

  it('Should be diffusible', () => {
    cy.visit('/entreprise/880878145');
    cy.contains('ne sont pas publiques').should('have.length', 0);
  });
});

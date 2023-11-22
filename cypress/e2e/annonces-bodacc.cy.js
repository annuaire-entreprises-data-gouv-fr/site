describe('Annonces BODACC', () => {
  it('Should display Annonces BODACC section', () => {
    cy.visit('/annonces/880878145');
    cy.contains('Annonces BODACC');
  });
  it('Should display publication', () => {
    cy.visit('/annonces/880878145');
    cy.contains('Publication');
    cy.contains('23/11/2022');

    cy.contains('N°');
    cy.contains('n° 446');
    cy.contains('Radiations');
    cy.contains(
      'BODACC B n°20220227 publiée au Greffe du Tribunal de Commerce de Paris'
    );
  });
});

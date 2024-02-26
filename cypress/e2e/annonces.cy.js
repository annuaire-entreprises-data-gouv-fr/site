describe('Annonces BODACC', () => {
  it('Should display Annonces BODACC section', () => {
    cy.visit('/annonces/880878145');
    cy.contains('Annonces BODACC');
  });
  it('Should display publication', () => {
    cy.visit('/annonces/880878145');
    cy.contains('Publication');
    cy.contains('23/11/2022');

    cy.contains('Dépôts des comptes 2021');
    cy.contains('n°446');
    cy.contains('Radiations');
    cy.contains('Annonce n°446, BODACC B n°20220227');
  });

  it('Should display JOAFE section for association', () => {
    cy.visit('/annonces/338365059');
    cy.contains(
      /Cette structure possède [\d] annonces publiées au Journal Officiel des Associations/
    );
  });
});

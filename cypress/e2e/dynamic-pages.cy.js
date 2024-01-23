describe(`Dirigeants and élus pages`, () => {
  it('Dirigeant page loads', () => {
    cy.visit(`/dirigeants/528163777`);
    cy.contains('GSE VD').should('be.visible');
  });

  it('Elus page loads', () => {
    cy.visit(`/elus/200054781`);
    cy.contains('Anne HIDALGO').should('be.visible');
  });
});

describe(`Labels and certificates`, () => {
  it('RGE', () => {
    cy.visit(`/entreprise/843701079`);
    cy.contains('Labels et certificats').should('be.visible');
    cy.contains('RGE - Reconnu Garant de l’Environnement').should('be.visible');
  });

  it('ESS et Spectacle vivant', () => {
    cy.visit(`/entreprise/800329849`);
    cy.contains('Qualités, labels et certificats').should('be.visible');
    cy.contains('ESS - Entreprise Sociale et Solidaire').should('be.visible');
    cy.contains('Entrepreneur de spectacles vivants').should('be.visible');
  });

  it('No certificates', () => {
    cy.visit(`/entreprise/880878145`);
    cy.contains('abels et certificats').should('have.length', 0);
  });
});

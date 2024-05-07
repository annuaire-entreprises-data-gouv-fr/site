describe('Protected data are hidden for non-logged users', () => {
  it('Should not display OPQIBI bloc', () => {
    cy.visit(`/labels-certificats/487444697`);
    cy.contains('h2', 'Certificat OPQIBI').should('not.exist');
  });

  it('Should not display QUALIBAT bloc', () => {
    cy.visit(`/labels-certificats/843701079`);
    cy.contains('h2', 'Certificat Qualibat').should('not.exist');
  });

  it('Should not display QUALIFELEC bloc', () => {
    cy.visit(`/labels-certificats/843701079`);
    cy.contains('h2', 'Certificats Qualifelec').should('not.exist');
  });

  it('Should not display immatriculation EORI', () => {
    cy.visit(`/entreprise/356000000`);
    cy.contains('Immatriculation EORI').should('not.exist');
  });

  it('Should not display protected document', () => {
    cy.visit(`/entreprise/356000000`);
    cy.contains('h2', 'Conformité').should('not.exist');
    cy.contains('h2', 'Actes et statuts').should('not.exist');
    cy.contains('h2', 'Carte professionnelle travaux publics').should(
      'not.exist'
    );
  });

  it('Should not display bilans', () => {
    cy.visit(`/donnees-financieres/487444697`);
    cy.contains(
      /Cette entreprise possède [\d]+ bilan\(s\) déposé\(s\) au RNE/
    ).should('not.exist');
  });
});

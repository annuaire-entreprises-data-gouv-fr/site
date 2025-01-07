describe('Documents ESSOR ENERGIES (SOLARSUD)', () => {
  it('Bouton agent connect sur les données protégées', () => {
    cy.visit('/documents/487444697');
    cy.contains('Réservé aux agents publics').should('be.visible');
    cy.contains('button', 'ProConnect').should('be.visible');
  });

  it('[LOGGED] Should display documents', () => {
    cy.login();
    cy.visit('/documents/487444697');
    // Conformité
    cy.contains('Conformité').should('be.visible');
    cy.contains('DGFiP : conforme').should('be.visible');
    cy.contains('URSSAF : conforme').should('be.visible');
    cy.contains('MSA : conforme').should('be.visible');
    // Travaux publics
    cy.contains('Travaux publics').should('be.visible');
    cy.contains(
      'Cette entreprise possède une carte professionnelle d’entrepreneur de travaux publics,'
    ).should('be.visible');
    cy.contains('Cette entreprise possède un certificat CIBTP valide').should(
      'be.visible'
    );
  });
});

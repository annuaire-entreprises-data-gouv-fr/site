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
    cy.contains('Attestations de conformite').should('be.visible');
    cy.contains('Conformité').should('be.visible');
    cy.contains('label', 'Aides publiques').click();
    cy.contains('DGFiP : conforme').should('be.visible');
    cy.contains('URSSAF : conforme').should('be.visible');
    cy.contains('MSA : conforme').should('be.visible');
    // Travaux publics
    cy.contains(
      'Justificatifs et certificats relatifs aux entreprises de travaux publics'
    ).should('be.visible');
    cy.contains('Travaux publics').should('be.visible');
    cy.contains('label', 'Aides publiques').click();
    cy.contains('Carte de travaux publics').should('be.visible');
    cy.contains('FNTP : document disponible').should('be.visible');
    cy.contains('Cotisations congés & chômage').should('be.visible');
    cy.contains('CNETP : document disponible').should('be.visible');
    cy.contains('CIBTP : document disponible').should('be.visible');
    cy.contains('Cotisations retraite').should('be.visible');
    cy.contains('ProBTP : document disponible').should('be.visible');
  });
  it('[LOGGED] Should not display conformite documents but travaux publics documents', () => {
    cy.login(['travaux_publics']);
    cy.visit('/documents/487444697');
    // Conformité
    cy.contains('Attestations de conformite').should('not.exist');
    cy.contains('Conformité').should('not.exist');
    // Travaux publics
    cy.contains(
      'Justificatifs et certificats relatifs aux entreprises de travaux publics'
    ).should('be.visible');
    cy.contains('Travaux publics').should('be.visible');
  });
  it('[LOGGED] Should display conformite documents but not travaux publics documents', () => {
    cy.login(['conformite']);
    cy.visit('/documents/487444697');
    // Conformité
    cy.contains('Attestations de conformite').should('be.visible');
    cy.contains('Conformité').should('be.visible');
    // Travaux publics
    cy.contains(
      'Justificatifs et certificats relatifs aux entreprises de travaux publics'
    ).should('not.exist');
    cy.contains('Travaux publics').should('not.exist');
  });
});

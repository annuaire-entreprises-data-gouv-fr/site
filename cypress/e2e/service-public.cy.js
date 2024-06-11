describe('Service public', () => {
  it('Should display service public', () => {
    cy.visit('/entreprise/130025265');
    cy.contains('Service public');
    cy.contains('Type organisme');
    cy.contains('Administration centrale (ou ministère)');
    cy.contains('fiche de l’Annuaire du service public');
  });
  it('Should display dirigeant information', () => {
    cy.visit('/dirigeants/130025265');
    cy.contains('responsable(s) enregistré(s) auprès de la DILA');
    const table = () => cy.get('#responsables-service-public table');

    table().contains('Role');
    table().contains('Nom');
    table().contains('Nomination');

    // Check that we have at least 5 rows in the table
    table().get('tr').should('have.length.of.at.least', 5);
  });
});

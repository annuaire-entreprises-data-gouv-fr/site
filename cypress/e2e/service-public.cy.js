describe('Service public', () => {
  it('Should display service public', () => {
    cy.visit('/entreprise/130025265');
    cy.contains('Service public');
    cy.contains('Type organisme');
    cy.contains('Administration centrale (ou Ministère)');
    cy.contains(
      'Voir plus d’informations sur la page de l’annuaire service-public.fr'
    );
  });
  it('Should display dirigeant information', () => {
    cy.visit('/dirigeants/130025265');
    cy.contains('Ce service public est dirigé par les personnes suivantes :');
    const table = () => cy.get('#responsables-service-public table');

    table().contains('Role');
    table().contains('Nom');
    table().contains('Nomination');

    // Check that we have at least 5 rows in the table
    table().get('tr').should('have.length.of.at.least', 5);
  });
});

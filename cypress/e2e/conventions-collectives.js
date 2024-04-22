describe('Conventions supprimées', () => {
  it('Should display Inconnues ou supprimées', () => {
    cy.visit('/divers/592052302');
    cy.contains('Inconnues ou supprimées');
    cy.contains('et remplacée par :');
  });

  it('Should work for valid companies', () => {
    cy.visit('/dives/356000000');
    cy.contains("Convention d'entreprise La Poste - France Télécom");
  });
});

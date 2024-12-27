describe('Conventions supprimées', () => {
  it('Should work for valid companies', () => {
    cy.visit('/divers/356000000');
    cy.contains("Convention d'entreprise La Poste - France Télécom");
  });

  // Need an example
  // it('Should display Inconnues ou supprimées', () => {
  //   cy.visit('/divers/592052302');
  //   cy.contains('Inconnues ou supprimées');
  //   cy.contains('et remplacée par :');
  // });
});

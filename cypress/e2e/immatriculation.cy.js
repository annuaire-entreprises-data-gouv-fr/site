describe('Immatriculation RNE', () => {
  // danone
  it('Should display immatriculation', () => {
    cy.visit('/entreprise/552032534');
    cy.contains('Immatriculée au RNE');
    cy.contains('99 ans, jusqu’au 01/03/2054');
  });

  it('Should display immatriculation even for non diffusible', () => {
    cy.visit(`/entreprise/300025764`);
    cy.contains('Immatriculée au RNE');
    cy.contains('Gestion de biens, Libérale non réglementée');
  });

  it('Should display immatriculation even for closed structure', () => {
    cy.visit(`/entreprise/880878145`);
    cy.contains('Radiée au RNE');
    cy.contains('99 ans, jusqu’au 23/01/2119');
  });

  it('Should display warning when not found in RNE', () => {});
  cy.visit(`/entreprise/356000000`);
  cy.contains('Non trouvée dans le RNE');
});

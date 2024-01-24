describe('Bilans financiers', () => {
  it('Should display Donées financières section', () => {
    cy.visit('/entreprise/487444697');
    cy.contains('Données financières');
  });
  it('Should display indicateurs financiers', () => {
    cy.visit('/donnees-financieres/487444697');
    cy.contains('Date de clôture');
    cy.contains('31/12/2019');

    cy.contains('Résultat net');
    cy.contains('-715.6 K €');

    cy.contains('Source : MEF');
  });
});

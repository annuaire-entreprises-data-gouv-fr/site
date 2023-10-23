describe('Bilans financiers', () => {
  it('Should display Donées financières section', () => {
    cy.visit('/entreprise/528163777');
    cy.contains('Données financières');
  });
  it("Should display indicateurs financiers", () => {
    cy.visit('/donnees-financieres/528163777');
    cy.contains('Date de clôture');
    cy.contains('30/09/2021')

    cy.contains('Résultat net');
    cy.contains('66.1 K €');

    cy.contains('Source : MEF')
  });
});

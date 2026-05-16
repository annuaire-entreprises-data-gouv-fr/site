describe("Rate limiting bilans financiers (authenticated)", () => {
  beforeEach(() => {
    cy.login("with-too-many-requests@yopmail.com");
  });
  it('Should display "Détail des subventions"', () => {
    cy.visit("/donnees-financieres/338365059");
    cy.wait(2000);
    cy.scrollTo("bottom");
    cy.contains("Plafond de consultation atteint").should("be.visible");
  });
});

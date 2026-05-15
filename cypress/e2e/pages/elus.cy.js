describe("Élus VILLE DE PARIS", () => {
  it("Should display élus", () => {
    cy.visit("/dirigeants/217500016");
    cy.contains("Élus").should("be.visible");
    cy.contains(
      "Cette collectivité possède 164 élus enregistrés au Répertoire National des Élus :"
    ).should("be.visible");
    cy.contains("Anne HIDALGO").should("be.visible");
  });
});

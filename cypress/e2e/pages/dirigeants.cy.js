describe("Dirigeants ESSOR ENERGIES (SOLARSUD)", () => {
  it("Should display dirigeants from INPI", () => {
    cy.visit("/dirigeants/487444697");
    cy.contains(
      "Cette entreprise possède 2 dirigeants enregistrés au Registre National des Entreprises (RNE) tenu par l’INPI."
    ).should("be.visible");
    cy.contains("David, Jean-Claude POUYANNE, né(e) en octobre 1965").should(
      "be.visible"
    );
  });

  it("[LOGGED] Should display comparison between INPI and IG", () => {
    cy.login();
    cy.visit("/dirigeants/487444697");
    cy.contains(
      "Ces informations proviennent du RNE et sont issues d‘une comparaison entre les données issues de l’INPI et celles d’Infogreffe"
    ).should("be.visible");
    cy.contains(
      "BCRH & ASSOCIES - SOCIETE A RESPONSABILITE LIMITEE A ASSOCIE UNIQUE"
    ).should("be.visible");
    cy.contains("David, Jean-Claude POUYANNE").should("be.visible");
  });
});
describe("Dirigeants non-diffusible ", () => {
  it("Should not display dirigeants", () => {
    cy.visit("/dirigeants/908595879");
    cy.contains("SEVERNAYA").should("be.visible");
    cy.contains("protégé").should("be.visible");
    cy.contains("Dirigeant(s) (données privées)").should("be.visible");
  });
  it("[LOGGED] Should display dirigeants", () => {
    cy.login();
    cy.visit("/dirigeants/908595879");
    cy.contains("Dirigeant(s)").should("be.visible");
    cy.contains(
      "Cette entreprise possède 2 dirigeants enregistrés au Registre National des Entreprises (RNE) tenu par l’INPI."
    ).should("be.visible");
  });
});

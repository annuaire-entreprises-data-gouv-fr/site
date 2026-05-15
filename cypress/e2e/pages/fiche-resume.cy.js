describe("Fiche résumé DANONE", () => {
  it("Should display basic infos", () => {
    cy.visit("/entreprise/danone-552032534");
    cy.contains(
      "Sa forme juridique est SA à conseil d'administration (s.a.i.)."
    ).should("be.visible");
    cy.contains("Informations légales de DANONE").should("be.visible");
    cy.contains(
      "Son siège social est domicilié au 59 RUE LA FAYETTE 75009 PARIS."
    ).should("be.visible");
    // TVA number
    cy.contains("N° TVA Intracommunautaire").should("be.visible");
    cy.contains("FR12 345 678 901").should("be.visible");
    // EORI number
    cy.contains("N° EORI").should("be.visible");
    cy.contains("FR123 456 789 0").should("be.visible");
    // Effectifs
    cy.contains("Effectif salarié").should("be.visible");
    cy.contains("1 000 à 1 999 salariés, en 2023").should("be.visible");
  });
  it("[LOGGED] Should display basic infos", () => {
    cy.login();
    cy.visit("/entreprise/danone-552032534");
    // Effectifs
    cy.contains("Effectif salarié").should("be.visible");
    cy.contains("1 000 à 1 999 salariés, en 2023").should("be.visible");
    // Résumé pour les agents publics
    cy.contains("Résumé pour les agents publics").should("be.visible");
    cy.contains("Documents juridiques").should("be.visible");
    cy.contains("Consulter les Actes et les Statuts constitutifs").should(
      "be.visible"
    );
  });
});

describe("Entreprises non-diffusibles", () => {
  it("Should be non diffusible", () => {
    cy.visit("/entreprise/300025764");
    cy.contains("ne sont pas publiquement").should("have.length", 1);
  });

  it("Should be diffusible", () => {
    cy.visit("/entreprise/880878145");
    cy.contains("ne sont pas publiquement").should("have.length", 0);
  });
});

describe("TVA number special cases", () => {
  it("TVA Non-assujettie", () => {
    cy.visit("/entreprise/883010316").then(() => {
      cy.contains("Pas de n° TVA valide");
    });
    cy.visit("/entreprise/423208180").then(() => {
      cy.contains("Pas de n° TVA valide connu");
    });
  });
});

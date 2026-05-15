describe("Dirigeants and élus pages", () => {
  it("Dirigeant page loads", () => {
    cy.visit("/dirigeants/843701079");
    cy.contains("Details").should("be.visible");
    cy.contains("Lionel, Andre BERTRAND").should("be.visible");
  });

  it("Elus page loads", () => {
    cy.visit("/dirigeants/217500016");
    cy.contains("Anne HIDALGO").should("be.visible");
  });
});

describe("Labels and certificates", () => {
  it("RGE", () => {
    cy.visit("/entreprise/843701079");
    cy.contains("Labels et certificats").should("be.visible");
    cy.contains("RGE - Reconnu Garant de l’Environnement").should("be.visible");
  });

  it("ESS et Spectacle vivant", () => {
    cy.visit("/entreprise/800329849");
    cy.contains("Qualités, labels et certificats").should("be.visible");
    cy.contains("ESS - Économie Sociale et Solidaire").should("be.visible");
    cy.contains("Entrepreneur de spectacles vivants").should("be.visible");
  });

  it("No certificates", () => {
    cy.visit("/entreprise/880878145");
    cy.contains("abels et certificats").should("have.length", 0);
  });
});

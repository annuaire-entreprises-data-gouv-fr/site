describe("Label et certificats", () => {
  describe("QUALIBAT-RGE", () => {
    it("Should display QUALIBAT-RGE", () => {
      cy.visit(`/labels-certificats/843701079`);
      cy.contains("QUALIBAT-RGE").should("be.visible");
      cy.contains("Domaine(s) certifié(s)").should("be.visible");
      cy.contains(
        "Isolation par l'intérieur des murs ou rampants de toitures ou plafonds"
      ).should("be.visible");
      cy.contains(/\d{2} \d{2} \d{2} \d{2} \d{2}/).should("be.visible");
    });
  });
  describe("ESS & Spectacles vivants", () => {
    it("Should display ESS and spectacles vivants", () => {
      cy.visit(`/labels-certificats/800329849`);
      cy.contains("ESS - Économie Sociale et Solidaire").should("be.visible");
      cy.contains(
        "Cette structure apparait dans la liste des entreprises de l’Economie Sociale et Solidaire"
      ).should("be.visible");
      cy.contains("Entrepreneur de spectacles vivants").should("be.visible");
      cy.contains("Numéro de récépissé").should("be.visible");
      cy.contains("PLATESV-R-2021-006658").should("be.visible");
    });
  });
  describe("Professionnel du Bio", () => {
    it("Should display Professionnel du Bio", () => {
      cy.visit(`/labels-certificats/302474648`);
      cy.contains("Professionnel du Bio").should("be.visible");
      cy.contains("Détail établissement").should("be.visible");
      cy.contains("SAS NATURALIA SAINT OUEN PERI").should("be.visible");
    });
  });
  describe("Entreprise Sociale Inclusive", () => {
    it("Should display Entreprise Sociale Inclusive", () => {
      cy.visit(`/labels-certificats/533744991`);
      cy.contains("Entreprise Sociale Inclusive").should("be.visible");
      cy.contains("Type de structure").should("be.visible");
      cy.contains("Entreprise d'insertion (EI)").should("be.visible");
    });
  });
  describe("Egapro", () => {
    it("Should display Égalité professionnelle - Egapro", () => {
      cy.visit(`/labels-certificats/356000000`);
      cy.contains("Égalité professionnelle - Egapro").should("be.visible");
      cy.contains("Femmes parmi les cadres dirigeants").should("be.visible");
      cy.contains("25").should("be.visible");
    });
  });
  describe("Qualiopi", () => {
    it("Should display Qualiopi", () => {
      cy.visit(`/labels-certificats/356000000`);
      cy.contains("Organisme de formation");
      cy.contains("certifiée Qualiopi");
      cy.contains("Numéro Déclaration Activité");
      cy.contains("11755565775");
    });
  });
});

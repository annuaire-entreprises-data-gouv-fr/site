describe("Association", () => {
  it("Should display association data from private api", () => {
    cy.visit("/entreprise/400485504");
    cy.findByRole("heading", { name: "L'ENFANT BLEU", level: 1 }).should(
      "be.visible"
    );
    cy.findByText("Répertoire National des Associations").should("be.visible");

    cy.get("#association-section")
      .findAllByRole("row")
      .filter(':contains("N°RNA")')
      .within(() => {
        cy.findAllByRole("cell")
          .last()
          .within(() => {
            cy.findByRole("button", {
              name: /W751 092 330/,
            }).should("be.visible");
          });
      });
    cy.get("#association-section")
      .findAllByRole("row")
      .filter(':contains("Nom")')
      .within(() => {
        cy.findAllByRole("cell")
          .last()
          .within(() => {
            cy.findByRole("button", {
              name: /ASSOCIATION L'ENFANT BLEU ENFANCE MALTRAITEE/,
            }).should("be.visible");
          });
      });
    cy.get("#association-section")
      .findAllByRole("row")
      .filter(':contains("Regime")')
      .within(() => {
        cy.findAllByRole("cell")
          .last()
          .within(() => {
            cy.findByRole("button", {
              name: /loi1901/,
            }).should("be.visible");
          });
      });
    cy.get("#association-section")
      .findAllByRole("row")
      .filter(':contains("Adresse du siège")')
      .within(() => {
        cy.findAllByRole("cell")
          .last()
          .within(() => {
            cy.findByRole("button", {
              name: /18 RUE HOCHE, 92130 ISSY-LES-MOULINEAUX/,
            }).should("be.visible");
          });
      });
  });

  it("Should fallback and display association data from public api when private api is not available", () => {
    cy.visit("/entreprise/400461356");
    cy.findByRole("heading", {
      name: "LES RESTAURANTS DU COEUR",
      level: 1,
    }).should("be.visible");
    cy.findByText("Répertoire National des Associations").should("be.visible");

    cy.get("#association-section")
      .findAllByRole("row")
      .filter(':contains("N°RNA")')
      .within(() => {
        cy.findAllByRole("cell")
          .last()
          .within(() => {
            cy.findByRole("button", {
              name: /W491 004 193/,
            }).should("be.visible");
          });
      });
    cy.get("#association-section")
      .findAllByRole("row")
      .filter(':contains("Nom")')
      .within(() => {
        cy.findAllByRole("cell")
          .last()
          .within(() => {
            cy.findByRole("button", {
              name: /LES RESTAURANTS DU COEUR DE MAINE ET LOIRE/,
            }).should("be.visible");
          });
      });
    cy.get("#association-section")
      .findAllByRole("row")
      .filter(':contains("Regime")')
      .within(() => {
        cy.findAllByRole("cell")
          .last()
          .within(() => {
            cy.findByRole("button", {
              name: /loi1901/,
            }).should("be.visible");
          });
      });
    cy.get("#association-section")
      .findAllByRole("row")
      .filter(':contains("Adresse du siège")')
      .within(() => {
        cy.findAllByRole("cell")
          .last()
          .within(() => {
            cy.findByRole("button", {
              name: /10 SQUARE DUMONT D'URVILLE, 49000 ANGERS/,
            }).should("be.visible");
          });
      });
  });
});

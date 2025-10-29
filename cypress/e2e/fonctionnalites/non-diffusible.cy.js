describe("Non-diffusible", () => {
  it("Non diffusible EI should have no name and address", () => {
    cy.visit("/entreprise/300025764");
    cy.contains("ne sont pas publiquement").should("have.length", 1);
    cy.findByRole("heading", {
      name: "▪︎ ▪︎ ▪︎ information non-diffusible ▪︎ ▪︎ ▪︎",
      level: 1,
    }).should("be.visible");

    cy.get("#entreprise")
      .findAllByRole("row")
      .filter(':contains("Adresse postale")')
      .within(() => {
        cy.findAllByRole("cell")
          .last()
          .within(() => {
            cy.findByRole("button", {
              name: /▪︎ ▪︎ ▪︎ information non-diffusible ▪︎ ▪︎ ▪︎/,
            }).should("be.visible");
          });
      });

    cy.get("#etablissement")
      .findAllByRole("row")
      .filter(':contains("Enseigne de l’établissement")')
      .within(() => {
        cy.findAllByRole("cell")
          .last()
          .within(() => {
            cy.findByRole("button", {
              name: /▪︎ ▪︎ ▪︎ information non-diffusible ▪︎ ▪︎ ▪︎/,
            }).should("be.visible");
          });
      });
    cy.get("#etablissement")
      .findAllByRole("row")
      .filter(':contains("Adresse")')
      .within(() => {
        cy.findAllByRole("cell")
          .last()
          .within(() => {
            cy.findByRole("button", {
              name: /▪︎ ▪︎ ▪︎ information non-diffusible ▪︎ ▪︎ ▪︎/,
            }).should("be.visible");
          });
      });

    cy.get("#etablissements")
      .findAllByRole("rowgroup")
      .last()
      .within(() => {
        cy.findAllByRole("cell")
          .filter(':contains("Détails (nom, enseigne, adresse)")')
          .first()
          .within(() => {
            cy.findByRole("link", {
              name: /▪︎ ▪︎ ▪︎ information non-diffusible ▪︎ ▪︎ ▪︎/,
            }).should("be.visible");
          });
      });
  });

  it("Non diffusible Personne morale should have name but hidden address", () => {
    cy.visit("/entreprise/908595879");
    cy.contains("ne sont pas publiquement").should("have.length", 1);
    cy.findByRole("heading", {
      name: "SEVERNAYA",
      level: 1,
    }).should("be.visible");

    cy.get("#entreprise")
      .findAllByRole("row")
      .filter(':contains("Adresse postale")')
      .within(() => {
        cy.findAllByRole("cell")
          .last()
          .within(() => {
            cy.findByRole("button", {
              name: /▪︎ ▪︎ ▪︎ PARIS ▪︎ ▪︎ ▪︎/,
            }).should("be.visible");
          });
      });

    // TODO re-enable this check after data update and examples generation
    // cy.get("#etablissement")
    //   .findAllByRole("row")
    //   .filter(':contains("Enseigne de l’établissement")')
    //   .within(() => {
    //     cy.findAllByRole("cell")
    //       .last()
    //       .within(() => {
    //         cy.findByRole("button", {
    //           name: /▪︎ ▪︎ ▪︎ information protégée ▪︎ ▪︎ ▪︎/,
    //         }).should("be.visible");
    //       });
    //   });
    cy.get("#etablissement")
      .findAllByRole("row")
      .filter(':contains("Adresse")')
      .within(() => {
        cy.findAllByRole("cell")
          .last()
          .within(() => {
            cy.findByRole("button", {
              name: /▪︎ ▪︎ ▪︎ PARIS ▪︎ ▪︎ ▪︎/,
            }).should("be.visible");
          });
      });

    cy.get("#etablissements")
      .findAllByRole("rowgroup")
      .last()
      .within(() => {
        cy.findAllByRole("cell")
          .filter(':contains("Détails (nom, enseigne, adresse)")')
          .first()
          .within(() => {
            // TODO re-enable this check after data update and examples generation
            // Ensure enseigne is hidden
            // cy.findByRole("link", {
            //   name: /▪︎ ▪︎ ▪︎ information protégée ▪︎ ▪︎ ▪︎/,
            // }).should("be.visible");

            // Ensure address fallbacks to commune
            cy.findByText("▪︎ ▪︎ ▪︎ PARIS ▪︎ ▪︎ ▪︎").should("be.visible");
          });
      });
  });

  it("Should be diffusible and display details", () => {
    cy.visit("/entreprise/880878145");
    cy.contains("ne sont pas publiquement").should("have.length", 0);

    cy.findByRole("heading", {
      name: "GANYMEDE",
      level: 1,
    }).should("be.visible");

    cy.get("#entreprise")
      .findAllByRole("row")
      .filter(':contains("Adresse postale")')
      .within(() => {
        cy.findAllByRole("cell")
          .last()
          .within(() => {
            cy.findByRole("button", {
              name: /128 RUE LA BOETIE 75008 PARIS 8/,
            }).should("be.visible");
          });
      });

    cy.get("#etablissement")
      .findAllByRole("row")
      .filter(':contains("Adresse")')
      .within(() => {
        cy.findAllByRole("cell")
          .last()
          .within(() => {
            cy.findByRole("button", {
              name: /128 RUE LA BOETIE 75008 PARIS 8/,
            }).should("be.visible");
          });
      });

    cy.get("#etablissements")
      .findAllByRole("rowgroup")
      .last()
      .within(() => {
        cy.findAllByRole("cell")
          .filter(':contains("Détails (nom, enseigne, adresse)")')
          .first()
          .within(() => {
            cy.findByText("128 RUE LA BOETIE 75008 PARIS 8").should(
              "be.visible"
            );
          });
      });
  });

  it("No dirigeant in non diffusible", () => {
    cy.visit("/dirigeants/908595879");
    cy.contains("Dirigeant(s) (données privées)").should("have.length", 1);
  });

  it("No dirigeant in protected personne morale", () => {
    cy.visit("/dirigeants/908595879");
    cy.contains("Dirigeant(s) (données privées)").should("have.length", 1);
  });
});

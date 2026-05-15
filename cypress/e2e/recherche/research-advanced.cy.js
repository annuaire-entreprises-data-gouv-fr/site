import routes from "#/clients/routes";
import geoCommunes from "../../fixtures/geo-communes.json";

const path = "/rechercher";

describe("Search page", () => {
  it("Open advanced search page", () => {
    cy.intercept("GET", `${routes.geo.communes}*`, geoCommunes).as(
      "searchCommunes"
    );
    cy.intercept("GET", `${routes.geo.departements}*`, []).as(
      "searchDepartements"
    );
    cy.intercept("GET", `${routes.geo.regions}*`, []).as("searchRegions");
    cy.intercept("GET", `${routes.geo.epcis}*`, []).as("searchEpcis");

    cy.visit("/");
    cy.contains("recherche avancée").click();
    cy.wait(1000);

    cy.contains("Zone géographique").click();
    cy.wait(200);
    cy.get("#geo-search-input").type("Nice");
    cy.wait("@searchCommunes");
    cy.wait(200);
    cy.contains("Nice (06000)").click();
    cy.wait(200);
    cy.contains("Appliquer").click();
    cy.wait(200);
    cy.location().should((loc) => {
      expect(loc.search).includes("cp_dep=06000");
    });
  });
});

describe("Dirigeants and Elus search", () => {
  it("Search a dirigeant with main search bar", () => {
    cy.visit("/rechercher?terme=xavier+jouppe");
    cy.contains("GANYMEDE").should("be.visible");
    cy.contains("Xavier JOUPPE").should("be.visible");
  });
});

describe("Advanced search on page " + path, () => {
  it("Shows filters", () => {
    cy.visit(path + "?terme=Ganymede");

    cy.wait(1000);

    cy.contains("Zone géographique").click();
    cy.contains("Ville, département ou région").should("be.visible");
    cy.contains("Zone géographique").click();
    cy.contains("Ville, département ou région").should("not.be.visible");

    cy.contains("Dirigeant").click();
    cy.contains(
      "Rechercher toutes les structures liées à une personne (dirigeant(e), ou élu(e))"
    ).should("be.visible");

    cy.contains("Situation administrative").click();
    cy.contains("Domaine d‘activité").should("be.visible");
    cy.contains("Etat administratif").should("be.visible");
  });

  it("Filters propagate on pagination", () => {
    cy.visit(path + "?terme=la+poste&cp_dep=&sap=A");
    cy.wait(1000);
    cy.get(".fr-pagination").should("exist");
    cy.get('.fr-pagination__link[title="Page 3"]').click();
    cy.url().should("include", "sap=A");
  });

  it("Structure filters", () => {
    cy.visit(path + "?terme=");
    cy.wait(1000);
    cy.contains("Structure").click();
    cy.contains("Qualités, labels et certificats").should("be.visible");
    cy.contains("Collectivité").click();
    cy.contains("RGE - ").click();
    cy.contains("Appliquer").click({ force: true });
  });

  it("Finances filters", () => {
    cy.visit(path + "?terme=ganymede&ca_min=100&res_max=100000");
    cy.wait(1000);
    cy.contains("Filtre financier").click();
    cy.contains("Min : 1 K €").should("be.visible");
    cy.contains("Max : 100 K €").should("be.visible");
  });
});

describe("Minimum search conditions", () => {
  it("No results if term < 3 and no filters", () => {
    cy.visit("/rechercher?terme=ga");

    cy.contains("ne contient pas assez de paramètres").should("have.length", 1);
  });

  it("Results if term >= 3 and no filters", () => {
    cy.visit("/rechercher?terme=aga");
    cy.contains("ne contient pas assez de paramètres").should("have.length", 0);
  });

  it("Results if term < 3 and filters", () => {
    cy.visit("/rechercher?terme=ag&cp_dep=35000&cp_dep_type=cp");
    cy.contains("ne contient pas assez de paramètres").should("have.length", 0);
  });
});

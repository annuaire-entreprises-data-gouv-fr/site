import resultGrandParis from '../../clients-mocks/recherche-entreprise/grand-paris';
import resultManakinProduction from '../../clients-mocks/recherche-entreprise/manakin-production';
import resultSolutionEnergie from '../../clients-mocks/recherche-entreprise/solution-energie';

describe(`Dirigeants and élus pages`, () => {
  it('Dirigeant page loads', () => {
    cy.visit(`/dirigeants/${resultSolutionEnergie.response.results[0].siren}`);
    cy.contains('GSE VD').should('be.visible');
  });

  it('Elus page loads', () => {
    cy.visit(`/elus/${resultGrandParis.response.results[0].siren}`);
    cy.contains('Anne HIDALGO').should('be.visible');
  });
});

describe(`Labels and certificates`, () => {
  it('RGE', () => {
    cy.visit(`/entreprise/${resultSolutionEnergie.response.results[0].siren}`);
    cy.contains('Labels et certificats').should('be.visible');
    cy.contains('RGE - Reconnu Garant de l’Environnement').should('be.visible');
  });

  it('ESS et Spectacle vivant', () => {
    cy.visit(
      `/entreprise/${resultManakinProduction.response.results[0].siren}`
    );
    cy.contains('Qualités, labels et certificats').should('be.visible');
    cy.contains('ESS - Entreprise Sociale et Solidaire').should('be.visible');
    cy.contains('Entrepreneur de spectacles vivants').should('be.visible');
  });

  it('No certificates', () => {
    cy.visit(`/entreprise/880878145`);
    cy.contains('abels et certificats').should('have.length', 0);
  });
});

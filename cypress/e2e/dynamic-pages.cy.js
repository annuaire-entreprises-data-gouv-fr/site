import { resultGrandParis } from '../../mocks/handlers/search/result-grand-paris';
import { resultManakinProduction } from '../../mocks/handlers/search/result-manakin-production';
import { resultSolutionEnergie } from '../../mocks/handlers/search/result-solution-energie';

describe(`Dirigeants and élus pages`, () => {
  it('Dirigeant page loads', () => {
    cy.visit(`/dirigeants/${resultSolutionEnergie.results[0].siren}`);
    cy.contains('GSE VD').should('be.visible');
  });

  it('Elus page loads', () => {
    cy.visit(`/elus/${resultGrandParis.results[0].siren}`);
    cy.contains('Anne HIDALGO').should('be.visible');
  });
});

describe(`Labels and certificates`, () => {
  it('RGE', () => {
    cy.visit(`/entreprise/${resultSolutionEnergie.results[0].siren}`);
    cy.contains('Labels et certificats').should('be.visible');
    cy.contains('RGE - Reconnu Garant de l’Environnement').should('be.visible');
  });

  it('ESS et Spectacle vivant', () => {
    cy.visit(`/entreprise/${resultManakinProduction.results[0].siren}`);
    cy.contains('Labels et certificats').should('be.visible');
    cy.contains('ESS - Économie Sociale et Solidaire').should('be.visible');
    cy.contains('Entrepreneur de spectacles vivants').should('be.visible');
  });

  it('No certificates', () => {
    cy.visit(`/entreprise/880878145`);
    cy.contains('Label(s) et certificat(s)').should('have.length', 0);
  });
});

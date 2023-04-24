import { resultFinassure } from '../../mocks/handlers/search/result-finassure';
import { resultRedNeedles } from '../../mocks/handlers/search/result-red-needles';
import { resultSauvage } from '../../mocks/handlers/search/result-sauvage';
import { resultSolutionEnergie } from '../../mocks/handlers/search/result-solution-energie';

describe('Etat administratif', () => {
  // pass failing test as Insee is very instable in CI
  it('Non diffusible', () => {
    cy.visit(`/entreprise/${resultSauvage.results[0].siren}`);
    cy.contains('Cette structure est non-diffusible');
  });

  it('Diffusible', () => {
    cy.visit(`/entreprise/${resultSolutionEnergie.results[0].siren}`);
    cy.contains('en activité').should('have.length', 1);
  });

  it('En sommeil', () => {
    cy.visit(`/entreprise/${resultFinassure.results[0].siren}`);
    cy.contains('en sommeil').should('have.length', 1);
  });

  it('Cessée', () => {
    cy.visit(`/entreprise/${resultRedNeedles.results[0].siren}`);
    cy.contains('cessée').should('have.length', 1);
  });
});

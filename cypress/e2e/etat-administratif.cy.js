import resultFinassure from '../../clients-mocks/recherche-entreprise/finassure';
import resultRedNeedles from '../../clients-mocks/recherche-entreprise/red-needles';
import resultSauvage from '../../clients-mocks/recherche-entreprise/sauvage';
import resultSolutionEnergie from '../../clients-mocks/recherche-entreprise/solution-energie';

describe('Etat administratif', () => {
  // pass failing test as Insee is very instable in CI
  it('Non diffusible', () => {
    cy.visit(`/entreprise/${resultSauvage.response.results[0].siren}`);
    cy.contains('Cette structure est non-diffusible');
  });

  it('Diffusible', () => {
    cy.visit(`/entreprise/${resultSolutionEnergie.response.results[0].siren}`);
    cy.contains('en activité').should('have.length', 1);
  });

  it('En sommeil', () => {
    cy.visit(`/entreprise/${resultFinassure.response.results[0].siren}`);
    cy.contains('en sommeil').should('have.length', 1);
  });

  it('Cessée', () => {
    cy.visit(`/entreprise/${resultRedNeedles.response.results[0].siren}`);
    cy.contains('cessée').should('have.length', 1);
  });
});

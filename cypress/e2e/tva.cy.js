import { resultSolutionEnergie } from '../../mocks/handlers/search/result-solution-energie';

describe('TVA validation', () => {
  it(`should display the IVA number`, () => {
    cy.visit(`/entreprise/${resultSolutionEnergie.results[0].siren}`);
    cy.contains('FR27 552 032 534').should('have.length', 1);
  });
});

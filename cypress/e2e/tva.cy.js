import resultSolutionEnergie from '../../clients-mocks/recherche-entreprise/solution-energie';

describe('TVA validation', () => {
  it(`should display the TVA number`, () => {
    cy.visit(`/entreprise/${resultSolutionEnergie.results[0].siren}`);
    cy.contains('FR29 528 163 777').should('have.length', 1);
  });
});

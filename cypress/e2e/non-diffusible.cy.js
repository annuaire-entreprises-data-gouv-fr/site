import { resultGanymede } from '../../mocks/handlers/search/result-ganymede';
import { resultSauvage } from '../../mocks/handlers/search/result-sauvage';
import { resultSevernaya } from '../../mocks/handlers/search/result-severnaya';

describe('Non-diffusible', () => {
  it('Should be non diffusible', () => {
    cy.visit(`/entreprise/${resultSauvage.results[0].siren}`);
    cy.contains('ne sont pas publiquement').should('have.length', 1);
  });

  it('Should be diffusible', () => {
    cy.visit(`/entreprise/${resultGanymede.results[0].siren}`);
    cy.contains('ne sont pas publiquement').should('have.length', 0);
  });

  it('No dirigeant in partial diffusible (protected)', () => {
    cy.visit(`/dirigeants/${resultSevernaya.results[0].siren}`);
    cy.contains('Données privées').should('have.length', 1);
  });
});

import { mockMapping } from '../../mocks/utils';

describe('Non-diffusible', () => {
  // pass failing test as Insee is very instable in CI
  it.only('Should be non diffusible', () => {
    cy.visit(`/entreprise/${mockMapping.nonDiffusible}`);
    cy.contains('ne sont pas publiquement').should('have.length', 1);
  });

  it('Should be diffusible', () => {
    cy.visit(`/entreprise/${mockMapping.ganymede}`);
    cy.contains('ne sont pas publiquement').should('have.length', 0);
  });

  it('No dirigeant in partial diffusible (protected)', () => {
    cy.visit(`/dirigeants/${mockMapping.protected}`);
    cy.contains('Données privées').should('have.length', 1);
  });
});

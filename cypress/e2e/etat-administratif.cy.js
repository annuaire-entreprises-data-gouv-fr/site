import { mockMapping } from '../../mocks/utils';

describe('Etat administratif', () => {
  // pass failing test as Insee is very instable in CI
  xit('Non diffusible"', () => {
    cy.visit('/entreprise/300242492');
    cy.contains('état inconnu (non-diffusible)').should('have.length', 1);
  });

  it('Diffusible', () => {
    cy.visit(`/entreprise/${mockMapping.danone}`);
    cy.contains('en activité').should('have.length', 1);
  });

  it('En sommeil', () => {
    cy.visit('/entreprise/351556394');
    cy.contains('en sommeil').should('have.length', 1);
  });

  it.only('Cessée', () => {
    cy.visit(`/entreprise/${mockMapping.rge}`);
    cy.contains('cessée').should('have.length', 1);
  });
});

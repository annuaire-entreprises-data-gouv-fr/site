import { mockMapping } from '../../mocks/utils';

describe('TVA validation', () => {
  it(`${mockMapping.rge} is valid`, () => {
    cy.visit(`/entreprise/${mockMapping.rge}`);
    cy.contains('FR27 552 032 534').should('have.length', 1);
  });
});

import { resultLaPoste } from '../../mocks/handlers/search/result-la-poste';
import { resultRaphael } from '../../mocks/handlers/search/result-raphael';
import { resultRedNeedles } from '../../mocks/handlers/search/result-red-needles';
import { resultSevernaya } from '../../mocks/handlers/search/result-severnaya';

describe('SEO Index or noindex', () => {
  it('can index home page', () => {
    cy.visit('/');
    cy.get('meta[name="robots"][content*="noindex"]').should('have.length', 0);
    cy.get('meta[name="robots"][content*="index"]').should('have.length', 1);
    cy.get('meta[name="robots"][content*="follow"]').should('have.length', 1);
  });

  it('can index entreprise page', () => {
    cy.visit(`/entreprise/${resultLaPoste.results[0].siren}`);
    cy.get('meta[name="robots"][content*="noindex"]').should('have.length', 0);
    cy.get('meta[name="robots"][content*="index"]').should('have.length', 1);
    cy.get('meta[name="robots"][content*="follow"]').should('have.length', 1);
  });

  it('cannot index justificatif page', () => {
    cy.visit(`/justificatif/${resultLaPoste.results[0].siren}`);
    cy.get('meta[name="robots"][content*="noindex"]').should('have.length', 1);
    cy.get('meta[name="robots"][content*="follow"]').should('have.length', 1);
  });

  it('cannot index closed entreprise page', () => {
    cy.visit(`/entreprise/${resultRedNeedles.results[0].siren}`);
    cy.get('meta[name="robots"][content*="noindex"]').should('have.length', 1);
    cy.get('meta[name="robots"][content*="follow"]').should('have.length', 1);
  });

  it('cannot index auto entreprise page', () => {
    cy.visit(`/entreprise/${resultRaphael.results[0].siren}`);
    cy.get('meta[name="robots"][content*="noindex"]').should('have.length', 1);
    cy.get('meta[name="robots"][content*="follow"]').should('have.length', 1);
  });

  it('cannot index protected siren entreprise page', () => {
    cy.visit(`/entreprise/${resultSevernaya.results[0].siren}`);
    cy.get('meta[name="robots"][content*="noindex"]').should('have.length', 1);
    cy.get('meta[name="robots"][content*="follow"]').should('have.length', 1);
  });
});

import resultLaPoste from '../../clients-mocks/recherche-entreprise/la-poste';
import resultRaphael from '../../clients-mocks/recherche-entreprise/raphael';
import resultRedNeedles from '../../clients-mocks/recherche-entreprise/red-needles';
import resultSevernaya from '../../clients-mocks/recherche-entreprise/severnaya';

describe('SEO Index or noindex', () => {
  const isStaging = Cypress.config('baseUrl').indexOf('https://staging') === 0;

  // staging is disindexed
  if (isStaging) {
    it('cannot index home page', () => {
      cy.visit('/');
      cy.get('meta[name="robots"][content*="noindex"]').should(
        'have.length',
        1
      );
      cy.get('meta[name="robots"][content*="follow"]').should('have.length', 1);
    });

    it('cannot index entreprise page', () => {
      cy.visit(`/entreprise/${resultLaPoste.results[0].siren}`);
      cy.get('meta[name="robots"][content*="noindex"]').should(
        'have.length',
        1
      );
      cy.get('meta[name="robots"][content*="follow"]').should('have.length', 1);
    });
    return;
  }

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

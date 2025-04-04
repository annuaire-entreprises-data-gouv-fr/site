const pages = [
  '/',
  '/rechercher?terme=Kikou',
  '/comment-ca-marche',
  '/faq',
  '/accessibilite',
  '/donnees-extrait-kbis',
  '/vie-privee',
];

pages.forEach((page) => {
  describe(`Page ${page}`, () => {
    it('successfully loads', () => {
      cy.request(page);
    });

    it('FAQ button works', () => {
      cy.visit(page);
      cy.get('[data-test-id="question-faq"]').click();

      // Should be on a new URL which includes '/commands/actions'
      cy.url().should('include', '/faq');
    });

    it('Logo button works', () => {
      cy.visit(page);
      cy.get('.fr-header__logo > a').click();

      // Should be on a new URL which includes '/commands/actions'
      cy.url().should('include', '/');
    });
  });
});

describe('Footer navigation', () => {
  it('check all internal links in footer', () => {
    cy.visit('/');

    cy.get('.fr-footer a').each((footerLink) => {
      const href = footerLink.prop('href');
      const currentOrigin = window.location.origin;

      // Only test internal links (same origin)
      // Skip departements/index.html as it only exists in production and staging
      if (
        href.startsWith(currentOrigin) &&
        href.indexOf('departements/index.html') === -1
      ) {
        cy.request(href);
      }
    });
  });
});

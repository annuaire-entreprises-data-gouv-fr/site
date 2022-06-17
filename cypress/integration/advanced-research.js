const paths = [
  '/rechercher',
  // '/rechercher/carte'
];

paths.forEach((path) => {
  describe('Advanced search on page ' + path, () => {
    it('shows filters', () => {
      cy.visit(path + '?terme=Ganymede');

      cy.contains('recherche avancée').click();
      cy.contains('Filtrer par code postal').should('be.visible');
    });

    it('filters works', () => {
      cy.visit(
        path + '?terme=Ganymede&code_postal=75008&section_activite_principale=J'
      );
      cy.get('.results-list').should('have.length', 1);
    });

    it('Filters propagate on pagination', () => {
      cy.visit(
        path + '?terme=la+poste&code_postal=&section_activite_principale=A'
      );
      cy.get('.fr-pagination').should('exist');
      cy.get('.fr-pagination__link[title="Page 3"]').click();
      cy.url().should('include', 'section_activite_principale=A');
    });
  });
});

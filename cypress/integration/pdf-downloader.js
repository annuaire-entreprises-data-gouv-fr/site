const siren = '552032534';

describe('Test download manager', () => {
  it('Should not be visible by default', () => {
    cy.visit(`/justificatif/${siren}`);
    cy.get('#download-manager').should('not.be.visible');
  });
  it('Should display when triggering a new download', () => {
    cy.get('#button-inpi-pdf button').click();
    cy.get('#download-manager').should('be.visible');
    cy.contains('en cours').should('have.length', 1);
  });
  it('Should display on a different page', () => {
    cy.visit(`/entreprise/${siren}`);
    cy.get('#download-manager').should('be.visible');
  });
  it('Should allow user to remove download', () => {
    cy.get('button.close').click();
    cy.contains('justificatif_').should('have.length', 0);
  });
  it('Should disappear if empty', () => {
    cy.get('#download-manager').should('not.be.visible');
  });
});

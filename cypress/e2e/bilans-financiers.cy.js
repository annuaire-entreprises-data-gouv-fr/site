import routes from '#clients/routes';

describe('Bilans financiers', () => {
  it('Should display Données financières section', () => {
    cy.visit('/entreprise/487444697');
    cy.contains('Données financières');
  });

  it('Should hide bilans when partially confidential', () => {
    cy.intercept('GET', `${routes.donneesFinancieres.ods.search}*`, {
      fixture: '../fixtures/donnees-financieres-confidential.json',
    });
    cy.intercept('GET', `${routes.donneesFinancieres.ods.metadata}*`, {
      fixture: '../fixtures/ods-metadata.json',
    });
    cy.visit('/donnees-financieres/487444697');
    cy.contains(
      'Les bilans de cette structure sont accompagnés d’une déclaration de confidentialité.'
    );
  });

  it('Should display indicateurs financiers', () => {
    cy.intercept('GET', `${routes.donneesFinancieres.ods.search}*`, {
      fixture: '../fixtures/donnees-financieres.json',
    });
    cy.intercept('GET', `${routes.donneesFinancieres.ods.metadata}*`, {
      fixture: '../fixtures/ods-metadata.json',
    });
    cy.visit('/donnees-financieres/552032534');
    cy.contains('Date de clôture');
    cy.contains('31/12/2019');

    cy.contains('Résultat net');
    cy.contains('2 Mds €');

    cy.contains('Source : MEF');
  });

  it('Should display dépôts de compte section (JOAFE)', () => {
    cy.visit('/donnees-financieres/338365059');
    cy.contains(
      /Cette structure possède [\d]+ comptes publiés au Journal Officiel des Associations/
    );
    // Displays compte number
    cy.contains('338365059_31122022');
  });
});

describe('Bilans financiers (authenticated)', () => {
  beforeEach(() => {
    cy.login();
  });
  it('Should display "Détail des subventions"', () => {
    cy.visit('/donnees-financieres/338365059');
    cy.contains('Détail des subventions').should('be.visible');
    cy.contains('État').should('be.visible');
    cy.contains('Refusé').should('be.visible');
  });
});

const siret = [
  '35600000000048', // La poste
  '88087814500015', // SASU
  '88301031600015', // EI
  '55203253400646', // cac-40
  '13002526500013', // administration
  '20005478100022', // collectivité
];

siret.forEach((siret) => {
  describe(`Siret ${siret}`, () => {
    it('/etablissement page loads', () => {
      cy.request(`/etablissement/${siret}`).then((resp) => {
        expect(resp.status).to.eq(200);
      });
    });
    ['annonces', 'entreprise', 'justificatif', 'divers'].map((pagePrefix) => {
      const path = `/${pagePrefix}/${siret.slice(0, 9)}`;
      it(`/${pagePrefix} page loads`, () => {
        cy.request(path).then((resp) => {
          expect(resp.status).to.eq(200);
        });
      });
    });
  });
});

describe(`Dirigeants and élus pages`, () => {
  it('Dirigeant page loads', () => {
    cy.visit(`/dirigeants/552032534`);
    cy.contains('Antoine BERNARD DE SAINT AFFRIQUE').should('be.visible');
  });

  it('Elus page loads', () => {
    cy.visit(`/elus/200054781`);
    cy.contains('Anne HIDALGO').should('be.visible');
  });
});

describe(`Labels and certificates`, () => {
  it('RGE', () => {
    cy.visit(`/entreprise/518286976`);
    cy.contains('Labels et certificats').should('be.visible');
    cy.contains('RGE - Reconnu Garant de l’Environnement').should('be.visible');
  });

  it('ESS et Spectacle vivant', () => {
    cy.visit(`/entreprise/842019051`);
    cy.contains('Labels et certificats').should('be.visible');
    cy.contains('ESS - Entreprise Sociale et Solidaire').should('be.visible');
    cy.contains('Entrepreneur de spectacles vivants').should('be.visible');
  });

  it('No certificates', () => {
    cy.visit(`/entreprise/880878145`);
    cy.contains('Label ou certification').should('have.length', 0);
  });
});

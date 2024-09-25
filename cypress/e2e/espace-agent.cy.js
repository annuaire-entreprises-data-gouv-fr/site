describe(
  'Espace agent',
  {
    defaultCommandTimeout: 10000, // 10 sec
    pageLoadTimeout: 180000, // 3min because AgentConnect testing env is veeeery slow
    testIsolation: false, // We need to share session cookies between tests
    retries: {
      runMode: 2,
    },
  },
  () => {
    before(() => {
      cy.clearCookies();
    });
    it("Page d'accueil", () => {
      cy.visit(`/`);
      cy.contains('Espace agent')
        // The element is present twice (mobile and desktop menu).
        // The mobile one is hidden but appears first in the DOM,
        // so we need to force the click
        .click({ force: true });
      cy.contains('button', 'ProConnect');
    });

    it('Bouton agent connect sur les données protégées', () => {
      cy.visit('/documents/487444697');
      cy.contains('Réservé aux agents publics');
      cy.contains('button', 'ProConnect');
    });

    // it('Connexion', () => {
    //   cy.visit(`/lp/agent-public`);
    //   cy.contains('button', 'AgentConnect').click();
    //   cy.origin('fca.integ01.dev-agentconnect.fr', () => {
    //     cy.get('input[type="email"]').clear().type('user@yopmail.com');
    //     cy.contains('button', 'Se connecter').click();
    //   });

    //   cy.origin('app-sandbox.moncomptepro.beta.gouv.fr', () => {
    //     cy.contains('Renseignez votre mot de passe');
    //     cy.get('input[type="password"]').type('user@yopmail.com');
    //     cy.contains('button', 'S’identifier').click();
    //     cy.contains('DINUM').click();
    //   });

    //   cy.location().should((loc) => {
    //     expect(loc.pathname).to.eq('/');
    //   });
    //   cy.contains('user@yopmail.com');
    // });

    // it('Actes et statuts accessibles', () => {
    //   cy.visit('/documents/487444697');
    //   cy.contains('Actes et statuts');
    //   cy.contains(/Cette entreprise possède [\d]+ document\(s\) au RNE/);
    // });

    // it('Bilans accessibles', () => {
    //   cy.visit('/donnees-financieres/487444697');
    //   cy.contains('Bilans');
    //   cy.contains(
    //     /Cette entreprise possède [\d]+ bilan\(s\) déposé\(s\) au RNE/
    //   );
    // });
  }
);

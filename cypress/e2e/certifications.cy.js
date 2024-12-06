describe('Certifications', () => {
  describe('QUALIBAT-RGE', () => {
    it('Should display QUALIBAT-RGE', () => {
      cy.visit(`/labels-certificats/843701079`);
      cy.contains('QUALIBAT-RGE');
    });

    it('Should display company phone number', () => {
      cy.visit(`/labels-certificats/843701079`);
      cy.contains(/\d{2} \d{2} \d{2} \d{2} \d{2}/);
    });
  });
  describe('ESS & Spectacles vivants', () => {
    it('Should display ESS and spectacles vivants', () => {
      cy.visit(`/labels-certificats/800329849`);
      cy.contains('ESS');
      cy.contains('Numéro de récépissé');
    });
  });
  describe('Professionnel du Bio', () => {
    it('Should display Professionnel du Bio', () => {
      cy.visit(`/labels-certificats/302474648`);
      cy.contains('Professionnel du Bio').should('be.visible');
      cy.contains('Détail établissement').should('be.visible');
      cy.contains('SAS NATURALIA SAINT OUEN PERI').should('be.visible');
    });
  });
  describe('Entreprise Sociale Inclusive', () => {
    it('Should display Entreprise Sociale Inclusive', () => {
      cy.visit(`/labels-certificats/533744991`);
      cy.contains('Entreprise Sociale Inclusive').should('be.visible');
      cy.contains('Type de structure').should('be.visible');
      cy.contains("Entreprise d'insertion (EI)").should('be.visible');
    });
  });
  describe('Egapro', () => {
    it('Should display Égalité professionnelle', () => {
      cy.visit(`/labels-certificats/356000000`);
      cy.contains('Égalité professionnelle');
      cy.contains('Femmes parmi les cadres dirigeants');
      cy.contains('94');
    });
  });
  describe('Qualiopi', () => {
    it('Should display Qualiopi', () => {
      cy.visit(`/labels-certificats/356000000`);
      cy.contains('Organisme de formation');
      cy.contains('certifiée Qualiopi');
      cy.contains('Numéro Déclaration Activité');
      cy.contains('11755565775');
    });
  });
});

describe('Certifications', () => {
  describe('RGE', () => {
    it('Should display certification name - OPQIBI', () => {
      cy.visit(`/labels-certificats/487444697`);
      cy.contains('Certificat Qualifelec RGE');
    });

    it('Should display certification name - QUALIBAT', () => {
      cy.visit(`/labels-certificats/843701079`);
      cy.contains('QUALIBAT-RGE');
    });

    it('Should display company phone number', () => {
      cy.visit(`/labels-certificats/487444697`);
      cy.contains('09 82 26 64 14');
    });
  });
  describe('ESS & Spectacles vivants', () => {
    it('Should display ESS and spectacles vivants', () => {
      cy.visit(`/labels-certificats/800329849`);
      cy.contains('ESS');
      cy.contains('Numéro de récépissé');
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

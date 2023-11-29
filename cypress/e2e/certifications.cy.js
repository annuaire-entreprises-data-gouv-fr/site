describe('Certifications', () => {
  describe('RGE', () => {
    it('Should display certification name - OPQIBI', () => {
      cy.visit(`/labels-certificats/528163777`);
      cy.contains('Certificat OPQIBI');
    });

    it('Should display certification name - QUALIBAT', () => {
      cy.visit(`/labels-certificats/843701079`);
      cy.contains('QUALIBAT-RGE');
    });

    it('Should display company phone number', () => {
      cy.visit(`/labels-certificats/528163777`);
      cy.contains('06 98 39 31 19');
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
      cy.contains('Organisme de formation certifié Qualiopi');
      cy.contains('Numéro Déclaration Activité');
      cy.contains('11755565775');
    });
  });
});

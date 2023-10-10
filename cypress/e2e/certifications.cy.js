describe('Certifications', () => {
  describe('RGE', () => {
    it('Should display certification name - OPQIBI', () => {
      cy.visit(`/labels-certificats/528163777`);
      cy.contains('Certificat OPQIBI');
    });

    it('Should display certification name - QUALIBAT', () => {
      cy.visit(`/labels-certificats/843701079`);
      cy.contains('QUALIBAT-RGE');
    })

    it('Should display company phone number', () => {
      cy.visit(`/labels-certificats/528163777`);
      cy.contains('06 98 39 31 19');
    });
  });
});

describe('Certifications', () => {
  describe('ESS & Spectacles vivants', () => {
    it('Should display ESS and spectacles vivants', () => {
      cy.visit(`/labels-certificats/842019051`);
      cy.contains('ESS');
      cy.contains('Numéro de récépissé');
    });
  });
});

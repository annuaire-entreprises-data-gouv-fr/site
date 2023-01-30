describe('Certifications', () => {
  describe('RGE', () => {
    it('Should display certification name', () => {
      cy.visit('/labels-certificats/528163777');
      cy.contains('CERTIBAT-RGE');
      cy.contains('Certificat OPQIBI');
    });
    it('Should display company phone number', () => {
      cy.visit('/labels-certificats/528163777');
      cy.contains('01 49 48 14 50');
    });
  });
});

describe('Certifications', () => {
  describe('ESS & Spectacles vivants', () => {
    it('Should display ESS and scpetacles vivants', () => {
      cy.visit('/labels-certificats/842019051');
      cy.contains('ESS');
      cy.contains('Numéro de récipissé');
    });
    it('Should display only spectacles vivants', () => {
      cy.visit('/labels-certificats/399463603');
      cy.contains('Numéro de récipissé');
    });
  });
});

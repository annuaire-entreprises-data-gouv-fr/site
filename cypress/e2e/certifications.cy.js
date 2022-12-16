describe.only('Certifications', () => {
  describe('RGE', () => {
    it('Should display certification name', () => {
      cy.visit('/labels-certifications/528163777');
      cy.contains('CERTIBAT-RGE');
      cy.contains('Certificat OPQIBI');
    });
    it('Should display company phone number', () => {
      cy.visit('/labels-certifications/528163777');
      cy.contains('01 49 48 14 50');
    });
  });
});

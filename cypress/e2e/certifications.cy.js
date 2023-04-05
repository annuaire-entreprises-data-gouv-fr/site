import { mockMapping } from '../../mocks/utils';

describe('Certifications', () => {
  describe('RGE', () => {
    it('Should display certification name', () => {
      cy.visit(`/labels-certificats/${mockMapping.rge}`);
      cy.contains('CERTIBAT-RGE');
      cy.contains('Certificat OPQIBI');
    });
    it('Should display company phone number', () => {
      cy.visit(`/labels-certificats/${mockMapping.rge}`);
      cy.contains('01 49 48 14 50');
    });
  });
});

describe.only('Certifications', () => {
  describe('ESS & Spectacles vivants', () => {
    it('Should display ESS and spectacles vivants', () => {
      cy.visit(`/labels-certificats/${mockMapping.ess}`);
      cy.contains('ESS');
      cy.contains('Numéro de récépissé');
    });
    xit('Should display only spectacles vivants', () => {
      cy.visit(`/labels-certificats/${mockMapping.spectacleVivant}`);
      cy.contains('Numéro de récépissé');
    });
  });
});

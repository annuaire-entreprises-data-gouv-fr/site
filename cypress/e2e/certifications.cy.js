import { resultManakinProduction } from '../../mocks/handlers/search/result-manakin-production';
import { resultSolutionEnergie } from '../../mocks/handlers/search/result-solution-energie';

describe('Certifications', () => {
  describe('RGE', () => {
    it('Should display certification name', () => {
      cy.visit(`/labels-certificats/${resultSolutionEnergie.results[0].siren}`);
      cy.contains('CERTIBAT-RGE');
      cy.contains('Certificat OPQIBI');
    });
    it('Should display company phone number', () => {
      cy.visit(`/labels-certificats/${resultSolutionEnergie.results[0].siren}`);
      cy.contains('06 98 39 31 19');
    });
  });
});

describe('Certifications', () => {
  describe('ESS & Spectacles vivants', () => {
    it('Should display ESS and spectacles vivants', () => {
      cy.visit(
        `/labels-certificats/${resultManakinProduction.results[0].siren}`
      );
      cy.contains('ESS');
      cy.contains('Numéro de récépissé');
    });
  });
});

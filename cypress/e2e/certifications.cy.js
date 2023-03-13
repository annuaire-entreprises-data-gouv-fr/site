const { rgeMock } = require('../mocks/ademe');
const { esv, datasetsMock } = require('../mocks/culture');
const { sirenMock, tokenMock, siretMock } = require('../mocks/insee');
const {
  withCertificationMock,
  essMock,
  searchEsvMock,
} = require('../mocks/search');

describe('Certifications', () => {
  beforeEach(() => {
    cy.task('msw:set:handlers', [
      {
        url: 'https://api.insee.fr/token',
        payload: tokenMock,
        persist: true,
        type: 'post',
      },
    ]);
  });
  describe('RGE', () => {
    beforeEach(() => {
      cy.task('msw:set:handlers', [
        {
          url: 'https://api.insee.fr/entreprises/sirene/V3/siren/528163777',
          payload: sirenMock,
        },
        {
          url: 'https://api.insee.fr/entreprises/sirene/V3/siret',
          payload: siretMock,
        },
        {
          url: 'https://data.ademe.fr/data-fair/api/v1/datasets/liste-des-entreprises-rge-2/lines/',
          payload: rgeMock,
        },
        {
          url: 'https://recherche-entreprises.api.gouv.fr/search',
          payload: withCertificationMock,
          persist: true,
        },
      ]);
    });
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
  describe('ESS & Spectacles vivants', () => {
    it('Should display ESS and scpetacles vivants', () => {
      cy.visit('/labels-certificats/842019051');
      cy.contains('ESS');
      cy.contains('Numéro de récépissé');
    });

    it('Should display only spectacles vivants', () => {
      cy.task('msw:set:handlers', [
        {
          url: 'https://data.culture.gouv.fr/api/records/1.0/search/',
          payload: esv,
          perist: true,
        },
        {
          url: 'https://data.culture.gouv.fr/api/datasets/1.0/search',
          payload: datasetsMock,
          perist: true,
        },
        {
          url: 'https://api.insee.fr/entreprises/sirene/V3/siren/399463603',
          payload: sirenMock,
        },
        {
          url: 'https://recherche-entreprises.api.gouv.fr/search',
          payload: searchEsvMock,
          persist: true,
        },
        {
          url: 'https://api.insee.fr/entreprises/sirene/V3/siret',
          payload: siretMock,
        },
      ]);
      cy.visit('/labels-certificats/399463603');
      cy.contains('Numéro de récépissé');
    });
  });
});

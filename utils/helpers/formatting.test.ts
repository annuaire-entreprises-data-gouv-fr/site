import { formatAdresse } from './formatting';

const adresses = [
  {
    fields: {
      complement: 'ZAC DE COURTINE IV',
      numeroVoie: null,
      indiceRepetition: null,
      typeVoie: 'RUE',
      libelleVoie: 'RIGOBERTA MENCHU',
      codePostal: '84000',
      libelleCommune: 'AVIGNON',
      libelleCommuneEtranger: null,
      distributionSpeciale: null,
      codeCommune: '84007',
      codeCedex: null,
      libelleCommuneCedex: null,
      pays: null,
    },
    expected: 'Zac de courtine iv, rue rigoberta menchu, 84000 Avignon',
  },
  {
    fields: {
      complement: 'CHEZ MADAME GENEVIEVE GUINJARD',
      numeroVoie: '1',
      indiceRepetition: null,
      typeVoie: 'RUE',
      libelleVoie: 'RAMEAU',
      codePostal: '60300',
      libelleCommune: 'SENLIS',
      libelleCommuneEtranger: null,
      distributionSpeciale: null,
      codeCommune: '60612',
      codeCedex: null,
      libelleCommuneCedex: null,
      codePaysEtranger: null,
      libellePaysEtranger: null,
    },
    expected: 'Chez madame genevieve guinjard, 1 rue rameau, 60300 Senlis',
  },
  {
    fields: {
      complement: '17F PLATINIUM',
      numeroVoie: null,
      indiceRepetition: null,
      typeVoie: null,
      libelleVoie: 'N0 233 TAI CANG ROAD',
      codePostal: null,
      libelleCommune: null,
      libelleCommuneEtranger: '200020 SHANGAI',
      distributionSpeciale: null,
      codeCommune: null,
      codeCedex: null,
      libelleCedex: null,
      codePaysEtranger: '99216',
      libellePaysEtranger: 'CHINE',
    },
    expected: '17f platinium, n0 233 tai cang road, 200020 shangai, Chine',
  },
];

describe('Check formatAdresse', () => {
  adresses.map((adress) =>
    test('Success : ' + adress.expected, () => {
      expect(formatAdresse(adress.fields)).toBe(adress.expected);
    })
  );
});

export {};

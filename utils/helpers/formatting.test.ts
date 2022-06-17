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
];

describe('Check formatAdresse', () => {
  adresses.map((adress) =>
    test('Success : ' + adress.expected, () => {
      expect(formatAdresse(adress.fields)).toBe(adress.expected);
    })
  );
});

export {};

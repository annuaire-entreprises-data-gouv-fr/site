import {
  escapeString,
  formatAdresse,
  formatCurrency,
  removeSpecialChars,
} from './formatting';

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
    expected: 'ZAC DE COURTINE IV, RUE RIGOBERTA MENCHU, 84000 AVIGNON',
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
    expected: 'CHEZ MADAME GENEVIEVE GUINJARD, 1 RUE RAMEAU, 60300 SENLIS',
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
    expected: '17F PLATINIUM, N0 233 TAI CANG ROAD, 200020 SHANGAI, CHINE',
  },
];

describe('Check formatAdresse', () => {
  adresses.map((adress) =>
    test('Success : ' + adress.expected, () => {
      expect(formatAdresse(adress.fields)).toBe(adress.expected);
    })
  );
});

describe('Check formatCurrency', () => {
  const expected = [
    '-100 Mds €',
    '-9.9 M €',
    '-1 K €',
    '0 €',
    '100 €',
    '10 K €',
    '1 M €',
    '100 Mds €',
    undefined,
    null,
    '',
    'hello skelz',
  ];

  [
    -100000000000,
    -9999999,
    -1000,
    0,
    100,
    10000,
    1000000,
    100000000000,
    undefined,
    null,
    '',
    'hello skelz',
  ].map((value, index) => {
    test(`${value} : ${formatCurrency(value)} - ${expected[index]}`, () => {
      expect(formatCurrency(value)).toBe(expected[index]);
    });
  });
});

describe('Check escapeString', () => {
  expect(escapeString("ksdn'fk'jdnsfㅤé")).toBe('ksdn-fk-jdnsf-e');
});

describe('Check removeSpecialChars', () => {
  expect(removeSpecialChars("ksㅤdn'fk'jdnsfㅤé")).toBe("ksㅤdn'fk'jdnsfㅤe");
});

export {};

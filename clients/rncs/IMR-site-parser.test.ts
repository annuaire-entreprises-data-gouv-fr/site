import { readFileSync } from 'fs';
import { verifySiren } from '../../utils/helpers/siren-and-siret';
import parseSirenPageHtml from './IMR-site-parser';

const dummySiren = verifySiren('880878145');

describe('IMR HTML parser', () => {
  it('parses the html', () => {
    const html = readFileSync(
      __dirname + '/__tests__/html_ok_simple_company.txt',
      'utf-8'
    );

    const result = parseSirenPageHtml(html, dummySiren);
    expect(result).toEqual({
      identite: {
        greffe: '',
        codeGreffe: '',
        numeroRCS: '',
        numGestion: '2020B02214',
        dateImmatriculation: '2020-01-23',
        dateDebutActiv: '2020-01-13',
        dateGreffe: '',
        dateRadiation: '',
        dateCessationActivite: '',
        denomination: 'Ganymède',
        dureePersonneMorale: '99 ans',
        dateClotureExercice: '31 décembre',
        capital: '1 000 EUR (fixe)',
        isPersonneMorale: true,
        libelleNatureJuridique: 'Société par actions simplifiée',
      },
      beneficiaires: [],
      dirigeants: [],
    });
  });

  // it('returns domain error when xml is invalid', () => {
  //   expect(() => extractIMRFromXml('yolo<', dummySiren)).toThrowError(Error);
  // });
});

export {};

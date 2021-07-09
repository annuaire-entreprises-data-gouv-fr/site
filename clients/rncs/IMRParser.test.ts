import { readFileSync } from 'fs';
import { verifySiren } from '../../utils/helpers/siren-and-siret';
import { extractIMRFromXml, InvalidFormatError } from './IMRParser';

const dummySiren = verifySiren('880878145');

describe('IMR XML parser', () => {
  it('parses the XML for company with single leader', () => {
    const okXML = readFileSync(
      __dirname + '/__tests__/ok_simple_company.txt',
      'utf-8'
    );

    const result = extractIMRFromXml(okXML, dummySiren);
    expect(result).toEqual({
      beneficiaires: [],
      dirigeants: [
        {
          prenom: 'Bilbon',
          nom: 'Sacquet',
          role: 'Président',
          lieuNaissance: 'La Comté, Terre du Milieu',
          dateNaissance: '2000',
          sexe: null,
        },
      ],
    });
  });

  it('parses the XML for company with several leaders including a company', () => {
    const okXML = readFileSync(
      __dirname + '/__tests__/ok_complex_company.txt',
      'utf-8'
    );

    const result = extractIMRFromXml(okXML, dummySiren);

    expect(result).toEqual({
      beneficiaires: [],
      dirigeants: [
        {
          prenom: 'Bilbon',
          nom: 'Sacquet',
          role: 'Président',
          lieuNaissance: 'La Comté, Terre du Milieu',
          dateNaissance: '2000',
          sexe: null,
        },
        {
          denomination: 'Nazgul SAS',
          natureJuridique: 'SAS',
          siren: '356000000',
          role: 'Président',
        },
      ],
    });
  });

  it('returns domain error when xml is invalid', () => {
    expect(() => extractIMRFromXml('yolo<', dummySiren)).toThrowError(
      InvalidFormatError
    );
  });
});

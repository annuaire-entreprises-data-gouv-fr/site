import { readFileSync } from 'fs';
import { NotASirenError } from '../../models';
import { extractIMRFromXml, InvalidFormatError } from './IMRParser';

describe('IMR XML parser', () => {
  it('parses the XML for company with single leader', () => {
    const okXML = readFileSync(
      __dirname + '/__tests__/ok_simple_company.txt',
      'utf-8'
    );

    const result = extractIMRFromXml(okXML);

    expect(result).toEqual([
      {
        prenom: 'Bilbon',
        nom: 'Sacquet',
        role: 'Président',
        lieuNaissance: 'La Comté, Terre du Milieu',
        dateNaissance: '2000',
      },
    ]);
  });

  it('parses the XML for company with several leaders including a company', () => {
    const okXML = readFileSync(
      __dirname + '/__tests__/ok_complex_company.txt',
      'utf-8'
    );

    const result = extractIMRFromXml(okXML);

    expect(result).toEqual([
      {
        prenom: 'Bilbon',
        nom: 'Sacquet',
        role: 'Président',
        lieuNaissance: 'La Comté, Terre du Milieu',
        dateNaissance: '2000',
      },
      {
        denomination: 'Nazgul SAS',
        natureJuridique: 'SAS',
        siren: '356000000',
        role: 'Président',
      },
    ]);
  });

  it('returns a siren error if siren doesnot exist', () => {
    const koSiren = readFileSync(
      __dirname + '/__tests__/ko_siren.txt',
      'utf-8'
    );

    expect(() => extractIMRFromXml(koSiren)).toThrowError(NotASirenError);
  });

  it('returns domain error when xml is invalid', () => {
    expect(() => extractIMRFromXml('yolo<')).toThrowError(InvalidFormatError);
  });
});

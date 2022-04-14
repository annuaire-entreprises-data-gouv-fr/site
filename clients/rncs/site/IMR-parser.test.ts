import { readFileSync } from 'fs';
import { verifySiren } from '../../../utils/helpers/siren-and-siret';
import { extractIMRFromHtml } from './IMR-parser';

const dummySiren = verifySiren('880878145');

describe('IMR HTML parser', () => {
  it('Parses individual company', () => {
    const html = readFileSync(
      __dirname + '/__tests__/html_ok_individual_company.txt',
      'utf-8'
    );

    const result = extractIMRFromHtml(html, dummySiren);
    expect(result).toEqual({
      identite: {
        greffe: null,
        codeGreffe: null,
        numeroRCS: null,
        numGestion: '2022A00922',
        dateImmatriculation: '2022-02-14',
        dateDebutActiv: '2022-01-18',
        dateGreffe: null,
        dateRadiation: null,
        dateCessationActivite: null,
        denomination: 'XXX yyy',
        dureePersonneMorale: null,
        dateClotureExercice: null,
        capital: null,
        isPersonneMorale: false,
        libelleNatureJuridique: 'Entreprise individuelle',
      },
      beneficiaires: [],
      dirigeants: [
        {
          dateNaissance: '10/1991',
          lieuNaissance: null,
          nom: 'Xxx Yyy',
          prenom: '',
          role: 'Représentant Légal',
          sexe: null,
        },
      ],
    });
  });

  it('Parses a closed, single dirigeant company', () => {
    const html = readFileSync(
      __dirname + '/__tests__/html_ok_closed_simple_company.txt',
      'utf-8'
    );

    const result = extractIMRFromHtml(html, dummySiren);
    expect(result).toEqual({
      identite: {
        greffe: null,
        codeGreffe: null,
        numeroRCS: null,
        numGestion: '2018B04643',
        dateImmatriculation: '2018-05-12',
        dateDebutActiv: '2018-05-06',
        dateGreffe: null,
        dateRadiation: '2021-10-15',
        dateCessationActivite: '2021-06-30',
        denomination: 'RED NEEDLES',
        dureePersonneMorale: '99 ans',
        dateClotureExercice: '30 Juin',
        capital: '1 000.00 €',
        isPersonneMorale: true,
        libelleNatureJuridique: 'Société à responsabilité limitée',
      },
      beneficiaires: [
        {
          dateGreffe: '',
          dateNaissance: '07/1990',
          type: '',
          nom: 'Xxx Yyy',
          prenoms: '',
          nationalite: 'Francaise',
        },
      ],
      dirigeants: [
        {
          dateNaissance: '07/1990',
          lieuNaissance: '',
          nom: 'Xxx Yyy',
          prenom: '',
          role: 'Liquidateur',
          sexe: null,
        },
      ],
    });
  });
  it('Parses single dirigeant company', () => {
    const html = readFileSync(
      __dirname + '/__tests__/html_ok_simple_company.txt',
      'utf-8'
    );

    const result = extractIMRFromHtml(html, dummySiren);
    expect(result).toEqual({
      identite: {
        greffe: null,
        codeGreffe: null,
        numeroRCS: null,
        numGestion: '2020B02214',
        dateImmatriculation: '2020-01-23',
        dateDebutActiv: '2020-01-13',
        dateGreffe: null,
        dateRadiation: null,
        dateCessationActivite: null,
        denomination: 'Ganymède',
        dureePersonneMorale: '99 ans',
        dateClotureExercice: '31 décembre',
        capital: '1 000.00 €',
        isPersonneMorale: true,
        libelleNatureJuridique: 'Société par actions simplifiée',
      },
      beneficiaires: [],
      dirigeants: [
        {
          dateNaissance: '02/1990',
          lieuNaissance: '',
          nom: 'Xxx Yyy',
          prenom: '',
          role: 'Président',
          sexe: null,
        },
      ],
    });
  });

  it('Parses multiple dirigeants company', () => {
    const html = readFileSync(
      __dirname + '/__tests__/html_ok_complex_company.txt',
      'utf-8'
    );

    const result = extractIMRFromHtml(html, dummySiren);
    expect(result).toEqual({
      dirigeants: [
        {
          dateNaissance: '10/1958',
          lieuNaissance: '',
          nom: 'Schnepp Gilles',
          prenom: '',
          role: "Président du conseil d'administration",
          sexe: null,
        },
        {
          dateNaissance: '12/1964',
          lieuNaissance: '',
          nom: 'Bernard De Saint Affrique Antoine',
          prenom: '',
          role: 'Directeur général',
          sexe: null,
        },
        {
          dateNaissance: '07/1969',
          lieuNaissance: '',
          nom: 'Timuray Serpil',
          prenom: '',
          role: 'Administrateur',
          sexe: null,
        },
        {
          dateNaissance: '07/1962',
          lieuNaissance: '',
          nom: 'Molitor Bettina (Theissig)',
          prenom: '',
          role: 'Administrateur',
          sexe: null,
        },
        {
          dateNaissance: '10/1954',
          lieuNaissance: '',
          nom: 'Zinsou-derlin Lionel',
          prenom: '',
          role: 'Administrateur',
          sexe: null,
        },
        {
          dateNaissance: '05/1971',
          lieuNaissance: '',
          nom: 'Olivier Gaëlle',
          prenom: '',
          role: 'Administrateur',
          sexe: null,
        },
        {
          dateNaissance: '09/1957',
          lieuNaissance: '',
          nom: 'Severino Jean-michel Marie Fernand',
          prenom: '',
          role: 'Administrateur',
          sexe: null,
        },
        {
          dateNaissance: '01/1960',
          lieuNaissance: '',
          nom: 'Lejeune Clara (Gaymard)',
          prenom: '',
          role: 'Administrateur',
          sexe: null,
        },
        {
          dateNaissance: '07/1958',
          lieuNaissance: '',
          nom: 'Barilla Guido Maria',
          prenom: '',
          role: 'Administrateur',
          sexe: null,
        },
        {
          dateNaissance: '01/1964',
          lieuNaissance: '',
          nom: 'Faber Emmanuel',
          prenom: '',
          role: 'Administrateur',
          sexe: null,
        },
        {
          dateNaissance: '10/1958',
          lieuNaissance: '',
          nom: 'Schnepp Gilles',
          prenom: '',
          role: 'Administrateur',
          sexe: null,
        },
        {
          dateNaissance: '11/1951',
          lieuNaissance: '',
          nom: 'Landel Michel Marie',
          prenom: '',
          role: 'Administrateur',
          sexe: null,
        },
        {
          dateNaissance: '12/1971',
          lieuNaissance: '',
          nom: 'Cabanis Cécile Marie',
          prenom: '',
          role: 'Administrateur',
          sexe: null,
        },
        {
          dateNaissance: '08/1967',
          lieuNaissance: '',
          nom: 'Boutebba Frédéric',
          prenom: '',
          role: 'Administrateur',
          sexe: null,
        },
        {
          denomination: 'PRICEWATERHOUSECOOPERS AUDIT ',
          natureJuridique: '',
          role: 'SA <br> ',
          siren: '',
        },
        {
          denomination: 'ERNST &amp; YOUNG AUDIT <br> ',
          natureJuridique: '',
          role: 'Commissaire aux comptes titulaire',
          siren: '',
        },
        {
          denomination: 'AUDITEX <br> ',
          natureJuridique: '',
          role: 'Commissaire aux comptes suppléant',
          siren: '',
        },
        {
          dateNaissance: '05/1965',
          lieuNaissance: '',
          nom: 'Georghiou Jean-christophe',
          prenom: '',
          role: 'Commissaire aux comptes suppléant',
          sexe: null,
        },
      ],
      identite: {
        capital: '171 920 622.25 €',
        codeGreffe: null,
        dateCessationActivite: null,
        dateClotureExercice: '31 Décembre',
        dateDebutActiv: '1908-01-01',
        dateGreffe: null,
        dateImmatriculation: null,
        dateRadiation: null,
        denomination: 'DANONE',
        dureePersonneMorale: '157 ans',
        greffe: null,
        isPersonneMorale: true,
        libelleNatureJuridique: 'Société anonyme',
        numGestion: '1955B03253',
        numeroRCS: null,
      },
      beneficiaires: [
        {
          dateGreffe: '',
          dateNaissance: '01/1967',
          nationalite: 'Française',
          nom: 'Penchienati Veronique Bianca',
          prenoms: '',
          type: '',
        },
      ],
    });
  });

  it('returns domain error when xml is invalid', () => {
    expect(() => extractIMRFromHtml('yolo<', dummySiren)).toThrowError(Error);
  });
});

export {};

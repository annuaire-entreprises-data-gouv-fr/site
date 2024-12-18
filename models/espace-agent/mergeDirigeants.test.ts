import { IDirigeants } from '#models/rne/types';
import { mergeDirigeants } from './utils';

describe('mergeDirigeants', () => {
  it('same dirigeant, two roles, one source', () => {
    const dirigeantsRCS: IDirigeants = [
      {
        sexe: 'M',
        nom: 'DOE',
        prenom: 'John',
        prenoms: 'John',
        role: 'Président',
        lieuNaissance: 'Paris',
        dateNaissance: '1980-01-01',
      },
      {
        sexe: 'M',
        nom: 'DOE',
        prenom: 'John',
        prenoms: 'John',
        role: 'Directeur Général',
        lieuNaissance: 'Paris',
        dateNaissance: '1980-01-01',
      },
    ];

    const dirigeantsRNE: IDirigeants = [];

    const merged = mergeDirigeants({ rcs: dirigeantsRCS, rne: dirigeantsRNE });

    expect(merged).toHaveLength(1);
    expect(merged[0]).toEqual(
      expect.objectContaining({ isInIg: true, isInInpi: false })
    );
    expect(merged[0].roles).toEqual(
      expect.arrayContaining([
        { label: 'Président', isInIg: true, isInInpi: false },
        { label: 'Directeur Général', isInIg: true, isInInpi: false },
      ])
    );
  });

  it('same dirigeant, two roles, two sources', () => {
    const dirigeantsRCS: IDirigeants = [
      {
        sexe: 'M',
        nom: 'DOE',
        prenom: 'John',
        prenoms: 'John',
        role: 'Président',
        lieuNaissance: 'Paris',
        dateNaissance: '1980-01-01',
      },
    ];

    const dirigeantsRNE: IDirigeants = [
      {
        sexe: 'M',
        nom: 'DOE',
        prenom: 'John',
        prenoms: 'John',
        role: 'Directeur Général',
        lieuNaissance: 'Paris',
        dateNaissance: '1980-01-01',
      },
    ];

    const merged = mergeDirigeants({ rcs: dirigeantsRCS, rne: dirigeantsRNE });

    expect(merged).toHaveLength(1);
    expect(merged[0]).toEqual(
      expect.objectContaining({ isInIg: true, isInInpi: true })
    );
    expect(merged[0].roles).toEqual(
      expect.arrayContaining([
        { label: 'Président', isInIg: true, isInInpi: false },
        { label: 'Directeur Général', isInIg: false, isInInpi: true },
      ])
    );
  });

  it('same dirigeant, same role, one source', () => {
    const dirigeantsRCS: IDirigeants = [
      {
        sexe: 'M',
        nom: 'DOE',
        prenom: 'John',
        prenoms: 'John',
        role: 'Président',
        lieuNaissance: 'Paris',
        dateNaissance: '1980-01-01',
      },
      {
        sexe: 'M',
        nom: 'DOE',
        prenom: 'John',
        prenoms: 'John',
        role: 'Président',
        lieuNaissance: 'Paris',
        dateNaissance: '1980-01-01',
      },
    ];

    const dirigeantsRNE: IDirigeants = [];

    const merged = mergeDirigeants({ rcs: dirigeantsRCS, rne: dirigeantsRNE });

    expect(merged).toHaveLength(1);
    expect(merged[0]).toEqual(
      expect.objectContaining({ isInIg: true, isInInpi: false })
    );
    expect(merged[0].roles).toEqual(
      expect.arrayContaining([
        { label: 'Président', isInIg: true, isInInpi: false },
      ])
    );
  });

  it('same dirigeant, same role, two sources', () => {
    const dirigeantsRCS: IDirigeants = [
      {
        sexe: 'M',
        nom: 'DOE',
        prenom: 'John',
        prenoms: 'John',
        role: 'Président',
        lieuNaissance: 'Paris',
        dateNaissance: '1980-01-01',
      },
    ];

    const dirigeantsRNE: IDirigeants = [
      {
        sexe: 'M',
        nom: 'DOE',
        prenom: 'John',
        prenoms: 'John',
        role: 'Président',
        lieuNaissance: 'Paris',
        dateNaissance: '1980-01-01',
      },
    ];

    const merged = mergeDirigeants({ rcs: dirigeantsRCS, rne: dirigeantsRNE });

    expect(merged).toHaveLength(1);
    expect(merged[0]).toEqual(
      expect.objectContaining({ isInIg: true, isInInpi: true })
    );
    expect(merged[0].roles).toEqual(
      expect.arrayContaining([
        { label: 'Président', isInIg: true, isInInpi: true },
      ])
    );
  });

  it('same dirigeant but one with birth name, same role, two sources', () => {
    const dirigeantsRCS: IDirigeants = [
      {
        sexe: 'M',
        nom: 'DOE',
        prenom: 'John',
        prenoms: 'John',
        role: 'Président',
        lieuNaissance: 'Paris',
        dateNaissance: '1980-01-01',
      },
    ];

    const dirigeantsRNE: IDirigeants = [
      {
        sexe: 'M',
        nom: 'SMITH (DOE)',
        prenom: 'John',
        prenoms: 'John',
        role: 'Président',
        lieuNaissance: 'Paris',
        dateNaissance: '1980-01-01',
      },
    ];

    const merged = mergeDirigeants({ rcs: dirigeantsRCS, rne: dirigeantsRNE });

    expect(merged).toHaveLength(1);
    expect(merged[0]).toEqual(
      expect.objectContaining({ isInIg: true, isInInpi: true })
    );
    expect(merged[0].roles).toEqual(
      expect.arrayContaining([
        { label: 'Président', isInIg: true, isInInpi: true },
      ])
    );
  });

  it('two dirigeants (one company and one person), two sources', () => {
    const dirigeantsRCS: IDirigeants = [
      {
        siren: '123456789',
        denomination: 'Company A',
        natureJuridique: 'SARL',
        role: 'Directeur Général',
      },
    ];

    const dirigeantsRNE: IDirigeants = [
      {
        sexe: 'M',
        nom: 'DOE',
        prenom: 'John',
        prenoms: 'John',
        role: 'Président',
        lieuNaissance: 'Paris',
        dateNaissance: '1980-01-01',
      },
    ];

    const merged = mergeDirigeants({ rcs: dirigeantsRCS, rne: dirigeantsRNE });

    expect(merged).toHaveLength(2);
    expect(merged).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          siren: '123456789',
          roles: [
            { label: 'Directeur Général', isInIg: true, isInInpi: false },
          ],
        }),
        expect.objectContaining({
          nom: 'DOE',
          prenoms: 'John',
          roles: [{ label: 'Président', isInIg: false, isInInpi: true }],
        }),
      ])
    );
  });

  it('two dirigeants (two persons), two sources', () => {
    const dirigeantsRCS: IDirigeants = [
      {
        sexe: 'F',
        nom: 'SMITH',
        prenom: 'Jane',
        prenoms: 'Jane',
        role: 'CTO',
        lieuNaissance: 'Lyon',
        dateNaissance: '1990-05-15',
      },
    ];

    const dirigeantsRNE: IDirigeants = [
      {
        sexe: 'M',
        nom: 'DOE',
        prenom: 'John',
        prenoms: 'John',
        role: 'CEO',
        lieuNaissance: 'Paris',
        dateNaissance: '1980-01-01',
      },
    ];

    const merged = mergeDirigeants({ rcs: dirigeantsRCS, rne: dirigeantsRNE });

    expect(merged).toHaveLength(2);
    expect(merged).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          nom: 'SMITH',
          prenom: 'Jane',
          prenoms: 'Jane',
          roles: [{ label: 'CTO', isInIg: true, isInInpi: false }],
        }),
        expect.objectContaining({
          nom: 'DOE',
          prenom: 'John',
          prenoms: 'John',
          roles: [{ label: 'CEO', isInIg: false, isInInpi: true }],
        }),
      ])
    );
  });
});

import { IDirigeants } from '#models/rne/types';
import { mergeDirigeants } from './utils';

describe('mergeDirigeants', () => {
  it('same dirigeant, two roles, one source', () => {
    const dirigeantsRCS: IDirigeants = [
      {
        sexe: 'M',
        nom: 'Doe',
        prenom: 'John',
        prenoms: 'John',
        role: 'PRESIDENT',
        lieuNaissance: 'Paris',
        dateNaissance: '1980-01-01',
      },
      {
        sexe: 'M',
        nom: 'Doe',
        prenom: 'John',
        prenoms: 'John',
        role: 'DIRECTEUR GENERAL',
        lieuNaissance: 'Paris',
        dateNaissance: '1980-01-01',
      },
    ];

    const dirigeantsRNE: IDirigeants = [];

    const merged = mergeDirigeants(dirigeantsRCS, dirigeantsRNE);

    expect(merged).toHaveLength(1);
    expect(merged[0]).toEqual(
      expect.objectContaining({ isInIg: true, isInInpi: false })
    );
    expect(merged[0].roles).toEqual(
      expect.arrayContaining([
        { label: 'PRESIDENT', isInIg: true, isInInpi: false },
        { label: 'DIRECTEUR GENERAL', isInIg: true, isInInpi: false },
      ])
    );
  });

  it('same dirigeant, two roles, two sources', () => {
    const dirigeantsRCS: IDirigeants = [
      {
        sexe: 'M',
        nom: 'Doe',
        prenom: 'John',
        prenoms: 'John',
        role: 'PRESIDENT',
        lieuNaissance: 'Paris',
        dateNaissance: '1980-01-01',
      },
    ];

    const dirigeantsRNE: IDirigeants = [
      {
        sexe: 'M',
        nom: 'Doe',
        prenom: 'John',
        prenoms: 'John',
        role: 'DIRECTEUR GENERAL',
        lieuNaissance: 'Paris',
        dateNaissance: '1980-01-01',
      },
    ];

    const merged = mergeDirigeants(dirigeantsRCS, dirigeantsRNE);

    expect(merged).toHaveLength(1);
    expect(merged[0]).toEqual(
      expect.objectContaining({ isInIg: true, isInInpi: true })
    );
    expect(merged[0].roles).toEqual(
      expect.arrayContaining([
        { label: 'PRESIDENT', isInIg: true, isInInpi: false },
        { label: 'DIRECTEUR GENERAL', isInIg: false, isInInpi: true },
      ])
    );
  });

  it('same dirigeant, same role, one source', () => {
    const dirigeantsRCS: IDirigeants = [
      {
        sexe: 'M',
        nom: 'Doe',
        prenom: 'John',
        prenoms: 'John',
        role: 'Président',
        lieuNaissance: 'Paris',
        dateNaissance: '1980-01-01',
      },
      {
        sexe: 'M',
        nom: 'Doe',
        prenom: 'John',
        prenoms: 'John',
        role: 'PRESIDENT',
        lieuNaissance: 'Paris',
        dateNaissance: '1980-01-01',
      },
    ];

    const dirigeantsRNE: IDirigeants = [];

    const merged = mergeDirigeants(dirigeantsRCS, dirigeantsRNE);

    expect(merged).toHaveLength(1);
    expect(merged[0]).toEqual(
      expect.objectContaining({ isInIg: true, isInInpi: false })
    );
    expect(merged[0].roles).toEqual(
      expect.arrayContaining([
        { label: 'PRESIDENT', isInIg: true, isInInpi: false },
      ])
    );
  });

  it('same dirigeant, same role, two sources', () => {
    const dirigeantsRCS: IDirigeants = [
      {
        sexe: 'M',
        nom: 'Doe',
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
        nom: 'Doe',
        prenom: 'John',
        prenoms: 'John',
        role: 'PRESIDENT',
        lieuNaissance: 'Paris',
        dateNaissance: '1980-01-01',
      },
    ];

    const merged = mergeDirigeants(dirigeantsRCS, dirigeantsRNE);

    expect(merged).toHaveLength(1);
    expect(merged[0]).toEqual(
      expect.objectContaining({ isInIg: true, isInInpi: true })
    );
    expect(merged[0].roles).toEqual(
      expect.arrayContaining([
        { label: 'PRESIDENT', isInIg: true, isInInpi: true },
      ])
    );
  });

  it('two dirigeants (one company and one person), two sources', () => {
    const dirigeantsRCS: IDirigeants = [
      {
        siren: '123456789',
        denomination: 'Company A',
        natureJuridique: 'SARL',
        role: 'DIRECTEUR GENERAL',
      },
    ];

    const dirigeantsRNE: IDirigeants = [
      {
        sexe: 'M',
        nom: 'Doe',
        prenom: 'John',
        prenoms: 'John',
        role: 'PRESIDENT',
        lieuNaissance: 'Paris',
        dateNaissance: '1980-01-01',
      },
    ];

    const merged = mergeDirigeants(dirigeantsRCS, dirigeantsRNE);

    expect(merged).toHaveLength(2);
    expect(merged).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          siren: '123456789',
          roles: [
            { label: 'DIRECTEUR GENERAL', isInIg: true, isInInpi: false },
          ],
        }),
        expect.objectContaining({
          nom: 'Doe',
          prenom: 'John',
          roles: [{ label: 'PRESIDENT', isInIg: false, isInInpi: true }],
        }),
      ])
    );
  });

  it('two dirigeants (two persons), two sources', () => {
    const dirigeantsRCS: IDirigeants = [
      {
        sexe: 'F',
        nom: 'Smith',
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
        nom: 'Doe',
        prenom: 'John',
        prenoms: 'John',
        role: 'CEO',
        lieuNaissance: 'Paris',
        dateNaissance: '1980-01-01',
      },
    ];

    const merged = mergeDirigeants(dirigeantsRCS, dirigeantsRNE);

    expect(merged).toHaveLength(2);
    expect(merged).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          nom: 'Smith',
          prenom: 'Jane',
          roles: [{ label: 'CTO', isInIg: true, isInInpi: false }],
        }),
        expect.objectContaining({
          nom: 'Doe',
          prenom: 'John',
          roles: [{ label: 'CEO', isInIg: false, isInInpi: true }],
        }),
      ])
    );
  });
});

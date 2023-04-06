import { HttpNotFound } from '#clients/exceptions';
import routes from '#clients/routes';
import { IEgapro } from '#models/egapro';
import { Siren } from '#utils/helpers';
import { httpGet } from '#utils/network';
import { IEgaproItem, IEgaproResponse } from './types';

const employeesSizeRangeMapping = {
  '50:250': '50 à 250 salariés',
  '251:999': '251 à 999 salariés',
  '1000:': '1000 salariés ou plus',
};

/**
 * EGAPRO
 * https://egapro.travail.gouv.fr/
 */
export const clientEgapro = async (siren: Siren): Promise<IEgapro> => {
  const route = routes.egapro.api;
  const response = await httpGet(route, { params: { q: siren } });

  const data = response.data?.data as IEgaproResponse['data'];

  if (!data || !data?.length) {
    throw new HttpNotFound(
      `Cannot found egapro data associate to siren : ${siren}`
    );
  }

  return mapToDomainObject(data[0]);
};

const mapToDomainObject = (egapro: IEgaproItem) => {
  const {
    notes,
    notes_augmentations,
    notes_augmentations_et_promotions,
    notes_conges_maternite,
    notes_hautes_rémunérations,
    notes_promotions,
    notes_remunerations,
  } = egapro;

  const years = Array.from(
    new Set([
      ...Object.keys(notes),
      ...Object.keys(notes_augmentations),
      ...Object.keys(notes_augmentations_et_promotions),
      ...Object.keys(notes_conges_maternite),
      ...Object.keys(notes_hautes_rémunérations),
      ...Object.keys(notes_promotions),
      ...Object.keys(notes_remunerations),
    ])
  );

  // index is valid for declaration year + 1
  const indexYears = years.map((y) => {
    try {
      return (parseInt(y, 10) + 1).toString();
    } catch {
      return y;
    }
  });

  return {
    employeesSizeRange:
      employeesSizeRangeMapping[egapro.entreprise?.effectif?.tranche || ''],
    years,
    lessThan250: egapro.entreprise?.effectif?.tranche === '50:250',
    indexYears,
    scores: {
      notes: years.map((y) => notes[y] ?? null),
      augmentations: years.map((y) => notes_augmentations[y] ?? null),
      augmentationsPromotions: years.map(
        (y) => notes_augmentations_et_promotions[y] ?? null
      ),
      congesMaternite: years.map((y) => notes_conges_maternite[y] ?? null),
      hautesRemunerations: years.map(
        (y) => notes_hautes_rémunérations[y] ?? null
      ),
      promotions: years.map((y) => notes_promotions[y] ?? null),
      remunerations: years.map((y) => notes_remunerations[y] ?? null),
    },
  };
};

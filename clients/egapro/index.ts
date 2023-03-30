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

  return {
    employeesSizeRange:
      employeesSizeRangeMapping[egapro.entreprise?.effectif?.tranche || ''],
    years,
    scores: {
      notes: years.map((y) => notes[y]),
      augmentations: years.map((y) => notes_augmentations[y]),
      augmentationsPromotions: years.map(
        (y) => notes_augmentations_et_promotions[y]
      ),
      congesMaternite: years.map((y) => notes_conges_maternite[y]),
      hautesRemunerations: years.map((y) => notes_hautes_rémunérations[y]),
      promotions: years.map((y) => notes_promotions[y]),
      remunerations: years.map((y) => notes_remunerations[y]),
    },
  };
};

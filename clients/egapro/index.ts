import { HttpNotFound } from '#clients/exceptions';
import routes from '#clients/routes';
import { IEgapro } from '#models/egapro';
import { Siren } from '#utils/helpers';
import { httpGet } from '#utils/network';
import { IDataEntity, IEgaproResponse } from './types';
import { employeesSizeRangeMapping, formatScore } from './utils';

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

const mapToDomainObject = (egapro: IDataEntity) => {
  const {
    notes,
    notes_augmentations,
    notes_augmentations_et_promotions,
    notes_conges_maternite,
    notes_hautes_rémunérations,
    notes_promotions,
    notes_remunerations,
  } = egapro;
  return {
    employeesSizeRange:
      employeesSizeRangeMapping[egapro.entreprise?.effectif?.tranche],
    scores: formatScore({
      notes,
      notes_augmentations,
      notes_augmentations_et_promotions,
      notes_conges_maternite,
      notes_hautes_rémunérations,
      notes_promotions,
      notes_remunerations,
    }),
  };
};

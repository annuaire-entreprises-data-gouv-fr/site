import { HttpNotFound, HttpServerError } from '#clients/exceptions';
import { IComplements } from '#models/complements';
import { createEtablissementsList } from '#models/etablissements-list';
import { IUniteLegale } from '#models/index';
import { ISearchResult } from '#models/search';
import { ISTATUTDIFFUSION } from '#models/statut-diffusion';
import { Siren } from '#utils/helpers';
import clientSearchSireneOuverte from '.';

export const clientComplementsSireneOuverte = async (
  siren: Siren
): Promise<IComplements> => {
  const { results } = await clientSearchSireneOuverte(siren, 1);

  if (results.length > 0) {
    const { complements, colter } = results[0];
    return { complements, colter };
  }
  throw new HttpNotFound(siren);
};

export const clientUniteLegaleSireneOuverte = async (
  siren: Siren,
  page = 1
): Promise<IUniteLegale> => {
  const { results } = await clientSearchSireneOuverte(siren, 1);
  const result = results[0];
  return mapToDomainObject(siren, result, page);
};

const mapToDomainObject = (
  siren: Siren,
  searchResult: ISearchResult,
  page = 1
): IUniteLegale => {
  const { nombreEtablissements, matchingEtablissements } = searchResult;
  if (
    !searchResult.matchingEtablissements ||
    searchResult.matchingEtablissements.length === 0
  ) {
    throw new HttpServerError(`No etablissements found`);
  }

  return {
    ...searchResult,
    siren,
    etablissements: createEtablissementsList(
      matchingEtablissements,
      page,
      nombreEtablissements
    ),
    statutDiffusion: ISTATUTDIFFUSION.DIFFUSIBLE,
  };
};

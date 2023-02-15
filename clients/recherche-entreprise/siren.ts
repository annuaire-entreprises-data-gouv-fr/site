import { HttpNotFound, HttpServerError } from '#clients/exceptions';
import { IComplements } from '#models/complements';
import { createEtablissementsList } from '#models/etablissements-list';
import { IEtablissement, IUniteLegale } from '#models/index';
import { ISearchResult } from '#models/search';
import { ISTATUTDIFFUSION } from '#models/statut-diffusion';
import { Siren } from '#utils/helpers';
import clientSearchSireneOuverte from '.';

export const clientComplementsSireneOuverte = async (
  siren: Siren
): Promise<IComplements> => {
  const { results } = await clientSearchSireneOuverte({
    searchTerms: siren,
    page: 1,
  });

  if (results.length > 0) {
    const { complements, colter } = results[0];
    return { complements, colter };
  }
  throw new HttpNotFound(siren);
};

export const clientEtablissementSireneOuverte = async (
  siret: string
): Promise<IEtablissement> => {
  const { results } = await clientSearchSireneOuverte({
    searchTerms: siret,
    page: 1,
  });
  if (
    results.length ||
    !results[0] ||
    !results[0].matchingEtablissements.length
  ) {
    throw new HttpNotFound(siret);
  }
  const result = results[0];
  return result.matchingEtablissements[0];
};

export const clientUniteLegaleSireneOuverte = async (
  siren: Siren,
  page = 1
): Promise<IUniteLegale> => {
  const { results } = await clientSearchSireneOuverte({
    searchTerms: siren,
    page: 1,
    inclureEtablissements: true,
  });
  if (
    results.length ||
    !results[0] ||
    !results[0].matchingEtablissements.length
  ) {
    throw new HttpNotFound(siren);
  }
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

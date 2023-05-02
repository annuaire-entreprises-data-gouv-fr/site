import { HttpNotFound } from '#clients/exceptions';
import routes from '#clients/routes';
import { Siren } from '#utils/helpers';
import odsClient from '..';
import { IAPIAgregatsComptableResponse } from './interface';

export type IAgregatComptable = {
  actifImmobilise: number;
  immobilisationsIncorporelles: number;
  subventionsVersees: number;
  immobilisationsIncorporellesCours: number;
  immobilisationsCorporelles: number;
  capitauxPropres: number;
  resultat: number;
  subventionsTransferables: number;
  dettes: number;
};
/**
 * Agrégats comptables 2019 des collectivités et des établissements publics locaux
 * https://data.economie.gouv.fr/explore/dataset/agregats-comptables-des-collectivites-et-des-etablissements-publics-locaux-2019/api/
 */
export const clientAgregatsComptableCollectivite = async (siren: Siren) => {
  const url = routes.agregatsComptableCollectivite.ods.search;
  const metaDataUrl = routes.agregatsComptableCollectivite.ods.metadata;

  const response = await odsClient(
    {
      url,
      config: { params: { q: `siren:${siren}` } },
    },
    metaDataUrl
  );

  if (response.records.length === 0) {
    throw new HttpNotFound(siren);
  }

  const records = response.records as IAPIAgregatsComptableResponse[];
  return {
    agregatsComptable: records.map(mapToDomainObject),
    lastModified: response.lastModified,
  };
};

const mapToDomainObject = (
  agregatComptableCollectivite: IAPIAgregatsComptableResponse
): IAgregatComptable => {
  const {
    a1 = 0,
    a11 = 0,
    a111 = 0,
    a112 = 0,
    a12 = 0,
    p1 = 0,
    p13 = 0,
    p14 = 0,
    p3 = 0,
  } = agregatComptableCollectivite;

  return {
    actifImmobilise: a1,
    immobilisationsIncorporelles: a11,
    subventionsVersees: a111,
    immobilisationsIncorporellesCours: a112,
    immobilisationsCorporelles: a12,
    capitauxPropres: p1,
    resultat: p13,
    subventionsTransferables: p14,
    dettes: p3,
  };
};

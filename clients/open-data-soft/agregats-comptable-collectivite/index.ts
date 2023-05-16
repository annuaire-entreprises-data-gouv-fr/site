import { HttpNotFound } from '#clients/exceptions';
import { Siret } from '#utils/helpers';
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
export const clientAgregatsComptableCollectivite = async (
  siret: Siret,
  metadata: string,
  search: string,
  year: string
) => {
  const url = search;
  const metaDataUrl = metadata;

  const response = await odsClient(
    {
      url,
      config: { params: { q: `ident:${siret}` } },
    },
    metaDataUrl
  );

  if (response.records.length === 0) {
    throw new HttpNotFound(siret);
  }

  const records = response.records as IAPIAgregatsComptableResponse[];

  return {
    agregatsComptable: mapToDomainObject(records[0]),
    lastModified: response.lastModified,
    year,
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

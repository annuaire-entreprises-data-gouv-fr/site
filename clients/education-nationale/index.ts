import { HttpNotFound } from '#clients/exceptions';
import routes from '#clients/routes';
import { IEtablissementsScolaires } from '#models/etablissements-scolaires';
import { Siren } from '#utils/helpers';
import { httpGet } from '#utils/network';
import { zoneMapping } from './helpers';
import { IEducationNationaleRecord, IEducationNationaleRecords } from './types';

/**
 * Education nationale
 * https://www.education.gouv.fr/annuaire
 * https://api.gouv.fr/documentation/api-annuaire-education
 */
const clientEducationNationale = async (siren: Siren, page: number) => {
  const rows = 30;
  const response = await httpGet(routes.educationNationale.search, {
    params: {
      q: `#startswith(siren_siret, ${siren})`,
      start: (page - 1) * rows,
      rows,
    },
  });

  const data = response.data as IEducationNationaleRecords;

  if (!data.records.length) {
    throw new HttpNotFound(`Cannot found education establishment : ${siren}`);
  }

  return {
    currentPage: page,
    resultCount: data.nhits,
    pageCount: Math.round(data.nhits / data.parameters.rows),
    results: mapToDomainObject(data.records),
  };
};

const mapToDomainObject = (
  records: IEducationNationaleRecord[]
): IEtablissementsScolaires['results'] => {
  return records.map(({ fields }) => ({
    adresse: fields.adresse_1 || '',
    codePostal: fields.code_postal || '',
    idEtablissement: fields.identifiant_de_l_etablissement || '',
    libelleAcademie: fields.libelle_academie || '',
    mail: fields.mail || '',
    nombreEleves: fields.nombre_d_eleves || 0,
    nomCommune: fields.nom_commune || '',
    nomEtablissement: fields.nom_etablissement || '',
    siret: fields.siren_siret || '',
    statut: fields.statut_public_prive || '',
    telephone: fields.telephone || '',
    uai: fields.identifiant_de_l_etablissement || '',
    zone:
      zoneMapping[fields.libelle_academie as keyof typeof zoneMapping] || '',
  }));
};

export { clientEducationNationale };

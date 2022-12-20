import { HttpNotFound } from '#clients/exceptions';
import routes from '#clients/routes';
import { IEducationNationaleEtablissement } from '#models/education-nationale';
import { Siren } from '#utils/helpers';
import { httpGet } from '#utils/network';
import { zoneMapping } from './helpers';
import {
  IEducationNationaleRecord,
  IEducationNationaleRecords,
} from './interfaces';

/**
 * Education nationale
 * https://www.education.gouv.fr/annuaire
 * https://api.gouv.fr/documentation/api-annuaire-education
 */
const clientEducationNationale = async (siren: Siren) => {
  const route = routes.educationNationale;
  const response = await httpGet(route, {
    params: {
      q: `#startswith(siren_siret, ${siren})`,
    },
  });

  const data = response.data as IEducationNationaleRecords;

  if (!data.records.length) {
    throw new HttpNotFound(`Cannot found education establishment : ${siren}`);
  }

  return mapToDomainObject(data.records);
};

const mapToDomainObject = (
  records: IEducationNationaleRecord[]
): IEducationNationaleEtablissement[] => {
  return records.map(({ fields }) => ({
    libelleAcademie: fields.libelle_academie,
    adresse: fields.adresse_1,
    codePostal: fields.code_postal,
    nomCommune: fields.nom_commune,
    email: fields.mail,
    idEtablissement: fields.identifiant_de_l_etablissement,
    nombreEleves: fields.nombre_d_eleves,
    nomEtablissement: fields.nom_etablissement,
    siret: fields.siren_siret,
    statut: fields.statut_public_prive,
    telephone: fields.telephone,
    zone: fields.libelle_academie
      ? zoneMapping[fields.libelle_academie as keyof typeof zoneMapping]
      : '',
  }));
};

export { clientEducationNationale };

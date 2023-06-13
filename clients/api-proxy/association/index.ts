import { HttpNotFound } from '#clients/exceptions';
import routes from '#clients/routes';
import constants from '#models/constants';
import { IDataAssociation } from '#models/index';
import { formatAdresse, IdRna, Siren } from '#utils/helpers';
import { clientAPIProxy } from '../client';
import { IAssociationResponse } from './types';

/**
 * Association through the API proxy
 *
 * Takes either a RNA or Siren, but Siren seems to work much better
 * @param idRna
 */
const clientAssociation = async (numeroRna: IdRna | Siren, useCache = true) => {
  const response = await clientAPIProxy(
    routes.association + numeroRna,
    { timeout: constants.timeout.L },
    useCache
  );

  if (response.identite && Object.keys(response.identite).length === 1) {
    throw new HttpNotFound(numeroRna);
  }
  return mapToDomainObject(response as IAssociationResponse);
};

const mapToDomainObject = (
  association: IAssociationResponse
): IDataAssociation => {
  const { agrement = [] } = association;
  const { objet = '', lib_famille1 = '' } = association.activites || {};
  const {
    nom = '',
    id_ex = '',
    lib_forme_juridique = '',
    date_pub_jo = '',
    date_creat = '',
    date_dissolution = '',
    eligibilite_cec = false,
    regime = '',
    util_publique = false,
  } = association.identite || {};

  console.log(association.compte);

  const {
    num_voie = '',
    type_voie = '',
    cp = '',
    commune = '',
    voie = '',
  } = association?.coordonnees?.adresse_siege || {};

  const {
    commune: communeGestion = '',
    cp: cpGestion = '',
    pays: paysGestion = '',
    voie: voieGestion = '',
  } = association?.coordonnees?.adresse_gestion || {};
  const {
    telephone = '',
    courriel = '',
    site_web = '',
  } = association?.coordonnees || {};

  const protocol = (site_web || '').indexOf('http') === 0 ? '' : 'https://';
  const siteWeb = site_web ? `${protocol}${site_web}` : '';

  return {
    exId: id_ex,
    nomComplet: nom,
    objet,
    telephone,
    libelleFamille: lib_famille1,
    mail: courriel,
    siteWeb,
    agrement: agrement.map((agr) => ({
      ...agr,
      dateAttribution: agr.date_attribution,
    })),
    formeJuridique: lib_forme_juridique,
    utilPublique: util_publique,
    regime,
    datePublicationJournalOfficiel: date_pub_jo,
    dateCreation: date_creat,
    dateDissolution: date_dissolution,
    eligibiliteCEC: eligibilite_cec,
    adresseSiege: formatAdresse({
      numeroVoie: num_voie,
      typeVoie: type_voie,
      libelleVoie: voie,
      codePostal: cp,
      libelleCommune: commune,
    }),
    adresseGestion: formatAdresse({
      libelleVoie: voieGestion,
      codePostal: cpGestion,
      libellePaysEtranger: paysGestion,
      libelleCommune: communeGestion,
    }),
    adresseInconsistency: false,
  };
};

export { clientAssociation };

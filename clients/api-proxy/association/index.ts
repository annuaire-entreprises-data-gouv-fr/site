import { HttpNotFound } from '#clients/exceptions';
import routes from '#clients/routes';
import constants from '#models/constants';
import { IDataAssociation } from '#models/index';
import { IdRna, Siren, formatAdresse } from '#utils/helpers';
import stubClientWithSnapshots from '../../stub-client-with-snaphots';
import { clientAPIProxy } from '../client';
import { IAssociationResponse } from './types';

/**
 * Association through the API proxy
 *
 * Takes either a RNA or Siren, but Siren seems to work much better
 * @param idRna
 */
const clientAssociation = async (
  rnaOrSiren: IdRna | Siren,
  siretSiege: string,
  useCache = true
) => {
  const response = await clientAPIProxy(
    routes.proxy.association + rnaOrSiren,
    { timeout: constants.timeout.L },
    useCache
  );

  if (response.identite && Object.keys(response.identite).length === 1) {
    throw new HttpNotFound(rnaOrSiren);
  }
  return mapToDomainObject(response as IAssociationResponse, siretSiege);
};

const mapToDomainObject = (
  association: IAssociationResponse,
  siretSiege: string
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
    bilans: association.compte
      .filter((c) => c.annee > 0 && c.id_siret === siretSiege)
      .map(
        ({
          dons = 0,
          subv = 0,
          produits = 0,
          charges = 0,
          resultat = 0,
          annee,
        }) => {
          return {
            charges,
            resultat,
            subv,
            dons,
            produits,
            year: annee,
          };
        }
      )
      .sort((c, b) => c.year - b.year),
  };
};

const stubbedClient = stubClientWithSnapshots({
  clientAssociation,
});

export { stubbedClient as clientAssociation };

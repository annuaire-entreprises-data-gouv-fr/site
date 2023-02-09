import { fetchAssociation } from '#clients/api-proxy';
import routes from '#clients/routes';
import { formatAdresse, IdRna } from '#utils/helpers';
import { httpGet } from '#utils/network';
import { IAssociationResponse } from './interfaces';

const clientAssociation = async (numeroRna: IdRna) => {
  const response = await fetchAssociation(numeroRna);
  return mapToDomainObject(numeroRna, response as IAssociationResponse);
};

const mapToDomainObject = (idRna: IdRna, association: IAssociationResponse) => {
  const {
    activites: { objet, lib_famille1 },
    identite: {
      nom,
      id_ex = '',
      lib_forme_juridique,
      date_pub_jo,
      date_creat,
      date_dissolution,
      eligibilite_cec,
      regime,
      util_publique,
    },
    coordonnees: {
      adresse_siege: { num_voie, type_voie, cp, commune, voie },
      adresse_gestion: {
        commune: communeGestion,
        cp: cpGestion,
        pays: paysGestion,
        voie: voieGestion,
      },
      telephone,
      courriel,
      site_web,
    },
    agrement,
  } = association;

  return {
    id: idRna,
    exId: id_ex,
    nomComplet: nom,
    objet,
    telephone,
    libelleFamille: lib_famille1,
    mail: courriel,
    siteWeb: site_web,
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

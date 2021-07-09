import odsClient from '.';
import { IAnnoncesBodacc } from '../../models/annonces-bodacc';
import { formatDate } from '../../utils/helpers/formatting';
import { Siren } from '../../utils/helpers/siren-and-siret';
import { logWarningInSentry } from '../../utils/sentry';
import routes from '../routes';

type IBodaccRecords = IBodaccA | IBodaccB | IBodaccC;

interface IBodaccCoreRecord {
  tribunal: string; // "TRIBUNAL DE COMMERCE DE BORDEAUX"
  cp: string; // "33150"
  region_code: number; // 75
  region_nom_officiel: string; //'Île-de-France';
  numerodepartement: string; // "33"
  departement_nom_officiel: string; // "Gironde"
  id: string; // "A202002333642"
  publicationavis_facette: string; // "Bodacc A"
  registre: string; // "833 310 592,833310592"
  ville: string; // "Cenon"
  commercant: string; // "DJ BATIMENT"
  dateparution: string; // "2020-11-30"
  parution: string; // "20200233"
  typeavis: string; // "annonce"
  typeavis_lib: string; // "Avis initial"
  familleavis: string; // "collective"
  familleavis_lib: string; // "Procédures collectives"
  publicationavis: string; // "A"
  listepersonnes: string; // "{\"personne\": {\"typePersonne\": \"pm\", \"activite\": \"travaux de bâtiment et de rénovation intérieur et extérieur, peinture, ravalement, maçonnerie, plomberie, électricité.\", \"denomination\": \"DJ BATIMENT\", \"formeJuridique\": \"Société par actions simplifiée à associé unique\", \"numeroImmatriculation\": {\"codeRCS\": \"RCS\", \"numeroIdentification\": \"833 310 592\", \"nomGreffeImmat\": \"Bordeaux\"}, \"adresseSiegeSocial\": {\"ville\": \"Cenon\", \"pays\": \"france\", \"typeVoie\": \"rue\", \"codePostal\": \"33150\", \"numeroVoie\": \"16\", \"nomVoie\": \"du 8 Mai 1945\"}}}"
  numeroannonce: number; // 993
}

interface IBodaccA extends IBodaccCoreRecord {
  jugement?: string; // "{\"date\": \"2020-11-19\", \"complementJugement\": \"Jugement prononçant la clôture de la procédure de liquidation judiciaire pour insuffisance d'actif.\", \"type\": \"initial\", \"famille\": \"Jugement de clôture\", \"nature\": \"Jugement de clôture pour insuffisance d'actif\"}"
  acte?: string;
  // ex acte  :`{"creation": {"categorieCreation": "Immatriculation d'une personne physique suite à création d'un établissement principal"}, "dateCommencementActivite": "2017-10-01"}`
}

interface IBodaccC extends IBodaccCoreRecord {
  depot?: string; //'{"dateCloture": "2018-12-31", "typeDepot": "Comptes consolidés et rapports"}';
}

interface IBodaccB extends IBodaccCoreRecord {
  modificationsgenerales?: string;
  radiationaurcs?: string; // "{\"radiationPM\": \"O\"}"
}

const fetchAnnoncesBodacc = async (siren: Siren) => {
  const url = `${routes.bodacc.ods}&q=registre%3A${siren}&sort=dateparution&facet=publicationavis&facet=publicationavis_facette&facet=typeavis&facet=typeavis_lib&facet=familleavis&facet=familleavis_lib&facet=numerodepartement&facet=departement_nom_officiel`;
  const response = (await odsClient(url)) as IBodaccRecords[];

  return response.map(mapToDomainObject);
};

const mapToDomainObject = (annonce: IBodaccRecords): IAnnoncesBodacc => {
  return {
    titre: annonce.familleavis_lib || '',
    sousTitre: `BODACC ${annonce.publicationavis} n°${annonce.parution}`,
    typeAvisLibelle: annonce.typeavis_lib || '',
    tribunal: annonce.tribunal || '',
    numeroAnnonce: annonce.numeroannonce || 0,
    datePublication: formatDate(annonce.dateparution) || '',
    details: extractDetails(annonce),
    path: `${routes.bodacc.site.annonce}${annonce.publicationavis}/${annonce.parution}/${annonce.numeroannonce}`,
  };
};

const extractDetails = (annonce: IBodaccRecords): string => {
  try {
    if ((annonce as IBodaccA).jugement) {
      const jugement = JSON.parse((annonce as IBodaccA).jugement || '{}');
      return jugement.complementJugement;
    }
    if ((annonce as IBodaccA).acte) {
      const acte = JSON.parse((annonce as IBodaccA).acte || '{}');
      const dateDebutActivite = formatDate(acte.dateCommencementActivite);
      const dateImmatriculation = formatDate(acte.dateImmatriculation);
      if (acte.creation) {
        return `${acte.creation.categorieCreation || ''} ${
          dateImmatriculation ? `, immatriculée le ${dateImmatriculation}` : ''
        } ${
          dateDebutActivite
            ? `, dont l'activité a commencé le ${dateDebutActivite}`
            : ''
        }`;
      }
      return acte.complementJugement;
    }

    if ((annonce as IBodaccC).depot) {
      const depot = JSON.parse((annonce as IBodaccC).depot || '{}');
      return `${depot.typeDepot} de l’exercice clôt le ${depot.dateCloture}`;
    }
    if ((annonce as IBodaccB).radiationaurcs) {
      const radiationaurcs = JSON.parse(
        (annonce as IBodaccB).radiationaurcs || '{}'
      );
      const dateRadiation = formatDate(
        (radiationaurcs.radiationPP || {}).dateCessationActivitePP
      );

      return dateRadiation ? `Radiation le ${dateRadiation}` : '';
    }
    if ((annonce as IBodaccB).modificationsgenerales) {
      const modif = JSON.parse(
        (annonce as IBodaccB).modificationsgenerales || '{}'
      );
      return modif.descriptif;
    }
    return '';
  } catch (e) {
    logWarningInSentry('Unexpected error while parsing BODACC :' + e, {
      details: annonce.registre,
    });
    return '';
  }
};

export default fetchAnnoncesBodacc;

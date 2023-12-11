import odsClient from '#clients/open-data-soft';
import routes from '#clients/routes';
import { stubClient } from '#clients/stub-client-with-snaphots';
import { IAnnoncesBodacc } from '#models/annonces';
import { Exception } from '#models/exceptions';
import { Siren, formatDate } from '#utils/helpers';
import { logWarningInSentry } from '#utils/sentry';

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

const clientBodacc = async (siren: Siren): Promise<IAnnoncesBodacc> => {
  const searchUrl = `${routes.bodacc.ods.search}&q=registre%3A${siren}&sort=dateparution&facet=publicationavis&facet=publicationavis_facette&facet=typeavis&facet=typeavis_lib&facet=familleavis&facet=familleavis_lib&facet=numerodepartement&facet=departement_nom_officiel`;
  const metaDataUrl = routes.bodacc.ods.metadata;
  const response = await odsClient({ url: searchUrl }, metaDataUrl);

  return {
    annonces: response.records.map(mapToDomainObject),
    lastModified: response.lastModified,
    procedures: response.records
      .map(extractProcedure)
      .filter((a: any) => a !== null),
  };
};

const mapToDomainObject = (annonce: IBodaccRecords) => {
  return {
    titre: annonce.familleavis_lib || '',
    sousTitre: `BODACC ${annonce.publicationavis} n°${annonce.parution}`,
    typeAvisLibelle: annonce.typeavis_lib || '',
    tribunal: annonce.tribunal || '',
    numeroAnnonce: annonce.numeroannonce || 0,
    datePublication: annonce.dateparution || '',
    details: extractDetails(annonce) || '',
    path: `${routes.bodacc.site.annonce}${annonce.publicationavis}/${annonce.parution}/${annonce.numeroannonce}`,
  };
};

const extractProcedure = (annonce: IBodaccRecords): any | undefined => {
  try {
    if ((annonce as IBodaccA).jugement) {
      const jugement = JSON.parse((annonce as IBodaccA).jugement || '{}');

      const isProcedure = annonce.familleavis_lib === 'Procédures collectives';
      if (isProcedure) {
        return {
          date: jugement.date,
          details: jugement.nature,
        };
      }
    }

    return null;
  } catch (e: any) {
    logWarningInSentry(
      new BodaccParsingException({
        cause: e,
        context: { details: annonce.registre },
      })
    );
    return null;
  }
};

const extractDetails = (annonce: IBodaccRecords): string => {
  try {
    if ((annonce as IBodaccA).jugement) {
      const jugement = JSON.parse((annonce as IBodaccA).jugement || '{}');
      return jugement.complementJugement;
    }
    if ((annonce as IBodaccA).acte) {
      const acte = JSON.parse((annonce as IBodaccA).acte || '{}');

      const detail = acte.creation?.categorieCreation; // || acte.descriptif; descriptif is usually very long
      const dateDebutActivite = formatDate(acte.dateCommencementActivite);
      const dateImmatriculation = formatDate(acte.dateImmatriculation);
      return `${detail || ''} ${
        dateImmatriculation ? `, immatriculée le ${dateImmatriculation}` : ''
      } ${
        dateDebutActivite
          ? `, dont l'activité a commencé le ${dateDebutActivite}`
          : ''
      }`;
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
  } catch (e: any) {
    logWarningInSentry(
      new BodaccParsingException({
        cause: e,
        context: {
          details: annonce.registre,
        },
      })
    );
    return '';
  }
};

type IBodaccParsingExceptionArguments = {
  cause: any;
  context: {
    details: string;
  };
};
class BodaccParsingException extends Exception {
  constructor(args: IBodaccParsingExceptionArguments) {
    super({ name: 'BodaccParsingException', ...args });
  }
}

const stubbedClientBodacc = stubClient({
  clientBodacc,
});

export default stubbedClientBodacc;

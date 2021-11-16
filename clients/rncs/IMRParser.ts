import parser from 'fast-xml-parser';
import { IBeneficiaire, IDirigeant, IIdentite } from '../../models/dirigeants';
import {
  formatFloatFr,
  formatIntFr,
  formatYYYYMMDDString,
} from '../../utils/helpers/formatting';
import { Siren } from '../../utils/helpers/siren-and-siret';
import { libelleFromCodeGreffe } from '../../utils/labels';
import { logWarningInSentry } from '../../utils/sentry';
import { HttpNotFound, HttpServerError } from '../exceptions';

import {
  IRNCSBeneficiaireResponse,
  IRNCSIdentiteResponse,
  IRNCSRepresentantResponse,
  IRNCSResponse,
  IRNCSResponseDossier,
} from './IMR';

export class InvalidFormatError extends HttpServerError {
  constructor(message: string) {
    super(500, 'Unable to parse XML :' + message);
  }
}

export const extractIMRFromXml = (responseAsXml: string, siren: Siren) => {
  try {
    const response = parseXmlToJson(responseAsXml);
    const dossiers = extractDossiers(response, siren);
    const dirigeants = extractRepresentants(dossiers);
    const beneficiaires = extractBeneficiaires(dossiers);
    const identite = extractIdentite(dossiers, siren);

    return {
      dirigeants,
      beneficiaires,
      identite,
    };
  } catch (e) {
    if (e instanceof HttpNotFound) {
      throw e;
    }
    throw new InvalidFormatError(e);
  }
};

const parseXmlToJson = (xmlString: string): IRNCSResponse => {
  const tObj = parser.getTraversalObj(xmlString, {
    arrayMode: false,
    ignoreAttributes: false,
  });
  return parser.convertToJson(tObj, { arrayMode: false });
};

const extractDossiers = (
  response: IRNCSResponse,
  siren: Siren
): IRNCSResponseDossier[] => {
  const isDossierArray = Array.isArray(response.fichier.dossier);
  const dossier = (
    isDossierArray ? response.fichier.dossier : [response.fichier.dossier]
  ) as IRNCSResponseDossier[];

  let dossiersWithRepresentants = dossier.filter(
    (element) => element.representants !== undefined
  );

  return dossiersWithRepresentants;
};

const selectRelevantRecord = (array: any[][]): any[] => {
  if (array.length === 0) {
    return [];
  }

  // if several possibilities, use the record with the most elements
  return array.sort((a, b) => b.length - a.length)[0];
};

//==============
// Representants
//==============

const extractRepresentants = (dossiers: IRNCSResponseDossier[]) => {
  const representants = dossiers.reduce(
    (aggregate: IRNCSRepresentantResponse[][], dossier) => {
      const representant = dossier?.representants?.representant;
      if (representant) {
        const representantArray = Array.isArray(representant)
          ? representant
          : [representant];

        aggregate.push(representantArray);
      }

      return aggregate;
    },
    []
  );
  return selectRelevantRecord(representants).map(mapToDomainDirigeant);
};

const mapToDomainDirigeant = (
  dirigeant: IRNCSRepresentantResponse
): IDirigeant => {
  const {
    prenoms,
    nom_patronymique,
    lieu_naiss,
    code_pays_naiss,
    dat_naiss,
    qualites,
    form_jur,
    siren,
    denomination,
    type,
  } = dirigeant;

  const qualite = (qualites || {}).qualite;
  const roles = Array.isArray(qualite) ? qualite.join(', ') : qualite;

  if (type === 'P.Physique') {
    return {
      sexe: null,
      prenom: (prenoms || '').split(' ')[0],
      nom: nom_patronymique || '',
      role: roles || '',
      lieuNaissance: (lieu_naiss || '') + ', ' + (code_pays_naiss || ''),
      dateNaissance: (dat_naiss || '').toString().slice(0, 4),
    };
  } else {
    const sirenAsString = (siren || '').toString();
    return {
      siren: sirenAsString,
      denomination: denomination || '',
      role: roles || '',
      natureJuridique: form_jur || '',
    };
  }
};

//==============
// Dirigeants
//==============

const extractBeneficiaires = (dossiers: IRNCSResponseDossier[]) => {
  const beneficiaires = dossiers.reduce(
    (aggregate: IRNCSBeneficiaireResponse[][], dossier) => {
      const beneficiaire = dossier?.beneficiaires?.beneficiaire;
      if (beneficiaire) {
        const benef = Array.isArray(beneficiaire)
          ? beneficiaire
          : [beneficiaire];

        aggregate.push(benef);
      }

      return aggregate;
    },
    []
  );
  return selectRelevantRecord(beneficiaires).map(mapToDomainBeneficiaires);
};

const mapToDomainBeneficiaires = (
  beneficiaire: IRNCSBeneficiaireResponse
): IBeneficiaire => {
  const { nom_naissance, prenoms, date_naissance, nationalite } = beneficiaire;

  return {
    nom: nom_naissance || '',
    prenoms: prenoms || '',
    dateNaissance: (date_naissance || '').toString(),
    nationalite: nationalite || '',
  };
};

//==============
// Identite / Immatriculation
//==============

const extractIdentite = (dossiers: IRNCSResponseDossier[], siren: string) => {
  if (dossiers.filter((d) => d.identite).length > 1) {
    logWarningInSentry('Found several identite in IMR', { siren });
  }

  const dossier = dossiers[0];
  return mapToDomainIdentite(dossier.identite, dossier);
};

const mapToDomainIdentite = (
  identite: IRNCSIdentiteResponse,
  dossier: IRNCSResponseDossier
): IIdentite => {
  const {
    date_greffe,
    dat_immat,
    date_debut_activ,
    dat_1ere_immat,
    identite_PM,
    dat_rad,
    dat_cessat_activite,
  } = identite;

  const {
    denomination,
    sigle,
    type_cap,
    montant_cap,
    devise_cap,
    duree_pm,
    dat_cloture_exer,
  } = identite_PM;

  const capital = `${formatFloatFr(montant_cap)} ${devise_cap} (${
    type_cap === 'F' ? 'fixe' : 'variable'
  })`;
  const denominationComplete = denomination + (sigle ? `(${sigle})` : '');
  const codeGreffe = dossier['@_code_greffe'];
  const greffe = libelleFromCodeGreffe(codeGreffe);
  const dateImmatriculation = dat_1ere_immat
    ? dat_1ere_immat
    : dat_immat
    ? formatYYYYMMDDString(dat_immat.toString())
    : '';

  return {
    denomination: denominationComplete,
    greffe,
    codeGreffe, //'7501',
    numeroRCS: `RCS ${greffe} ${formatIntFr(dossier['@_siren'])}`,
    numGestion: dossier['@_num_gestion'], // '2020B02214',
    dateImmatriculation,
    dateDebutActiv: date_debut_activ || '',
    dureePersonneMorale: duree_pm || '',
    dateClotureExercice: dat_cloture_exer || '',
    dateGreffe: date_greffe ? formatYYYYMMDDString(date_greffe.toString()) : '', // YYYYMMDD
    capital,
    dateRadiation: dat_rad ? formatYYYYMMDDString(dat_rad.toString()) : '', // YYYYMMDD
    dateCessationActivite: dat_cessat_activite || '',
  };
};

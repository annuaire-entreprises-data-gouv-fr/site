import { HttpNotFound, HttpServerError } from '#clients/exceptions';
import routes from '#clients/routes';
import stubClientWithSnapshots from '#clients/stub-client-with-snaphots';
import constants from '#models/constants';
import {
  IEtablissementsList,
  createEtablissementsList,
} from '#models/etablissements-list';
import { estActif } from '#models/etat-administratif';
import { IEtablissement, createDefaultEtablissement } from '#models/index';
import {
  Siren,
  Siret,
  agregateTripleFields,
  extractSirenFromSiret,
  formatAdresse,
} from '#utils/helpers';
import { libelleFromCodeNAF } from '#utils/helpers/formatting/labels';
import { InseeClientOptions, inseeClientGet } from '.';
import {
  etatFromEtatAdministratifInsee,
  parseDateCreationInsee,
  statuDiffusionFromStatutDiffusionInsee,
} from '../../utils/helpers/insee-variables';

type IInseeEtablissementResponse = {
  etablissement: IInseeEtablissement;
  etablissements: IInseeEtablissement[];
};

type IInseeEtablissementsResponse = {
  header: { total: number; debut: number; nombre: number };
  etablissements: IInseeEtablissement[];
};

type IInseeEtablissement = {
  siret: Siret;
  nic: string;
  etablissementSiege: string;
  statutDiffusionEtablissement: string;
  trancheEffectifsEtablissement: string;
  anneeEffectifsEtablissement: string;
  dateCreationEtablissement: string;
  dateDernierTraitementEtablissement: string;
  activitePrincipaleRegistreMetiersEtablissement: string;
  periodesEtablissement: {
    dateFin: string;
    dateDebut: string;
    enseigne1Etablissement: string;
    enseigne2Etablissement: string;
    enseigne3Etablissement: string;
    denominationUsuelleEtablissement: string;
    etatAdministratifEtablissement: string;
    changementEtatAdministratifEtablissement: boolean;
    activitePrincipaleEtablissement: string;
    nomenclatureActivitePrincipaleEtablissement: string;
  }[];
  adresseEtablissement: {
    complementAdresseEtablissement: string;
    numeroVoieEtablissement: string;
    indiceRepetitionEtablissement: string;
    typeVoieEtablissement: string;
    libelleVoieEtablissement: string;
    codePostalEtablissement: string;
    libelleCommuneEtablissement: string;
    distributionSpecialeEtablissement: string;
    codeCedexEtablissement: string;
    libelleCedexEtablissement: string;
    libelleCommuneEtrangerEtablissement: string;
    codePaysEtrangerEtablissement: string;
    libellePaysEtrangerEtablissement: string;
  };
  uniteLegale: IInseeetablissementUniteLegale;
};

interface IInseeetablissementUniteLegale {
  sigleUniteLegale: string;
  dateCreationUniteLegale: string;
  periodesUniteLegale: string;
  dateDernierTraitementUniteLegale: string;
  trancheEffectifsUniteLegale: string;
  anneeEffectifsUniteLegale: string;
  statutDiffusionUniteLegale: string;
  prenom1UniteLegale: string;
  sexeUniteLegale: string;
  identifiantAssociationUniteLegale: string;
  nicSiegeUniteLegale: string;
  dateDebut: string;
  activitePrincipaleUniteLegale: string;
  categorieJuridiqueUniteLegale: string;
  denominationUniteLegale: string;
  economieSocialeSolidaireUniteLegale: string;
  etatAdministratifUniteLegale: string;
  nomUniteLegale: string;
}

const clientAllEtablissementsInsee = async (
  siren: string,
  page = 1,
  options: InseeClientOptions
): Promise<IEtablissementsList> => {
  const etablissementsPerPage = constants.resultsPerPage.etablissements;
  const cursor = Math.max(page - 1, 0) * etablissementsPerPage;

  const { header, etablissements } =
    await inseeClientGet<IInseeEtablissementsResponse>(
      routes.sireneInsee.siret,
      options,
      {
        params: {
          q: `siren:${siren}`,
          nombre: etablissementsPerPage,
          debut: cursor,
        },
      }
    );

  const allEtablissements = etablissements.map((e) =>
    mapEtablissementToDomainObject(e)
  );

  return {
    etablissements: createEtablissementsList(
      allEtablissements,
      page,
      header.total
    ),
  };
};

const clientEtablissementInsee = async (
  siret: Siret,
  options: InseeClientOptions
) => {
  const { etablissement, etablissements } =
    await inseeClientGet<IInseeEtablissementResponse>(
      routes.sireneInsee.siret + siret,
      options
    );

  if (!etablissement && etablissements) {
    if (etablissements.length === 1) {
      return mapEtablissementToDomainObject(etablissements[0], siret);
    }
    throw new HttpServerError(
      'INSEE returns multiple siret for one etablissement'
    );
  }
  return mapEtablissementToDomainObject(etablissement, siret);
};

const clientSiegeInsee = async (
  siren: Siren,
  options: InseeClientOptions
): Promise<IEtablissement> => {
  const { etablissements } = await inseeClientGet<IInseeEtablissementResponse>(
    routes.sireneInsee.siret,
    options,
    {
      params: {
        q: `etablissementSiege:true AND siren:${siren}`,
      },
    }
  );

  return mapEtablissementToDomainObject(etablissements[0]);
};

const mapEtablissementToDomainObject = (
  inseeEtablissement: IInseeEtablissement,
  oldSiret?: Siret
): IEtablissement => {
  // There cases of inseeEtablissement undefined.
  // For instance 89898637700015 that returns an etablissementS instead of etablissement and that also returns a different siren/siret
  // as sirene.fr doesnot display it, we dont either

  if (!inseeEtablissement) {
    throw new HttpNotFound('Not Found');
  }

  const {
    nic,
    siret,
    etablissementSiege,
    trancheEffectifsEtablissement,
    anneeEffectifsEtablissement,
    dateCreationEtablissement,
    dateDernierTraitementEtablissement,
    adresseEtablissement,
    statutDiffusionEtablissement,
    periodesEtablissement,
  } = inseeEtablissement;

  // get last periode to obtain most recent data
  const {
    activitePrincipaleEtablissement,
    denominationUsuelleEtablissement,
    enseigne1Etablissement,
    enseigne2Etablissement,
    enseigne3Etablissement,
    etatAdministratifEtablissement,
    nomenclatureActivitePrincipaleEtablissement,
  } = periodesEtablissement[0];

  const enseigne =
    agregateTripleFields(
      enseigne1Etablissement,
      enseigne2Etablissement,
      enseigne3Etablissement
    ) || '';

  // get last state change to obtain closing date
  let lastStateChange =
    periodesEtablissement.find(
      (periode) => periode.changementEtatAdministratifEtablissement === true
    ) || periodesEtablissement[0];

  const statutDiffusion = statuDiffusionFromStatutDiffusionInsee(
    statutDiffusionEtablissement,
    siret
  );

  const etatAdministratif = etatFromEtatAdministratifInsee(
    etatAdministratifEtablissement,
    siret
  );

  const dateFermeture = !estActif({ etatAdministratif })
    ? lastStateChange.dateDebut
    : null;

  const defaultEtablissement = createDefaultEtablissement();

  const {
    complementAdresseEtablissement,
    numeroVoieEtablissement,
    indiceRepetitionEtablissement,
    typeVoieEtablissement,
    libelleVoieEtablissement,
    codePostalEtablissement,
    libelleCommuneEtablissement,
    distributionSpecialeEtablissement,
    codeCedexEtablissement,
    libelleCedexEtablissement,
    libelleCommuneEtrangerEtablissement,
    codePaysEtrangerEtablissement,
    libellePaysEtrangerEtablissement,
  } = adresseEtablissement;

  const codePostal = codePostalEtablissement;
  const adresse = formatAdresse({
    complement: complementAdresseEtablissement,
    numeroVoie: numeroVoieEtablissement,
    indiceRepetition: indiceRepetitionEtablissement,
    typeVoie: typeVoieEtablissement,
    libelleVoie: libelleVoieEtablissement,
    codePostal,
    libelleCommune: libelleCommuneEtablissement,
    distributionSpeciale: distributionSpecialeEtablissement,
    codeCedex: codeCedexEtablissement,
    libelleCommuneCedex: libelleCedexEtablissement,
    libelleCommuneEtranger: libelleCommuneEtrangerEtablissement,
    codePaysEtranger: codePaysEtrangerEtablissement,
    libellePaysEtranger: libellePaysEtrangerEtablissement,
  });

  const adressePostale = adresse
    ? `${
        denominationUsuelleEtablissement
          ? `${denominationUsuelleEtablissement}, `
          : ''
      }${adresse}`
    : '';

  return {
    ...defaultEtablissement,
    siren: extractSirenFromSiret(siret),
    siret,
    oldSiret: oldSiret || siret,
    nic,
    enseigne,
    denomination: denominationUsuelleEtablissement || '',
    dateCreation: parseDateCreationInsee(dateCreationEtablissement),
    activitePrincipale: activitePrincipaleEtablissement,
    libelleActivitePrincipale: libelleFromCodeNAF(
      activitePrincipaleEtablissement,
      nomenclatureActivitePrincipaleEtablissement,
      false
    ),
    dateDerniereMiseAJour: dateDernierTraitementEtablissement,
    estSiege: !!etablissementSiege,
    statutDiffusion,
    etatAdministratif,
    dateFermeture,
    trancheEffectif: trancheEffectifsEtablissement,
    anneeTrancheEffectif: anneeEffectifsEtablissement,
    adresse,
    adressePostale,
    codePostal,
    commune: libelleCommuneEtablissement,
  };
};

const stubbedClientAllEtablissementsInsee = stubClientWithSnapshots({
  clientAllEtablissementsInsee,
});

const stubbedClientEtablissementInsee = stubClientWithSnapshots({
  clientEtablissementInsee,
});

const stubbedClientSiegeInsee = stubClientWithSnapshots({
  clientSiegeInsee,
});

export {
  stubbedClientAllEtablissementsInsee as clientAllEtablissementsInsee,
  stubbedClientEtablissementInsee as clientEtablissementInsee,
  stubbedClientSiegeInsee as clientSiegeInsee,
};

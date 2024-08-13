import routes from '#clients/routes';
import stubClientWithSnapshots from '#clients/stub-client-with-snaphots';
import { createEtablissementsList } from '#models/core/etablissements-list';
import { estActif } from '#models/core/etat-administratif';
import {
  createDefaultEtablissement,
  createDefaultUniteLegale,
  IEtablissement,
  IUniteLegale,
} from '#models/core/types';
import {
  agregateTripleFields,
  formatFirstNames,
  formatNameFull,
  isEntrepreneurIndividuelFromNatureJuridique,
  Siren,
  Siret,
} from '#utils/helpers';
import {
  libelleFromCategoriesJuridiques,
  libelleFromCodeNAF,
} from '#utils/helpers/formatting/labels';
import { inseeClientGet, InseeClientOptions } from '.';
import {
  etatFromEtatAdministratifInsee,
  parseDateCreationInsee,
  statuDiffusionFromStatutDiffusionInsee,
} from '../../utils/helpers/insee-variables';
import { clientSiegeInsee } from './siret';

type IInseeUniteLegaleResponse = {
  uniteLegale: {
    siren: Siren;
    sigleUniteLegale: string;
    dateCreationUniteLegale: string;
    periodesUniteLegale: IPeriodeUniteLegale[];
    dateDernierTraitementUniteLegale: string;
    trancheEffectifsUniteLegale: string;
    anneeEffectifsUniteLegale: string;
    statutDiffusionUniteLegale: string;
    categorieEntreprise: string;
    anneeCategorieEntreprise: string;
    prenom1UniteLegale: string;
    prenom2UniteLegale: string;
    prenom3UniteLegale: string;
    prenom4UniteLegale: string;
    prenomUsuelUniteLegale: string;
    sexeUniteLegale: 'M' | 'F';
    identifiantAssociationUniteLegale: string | null;
  };
};

type IPeriodeUniteLegale = {
  nicSiegeUniteLegale: string;
  etatAdministratifUniteLegale: string;
  economieSocialeSolidaireUniteLegale: string | null;
  dateDebut: string;
  activitePrincipaleUniteLegale: string;
  nomenclatureActivitePrincipaleUniteLegale: string;
  categorieJuridiqueUniteLegale: string;
  denominationUniteLegale: string;
  caractereEmployeurUniteLegale: string;
  nomUniteLegale: string;
  nomUsageUniteLegale: string;
  denominationUsuelle1UniteLegale: string;
  denominationUsuelle2UniteLegale: string;
  denominationUsuelle3UniteLegale: string;
};

const clientUniteLegaleInsee = async (
  siren: Siren,
  options: InseeClientOptions
) => {
  const { useCache, useFallback } = options;
  const [dataUniteLegale, siege] = await Promise.all([
    inseeClientGet<IInseeUniteLegaleResponse>(
      routes.sireneInsee.siren + siren,
      { useCache },
      useFallback
    ),
    clientSiegeInsee(siren, options).catch(() => null),
  ]);

  return mapToDomainObject(siren, dataUniteLegale, siege);
};

const mapToDomainObject = (
  originalSiren: Siren,
  response: IInseeUniteLegaleResponse,
  siege: IEtablissement | null
): IUniteLegale => {
  const {
    siren,
    sigleUniteLegale,
    dateCreationUniteLegale,
    periodesUniteLegale,
    dateDernierTraitementUniteLegale,
    trancheEffectifsUniteLegale,
    anneeEffectifsUniteLegale,
    statutDiffusionUniteLegale,
    prenomUsuelUniteLegale,
    identifiantAssociationUniteLegale,
    categorieEntreprise,
    anneeCategorieEntreprise,
  } = response.uniteLegale;

  const {
    nicSiegeUniteLegale,
    dateDebut,
    activitePrincipaleUniteLegale = '',
    nomenclatureActivitePrincipaleUniteLegale,
    categorieJuridiqueUniteLegale,
    denominationUniteLegale,
    economieSocialeSolidaireUniteLegale,
    etatAdministratifUniteLegale,
    caractereEmployeurUniteLegale,
    nomUniteLegale,
    nomUsageUniteLegale,
    denominationUsuelle1UniteLegale,
    denominationUsuelle2UniteLegale,
    denominationUsuelle3UniteLegale,
  } = periodesUniteLegale[0];

  const libelleActivitePrincipaleUniteLegale = libelleFromCodeNAF(
    activitePrincipaleUniteLegale,
    nomenclatureActivitePrincipaleUniteLegale,
    false
  );

  if (!siege) {
    siege = createDefaultEtablissement();

    if (periodesUniteLegale && periodesUniteLegale.length > 0) {
      siege.siren = siren;
      siege.siret = (siren + nicSiegeUniteLegale) as Siret;
      siege.nic = nicSiegeUniteLegale;
      siege.dateCreation = dateDebut;
      siege.activitePrincipale = activitePrincipaleUniteLegale;
      siege.libelleActivitePrincipale = libelleActivitePrincipaleUniteLegale;
      siege.estSiege = true;
      siege.trancheEffectif = '';
    }
  }

  const allSiegesSiret = Array.from(
    new Set(
      periodesUniteLegale.map((e) => (siren + e.nicSiegeUniteLegale) as Siret)
    )
  );

  /**
   *   either siege nom commercial or pre 2008 unite legale nom commercial
   *  https://www.sirene.fr/sirene/public/variable/denominationUsuelleEtablissement
   */
  const denominationUsuelle =
    siege.denomination ||
    agregateTripleFields(
      denominationUsuelle1UniteLegale,
      denominationUsuelle2UniteLegale,
      denominationUsuelle3UniteLegale
    ) ||
    '';

  // EI names and firstName
  // remove trailing whitespace in case name or firstname is missing
  const names = `${formatFirstNames([prenomUsuelUniteLegale])} ${formatNameFull(
    nomUniteLegale,
    nomUsageUniteLegale
  )}`.trim();

  const nomComplet = `${denominationUniteLegale || names || 'Nom inconnu'}${
    denominationUsuelle ? ` (${denominationUsuelle})` : ''
  }${sigleUniteLegale ? ` (${sigleUniteLegale})` : ''}`;

  const defaultUniteLegale = createDefaultUniteLegale(siren);

  const estEntrepreneurIndividuel = isEntrepreneurIndividuelFromNatureJuridique(
    categorieJuridiqueUniteLegale
  );

  const dateDernierTraitement = (dateDernierTraitementUniteLegale || '').split(
    'T'
  )[0];

  const etatAdministratif = etatFromEtatAdministratifInsee(
    etatAdministratifUniteLegale,
    siren
  );

  return {
    ...defaultUniteLegale,
    siren,
    oldSiren: originalSiren,
    siege,
    allSiegesSiret,
    natureJuridique: categorieJuridiqueUniteLegale || '',
    libelleNatureJuridique: libelleFromCategoriesJuridiques(
      categorieJuridiqueUniteLegale
    ),
    activitePrincipale: activitePrincipaleUniteLegale,
    libelleActivitePrincipale: libelleActivitePrincipaleUniteLegale,
    etablissements: createEtablissementsList([siege]),
    dateCreation: parseDateCreationInsee(dateCreationUniteLegale),
    dateDerniereMiseAJour: new Date().toISOString(),
    dateMiseAJourInsee: dateDernierTraitement,
    dateMiseAJourInpi: '',
    dateDebutActivite: dateDebut,
    dateFermeture: !estActif({ etatAdministratif }) ? dateDebut : '',
    etatAdministratif,
    statutDiffusion: statuDiffusionFromStatutDiffusionInsee(
      statutDiffusionUniteLegale,
      siren
    ),
    nomComplet,
    chemin: siren,
    trancheEffectif:
      trancheEffectifsUniteLegale ??
      (caractereEmployeurUniteLegale === 'N' ? 'N' : null),
    anneeTrancheEffectif: anneeEffectifsUniteLegale,
    categorieEntreprise,
    anneeCategorieEntreprise,
    complements: {
      ...defaultUniteLegale.complements,
      estEntrepreneurIndividuel,
      estEss: economieSocialeSolidaireUniteLegale === 'O',
    },
    association: {
      idAssociation: identifiantAssociationUniteLegale || null,
    },
  };
};

const stubbedClient = stubClientWithSnapshots({
  clientUniteLegaleInsee,
});
export { stubbedClient as clientUniteLegaleInsee };

import { HttpForbiddenError } from '#clients/exceptions';
import routes from '#clients/routes';
import stubClientWithSnapshots from '#clients/stub-client-with-snaphots';
import { createNonDiffusibleEtablissement } from '#models/core/etablissement';
import { createEtablissementsList } from '#models/core/etablissements-list';
import { estActif } from '#models/core/etat-administratif';
import {
  createDefaultEtablissement,
  createDefaultUniteLegale,
  IUniteLegale,
} from '#models/core/types';
import {
  agregateTripleFields,
  capitalize,
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
import {
  clientAllEtablissementsInsee,
  clientEtablissementInsee,
} from './siret';

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

type TmpUniteLegale = {
  uniteLegale: IUniteLegale;
  tmpUniteLegale: {
    denomination: string;
    denominationUsuelle: string;
    sigle: string;
  };
};

const clientUniteLegaleInsee = async (
  siren: Siren,
  page = 1,
  options: InseeClientOptions
): Promise<IUniteLegale> => {
  const { uniteLegale, tmpUniteLegale } = await clientTmpUniteLegale(
    siren,
    options
  );

  const siretSiege = uniteLegale.siege.siret;

  const [realSiege, allEtablissements] = await Promise.all([
    clientEtablissementInsee(siretSiege, options).catch((e) => {
      if (e instanceof HttpForbiddenError) {
        return createNonDiffusibleEtablissement(uniteLegale.siege.siret);
      }
      return null;
    }), // better empty etablissement list than failing UL
    clientAllEtablissementsInsee(siren, page, options).catch(() => null),
  ]);

  const siege = realSiege || uniteLegale.siege;

  const denominationUsuelle =
    siege?.denomination || tmpUniteLegale.denominationUsuelle || '';

  const nomComplet = `${tmpUniteLegale.denomination}${
    denominationUsuelle ? ` (${denominationUsuelle})` : ''
  }${tmpUniteLegale.sigle ? ` (${tmpUniteLegale.sigle})` : ''}`;

  const etablissementsList = allEtablissements?.list || [siege];
  etablissementsList.forEach(
    (e) =>
      (e.ancienSiege = uniteLegale.anciensSiegesSirets.indexOf(e.siret) > -1)
  );

  const etablissements = createEtablissementsList(
    etablissementsList,
    allEtablissements?.page || 1,
    allEtablissements?.count || 1
  );

  return {
    ...uniteLegale,
    siege,
    nomComplet,
    etablissements,
  };
};

const clientTmpUniteLegale = async (
  siren: Siren,
  options: InseeClientOptions
) => {
  const { useCache, useFallback } = options;
  const dataUniteLegale = await inseeClientGet<IInseeUniteLegaleResponse>(
    routes.sireneInsee.siren + siren,
    { useCache },
    useFallback
  );

  return mapToDomainObject(siren, dataUniteLegale);
};

const mapToDomainObject = (
  originalSiren: Siren,
  response: IInseeUniteLegaleResponse
): TmpUniteLegale => {
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

  const siege = createDefaultEtablissement();

  if (periodesUniteLegale && periodesUniteLegale.length > 0) {
    siege.nic = nicSiegeUniteLegale;
    siege.siren = siren;
    siege.siret = (siren + nicSiegeUniteLegale) as Siret;
    siege.dateCreation = dateDebut;
    siege.activitePrincipale = '';
    siege.libelleActivitePrincipale = '';
    siege.estSiege = true;
    siege.trancheEffectif = '';
  }

  /**
   *   either siege nom commercial or pre 2008 unite legale nom commercial
   *  https://www.sirene.fr/sirene/public/variable/denominationUsuelleEtablissement
   */
  const denominationUsuelleUniteLegale =
    siege.denomination ||
    agregateTripleFields(
      denominationUsuelle1UniteLegale,
      denominationUsuelle2UniteLegale,
      denominationUsuelle3UniteLegale
    ) ||
    '';

  // EI names and firstName
  // remove trailing whitespace in case name or firstname is missing
  const names = `${capitalize(prenomUsuelUniteLegale)} ${formatNameFull(
    nomUniteLegale,
    nomUsageUniteLegale
  )}`.trim();

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
    uniteLegale: {
      ...defaultUniteLegale,
      siren,
      oldSiren: originalSiren,
      siege,
      anciensSiegesSirets: Array.from(
        new Set(
          periodesUniteLegale
            .map((e) => (siren + e.nicSiegeUniteLegale) as Siret)
            .filter((e) => e !== siege.siret)
        )
      ),
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
      nomComplet: '',
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
    },
    tmpUniteLegale: {
      denominationUsuelle: denominationUsuelleUniteLegale,
      denomination: denominationUniteLegale || names || 'Nom inconnu',
      sigle: sigleUniteLegale,
    },
  };
};

const stubbedClient = stubClientWithSnapshots({
  clientUniteLegaleInsee,
});
export { stubbedClient as clientUniteLegaleInsee };

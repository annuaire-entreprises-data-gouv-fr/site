import routes from '#clients/routes';
import { createEtablissementsList } from '#models/etablissements-list';
import { IEtatCivil } from '#models/immatriculation/rncs';
import {
  createDefaultEtablissement,
  createDefaultUniteLegale,
  IUniteLegale,
} from '#models/index';
import {
  agregateTripleFields,
  formatFirstNames,
  formatNameFull,
  Siren,
  Siret,
  isEntrepreneurIndividuelFromNatureJuridique,
} from '#utils/helpers';
import {
  libelleFromCategoriesJuridiques,
  libelleFromCodeEffectif,
  libelleFromCodeNAF,
  libelleFromeCodeCategorie,
} from '#utils/labels';
import { inseeClientGet, InseeClientOptions } from '.';
import {
  etatFromEtatAdministratifInsee,
  statuDiffusionFromStatutDiffusionInsee,
} from './helpers';

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

export const clientUniteLegaleInsee = async (
  siren: Siren,
  options: InseeClientOptions
) => {
  const response = await inseeClientGet(
    routes.sireneInsee.siren + siren,
    options
  );

  const data = response.data as IInseeUniteLegaleResponse;

  return mapToDomainObject(siren, data);
};

const mapToDomainObject = (
  originalSiren: Siren,
  response: IInseeUniteLegaleResponse
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
    sexeUniteLegale,
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

  const siege = createDefaultEtablissement();

  if (periodesUniteLegale && periodesUniteLegale.length > 0) {
    siege.siren = siren;
    //@ts-ignore
    siege.siret = siren + nicSiegeUniteLegale;
    siege.nic = nicSiegeUniteLegale;
    siege.dateCreation = dateDebut;
    siege.activitePrincipale = activitePrincipaleUniteLegale;
    siege.libelleActivitePrincipale = libelleFromCodeNAF(
      activitePrincipaleUniteLegale,
      nomenclatureActivitePrincipaleUniteLegale
    );
    siege.estSiege = true;
    siege.trancheEffectif = '';
  }

  const allSiegesSiret = Array.from(
    new Set(
      periodesUniteLegale.map((e) => (siren + e.nicSiegeUniteLegale) as Siret)
    )
  );

  // pre 2008 denomination https://www.sirene.fr/sirene/public/variable/denominationUsuelleEtablissement
  const denominationUsuelle =
    agregateTripleFields(
      denominationUsuelle1UniteLegale,
      denominationUsuelle2UniteLegale,
      denominationUsuelle3UniteLegale
    ) || '';

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

  // when unknwon, dateCreation is set to 1900-01-01 by Insee instead of null
  const dateCreation =
    dateCreationUniteLegale === '1900-01-01' ? '' : dateCreationUniteLegale;

  const dirigeant = {
    sexe: sexeUniteLegale,
    prenom: formatFirstNames([prenomUsuelUniteLegale]),
    nom: formatNameFull(nomUniteLegale, nomUsageUniteLegale),
  } as IEtatCivil;

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
    activitePrincipale: siege.activitePrincipale,
    libelleActivitePrincipale: siege.libelleActivitePrincipale,
    etablissements: createEtablissementsList([siege]),
    dateCreation,
    dateDerniereMiseAJour: (dateDernierTraitementUniteLegale || '').split(
      'T'
    )[0],
    dateDebutActivite: dateDebut,
    etatAdministratif: etatFromEtatAdministratifInsee(
      etatAdministratifUniteLegale,
      siren
    ),
    statutDiffusion: statuDiffusionFromStatutDiffusionInsee(
      statutDiffusionUniteLegale,
      siren
    ),
    nomComplet,
    chemin: siren,
    trancheEffectif: trancheEffectifsUniteLegale,
    libelleTrancheEffectif: libelleFromCodeEffectif(
      trancheEffectifsUniteLegale,
      anneeEffectifsUniteLegale,
      caractereEmployeurUniteLegale
    ),
    libelleCategorieEntreprise: libelleFromeCodeCategorie(
      categorieEntreprise,
      anneeCategorieEntreprise
    ),
    dirigeant: estEntrepreneurIndividuel ? dirigeant : null,
    complements: {
      ...defaultUniteLegale.complements,
      estEntrepreneurIndividuel,
      estEss: economieSocialeSolidaireUniteLegale === 'O',
    },
    association: {
      idAssociation: identifiantAssociationUniteLegale || null,
      data: null,
    },
  };
};

import { inseeClientGet, InseeClientOptions } from '.';
import {
  createDefaultEtablissement,
  createDefaultUniteLegale,
  IUniteLegale,
  splitByStatus,
} from '../../models';
import { IEtatCivil } from '../../models/immatriculation/rncs';
import { isEntrepreneurIndividuelFromNatureJuridique } from '../../utils/helpers/checks';
import {
  agregateTripleFields,
  formatFirstNames,
  formatNameFull,
} from '../../utils/helpers/formatting';
import { Siren, Siret } from '../../utils/helpers/siren-and-siret';
import {
  libelleFromCategoriesJuridiques,
  libelleFromCodeEffectif,
  libelleFromCodeNAF,
  libelleFromeCodeCategorie,
} from '../../utils/labels';
import routes from '../routes';

interface IInseeUniteLegaleResponse {
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
}
interface IPeriodeUniteLegale {
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
}

const factory = (options: InseeClientOptions) => async (siren: Siren) => {
  const request = await inseeClientGet(
    routes.sireneInsee.siren + siren,
    options
  );
  const response = request.data as IInseeUniteLegaleResponse;

  return mapToDomainObject(siren, response);
};

/**
 * Call to Sirene INSEE API
 * @param siren
 */
export const getUniteLegaleInsee = factory({
  useCache: true,
  useFallback: false,
});

/**
 * Call to Sirene INSEE API - use fallback token
 * @param siren
 */
export const getUniteLegaleInseeFallback = factory({
  useCache: true,
  useFallback: true,
});

/**
 * Call to Sirene INSEE API - disable cache
 * @param siren
 */
export const getUniteLegaleInseeNoCache = factory({
  useCache: false,
  useFallback: false,
});

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
    prenom1UniteLegale,
    prenom2UniteLegale,
    prenom3UniteLegale,
    prenom4UniteLegale,
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

  const dirigeant = {
    sexe: sexeUniteLegale,
    prenom: formatFirstNames([
      prenom1UniteLegale,
      prenom2UniteLegale,
      prenom3UniteLegale,
      prenom4UniteLegale,
    ]),
    nom: formatNameFull(nomUniteLegale, nomUsageUniteLegale),
  } as IEtatCivil;

  return {
    ...defaultUniteLegale,
    siren,
    oldSiren: originalSiren,
    association: identifiantAssociationUniteLegale
      ? { id: identifiantAssociationUniteLegale }
      : null,
    siege,
    allSiegesSiret,
    natureJuridique: categorieJuridiqueUniteLegale,
    libelleNatureJuridique: libelleFromCategoriesJuridiques(
      categorieJuridiqueUniteLegale
    ),
    activitePrincipale: siege.activitePrincipale,
    libelleActivitePrincipale: siege.libelleActivitePrincipale,
    etablissements: splitByStatus([siege]),
    dateCreation: dateCreationUniteLegale,
    dateDerniereMiseAJour: (dateDernierTraitementUniteLegale || '').split(
      'T'
    )[0],
    dateDebutActivite: dateDebut,
    estActive: etatAdministratifUniteLegale === 'A',
    estDiffusible: statutDiffusionUniteLegale !== 'N',
    estEntrepreneurIndividuel,
    estEss: economieSocialeSolidaireUniteLegale === 'O',
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
  };
};

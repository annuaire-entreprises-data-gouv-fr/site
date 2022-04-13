import { inseeClientGet, INSEE_CREDENTIALS } from '.';
import {
  createDefaultEtablissement,
  createDefaultUniteLegale,
  IUniteLegale,
} from '../../models';
import { IEtatCivil } from '../../models/immatriculation/rncs';
import { isEntrepreneurIndividuelFromNatureJuridique } from '../../utils/helpers/checks';
import {
  capitalize,
  formatFirstNames,
  formatNameFull,
} from '../../utils/helpers/formatting';
import { Siren } from '../../utils/helpers/siren-and-siret';
import { tvaIntracommunautaireFromSiren } from '../../utils/helpers/tva-intracommunautaire';
import {
  libelleFromCategoriesJuridiques,
  libelleFromCodeEffectif,
  libelleFromCodeNaf,
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
  categorieJuridiqueUniteLegale: string;
  denominationUniteLegale: string;
  caractereEmployeurUniteLegale: string;
  nomUniteLegale: string;
  nomUsageUniteLegale: string;
}

/**
 * Call to Sirene INSEE API - can be used with the fallback token
 * @param siren
 * @param useInseeFallback
 * @returns
 */
export const getUniteLegaleInsee = async (siren: Siren) => {
  const request = await inseeClientGet(routes.sireneInsee.siren + siren);
  const response = request as IInseeUniteLegaleResponse;

  return mapToDomainObject(siren, response);
};

export const getUniteLegaleInseeWithFallbackCredentials = async (
  siren: Siren
) => {
  const request = await inseeClientGet(
    routes.sireneInsee.siren + siren,
    INSEE_CREDENTIALS.FALLBACK
  );
  const response = request as IInseeUniteLegaleResponse;

  return mapToDomainObject(siren, response);
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
    categorieJuridiqueUniteLegale,
    denominationUniteLegale,
    economieSocialeSolidaireUniteLegale,
    etatAdministratifUniteLegale,
    caractereEmployeurUniteLegale,
    nomUniteLegale,
    nomUsageUniteLegale,
  } = periodesUniteLegale[0];

  const siege = createDefaultEtablissement();

  if (periodesUniteLegale && periodesUniteLegale.length > 0) {
    siege.siren = siren;
    //@ts-ignore
    siege.siret = siren + nicSiegeUniteLegale;
    siege.nic = nicSiegeUniteLegale;
    siege.estActif = null;
    siege.dateCreation = dateDebut;
    siege.activitePrincipale = activitePrincipaleUniteLegale;
    siege.libelleActivitePrincipale = libelleFromCodeNaf(
      activitePrincipaleUniteLegale
    );
    siege.estSiege = true;
    siege.trancheEffectif = '';
  }

  const nomComplet = `${
    capitalize(denominationUniteLegale) ||
    `${formatFirstNames([prenomUsuelUniteLegale])} ${formatNameFull(
      nomUniteLegale,
      nomUsageUniteLegale
    )}` ||
    'Nom inconnu'
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
    numeroTva: tvaIntracommunautaireFromSiren(siren),
    association: identifiantAssociationUniteLegale
      ? { id: identifiantAssociationUniteLegale }
      : null,
    siege,
    natureJuridique: categorieJuridiqueUniteLegale,
    libelleNatureJuridique: libelleFromCategoriesJuridiques(
      categorieJuridiqueUniteLegale
    ),
    activitePrincipale: siege.activitePrincipale,
    libelleActivitePrincipale: siege.libelleActivitePrincipale,
    etablissements: [siege],
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

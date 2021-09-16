import { inseeClientGet, INSEE_CREDENTIALS } from '.';
import {
  createDefaultEtablissement,
  createDefaultUniteLegale,
  IUniteLegale,
} from '../../models';
import { IEtatCivil } from '../../models/dirigeants';
import { isEntrepreneurIndividuelFromNatureJuridique } from '../../utils/helpers/checks';
import { Siren, verifySiret } from '../../utils/helpers/siren-and-siret';
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
  siren: Siren,
  response: IInseeUniteLegaleResponse
): IUniteLegale => {
  const {
    sigleUniteLegale,
    dateCreationUniteLegale,
    periodesUniteLegale,
    dateDernierTraitementUniteLegale,
    trancheEffectifsUniteLegale,
    anneeEffectifsUniteLegale,
    statutDiffusionUniteLegale,
    prenom1UniteLegale,
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
  } = periodesUniteLegale[0];

  const safeActivitePrincipaleUniteLegale = (
    activitePrincipaleUniteLegale || ''
  ).replace('.', '');

  const siege = createDefaultEtablissement();

  if (periodesUniteLegale && periodesUniteLegale.length > 0) {
    siege.siren = siren;
    siege.siret = verifySiret(siren + nicSiegeUniteLegale);
    siege.nic = nicSiegeUniteLegale;
    siege.estActif = null;
    siege.dateCreation = dateDebut;
    siege.activitePrincipale = safeActivitePrincipaleUniteLegale;
    siege.libelleActivitePrincipale = libelleFromCodeNaf(
      safeActivitePrincipaleUniteLegale
    );
    siege.estSiege = true;
    siege.trancheEffectif = '';
  }

  const nomComplet = `${(
    denominationUniteLegale ||
    `${prenom1UniteLegale} ${nomUniteLegale}` ||
    'Nom inconnu'
  ).toLowerCase()}${sigleUniteLegale ? ` (${sigleUniteLegale})` : ''}`;

  const defaultUniteLegale = createDefaultUniteLegale(siren);

  const estEntrepreneurIndividuel = isEntrepreneurIndividuelFromNatureJuridique(
    categorieJuridiqueUniteLegale
  );

  const dirigeant = {
    sexe: sexeUniteLegale,
    prenom: prenom1UniteLegale,
    nom: nomUniteLegale,
  } as IEtatCivil;

  return {
    ...defaultUniteLegale,
    siren: siren,
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

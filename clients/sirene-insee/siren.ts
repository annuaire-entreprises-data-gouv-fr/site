import { inseeClientGet, INSEE_CREDENTIALS } from '.';
import {
  IEtablissement,
  createDefaultUniteLegale,
  IUniteLegale,
} from '../../models';
import {
  libelleFromCodeEffectif,
  libelleFromCategoriesJuridiques,
} from '../../utils/labels';
import { HttpForbiddenError } from '../exceptions';
import routes from '../routes';
import { isEntrepreneurIndividuelFromNatureJuridique } from '../../utils/helpers/checks';
import { Siren } from '../../utils/helpers/siren-and-siret';
import { tvaIntracommunautaireFromSiren } from '../../utils/helpers/tva-intracommunautaire';
import { IEtatCivil } from '../../models/dirigeants';
import { mapEtablissementToDomainObject } from './siret';
import {
  IInseeEtablissementResponse,
  IInseeetablissementUniteLegale,
} from './types';

const getUniteLegaleWithSiegeFactory =
  (credential: INSEE_CREDENTIALS) => async (siren: Siren) => {
    const response = (await inseeClientGet(
      routes.sireneInsee.siege + siren,
      credential
    )) as IInseeEtablissementResponse;

    const siege = mapEtablissementToDomainObject(response.etablissements[0]);
    const uniteLegale = mapUniteLegaleToDomainObject(
      siren,
      response.etablissements[0].uniteLegale,
      siege
    );
    return {
      ...uniteLegale,
      siege,
    };
  };

const mapUniteLegaleToDomainObject = (
  siren: Siren,
  response: IInseeetablissementUniteLegale,
  siege: IEtablissement
): IUniteLegale => {
  const {
    sigleUniteLegale,
    dateCreationUniteLegale,
    dateDernierTraitementUniteLegale,
    trancheEffectifsUniteLegale,
    anneeEffectifsUniteLegale,
    statutDiffusionUniteLegale,
    prenom1UniteLegale,
    sexeUniteLegale,
    identifiantAssociationUniteLegale,
    categorieJuridiqueUniteLegale,
    denominationUniteLegale,
    economieSocialeSolidaireUniteLegale,
    etatAdministratifUniteLegale,
    nomUniteLegale,
  } = response;

  if (statutDiffusionUniteLegale === 'N') {
    throw new HttpForbiddenError(403, 'Forbidden (non diffusible)');
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
    dateDebutActivite: siege.dateDebutActivite || siege.dateFermeture || '',
    estActive: etatAdministratifUniteLegale === 'A',
    estDiffusible: statutDiffusionUniteLegale !== 'N',
    estEntrepreneurIndividuel,
    estEss: economieSocialeSolidaireUniteLegale === 'O',
    nomComplet,
    chemin: siren,
    trancheEffectif: trancheEffectifsUniteLegale,
    libelleTrancheEffectif: libelleFromCodeEffectif(
      trancheEffectifsUniteLegale,
      anneeEffectifsUniteLegale
    ),
    dirigeant: estEntrepreneurIndividuel ? dirigeant : null,
  };
};

export const getUniteLegaleWithSiegeInsee = getUniteLegaleWithSiegeFactory(
  INSEE_CREDENTIALS.DEFAULT
);

export const getUniteLegaleWithSiegeInseeWithFallbackCredentials =
  getUniteLegaleWithSiegeFactory(INSEE_CREDENTIALS.FALLBACK);

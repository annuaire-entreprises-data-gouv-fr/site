import { inseeClientGet, InseeForbiddenError, INSEE_CREDENTIALS } from '.';
import {
  createDefaultEtablissement,
  createDefaultUniteLegale,
  IUniteLegale,
} from '../../models';
import { isEntrepreneurIndividuelFromNatureJuridique } from '../../utils/helpers/checks';
import { Siren } from '../../utils/helpers/siren-and-siret';
import { tvaIntracommunautaireFromSiren } from '../../utils/helpers/tva-intracommunautaire';
import {
  libelleFromCategoriesJuridiques,
  libelleFromCodeEffectif,
  libelleFromCodeNaf,
} from '../../utils/labels';
import routes from '../routes';

interface IInseeUniteLegaleResponse {
  uniteLegale: {
    sigleUniteLegale: string;
    dateCreationUniteLegale: string;
    periodesUniteLegale: IPeriodeUniteLegale[];
    dateDernierTraitementUniteLegale: string;
    trancheEffectifsUniteLegale: string;
    statutDiffusionUniteLegale: string;
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
  const response = (await request.json()) as IInseeUniteLegaleResponse;

  return mapToDomainObject(siren, response);
};

export const getUniteLegaleInseeWithFallbackCredentials = async (
  siren: Siren
) => {
  const request = await inseeClientGet(
    routes.sireneInsee.siren + siren,
    INSEE_CREDENTIALS.FALLBACK
  );
  const response = (await request.json()) as IInseeUniteLegaleResponse;

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
    statutDiffusionUniteLegale,
    prenom1UniteLegale,
    sexeUniteLegale,
    identifiantAssociationUniteLegale,
  } = response.uniteLegale;

  const {
    nicSiegeUniteLegale,
    dateDebut,
    activitePrincipaleUniteLegale = '',
    categorieJuridiqueUniteLegale,
    denominationUniteLegale,
    economieSocialeSolidaireUniteLegale,
    etatAdministratifUniteLegale,
    nomUniteLegale,
  } = periodesUniteLegale[0];

  if (statutDiffusionUniteLegale === 'N') {
    throw new InseeForbiddenError(403, 'Forbidden (non diffusible)');
  }

  const safeActivitePrincipaleUniteLegale = (
    activitePrincipaleUniteLegale || ''
  ).replace('.', '');

  const siege = createDefaultEtablissement();

  if (periodesUniteLegale && periodesUniteLegale.length > 0) {
    siege.siren = siren;
    siege.siret = siren + nicSiegeUniteLegale;
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
  };

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
    estActive: etatAdministratifUniteLegale === 'A',
    estDiffusible: statutDiffusionUniteLegale !== 'N',
    estEntrepreneurIndividuel,
    estEss: economieSocialeSolidaireUniteLegale === 'O',
    nomComplet,
    chemin: siren,
    trancheEffectif: trancheEffectifsUniteLegale,
    libelleTrancheEffectif: libelleFromCodeEffectif(
      trancheEffectifsUniteLegale
    ),
    dirigeant: estEntrepreneurIndividuel ? dirigeant : null,
  };
};

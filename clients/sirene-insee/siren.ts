import { inseeClientGet, InseeForbiddenError } from '.';
import {
  createDefaultEtablissement,
  createDefaultUniteLegale,
  IUniteLegale,
} from '../../models';
import { isEntrepreneurIndividuelFromNatureJuridique } from '../../utils/helpers/est-entrepreneur-individuel';
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

export const getUniteLegaleInsee = async (siren: string) => {
  const request = await inseeClientGet(routes.sireneInsee.siren + siren);
  const response = (await request.json()) as IInseeUniteLegaleResponse;

  return mapToDomainObject(siren, response);
};

const mapToDomainObject = (
  siren: string,
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
    estEntrepreneurIndividuel: isEntrepreneurIndividuelFromNatureJuridique(
      categorieJuridiqueUniteLegale
    ),
    estEss: economieSocialeSolidaireUniteLegale === 'O',
    nomComplet,
    chemin: siren,
    trancheEffectif: trancheEffectifsUniteLegale,
    libelleTrancheEffectif: libelleFromCodeEffectif(
      trancheEffectifsUniteLegale
    ),
  };
};

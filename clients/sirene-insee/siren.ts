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
  };
}
interface IPeriodeUniteLegale {
  nicSiegeUniteLegale: string;
  etatAdministratifUniteLegale: string;
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
    // identifiantAssociationUniteLegale,
  } = response.uniteLegale;

  const {
    nicSiegeUniteLegale,
    etatAdministratifUniteLegale,
    dateDebut,
    activitePrincipaleUniteLegale = '',
    categorieJuridiqueUniteLegale,
    denominationUniteLegale,
    nomUniteLegale,
  } = periodesUniteLegale[0];

  if (statutDiffusionUniteLegale === 'N') {
    throw new InseeForbiddenError(403, 'Forbidden (non diffusible)');
  }

  const siege = createDefaultEtablissement();

  if (periodesUniteLegale && periodesUniteLegale.length > 0) {
    siege.siren = siren;
    siege.siret = siren + nicSiegeUniteLegale;
    siege.nic = nicSiegeUniteLegale;
    siege.estActif = etatAdministratifUniteLegale === 'A';
    siege.dateCreation = dateDebut;
    siege.activitePrincipale = activitePrincipaleUniteLegale.replace('.', '');
    siege.libelleActivitePrincipale = libelleFromCodeNaf(
      activitePrincipaleUniteLegale.replace('.', '')
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
    estActive: statutDiffusionUniteLegale === 'O',
    estDiffusible: statutDiffusionUniteLegale !== 'N',
    estEntrepreneurIndividuel: isEntrepreneurIndividuelFromNatureJuridique(
      categorieJuridiqueUniteLegale
    ),
    nomComplet,
    chemin: siren,
    trancheEffectif: trancheEffectifsUniteLegale,
  };
};

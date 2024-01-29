import { HttpNotFound } from '#clients/exceptions';
import {
  clientAnnuaireServicePublicByName,
  clientAnnuaireServicePublicBySiret,
} from '#clients/open-data-soft/clients/annuaire-service-public';
import { EAdministration } from '#models/administrations/EAdministration';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import { FetchRessourceException } from '#models/exceptions';
import { Siret } from '#utils/helpers';
import logErrorInSentry from '#utils/sentry';
import { IEtablissement, IUniteLegale, isServicePublic } from '..';

export interface IServicePublic {
  adresseCourriel: string | null;
  adressePostale: string | null;
  affectationPersonne: IAffectationPersonne | null;
  categorie: 'SI' | 'SIL' | 'SL' | null;
  formulaireContact: string | null;
  lastModified: string;
  mission: string | null;
  nom: string | null;
  sigle: string | null;
  liens: Array<ILien>;
  telephone: string | null;
  typeOrganisme:
    | null
    | 'Administration centrale (ou Ministère)'
    | 'Ambassade ou mission diplomatique'
    | "Association d'utilité publique"
    | 'Autorité administrative indépendante'
    | 'Autorité publique indépendante'
    | 'Cabinet ministériel'
    | 'Collectivité locale'
    | 'Conseil, comité, commission (organisme consultatif)'
    | 'Direction départementale interministérielle'
    | "Groupement d'intérêt public"
    | 'Institution'
    | 'Institution européenne'
    | 'Juridiction'
    | 'Préfecture, sous-préfecture'
    | "Secrétaire d'État"
    | 'Service déconcentré'
    | 'Service à compétence nationale'
    | 'Syndicat mixte'
    | "Établissement d'enseignement";
  urlServicePublic: string | null;
}
type ILien = {
  libelle: string;
  valeur: string;
};
type IAffectationPersonne = Array<{
  nom: string;
  fonction: string;
  lienTexteAffectation: ILien;
}>;

export const getServicePublicByUniteLegale = async (
  uniteLegale: IUniteLegale
): Promise<IServicePublic | IAPINotRespondingError> => {
  try {
    if (!isServicePublic(uniteLegale)) {
      return APINotRespondingFactory(EAdministration.DILA, 404);
    }

    const servicePublicBySiret = await clientAnnuaireServicePublicBySiret(
      uniteLegale.siege.siret
    );

    if (servicePublicBySiret) {
      return servicePublicBySiret;
    }

    return await clientAnnuaireServicePublicByName(uniteLegale.nomComplet);
  } catch (e: any) {
    return mapToError(e, uniteLegale.siege.siret, uniteLegale.nomComplet);
  }
};

export const getServicePublicByEtablissement = async (
  etablissement: IEtablissement
): Promise<IServicePublic | IAPINotRespondingError> => {
  try {
    return await clientAnnuaireServicePublicBySiret(etablissement.siret);
  } catch (e: any) {
    return mapToError(e, etablissement.siret);
  }
};

function mapToError(e: any, siret: Siret, details?: string) {
  if (e instanceof HttpNotFound) {
    return APINotRespondingFactory(EAdministration.DILA, 404);
  }
  logErrorInSentry(
    new FetchRessourceException({
      ressource: 'AnnuaireServicePublic',
      cause: e,
      context: {
        siret,
        details,
      },
      administration: EAdministration.DILA,
    })
  );
  return APINotRespondingFactory(EAdministration.DILA, 500);
}

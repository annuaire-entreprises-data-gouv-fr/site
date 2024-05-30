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
import {
  IEtablissement,
  IUniteLegale,
  isServicePublic,
} from '#models/core/types';
import { FetchRessourceException } from '#models/exceptions';
import { Siret } from '#utils/helpers';
import logErrorInSentry from '#utils/sentry';

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
  liens: {
    organigramme: ILien | null;
    annuaireServicePublic: ILien | null;
    formulaireContact: ILien | null;
    sitesInternet: Array<ILien>;
  };
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
  subServicesId: string[];
}
type ILien = {
  libelle: string;
  valeur: string;
};
type IAffectationPersonne = Array<{
  nom: string | null;
  fonction: string;
  lienTexteAffectation: ILien | null;
}>;

export const getServicePublicByUniteLegale = async (
  uniteLegale: IUniteLegale,
  options: { isBot: boolean }
): Promise<IServicePublic | IAPINotRespondingError | null> => {
  try {
    if (options.isBot || !isServicePublic(uniteLegale)) {
      return null;
    }

    return await clientAnnuaireServicePublicBySiret(uniteLegale.siege.siret);
  } catch (eSiret: any) {
    try {
      if (!(eSiret instanceof HttpNotFound)) {
        throw eSiret;
      }
      return await clientAnnuaireServicePublicByName(uniteLegale.nomComplet);
    } catch (eName: any) {
      return mapToError(eName, uniteLegale.siege.siret, uniteLegale.nomComplet);
    }
  }
};

export const getServicePublicByEtablissement = async (
  uniteLegale: IUniteLegale,
  etablissement: IEtablissement,
  options: { isBot: boolean }
): Promise<IServicePublic | IAPINotRespondingError | null> => {
  try {
    if (options.isBot || !isServicePublic(uniteLegale)) {
      return null;
    }
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

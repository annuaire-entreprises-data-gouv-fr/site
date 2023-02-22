import { clientApiEntrepriseAssociation } from '#clients/api-entreprise/association';
import { HttpNotFound } from '#clients/exceptions';
import { EAdministration } from '#models/administrations';
import {
  APINotRespondingFactory,
  IAPINotRespondingError,
} from '#models/api-not-responding';
import { getUniteLegaleFromSlug } from '#models/unite-legale';
import { verifySiren } from '#utils/helpers';
import logErrorInSentry from '#utils/sentry';
import { IUniteLegale } from '..';

export interface IAssoDocument {
  nom: string;
  etat: string;
  commentaire: string;
  annee: string;
  url: string;
}

export interface ISubventionsDocument {
  statuts: { annee: string; url: string } | null;
  dac: {
    siret: string;
    adresse: string;
    estSiege: boolean;
    hasDocument: boolean;
    comptes: IAssoDocument[];
    rapportFinancier: IAssoDocument[];
    rapportActivite: IAssoDocument[];
    exerciceComptable: any[];
  }[];
}

export interface ISubventionsAssociation {
  uniteLegale: IUniteLegale;
  subventionsDocuments: ISubventionsDocument | IAPINotRespondingError;
}

export const getAssoSubventionsWithUniteLegaleFromSlug = async (
  slug: string
): Promise<ISubventionsAssociation> => {
  const siren = verifySiren(slug);
  const [uniteLegale, subventionsDocuments] = await Promise.all([
    getUniteLegaleFromSlug(siren, {}),
    clientApiEntrepriseAssociation(siren).catch((e) => {
      if (e instanceof HttpNotFound) {
        return APINotRespondingFactory(EAdministration.DINUM, 404);
      }

      logErrorInSentry('Error in API Entreprise', {
        siren,
        details: e.toString(),
      });
      return APINotRespondingFactory(EAdministration.DINUM, e.status || 500);
    }),
  ]);

  return {
    uniteLegale,
    subventionsDocuments,
  };
};

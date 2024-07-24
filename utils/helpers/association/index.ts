import { IAssociationEtablissement } from '#models/espace-agent/association-protected';
import { InternalError } from '#models/exceptions';
import logErrorInSentry from '#utils/sentry';
import { formatSiret } from '../siren-and-siret';

export const extractAssociationEtablissements = (
  etablissements: { etablissement: IAssociationEtablissement }[]
) => {
  try {
    return Object.values(
      etablissements.reduce<Record<string, IAssociationEtablissement>>(
        (acc, e) => {
          acc[e.etablissement.siret] = e.etablissement;
          return acc;
        },
        {}
      )
    ).map((k) => ({
      value: k.siret,
      label: `${formatSiret(k.siret)} - ${k.adresse}`,
    }));
  } catch (e) {
    logErrorInSentry(
      new InternalError({
        message: 'Failed to extract association etablissement',
        cause: e,
      })
    );

    return [];
  }
};

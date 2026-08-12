import { EAdministration } from "#/models/administrations/e-administration";
import {
  APINotRespondingFactory,
  type IAPINotRespondingError,
  isAPI404,
  isAPINotResponding,
} from "#/models/api-not-responding";
import {
  ApplicationRights,
  ApplicationRightsToScopes,
} from "#/models/authentication/user/rights";
import { Exception, InternalError } from "#/models/exceptions";
import { getDirigeantsRNE } from "#/models/rne/dirigeants";
import type {
  IDirigeants,
  IDirigeantsMergedIGInpi,
  IDirigeantsWithMetadataMergedIGInpi,
  IEtatCivil,
} from "#/models/rne/types";
import { verifySiren } from "#/utils/helpers";
import { isPersonneMorale } from "#/utils/helpers/is-personne-morale";
import logErrorInSentry from "#/utils/sentry";
import { getMandatairesRCS } from "./mandataires-rcs";
import { mergeDirigeants } from "./utils";

const normalizeComparableValue = (value: string | null | undefined) =>
  (value ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLocaleLowerCase("fr-FR")
    .replaceAll("œ", "oe")
    .replaceAll("æ", "ae")
    .replace(/[^\p{Letter}\p{Number}]/gu, "");

const getComparableBirthdate = (dirigeant: IEtatCivil) =>
  normalizeComparableValue(
    dirigeant.dateNaissancePartial || dirigeant.dateNaissance
  );

// RNE and RCS expose different source-specific fields. Compare the business
// fields they share, at the birthdate precision available in both sources.
const normalizeDirigeant = (dirigeant: IDirigeants[number]) => {
  if (isPersonneMorale(dirigeant)) {
    return JSON.stringify({
      type: "personneMorale",
      siren: normalizeComparableValue(dirigeant.siren),
      denomination: normalizeComparableValue(dirigeant.denomination),
      role: normalizeComparableValue(dirigeant.role),
    });
  }

  return JSON.stringify({
    type: "personnePhysique",
    nom: normalizeComparableValue(dirigeant.nom),
    prenom: normalizeComparableValue(dirigeant.prenom),
    prenoms: normalizeComparableValue(dirigeant.prenoms),
    role: normalizeComparableValue(dirigeant.role),
    dateNaissance: getComparableBirthdate(dirigeant),
  });
};

const haveSameDirigeants = (rneData: IDirigeants, rcsData: IDirigeants) => {
  if (rneData.length !== rcsData.length) {
    return false;
  }

  const normalizedRNE = rneData.map(normalizeDirigeant).sort();
  const normalizedRCS = rcsData.map(normalizeDirigeant).sort();

  return normalizedRNE.every(
    (dirigeant, index) => dirigeant === normalizedRCS[index]
  );
};

export const getDirigeantsProtected = async (
  maybeSiren: string,
  params: { isEI: boolean }
): Promise<IDirigeantsWithMetadataMergedIGInpi | IAPINotRespondingError> => {
  const siren = verifySiren(maybeSiren);

  const [dirigeantsRCS, dirigeantsRNE] = await Promise.all([
    getMandatairesRCS(
      siren,
      ApplicationRightsToScopes[ApplicationRights.mandatairesRCS]
    ),
    getDirigeantsRNE(siren, {}),
  ]);

  if (isAPI404(dirigeantsRCS) && isAPI404(dirigeantsRNE)) {
    return APINotRespondingFactory(EAdministration.INPI, 404);
  }

  if (isAPINotResponding(dirigeantsRCS) && isAPINotResponding(dirigeantsRNE)) {
    return APINotRespondingFactory(EAdministration.INPI, 500);
  }

  try {
    const rneData = isAPINotResponding(dirigeantsRNE) ? [] : dirigeantsRNE.data;
    const rcsData = isAPINotResponding(dirigeantsRCS) ? [] : dirigeantsRCS;

    // EI data is not standardised. It lacks birthdate in RNE and is randomly populated in IG
    let dirigeantMerged: IDirigeantsMergedIGInpi = [];
    if (params.isEI) {
      if (rcsData.length === 0) {
        // Ignore IG
        dirigeantMerged = mergeDirigeants({ rne: rneData, rcs: rneData });
      } else {
        // Ignore INPI
        dirigeantMerged = mergeDirigeants({ rne: rcsData, rcs: rcsData });
      }
    } else {
      dirigeantMerged = mergeDirigeants({ rne: rneData, rcs: rcsData });

      if (!haveSameDirigeants(rneData, rcsData)) {
        logErrorInSentry(
          new Exception({
            name: "DirigeantsRNERCSMismatch",
            message: "Dirigeants RNE/RCS mismatch",
            context: { siren },
          })
        );
      }
    }

    return {
      data: dirigeantMerged,
      metadata: {
        isFallback: Boolean(
          !isAPINotResponding(dirigeantsRNE) &&
            dirigeantsRNE.metadata.isFallback
        ),
      },
    };
  } catch (e: any) {
    logErrorInSentry(
      new InternalError({
        message: "mergeDirigeants",
        cause: e,
        context: {
          details: siren,
        },
      })
    );
    return APINotRespondingFactory(EAdministration.INPI, 500);
  }
};

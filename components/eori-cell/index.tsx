"use client";
import { APIRoutesPaths } from "app/api/data-fetching/routes-paths";
import { useAPIRouteData } from "hooks/fetch/use-API-route-data";
import { CopyPaste } from "#components/table/copy-paste";
import { Icon } from "#components-ui/icon/wrapper";
import InformationTooltip from "#components-ui/information-tooltip";
import { Loader } from "#components-ui/loader";
import { isAPINotResponding } from "#models/api-not-responding";
import type { ISession } from "#models/authentication/user/session";
import {
  hasFetchError,
  isDataLoading,
  isUnauthorized,
} from "#models/data-fetching";
import { formatSiret, type Siret } from "#utils/helpers";

type IProps = {
  siret: Siret;
  session: ISession | null;
};
export default function EORICell({ siret, session }: IProps) {
  const eoriValidation = useAPIRouteData(
    APIRoutesPaths.EoriValidation,
    siret,
    session
  );

  if (isDataLoading(eoriValidation)) {
    return (
      <>
        <Loader />
        &nbsp;
      </>
    );
  }

  if (hasFetchError(eoriValidation) || isUnauthorized(eoriValidation)) {
    return (
      <InformationTooltip
        horizontalOrientation="left"
        label={
          <>
            Nous n’avons pas pu controler la validité du numéro EORI à cause
            d’une erreur de connexion. Vous pouvez essayer de rafraichir la
            page, ou revenir plus tard.
          </>
        }
        left="5px"
        tabIndex={0}
      >
        <Icon color="#df0a00" slug="errorFill">
          <em>Erreur de connexion</em>
        </Icon>
      </InformationTooltip>
    );
  }

  if (isAPINotResponding(eoriValidation)) {
    return (
      <InformationTooltip
        horizontalOrientation="left"
        label={
          <>
            Nous n’avons pas pu controler la validité du numéro EORI car le
            téléservice ne fonctionne pas actuellement. Merci de ré-essayer plus
            tard pour vérifier si cette structure possède un numéro EORI
          </>
        }
        left="5px"
        tabIndex={0}
      >
        <Icon color="#df0a00" slug="errorFill">
          <em>Service indisponible</em>
        </Icon>
      </InformationTooltip>
    );
  }
  return eoriValidation.isValid ? (
    <CopyPaste label="eori" shouldRemoveSpace>
      {"FR " + formatSiret(eoriValidation.eori)}
    </CopyPaste>
  ) : (
    <i>Pas de n° EORI valide</i>
  );
}

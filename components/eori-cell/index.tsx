"use client";
import { useMemo } from "react";
import { getEoriValidationAction } from "server-actions/public/data-fetching";
import { CopyPaste } from "#components/table/copy-paste";
import { Icon } from "#components-ui/icon/wrapper";
import InformationTooltip from "#components-ui/information-tooltip";
import { Loader } from "#components-ui/loader";
import { useServerActionData } from "#hooks/fetch/use-server-action-data";
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
  const input = useMemo(() => ({ siret }), [siret]);
  const eoriValidation = useServerActionData(
    getEoriValidationAction,
    session,
    input
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
      {formatSiret(eoriValidation.eori)}
    </CopyPaste>
  ) : (
    <i>Pas de n° EORI valide</i>
  );
}

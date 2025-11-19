import { use } from "react";
import { CopyPaste } from "#components/table/copy-paste";
import { Icon } from "#components-ui/icon/wrapper";
import InformationTooltip from "#components-ui/information-tooltip";
import {
  type IAPINotRespondingError,
  isAPINotResponding,
} from "#models/api-not-responding";
import {
  hasFetchError,
  type IDataFetchingState,
  isUnauthorized,
} from "#models/data-fetching";
import type { IEORIValidation } from "#models/eori-validation";
import { formatSiret } from "#utils/helpers/siren-and-siret";

type EORICellContentProps = {
  eoriValidation: Promise<
    | IEORIValidation
    | IAPINotRespondingError
    | Exclude<IDataFetchingState, IDataFetchingState.LOADING>
  >;
};

export function EORICellContent({ eoriValidation }: EORICellContentProps) {
  const awaitedEoriValidation = use(eoriValidation);

  if (
    hasFetchError(awaitedEoriValidation) ||
    isUnauthorized(awaitedEoriValidation)
  ) {
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

  if (isAPINotResponding(awaitedEoriValidation)) {
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

  return awaitedEoriValidation.isValid ? (
    <CopyPaste label="eori" shouldRemoveSpace>
      {formatSiret(awaitedEoriValidation.eori)}
    </CopyPaste>
  ) : (
    <i>Pas de n° EORI valide</i>
  );
}

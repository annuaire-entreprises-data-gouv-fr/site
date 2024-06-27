'use client';
import { Icon } from '#components-ui/icon/wrapper';
import InformationTooltip from '#components-ui/information-tooltip';
import { Loader } from '#components-ui/loader';
import NonRenseigne from '#components/non-renseigne';
import { CopyPaste } from '#components/table/copy-paste';
import { isAPINotResponding } from '#models/api-not-responding';
import { IUniteLegale } from '#models/core/types';
import {
  hasFetchError,
  isDataLoading,
  isUnauthorized,
} from '#models/data-fetching';
import { ISession } from '#models/user/session';
import { formatSiret } from '#utils/helpers';
import { useAPIRouteData } from 'hooks/fetch/use-API-route-data';

type IProps = {
  uniteLegale: IUniteLegale;
  session: ISession | null;
};
export default function EORICell(props: IProps) {
  const eoriValidation = useAPIRouteData(
    'eori-validation',
    props.uniteLegale.siege.siret,
    props.session
  );
  if (isDataLoading(eoriValidation))
    return (
      <>
        <Loader />
        &nbsp;
      </>
    );
  if (hasFetchError(eoriValidation) || isUnauthorized(eoriValidation)) {
    return (
      <InformationTooltip
        tabIndex={0}
        label={
          <>
            Nous n’avons pas pu controler la validité du numéro EORI à cause
            d’une erreur de connection. Vous pouvez essayer de rafraichir la
            page, ou revenir plus tard.
          </>
        }
        orientation="left"
        left="5px"
      >
        <Icon slug="errorFill" color="#df0a00">
          <em>Erreur de connection</em>
        </Icon>
      </InformationTooltip>
    );
  }

  if (isAPINotResponding(eoriValidation)) {
    return (
      <InformationTooltip
        tabIndex={0}
        label={
          <>
            Nous n’avons pas pu controler la validité du numéro EORI car le
            téléservice ne fonctionne pas actuellement. Merci de ré-essayer plus
            tard pour vérifier si cette structure possède un numéro EORI
          </>
        }
        orientation="left"
        left="5px"
      >
        <Icon slug="errorFill" color="#df0a00">
          <em>Service indisponible</em>
        </Icon>
      </InformationTooltip>
    );
  }
  return eoriValidation.isValid ? (
    <CopyPaste label="eori" shouldRemoveSpace>
      {'FR ' + formatSiret(eoriValidation.eori)}
    </CopyPaste>
  ) : (
    <NonRenseigne />
  );
}

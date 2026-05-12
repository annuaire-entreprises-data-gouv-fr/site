"use client";

import type { PropsWithChildren } from "react";
import { OpenClosedTag } from "#components-ui/badge/frequent";
import InformationTooltip from "#components-ui/information-tooltip";
import { useFeatureFlag } from "#hooks/use-feature-flag";
import {
  ApplicationRights,
  hasRights,
} from "#models/authentication/user/rights";
import type { ISession } from "#models/authentication/user/session";
import type { IUniteLegale } from "#models/core/types";
import { formatDate } from "#utils/helpers";
import styles from "./style.module.css";

const Wrapper: React.FC<PropsWithChildren<{}>> = ({ children }) => (
  <div className={styles["inscriptions-wrapper"]}>
    <div>{children}</div>
  </div>
);

export const UniteLegaleRadiationRCS = ({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) => {
  const isBodaccRadiationDisplayed = useFeatureFlag(
    "bodacc_radiation_displayed"
  );
  if (
    !isBodaccRadiationDisplayed.isEnabled ||
    !hasRights(session, ApplicationRights.isAgent) ||
    !uniteLegale.bodacc?.radiation?.estRadie
  ) {
    return null;
  }

  return (
    <Wrapper>
      <InformationTooltip
        label={`Cliquez pour voir l'annonce ${uniteLegale.bodacc?.radiation?.idAnnonce}`}
        tabIndex={undefined}
      >
        <a
          href={`https://www.bodacc.fr/pages/annonces-commerciales-detail/?q.id=id:${uniteLegale.bodacc?.radiation?.idAnnonce}`}
        >
          <OpenClosedTag icon="closed" label="Radiée au RCS">
            {uniteLegale.bodacc?.radiation?.date ? (
              <>le {formatDate(uniteLegale.bodacc?.radiation?.date)}</>
            ) : null}
          </OpenClosedTag>
        </a>
      </InformationTooltip>
    </Wrapper>
  );
};

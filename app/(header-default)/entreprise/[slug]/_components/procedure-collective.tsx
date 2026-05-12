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

const getStatutLabel = (statut: string) => {
  switch (statut) {
    case "sauvegarde":
      return "Sauvegarde";
    case "liquidation_judiciaire":
      return "Liquidation judiciaire";
    case "redressement_judiciaire":
      return "Redressement judiciaire";
    default:
      return statut;
  }
};

export const UniteLegaleProcedureCollective = ({
  uniteLegale,
  session,
}: {
  uniteLegale: IUniteLegale;
  session: ISession | null;
}) => {
  const isBodaccProcedureCollectiveDisplayed = useFeatureFlag(
    "bodacc_procedure_collective_displayed"
  );
  if (
    !isBodaccProcedureCollectiveDisplayed.isEnabled ||
    !hasRights(session, ApplicationRights.isAgent) ||
    !uniteLegale.bodacc?.procedureCollective?.statut
  ) {
    return null;
  }

  return (
    <Wrapper>
      <InformationTooltip
        label={
          <ul>
            <li>
              Dernier statut:{" "}
              {getStatutLabel(uniteLegale.bodacc?.procedureCollective?.statut)}
            </li>
            {uniteLegale.bodacc?.procedureCollective?.date && (
              <li>
                Date de dernière mise à jour:{" "}
                {formatDate(uniteLegale.bodacc?.procedureCollective?.date)}
              </li>
            )}
            <li>
              Identifiant: {uniteLegale.bodacc?.procedureCollective?.idAnnonce}
            </li>
          </ul>
        }
        tabIndex={undefined}
      >
        <a
          href={`https://www.bodacc.fr/pages/annonces-commerciales-detail/?q.id=id:${uniteLegale.bodacc?.procedureCollective?.idAnnonce}`}
        >
          <OpenClosedTag
            icon="questionFill"
            label="Procédure collective en cours"
          />
        </a>
      </InformationTooltip>
    </Wrapper>
  );
};

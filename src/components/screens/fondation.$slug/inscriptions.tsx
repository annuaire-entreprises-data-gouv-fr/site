import type React from "react";
import type { PropsWithChildren } from "react";
import { OpenClosedTag } from "#/components-ui/badge/frequent";
import InformationTooltip from "#/components-ui/information-tooltip";
import type { IFondation } from "#/models/core/fondations.types";
import { formatDate } from "#/utils/helpers";
import styles from "../entreprise.$slug/style.module.css";

const Wrapper: React.FC<PropsWithChildren<{ link?: React.JSX.Element }>> = ({
  children,
  link,
}) => (
  <div className={styles["inscriptions-wrapper"]}>
    <div>{children}</div>
    {link && <div className="layout-right">{link}</div>}
  </div>
);

export const FondationInscriptionRNF = ({
  fondation,
}: {
  fondation: IFondation;
}) => (
  <Wrapper>
    <InformationTooltip
      label={"Cette fondation est enregistrée au RNF."}
      tabIndex={undefined}
    >
      <OpenClosedTag icon="open" label="Enregistrée au RNF">
        le {formatDate(fondation.creationDate)}
      </OpenClosedTag>
    </InformationTooltip>
  </Wrapper>
);

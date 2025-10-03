import InformationTooltip from "#components-ui/information-tooltip";
import { Tag } from "#components-ui/tag";
import { Siren } from "#utils/helpers";
import React from "react";

const TagCC = ({ siren, idcc }: { siren: Siren; idcc: string }) => (
  <Tag
    link={{
      href: `/divers/${siren}#idcc-${idcc}`,
      "aria-label": `Consulter la liste de toutes les conventions collectives de la structure, dont l'IDCC ${idcc}`,
    }}
  >
    IDCC {idcc}
  </Tag>
);

export const ConventionCollectivesBadgesSection: React.FC<{
  siren: Siren;
  conventionCollectives: { idcc: string; title: string }[];
}> = ({ siren, conventionCollectives }) =>
  conventionCollectives.length > 0 ? (
    conventionCollectives.map(({ idcc, title }) => (
      <React.Fragment key={idcc}>
        {title ? (
          <InformationTooltip label={title} tabIndex={0}>
            <TagCC siren={siren} idcc={idcc} />
          </InformationTooltip>
        ) : (
          <TagCC siren={siren} idcc={idcc} />
        )}
      </React.Fragment>
    ))
  ) : (
    <i>Non renseignée</i>
  );

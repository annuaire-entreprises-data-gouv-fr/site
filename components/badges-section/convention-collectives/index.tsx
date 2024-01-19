import React from 'react';
import { Tag } from '#components-ui/tag';
import { Siren } from '#utils/helpers';

export const ConventionCollectivesBadgesSection: React.FC<{
  conventionCollectives: string[];
  siren: Siren;
}> = ({ conventionCollectives, siren }) =>
  conventionCollectives.length > 0 ? (
    conventionCollectives.map((idcc) => (
      <React.Fragment key={idcc}>
        {
          <Tag
            link={{
              href: `/divers/${siren}#idcc-${idcc}`,
              'aria-label': `Consulter la liste de toutes les conventions collectives de la structure, dont l'IDCC ${idcc}`,
            }}
          >
            IDCC {idcc}
          </Tag>
        }
      </React.Fragment>
    ))
  ) : (
    <i>Non renseignée</i>
  );

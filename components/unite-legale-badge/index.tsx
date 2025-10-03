import {
  AssociationBadge,
  CollectiviteTerritorialeBadge,
  DefaultStructureBadge,
  EntrepriseIndividuelleBadge,
  ServicePublicBadge,
} from "#components-ui/badge/frequent";
import {
  type IUniteLegale,
  isAssociation,
  isCollectiviteTerritoriale,
  isEntrepreneurIndividuel,
  isServicePublic,
} from "#models/core/types";
import { Fragment } from "react";

const UniteLegaleBadge: React.FC<{
  uniteLegale: IUniteLegale;
  small?: boolean;
  defaultBadgeShouldBeHid?: boolean;
}> = ({ uniteLegale, small = false, defaultBadgeShouldBeHid = false }) => {
  const badges = [];
  if (isAssociation(uniteLegale)) {
    badges.push(<AssociationBadge small={small} />);
  }
  if (isEntrepreneurIndividuel(uniteLegale)) {
    badges.push(<EntrepriseIndividuelleBadge small={small} />);
  }

  if (isServicePublic(uniteLegale)) {
    badges.push(<ServicePublicBadge small={small} />);
  }

  if (isCollectiviteTerritoriale(uniteLegale)) {
    badges.push(<CollectiviteTerritorialeBadge small={small} />);
  }

  if (badges.length > 0) {
    return (
      <>
        {badges.map((badge, i) => (
          <Fragment key={i}>{badge}</Fragment>
        ))}
      </>
    );
  }

  // default
  if (defaultBadgeShouldBeHid) {
    return null;
  }

  return <DefaultStructureBadge small={small} />;
};

export default UniteLegaleBadge;
